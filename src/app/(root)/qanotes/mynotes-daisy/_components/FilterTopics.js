"use client";

import { slugify } from "../_lib/utils";

export default function FilterTopics({
  topicsWithSubtopics = [],
  checked,
  onTopicToggle,
  onSubtopicToggle,
}) {
  function isTopicChecked(topic) {
    return !!checked[topic];
  }

  function isTopicIndeterminate(topic, subtopics) {
    if (!checked[topic]) return false;
    if (checked[topic].has("__ALL__")) return false;
    return checked[topic].size < subtopics.length;
  }

  function isSubtopicChecked(topic, subtopic) {
    if (!checked[topic]) return false;
    if (checked[topic].has("__ALL__")) return true;
    return checked[topic].has(subtopic);
  }

  if (topicsWithSubtopics.length === 0) {
    return (
      <p className="text-sm text-base-content/50">No topics available.</p>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">
        Topic &amp; Subtopic
      </p>

      <div className="flex flex-col gap-1">
        {topicsWithSubtopics.map(({ topic, subtopics }) => (
          <div key={topic} className="collapse collapse-arrow border border-base-300 rounded-lg bg-base-100">
            <input type="checkbox" className="peer" />

            {/* Topic header */}
            <div className="collapse-title py-2 px-3 min-h-0 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={isTopicChecked(topic)}
                ref={el => { if (el) el.indeterminate = isTopicIndeterminate(topic, subtopics); }}
                onChange={() => onTopicToggle(topic, subtopics)}
                onClick={e => e.stopPropagation()}
              />
              <span className="flex-1">{topic}</span>
              <span className="badge badge-ghost badge-sm">{subtopics.length}</span>
            </div>

            {/* Subtopics */}
            <div className="collapse-content px-3 pb-2">
              <div className="flex flex-col gap-1 pt-1">
                {subtopics.map(sub => (
                  <label
                    key={sub}
                    className="flex items-center gap-2 cursor-pointer text-sm py-1 border-b border-base-200 last:border-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-secondary"
                      checked={isSubtopicChecked(topic, sub)}
                      onChange={() => onSubtopicToggle(topic, sub, subtopics)}
                    />
                    <span>{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
