import { formatDate } from "../_lib/utils";

export default function NotesList({ notes = [] }) {
  if (notes.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ opacity: .3 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-2 mb-0" style={{ fontSize: 14 }}>No notes found.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted mb-2" style={{ fontSize: 13 }}>
        {notes.length} note{notes.length !== 1 ? "s" : ""} found
      </p>

      <div className="table-responsive">
        <table className="table table-hover table-bordered bg-white align-middle"
          style={{ fontSize: 14 }}>
          <thead className="table-light">
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th style={{ width: 120 }}>Date</th>
              <th style={{ width: 130 }}>Topic</th>
              <th style={{ width: 150 }}>Subtopic</th>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, i) => (
              <tr key={note.noteId}>
                <td className="text-muted">{i + 1}</td>
                <td className="text-nowrap">{formatDate(note.noteDate)}</td>
                <td>
                  <span className="badge"
                    style={{ background: "#eff6ff", color: "#1d4ed8", fontWeight: 600, fontSize: 12 }}>
                    {note.topicName}
                  </span>
                </td>
                <td>
                  {note.subtopicName
                    ? <span className="badge"
                        style={{ background: "#f0fdf4", color: "#15803d", fontWeight: 600, fontSize: 12 }}>
                        {note.subtopicName}
                      </span>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>{note.que}</td>
                <td className="text-muted">{note.ans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
