"use client";

import { formatDate } from "../_lib/utils";

export default function FlipCard({ note }) {
  return (
    <div className="group" style={{ perspective: "1000px", height: "220px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "rotateY(180deg)"}
        onMouseLeave={e => e.currentTarget.style.transform = "rotateY(0deg)"}>

        {/* Front — Question */}
        <div
          className="absolute inset-0 rounded-2xl border border-base-300 bg-base-100 p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}>
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="badge badge-primary badge-sm">{note.topicName}</span>
            {note.subtopicName && (
              <span className="badge badge-secondary badge-sm">{note.subtopicName}</span>
            )}
          </div>
          <p className="text-sm font-semibold leading-snug flex-1 flex items-center">
            {note.que}
          </p>
          <p className="text-xs text-base-content/40 mt-2">{formatDate(note.noteDate)}</p>
        </div>

        {/* Back — Answer */}
        <div
          className="absolute inset-0 rounded-2xl border border-primary bg-primary/5 p-4 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-2">
            Answer
          </p>
          <p className="text-sm leading-relaxed flex-1 flex items-center">
            {note.ans}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="badge badge-outline badge-sm">{note.topicName}</span>
            {note.subtopicName && (
              <span className="badge badge-outline badge-sm">{note.subtopicName}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
