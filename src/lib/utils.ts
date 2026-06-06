import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export interface NoteMeta {
  week: string;
  slug: string;
  title: string;
  date: string;
  day: string;
  topics: string[];
  path: string; // relative path from content/notes
  readingTime: number;
  body: string; // plain text content for search
}

export interface NoteContent {
  meta: NoteMeta;
  content: string;
}

function parseMetadata(filePath: string, week: string, slug: string): NoteMeta {
  const raw = fs.readFileSync(filePath, "utf-8");

  // Extract title from the first heading line
  const lines = raw.split("\n");
  const titleLine = lines.find((l) => l.startsWith("# ")) || "";
  const title = titleLine.replace(/^#\s*(?:📚\s*)?/, "").replace(/^Lecture Notes\s*[—–-]\s*/, "").trim();

  // Extract topics from the **Topics:** or **Topic:** line
  const topicsLine = lines.find(
    (l) => l.startsWith("**Topics:**") || l.startsWith("**Topic:**")
  ) || "";
  const topicsRaw = topicsLine.replace(/^\*\*Topics?:\*\*\s*/, "").trim();
  const topics = topicsRaw
    ? topicsRaw.split(/,\s*(?![^()]*\))/).map((t) => t.trim()).filter(Boolean)
    : [];

  // Date from slug (YYYY-MM-DD) or fallback for non-date slugs (e.g. weekly_summary)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const isDateSlug = datePattern.test(slug);
  const date = isDateSlug ? slug : "";
  let day = "";
  if (isDateSlug) {
    const [y, m, d] = slug.split("-").map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    day = DAYS[dayOfWeek];
  }

  const relativePath = path.join(week, `${slug}.md`);
  const words = raw.replace(/[#*`~_\[\]()]/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  // Extract plain text for search (strip markdown syntax, limit length)
  const body = raw
    .replace(/^#{1,6}\s+.+$/gm, "") // headings
    .replace(/\*\*|__/g, "")         // bold
    .replace(/\*|_/g, "")            // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline/code blocks
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links/images
    .replace(/^[-*+]\s+/gm, "")      // list markers
    .replace(/^\d+\.\s+/gm, "")      // ordered list markers
    .replace(/^>\s?/gm, "")          // blockquotes
    .replace(/^\|.*\|$/gm, "")       // table rows
    .replace(/^[-*_]{3,}$/gm, "")    // horizontal rules
    .replace(/\n{2,}/g, " ")         // collapse newlines
    .replace(/\s+/g, " ")            // collapse whitespace
    .trim()
    .slice(0, 2000);

  return { week, slug, title, date, day, topics, path: relativePath, readingTime, body };
}

export function getAllNotes(): NoteMeta[] {
  const notes: NoteMeta[] = [];
  const weeks = fs.readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const week of weeks) {
    const weekDir = path.join(NOTES_DIR, week);
    const files = fs.readdirSync(weekDir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      // Skip weekly summary files — they are not daily notes
      if (slug === "weekly_summary" || slug === "weekly_summary_index") continue;
      const filePath = path.join(weekDir, file);
      notes.push(parseMetadata(filePath, week, slug));
    }
  }

  return notes;
}

export function getNoteContent(week: string, slug: string): NoteContent | null {
  const filePath = path.join(NOTES_DIR, week, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  const meta = parseMetadata(filePath, week, slug);

  // Transform relative markdown links to Next.js route URLs
  const transformedContent = content.replace(
    /\]\(\.\/([^)]+\.md)\)/g,
    (_match: string, linkPath: string) => {
      // ./2026-04-13.md → /notes/week_03/2026-04-13 (same-week daily note)
      // ./week_03/weekly_summary.md → /notes/week_03/weekly_summary (cross-week)
      const linkSlug = linkPath.replace(/\.md$/, "");
      // If linkPath contains week_ prefix, extract the week
      const weekMatch = linkPath.match(/^(week_\d+)\//);
      if (weekMatch) {
        return `](/notes/${weekMatch[1]}/${linkSlug.replace(weekMatch[0], "")})`;
      }
      return `](/notes/${week}/${linkSlug})`;
    }
  );

  return { meta, content: transformedContent };
}

export function getAllWeeks(): string[] {
  return fs.readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function getWeeksWithSummary(): string[] {
  return fs.readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => fs.existsSync(path.join(NOTES_DIR, d.name, "weekly_summary.md")))
    .map((d) => d.name)
    .sort();
}

export function getWeeklySummaryIndex(): string | null {
  const filePath = path.join(NOTES_DIR, "weekly_summary_index.md");
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content.replace(
    /\]\(\.\/([^)]+\.md)\)/g,
    (_match: string, linkPath: string) => {
      const weekMatch = linkPath.match(/^(week_\d+)\/weekly_summary\.md$/);
      if (weekMatch) return `](/notes/${weekMatch[1]}/weekly_summary)`;
      return `](/notes/${linkPath.replace(/\.md$/, "")})`;
    }
  );
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1]
      .replace(/[#*`~_\[\]()]/g, "")
      .replace(/\*\*/g, "")
      .trim();
    const id = slugger.slug(text);
    headings.push({
      level: match[0].startsWith("###") ? 3 : 2,
      text,
      id,
    });
  }

  return headings;
}

export function readingTime(content: string): number {
  const words = content.replace(/[#*`~_\[\]()]/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
