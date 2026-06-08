import { getAllNotes, getAllWeeks, getWeeksWithSummary, buildNotesByWeek, getWeeklySummaryIndex } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import DocLayout from "@/components/DocLayout";

interface WeekSummaryData {
  week: string;
  weekNumber: number;
  dates: string;
  topics: string[];
  summaryPath: string;
  dailyNotesCount: number;
}

function parseWeeklySummaries(content: string, allNotes: { week: string; slug: string }[]): WeekSummaryData[] {
  const summaries: WeekSummaryData[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || trimmed.includes("Week") && trimmed.includes("Dates") && trimmed.includes("Key Topics")) continue;
    if (trimmed.match(/^\|[\s-:|]+\|$/)) continue;

    const cells = trimmed.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;

    const weekMatch = cells[0].match(/Week\s*(\d+)/i);
    if (!weekMatch) continue;

    const weekNumber = parseInt(weekMatch[1], 10);
    const weekKey = `week_${weekNumber.toString().padStart(2, "0")}`;
    const dates = cells[1].replace(/\*\*/g, "").trim();
    const topicsRaw = cells[2].replace(/\*\*/g, "").trim();
    const topics = topicsRaw.split(",").map((t) => t.trim()).filter(Boolean);

    const linkMatch = cells[3].match(/\]\(([^)]+)\)/);
    const summaryPath = linkMatch ? linkMatch[1].replace(/^\.\//, "/notes/").replace(/\.md$/, "") : `/notes/${weekKey}/weekly_summary`;

    const dailyNotesCount = allNotes.filter((n) => n.week === weekKey).length;

    summaries.push({
      week: weekKey,
      weekNumber,
      dates,
      topics,
      summaryPath,
      dailyNotesCount,
    });
  }

  return summaries;
}

export function generateStaticParams() {
  return [{}];
}

export async function generateMetadata() {
  return {
    title: "Weekly Summaries — AWS re/Start Notes",
    description: "Curated weekly learning summaries from the AWS re/Start program",
  };
}

export default async function WeeklySummaryIndexPage() {
  const content = getWeeklySummaryIndex();
  if (!content) notFound();

  const allNotes = getAllNotes();
  const allWeeks = getAllWeeks();
  const weeksWithSummary = getWeeksWithSummary();
  const notesByWeek = buildNotesByWeek(allNotes, allWeeks);
  const summaries = parseWeeklySummaries(content, allNotes);

  return (
    <DocLayout
      weeks={allWeeks}
      notesByWeek={notesByWeek}
      weeksWithSummary={weeksWithSummary}
      currentWeek=""
      currentSlug="weekly_summary"
    >
      <nav className="flex items-center gap-1.5 text-[12px] text-zinc-400 dark:text-zinc-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          Notes
        </Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
          Weekly Summaries
        </span>
      </nav>

      <header className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-2">
          Learning Journey
        </h1>
        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[600px]">
          A structured progression through AWS re/Start — from Linux fundamentals to advanced cloud architecture.
        </p>
      </header>

      <div className="space-y-3">
        {summaries.map((summary, index) => {
          const weekLabel = WEEK_LABELS[summary.week] || `Week ${summary.weekNumber}`;
          const themeMatch = weekLabel.match(/Week\s*\d+\s*[—–-]\s*(.+)/);
          const theme = themeMatch ? themeMatch[1].trim() : "";

          return (
            <div
              key={summary.week}
              className="group relative rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all duration-150"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-5">
                {/* Week indicator */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1 sm:min-w-[56px] sm:pt-0.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[13px] font-semibold shrink-0">
                    {summary.weekNumber}
                  </div>
                  {index < summaries.length - 1 && (
                    <div className="hidden sm:block w-px h-4 bg-zinc-200 dark:bg-zinc-800 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h2 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
                      {theme || weekLabel}
                    </h2>
                    <span className="text-[12px] text-zinc-400 dark:text-zinc-500 shrink-0">
                      {summary.dates}
                    </span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {summary.topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 text-[12px]">
                    <Link
                      href={summary.summaryPath}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      View Summary
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="text-zinc-400 dark:text-zinc-500">
                      {summary.dailyNotesCount} {summary.dailyNotesCount === 1 ? "lecture" : "lectures"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning Journey Timeline */}
      <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
          Progression
        </h2>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[12px]">
          {summaries.map((summary, index) => (
            <React.Fragment key={summary.week}>
              <Link
                href={summary.summaryPath}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                W{summary.weekNumber}
              </Link>
              {index < summaries.length - 1 && (
                <span className="text-zinc-300 dark:text-zinc-700">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </DocLayout>
  );
}
