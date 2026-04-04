"use server";

import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function uploadImage(formData) {
    const file = formData.get("image");

    if (!file || !file.size) {
        return { success: false, message: "No image received." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type.split("/")[1]; // png, jpeg, webp
    const filename = `${randomUUID()}.${ext}`;
    const path = join(process.cwd(), "public", "uploads", filename);

    await writeFile(path, buffer);

    return { success: true, path: `/uploads/${filename}` };
}