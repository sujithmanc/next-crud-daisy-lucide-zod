import Link from "next/link";
import { getNotes, getTopicsWithSubtopics } from "./_services/noteService";
import { parseSearchParams } from "./_lib/utils";
import FilterBar    from "./_components/FilterBar";
import FilterDrawer from "./_components/FilterDrawer";
import NotesList    from "./_components/NotesList";

export default async function MyNotesPage({ searchParams }) {
  const values = await searchParams;

  // ── Parse searchParams ───────────────────────────────────────────────────────
  const { date, from, to, selectedTopics, selectedSubtopics } =
    parseSearchParams(values);

  // ── Server fetches ───────────────────────────────────────────────────────────
  const topicsWithSubtopics = await getTopicsWithSubtopics(date);

  const notes = await getNotes({
    date,
    topics:    selectedTopics,
    subtopics: selectedSubtopics,
  });

  const filterBarProps = {
    date, from, to, selectedTopics, selectedSubtopics, topicsWithSubtopics,
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4">
        <div className="flex-1 gap-3">
          <Link href="/quotes" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
          <span className="font-bold text-lg">My Notes</span>
        </div>
        <div className="flex-none">
          <Link href="/quotes/create" className="btn btn-primary btn-sm">
            + Add note
          </Link>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">

        {/* ── Desktop sidebar (lg+) ────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-72 bg-base-100 border-r border-base-300 p-4 shrink-0">
          <p className="font-bold text-base mb-4">Filters</p>
          <FilterBar {...filterBarProps} />
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">

          {/* Mobile drawer trigger + panel */}
          <FilterDrawer>
            <FilterBar {...filterBarProps} />
          </FilterDrawer>

          <NotesList notes={notes} />
        </main>

      </div>
    </div>
  );
}
