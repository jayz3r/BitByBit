import { Suspense } from "react";
import LessonContent from "@/app/components/LessonsContent";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-4">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-300 text-lg font-semibold">Loading lesson...</p>
      </div>
    </div>
  );
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LessonContent params={params} />
    </Suspense>
  );
}