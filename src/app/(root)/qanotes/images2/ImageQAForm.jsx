"use client";

import { useState } from "react";
import { submitImageQA, getSubtopicsByTopicId } from "./action";

const EMPTY_ROW = { imageFile: null, imagePreview: null, ans: "" };
const createRows = (n) => Array.from({ length: n }, () => ({ ...EMPTY_ROW }));

export default function ImageQAForm({ topics }) {
  const [rows, setRows]                   = useState(createRows(3));
  const [isPending, setIsPending]         = useState(false);
  const [feedback, setFeedback]           = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [subtopics, setSubtopics]         = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [loadingSubtopics, setLoadingSubtopics] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const handleTopicChange = async (e) => {
    const topicId = e.target.value;
    const topic   = topics.find((t) => String(t.id) === topicId);
    setSelectedTopic(topic?.name ?? "");
    setSubtopics([]);
    setSelectedSubtopic("");
    if (!topicId) return;
    setLoadingSubtopics(true);
    const data = await getSubtopicsByTopicId(parseInt(topicId));
    setSubtopics(data);
    setLoadingSubtopics(false);
  };

  const handleSubtopicChange = (e) => {
    const subtopicId = e.target.value;
    const subtopic   = subtopics.find((s) => String(s.id) === subtopicId);
    setSelectedSubtopic(subtopic?.name ?? "");
  };

  const handlePaste = (e, index) => {
    const item = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"));
    if (!item) return;
    const blob    = item.getAsFile();
    const preview = URL.createObjectURL(blob);
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, imageFile: blob, imagePreview: preview } : r))
    );
  };

  const handleAns = (index, value) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ans: value } : r)));
  };

  const clearRow = (index) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...EMPTY_ROW } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);

  const handleSubmit = async () => {
    const filled = rows.filter((r) => r.imageFile && r.ans.trim());

    if (!selectedTopic) {
      setFeedback({ success: false, message: "Please select a topic." });
      return;
    }
    if (!selectedSubtopic) {
      setFeedback({ success: false, message: "Please select a subtopic." });
      return;
    }
    if (!filled.length) {
      setFeedback({ success: false, message: "Add at least one image + answer pair." });
      return;
    }

    setIsPending(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("topic",    selectedTopic);     // name string ✓
    formData.append("subtopic", selectedSubtopic);  // name string ✓
    formData.append("date",     date);
    formData.append("count",    filled.length);

    filled.forEach((r, i) => {
      formData.append(`image_${i}`, r.imageFile);
      formData.append(`ans_${i}`,   r.ans.trim());
    });

    const result = await submitImageQA(formData);
    setFeedback(result);
    if (result.success) {
      setRows(createRows(3));
      setSelectedTopic("");
      setSelectedSubtopic("");
      setSubtopics([]);
    }
    setIsPending(false);
  };

  const filledCount = rows.filter((r) => r.imageFile && r.ans.trim()).length;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Image Q&A</h1>
        <span className="badge badge-neutral">{filledCount} ready</span>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label"><span className="label-text">Date</span></label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label"><span className="label-text">Topic</span></label>
          <select
            className="select select-bordered w-full"
            defaultValue=""
            onChange={handleTopicChange}
          >
            <option value="" disabled>Select a topic</option>
            {topics?.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">Subtopic</span></label>
          <select
            key={selectedTopic}
            className="select select-bordered w-full"
            defaultValue=""
            onChange={handleSubtopicChange}
            disabled={!selectedTopic || loadingSubtopics || subtopics.length === 0}
          >
            <option value="">
              {!selectedTopic
                ? "Select topic first"
                : loadingSubtopics
                  ? "Loading..."
                  : subtopics.length === 0
                    ? "No subtopics"
                    : "Select a subtopic"}
            </option>
            {subtopics.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {rows.map((row, index) => {
          const result = feedback?.results?.find((r) => r.index === index);
          return (
            <div
              key={index}
              className={`grid grid-cols-2 gap-4 p-4 rounded-box border ${
                result?.status === "ok"
                  ? "border-success bg-success/5"
                  : result?.status === "error"
                  ? "border-error bg-error/5"
                  : "border-base-300 bg-base-100"
              }`}
            >
              {/* Left — paste zone */}
              <div
                onPaste={(e) => handlePaste(e, index)}
                tabIndex={0}
                className="min-h-40 border-2 border-dashed border-base-300 rounded-box flex items-center justify-center outline-none focus:border-primary relative"
              >
                {row.imagePreview ? (
                  <>
                    <img src={row.imagePreview} className="max-h-48 rounded object-contain" />
                    <button
                      onClick={() => clearRow(index)}
                      className="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost"
                    >✕</button>
                  </>
                ) : (
                  <div className="text-center text-base-content/40 text-sm select-none">
                    <p className="text-2xl mb-1">📋</p>
                    <p>Click &amp; paste image</p>
                    <p className="text-xs">Ctrl+V / ⌘V</p>
                  </div>
                )}
              </div>

              {/* Right — answer */}
              <div className="flex flex-col gap-2">
                <label className="label">
                  <span className="label-text font-medium">Answer #{index + 1}</span>
                  {result && (
                    <span className={`label-text-alt ${result.status === "ok" ? "text-success" : "text-error"}`}>
                      {result.status === "ok" ? "✓ Saved" : "✗ Failed"}
                    </span>
                  )}
                </label>
                <textarea
                  rows={6}
                  value={row.ans}
                  onChange={(e) => handleAns(index, e.target.value)}
                  placeholder="Type the answer here..."
                  className="textarea textarea-bordered w-full flex-1 resize-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add row */}
      {rows.length < 10 && (
        <button
          onClick={addRow}
          className="btn btn-ghost btn-sm w-full border border-dashed border-base-300"
        >
          + Add another row ({rows.length}/10)
        </button>
      )}

      {/* Feedback */}
      {feedback?.message && (
        <div className={`alert ${feedback.success ? "alert-success" : "alert-error"}`}>
          {feedback.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <a href="/qanotes" className="btn btn-ghost">Cancel</a>
        <button
          onClick={handleSubmit}
          disabled={isPending || filledCount === 0}
          className={`btn btn-primary ${isPending ? "loading" : ""}`}
        >
          {isPending ? "Uploading..." : `Save ${filledCount} note${filledCount !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}