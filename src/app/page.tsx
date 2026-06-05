import { getAllNotes, getAllWeeks } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import SearchableNotes from "@/components/SearchableNotes";
import Link from "next/link";

const HERO_TOPICS = [
  { label: "Linux" },
  { label: "Python" },
  { label: "SQL" },
  { label: "Networking" },
  { label: "AWS Cloud" },
  { label: "Security" },
  { label: "Databases" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();
  const lastUpdated = allNotes.reduce(
    (max, n) => (n.date > max ? n.date : max),
    allNotes[0]?.date ?? ""
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-cyan-400/70 mb-4">
            AWS re/Start · Cohort 3
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4 leading-tight">
            Learning Journal
          </h1>
          <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed mb-3">
            {allNotes.length} lecture notes across {weeks.length} weeks of cloud computing fundamentals — Linux, Python, SQL, Networking, and AWS.
          </p>
          <p className="text-xs text-slate-600 mb-8">
            Updated {lastUpdated}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {HERO_TOPICS.map((t) => (
              <Link
                key={t.label}
                href={`/?search=${encodeURIComponent(t.label)}`}
                className="px-3.5 py-1.5 rounded-full border border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-600 hover:bg-white/[0.03] transition-all duration-200"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="border-t border-slate-800/60" />
      </div>

      <div id="main-content">
        <SearchableNotes key={search || "_"} notes={allNotes} weeks={weeks} weekLabels={WEEK_LABELS} />
      </div>
    </div>
  );
}
