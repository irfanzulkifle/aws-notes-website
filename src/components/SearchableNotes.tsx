"use client";

import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Note {
  week: string;
  slug: string;
  title: string;
  date: string;
  day: string;
  topics: string[];
  readingTime: number;
  body: string;
}

interface Props {
  notes: Note[];
  weeks: string[];
  weekLabels: Record<string, string>;
}

export default function SearchableNotes({ notes, weeks, weekLabels }: Props) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState(urlQuery);
  const [allExpanded, setAllExpanded] = useState(false);
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const notesByWeek = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const note of notes) {
      const existing = map.get(note.week) || [];
      existing.push(note);
      map.set(note.week, existing);
    }
    return map;
  }, [notes]);

  const filteredWeeks = useMemo(() => {
    if (!query.trim()) return weeks;
    const q = query.toLowerCase();
    return weeks.filter((week) => {
      const weekNotes = notesByWeek.get(week) || [];
      return weekNotes.some(
        (note) =>
          note.title.toLowerCase().includes(q) ||
          note.topics.some((t) => t.toLowerCase().includes(q)) ||
          (weekLabels[week] || week).toLowerCase().includes(q) ||
          note.body.toLowerCase().includes(q)
      );
    });
  }, [query, weeks, notesByWeek, weekLabels]);

  const filteredNotes = (week: string): Note[] => {
    const all = notesByWeek.get(week) || [];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.topics.some((t) => t.toLowerCase().includes(q)) ||
        (weekLabels[week] || week).toLowerCase().includes(q) ||
        note.body.toLowerCase().includes(q)
    );
  };

  const toggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    detailsRefs.current.forEach((el) => {
      if (el) el.open = next;
    });
  };

  const resultCount = query.trim()
    ? filteredWeeks.reduce((sum, w) => sum + filteredNotes(w).length, 0)
    : notes.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
          All notes
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Browse {notes.length} lecture notes across {weeks.length} weeks
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search notes by keyword, topic, or content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes by keyword, topic, or content"
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
          {query ? `${resultCount} results` : `${notes.length} notes`}
        </span>
        <button
          onClick={toggleAll}
          className="text-xs font-medium text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Week cards */}
      <div className="space-y-4">
        {filteredWeeks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No notes found for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
        {filteredWeeks.map((week, i) => {
          const weekNotes = filteredNotes(week);
          if (weekNotes.length === 0) return null;
          return (
            <details
              key={week}
              ref={(el) => {
                detailsRefs.current[i] = el;
              }}
              className="group glass-card overflow-hidden"
              open={i === 0 || allExpanded}
            >
              <summary
                className="cursor-pointer px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors list-none"
                role="button"
                aria-label={`${weekLabels[week] || week}, ${weekNotes.length} notes`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {week.replace("week_0", "").replace("week_", "")}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {weekLabels[week] || week}
                  </h3>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-400 dark:text-slate-500">
                  <span>{weekNotes.length} notes</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180 text-gray-300 dark:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </summary>
              <div className="week-card-content border-t border-gray-100 dark:border-slate-800 divide-y divide-gray-50 dark:divide-slate-800/50">
                {weekNotes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.week}/${note.slug}`}
                    className="block px-6 py-3.5 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors group/note"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-sm text-gray-700 dark:text-slate-300 group-hover/note:text-indigo-600 dark:group-hover/note:text-indigo-400 transition-colors font-medium">
                          {note.title}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                          {note.date} ({note.day}) · {note.readingTime} min read
                        </p>
                      </div>
                      {note.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 shrink-0 max-w-[50%] justify-end">
                          {note.topics.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[10px] rounded-md font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 whitespace-nowrap"
                            >
                              {t.length > 20 ? t.slice(0, 20) + "\u2026" : t}
                            </span>
                          ))}
                          {note.topics.length > 2 && (
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 hidden sm:inline">
                              +{note.topics.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
