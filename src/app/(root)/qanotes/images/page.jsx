"use client";

import { useState, useRef } from "react";
import { uploadImage } from "./action";

export default function ImagePaste() {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const handlePaste = (e) => {
        const item = [...e.clipboardData.items].find(i => i.type.startsWith("image/"));
        if (!item) return;

        const blob = item.getAsFile();
        setFile(blob);
        setPreview(URL.createObjectURL(blob));
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const result = await uploadImage(formData);
        console.log(result); // { success: true, path: '/uploads/abc123.png' }
    };

    return (
        <div
            onPaste={handlePaste}
            tabIndex={0}
            className="border-2 border-dashed border-base-300 rounded-box p-8 text-center outline-none focus:border-primary"
        >
            {preview ? (
                <div className="flex flex-col gap-4 items-center">
                    <img src={preview} className="max-h-64 rounded-box" />
                    <button onClick={handleUpload} className="btn btn-primary btn-sm">
                        Upload
                    </button>
                </div>
            ) : (
                <p className="text-base-content/50">Click here and paste an image (Ctrl+V)</p>
            )}
        </div>
    );
}