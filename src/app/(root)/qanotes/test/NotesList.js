// components/NotesList.js
import { notesView } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import db from "@/drizzle";

const getFormattedDate = (date) => {
    return date.toLocaleDateString("en-GB", {
        month: "short",
        day: "2-digit"
    }).replace(/ /g, "-")
}

export default async function NotesList({ date, selected = [] }) {
    const conditions = [eq(notesView.noteDate, date)];

    if (selected.length) {
        conditions.push(inArray(notesView.topicName, selected));
    }

    const notes = await db
        .select()
        .from(notesView)
        .where(and(...conditions))
        .orderBy(notesView.noteId);

    if (notes.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10">
                No notes found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
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