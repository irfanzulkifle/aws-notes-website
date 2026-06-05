import { getAllNotes, getAllWeeks } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import SearchableNotes from "@/components/SearchableNotes";
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(79,70,229,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-600">
              AWS re/Start · Cohort 3 · {allNotes.length} notes published
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Cloud computing
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              learning journal
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up-delay-2 text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            {weeks.length} weeks of structured notes covering Linux, Python, SQL,
            networking, and AWS — with CLF-C02 exam relevance flags.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <a href="#main-content" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Explore notes
            </a>
            <a
              href="https://github.com/irfanzulkifle/aws_restart_note"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View source
            </a>
          </div>

          {/* Topic pills */}
          <div className="animate-fade-up-delay-3 flex flex-wrap justify-center gap-2">
            {HERO_TOPICS.map((t) => (
              <Link
                key={t}
                href={`/?search=${encodeURIComponent(t)}#main-content`}
                className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: allNotes.length.toString(), label: "Lecture notes" },
              { value: weeks.length.toString(), label: "Weeks covered" },
              { value: HERO_TOPICS.length.toString(), label: "Topic areas" },
              { value: "CLF-C02", label: "Exam aligned" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div id="main-content">
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
