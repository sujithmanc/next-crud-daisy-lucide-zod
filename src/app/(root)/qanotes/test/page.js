

import Filters from "./Filters";
import { getTopicsWithSubtopics } from "./noteService";
import NotesList from "./NotesList";

export default async function NotesPage({ searchParams }) {
  const values = await searchParams;
  const date = values?.date ?? null;
  const topic = values?.topic ?? null;
  const subtopic = values?.subtopic ?? null;

  const topicsWithSubtopics = await getTopicsWithSubtopics();

  return (
    <div className="mx-auto p-4">
      <Filters
        date={date}
        topic={topic}
        subtopic={subtopic}
        topicsWithSubtopics={topicsWithSubtopics}
      />
      <NotesList date={date} topic={topic} subtopic={subtopic} />
    </div>
  );
}