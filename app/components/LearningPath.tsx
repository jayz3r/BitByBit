"use client";
import Link from "next/link";

export default function LearningPath() {
  // 1. Update these IDs to match your math.json (e.g., algebra_1)
  const levels = [
    { id: 'algebra_1', type: 'lesson', status: 'completed' },
    { id: 'algebra_quiz_1', type: 'quiz', status: 'current' },
    { id: 'algebra_2', type: 'lesson', status: 'locked' },
    { id: 'chest_1', type: 'chest', status: 'locked' },
    { id: 'algebra_final', type: 'trophy', status: 'locked' },
  ];

  return (
    <div className="flex flex-col items-center gap-12 p-10 bg-base-100 min-h-screen">
      {levels.map((level, i) => (
        <div key={level.id} className="relative">
          {/* 2. Wrap in Link to navigate to your dynamic [id] folder */}
          <Link href={`/lessons/${level.id}`}>
            <button 
              disabled={level.status === 'locked'}
              className={`
                relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl
                transition-all hover:scale-110 active:scale-95
                ${i % 2 === 0 ? 'ml-24' : 'mr-24'} 
                ${level.status === 'completed' ? 'bg-success text-white' : 'bg-neutral text-gray-400'}
                ${level.status === 'current' ? 'bg-primary ring-8 ring-primary/20 animate-bounce' : ''}
                ${level.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-2xl">
                {level.type === 'chest' ? '🎁' : level.type === 'trophy' ? '🏆' : '⭐'}
              </span>

              {level.status === 'current' && (
                <div className="absolute -top-3 -right-3 badge badge-secondary animate-none">
                  START
                </div>
              )}
            </button>
          </Link>

          {/* SVG Connector (Optional: adds a path line between buttons) */}
          {i < levels.length - 1 && (
            <div className={`absolute left-1/2 -bottom-12 w-1 h-12 bg-base-300 -z-10 
              ${i % 2 === 0 ? 'ml-12 rotate-25' : '-ml-12 -rotate-25'}
            `}></div>
          )}
        </div>
      ))}
    </div>
  );
}