"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

interface Output {
  type: "input" | "output" | "error";
  content: string;
}

export default function PythonInterpreter() {
  const [code, setCode] = useState("");
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setOutputs((prev) => [...prev, { type: "input", content: code }]);

    try {
      const response = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: code,
          language: "python3",
          clientId: process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID,
          clientSecret: process.env.NEXT_PUBLIC_JDOODLE_CLIENT_SECRET,
        }),
      });

      const data = await response.json();

      if (data.output) {
        setOutputs((prev) => [
          ...prev,
          { type: "output", content: data.output.trim() },
        ]);
      } else if (data.error) {
        setOutputs((prev) => [...prev, { type: "error", content: data.error }]);
      }

      setCode("");
    } catch (error) {
      setOutputs((prev) => [
        ...prev,
        { type: "error", content: "Failed to execute code" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConsole = () => {
    setOutputs([]);
    setCode("");
  };

  const addToCode = (snippet: string) => {
    setCode((prev) => prev + snippet);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-purple-500/30">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-black text-purple-300 flex items-center gap-2">
            🐍 Python Interpreter
          </h2>
          <button
            onClick={clearConsole}
            className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold transition text-sm"
          >
            Clear
          </button>
        </div>
        <p className="text-slate-400">
          Write and run Python code instantly. Learn by experimenting!
        </p>
      </div>

      {/* Code Editor */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-purple-300 mb-3">
          📝 Write Python Code:
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="# Write your Python code here\nprint('Hello, World!')"
          className="w-full h-32 p-4 bg-slate-800 border-2 border-purple-500/30 focus:border-purple-500 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition resize-none"
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") {
              runCode();
            }
          }}
        />
        <p className="text-xs text-slate-400 mt-2">
          💡 Press Ctrl+Enter to run, or click Run Code
        </p>
      </div>

      {/* Quick Snippets */}
      <div className="mb-6">
        <p className="text-sm font-bold text-purple-300 mb-3">⚡ Quick Snippets:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() =>
              addToCode('print("Hello, World!")\n')
            }
            className="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold transition"
          >
            Print
          </button>
          <button
            onClick={() => addToCode("x = 10\nprint(x)\n")}
            className="px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-semibold transition"
          >
            Variable
          </button>
          <button
            onClick={() => addToCode('name = "Python"\nprint(name)\n')}
            className="px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold transition"
          >
            String
          </button>
          <button
            onClick={() =>
              addToCode(
                'for i in range(5):\n    print(i)\n'
              )
            }
            className="px-3 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-semibold transition"
          >
            Loop
          </button>
          <button
            onClick={() => addToCode("print(5 + 3)\n")}
            className="px-3 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-semibold transition"
          >
            Math
          </button>
          <button
            onClick={() => addToCode('name = input("Name: ")\n')}
            className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
          >
            Input
          </button>
          <button
            onClick={() => addToCode("if 5 > 3:\n    print('True')\n")}
            className="px-3 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-semibold transition"
          >
            If/Else
          </button>
          <button
            onClick={() => addToCode("x = [1, 2, 3]\nprint(x)\n")}
            className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition"
          >
            List
          </button>
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={runCode}
        disabled={loading || !code.trim()}
        className="w-full mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "▶ Running..." : "▶ Run Code"}
      </button>

      {/* Console Output */}
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-purple-300 mb-3">📤 Output:</h3>
        <div className="space-y-3 h-64 overflow-y-auto font-mono text-sm">
          {outputs.length === 0 ? (
            <p className="text-slate-500 italic">Run code to see output...</p>
          ) : (
            outputs.map((item, idx) => (
              <div key={idx}>
                {item.type === "input" && (
                  <div className="text-slate-400">
                    {/* <span className="text-purple-400"> </span> */}
                    <code className="text-slate-300">{item.content}</code>
                  </div>
                )}
                {item.type === "output" && (
                  <div className="text-green-400 ml-4 whitespace-pre-wrap break-words">
                    {item.content}
                  </div>
                )}
                {item.type === "error" && (
                  <div className="text-red-400 ml-4 whitespace-pre-wrap break-words">
                    ❌ {item.content}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-slate-300">
          💡 <strong>Pro Tips:</strong> Try printing variables, doing math, and
          testing string operations!
        </p>
      </div>
    </div>
  );
}