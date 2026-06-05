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
import TrackView from "@/components/TrackView";
import ExamCallout from "@/components/ExamCallout";

interface Props {
  params: Promise<{ week: string; slug: string }>;
}

function extractBlockquoteText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractBlockquoteText).join(" ");
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) return extractBlockquoteText(props.children);
  }
  return "";
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
  const sortedNotes = [...allNotes].sort((a, b) => a.slug.localeCompare(b.slug));
  const currentIndex = sortedNotes.findIndex((n) => n.slug === slug && n.week === week);
  const prevNote = currentIndex > 0 ? sortedNotes[currentIndex - 1] : null;
  const nextNote = currentIndex < sortedNotes.length - 1 ? sortedNotes[currentIndex + 1] : null;

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
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackView week={week} slug={slug} title={meta.title} date={meta.date} />

      <div id="main-content" className="max-w-5xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 mb-8">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            All Notes
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/#week-${week}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {WEEK_LABELS[week] || week}
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600 dark:text-slate-300 font-medium truncate max-w-xs">
            {meta.title}
          </span>
        </div>

        {/* Prev/Next nav */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.week}/${prevNote.slug}`}
                className="text-xs text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                <time dateTime={prevNote.date}>{prevNote.date}</time>
              </Link>
            ) : (
              <span className="text-xs text-gray-300 dark:text-slate-600">First note</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 tracking-wide">
            {WEEK_LABELS[week] || week.replace("_", " ").toUpperCase()}
          </span>
          <div>
            {nextNote ? (
              <Link
                href={`/notes/${nextNote.week}/${nextNote.slug}`}
                className="text-xs text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <time dateTime={nextNote.date}>{nextNote.date}</time>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="text-xs text-gray-300 dark:text-slate-600">Last note</span>
            )}
          </div>
        </div>

        <div className="flex gap-12">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Title */}
            <header className="mb-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-400 mb-3">
                <time dateTime={meta.date}>{meta.date}</time>
                <span>·</span>
                <span>{minutes} min read</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                {meta.title}
              </h1>
              {meta.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {meta.topics.map((t) => (
                    <Link
                      key={t}
                      href={`/?search=${encodeURIComponent(t)}`}
                      className="px-2.5 py-1 text-xs rounded-lg font-medium border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Markdown content */}
            <div className="prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                components={{
                  blockquote({ children, ...props }) {
                    const content = extractBlockquoteText(children);
                    return (
                      <ExamCallout content={content}>
                        <blockquote {...props}>{children}</blockquote>
                      </ExamCallout>
                    );
                  },
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
              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-4">
                  Related notes
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedNotes.map((note) => (
                    <Link
                      key={note.slug}
                      href={`/notes/${note.week}/${note.slug}`}
                      className="block p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group/rel"
                    >
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover/rel:text-indigo-600 dark:group-hover/rel:text-indigo-400 transition-colors mb-1 line-clamp-2">
                        {note.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">{note.date}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-100 dark:border-slate-800">
              {prevNote ? (
                <Link
                  href={`/notes/${prevNote.week}/${prevNote.slug}`}
                  className="text-xs text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  ← <time dateTime={prevNote.date}>{prevNote.date}</time>
                </Link>
              ) : <div />}
              {nextNote ? (
                <Link
                  href={`/notes/${nextNote.week}/${nextNote.slug}`}
                  className="text-xs text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <time dateTime={nextNote.date}>{nextNote.date}</time> →
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
