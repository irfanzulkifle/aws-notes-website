"use client";

import { useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Note {
  week: string;
  slug: string;
  title: string;
  date: string;
  topics: string[];
  readingTime: number;
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

  const toggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    detailsRefs.current.forEach((el) => {
      if (el) el.open = next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Search */}
      <div className="mb-6 relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"
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
          placeholder="Filter by title, topic, or week..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes by title, topic, or week"
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-700 focus:bg-slate-900 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          {query ? `${filteredWeeks.reduce((sum, w) => sum + filteredNotes(w).length, 0)} results` : `${notes.length} notes`}
        </span>
        <button
          onClick={toggleAll}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Week cards */}
      <div className="space-y-6">
        {filteredWeeks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-sm">
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
              ref={(el) => { detailsRefs.current[i] = el; }}
              className="group bg-white/[0.02] border border-slate-800/60 rounded-xl overflow-hidden"
              open={i === 0 || allExpanded}
            >
              <summary
                className="cursor-pointer px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors list-none"
                role="button"
                aria-label={`${weekLabels[week] || week}, ${weekNotes.length} notes`}
              >
                <h3 className="text-sm font-medium text-slate-300">
                  {weekLabels[week] || week}
                </h3>
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <span>{weekNotes.length} notes</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="week-card-content border-t border-slate-800/40 divide-y divide-slate-800/30">
                {weekNotes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.week}/${note.slug}`}
                    className="block px-5 py-3 hover:bg-white/[0.02] transition-colors group/note"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-sm text-slate-400 group-hover/note:text-slate-200 transition-colors">
                          {note.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {note.date} · {note.readingTime} min
                        </p>
                      </div>
                      {note.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 shrink-0 max-w-[50%] justify-end">
                          {note.topics.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[10px] rounded text-slate-600 bg-slate-800/50 whitespace-nowrap"
                            >
                              {t.length > 20 ? t.slice(0, 20) + "\u2026" : t}
                            </span>
                          ))}
                          {note.topics.length > 2 && (
                            <span className="text-[10px] text-slate-700 hidden sm:inline">
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
