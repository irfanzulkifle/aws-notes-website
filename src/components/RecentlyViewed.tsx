"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ViewedNote {
  week: string;
  slug: string;
  title: string;
  date: string;
  viewedAt: number;
}

export default function RecentlyViewed() {
  const [recent, setRecent] = useState<ViewedNote[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mb-10">
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
