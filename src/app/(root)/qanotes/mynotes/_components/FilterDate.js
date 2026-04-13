"use client";

export default function FilterDate({ 
  dateMode, 
  dateVal, 
  dateFrom, 
  dateTo,
  onModeChange, 
  onDateChange, 
  onFromChange, 
  onToChange 
}) {

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">
        Date Range
      </div>

      {/* Segmented Control Mode Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-xl">
        {["none", "single", "range"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              dateMode === m
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "none" ? "All" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Input Areas */}
      <div className="min-h-[40px] animate-in fade-in slide-in-from-top-1 duration-300">
        {dateMode === "single" && (
          <input
            type="date"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
            value={dateVal}
            onChange={(e) => onDateChange(e.target.value)}
          />
        )}

        {dateMode === "range" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 ml-1 uppercase">From</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                value={dateFrom}
                onChange={(e) => onFromChange(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-400 ml-1 uppercase">To</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
                value={dateTo}
                onChange={(e) => onToChange(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {dateMode === "none" && (
          <div className="text-xs text-gray-400 italic px-1 pt-1">
            Showing all dates
          </div>
        )}
      </div>
    </div>
  );
}