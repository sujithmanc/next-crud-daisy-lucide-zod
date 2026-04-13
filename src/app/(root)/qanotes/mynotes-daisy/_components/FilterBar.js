"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import FilterDate   from "./FilterDate";
import FilterTopics from "./FilterTopics";

export default function FilterBar({
  date                = null,
  from                = null,
  to                  = null,
  selectedTopics      = [],
  selectedSubtopics   = [],
  topicsWithSubtopics = [],
}) {
  const router   = useRouter();
  const pathname = usePathname();

  // ── Date state ───────────────────────────────────────────────────────────────
  const [dateMode, setDateMode] = useState(
    from || to ? "range" : date ? "single" : "none"
  );
  const [dateVal,  setDateVal]  = useState(date ?? "");
  const [dateFrom, setDateFrom] = useState(from ?? "");
  const [dateTo,   setDateTo]   = useState(to   ?? "");

  // ── Checked state ────────────────────────────────────────────────────────────
  const [checked, setChecked] = useState(() => {
    const init = {};
    selectedTopics.forEach(t => {
      const topicSubs  = topicsWithSubtopics.find(x => x.topic === t)?.subtopics ?? [];
      const partialSubs = selectedSubtopics.filter(s => topicSubs.includes(s));
      init[t] = partialSubs.length
        ? new Set(partialSubs)
        : new Set(["__ALL__"]);
    });
    return init;
  });

  // ── Topic toggle ─────────────────────────────────────────────────────────────
  function handleTopicToggle(topic) {
    setChecked(prev => {
      const next = { ...prev };
      if (next[topic]) delete next[topic];
      else next[topic] = new Set(["__ALL__"]);
      return next;
    });
  }

  // ── Subtopic toggle ──────────────────────────────────────────────────────────
  function handleSubtopicToggle(topic, subtopic, allSubtopics) {
    setChecked(prev => {
      const next    = { ...prev };
      const current = new Set(next[topic] ?? []);
      current.delete("__ALL__");

      if (current.has(subtopic)) {
        current.delete(subtopic);
        if (current.size === 0) delete next[topic];
        else next[topic] = current;
      } else {
        current.add(subtopic);
        if (current.size === allSubtopics.length) next[topic] = new Set(["__ALL__"]);
        else next[topic] = current;
      }
      return next;
    });
  }

  // ── Apply ────────────────────────────────────────────────────────────────────
  function apply() {
    const params = new URLSearchParams();

    if (dateMode === "single" && dateVal) params.set("date", dateVal);
    if (dateMode === "range") {
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo)   params.set("to",   dateTo);
    }

    Object.entries(checked).forEach(([topic, subs]) => {
      params.append("topic", topic);
      if (!subs.has("__ALL__")) subs.forEach(s => params.append("subtopic", s));
    });

    router.push(`${pathname}?${params.toString()}`);
  }

  // ── Clear ────────────────────────────────────────────────────────────────────
  function clear() {
    setDateMode("none");
    setDateVal(""); setDateFrom(""); setDateTo("");
    setChecked({});
    router.push(pathname);
  }

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex flex-col gap-2 mt-auto pt-4">
        <button className="btn btn-primary btn-sm w-full" onClick={apply}>
          Apply filters
        </button>
        <button className="btn btn-ghost btn-sm w-full" onClick={clear}>
          Clear all
        </button>
      </div>
    </div>
  );
}
