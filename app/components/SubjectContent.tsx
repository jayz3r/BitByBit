"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CourseInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  students: string;
  lessons: number;
  difficulty: string;
  shortDesc: string;
}

interface CourseData {
  subject: string;
  path: {
    id: string;
    type: string;
    position: string;
    content?: string;
    examples?: any[];
    questions?: any[];
  }[];
}

export default function SubjectContent({ subject }: { subject: string | undefined }) {
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    if (!subject) {
      setError("Subject not provided");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const subjectId = String(subject).toLowerCase();
        console.log("Loading subject:", subjectId);

        const coursesRes = await fetch("/data/courses.json");
        if (!coursesRes.ok) throw new Error("Failed to load courses.json");
        
        const courses = await coursesRes.json();
        const info = courses.find((c: CourseInfo) => c.id === subjectId);
        
        if (!info) {
          setError(`Course "${subjectId}" not found`);
          setLoading(false);
          return;
        }
        
        setCourseInfo(info);

        const courseRes = await fetch(`/data/${subjectId}.json`);
        if (!courseRes.ok) throw new Error(`Failed to load course data`);
        
        const course = await courseRes.json();
        setCourseData(course);

        // Get completed lessons - only count valid IDs from the course path
        const completed = JSON.parse(
          localStorage.getItem(`completed_lessons_${subjectId}`) || "[]"
        );
        
        // Filter to only include lessons that actually exist in this course
        const validCompleted = completed.filter((id: string) =>
          course.path?.some((item: any) => item.id === id)
        );
        
        // Update localStorage with clean data
        localStorage.setItem(
          `completed_lessons_${subjectId}`,
          JSON.stringify(validCompleted)
        );
        
        setCompletedLessons(validCompleted);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setLoading(false);
      }
    };

    loadData();
  }, [subject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-semibold">Loading {subject}...</p>
        </div>
      </div>
    );
  }

  if (error || !courseInfo || !courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center">
          <p className="text-2xl text-white font-bold mb-4">Course not found</p>
          {error && <p className="text-white/80 mb-4">{error}</p>}
          <Link href="/subjects">
            <button className="px-8 py-3 rounded-lg bg-white/90 hover:bg-white text-slate-800 font-bold shadow-lg transition">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = (completedLessons.length / courseData.path.length) * 100;

  const levelIcons: Record<string, string> = {
    lesson: "📖",
    quiz: "❓",
    chest: "🎁",
    trophy: "🏆",
  };

  const getStatusBadgeClass = (isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return "bg-green-500";
    if (isCurrent) return "bg-yellow-400 animate-bounce";
    return "bg-slate-400";
  };

  const getStatusIcon = (isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return "✓";
    if (isCurrent) return "▶";
    return "🔒";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background clouds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-20 bg-white rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-18 bg-white rounded-full opacity-25 animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-1/3 w-44 h-24 bg-white rounded-full opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <Link href="/subjects">
            <button className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-700 font-semibold transition shadow-lg hover:shadow-xl">
              ← Back to All Courses
            </button>
          </Link>

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-7xl drop-shadow-xl animate-bounce" style={{ animationDuration: "2s" }}>
                {courseInfo.icon}
              </span>
              <div>
                <h1 className="text-6xl font-black text-slate-800 drop-shadow-lg">
                  {courseInfo.name}
                </h1>
                <p className="text-xl text-slate-600 font-semibold mt-2">
                  Master {courseInfo.shortDesc.toLowerCase()}
                </p>
              </div>
            </div>
            <p className="text-lg text-slate-700 font-medium drop-shadow max-w-2xl mx-auto">
              {courseInfo.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {courseData.path.length}
              </p>
              <p className="text-sm text-slate-600 font-semibold mt-1">Levels</p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {courseInfo.students}
              </p>
              <p className="text-sm text-slate-600 font-semibold mt-1">Learners</p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition transform hover:scale-105">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                {Math.round(progress)}%
              </p>
              <p className="text-sm text-slate-600 font-semibold mt-1">Progress</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600 font-semibold">Journey Progress</span>
              <span className="text-sm text-slate-600 font-semibold">
                {completedLessons.length} / {courseData.path.length}
              </span>
            </div>
            <div className="h-4 bg-white/60 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
              <div
                className={`h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transition-all duration-500 rounded-full shadow-lg`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Learning Path - Circular Style */}
        <div className="py-12">
          <div className="relative">
            {/* Vertical path line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-white/40 via-white/20 to-white/0 -translate-x-1/2"></div>

            {/* Learning items */}
            <div className="space-y-8">
              {courseData.path.map((level, i) => {
                const isCompleted = completedLessons.includes(level.id);
                const isCurrent =
                  !isCompleted &&
                  (i === 0 || completedLessons.includes(courseData.path[i - 1].id));
                const isLocked = !isCompleted && !isCurrent;

                return (
                  <div key={level.id} className="relative group">
                    {/* Circular Card */}
                    <div className="flex items-center justify-center">
                      <Link
                        href={isLocked ? "#" : `/lessons/${level.id}?subject=${subject}`}
                        className={isLocked ? "pointer-events-none" : ""}
                      >
                        <div
                          className={`relative transition-all duration-300 ${
                            isLocked ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                        >
                          {/* Outer glow */}
                          <div
                            className={`absolute rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-300 ${
                              isCompleted
                                ? "bg-gradient-to-r from-green-400/60 to-emerald-400/60"
                                : isCurrent
                                  ? "bg-gradient-to-r from-yellow-300/60 to-orange-300/60"
                                  : "bg-gradient-to-r from-slate-300/20 to-slate-400/20"
                            }`}
                            style={{ inset: "-20px" }}
                          ></div>

                          {/* Main Circle */}
                          <div
                            className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-2xl border-4 ${
                              isCompleted
                                ? "bg-gradient-to-br from-green-300 via-green-400 to-emerald-500 border-green-600 shadow-green-400/50"
                                : isCurrent
                                  ? "bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 border-yellow-500 shadow-yellow-400/50 animate-pulse"
                                  : "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 border-slate-600 shadow-slate-400/30 opacity-50"
                            }`}
                          >
                            {/* Level Number */}
                            <div className="text-5xl font-black text-white drop-shadow-lg">
                              {i + 1}
                            </div>
                            
                            {/* Icon */}
                            <div className="text-4xl mt-1">
                              {levelIcons[level.type] || "⭐"}
                            </div>

                            {/* Status Badge */}
                            <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-lg font-bold ${getStatusBadgeClass(isCompleted, isCurrent)}`}>
                              {getStatusIcon(isCompleted, isCurrent)}
                            </div>
                          </div>

                          {/* Cloud Overlay for Locked */}
                          {isLocked && (
                            <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                              <svg
                                className="absolute inset-0 w-full h-full"
                                viewBox="0 0 200 200"
                                preserveAspectRatio="xMidYMid slice"
                              >
                                <defs>
                                  <filter id="cloud-filter">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                                  </filter>
                                </defs>
                                <g opacity="0.9" fill="white" filter="url(#cloud-filter)">
                                  <circle cx="50" cy="80" r="25" />
                                  <circle cx="80" cy="70" r="30" />
                                  <circle cx="110" cy="85" r="25" />
                                  <circle cx="140" cy="90" r="28" />
                                  <circle cx="160" cy="110" r="22" />
                                </g>
                              </svg>
                              <div className="absolute text-5xl drop-shadow-xl">🔒</div>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Type Label */}
                      <div className="absolute right-0 ml-8">
                        <div className="bg-white/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/50">
                          <p className="text-sm font-bold text-slate-800 capitalize">
                            {level.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {completedLessons.length === courseData.path.length && (
          <div className="mt-20 text-center">
            <div className="mx-auto max-w-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-12 shadow-2xl border-4 border-white/50 backdrop-blur-sm">
              <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: "1s" }}>
                🏆
              </div>
              <h2 className="text-5xl font-black text-slate-800 mb-3">
                Quest Complete!
              </h2>
              <p className="text-xl text-slate-600 mb-8 font-semibold">
                🎉 You've mastered {courseInfo.name}!
              </p>
              <p className="text-slate-600 mb-8">
                Congratulations on completing this incredible learning journey! You've shown dedication and skill. Ready for the next challenge?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/subjects" className="flex-1">
                  <button className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold hover:shadow-2xl transition transform hover:scale-105 shadow-xl">
                    Explore More Courses →
                  </button>
                </Link>
                <Link href="/" className="flex-1">
                  <button className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold hover:shadow-2xl transition transform hover:scale-105 shadow-xl">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}