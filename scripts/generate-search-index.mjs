import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const notesDir = path.join(rootDir, "content", "notes");
const constantsFile = path.join(rootDir, "src", "lib", "constants.ts");
const outputFile = path.join(rootDir, "public", "search-index.json");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getWeekLabels() {
  const source = fs.readFileSync(constantsFile, "utf-8");
  return Object.fromEntries(
    [...source.matchAll(/(week_\d+):\s*"([^"]+)"/g)].map(([, week, label]) => [week, label])
  );
}

function stripMarkdown(raw) {
  return raw
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/\*\*|__/g, "")
    .replace(/\*|_/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\|.*\|$/gm, "")
    .replace(/^[-*_]{3,}$/gm, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return raw;
  const end = raw.indexOf("\n---", 4);
  return end === -1 ? raw : raw.slice(end + 4).trimStart();
}

function createSlugger() {
  const seen = new Map();

  return (value) => {
    const baseSlug =
      value
        .toLowerCase()
        .trim()
        .replace(/<[^>]*>/g, "")
        .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, "")
        .replace(/\s+/g, "-") || "section";
    const count = seen.get(baseSlug) || 0;
    seen.set(baseSlug, count + 1);
    return count === 0 ? baseSlug : `${baseSlug}-${count}`;
  };
}

function parseMetadata(filePath, week, slug) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# ")) || "";
  const title = titleLine
    .replace(/^#\s*(?:\u{1F4DA}\s*)?/u, "")
    .replace(/^Lecture Notes\s*[\u2014\u2013-]\s*/, "")
    .trim();

  const topicsLine =
    lines.find((line) => line.startsWith("**Topics:**") || line.startsWith("**Topic:**")) || "";
  const topicsRaw = topicsLine.replace(/^\*\*Topics?:\*\*\s*/, "").trim();
  const topics = topicsRaw
    ? topicsRaw
        .split(/,\s*(?![^()]*\))/)
        .map((topic) => topic.trim())
        .filter(Boolean)
    : [];

  const isDateSlug = /^\d{4}-\d{2}-\d{2}$/.test(slug);
  const date = isDateSlug ? slug : "";
  let day = "";
  if (isDateSlug) {
    const [year, month, dateNumber] = slug.split("-").map(Number);
    day = days[new Date(year, month - 1, dateNumber).getDay()];
  }

  return {
    week,
    slug,
    title,
    date,
    day,
    topics,
    body: stripMarkdown(raw),
  };
}

function getAllNotes() {
  const notes = [];
  const weeks = fs
    .readdirSync(notesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const week of weeks) {
    const weekDir = path.join(notesDir, week);
    const files = fs
      .readdirSync(weekDir)
      .filter((file) => file.endsWith(".md"))
      .sort();

    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      if (slug === "weekly_summary" || slug === "weekly_summary_index") continue;
      notes.push(parseMetadata(path.join(weekDir, file), week, slug));
    }
  }

  return notes;
}

function getNoteContent(week, slug) {
  const filePath = path.join(notesDir, week, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const content = stripFrontmatter(raw);
  return content.replace(/\]\(\.\/([^)]+\.md)\)/g, (_match, linkPath) => {
    const linkSlug = linkPath.replace(/\.md$/, "");
    const weekMatch = linkPath.match(/^(week_\d+)\//);
    if (weekMatch) {
      return `](/notes/${weekMatch[1]}/${linkSlug.replace(weekMatch[0], "")})`;
    }
    return `](/notes/${week}/${linkSlug})`;
  });
}

function extractSections(markdown) {
  const slugger = createSlugger();
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let currentHeading = "";
  let currentSlug = "";
  let currentLines = [];

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/) || line.match(/^###\s+(.+)$/);

    if (match) {
      if (currentLines.length > 0 && currentSlug) {
        sections.push({
          heading: currentHeading,
          slug: currentSlug,
          content: currentLines.join(" ").replace(/\s+/g, " ").trim(),
        });
      }
      currentHeading = match[1].replace(/[#*`~_[\]()]/g, "").replace(/\*\*/g, "").trim();
      currentSlug = slugger(currentHeading);
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0 && currentSlug) {
    sections.push({
      heading: currentHeading,
      slug: currentSlug,
      content: currentLines.join(" ").replace(/\s+/g, " ").trim(),
    });
  }

  return sections;
}

function buildSearchIndex() {
  const weekLabels = getWeekLabels();
  return getAllNotes().map((note) => {
    const content = getNoteContent(note.week, note.slug);
    const headings = [];
    const sections = [];

    if (content) {
      const headingRegex = /^#{2,3}\s+(.+)$/gm;
      let match;
      while ((match = headingRegex.exec(content)) !== null) {
        const text = match[1].replace(/[#*`~_[\]()]/g, "").replace(/\*\*/g, "").trim();
        if (text) headings.push(text);
      }
      sections.push(...extractSections(content));
    }

    return {
      title: note.title,
      week: note.week,
      weekLabel: weekLabels[note.week] || note.week.replace("_", " ").toUpperCase(),
      slug: note.slug,
      date: note.date,
      day: note.day,
      topics: note.topics,
      headings,
      sections,
      body: note.body,
      url: `/notes/${note.week}/${note.slug}`,
    };
  });
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(buildSearchIndex(), null, 2)}\n`);
console.log(`Generated ${path.relative(rootDir, outputFile)}`);
