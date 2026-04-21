"use client";

import { useState, useCallback } from "react";
import MathRenderer from "./MathRenderer";

interface Step {
  id: string;
  equation: string;
  explanation: string;
  isCorrect: boolean | null;
  feedback: string;
  userInput: string;
}

export default function EquationSolver({
  problem,
  expectedSteps,
  hints = [],
}: {
  problem: string;
  expectedSteps: number;
  hints?: string[];
}) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "0",
      equation: problem,
      explanation: "Starting equation",
      isCorrect: true,
      feedback: "✓ This is the equation we need to solve",
      userInput: "",
    },
  ]);

  const [currentStepInput, setCurrentStepInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [score, setScore] = useState(0);

  const verifyStep = useCallback(
    async (equation: string) => {
      setLoading(true);

      try {
        const response = await fetch("/api/verify-step", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            previousEquation: steps[steps.length - 1].equation,
            currentEquation: equation,
            allSteps: steps,
            problem: problem,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to verify step");
        }

        const data = await response.json();

        const newStep: Step = {
          id: String(steps.length),
          equation: equation,
          explanation: data.explanation || "",
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          userInput: equation,
        };

        setSteps((prev) => [...prev, newStep]);

        if (data.isCorrect) {
          setScore((prev) => prev + 10);
          setShowHint(false);
          setCurrentHintIndex(0);
        }

        setCurrentStepInput("");
      } catch (error) {
        console.error("Error verifying step:", error);
        const errorStep: Step = {
          id: String(steps.length),
          equation: equation,
          explanation: "",
          isCorrect: false,
          feedback: "Could not verify this step. Please try again.",
          userInput: equation,
        };
        setSteps((prev) => [...prev, errorStep]);
      } finally {
        setLoading(false);
      }
    },
    [steps, problem]
  );

  const handleAddStep = async () => {
    if (!currentStepInput.trim()) return;
    await verifyStep(currentStepInput);
  };

  const requestHint = () => {
    if (currentHintIndex < hints.length) {
      setShowHint(true);
    }
  };

  const nextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  };

  const isComplete = steps.length > expectedSteps + 1;
  const progress = Math.min(((steps.length - 1) / expectedSteps) * 100, 100);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">
          Solve Step by Step
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-slate-600">
            Steps: <span className="font-bold">{Math.min(steps.length - 1, expectedSteps)}/{expectedSteps}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-bold text-purple-600">{score}</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300">
          <div
            className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Steps Display */}
      <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-5 rounded-2xl border-2 transition transform ${
              step.isCorrect === true
                ? "bg-green-50 border-green-300 shadow-md hover:shadow-lg"
                : step.isCorrect === false
                ? "bg-red-50 border-red-300 shadow-md hover:shadow-lg"
                : "bg-blue-50 border-blue-300 shadow-md"
            }`}
          >
            {/* Step Number */}
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Step {idx}
              </span>
              {step.isCorrect === true && (
                <span className="text-2xl animate-bounce">✓</span>
              )}
              {step.isCorrect === false && (
                <span className="text-2xl">✗</span>
              )}
            </div>

            {/* Equation */}
            <div className="mb-3 p-4 bg-white rounded-lg border border-slate-200 overflow-x-auto">
              <MathRenderer content={`$$${step.equation}$$`} />
            </div>

            {/* Explanation */}
            {step.explanation && (
              <p className="text-sm text-slate-700 mb-2 bg-white/50 p-2 rounded">
                {step.explanation}
              </p>
            )}

            {/* Feedback */}
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                step.isCorrect === true
                  ? "bg-green-100 text-green-800"
                  : step.isCorrect === false
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {step.feedback}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      {!isComplete && (
        <div className="space-y-4 p-6 bg-gradient-to-b from-slate-50 to-purple-50 rounded-2xl border-2 border-purple-200">
          <h3 className="text-lg font-bold text-slate-800">
            Step {steps.length} (of ~{expectedSteps})
          </h3>

          {/* Hint Display */}
          {showHint && hints.length > 0 && (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-yellow-800">💡 Hint:</p>
                {currentHintIndex < hints.length - 1 && (
                  <button
                    onClick={nextHint}
                    className="text-sm px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300 transition"
                  >
                    Next Hint →
                  </button>
                )}
              </div>
              <p className="text-yellow-800">{hints[currentHintIndex]}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Enter your next equation:
            </label>
            <input
              type="text"
              value={currentStepInput}
              onChange={(e) => setCurrentStepInput(e.target.value)}
              placeholder="e.g., 2x = 10"
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition font-mono"
              onKeyPress={(e) => e.key === "Enter" && handleAddStep()}
            />
            <p className="text-xs text-slate-500 mt-2">
              📝 Type the equation after applying one operation
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddStep}
              disabled={loading || !currentStepInput.trim()}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Check Step"}
            </button>

            {hints.length > 0 && (
              <button
                onClick={requestHint}
                disabled={loading || showHint}
                className="px-6 py-3 rounded-xl bg-yellow-400 text-yellow-900 font-bold hover:bg-yellow-500 transition disabled:opacity-50"
              >
                💡 Hint
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="p-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-center text-white animate-fadeIn">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-black mb-2">Congratulations!</h3>
          <p className="text-lg mb-4">You solved the equation correctly!</p>
          <p className="text-2xl font-bold mb-4">
            Final Score: <span className="text-yellow-200">{score} points</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-slate-100 transition"
          >
            Continue Learning →
          </button>
        </div>
      )}
    </div>
  );
}