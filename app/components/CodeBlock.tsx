"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filePath: string;
  title?: string;
}

export default function CodeBlock({
  code,
  language = "typescriptreact",
  filePath,
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting colors
  const highlightCode = (code: string) => {
    let highlighted = code;

    // Keywords
    highlighted = highlighted.replace(
      /\b(import|from|export|default|function|const|let|var|return|if|else|for|while|async|await|interface|type|class|extends|print|def|class|if|else|for|while|import|from|return|True|False|None)\b/g,
      '<span class="text-blue-400">$1</span>'
    );

    // Strings
    highlighted = highlighted.replace(
      /(['"`])(.*?)\1/g,
      '<span class="text-green-400">$1$2$1</span>'
    );

    // Comments
    highlighted = highlighted.replace(
      /(\/\/.*?)$/gm,
      '<span class="text-gray-500">$1</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="text-yellow-400">$1</span>'
    );

    return highlighted;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="text-lg">{'</>'}</span>
          <div>
            {title && <p className="text-sm text-slate-400 font-semibold">{title}</p>}
            <p className="text-xs text-slate-400">{filePath}</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="text-sm text-slate-400 hover:text-slate-200 transition px-3 py-1 rounded bg-slate-700/30 hover:bg-slate-700/60"
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4 font-mono text-sm">
        <pre className="text-slate-200 leading-relaxed">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(code),
            }}
          />
        </pre>
      </div>
    </div>
  );
}