import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — AWS re/Start Notes",
  description: "About Irfan Zulkifle — AWS re/Start learner, cloud engineering candidate, and author of this learning journal.",
};

export default function AboutPage() {
  const notes = getAllNotes();
  const topicSet = new Set<string>();
  for (const note of notes) {
    note.topics.forEach(t => topicSet.add(t));
  }

  const skills = [
    { name: "Linux Administration", icon: "T" },
    { name: "Python Programming", icon: "P" },
    { name: "SQL & Databases", icon: "D" },
    { name: "AWS Cloud", icon: "C" },
    { name: "Networking", icon: "N" },
    { name: "Security & IAM", icon: "S" },
    { name: "DevOps Principles", icon: "O" },
    { name: "CI/CD Pipelines", icon: "I" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-2xl font-bold text-white">I</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Irfan Zulkifle
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                AWS re/Start · Cohort 3 · Project CloudIgnite
              </p>
            </div>
          </div>
          <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed">
            I&apos;m an aspiring cloud engineer documenting my journey through AWS re/Start —
            a full-time, classroom-based AWS training program. This website serves as my public
            learning journal, study reference, and portfolio project.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{notes.length}</div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Lecture Notes</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">8</div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Weeks Documented</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{topicSet.size}</div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Topics Covered</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">CLF</div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Exam Aligned</div>
          </div>
        </div>

        {/* About the Program */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About AWS re/Start
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            AWS re/Start is a full-time, classroom-based skills development and training program
            that prepares learners for careers in the cloud. The program covers Linux, Python,
            networking, security, and relational databases — all through the lens of AWS cloud
            computing.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Skills Covered
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-slate-700 px-3.5 py-2.5"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{skill.icon}</span>
                </div>
                <span className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Links
          </h2>
          <div className="space-y-3">
            <a
              href="https://github.com/irfanzulkifle/aws-notes-website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Website Source Code
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-500">
                  Next.js 16 · TypeScript · Tailwind CSS 4
                </div>
              </div>
            </a>
            <a
              href="https://github.com/irfanzulkifle/aws_restart_note"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Raw Notes Repository
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-500">
                  Markdown source · CC BY 4.0
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Back link */}
        <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
          <Link
            href="/"
            className="text-sm text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all notes
          </Link>
        </div>
      </div>
    </div>
  );
}