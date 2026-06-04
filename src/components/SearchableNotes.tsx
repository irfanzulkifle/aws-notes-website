"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Note {
  week: string;
  slug: string;
  title: string;
  date: string;
  topics: string[];
}

interface Props {
  notes: Note[];
  weeks: string[];
  weekLabels: Record<string, string>;
}

export default function SearchableNotes({ notes, weeks, weekLabels }: Props) {
  const [query, setQuery] = useState("");

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
          (weekLabels[week] || week).toLowerCase().includes(q)
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
        (weekLabels[week] || week).toLowerCase().includes(q)
    );
  };

  return (
    <>
      {/* Search */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 mb-8 relative z-10">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search notes by title, topic, or week..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Week cards */}
      <section className="max-w-5xl mx-auto px-4 pb-12 space-y-8">
        {filteredWeeks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">
              No notes found matching &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
        {filteredWeeks.map((week) => {
          const weekNotes = filteredNotes(week);
          if (weekNotes.length === 0) return null;
          return (
            <details
              key={week}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              open={filteredWeeks.indexOf(week) === 0}
            >
              <summary
                className="cursor-pointer px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors list-none"
                role="button"
                aria-label={`${weekLabels[week] || week}, ${weekNotes.length} notes`}
              >
                <h3 className="text-lg font-semibold text-slate-200">
                  {weekLabels[week] || week}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{weekNotes.length} notes</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </summary>
              <div className="border-t border-slate-800 divide-y divide-slate-800/60">
                {weekNotes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.week}/${note.slug}`}
                    className="block px-6 py-3.5 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-200">
                          {note.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {note.date}
                        </p>
                      </div>
                      {note.topics.length > 0 && (
                        <div className="hidden sm:flex flex-wrap gap-1.5 max-w-md justify-end">
                          {note.topics.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[11px] rounded-full bg-blue-950/60 text-blue-300 border border-blue-900/50"
                            >
                              {t.length > 30 ? t.slice(0, 30) + "\u2026" : t}
                            </span>
                          ))}
                          {note.topics.length > 3 && (
                            <span className="text-[11px] text-slate-400">
                              +{note.topics.length - 3} more
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
      </section>
    </>
  );
}
