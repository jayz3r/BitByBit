"use client";

import EquationSolver from "@/app/components/EquationSolver";

export default function EquationSolverPage() {
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