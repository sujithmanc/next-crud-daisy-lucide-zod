import db from "@/drizzle";
import FlipCard from "./FlipCard";
import { qaNotes } from "@/drizzle/schema";

export default async function CardGrid({ notes }) {

  return (
    <div
      className="grid gap-6 justify-center"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
      }}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          className="w-80 h-56 cursor-pointer select-none rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg font-semibold"
        >
          <FlipCard question={note.que} answer={note.ans} />
        </div>
      ))}
    </div>
  );
}