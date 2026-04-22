import { Suspense } from "react";
import EquationSolver from "@/app/components/EquationSolver";

function EquationSolverContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <EquationSolver
          problem="2x + 5 = 15"
          expectedSteps={3}
        />
      </div>
    </div>
  );
}

export default function EquationSolverPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-300 to-amber-100">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    }>
      <EquationSolverContent />
    </Suspense>
  );
}