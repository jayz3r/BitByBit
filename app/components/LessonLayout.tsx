"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LessonLayout({
  lesson,
  onComplete,
  subject,
}: {
  lesson: any;
  onComplete?: () => void;
  subject: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySubject = searchParams.get("subject") || subject;

  const [isCompleted, setIsCompleted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const completed = JSON.parse(
      localStorage.getItem(`completed_lessons_${querySubject}`) || "[]"
    );
    const lessonCompleted = completed.includes(lesson.id);
    setIsCompleted(lessonCompleted);
  }, [lesson.id, querySubject]);

  const handleMarkComplete = () => {
    const completed = JSON.parse(
      localStorage.getItem(`completed_lessons_${querySubject}`) || "[]"
    );

    if (!completed.includes(lesson.id)) {
      completed.push(lesson.id);
      localStorage.setItem(
        `completed_lessons_${querySubject}`,
        JSON.stringify(completed)
      );
    }

    setIsCompleted(true);

    // Call the onComplete callback if provided
    if (onComplete) {
      setTimeout(() => onComplete(), 500);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Content Section */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
            {lesson.content}
          </div>
        </div>
      </div>

      {/* Examples Section */}
      {lesson.examples && lesson.examples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">📝 Examples</h2>
          <div className="grid gap-4">
            {lesson.examples.map((example: any, i: number) => (
              <details
                key={i}
                className="group border-2 border-amber-300 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 cursor-pointer hover:shadow-lg transition"
              >
                <summary className="font-bold text-slate-800 text-lg flex items-center gap-3">
                  <span className="text-2xl group-open:hidden">▶</span>
                  <span className="text-2xl hidden group-open:inline">▼</span>
                  {example.question}
                </summary>
                <div className="mt-4 pt-4 border-t-2 border-amber-300 text-slate-700 font-medium">
                  <pre className="whitespace-pre-wrap bg-white rounded-lg p-4 text-sm overflow-x-auto">
                    {example.solution}
                  </pre>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300">
        <h3 className="font-bold text-green-800 text-lg mb-4">💡 Key Takeaway</h3>
        <p className="text-slate-700 font-medium leading-relaxed">
          {lesson.type === "lesson"
            ? "Master this concept by practicing more examples. Try variations of these problems!"
            : "Great job learning! Ready to test your knowledge?"}
        </p>
      </div>

      {/* Complete Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 shadow-xl ${
            isCompleted
              ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white cursor-default"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-2xl"
          }`}
        >
          {isCompleted ? "✓ Lesson Complete" : "✓ Mark as Complete"}
        </button>
      </div>
    </div>
  );
}

export default LessonLayout;