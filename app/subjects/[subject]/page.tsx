import { Suspense } from "react";
import SubjectContent from "@/app/components/SubjectContent";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-sky-400 to-sky-200">
      <div className="text-center space-y-4">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-semibold">Loading course...</p>
      </div>
    </div>
  );
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <SubjectContent subject={subject} />
    </Suspense>
  );
}