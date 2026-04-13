"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import FilterDate from "./FilterDate";
import FilterTopics from "./FilterTopics";

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
    <div className="flex flex-col h-full space-y-8">
      {/* Action Header */}
      <div className="flex flex-col gap-2 p-1">
        <button
          onClick={apply}
          className="group relative w-full py-3 bg-gray-900 overflow-hidden text-white rounded-2xl font-bold text-[13px] transition-all duration-300 shadow-xl shadow-blue-900/10 hover:shadow-blue-500/20 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center justify-center gap-2">
            Apply Filters
          </span>
        </button>

        <button
          onClick={clear}
          className="w-full py-2 text-gray-400 hover:text-gray-600 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          Reset to Default
        </button>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* Filter Sections */}
      <div className="space-y-12">
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

      {/* Sticky Footer Action */}
      <div className="sticky bottom-0 mt-auto pt-10 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent">
        <button
          onClick={apply}
          className="w-full py-3 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-2xl font-bold text-[13px] transition-all duration-200 shadow-sm"
        >
          Update Results
        </button>
      </div>
    </div>
  );
}
