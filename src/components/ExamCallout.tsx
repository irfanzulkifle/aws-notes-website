interface Props {
  children: React.ReactNode;
  content: string;
}

function isExamRelevance(content: string): boolean {
  const lower = content.toLowerCase();
  return (
    lower.includes("clf-c02") ||
    lower.includes("exam relevance") ||
    lower.includes("certified cloud practitioner")
  );
}

function getExamDomain(content: string): string | null {
  const lower = content.toLowerCase();
  if (lower.includes("domain 1") || lower.includes("cloud concepts")) return "Domain 1: Cloud Concepts";
  if (lower.includes("domain 2") || lower.includes("security")) return "Domain 2: Security & Compliance";
  if (lower.includes("domain 3") || lower.includes("technology")) return "Domain 3: Cloud Technology";
  if (lower.includes("domain 4") || lower.includes("billing")) return "Domain 4: Billing & Pricing";
  return null;
}

export default function ExamCallout({ children, content }: Props) {
  if (!isExamRelevance(content)) {
    return <blockquote>{children}</blockquote>;
  }

  const domain = getExamDomain(content);

  return (
    <div className="my-6 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/70 dark:bg-indigo-950/30 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-100/60 dark:bg-indigo-900/40 border-b border-indigo-200/60 dark:border-indigo-500/20">
        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
          CLF-C02 Exam Relevance
        </span>
        {domain && (
          <span className="ml-auto text-[10px] font-medium text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
            {domain}
          </span>
        )}
      </div>
      <div className="px-4 py-3 text-sm text-indigo-900 dark:text-indigo-200 prose-sm [&_p]:text-indigo-900 dark:[&_p]:text-indigo-200 [&_strong]:text-indigo-950 dark:[&_strong]:text-indigo-100">
        {children}
      </div>
    </div>
  );
}