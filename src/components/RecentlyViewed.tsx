"use client";

import { useState } from "react";
import Link from "next/link";

interface ViewedNote {
  week: string;
  slug: string;
  title: string;
  date: string;
  viewedAt: number;
}

function getRecent(): ViewedNote[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("recentlyViewed");
    return stored ? JSON.parse(stored).slice(0, 5) : [];
  } catch {
    return [];
  }
}

export default function RecentlyViewed() {
  const [recent] = useState<ViewedNote[]>(getRecent);

  if (recent.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 mb-10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-3">
        Recently viewed
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {recent.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.week}/${note.slug}`}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            {note.title.length > 30 ? note.title.slice(0, 30) + "\u2026" : note.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
