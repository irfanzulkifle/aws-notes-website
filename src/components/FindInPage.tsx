"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function FindInPage() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const marksRef = useRef<HTMLSpanElement[]>([]);

  const clearHighlights = useCallback(() => {
    marksRef.current.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        const text = document.createTextNode(mark.textContent || "");
        parent.replaceChild(text, mark);
        parent.normalize();
      }
    });
    marksRef.current = [];
  }, []);

  const performSearch = useCallback(
    (q: string): number => {
      clearHighlights();
      if (!q.trim()) return 0;

      const root = document.querySelector("main") || document.body;
      const qLower = q.toLowerCase();
      const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const el = node.parentElement;
          if (
            !el ||
            el.closest("[data-find-bar]") ||
            el.tagName === "SCRIPT" ||
            el.tagName === "STYLE" ||
            el.tagName === "TEXTAREA" ||
            (el as HTMLInputElement).type === "text"
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.textContent?.toLowerCase().includes(qLower)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      });

      const nodes: Text[] = [];
      let node = treeWalker.nextNode() as Text | null;
      while (node) {
        nodes.push(node);
        node = treeWalker.nextNode() as Text | null;
      }

      let count = 0;

      for (const textNode of nodes) {
        const text = textNode.textContent || "";
        const lowerText = text.toLowerCase();
        const matches: number[] = [];
        let pos = lowerText.indexOf(qLower);
        while (pos !== -1) {
          matches.push(pos);
          pos = lowerText.indexOf(qLower, pos + qLower.length);
        }

        for (let i = matches.length - 1; i >= 0; i--) {
          const start = matches[i];
          try {
            const range = document.createRange();
            range.setStart(textNode, start);
            range.setEnd(textNode, start + q.length);
            const mark = document.createElement("mark");
            mark.className = "find-highlight";
            range.surroundContents(mark);
            marksRef.current.push(mark);
            count++;
          } catch {
            // skip cross-boundary ranges
          }
        }
      }

      marksRef.current.reverse();
      return count;
    },
    [clearHighlights]
  );

  const scrollToMatch = useCallback((index: number) => {
    marksRef.current.forEach((m) => {
      m.classList.remove("find-highlight-active");
    });
    const mark = marksRef.current[index];
    if (mark) {
      mark.classList.add("find-highlight-active");
      mark.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const goNext = useCallback(() => {
    setCurrent((c) => {
      const next = (c + 1) % total;
      scrollToMatch(next);
      return next;
    });
  }, [total, scrollToMatch]);

  const goPrev = useCallback(() => {
    setCurrent((c) => {
      const prev = (c - 1 + total) % total;
      scrollToMatch(prev);
      return prev;
    });
  }, [total, scrollToMatch]);

  const close = useCallback(() => {
    setOpen(false);
    clearHighlights();
    setQuery("");
    setTotal(0);
    setCurrent(0);
  }, [clearHighlights]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.includes("Mac");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "f") {
        e.preventDefault();
        setOpen(true);
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const t = setTimeout(() => {
      const count = performSearch(query);
      setTotal(count);
      setCurrent(0);
    }, 150);

    return () => clearTimeout(t);
  }, [query, open, performSearch]);

  useEffect(() => {
    if (!open) return;
    if (total > 0 && current >= 0) {
      scrollToMatch(current);
    }
  }, [current, total, open, scrollToMatch]);

  if (!open) return null;

  return (
    <>
      <div
        data-find-bar
        className="fixed top-16 right-4 sm:right-8 z-50 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border transition-all"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: "rgba(229,231,235,0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <svg
          className="w-3.5 h-3.5 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) goPrev();
              else goNext();
            }
            if (e.key === "Escape") close();
          }}
          placeholder="Find in page..."
          className="w-44 sm:w-56 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          spellCheck={false}
          autoComplete="off"
        />

        {query && (
          <span className="text-[11px] font-mono text-gray-500 shrink-0 min-w-[3.5rem] text-center tabular-nums">
            {total > 0 ? `${current + 1}/${total}` : "0"}
          </span>
        )}

        {query && total > 0 && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={goPrev}
              className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Previous match"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Next match"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={close}
          className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Close"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        .dark [data-find-bar] {
          background: rgba(15, 23, 42, 0.92) !important;
          border-color: rgba(51, 65, 85, 0.8) !important;
        }
        .dark [data-find-bar] input {
          color: #e2e8f0;
        }
        .dark [data-find-bar] input::placeholder {
          color: #64748b;
        }
        .dark [data-find-bar] svg {
          color: #64748b;
        }
        .dark [data-find-bar] span {
          color: #94a3b8;
        }
        .dark [data-find-bar] button {
          color: #64748b;
        }
        .dark [data-find-bar] button:hover {
          color: #e2e8f0 !important;
          background: rgba(51, 65, 85, 0.5) !important;
        }
      `}</style>
    </>
  );
}
