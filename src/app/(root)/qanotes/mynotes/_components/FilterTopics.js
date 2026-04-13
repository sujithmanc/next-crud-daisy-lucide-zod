"use client";

import { slugify } from "../_lib/utils";
import { ChevronDown } from "lucide-react"; // Assuming lucide-react is available

export default function FilterTopics({ topicsWithSubtopics = [], checked, onTopicToggle, onSubtopicToggle }) {

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
      <p className="text-sm text-gray-400 italic py-4">
        No topics available.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
          Topics & Subtopics
        </h3>
        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {topicsWithSubtopics.length} Total
        </span>
      </div>

      <div className="space-y-2">
        {topicsWithSubtopics.map(({ topic, subtopics }) => (
          <details key={topic} className="group border border-gray-100 rounded-xl bg-white transition-all duration-200 hover:border-blue-100 hover:shadow-sm">
            <summary className="list-none cursor-pointer p-3 outline-none">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
                    checked={isTopicChecked(topic)}
                    ref={el => { if (el) el.indeterminate = isTopicIndeterminate(topic, subtopics); }}
                    onChange={() => onTopicToggle(topic, subtopics)}
                    onClick={(e) => subtopics.length > 0 && e.stopPropagation()}
                  />
                  <span className="text-sm font-medium text-gray-700 select-none">
                    {topic}
                  </span>
                </div>



                {
                  subtopics.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-gray-400">
                        {subtopics.length}
                      </span>
                      <ChevronDown
                        className="w-4 h-4 text-gray-400 group-open:-rotate-180 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                  )
                }


              </div>
            </summary>

            <div className="px-3 pb-3 pt-1 space-y-1">
              <div className="h-px bg-gray-50 mb-2 w-full" />
              {subtopics.map(sub => (
                <label
                  key={sub}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`sub-${slugify(topic)}-${slugify(sub)}`}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 cursor-pointer"
                    checked={isSubtopicChecked(topic, sub)}
                    onChange={() => onSubtopicToggle(topic, sub, subtopics)}
                  />
                  <span className="text-xs text-gray-600">
                    {sub + "Hey"}
                  </span>
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}