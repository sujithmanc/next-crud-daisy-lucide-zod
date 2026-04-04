"use server";

import { qaNotes, subtopics } from "@/drizzle/schema";
import { parseQA } from "./parser";
import db from "@/drizzle";
import { eq } from "drizzle-orm";

export async function createNotes(prevState, formData) {
    try {
        // Print form data for debugging
        console.info("Received form data:", Object.fromEntries(formData.entries()));

        const date = formData.get("date");
        const content = formData.get("content");
        const topic = formData.get("topic");
        const subtopic = formData.get("subtopic");
        console.info("Received data:", { date, topic, subtopic, content });
        if (!date || !content || !topic || !subtopic) {
            return {
                success: false,
                message: "Date, content, topic, and subtopic are required",
            };
        }
        // Parse textarea → [{ que, ans }]
        const parsed = parseQA(content);

        if (!parsed.length) {
            return {
                topic,
                subtopic,
                success: false,
                message: "No valid Q&A found",
            };
        }

        // Prepare for DB insert
        const values = parsed.map((item) => ({
            que: item.que,
            ans: item.ans,
            topic,
            subtopic,
            date,
        }));

        // Bulk insert
        await db.insert(qaNotes).values(values);

        return {
            success: true,
            topic,
            subtopic,
            message: `Saved ${values.length} notes`,
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Something went wrong",
        };
    }
}

export async function getSubtopicsByTopicId(topicId) {
    return await db
        .select({ id: subtopics.id, name: subtopics.name })
        .from(subtopics)
        .where(eq(subtopics.topicId, topicId))
        .orderBy(subtopics.name);
}