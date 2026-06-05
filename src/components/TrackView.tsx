"use client";

import { useEffect } from "react";

interface Props {
  week: string;
  slug: string;
  title: string;
  date: string;
}

export default function TrackView({ week, slug, title, date }: Props) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      const list: { week: string; slug: string; title: string; date: string; viewedAt: number }[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((n) => n.slug !== slug);
      filtered.unshift({ week, slug, title, date, viewedAt: Date.now() });
      localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 10)));
    } catch {
      // ignore
    }
  }, [week, slug, title, date]);

  return null;
}
