"use client";

export default function FilterDate({
  dateMode, dateVal, dateFrom, dateTo,
  onModeChange, onDateChange, onFromChange, onToChange,
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">
        Date
      </p>

      {/* Mode toggle */}
      <div className="join w-full mb-3">
        {["none", "single", "range"].map(m => (
          <button
            key={m}
            type="button"
            className={`join-item btn btn-sm flex-1 ${dateMode === m ? "btn-primary" : "btn-ghost border border-base-300"}`}
            onClick={() => onModeChange(m)}>
            {m === "none" ? "No date" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {dateMode === "single" && (
        <input
          type="date"
          className="input input-bordered input-sm w-full"
          value={dateVal}
          onChange={e => onDateChange(e.target.value)}
        />
      )}

      {dateMode === "range" && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="label py-0">
              <span className="label-text text-xs">From</span>
            </label>
            <input type="date" className="input input-bordered input-sm w-full"
              value={dateFrom} onChange={e => onFromChange(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="label py-0">
              <span className="label-text text-xs">To</span>
            </label>
            <input type="date" className="input input-bordered input-sm w-full"
              value={dateTo} onChange={e => onToChange(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
