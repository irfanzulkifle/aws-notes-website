import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllNotes, getNoteContent, extractHeadings, readingTime, getWeeksWithSummary, getAllWeeks, buildNotesByWeek } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import TableOfContents from "@/components/TableOfContents";
import CopyCodeButton from "@/components/CopyCodeButton";
import TrackView from "@/components/TrackView";
import Callout, { CalloutType } from "@/components/Callout";
import DocLayout from "@/components/DocLayout";
import SearchHighlighter from "@/components/SearchHighlighter";

interface Props {
  params: Promise<{ week: string; slug: string }>;
}

export async function generateStaticParams() {
  const notes = getAllNotes();
  const weeklySummaryParams = getWeeksWithSummary().map((week) => ({
    week,
    slug: "weekly_summary",
  }));
  return [...notes.map((note) => ({ week: note.week, slug: note.slug })), ...weeklySummaryParams];
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

function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node || typeof node !== "object") return "";
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return React.Children.toArray(props.children).map(extractTextFromReactNode).join("");
  }
  if (Array.isArray(node)) return node.map(extractTextFromReactNode).join("");
  return "";
}

function parseCallout(fullText: string): { type: CalloutType; title?: string; body: string } | null {
  const lines = fullText.split("\n");
  const firstLine = lines[0]?.trim();
  if (!firstLine) return null;

  const match = firstLine.match(/^\*\*(Tip|Important|Warning|Exam Tip|Best Practice):\*\*\s*(.*)$/i);
  if (!match) return null;

  const typeMap: Record<string, CalloutType> = {
    "tip": "tip",
    "important": "important",
    "warning": "warning",
    "exam tip": "exam",
    "best practice": "best-practice",
  };

  const type = typeMap[match[1].toLowerCase()] || "tip";
  const title = match[2] || undefined;
  const body = lines.slice(1).join("\n").trim();

  return { type, title, body };
}

export default async function NotePage({ params }: Props) {
  const { week, slug } = await params;
  const data = getNoteContent(week, slug);

  if (!data) notFound();

  const { meta, content } = data;
  const allNotes = getAllNotes();
  const allWeeks = getAllWeeks();
  const weeksWithSummary = getWeeksWithSummary();
  const notesByWeek = buildNotesByWeek(allNotes, allWeeks);

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
    <DocLayout
      weeks={allWeeks}
      notesByWeek={notesByWeek}
      weeksWithSummary={weeksWithSummary}
      currentWeek={week}
      currentSlug={slug}
      toc={<TableOfContents headings={headings} />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackView week={week} slug={slug} title={meta.title} date={meta.date} />
      <Suspense fallback={null}>
        <SearchHighlighter />
      </Suspense>

      <nav className="flex items-center gap-1.5 text-[12px] text-zinc-400 dark:text-zinc-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          Notes
        </Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-zinc-500 dark:text-zinc-400">
          {WEEK_LABELS[week] || week}
        </span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px]">
          {meta.title}
        </span>
      </nav>

      <nav className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800" aria-label="Pagination">
        <div>
          {prevNote ? (
            <Link
              href={`/notes/${prevNote.week}/${prevNote.slug}`}
              className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {prevNote.date}
            </Link>
          ) : (
            <span className="text-[12px] text-zinc-300 dark:text-zinc-600">First</span>
          )}
        </div>
        <span />
        <div>
          {nextNote ? (
            <Link
              href={`/notes/${nextNote.week}/${nextNote.slug}`}
              className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              {nextNote.date}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="text-[12px] text-zinc-300 dark:text-zinc-600">Last</span>
          )}
        </div>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-[12px] text-zinc-400 dark:text-zinc-500 mb-3">
          <span>{meta.date}</span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span>{minutes} min read</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-4">
          {meta.title}
        </h1>
        {meta.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {meta.topics.map((t) => (
              <Link
                key={t}
                href={`/?search=${encodeURIComponent(t)}`}
                className="px-2 py-0.5 text-[11px] rounded font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            blockquote({ children, ...props }) {
              const textContent = React.Children.toArray(children)
                .map(extractTextFromReactNode)
                .join("");
              
              const callout = parseCallout(textContent);
              if (callout) {
                return (
                  <Callout type={callout.type} title={callout.title}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeSlug]}
                    >
                      {callout.body}
                    </ReactMarkdown>
                  </Callout>
                );
              }
              return <blockquote {...props}>{children}</blockquote>;
            },
            table({ children, ...props }) {
              return (
                <div className="table-wrapper">
                  <table {...props}>{children}</table>
                </div>
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

      {relatedNotes.length > 0 && (
        <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            Related
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNotes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.week}/${note.slug}`}
                className="block p-3 rounded-md border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group/rel"
              >
                <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover/rel:text-zinc-900 dark:group-hover/rel:text-zinc-100 transition-colors mb-1 line-clamp-2">
                  {note.title}
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{note.date}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800" aria-label="Pagination">
        {prevNote ? (
          <Link
            href={`/notes/${prevNote.week}/${prevNote.slug}`}
            className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            ← {prevNote.date}
          </Link>
        ) : <div />}
        {nextNote ? (
          <Link
            href={`/notes/${nextNote.week}/${nextNote.slug}`}
            className="text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            {nextNote.date} →
          </Link>
        ) : <div />}
      </nav>
    </DocLayout>
  );
}
