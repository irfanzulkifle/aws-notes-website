import React from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllNotes, getNoteContent, extractHeadings, readingTime } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import TableOfContents from "@/components/TableOfContents";
import CopyCodeButton from "@/components/CopyCodeButton";

interface Props {
  params: Promise<{ week: string; slug: string }>;
}

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    week: note.week,
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week, slug } = await params;
  const data = getNoteContent(week, slug);
  if (!data) return { title: "Not Found" };

  return {
    title: `${data.meta.title} — AWS re/Start Notes`,
    description: `Lecture notes for ${data.meta.title}. Topics: ${data.meta.topics.join(", ") || "AWS re/Start"}`,
  };
}

export default async function NotePage({ params }: Props) {
  const { week, slug } = await params;
  const data = getNoteContent(week, slug);

  if (!data) notFound();

  const { meta, content } = data;
  const allNotes = getAllNotes();
  const weekNotes = allNotes.filter((n) => n.week === week).sort((a, b) => a.slug.localeCompare(b.slug));
  const currentIndex = weekNotes.findIndex((n) => n.slug === slug);
  const prevNote = currentIndex > 0 ? weekNotes[currentIndex - 1] : null;
  const nextNote = currentIndex < weekNotes.length - 1 ? weekNotes[currentIndex + 1] : null;

  const headings = extractHeadings(content);
  const minutes = readingTime(content);

  const displayContent = content.replace(/^#[^#].+$/m, "").trimStart();

  const relatedNotes = allNotes
    .filter((n) => n.slug !== slug && n.topics.some((t) => meta.topics.includes(t)))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: meta.title,
    datePublished: meta.date,
    author: { "@type": "Person", name: "Irfan Zulkifle" },
    publisher: { "@type": "Organization", name: "AWS re/Start Notes" },
    description: `Lecture notes: ${meta.title}. Topics: ${meta.topics.join(", ")}`,
    keywords: meta.topics.join(", "),
    inLanguage: "en",
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 h-11 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            All Notes
          </Link>
          <span className="text-xs text-slate-600">
            {meta.date} · {minutes} min read
          </span>
        </div>
      </nav>

      <div id="main-content" className="max-w-4xl mx-auto px-4 py-10">
        {/* Week nav */}
        <div className="flex items-center justify-between mb-10 pb-3 border-b border-slate-800/60">
          <div>
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.week}/${prevNote.slug}`}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                {prevNote.date}
              </Link>
            ) : (
              <span className="text-xs text-slate-700">First in {week}</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-600 tracking-wide">
            {WEEK_LABELS[week] || week.replace("_", " ").toUpperCase()}
          </span>
          <div>
            {nextNote ? (
              <Link
                href={`/notes/${nextNote.week}/${nextNote.slug}`}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                {nextNote.date}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="text-xs text-slate-700">Last in {week}</span>
            )}
          </div>
        </div>

        <div className="flex gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Title */}
            <header className="mb-10">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3 tracking-tight">
                {meta.title}
              </h1>
              {meta.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {meta.topics.map((t) => (
                    <Link
                      key={t}
                      href={`/?search=${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 text-[11px] rounded border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Markdown content */}
            <div className="prose prose-invert prose-slate max-w-none
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-200
              prose-li:text-slate-300
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
              prose-hr:border-slate-800
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                components={{
                  pre({ children, ...props }) {
                    const codeChild = React.Children.toArray(children).find(
                      (child) => React.isValidElement(child) && child.type === "code"
                    ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
                    const codeString = codeChild?.props?.children
                      ? String(codeChild.props.children).replace(/\n$/, "")
                      : "";
                    return (
                      <div className="relative group">
                        <pre {...props}>{children}</pre>
                        {codeString && <CopyCodeButton text={codeString} />}
                      </div>
                    );
                  },
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>

            {/* Related notes */}
            {relatedNotes.length > 0 && (
              <div className="mt-14 pt-6 border-t border-slate-800/60">
                <h2 className="text-xs font-medium uppercase tracking-wider text-slate-600 mb-4">
                  Related
                </h2>
                <div className="space-y-2">
                  {relatedNotes.map((note) => (
                    <Link
                      key={note.slug}
                      href={`/notes/${note.week}/${note.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors group/rel"
                    >
                      <p className="text-sm text-slate-500 group-hover/rel:text-slate-300 transition-colors">
                        {note.title}
                      </p>
                      <span className="text-xs text-slate-700 shrink-0 ml-4">{note.date}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div className="flex items-center justify-between mt-14 pt-6 border-t border-slate-800/60">
              {prevNote ? (
                <Link
                  href={`/notes/${prevNote.week}/${prevNote.slug}`}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← {prevNote.date}
                </Link>
              ) : <div />}
              {nextNote ? (
                <Link
                  href={`/notes/${nextNote.week}/${nextNote.slug}`}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {nextNote.date} →
                </Link>
              ) : <div />}
            </div>
          </article>

          {/* TOC — desktop sidebar + mobile drawer */}
          <TableOfContents headings={headings} />
        </div>
      </div>
    </div>
  );
}
