"use client";

import Link from "next/link";
import { useState } from "react";
import type { SidebarNote } from "@/lib/utils";

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
      className={`w-3 h-3 shrink-0 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
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
    <nav className="text-[13px]" aria-label="Documentation navigation">
      <div className="space-y-0.5 mb-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">All Notes</span>
        </Link>
        {weeksWithSummary.length > 0 && (
          <Link
            href="/notes/weekly-summary"
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
              currentSlug === "weekly_summary" && currentWeek === ""
                ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 font-medium"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-medium">Summaries</span>
          </Link>
        )}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="px-2 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Weeks
          </span>
        </div>

        <div className="space-y-px">
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
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                    isCurrentWeek
                      ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-950/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                  aria-expanded={isCurrentWeekOpen}
                  aria-controls={`week-${week}`}
                >
                  <ChevronIcon open={isCurrentWeekOpen} />
                  <span className="truncate font-mono text-[11px] font-medium">{weekShort}</span>
                </button>

                {isCurrentWeekOpen && (
                  <div id={`week-${week}`} className="ml-4 mt-0.5 space-y-px border-l border-zinc-200 dark:border-zinc-800 pl-2.5">
                    {hasSummary && (
                      <Link
                        href={`/notes/${week}/weekly_summary`}
                        className={`block px-2 py-1 rounded text-[12px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                          isCurrentPage(week, "weekly_summary")
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 font-medium"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        Summary
                      </Link>
                    )}
                    {notes.map((note) => (
                      <Link
                        key={note.slug}
                        href={`/notes/${note.week}/${note.slug}`}
                        className={`block px-2 py-1 rounded text-[12px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                          isCurrentPage(note.week, note.slug)
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 font-medium"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        }`}
                        title={note.title}
                      >
                        <span className="block truncate flex items-center gap-x-1">
                          {note.date ? (
                            <>
                              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 w-4 text-right shrink-0">
                                {note.day.slice(0, 3)}
                              </span>
                              <span className="text-zinc-500 dark:text-zinc-400">·</span>
                              <span className="text-zinc-600 dark:text-zinc-400">{note.displayDate}</span>
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
