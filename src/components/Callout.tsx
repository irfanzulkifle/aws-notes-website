"use client";

import React from "react";

export type CalloutType = "tip" | "important" | "warning" | "exam" | "best-practice";

const CALLOUT_CONFIG: Record<CalloutType, { title: string; titleColor: string; borderColor: string; bgColor: string; icon: React.ReactNode }> = {
  tip: {
    title: "Tip",
    titleColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-l-teal-500",
    bgColor: "bg-teal-50/50 dark:bg-teal-950/30",
    icon: (
      <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  important: {
    title: "Important",
    titleColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/30",
    icon: (
      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  warning: {
    title: "Warning",
    titleColor: "text-red-700 dark:text-red-300",
    borderColor: "border-l-red-500",
    bgColor: "bg-red-50/50 dark:bg-red-950/30",
    icon: (
      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  exam: {
    title: "Exam Tip",
    titleColor: "text-indigo-700 dark:text-indigo-300",
    borderColor: "border-l-indigo-500",
    bgColor: "bg-indigo-50/50 dark:bg-indigo-950/30",
    icon: (
      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  "best-practice": {
    title: "Best Practice",
    titleColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-l-emerald-500",
    bgColor: "bg-emerald-50/50 dark:bg-emerald-950/30",
    icon: (
      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export default function Callout({ type = "tip", title, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const displayTitle = title || config.title;

  return (
    <div className={`my-6 rounded-r-xl border-l-4 ${config.borderColor} ${config.bgColor} p-4`}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5" aria-hidden="true">
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold mb-1 ${config.titleColor}`}>
            {displayTitle}
          </p>
          <div className="prose prose-sm max-w-none text-gray-700 dark:text-slate-300 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
