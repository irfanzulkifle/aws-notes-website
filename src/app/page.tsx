import { getAllNotes, getAllWeeks } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import SearchableNotes from "@/components/SearchableNotes";
import RecentlyViewed from "@/components/RecentlyViewed";
import Link from "next/link";

const HERO_TOPICS = [
  "Linux",
  "Python",
  "SQL",
  "Networking",
  "AWS Cloud",
  "Security",
  "Databases",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/20 dark:via-[#0B0F1A] dark:to-[#0B0F1A] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-10 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 dark:text-slate-400">
              AWS re/Start · Cohort 3
            </span>
          </div>

          <h1 className="animate-fade-up-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
            Cloud computing{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              learning journal
            </span>
          </h1>

          <p className="animate-fade-up-delay-2 text-sm sm:text-base text-gray-500 dark:text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
            {allNotes.length} lecture notes across {weeks.length} weeks covering Linux, Python, SQL, networking, and AWS — CLF-C02 exam aligned.
          </p>

          <div className="animate-fade-up-delay-3 flex flex-wrap justify-center gap-1.5 mb-6">
            {HERO_TOPICS.map((t) => (
              <Link
                key={t}
                href={`/?search=${encodeURIComponent(t)}#main-content`}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
              >
                {t}
              </Link>
            ))}
          </div>

          <div className="animate-fade-up-delay-3 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{allNotes.length}</span>
              </span>
              notes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">{weeks.length}</span>
              </span>
              weeks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">CLF</span>
              </span>
              exam aligned
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div id="main-content">
        <RecentlyViewed />
        <SearchableNotes
          key={search || "_"}
          notes={allNotes}
          weeks={weeks}
          weekLabels={WEEK_LABELS}
        />
      </div>
    </div>
  );
}
