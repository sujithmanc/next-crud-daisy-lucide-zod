"use server";

import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import db from "@/drizzle";
import { qaNotes, subtopics } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getSubtopicsByTopicId(topicId) {
  return await db
    .select({ id: subtopics.id, name: subtopics.name })
    .from(subtopics)
    .where(eq(subtopics.topicId, topicId))
    .orderBy(subtopics.name);
}

export async function submitImageQA(formData) {
  try {
    const topic     = formData.get("topic");
    const subtopic  = formData.get("subtopic");
    const date      = formData.get("date");
    const count     = parseInt(formData.get("count"));

    if (!topic || !subtopic || !date) {
      return { success: false, message: "Date, topic, and subtopic are required." };
    }

    const results = [];
    const values  = [];

    for (let i = 0; i < count; i++) {
      const file = formData.get(`image_${i}`);
      const ans  = formData.get(`ans_${i}`);

      try {
        const bytes  = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext    = file.type.split("/")[1];

        const slugFromAns = ans.trim()
                              .replace(/[^a-z0-9]/gi, "_")
                              .toLowerCase()
                              .slice(0, 40);
        const filename = `${slugFromAns}_${randomUUID()}.${ext}`;
        const filepath = join(process.cwd(), "public", "uploads", filename);

        await writeFile(filepath, buffer);

        values.push({
          que:      `/uploads/${filename}`,
          ans,
          topic,
          subtopic,
          date,
        });

        results.push({ index: i, status: "ok", path: `/uploads/${filename}` });
      } catch (err) {
        console.error(`Row ${i} failed:`, err);
        results.push({ index: i, status: "error", message: err.message });
      }
    }

    if (values.length) {
      await db.insert(qaNotes).values(values);
    }

    const saved  = results.filter((r) => r.status === "ok").length;
    const failed = results.filter((r) => r.status === "error").length;

    return {
      success: saved > 0,
      topic,
      subtopic,
      message: `Saved ${saved} notes${failed > 0 ? `, ${failed} failed` : ""}`,
      results,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
}