"use client";

import React from "react";

export type CalloutType = "tip" | "important" | "warning" | "exam" | "best-practice";

const CALLOUT_CONFIG: Record<CalloutType, { title: string; titleColor: string; borderColor: string; bgColor: string; icon: React.ReactNode }> = {
  tip: {
    title: "Tip",
    titleColor: "text-zinc-700 dark:text-zinc-200",
    borderColor: "border-l-zinc-400",
    bgColor: "bg-zinc-50/50 dark:bg-zinc-800/50",
    icon: (
      <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  important: {
    title: "Important",
    titleColor: "text-amber-800 dark:text-amber-200",
    borderColor: "border-l-amber-400",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/30",
    icon: (
      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  warning: {
    title: "Warning",
    titleColor: "text-red-800 dark:text-red-200",
    borderColor: "border-l-red-400",
    bgColor: "bg-red-50/50 dark:bg-red-950/30",
    icon: (
      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  exam: {
    title: "Exam Tip",
    titleColor: "text-blue-800 dark:text-blue-200",
    borderColor: "border-l-blue-400",
    bgColor: "bg-blue-50/50 dark:bg-blue-950/30",
    icon: (
      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  "best-practice": {
    title: "Best Practice",
    titleColor: "text-emerald-800 dark:text-emerald-200",
    borderColor: "border-l-emerald-400",
    bgColor: "bg-emerald-50/50 dark:bg-emerald-950/30",
    icon: (
      <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className={`my-4 rounded-r-md border-l-2 ${config.borderColor} ${config.bgColor} px-3 py-2.5`}>
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 mt-0.5" aria-hidden="true">
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-[12px] font-semibold mb-0.5 ${config.titleColor}`}>
            {displayTitle}
          </p>
          <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300 [&>p:last-child]:mb-0 [&>p]:text-[13px] [&>p]:leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
