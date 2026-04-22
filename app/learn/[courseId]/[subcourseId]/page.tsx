"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";

interface Lesson {
  id: string;
  title: string;
  position: string;
  type: string;
  icon?: string;
}

export default function LessonsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const subCourseId = params.subCourseId as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    subCourseName: "",
  });

  // Load completed lessons from localStorage
  useEffect(() => {
    const key = `completed_${courseId}_${subCourseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, [courseId, subCourseId]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load course index to get names
        const indexResponse = await fetch("/data/subcourses.json");
        const indexData = await indexResponse.json();

        const course = indexData.courses.find((c: any) => c.id === courseId);
        const subCourse = course?.subCourses.find(
          (sc: any) => sc.id === subCourseId
        );

        if (course && subCourse) {
          setCourseInfo({
            courseName: course.name,
            subCourseName: subCourse.name,
          });
        }

        // Map subCourseId to data file
        const fileMapping: { [key: string]: string } = {
          "pre-algebra": "math",
          "algebra-1": "math",
          "geometry": "math",
          "python-basics": "python",
          "javascript": "javascript",
          "web-dev": "web-dev",
          "physics": "physics",
          "chemistry": "chemistry",
          "biology": "biology",
          "ort": "ort",
          "ielts": "ielts",
          "sat": "sat",
        };

        const dataFileName = fileMapping[subCourseId] || courseId;

        // Load course data
        let dataResponse = await fetch(`/data/${dataFileName}.json`);

        if (!dataResponse.ok) {
          dataResponse = await fetch(`/data/${courseId}.json`);
        }

        if (!dataResponse.ok) {
          throw new Error("Failed to load lesson data");
        }

        const data = await dataResponse.json();
        setLessons(data.path || []);
      } catch (error) {
        console.error("Error loading content:", error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [courseId, subCourseId]);

  const isLessonLocked = (index: number) => {
    if (index === 0) return false; // First lesson is always available
    return !completedLessons.has(lessons[index - 1].id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-semibold">Loading lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round(
    (completedLessons.size / Math.max(lessons.length, 1)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100">
      <Header />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Compact Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link href="/courses" className="text-sm text-slate-600 hover:text-slate-900 font-semibold">
                  ← Back
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mt-2">
                  {courseInfo.subCourseName}
                </h1>
                <p className="text-sm text-slate-600">
                  {completedLessons.size} of {lessons.length} completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-purple-600">
                  {progress}%
                </div>
                <p className="text-xs text-slate-600">Progress</p>
              </div>
            </div>

            {/* Compact Progress Bar */}
            <div className="h-2 bg-slate-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Compact Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lessons.map((lesson, idx) => {
              const isLocked = isLessonLocked(idx);
              const isCompleted = completedLessons.has(lesson.id);

              return (
                <div key={lesson.id}>
                  {isLocked ? (
                    <div
                      className={`relative bg-white rounded-xl p-4 shadow-md border-2 border-slate-300 opacity-60 cursor-not-allowed`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                            {lesson.type}
                          </p>
                          <h3 className="text-sm font-bold text-slate-700 truncate">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="text-2xl ml-2 flex-shrink-0">🔒</div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Complete lesson {idx} first
                      </p>
                    </div>
                  ) : (
                    <Link
                      href={`/lessons/${lesson.id}?course=${courseId}&subcourse=${subCourseId}&onComplete=${lesson.id}`}
                    >
                      <div
                        className={`relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition transform hover:scale-105 border-2 cursor-pointer group ${
                          isCompleted
                            ? "border-green-400 bg-green-50"
                            : lesson.type === "quiz"
                            ? "border-orange-400 hover:border-orange-600"
                            : lesson.type === "interactive"
                            ? "border-purple-400 hover:border-purple-600"
                            : "border-blue-400 hover:border-blue-600"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                              {lesson.type}
                            </p>
                            <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-purple-600 transition">
                              {lesson.title}
                            </h3>
                          </div>
                          <div className="text-lg ml-2 flex-shrink-0">
                            {isCompleted ? "✅" : lesson.icon || "📚"}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-semibold">
                            #{idx + 1}
                          </span>
                          {!isCompleted && (
                            <span className="text-sm group-hover:translate-x-1 transition">
                              →
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* No lessons message */}
          {lessons.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-lg font-bold text-slate-700">No lessons found</p>
              <Link href="/courses">
                <button className="mt-4 px-6 py-2 rounded-lg bg-purple-500 text-white font-bold hover:shadow-lg transition text-sm">
                  Back to Courses
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}