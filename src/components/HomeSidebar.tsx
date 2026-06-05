"use client";

interface WeekInfo {
  key: string;
  label: string;
  count: number;
}

interface Props {
  weeks: WeekInfo[];
  activeWeek: string;
  onWeekClick: (key: string) => void;
  notesCount: number;
}

export default function HomeSidebar({ weeks, activeWeek, onWeekClick, notesCount }: Props) {
  const handleWeekClick = (key: string) => {
    onWeekClick(key);
    const el = document.getElementById(`week-${key}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-slate-500 mb-3">
            Weeks
          </h4>
          <nav className="space-y-0.5" aria-label="Week navigation">
            {weeks.map((w) => (
              <button
                key={w.key}
                onClick={() => handleWeekClick(w.key)}
                className={`block w-full text-left text-xs leading-relaxed py-1.5 px-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                  activeWeek === w.key
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-medium"
                    : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="truncate">{w.label.replace("Week ", "W")}</span>
                  <span className="text-[10px] font-mono ml-2 opacity-60">{w.count}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-slate-500 mb-2">
            Topics
          </h4>
          <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
            {notesCount} notes across {weeks.length} weeks
          </p>
        </div>
      </div>
    </aside>
  );
}