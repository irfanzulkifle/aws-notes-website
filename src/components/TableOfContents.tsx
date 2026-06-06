"use client";

import { useState, useEffect, useCallback } from "react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0.1 }
    );

    for (const el of headingElements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const handleClick = useCallback(
    (id: string) => {
      setMobileOpen(false);
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
      }
    },
    []
  );

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC toggle */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500 shadow-lg shadow-gray-200/50 dark:shadow-black/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          aria-label="Toggle table of contents"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>

      {/* Mobile TOC drawer */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-x-0 bottom-0 z-50 max-h-[60vh] bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 rounded-t-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              On this page
            </h4>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded"
              aria-label="Close table of contents"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="overflow-y-auto max-h-[calc(60vh-64px)] p-4 space-y-0.5" aria-label="Table of contents">
            {headings.map((h) => (
              <button
                key={h.id}
                onClick={() => handleClick(h.id)}
                className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                  h.level === 3 ? "pl-6" : ""
                } ${
                  activeId === h.id
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-medium"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
                aria-current={activeId === h.id ? "location" : undefined}
              >
                {h.text}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop TOC content — rendered inside DocLayout right sidebar */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-slate-500 mb-3">
          On this page
        </h4>
        <nav className="space-y-0.5" aria-label="Table of contents">
          {headings.map((h) => (
            <button
              key={h.id}
              onClick={() => handleClick(h.id)}
              className={`block w-full text-left text-xs leading-relaxed py-1 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 rounded ${
                h.level === 3 ? "pl-3" : ""
              } ${
                activeId === h.id
                  ? "text-indigo-600 dark:text-indigo-400 font-medium"
                  : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              }`}
              aria-current={activeId === h.id ? "location" : undefined}
            >
              {h.text}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
