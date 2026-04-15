"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LearningPath() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "math";
  
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(`completed_lessons_${subject}`) || "[]"
    );
    setCompletedLessons(saved);
  }, [subject]);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const response = await fetch("/data/paths.json");
        const pathsData = await response.json();
        
        let subjectPath;
        
        if (Array.isArray(pathsData)) {
          subjectPath = pathsData.find(
            (p: any) => p.subject.toLowerCase() === subject.toLowerCase()
          );
        } else if (pathsData[subject]) {
          subjectPath = pathsData[subject];
        }
        
        if (subjectPath) {
          const pathArray = Array.isArray(subjectPath) ? subjectPath : subjectPath.path;
          setLevels(pathArray);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading paths:", error);
        setLoading(false);
      }
    };

    loadLevels();
  }, [subject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-semibold">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  const subjectEmojis: Record<string, string> = {
    math: "📐",
    python: "🐍",
    ort: "🔧"
  };

  const emoji = subjectEmojis[subject] || "⭐";
  const progress = (completedLessons.length / levels.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 py-8 px-4 relative overflow-hidden">
      {/* Animated background clouds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-20 bg-white rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-18 bg-white rounded-full opacity-25 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/subjects">
            <button className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 backdrop-blur-sm text-slate-700 font-semibold transition">
              ← Back
            </button>
          </Link>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl">{emoji}</span>
              <h1 className="text-4xl font-bold text-slate-800 capitalize drop-shadow-lg">
                {subject} Quest
              </h1>
            </div>
            <p className="text-lg text-slate-700 font-medium">
              Complete challenges to advance
            </p>
          </div>

          {/* Progress Stats */}
          <div className="mt-8 flex justify-center items-center gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <p className="text-2xl font-bold text-amber-600">
                {completedLessons.length}/{levels.length}
              </p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <p className="text-2xl font-bold text-sky-600">
                {Math.round(progress)}%
              </p>
              <p className="text-sm text-slate-600">Progress</p>
            </div>
          </div>
        </div>

        {/* Learning Path - Diagonal Grid */}
        {levels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-600">No challenges available</p>
          </div>
        ) : (
          <div className="space-y-6 pb-12">
            {levels.map((level, i) => {
              const isCompleted = completedLessons.includes(level.id);
              const isCurrent =
                !isCompleted &&
                (i === 0 || completedLessons.includes(levels[i - 1].id));
              const isLocked = !isCompleted && !isCurrent;

              const levelIcons: Record<string, string> = {
                lesson: "📖",
                quiz: "❓",
                chest: "🎁",
                trophy: "🏆"
              };

              const levelColors = {
                lesson: "from-blue-400 to-blue-500",
                quiz: "from-purple-400 to-purple-500",
                chest: "from-yellow-300 to-yellow-400",
                trophy: "from-amber-300 to-amber-400"
              };

              return (
                <div key={level.id} className="relative">
                  {/* Connector Line */}
                  {i < levels.length - 1 && (
                    <div className="absolute left-1/2 top-20 w-1 h-12 bg-gradient-to-b from-slate-400 to-transparent -translate-x-1/2 opacity-40"></div>
                  )}

                  <Link
                    href={
                      isLocked
                        ? "#"
                        : `/lessons/${level.id}?subject=${subject}`
                    }
                  >
                    <div className="relative group">
                      {/* Level Card */}
                      <div
                        className={`relative mx-auto w-full max-w-xs transition-all duration-300 ${
                          isLocked ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"
                        }`}
                      >
                        {/* Background glow */}
                        <div
                          className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300 ${
                            isCompleted
                              ? "bg-gradient-to-r from-green-400 to-emerald-400"
                              : isCurrent
                                ? "bg-gradient-to-r from-amber-300 to-orange-300"
                                : "bg-gradient-to-r from-slate-300 to-slate-400"
                          }`}
                        ></div>

                        {/* Card */}
                        <div
                          className={`relative rounded-2xl shadow-xl overflow-hidden border-4 transition-all duration-300 ${
                            isCompleted
                              ? "bg-gradient-to-br from-green-300 to-emerald-400 border-green-500 scale-100"
                              : isCurrent
                                ? `bg-gradient-to-br ${levelColors[level.type as keyof typeof levelColors] || "from-slate-300 to-slate-400"} border-white scale-100 ring-4 ring-white/50 shadow-2xl`
                                : "bg-gradient-to-br from-slate-300 to-slate-400 border-slate-500 opacity-75"
                          }`}
                        >
                          <div className="p-6 text-center">
                            {/* Level Number Badge */}
                            <div className="inline-block mb-4">
                              <div className="w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center font-bold text-lg text-slate-800">
                                {i + 1}
                              </div>
                            </div>

                            {/* Icon */}
                            <div className="text-5xl mb-3 inline-block animate-bounce" style={{
                              animationDuration: isCurrent ? "2s" : "4s",
                              animationDelay: `${i * 0.1}s`
                            }}>
                              {levelIcons[level.type] || "⭐"}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-800 capitalize mb-1">
                              {level.type}
                            </h3>

                            {/* Status */}
                            <div className="flex justify-center mb-3">
                              {isCompleted && (
                                <span className="px-3 py-1 rounded-full bg-white/40 text-green-700 text-xs font-bold">
                                  ✓ COMPLETE
                                </span>
                              )}
                              {isCurrent && (
                                <span className="px-3 py-1 rounded-full bg-white/40 text-amber-700 text-xs font-bold animate-pulse">
                                  ▶ CURRENT
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-slate-700 font-medium">
                              {level.type === "lesson"
                                ? "Learn & Practice"
                                : level.type === "quiz"
                                  ? "Test Your Skills"
                                  : level.type === "chest"
                                    ? "Unlock Bonus"
                                    : "Milestone"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cloud Overlay for Locked */}
                      {isLocked && (
                        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                          {/* Cloud shapes */}
                          <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 400 200"
                            preserveAspectRatio="none"
                          >
                            {/* Cloud 1 */}
                            <g opacity="0.85" fill="white">
                              <circle cx="80" cy="50" r="35" />
                              <circle cx="120" cy="45" r="40" />
                              <circle cx="150" cy="55" r="32" />
                            </g>

                            {/* Cloud 2 */}
                            <g opacity="0.8" fill="white">
                              <circle cx="250" cy="100" r="38" />
                              <circle cx="290" cy="95" r="42" />
                              <circle cx="320" cy="110" r="35" />
                            </g>

                            {/* Cloud 3 */}
                            <g opacity="0.75" fill="white">
                              <circle cx="150" cy="140" r="32" />
                              <circle cx="190" cy="135" r="38" />
                            </g>
                          </svg>

                          {/* Lock Icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-3xl drop-shadow-lg">🔒</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* Completion Screen */}
            {completedLessons.length === levels.length && (
              <div className="mt-12 text-center space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl">
                <div className="text-6xl animate-bounce">🏆</div>
                <h2 className="text-4xl font-bold text-slate-800">
                  Quest Complete!
                </h2>
                <p className="text-lg text-slate-600">
                  You've mastered {subject}! 🎉
                </p>
                <Link href="/subjects">
                  <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold text-lg hover:shadow-lg transition transform hover:scale-105 shadow-lg">
                    Choose New Subject
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}