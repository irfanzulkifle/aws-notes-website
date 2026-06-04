import { getAllNotes, getAllWeeks } from "@/lib/utils";
import SearchableNotes from "@/components/SearchableNotes";

export default function HomePage() {
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();

  const weekLabels: Record<string, string> = {
    week_03: "Week 3 — Linux & Shell",
    week_04: "Week 4 — Bash & AWS CLI",
    week_05: "Week 5 — Python Fundamentals",
    week_06: "Week 6 — Python Advanced",
    week_07: "Week 7 — Networking",
    week_08: "Week 8 — Databases & SQL",
    week_09: "Week 9 — AWS Cloud",
    week_10: "Week 10 — SQL Advanced & Amazon RDS",
  };

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
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              📄 {allNotes.length} notes
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              📅 {weeks.length} weeks
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              🐧 Linux
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              🐍 Python
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              🗄️ SQL
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              🌐 Networking
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              ☁️ AWS Cloud
            </span>
          </div>
        </div>
      </section>

      <div id="main-content">
        <SearchableNotes notes={allNotes} weeks={weeks} weekLabels={weekLabels} />
      </div>
    </div>
  );
}
