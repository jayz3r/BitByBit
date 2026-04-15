"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LessonLayout({ lesson }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "math";
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check if lesson is already completed
  useEffect(() => {
    setIsMounted(true);
    const completed = JSON.parse(
      localStorage.getItem(`completed_lessons_${subject}`) || "[]"
    );
    const lessonCompleted = completed.includes(lesson.id);
    console.log(`Checking ${lesson.id} in ${subject}:`, lessonCompleted, completed);
    setIsCompleted(lessonCompleted);
  }, [lesson.id, subject]);

  // Mark lesson as completed and redirect
  const handleMarkComplete = () => {
    console.log(`Marking ${lesson.id} as complete for subject: ${subject}`);
    
    const completed = JSON.parse(
      localStorage.getItem(`completed_lessons_${subject}`) || "[]"
    );

    if (!completed.includes(lesson.id)) {
      completed.push(lesson.id);
      localStorage.setItem(
        `completed_lessons_${subject}`,
        JSON.stringify(completed)
      );
      console.log("Updated localStorage:", completed);
    }

    setIsCompleted(true);

    // Redirect back to learning path
    setTimeout(() => {
      router.push(`/learning-path?subject=${subject}`);
    }, 500);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card bg-base-200 shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">The Concept</h2>
        <p className="text-lg leading-relaxed italic">{lesson.content}</p>
      </div>

      {lesson.examples && lesson.examples.length > 0 && (
        <>
          <h3 className="text-2xl font-bold mt-8">Practice Examples</h3>
          <div className="grid gap-4">
            {lesson.examples.map((ex: any, i: number) => (
              <div
                key={i}
                className="collapse collapse-plus bg-base-100 border border-base-300"
              >
                <input type="radio" name="my-accordion-3" />
                <div className="collapse-title text-xl font-medium">
                  {ex.question}
                </div>
                <div className="collapse-content">
                  <p className="text-success font-bold text-lg">{ex.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Completion Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`btn btn-lg gap-2 ${
            isCompleted
              ? "btn-success btn-disabled"
              : "btn-primary hover:btn-success"
          }`}
        >
          {isCompleted ? "✓ Completed" : "✓ Mark as Complete"}
        </button>
      </div>
    </div>
  );
}

export default LessonLayout;