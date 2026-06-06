"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();
  const attemptedRef = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("scrollToHeading");
    if (!stored) return;
    sessionStorage.removeItem("scrollToHeading");

    const q = stored.toLowerCase().replace(/[#*`~_\[\]()]/g, "").trim();

    let attempts = 0;
    const maxAttempts = 15;
    const interval = 250;

    const tryScroll = () => {
      attempts++;
      const els = document.querySelectorAll<HTMLElement>(".prose h2, .prose h3, .prose h4");
      for (const el of els) {
        const text = (el.textContent ?? "").replace(/[#*`~_\[\]()]/g, "").trim().toLowerCase();
        if (text.includes(q) || q.includes(text)) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, interval);
      }
    };

    tryScroll();
  }, [pathname]);

  return null;
}