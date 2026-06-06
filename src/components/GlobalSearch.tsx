"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchSection {
  heading: string;
  slug: string;
  content: string;
}

interface SearchDocument {
  title: string;
  week: string;
  weekLabel: string;
  slug: string;
  date: string;
  day: string;
  topics: string[];
  headings: string[];
  sections: SearchSection[];
  body: string;
  url: string;
}

const POPULAR_TOPICS = [
  "EC2",
  "S3",
  "IAM",
  "VPC",
  "Lambda",
  "CloudFront",
  "Networking",
  "Security",
  "Linux",
  "Python",
  "SQL",
  "Database",
] as const;

const MAX_RECENT = 5;

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length <= 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} aria-hidden="true">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function getSnippet(doc: SearchDocument, query: string): string {
  if (!query.trim()) return "";
  const lower = query.toLowerCase();
  const sectionText = doc.sections ? doc.sections.map((s) => s.content).join(" ") : "";
  const allContent = [doc.body, sectionText, ...doc.headings].join(" ");
  const idx = allContent.toLowerCase().indexOf(lower);
  if (idx === -1) return allContent.slice(0, 100);
  const start = Math.max(0, idx - 30);
  const end = Math.min(allContent.length, idx + query.length + 60);
  let snippet = allContent.slice(start, end);
  if (start > 0) snippet = "\u2026" + snippet;
  if (end < allContent.length) snippet = snippet + "\u2026";
  return snippet;
}

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  try {
    const stored = getRecentSearches();
    const updated = [query, ...stored.filter((s) => s !== query)].slice(0, MAX_RECENT);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function clearRecentSearches() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("recentSearches");
}

interface GlobalSearchProps {
  onToggle?: (open: boolean) => void;
}

export default function GlobalSearch({ onToggle }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchDocument[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  const loading = open && index.length === 0;

  const openModal = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIdx(0);
    setRecentSearches(getRecentSearches());
    onToggle?.(true);
  }, [onToggle]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIdx(0);
    onToggle?.(false);
  }, [onToggle]);

  useEffect(() => {
    if (open && index.length === 0) {
      fetch("/api/search-index")
        .then((r) => r.json())
        .then((data: SearchDocument[]) => setIndex(data))
        .catch(() => {});
    }
  }, [open, index.length]);

  const fuse = useMemo(() => {
    if (index.length === 0) return null;
    return new Fuse(index, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "topics", weight: 0.3 },
        { name: "sections.heading", weight: 0.25 },
        { name: "headings", weight: 0.2 },
        { name: "sections.content", weight: 0.15 },
        { name: "body", weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [index]);

  const results = useMemo(() => {
    if (!fuse || !query.trim()) return [];
    const raw = fuse.search(query.trim());
    return raw.slice(0, 15).map((r) => r.item);
  }, [fuse, query]);

  useEffect(() => {
    const handleOpen = () => openModal();
    window.addEventListener("openGlobalSearch", handleOpen);
    return () => window.removeEventListener("openGlobalSearch", handleOpen);
  }, [openModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && (e.key === "/" || e.key.toLowerCase() === "k")) {
        e.preventDefault();
        if (open) {
          closeModal();
        } else {
          openModal();
        }
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openModal, closeModal]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = "";
        clearTimeout(timer);
      };
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }

      const items = query.trim() ? results : null;
      const recentCount = !query.trim() ? recentSearches.length : 0;
      const totalItems = (items ? items.length : 0) + (query.trim() ? 0 : recentCount);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % Math.max(1, totalItems));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev - 1 + Math.max(1, totalItems)) % Math.max(1, totalItems));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (query.trim() && results.length > 0) {
          const selected = results[selectedIdx];
          if (selected) {
            saveRecentSearch(query.trim());
            closeModal();
            
            const searchQuery = encodeURIComponent(query.trim());
            const url = `${selected.url}?q=${searchQuery}`;
            router.push(url);
          }
        } else if (!query.trim() && recentSearches.length > 0 && selectedIdx < recentSearches.length) {
          const term = recentSearches[selectedIdx];
          setQuery(term);
          inputRef.current?.focus();
        }
        return;
      }
    },
    [query, results, selectedIdx, recentSearches, closeModal, router]
  );

  useEffect(() => {
    if (selectedIdx >= 0 && listRef.current) {
      const item = listRef.current.children[selectedIdx] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIdx]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIdx(0);
  }, []);

  const handleResultClick = useCallback(
    (doc: SearchDocument) => {
      saveRecentSearch(query.trim() || doc.title);
      closeModal();
      
      const searchQuery = encodeURIComponent(query.trim());
      const url = `${doc.url}?q=${searchQuery}`;
      router.push(url);
    },
    [query, closeModal, router]
  );

  const handleRecentClick = useCallback(
    (term: string) => {
      setQuery(term);
      inputRef.current?.focus();
    },
    []
  );

  const handleTopicClick = useCallback(
    (topic: string) => {
      saveRecentSearch(topic);
      setQuery(topic);
      inputRef.current?.focus();
    },
    []
  );

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  if (!open) return null;

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search notes"
      onClick={closeModal}
    >
      <div
        className="search-panel"
        onClick={(e) => e.stopPropagation()}
        role="search"
      >
        <div className="search-input-wrapper">
          <svg
            className="search-input-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Search notes..."
            className="search-input"
            aria-label="Search notes"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              className="search-clear-btn"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="search-kbd">
            <span className="text-[9px]">ESC</span>
          </kbd>
        </div>

        {loading && (
          <div className="search-body">
            <div className="flex items-center justify-center py-8">
              <div className="w-4 h-4 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-500 dark:border-t-zinc-400 rounded-full animate-spin" />
            </div>
          </div>
        )}

        {!loading && !query.trim() && (
          <div className="search-body">
            {recentSearches.length > 0 && (
              <div className="search-section">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="search-section-title">Recent</span>
                  <button
                    onClick={handleClearRecent}
                    className="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((term, i) => (
                    <button
                      key={term}
                      onClick={() => handleRecentClick(term)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleRecentClick(term);
                        }
                      }}
                      className={`search-chip ${i === selectedIdx ? "search-chip-active" : ""}`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={recentSearches.length > 0 ? "search-section" : "search-section pt-0"}>
              <span className="search-section-title">Popular</span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicClick(topic)}
                    className="search-chip"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <div className="search-body">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-body">
            <div className="search-section-title mb-1.5 px-0.5">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </div>
            <ul ref={listRef} className="space-y-0.5" role="listbox">
              {results.map((doc, i) => {
                const snippet = getSnippet(doc, query);
                return (
                  <li
                    key={doc.url}
                    role="option"
                    aria-selected={i === selectedIdx}
                    onClick={() => handleResultClick(doc)}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`search-result ${i === selectedIdx ? "search-result-active" : ""}`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {highlightMatch(doc.title, query)}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {doc.date}
                        {doc.topics.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center ml-1.5 px-1 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                          >
                            {t.length > 14 ? t.slice(0, 14) + "\u2026" : t}
                          </span>
                        ))}
                      </span>
                      {snippet && (
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2">
                          {highlightMatch(snippet, query)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="search-footer">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
              <kbd className="px-1 py-0.5 rounded text-[9px] font-mono border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                {"\u2191\u2193"}
              </kbd>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
              <kbd className="px-1 py-0.5 rounded text-[9px] font-mono border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                Enter
              </kbd>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
              <kbd className="px-1 py-0.5 rounded text-[9px] font-mono border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                ESC
              </kbd>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
