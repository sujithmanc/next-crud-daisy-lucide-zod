"use client";

import { useParams } from "next/navigation";

export default function GameModel() {
    const { id } = useParams(); // Ensure we have access to route parameters if needed
    console.log("Rendering GameModel component...");
    return (
       <h1 className="text-2xl font-bold text-blue-400">INTERCEPTED Game HOME Modal #{id}</h1>
    );
}