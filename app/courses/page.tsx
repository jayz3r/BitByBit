"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

interface SubCourse {
  id: string;
  name: string;
  icon: string;
  lessons: number;
  difficulty: string;
}

interface Course {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subCourses: SubCourse[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log("Loading courses from /data/subcourses.json");
        const response = await fetch("/data/subcourses.json");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log("Raw response:", text.substring(0, 100));

        const data = JSON.parse(text);
        console.log("Parsed courses:", data);

        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          throw new Error("Invalid courses format");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error loading courses:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-semibold">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center bg-red-100 p-8 rounded-2xl max-w-md">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-800 font-bold mb-4">Error Loading Courses</p>
            <p className="text-red-700 mb-4 text-sm">{error}</p>
            <p className="text-xs text-red-600 mb-4">
              Make sure <code>/public/data/subcourses.json</code> exists and has valid JSON
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-2xl text-white font-bold">No courses found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              🎓 Choose Your Course
            </h1>
            <p className="text-xl text-slate-700 mb-8">
              Select a subject to explore all available courses
            </p>
          </div>

          {/* Courses Grid - Equal Size */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {courses.map((course) => (
              <Link key={course.id} href={`/subjects/${course.id}`}>
                <div className="group relative cursor-pointer h-full">
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${course.color} rounded-3xl opacity-0 group-hover:opacity-30 transition-all duration-300 blur-2xl`}
                  ></div>

                  {/* Card */}
                  <div className="relative bg-white rounded-3xl shadow-xl p-8 transition transform hover:scale-105 hover:shadow-2xl border-4 border-transparent group-hover:border-purple-500 flex flex-col h-full ">
                    {/* Icon Background */}
                    <div
                      className={`bg-gradient-to-br ${course.color} rounded-2xl p-6 mb-6 inline-block`}
                    >
                      <span className="text-4xl">{course.icon}</span>
                    </div>

                    {/* Content */}
                    <h2 className="text-3xl font-black text-slate-800 mb-3 group-hover:text-purple-600 transition">
                      {course.name}
                    </h2>

                    <p className="text-slate-600 mb-6 text-lg line-clamp-2 flex-1">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600">
                          {course.subCourses.length}
                        </span>
                        <span className="text-slate-600 font-semibold">
                          Courses
                        </span>
                      </div>
                      <span className="text-3xl transition transform group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured Courses Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-black text-slate-800 mb-8">
              ✨ Popular Courses to Start
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Pre-Algebra",
                  icon: "🔢",
                  description: "Build your math foundation",
                  students: "12,450",
                  rating: "4.9",
                },
                {
                  title: "Python Basics",
                  icon: "🐍",
                  description: "Learn programming fundamentals",
                  students: "18,320",
                  rating: "4.8",
                },
                {
                  title: "Web Development",
                  icon: "🌐",
                  description: "Create stunning websites",
                  students: "9,870",
                  rating: "4.7",
                },
              ].map((featured, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200 hover:border-purple-400 transition"
                >
                  <div className="text-4xl mb-4">{featured.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {featured.title}
                  </h3>
                  <p className="text-slate-600 mb-4">{featured.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      👥 {featured.students}
                    </span>
                    <span className="text-yellow-500 font-bold">
                      ⭐ {featured.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}