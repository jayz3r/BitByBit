import { useEffect, useState } from "react";

interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  students: string;
  lessons: number;
  difficulty: string;
  shortDesc: string;
}

const CACHE = new Map<string, Subject[]>();

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (CACHE.has("courses")) {
      setSubjects(CACHE.get("courses")!);
      setLoading(false);
      return;
    }

    fetch("/data/courses.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched courses:", data);
        CACHE.set("courses", data);
        setSubjects(data);
      })
      .catch((err) => console.error("Error loading courses:", err))
      .finally(() => setLoading(false));
  }, []);

  return { subjects, loading };
}