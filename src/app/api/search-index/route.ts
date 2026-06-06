import { NextResponse } from "next/server";
import { getAllNotes, getNoteContent } from "@/lib/utils";
import { WEEK_LABELS } from "@/lib/constants";

export interface SearchDocument {
  title: string;
  week: string;
  weekLabel: string;
  slug: string;
  date: string;
  day: string;
  topics: string[];
  headings: string[];
  body: string;
  url: string;
}

export async function GET() {
  const notes = getAllNotes();

  const searchData: SearchDocument[] = notes.map((note) => {
    const content = getNoteContent(note.week, note.slug);
    const headings: string[] = [];
    if (content) {
      const headingRegex = /^#{2,3}\s+(.+)$/gm;
      let match;
      while ((match = headingRegex.exec(content.content)) !== null) {
        const text = match[1].replace(/[#*`~_\[\]()]/g, "").replace(/\*\*/g, "").trim();
        if (text) headings.push(text);
      }
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
      body: note.body,
      url: `/notes/${note.week}/${note.slug}`,
    };
  });

  const res = NextResponse.json(searchData);
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return res;
}
