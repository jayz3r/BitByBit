"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LessonLayout from "./LessonLayout";
import QuizLayout from "./QuizLayout";
import EnergyBar from "./EnergyBar";
import { useEnergy } from "./hooks/useEnergy";

interface LessonPart {
  id: string;
  type: "lesson" | "quiz" | "chest" | "trophy";
  title?: string;
  content?: string;
  examples?: any[];
  questions?: any[];
}

export default function LessonContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "math";
  const { useEnergy: consumeEnergy, hasEnough, isPremium, energy } = useEnergy();

  const [content, setContent] = useState<LessonPart | null>(null);
  const [allLessons, setAllLessons] = useState<LessonPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [type, setType] = useState<"lesson" | "quiz" | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnergyWarning, setShowEnergyWarning] = useState(false);
  const [currentEnergy, setCurrentEnergy] = useState(energy);

  // Unwrap params promise
  useEffect(() => {
    let isMounted = true;

    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        if (isMounted) {
          setLessonId(resolvedParams.id);
        }
      } catch (error) {
        console.error("Error unwrapping params:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    unwrapParams();

    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    setCurrentEnergy(energy);
  }, [energy]);

  useEffect(() => {
    if (!lessonId) return;

    let isMounted = true;

    const loadContent = async () => {
      try {
        console.log(`Loading content ${lessonId} for subject ${subject}`);
        const response = await fetch(`/data/${subject.toLowerCase()}.json`);
        if (!response.ok) throw new Error("Failed to load content data");

        const courseData = await response.json();
        
        if (isMounted) {
          setAllLessons(courseData.path || []);

          const foundContent = courseData.path?.find(
            (item: any) => item.id === lessonId
          );

          if (foundContent) {
            setContent(foundContent);
            setType(foundContent.type);

            const index = courseData.path.findIndex(
              (item: any) => item.id === lessonId
            );
            setCurrentIndex(index);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading content:", error);
        if (isMounted) {
          setContent(null);
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [lessonId, subject]);

  const handleNext = () => {
    if (!isPremium) {
      const energyCost = type === "quiz" ? 10 : 5;
      if (!hasEnough(energyCost)) {
        setShowEnergyWarning(true);
        return;
      }
      consumeEnergy(energyCost);
    }

    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      router.push(`/lessons/${nextLesson.id}?subject=${subject}`);
    } else {
      router.push(`/subjects/${subject}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      router.push(`/lessons/${prevLesson.id}?subject=${subject}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-semibold">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center">
          <p className="text-2xl text-white font-bold mb-4">Lesson not found</p>
          <button
            onClick={() => router.push(`/subjects/${subject}`)}
            className="px-8 py-3 rounded-lg bg-white/90 hover:bg-white text-slate-800 font-bold shadow-lg transition"
          >
            Go Back to Course
          </button>
        </div>
      </div>
    );
  }

  const isLastLesson = currentIndex === allLessons.length - 1;
  const progress = ((currentIndex + 1) / allLessons.length) * 100;
  const energyCost = type === "quiz" ? 10 : 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Clean Header */}
        <div className="mb-8">
          {/* Top Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push(`/subjects/${subject}`)}
              className="px-4 py-2 rounded-full bg-white/70 hover:bg-white/90 text-slate-700 font-semibold shadow-lg transition"
            >
              ← Exit
            </button>

            {/* Energy Bar in Center */}
            <div className="flex-1 mx-4 max-w-xs">
              <EnergyBar />
            </div>

            <span className="text-sm font-bold text-slate-700 bg-white/70 px-4 py-2 rounded-full">
              {currentIndex + 1} / {allLessons.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden border border-white/50 shadow-lg mb-8">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl mb-8">
          {/* Lesson Type and Title */}
          <div className="mb-8 pb-6 border-b-2 border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
              {type}
            </p>
            <h1 className="text-4xl font-bold text-slate-800">
              {content.title || `${type} ${currentIndex + 1}`}
            </h1>
          </div>

          {/* Main Content */}
          {type === "quiz" ? (
            <QuizLayout
              quiz={{
                ...content,
                id: content.id,
                questions: content.questions,
              }}
              subject={subject}
            />
          ) : (
            <LessonLayout
              lesson={content}
              onComplete={handleNext}
              subject={subject}
            />
          )}
        </div>

        {/* Navigation */}
        {type !== "quiz" && (
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 shadow-lg ${
                currentIndex === 0
                  ? "bg-slate-300/50 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:shadow-xl"
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 shadow-lg ${
                !isPremium && !hasEnough(energyCost)
                  ? "bg-gradient-to-r from-slate-400 to-slate-500 text-white cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl"
              }`}
            >
              {isLastLesson ? "Finish Course →" : "Continue →"}
              {!isPremium && (
                <span className="ml-2 text-sm">❤️ {energyCost}</span>
              )}
            </button>
          </div>
        )}

        {/* Motivation */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-sm">
            Keep going! You're making great progress! 🚀
          </p>
        </div>
      </div>

      {/* Energy Warning Modal */}
      {showEnergyWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-6xl text-center mb-4">⚡</div>
            <h2 className="text-3xl font-black text-slate-800 text-center mb-2">
              Not Enough Energy!
            </h2>
            <p className="text-slate-600 text-center mb-6">
              This {type} costs {energyCost} energy points. You have{" "}
              <span className="font-bold text-red-600">{currentEnergy}</span> remaining.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  localStorage.setItem("isPremium", "true");
                  setShowEnergyWarning(false);
                  window.location.reload();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg transition"
              >
                Get Premium
              </button>
              <button
                onClick={() => {
                  setShowEnergyWarning(false);
                  router.push(`/subjects/${subject}`);
                }}
                className="w-full py-3 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}