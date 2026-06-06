import { getAllNotes, getAllWeeks, getWeeksWithSummary, getWeeklySummaryIndex } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import DocLayout from "@/components/DocLayout";

export function generateStaticParams() {
  return [{}];
}

export async function generateMetadata() {
  return {
    title: "Weekly Summary Index — AWS re/Start Notes",
    description: "Overview of all weekly summaries from the AWS re/Start program",
  };
}

export default async function WeeklySummaryIndexPage() {
  const content = getWeeklySummaryIndex();
  if (!content) notFound();

  const allNotes = getAllNotes();
  const allWeeks = getAllWeeks();
  const weeksWithSummary = getWeeksWithSummary();
  
  const notesByWeek: Record<string, { week: string; slug: string; title: string; date: string; day: string }[]> = {};
  allWeeks.forEach((w) => {
    notesByWeek[w] = allNotes
      .filter((n) => n.week === w)
      .sort((a, b) => a.slug.localeCompare(b.slug));
  });

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

      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            pre({ children, ...props }) {
              return (
                <div className="relative group">
                  <pre {...props}>{children}</pre>
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </DocLayout>
  );
}
