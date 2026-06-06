"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchHighlighter() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("q");
    if (!query) return;

    const container = document.querySelector(".prose");
    if (!container) return;

    // Clear old highlights
    container.querySelectorAll("mark.search-highlight").forEach((mark) => {
      const text = document.createTextNode(mark.textContent || "");
      mark.parentNode?.replaceChild(text, mark);
    });
    container.normalize();

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const nodesToReplace: { node: Text; matches: { text: string; isMatch: boolean }[] }[] = [];
    
    let node;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      if (textNode.nodeValue && regex.test(textNode.nodeValue)) {
        const parts = textNode.nodeValue.split(regex);
        const matches = parts.map((part, i) => ({
          text: part,
          isMatch: i % 2 === 1,
        }));
        nodesToReplace.push({ node: textNode, matches });
      }
      regex.lastIndex = 0;
    }

    let firstMatch: HTMLElement | null = null;

    nodesToReplace.forEach(({ node, matches }) => {
      const fragment = document.createDocumentFragment();
      matches.forEach(({ text, isMatch }) => {
        if (isMatch) {
          const mark = document.createElement("mark");
          mark.className = "search-highlight bg-yellow-200 dark:bg-yellow-800/60 text-gray-900 dark:text-gray-100 rounded px-0.5 font-semibold";
          mark.textContent = text;
          if (!firstMatch) firstMatch = mark;
          fragment.appendChild(mark);
        } else {
          fragment.appendChild(document.createTextNode(text));
        }
      });
      node.parentNode?.replaceChild(fragment, node);
    });

    // Scroll to the first match
    if (firstMatch) {
      const matchEl = firstMatch as HTMLElement;
      const y = matchEl.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top: y, behavior: "smooth" });
      
      // Flash animation on the first match
      matchEl.classList.add("ring-2", "ring-indigo-400", "dark:ring-indigo-500", "rounded");
      const timeoutId = setTimeout(() => {
        matchEl.classList.remove("ring-2", "ring-indigo-400", "dark:ring-indigo-500");
      }, 2000);

      // Cleanup timeout on unmount or re-run
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams]);

  return null;
}
