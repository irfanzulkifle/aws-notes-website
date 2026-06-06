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
    <div className="mb-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
        Recently viewed
      </h3>
      <div className="flex gap-1.5 overflow-x-auto">
        {recent.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.week}/${note.slug}`}
            className="flex-shrink-0 px-2.5 py-1 rounded-md text-[12px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap"
          >
            {note.title.length > 28 ? note.title.slice(0, 28) + "\u2026" : note.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
