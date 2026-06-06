"use client";

import { useState, useCallback, useEffect } from "react";
import DocSidebar from "./DocSidebar";

interface DocLayoutProps {
  weeks: string[];
  notesByWeek: Record<string, { week: string; slug: string; title: string; date: string; day: string }[]>;
  weeksWithSummary: string[];
  currentWeek: string;
  currentSlug: string;
  children: React.ReactNode;
  toc?: React.ReactNode;
}

export default function DocLayout({
  weeks,
  notesByWeek,
  weeksWithSummary,
  currentWeek,
  currentSlug,
  children,
  toc,
}: DocLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  return (
    <div className="doc-layout">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 lg:gap-8 relative">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 left-4 z-40 lg:hidden w-9 h-9 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Open navigation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}

        <aside className="hidden lg:block w-52 shrink-0 py-6">
          <div className="sticky top-13 h-[calc(100vh-3.25rem)] overflow-y-auto sidebar-scroll pr-1 -mr-1">
            <DocSidebar
              weeks={weeks}
              notesByWeek={notesByWeek}
              weeksWithSummary={weeksWithSummary}
              currentWeek={currentWeek}
              currentSlug={currentSlug}
            />
          </div>
        </aside>

        <aside
          className={`fixed top-13 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto transition-transform duration-200 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Sidebar navigation"
        >
          <div className="p-3 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Navigation
              </span>
              <button
                onClick={closeMobile}
                className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                aria-label="Close navigation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DocSidebar
              weeks={weeks}
              notesByWeek={notesByWeek}
              weeksWithSummary={weeksWithSummary}
              currentWeek={currentWeek}
              currentSlug={currentSlug}
            />
          </div>
        </aside>

        <main className="flex-1 min-w-0 py-6">
          <article className="max-w-[720px]">
            {children}
          </article>
        </main>

        {toc && (
          <aside className="hidden xl:block w-48 shrink-0 py-6">
            <div className="sticky top-13 h-[calc(100vh-3.25rem)] overflow-y-auto sidebar-scroll pr-1 -mr-1 pl-4 border-l border-zinc-100 dark:border-zinc-800">
              {toc}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
