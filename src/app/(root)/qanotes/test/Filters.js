"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Filters({ date, topic, subtopic, topicsWithSubtopics = [] }) {
    const router = useRouter();
    const pathname = usePathname();

    const [dateVal, setDateVal] = useState(date ?? "");
    const [topicVal, setTopicVal] = useState(topic ?? "");
    const [subtopicVal, setSubtopicVal] = useState(subtopic ?? "");

    const subtopics = topicsWithSubtopics
        .find(t => t.topic === topicVal)?.subtopics ?? [];

    function apply() {
        const params = new URLSearchParams();
        if (dateVal) params.set("date", dateVal);
        if (topicVal) params.set("topic", topicVal);
        if (subtopicVal) params.set("subtopic", subtopicVal);
        router.push(`${pathname}?${params.toString()}`);
    }

    function clear() {
        setDateVal(""); setTopicVal(""); setSubtopicVal("");
        router.push(pathname);
    }

    return (
        <div className="flex flex-wrap gap-3 items-end mb-6">
            <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">Date</span></label>
                <input type="date" className="input input-bordered input-sm"
                    value={dateVal} onChange={e => setDateVal(e.target.value)} />
            </div>

            <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">Topic</span></label>
                <select className="select select-bordered select-sm"
                    value={topicVal}
                    onChange={e => { setTopicVal(e.target.value); setSubtopicVal(""); }}>
                    <option value="">All topics</option>
                    {topicsWithSubtopics.map(t => (
                        <option key={t.topic} value={t.topic}>{t.topic}</option>
                    ))}
                </select>
            </div>

            <div className="form-control">
                <label className="label py-0"><span className="label-text text-xs">Subtopic</span></label>
                <select className="select select-bordered select-sm"
                    value={subtopicVal}
                    onChange={e => setSubtopicVal(e.target.value)}
                    disabled={!topicVal}>
                    <option value="">All subtopics</option>
                    {subtopics.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <button className="btn btn-primary btn-sm" onClick={apply}>Apply</button>
            <button className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>
        </div>
    );
}