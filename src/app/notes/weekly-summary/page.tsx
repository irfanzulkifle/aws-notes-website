import { getWeeklySummaryIndex } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import React from "react";

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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A]">
      <div className="max-w-5xl mx-auto px-6 py-10">
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

        <article className="prose max-w-3xl">
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
        </article>
      </div>
    </div>
  );
}
