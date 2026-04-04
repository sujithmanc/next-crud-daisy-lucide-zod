"use client";

import { useActionState, useState } from "react";
import { createNotes } from "../action";
import { getSubtopicsByTopicId } from "../action";

const initialState = {
    success: false,
    message: "",
};

export default function CreateNotesForm({ topics }) {
    const [state, formAction, isPending] = useActionState(createNotes, initialState);
    const [selectedTopicName, setSelectedTopicName] = useState("");
    const [subtopics, setSubtopics] = useState([]);
    const [loadingSubtopics, setLoadingSubtopics] = useState(false);
    const today = new Date().toISOString().split("T")[0];

    const handleTopicChange = async (e) => {
        const topicName = e.target.value;
        setSelectedTopicName(topicName);

        const topic = topics.find(t => t.name === topicName);
        const topicId = topic?.id || "";
        setSelectedTopicName(topic?.name || "");
        setSubtopics([]);

        if (!topicId) return;

        setLoadingSubtopics(true);
        const data = await getSubtopicsByTopicId(parseInt(topicId));
        setSubtopics(data);
        setLoadingSubtopics(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create QA Notes</h1>

            <form action={formAction} className="space-y-4">

                {/* Date */}
                <div>
                    <label className="label">
                        <span className="label-text">Date</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        defaultValue={today}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Topic + Subtopic */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Topic</span>
                        </label>
                        <select
                            name="topic"
                            className="select select-bordered w-full"
                            required
                            value={selectedTopicName}
                            onChange={(e) => handleTopicChange(e)}
                        >
                            <option value="" disabled>Select a topic</option>
                            {topics?.map(topic => (
                                <option key={topic.id} value={topic.name}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Subtopic</span>
                        </label>
                        <select
                            name="subtopic"
                            key={selectedTopicName}
                            className="select select-bordered w-full"
                            disabled={!selectedTopicName || loadingSubtopics || subtopics.length === 0}
                            defaultValue=""
                        >
                            <option value="">
                                {!selectedTopicName
                                    ? "Select a topic first"
                                    : loadingSubtopics
                                        ? "Loading..."
                                        : subtopics.length === 0
                                            ? "No subtopics available"
                                            : "Select a subtopic (optional)"}
                            </option>
                            {subtopics.map(sub => (
                                <option key={sub.id} value={sub.name}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Textarea */}
                <div>
                    <label className="label">
                        <span className="label-text">Notes</span>
                    </label>
                    <textarea
                        name="content"
                        rows={12}
                        placeholder={`Q: What did I learn today?
A: ...

Q: What mistake did I make?
A: ...`}
                        className="textarea textarea-bordered w-full font-mono"
                        required
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <a href="/qanotes" className="btn btn-ghost">
                        Cancel
                    </a>
                    <button
                        type="submit"
                        className={`btn btn-primary ${isPending ? "loading" : ""}`}
                    >
                        {isPending ? "Saving..." : "Save Notes"}
                    </button>
                </div>

                {/* Feedback */}
                {state?.message && (
                    <div className={`alert ${state.success ? "alert-success" : "alert-error"}`}>
                        {state.message}
                    </div>
                )}
            </form>
        </div>
    );
}