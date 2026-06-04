import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aws-notes-website.vercel.app";
  const allNotes = getAllNotes();

  const noteUrls: MetadataRoute.Sitemap = allNotes.map((note) => ({
    url: `${baseUrl}/notes/${note.week}/${note.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...noteUrls,
  ];
}
