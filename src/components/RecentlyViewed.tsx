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
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
        Recently viewed
      </h3>
      <div className="flex flex-wrap gap-1">
        {recent.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.week}/${note.slug}`}
            className="px-2 py-0.5 rounded text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {note.title.length > 32 ? note.title.slice(0, 32) + "…" : note.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
