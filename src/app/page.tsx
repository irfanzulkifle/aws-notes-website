import { getAllNotes, getAllWeeks, getWeeksWithSummary } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import SearchableNotes from "@/components/SearchableNotes";
import RecentlyViewed from "@/components/RecentlyViewed";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();
  const weeksWithSummary = getWeeksWithSummary();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A]">
      {/* Header */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                AWS re/Start · Cohort 3 · Project CloudIgnite
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              AWS re/Start Lecture Summary
            </h1>

            <p className="text-base text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {weeks.length} weeks of structured notes covering Linux, Python, SQL,
              networking, and AWS — with CLF-C02 exam relevance flags.
            </p>

            <div className="flex items-center gap-6 mt-6 text-sm text-gray-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {allNotes.length} notes
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {weeks.length} weeks
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                CLF-C02 aligned
              </span>
            </div>

            {weeksWithSummary.length > 0 && (
              <div className="mt-6">
                <Link
                  href="/notes/weekly-summary"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View all weekly summaries
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div id="main-content" className="border-t border-gray-100 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecentlyViewed />
          <SearchableNotes
            key={search || "_"}
            notes={allNotes}
            weeks={weeks}
            weekLabels={WEEK_LABELS}
          />
        </div>
      </div>
    </div>
  );
}
