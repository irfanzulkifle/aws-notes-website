"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    ? "\u2318"
    : "Ctrl";
}

function getServerSnapshot() {
  return "Ctrl";
}

export default function SearchTrigger() {
  const modifier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      id="global-search-trigger"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700 cursor-pointer"
      aria-label={`Search notes (${modifier}+/)`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden sm:inline text-xs">Search</span>
      <kbd className="hidden sm:inline-flex text-[9px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono">
        {modifier}+/
      </kbd>
    </button>
  );
}