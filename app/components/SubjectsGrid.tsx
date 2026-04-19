"use client";

import { useSubjects } from "./hooks/useSubjects";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

interface Subject {
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

const SubjectCard = memo(({ subject }: { subject: Subject }) => (
  <Link href={`/subjects/${subject.id}`}>
    <div className="group relative h-full cursor-pointer">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${subject.color} rounded-2xl opacity-0 group-hover:opacity-40 transition-all duration-300 blur-2xl`}
      ></div>

      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden h-full flex flex-col hover:border-slate-600/50 transition-all duration-300 group-hover:shadow-2xl">
        <div
          className={`h-40 bg-gradient-to-br ${subject.color} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <span className="text-7xl relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
            {subject.icon}
          </span>
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <h2 className="text-3xl font-bold text-white mb-2">
            {subject.name}
          </h2>

          <p className="text-sm text-purple-300 font-semibold mb-4">
            {subject.shortDesc}
          </p>

          <p className="text-slate-300 mb-6 flex-grow">{subject.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-slate-700/50">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{subject.lessons}</p>
              <p className="text-xs text-slate-400">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{subject.students}</p>
              <p className="text-xs text-slate-400">Learners</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {subject.difficulty}
              </p>
              <p className="text-xs text-slate-400">Level</p>
            </div>
          </div>

          <button
            className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${subject.color} text-white font-bold text-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105 transform`}
          >
            Start Learning →
          </button>
        </div>
      </div>
    </div>
  </Link>
));

SubjectCard.displayName = "SubjectCard";

export default function SubjectsGrid() {
  const { subjects, loading } = useSubjects();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 mt-4">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}