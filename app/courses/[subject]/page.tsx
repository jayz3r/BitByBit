"use client";
import UniversalPath from "@/app/components/UniversalPath";
import { useEffect, useState } from "react";

interface CourseData {
  subject: string;
  path: {
    id: string;
    type: string;
    status: "locked" | "completed" | "current";
  }[];
}

export default function SubjectPage({
  params,
}: {
  params: { subject: string };
}) {
  // Tell useState it will eventually hold CourseData or null
  const [courseData, setCourseData] = useState<CourseData | null>(null);

  useEffect(() => {
    // Dynamically fetch the file based on the URL!
    fetch(`/data/${params.subject}.json`)
      .then(res => res.json())
      .then(data => setCourseData(data));
  }, [params.subject]);

  if (!courseData) return <div>Loading Course...</div>;

  return (
    <main className="p-6">
      <h1 className="text-center text-4xl font-bold mb-10">
        {courseData.subject}
      </h1>
      <UniversalPath items={courseData.path} />
    </main>
  );
}
