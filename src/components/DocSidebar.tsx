"use client";

import Link from "next/link";
import { useState } from "react";

interface SidebarNote {
  week: string;
  slug: string;
  title: string;
  date: string;
  day: string;
}

interface DocSidebarProps {
  weeks: string[];
  notesByWeek: Record<string, SidebarNote[]>;
  weeksWithSummary: string[];
  currentWeek: string;
  currentSlug: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function DocSidebar({
  weeks,
  notesByWeek,
  weeksWithSummary,
  currentWeek,
  currentSlug,
}: DocSidebarProps) {
  const [openWeeks, setOpenWeeks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (currentWeek) {
      initial[currentWeek] = true;
    }
    return initial;
  });

  const toggleWeek = (week: string) => {
    setOpenWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  const isWeekOpen = (week: string) => openWeeks[week] === true;
  const isCurrentPage = (week: string, slug: string) => currentWeek === week && currentSlug === slug;

  return (
    <nav className="text-sm" aria-label="Documentation navigation">
      <div className="space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">All Notes</span>
        </Link>
        {weeksWithSummary.length > 0 && (
          <Link
            href="/notes/weekly-summary"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              currentSlug === "weekly_summary" && currentWeek === ""
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 font-medium"
                : "text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-medium">Weekly Summaries</span>
          </Link>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Weeks
          </span>
        </div>

        <div className="space-y-0.5">
          {weeks.map((week) => {
            const notes = notesByWeek[week] || [];
            const hasSummary = weeksWithSummary.includes(week);
            const isCurrentWeekOpen = isWeekOpen(week);
            const isCurrentWeek = currentWeek === week;

            const weekShort = `W${week.replace("week_0", "").replace("week_", "")}`;

            return (
              <div key={week}>
                <button
                  onClick={() => toggleWeek(week)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                    isCurrentWeek
                      ? "text-indigo-600 dark:text-indigo-400 font-medium"
                      : "text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  }`}
                  aria-expanded={isCurrentWeekOpen}
                  aria-controls={`week-${week}`}
                >
                  <ChevronIcon open={isCurrentWeekOpen} />
                  <span className="truncate font-medium text-xs">{weekShort}</span>
                </button>

                {isCurrentWeekOpen && (
                  <div id={`week-${week}`} className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-slate-800 pl-3">
                    {hasSummary && (
                      <Link
                        href={`/notes/${week}/weekly_summary`}
                        className={`block px-2 py-1.5 rounded-md text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                          isCurrentPage(week, "weekly_summary")
                            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 font-medium"
                            : "text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        Weekly Summary
                      </Link>
                    )}
                    {notes.map((note) => (
                      <Link
                        key={note.slug}
                        href={`/notes/${note.week}/${note.slug}`}
                        className={`block px-2 py-1.5 rounded-md text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                          isCurrentPage(note.week, note.slug)
                            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 font-medium"
                            : "text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                        }`}
                        title={note.title}
                      >
                        <span className="block truncate flex items-center gap-2">
                          {note.date ? (
                            <>
                              <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 w-6 text-right shrink-0">
                                {note.day.slice(0, 3)}
                              </span>
                              <span>{note.date}</span>
                            </>
                          ) : (
                            note.title
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
