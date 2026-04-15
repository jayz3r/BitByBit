"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LearningPath() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Load progress from localStorage once when the page opens
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("completed_lessons") || "[]");
    setCompletedLessons(saved);
  }, []);

  const levels = [
    { id: "algebra_1", type: "lesson" },
    { id: "algebra_quiz_1", type: "quiz" },
    { id: "algebra_2", type: "lesson" },
    { id: "chest_1", type: "chest" },
    { id: "algebra_final", type: "trophy" },
  ];

  return (
    <div className="flex flex-col items-center gap-12 p-10 bg-base-100 min-h-screen">
      {levels.map((level, i) => {
        // LOGIC: Is this lesson done?
        const isCompleted = completedLessons.includes(level.id);
        
        // LOGIC: Is this the current one? (The first one that isn't completed)
        const isCurrent = !isCompleted && (i === 0 || completedLessons.includes(levels[i - 1].id));
        
        // LOGIC: Is it locked? (Not completed and not the current one)
        const isLocked = !isCompleted && !isCurrent;

        return (
          <div key={level.id} className="relative">
            <Link href={isLocked ? "#" : `/lessons/${level.id}`}>
              <button
                disabled={isLocked}
                className={`
                  relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl
                  transition-all hover:scale-110 active:scale-95
                  ${i % 2 === 0 ? "ml-24" : "mr-24"} 
                  ${isCompleted ? "bg-success text-white" : "bg-neutral text-gray-400"}
                  ${isCurrent ? "bg-primary ring-8 ring-primary/20 animate-bounce text-white" : ""}
                  ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <span className="text-2xl">
                  {level.type === "chest" ? "🎁" : level.type === "trophy" ? "🏆" : "⭐"}
                </span>

                {isCurrent && (
                  <div className="absolute -top-3 -right-3 badge badge-secondary">START</div>
                )}
              </button>
            </Link>

            {/* Line connecting the dots */}
            {i < levels.length - 1 && (
              <div className={`absolute left-1/2 -bottom-12 w-1 h-12 bg-base-300 -z-10 
                ${i % 2 === 0 ? "ml-12 rotate-[25deg]" : "-ml-12 -rotate-[-25deg]"}
              `}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}