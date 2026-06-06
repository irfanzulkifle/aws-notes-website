"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const tryScroll = () => {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    if (!tryScroll()) {
      const timer = setTimeout(() => {
        if (!tryScroll()) {
          const retry = setTimeout(tryScroll, 200);
          return () => clearTimeout(retry);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}