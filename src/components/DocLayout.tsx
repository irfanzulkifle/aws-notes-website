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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 lg:gap-12 relative">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 left-4 z-40 lg:hidden w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          aria-label="Open navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}

        {/* Left sidebar (Desktop) */}
        <aside className="hidden lg:block w-60 shrink-0 py-8">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto sidebar-scroll pr-2 -mr-2">
            <DocSidebar
              weeks={weeks}
              notesByWeek={notesByWeek}
              weeksWithSummary={weeksWithSummary}
              currentWeek={currentWeek}
              currentSlug={currentSlug}
            />
          </div>
        </aside>

        {/* Left sidebar (Mobile Drawer) */}
        <aside
          className={`fixed top-16 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#0B0F1A] border-r border-gray-100 dark:border-slate-800 overflow-y-auto transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Sidebar navigation"
        >
          <div className="p-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Navigation
              </span>
              <button
                onClick={closeMobile}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
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

        {/* Main content */}
        <main className="flex-1 min-w-0 py-8">
          <article className="max-w-[800px]">
            {children}
          </article>
        </main>

        {/* Right TOC sidebar */}
        {toc && (
          <aside className="hidden xl:block w-56 shrink-0 py-8">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto sidebar-scroll pr-2 -mr-2 pl-4 border-l border-gray-100 dark:border-slate-800">
              {toc}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
