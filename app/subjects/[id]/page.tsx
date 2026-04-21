"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";

interface SubCourse {
  id: string;
  name: string;
  icon: string;
  lessons: number;
  difficulty: string;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subCourses: SubCourse[];
}

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.id as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubject = async () => {
      try {
        const response = await fetch("/data/subcourses.json");
        const data = await response.json();

        const foundSubject = data.courses.find(
          (course: any) => course.id === subjectId
        );

        if (foundSubject) {
          setSubject(foundSubject);
        }
      } catch (error) {
        console.error("Error loading subject:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-semibold">Loading subject...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-2xl text-white font-bold">Subject not found</p>
            <Link href="/courses">
              <button className="mt-4 px-8 py-3 rounded-lg bg-white/90 hover:bg-white text-slate-800 font-bold shadow-lg transition">
                ← Back to Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/courses">
            <button className="mb-8 px-6 py-2 rounded-full bg-white/70 hover:bg-white/90 text-slate-700 font-semibold shadow-lg transition">
              ← Back to Courses
            </button>
          </Link>

          {/* Subject Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12 overflow-hidden relative">
            {/* Decorative background */}
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${subject.color} opacity-10 rounded-full blur-3xl`}></div>

            <div className="relative z-10 flex items-start gap-8">
              {/* Icon */}
              <div className={`bg-gradient-to-br ${subject.color} rounded-2xl p-8 shadow-lg flex-shrink-0`}>
                <span className="text-6xl block">{subject.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-5xl font-black text-slate-900 mb-4">
                  {subject.name}
                </h1>
                <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                  {subject.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8">
                  <div className="bg-purple-100 rounded-xl px-6 py-4">
                    <p className="text-3xl font-black text-purple-600">
                      {subject.subCourses.length}
                    </p>
                    <p className="text-slate-600 font-semibold text-sm">Available Courses</p>
                  </div>
                  <div className="bg-blue-100 rounded-xl px-6 py-4">
                    <p className="text-3xl font-black text-blue-600">
                      {subject.subCourses.reduce((sum, c) => sum + c.lessons, 0)}
                    </p>
                    <p className="text-slate-600 font-semibold text-sm">Total Lessons</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-8">
              📚 All Courses
            </h2>

            <div className="space-y-4">
              {subject.subCourses.map((course, idx) => (
                <Link
                  key={course.id}
                  href={`/learn/${subject.id}/${course.id}`}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:scale-105 border-4 border-slate-200 hover:border-purple-400 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      {/* Course Info */}
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-5xl">{course.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-600 uppercase mb-1">
                            Course {idx + 1} of {subject.subCourses.length}
                          </p>
                          <h3 className="text-3xl font-black text-slate-800 mb-2">
                            {course.name}
                          </h3>
                          <div className="flex items-center gap-6 text-slate-600">
                            <span className="font-semibold flex items-center gap-2">
                              📚 {course.lessons} lessons
                            </span>
                            <span className="font-bold px-4 py-1 bg-slate-200 rounded-full text-sm">
                              {course.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-4xl transition transform group-hover:translate-x-3">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h3 className="text-3xl font-black mb-4">
              🚀 Ready to Master {subject.name}?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Choose a course above and start your learning journey with AI-powered tutoring, interactive lessons, and real-time feedback.
            </p>
            <Link href="/courses">
              <button className="px-8 py-3 rounded-xl bg-white text-purple-600 font-bold hover:shadow-lg transition">
                ← Explore Other Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}