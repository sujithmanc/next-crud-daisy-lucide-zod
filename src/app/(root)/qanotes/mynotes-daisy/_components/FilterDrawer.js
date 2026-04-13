"use client";

import { useState } from "react";

export default function FilterDrawer({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="drawer lg:hidden">
      <input
        id="filter-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={() => setOpen(o => !o)}
      />

      {/* Trigger button — shown only on mobile */}
      <div className="drawer-content">
        <label
          htmlFor="filter-drawer"
          className="btn btn-outline btn-sm gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
        </label>
      </div>

      {/* Drawer sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="filter-drawer" className="drawer-overlay" />
        <div className="bg-base-100 w-72 min-h-full p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-base">Filters</span>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
