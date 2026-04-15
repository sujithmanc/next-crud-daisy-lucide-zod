"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import FilterDate from "./FilterDate";
import FilterTopics from "./FilterTopics";
import { UpdateResultsButton } from "./UpdateResultsButton";

export default function FilterBar({
  date = null,
  from = null,
  to = null,
  selectedTopics = [],
  selectedSubtopics = [],
  topicsWithSubtopics = [],
}) {
  const router = useRouter();
  const pathname = usePathname();

  // ── Date state ──────────────────────────────────────────────────────────────
  const [dateMode, setDateMode] = useState(
    from || to ? "range" : date ? "single" : "none"
  );
  const [dateVal, setDateVal] = useState(date ?? "");
  const [dateFrom, setDateFrom] = useState(from ?? "");
  const [dateTo, setDateTo] = useState(to ?? "");

  // ── Checked state ───────────────────────────────────────────────────────────
  // { topicName: Set<subtopicName | "__ALL__"> }
  const [checked, setChecked] = useState(() => {
    const init = {};
    selectedTopics.forEach(t => {
      const topicSubs = topicsWithSubtopics.find(x => x.topic === t)?.subtopics ?? [];
      const partialSubs = selectedSubtopics.filter(s =>
        topicSubs.includes(s)
      );
      init[t] = partialSubs.length
        ? new Set(partialSubs)
        : new Set(["__ALL__"]);
    });
    return init;
  });

  // ── Topic toggle (select all / deselect all) ────────────────────────────────
  function handleTopicToggle(topic, subtopics) {
    setChecked(prev => {
      const next = { ...prev };
      if (next[topic]) {
        delete next[topic];
      } else {
        next[topic] = new Set(["__ALL__"]);
      }
      return next;
    });
  }

  // ── Subtopic toggle ─────────────────────────────────────────────────────────
  function handleSubtopicToggle(topic, subtopic, allSubtopics) {
    setChecked(prev => {
      const next = { ...prev };
      const current = new Set(next[topic] ?? []);
      current.delete("__ALL__");

      if (current.has(subtopic)) {
        current.delete(subtopic);
        if (current.size === 0) delete next[topic];
        else next[topic] = current;
      } else {
        current.add(subtopic);
        // all subtopics now checked → collapse to ALL (avoid redundancy)
        if (current.size === allSubtopics.length) {
          next[topic] = new Set(["__ALL__"]);
        } else {
          next[topic] = current;
        }
      }
      return next;
    });
  }

  // ── Apply → build URL params and navigate ───────────────────────────────────
  function apply() {
    const params = new URLSearchParams();

    if (dateMode === "single" && dateVal) params.set("date", dateVal);
    if (dateMode === "range") {
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
    }

    Object.entries(checked).forEach(([topic, subs]) => {
      params.append("topic", topic);
      // ALL selected → skip subtopics (topic filter is sufficient)
      if (!subs.has("__ALL__")) {
        subs.forEach(s => params.append("subtopic", s));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }

  // ── Clear all ───────────────────────────────────────────────────────────────
  function clear() {
    setDateMode("none");
    setDateVal("");
    setDateFrom("");
    setDateTo("");
    setChecked({});
    router.push(pathname);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Sticky Action Header */}
      <div className="sticky top-0 z-20 bg-base-100/80 backdrop-blur-md pt-1 pb-4 space-y-2 border-b border-base-content/5">
        <button
          onClick={apply}
          className="btn btn-neutral btn-block rounded-2xl font-bold text-[13px] shadow-lg shadow-neutral/10 hover:btn-primary border-none transition-all duration-300 active:scale-[0.98]"
        >
          <span className="relative flex items-center justify-center gap-2">
            Apply Filters
          </span>
        </button>

        <button
          onClick={clear}
          className="btn btn-ghost btn-xs btn-block text-base-content/50 hover:text-base-content font-bold uppercase tracking-wider transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {/* Filter Sections */}
      <div className="flex-grow space-y-12 py-8">
        <FilterDate
          dateMode={dateMode}
          dateVal={dateVal}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onModeChange={setDateMode}
          onDateChange={setDateVal}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />

        <FilterTopics
          topicsWithSubtopics={topicsWithSubtopics}
          checked={checked}
          onTopicToggle={handleTopicToggle}
          onSubtopicToggle={handleSubtopicToggle}
        />
      </div>

      {/* Sticky Footer Action - logic preserved */}
      <div className="sticky bottom-0 bg-base-100 pt-4">
        <UpdateResultsButton onClick={apply} />
      </div>
    </div>
  );
}
