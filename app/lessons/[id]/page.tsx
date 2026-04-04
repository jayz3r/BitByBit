"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LessonLayout from "@/app/components/LessonLayout"; // Move code there
import QuizLayout from "@/app/components/QuizLayout";     // Move code there

export default function CourseDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/data/math.json");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json.find((obj: any) => obj.id === id) || null);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorMessage message="Content not found" />;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary">{data.title}</h1>
        <p className="text-xl mt-2 opacity-70">{data.description}</p>
      </header>

      {/* Simplified Conditional Rendering */}
      {data.type === "lesson" ? (
        <LessonLayout lesson={data} />
      ) : (
        <QuizLayout quiz={data} />
      )}
    </main>
  );
}

// Small helper components can stay or move to a UI folder
const LoadingSpinner = () => <div className="p-10 text-center animate-pulse">Loading...</div>;
const ErrorMessage = ({ message }: { message: string }) => <div className="p-10 text-center text-error">{message}</div>;