import Link from "next/link";
import { getNotes, getTopicsWithSubtopics } from "./_services/noteService";
import { parseSearchParams } from "./_lib/utils";
import FilterBar from "./_components/FilterBar";
import NotesList from "./_components/NotesList";
import { Plus, ArrowLeft } from "lucide-react";
import CardGrid from "../components/CardGrid";

export default async function MyNotesPage({ searchParams }) {
  const values = await searchParams;

  const { date, from, to, selectedTopics, selectedSubtopics } =
    parseSearchParams(values);

  const topicsWithSubtopics = await getTopicsWithSubtopics(date);

  const notes = await getNotes({
    date,
    topics: selectedTopics,
    subtopics: selectedSubtopics,
  });

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar (FilterBar) ─────────────────────────────────────────── */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto hidden md:block">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-6 py-8">
            {/* <div className="flex items-center justify-between mb-10">
              <Link 
                href="/quotes" 
                className="group flex items-center justify-center w-9 h-9 rounded-full border  hover:shadow-sm transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Filters</h2>
            </div> */}

            <FilterBar
              date={date}
              from={from}
              to={to}
              selectedTopics={selectedTopics}
              selectedSubtopics={selectedSubtopics}
              topicsWithSubtopics={topicsWithSubtopics}
            />
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-grow">
        <div className="mx-auto px-6 py-10 md:px-12">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              {/* <div className="flex items-center gap-3">
                <div className="w-1.5 h-8  rounded-full" />
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  My Notes
                </h1>
              </div> */}
              <p className="text-gray-500 font-medium">
                Organizing {notes.length} thoughts and inspirations.
              </p>
              
            </div>
            
            <Link 
              href="/quotes/create" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-sm hover:bg-blue-600 shadow-xl shadow-gray-200 hover:shadow-blue-100 transition-all duration-300 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Entry
            </Link>
          </header>

          {/* List Container */}
          <section className="relative group">
              {/* <NotesList notes={notes} /> */}
              <CardGrid notes={notes} />
          </section>

        </div>
      </main>
    </div>
  );
}