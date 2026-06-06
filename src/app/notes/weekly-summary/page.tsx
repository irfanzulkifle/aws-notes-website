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
    description: "Overview of all weekly summaries from the AWS re/Start Cohort 3: Project CloudIgnite program",
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 mb-8">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          All Notes
        </Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600 dark:text-slate-300 font-medium">
          Weekly Summary Index
        </span>
      </div>

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
