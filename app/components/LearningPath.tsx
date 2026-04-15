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

  // Load progress from localStorage - runs every time subject changes
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(`completed_lessons_${subject}`) || "[]"
    );
    console.log(`Loaded completed lessons for ${subject}:`, saved);
    setCompletedLessons(saved);
  }, [subject]);

  // Load levels from paths.json based on subject
  useEffect(() => {
    const loadLevels = async () => {
      try {
        const response = await fetch("/data/paths.json");
        const pathsData = await response.json();
        
        console.log("Loaded pathsData:", pathsData);
        
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
        } else {
          console.warn(`No path found for subject: ${subject}`);
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12 p-10 bg-base-100 min-h-screen">
      {/* Subject Title */}
      <div className="text-center mb-4">
        <Link href="/subjects">
          <button className="btn btn-ghost btn-sm mb-4">← Back to Subjects</button>
        </Link>
        <h1 className="text-4xl font-bold capitalize">{subject} Learning Path</h1>
      </div>

      {levels.length === 0 ? (
        <p className="text-gray-500">No lessons available for this subject</p>
      ) : (
        levels.map((level, i) => {
          const isCompleted = completedLessons.includes(level.id);
          const isCurrent =
            !isCompleted &&
            (i === 0 || completedLessons.includes(levels[i - 1].id));
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div
              key={level.id}
              className="relative flex flex-col items-center gap-3"
            >
              <Link
                href={
                  isLocked
                    ? "#"
                    : `/lessons/${level.id}?subject=${subject}`
                }
              >
                <button
                  disabled={isLocked}
                  className={`
                    relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl
                    transition-all hover:scale-110 active:scale-95
                    ${level.position === "left" ? "ml-24" : "mr-24"} 
                    ${
                      isCompleted
                        ? "bg-success text-white"
                        : "bg-neutral text-gray-400"
                    }
                    ${
                      isCurrent
                        ? "bg-primary ring-8 ring-primary/20 animate-bounce text-white"
                        : ""
                    }
                    ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <span className="text-2xl">
                    {level.type === "chest"
                      ? "🎁"
                      : level.type === "trophy"
                        ? "🏆"
                        : "⭐"}
                  </span>

                  {isCurrent && (
                    <div className="absolute -top-3 -right-3 badge badge-secondary">
                      START
                    </div>
                  )}
                </button>
              </Link>

              {i < levels.length - 1 && (
                <div
                  className={`absolute left-1/2 -bottom-12 w-1 h-12 bg-base-300 -z-10 
                  ${
                    level.position === "left"
                      ? "ml-12 rotate-[25deg]"
                      : "-ml-12 -rotate-[-25deg]"
                  }
                `}
                ></div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}