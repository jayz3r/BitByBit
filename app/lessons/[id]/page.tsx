"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LessonLayout from "@/app/components/LessonLayout";
import QuizLayout from "@/app/components/QuizLayout";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "math";

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [type, setType] = useState<"lesson" | "quiz" | null>(null);

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
    if (!lessonId) return;

    let isMounted = true;

    const loadContent = async () => {
      try {
        console.log(`Loading content ${lessonId} for subject ${subject}`);
        const response = await fetch(`/data/${subject}.json`);
        if (!response.ok) throw new Error("Failed to load content data");
        
        const data = await response.json();
        const foundContent = data.find((item: any) => item.id === lessonId);
        
        if (!foundContent) {
          console.error(`Content with id ${lessonId} not found in ${subject}.json`);
        }
        
        if (isMounted) {
          setContent(foundContent || null);
          setType(foundContent?.type || null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Content not found</p>
        <p className="text-gray-500 mb-4">ID: {lessonId}</p>
        <button
          onClick={() => router.push(`/learning-path?subject=${subject}`)}
          className="btn btn-primary"
        >
          Go Back to Path
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <button
        onClick={() =>
          router.push(`/learning-path?subject=${subject}`)
        }
        className="btn btn-ghost btn-sm mb-4"
      >
        ← Back to Path
      </button>
      
      {type === "quiz" ? (
        <QuizLayout quiz={content} subject={subject} />
      ) : (
        <LessonLayout lesson={content} />
      )}
    </div>
  );
}