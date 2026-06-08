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
    <div>
      <div className="mb-2 relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none"
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
          placeholder="Filter notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter notes by keyword, topic, or content"
          className="w-full pl-8 pr-8 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          {query ? `${resultCount} result${resultCount !== 1 ? "s" : ""}` : `${notes.length} notes`}
        </span>
        <button
          onClick={toggleAll}
          className="text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {filteredWeeks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
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
              className="group"
              open={i === 0 || allExpanded}
            >
              <summary
                className="cursor-pointer px-1 py-2 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors list-none rounded-sm"
                role="button"
                aria-label={`${weekLabels[week] || week}, ${weekNotes.length} notes`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg
                    className="w-3 h-3 shrink-0 transition-transform group-open:rotate-180 text-zinc-400 dark:text-zinc-500"
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
                  <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {weekLabels[week] || week}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums whitespace-nowrap">
                    {weekNotes.length} {weekNotes.length === 1 ? "note" : "notes"}
                  </span>
                  <span className="text-[11px] text-zinc-300 dark:text-zinc-700 select-none">·</span>
                  <Link
                    href={`/notes/${week}/weekly_summary`}
                    className="text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Summary
                  </Link>
                </div>
              </summary>
              <div className="pl-5 pb-1">
                {weekNotes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.week}/${note.slug}`}
                    className="block py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group/note rounded-sm px-2 -ml-2"
                  >
                    <p className="text-[13px] text-zinc-700 dark:text-zinc-300 group-hover/note:text-zinc-900 dark:group-hover/note:text-zinc-100 transition-colors leading-tight">
                      {note.title}
                    </p>
                     <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
                       <span>{note.day ? `${note.day.slice(0, 3)} · ${note.readingTime} min` : `${note.date} · ${note.readingTime} min`}</span>
                       {note.topics.slice(0, 3).map((t) => (
                         <span key={t} className="text-[11px] text-zinc-400 dark:text-zinc-500 before:content-['·'] before:mr-1">
                           {t}
                         </span>
                       ))}
                     </p>
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
