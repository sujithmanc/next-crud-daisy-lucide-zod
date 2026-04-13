import { notesView } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import db from "@/drizzle";
import { getFormattedDate } from "./util";
import { getSubtopicMetrics, getTopicMetrics } from "./noteService";
import Metrics from "./Metrics";

export default async function NotesList({ date, topic, subtopic }) {
    const conditions = [];

    if (date) conditions.push(eq(notesView.noteDate, date));
    if (topic) conditions.push(eq(notesView.topicName, topic));
    if (subtopic) conditions.push(eq(notesView.subtopicName, subtopic));

    const notes = await db
        .select()
        .from(notesView)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(notesView.noteId);

    if (notes.length === 0) {
        return <div className="text-center text-gray-500 mt-10">No notes found.</div>;
    }

    

    return (
        <div className="overflow-x-auto">
            <h1>Notes ({notes.length})</h1>
            <Metrics date={date} topic={topic} subtopic={subtopic} />
            <table className="table table-zebra w-full text-sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Topic</th>
                        <th>Subtopic</th>
                        <th>Question</th>
                        <th>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((note, i) => (
                        <tr key={note.noteId}>
                            <td className="text-gray-400">{i + 1}</td>
                            <td className="whitespace-nowrap">{getFormattedDate(note.noteDate)}</td>
                            <td className="whitespace-nowrap">{note.topicName}</td>
                            <td className="whitespace-nowrap">{note.subtopicName ?? "—"}</td>
                            <td>{note.que}</td>
                            <td>{note.ans}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}