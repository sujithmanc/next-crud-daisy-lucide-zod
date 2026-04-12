import Link from "next/link";
import { notesView } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import db from "@/drizzle";
import CardGrid from "../components/CardGrid";
import Filters from "../cards/Filters";

export default async function DatePage({ params, searchParams }) {
  const { date } = await params;
  const values = await searchParams;
  const selected = values?.filter
    ? values.filter.split(",").filter(Boolean)
    : [];

  const conditions = [eq(notesView.noteDate, date)];

  if (selected.length) {
    conditions.push(inArray(notesView.topicName, selected));
  }

  const notes = await db
    .select()
    .from(notesView)
    .where(and(...conditions))
    .orderBy(notesView.noteId);

  const result = await db
    .selectDistinct({ topic: notesView.topicName })
    .from(notesView)
    .where(eq(notesView.noteDate, date));

  const options = result.map((r) => r.topic);

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link href="/qanotes" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold mt-2">{date}</h1>
          <Filters selected={selected} options={options} />
        </div>
        <Link href="/qanotes/create" className="btn btn-primary btn-sm">
          + Add More
        </Link>
      </div>

      {notes.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No notes for this date.
        </div>
      )}

      {notes.length > 0 && <CardGrid notes={notes} />}
    </div>
  );
}