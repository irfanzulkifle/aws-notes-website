import { NextResponse } from "next/server";
import { getAllNotes, getNoteContent } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";
import GithubSlugger from "github-slugger";

export interface SearchSection {
  heading: string;
  slug: string;
  content: string;
}

export interface SearchDocument {
  title: string;
  week: string;
  weekLabel: string;
  slug: string;
  date: string;
  day: string;
  topics: string[];
  headings: string[];
  sections: SearchSection[];
  body: string;
  url: string;
}

function extractSections(markdown: string): SearchSection[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const sections: SearchSection[] = [];
  let currentHeading = "";
  let currentSlug = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    const match = h2 || h3;

    if (match) {
      if (currentLines.length > 0) {
        sections.push({
          heading: currentHeading,
          slug: currentSlug,
          content: currentLines.join(" ").replace(/\s+/g, " ").trim(),
        });
      }
      const raw = match[1].replace(/[#*`~_\[\]()]/g, "").replace(/\*\*/g, "").trim();
      currentHeading = raw;
      currentSlug = slugger.slug(raw);
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      heading: currentHeading,
      slug: currentSlug,
      content: currentLines.join(" ").replace(/\s+/g, " ").trim(),
    });
  }

  return sections;
}

export async function GET() {
  const notes = getAllNotes();

  const searchData: SearchDocument[] = notes.map((note) => {
    const content = getNoteContent(note.week, note.slug);
    const headings: string[] = [];
    const sections: SearchSection[] = [];
    if (content) {
      const headingRegex = /^#{2,3}\s+(.+)$/gm;
      let match;
      while ((match = headingRegex.exec(content.content)) !== null) {
        const text = match[1].replace(/[#*`~_\[\]()]/g, "").replace(/\*\*/g, "").trim();
        if (text) headings.push(text);
      }
      sections.push(...extractSections(content.content));
    }

    return {
      title: note.title,
      week: note.week,
      weekLabel: WEEK_LABELS[note.week] || note.week.replace("_", " ").toUpperCase(),
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

  const res = NextResponse.json(searchData);
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return res;
}
