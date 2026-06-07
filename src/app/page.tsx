import { Suspense } from "react";
import { getAllNotes, getAllWeeks } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import SearchableNotes from "@/components/SearchableNotes";
import RecentlyViewed from "@/components/RecentlyViewed";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]">
      <div id="main-content" className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <header className="mb-4">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              AWS re/Start Notes
            </h1>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {allNotes.length} notes across {weeks.length} weeks · Linux, Python, SQL, Networking, AWS Cloud
            </p>
          </header>
          <RecentlyViewed />
          <Suspense fallback={null}>
            <SearchableNotes
              key={search || "_"}
              notes={allNotes}
              weeks={weeks}
              weekLabels={WEEK_LABELS}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
