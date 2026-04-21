"use client";

import { useSubjects } from "./hooks/useSubjects";
import Link from "next/link";
import { memo } from "react";

const CourseCard = memo(({ course }: { course: any }) => (
  <Link key={course.id} href={`/subjects/${course.id}`}>
    <div className="group relative h-full cursor-pointer">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${course.color} rounded-2xl opacity-0 group-hover:opacity-30 transition-all duration-300 blur-xl`}
      ></div>

      <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden h-full flex flex-col hover:border-slate-600/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
        <div
          className={`h-32 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <span className="text-6xl relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
            {course.icon}
          </span>
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-white mb-2">{course.name}</h3>

          <p className="text-sm text-purple-300 font-semibold mb-4">
            {course.shortDesc}
          </p>

          <p className="text-slate-300 mb-6 flex-grow">{course.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-slate-700/50">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-200">
                {course.lessons}
              </p>
              <p className="text-xs text-slate-400">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-200">
                {course.students}
              </p>
              <p className="text-xs text-slate-400">Learners</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-200">
                {course.difficulty}
              </p>
              <p className="text-xs text-slate-400">Level</p>
            </div>
          </div>

          <button
            className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${course.color} text-white font-bold text-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105 transform`}
          >
            Start Learning →
          </button>
        </div>
      </div>
    </div>
  </Link>
));

CourseCard.displayName = "CourseCard";

export default function CoursesSection() {
  const { subjects: courses, loading } = useSubjects();

  if (loading) {
    return (
      <div className="py-20 px-6 border-t border-purple-500/20">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-3">Popular Courses</h2>
          <p className="text-lg text-slate-300">
            Choose your learning path and start mastering new skills
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-300 mb-6">
            Not sure where to start? All courses are designed for learners of all levels
          </p>
          <Link href="/courses">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105">
              View All Courses →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}