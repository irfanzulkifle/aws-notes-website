import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export interface NoteMeta {
  week: string;
  slug: string;
  title: string;
  date: string;
  topics: string[];
  path: string; // relative path from content/notes
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

  // Date from slug (YYYY-MM-DD)
  const date = slug;

  const relativePath = path.join(week, `${slug}.md`);

  return { week, slug, title, date, topics, path: relativePath };
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

  return { meta, content };
}

export function getAllWeeks(): string[] {
  return fs.readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
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
