"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/[:]/g, "_");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "inherit",
          themeVariables: {
            background: "transparent",
          },
        });

        if (cancelled || !containerRef.current) return;
        const renderId = `mermaid-${id}`;
        const result = await mermaid.render(renderId, chart.trim());
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-4 rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 text-[13px]">
        <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Mermaid render error</div>
        <pre className="text-red-800 dark:text-red-300 whitespace-pre-wrap break-words text-[12px] font-mono">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
