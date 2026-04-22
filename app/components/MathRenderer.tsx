"use client";

import { useEffect, useRef, memo } from "react";

declare global {
  interface Window {
    MathJax: any;
  }
}

const MathRenderer = memo(function MathRenderer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevContentRef = useRef<string>("");

  useEffect(() => {
    // Skip if content hasn't changed
    if (prevContentRef.current === content) return;
    prevContentRef.current = content;

    if (containerRef.current && window.MathJax) {
      try {
        // Use setTimeout to defer rendering
        const timeoutId = setTimeout(() => {
          window.MathJax.typesetPromise([containerRef.current]).catch(
            (err: any) => console.log("MathJax error:", err)
          );
        }, 0);
        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.log("MathJax error:", err);
      }
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="text-sm leading-relaxed whitespace-pre-wrap break-words text-black"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});

export default MathRenderer;