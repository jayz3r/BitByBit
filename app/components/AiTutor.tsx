"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import MathRenderer from "./MathRenderer";

interface TutorMessage {
  role: "user" | "tutor";
  content: string;
  timestamp: Date;
}

export default function AiTutor({
  subject,
  lessonType,
  isOpen,
  onClose,
}: {
  subject: string;
  lessonType: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: "tutor",
      content: `Hi! 👋 I'm your ${subject} tutor. I'm here to help you understand the material better. What would you like help with?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced scroll
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages.length]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || loading) return;

      const userMessage: TutorMessage = {
        role: "user",
        content: input,
        timestamp: new Date(),
      };

      const userInput = input;
      setInput("");
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userInput,
            subject,
            lessonType,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        const tutorMessage: TutorMessage = {
          role: "tutor",
          content: data.message || "I'm having trouble responding. Please try again.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, tutorMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        const errorTutorMessage: TutorMessage = {
          role: "tutor",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorTutorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, subject, lessonType]
  );

  // Memoize message list to prevent unnecessary re-renders
  const messageList = useMemo(
    () =>
      messages.map((msg, idx) => (
        <MessageBubble key={`${idx}-${msg.timestamp.getTime()}`} message={msg} />
      )),
    [messages]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-40 p-4 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden border-2 border-purple-500/30"
      >
        {/* Header - Dark Mode */}
        <div className="bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 rounded-t-3xl p-5 flex items-center justify-between shadow-lg flex-shrink-0 border-b-2 border-purple-500/30">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl flex-shrink-0">🧑‍🏫</span>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-purple-300 truncate">
                {subject.charAt(0).toUpperCase() + subject.slice(1)} Tutor
              </h3>
              <p className="text-xs text-purple-200/70">🤖 AI Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:bg-purple-500/20 hover:text-white rounded-full p-2 transition flex-shrink-0"
            aria-label="Close tutor"
          >
            ✕
          </button>
        </div>

        {/* Messages Container - Dark Theme */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messageList}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 border-2 border-purple-500/40 px-5 py-3 rounded-2xl rounded-bl-none shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-0" />
        </div>

        {/* Input Form - Dark Mode */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t-2 border-purple-500/30 bg-slate-800/50 rounded-b-3xl shadow-lg flex-shrink-0"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your tutor... 💡"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-purple-500/30 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition disabled:opacity-50 font-medium text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-sm"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
          <p className="text-xs text-purple-300/60 mt-2">
            💡 Use $equation$ or $$equation$$ for math
          </p>
        </form>
      </div>
    </div>
  );
}

// Memoized Message Bubble Component - Dark Theme
const MessageBubble = ({ message }: { message: TutorMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl shadow-md transition ${
          isUser
            ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-none border border-purple-500/50"
            : "bg-slate-700/60 border-2 border-purple-500/30 text-slate-100 rounded-bl-none"
        }`}
      >
        <div className="text-sm leading-relaxed">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <MathRenderer content={message.content} />
          )}
        </div>
        <span
          className={`text-xs mt-2 block opacity-70 ${
            isUser ? "text-purple-200" : "text-slate-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};