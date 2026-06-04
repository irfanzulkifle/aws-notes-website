import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllNotes, getNoteContent, extractHeadings } from "@/lib/utils";
import TableOfContents from "@/components/TableOfContents";

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

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Notes
          </Link>
          <span className="text-sm text-slate-400">{meta.date}</span>
        </div>
      </nav>

      <div id="main-content" className="max-w-6xl mx-auto px-4 py-8">
        {/* Week nav */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.week}/${prevNote.slug}`}
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {prevNote.date}
              </Link>
            ) : (
              <span className="text-sm text-slate-500">First in {week}</span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded bg-slate-800/50 border border-slate-700">
            {week.replace("_", " ").toUpperCase()}
          </span>
          <div>
            {nextNote ? (
              <Link
                href={`/notes/${nextNote.week}/${nextNote.slug}`}
                className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                {nextNote.date}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="text-sm text-slate-500">Last in {week}</span>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Title */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
                {meta.title}
              </h1>
              {meta.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meta.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs rounded-full bg-blue-950/50 text-blue-300 border border-blue-900/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Markdown content */}
            <div className="prose prose-invert prose-slate max-w-none
              prose-headings:text-slate-100 prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-800
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
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
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800">
              {prevNote ? (
                <Link
                  href={`/notes/${prevNote.week}/${prevNote.slug}`}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← {prevNote.date}
                </Link>
              ) : <div />}
              {nextNote ? (
                <Link
                  href={`/notes/${nextNote.week}/${nextNote.slug}`}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
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
