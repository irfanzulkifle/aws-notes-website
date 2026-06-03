import Link from "next/link";
import { getAllNotes, getAllWeeks } from "@/lib/utils";

export default function HomePage() {
  const weeks = getAllWeeks();
  const allNotes = getAllNotes();

  const notesByWeek = new Map<string, typeof allNotes>();
  for (const note of allNotes) {
    const existing = notesByWeek.get(note.week) || [];
    existing.push(note);
    notesByWeek.set(note.week, existing);
  }

  const weekLabels: Record<string, string> = {
    week_03: "Week 3 — Linux & Shell",
    week_04: "Week 4 — Bash & AWS CLI",
    week_05: "Week 5 — Python Fundamentals",
    week_06: "Week 6 — Python Advanced",
    week_07: "Week 7 — Networking",
    week_08: "Week 8 — Databases & SQL",
    week_09: "Week 9 — AWS Cloud",
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
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-slate-500">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              📄 29 notes
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              📅 7 weeks
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

      {/* Week cards */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {weeks.map((week) => {
          const notes = notesByWeek.get(week) || [];
          return (
            <details
              key={week}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              open={weeks.indexOf(week) === 0}
            >
              <summary className="cursor-pointer px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors list-none">
                <h3 className="text-lg font-semibold text-slate-200">
                  {weekLabels[week] || week}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{notes.length} notes</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </summary>
              <div className="border-t border-slate-800 divide-y divide-slate-800/60">
                {notes.map((note) => (
                  <Link
                    key={note.slug}
                    href={`/notes/${note.week}/${note.slug}`}
                    className="block px-6 py-3.5 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-200">
                          {note.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {note.date}
                        </p>
                      </div>
                      {note.topics.length > 0 && (
                        <div className="hidden sm:flex flex-wrap gap-1.5 max-w-md justify-end">
                          {note.topics.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[11px] rounded-full bg-blue-950/60 text-blue-300 border border-blue-900/50"
                            >
                              {t.length > 30 ? t.slice(0, 30) + "…" : t}
                            </span>
                          ))}
                          {note.topics.length > 3 && (
                            <span className="text-[11px] text-slate-500">
                              +{note.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
