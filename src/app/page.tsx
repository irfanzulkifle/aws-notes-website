import { getAllNotes, getAllWeeks } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import SearchableNotes from "@/components/SearchableNotes";
import Link from "next/link";

const HERO_TOPICS = [
  { emoji: "🐧", label: "Linux" },
  { emoji: "🐍", label: "Python" },
  { emoji: "🗄️", label: "SQL" },
  { emoji: "🌐", label: "Networking" },
  { emoji: "☁️", label: "AWS Cloud" },
  { emoji: "🔒", label: "Security" },
  { emoji: "🗄️", label: "Databases" },
];

export default function HomePage() {
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();
  const lastUpdated = allNotes.reduce(
    (max, n) => (n.date > max ? n.date : max),
    allNotes[0]?.date ?? ""
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              AWS re/Start Learning Journal
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Personal lecture notes from the AWS re/Start program. Cohort 3: Project
            CloudIgnite — a structured journey through cloud computing fundamentals.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Last updated: {lastUpdated}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              📄 {allNotes.length} notes
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              📅 {weeks.length} weeks
            </span>
            {HERO_TOPICS.map((t) => (
              <Link
                key={t.label}
                href={`/?search=${encodeURIComponent(t.label)}`}
                className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-600 transition-colors"
              >
                {t.emoji} {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div id="main-content">
        <SearchableNotes notes={allNotes} weeks={weeks} weekLabels={WEEK_LABELS} />
      </div>
    </div>
  );
}
