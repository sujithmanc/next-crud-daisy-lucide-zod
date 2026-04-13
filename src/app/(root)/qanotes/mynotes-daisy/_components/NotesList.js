import FlipCard from "./FlipCard";

export default function NotesList({ notes = [] }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-3 text-sm">No notes found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-base-content/50 mb-4">
        {notes.length} note{notes.length !== 1 ? "s" : ""} found
        &nbsp;·&nbsp;
        <span className="italic">hover a card to reveal the answer</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {notes.map(note => (
          <FlipCard key={note.noteId} note={note} />
        ))}
      </div>
    </div>
  );
}
