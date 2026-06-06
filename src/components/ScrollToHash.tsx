"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem("scrollToHeading");
    if (!stored) return;

    sessionStorage.removeItem("scrollToHeading");

    const retry = (attempts: number) => {
      if (attempts <= 0) return;
      const elements = document.querySelectorAll<HTMLElement>(".prose h2, .prose h3");
      for (const el of elements) {
        const text = el.textContent?.trim() ?? "";
        if (text === stored || text.startsWith(stored) || stored.startsWith(text)) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      setTimeout(() => retry(attempts - 1), 200);
    };

    retry(10);
  }, [pathname]);

  return null;
}