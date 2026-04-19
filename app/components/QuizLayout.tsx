"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEnergy } from "./hooks/useEnergy";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizLayout({
  quiz,
  subject,
}: {
  quiz: any;
  subject: string;
}) {
  const router = useRouter();
  const { useEnergy: consumeEnergy, isPremium } = useEnergy();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const [questionQueue, setQuestionQueue] = useState<QuizQuestion[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showWrongAnswerPenalty, setShowWrongAnswerPenalty] = useState(false);
  const [reviewWrongCount, setReviewWrongCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    if (quiz.questions) {
      setQuestionQueue([...quiz.questions]);
    }
  }, [quiz]);

  const currentQuestion = questionQueue?.[currentIndex];
  const progress = ((currentIndex + 1) / questionQueue.length) * 100;
  const isCorrect = selectedOption === currentQuestion?.answer;

  const handleSelectOption = (option: string) => {
    if (!answered) {
      setSelectedOption(option);
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;

    setAnswered(true);
    setTotalAttempts(totalAttempts + 1);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 10);
    } else {
      // Deduct 3 hearts for wrong answer (both learning and review phase)
      if (!isPremium) {
        consumeEnergy(3);
      }
      
      // Only add to wrong questions if in learning phase, not review
      if (!isRetrying) {
        setWrongQuestions([...wrongQuestions, currentQuestion]);
      } else {
        // In review phase, count how many times we got it wrong
        setReviewWrongCount(reviewWrongCount + 1);
      }
      
      setShowWrongAnswerPenalty(true);
    }
  };

  const handleNext = () => {
    setShowWrongAnswerPenalty(false);

    if (currentIndex < questionQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else if (!isRetrying && wrongQuestions.length > 0) {
      // Start retry phase with wrong questions
      setIsRetrying(true);
      setQuestionQueue(wrongQuestions);
      setCurrentIndex(0);
      setWrongQuestions([]);
      setSelectedOption(null);
      setAnswered(false);
      setReviewWrongCount(0);
    } else {
      // Mark quiz as complete
      const completed = JSON.parse(
        localStorage.getItem(`completed_lessons_${subject}`) || "[]"
      );
      if (!completed.includes(quiz.id)) {
        completed.push(quiz.id);
        localStorage.setItem(
          `completed_lessons_${subject}`,
          JSON.stringify(completed)
        );
      }
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setCorrectAnswers(0);
    setIsFinished(false);
    setIsRetrying(false);
    setWrongQuestions([]);
    setQuestionQueue([...quiz.questions]);
    setTotalAttempts(0);
    setReviewWrongCount(0);
  };

  if (!isMounted) return null;

  if (isFinished) {
    const finalPercentage = Math.round(
      (correctAnswers / (quiz.questions?.length || 1)) * 100
    );
    const isPerfect = correctAnswers === quiz.questions?.length;

    return (
      <div className="space-y-8 text-center py-12">
        {/* Trophy Animation */}
        <div
          className="text-8xl animate-bounce"
          style={{ animationDuration: "1s" }}
        >
          {isPerfect ? "🏆" : "🎉"}
        </div>

        {/* Completion Message */}
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800">
            {isPerfect
              ? "Perfect Score!"
              : finalPercentage >= 80
                ? "Great Job!"
                : "Good Effort!"}
          </h2>

          <p className="text-2xl font-bold text-slate-700">
            Your Score:{" "}
            <span className="text-green-600">
              {correctAnswers} / {quiz.questions?.length}
            </span>
          </p>

          <p className="text-lg text-slate-600">
            {finalPercentage}% Success Rate
          </p>
        </div>

        {/* Streak Info */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border-2 border-amber-300 max-w-md mx-auto">
          <p className="text-sm text-amber-800 font-semibold uppercase mb-2">
            📊 Quiz Stats
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-amber-700">{correctAnswers}</p>
              <p className="text-xs text-amber-600">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {(quiz.questions?.length || 0) - correctAnswers}
              </p>
              <p className="text-xs text-red-600">Incorrect</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{
                width: `${finalPercentage}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-slate-600 italic">
          {isPerfect
            ? "You're a quiz master! Keep it up! 🌟"
            : finalPercentage >= 80
              ? "Almost there! You're doing great! 💪"
              : "Keep practicing, you'll get better! 📚"}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold hover:shadow-lg transition"
          >
            ← Back
          </button>
          <button
            onClick={() => router.push(`/subjects/${subject}`)}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg transition"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  if (isFinished && correctAnswers === 0) {
    return (
      <div className="space-y-8 text-center py-12">
        <div className="text-7xl">😅</div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-800">
            Don't Give Up!
          </h2>
          <p className="text-xl text-slate-600">
            Let's try again. You'll do better this time! 💪
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 border-2 border-orange-300 max-w-md mx-auto">
          <p className="text-sm text-orange-800 font-semibold uppercase mb-2">
            ⚠️ Need Help?
          </p>
          <p className="text-slate-700">
            Review the lesson again before retrying, or try the next question and come back later.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-md mx-auto">
          <button
            onClick={handleRetry}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition transform hover:scale-105"
          >
            🔄 Retry Quiz
          </button>
          <button
            onClick={() => router.push(`/subjects/${subject}`)}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 text-white font-bold hover:shadow-lg transition"
          >
            Review Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        {/* Phase Indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-xs font-bold text-slate-600 uppercase">
            {isRetrying ? "🔄 Review Phase" : "📚 Learning Phase"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Counter */}
        <div className="flex justify-between items-center px-2">
          <span className="text-sm font-bold text-slate-700">
            Question {currentIndex + 1} of {questionQueue.length}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
            {isRetrying ? "Practice Again" : "Question"}
          </p>
          <h2 className="text-3xl font-black text-slate-800 leading-tight">
            {currentQuestion?.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options?.map((option: string, idx: number) => {
            const isSelected = selectedOption === option;
            const isAnswerCorrect = option === currentQuestion.answer;
            const showCorrect = answered && isAnswerCorrect;
            const showIncorrect =
              answered && isSelected && !isAnswerCorrect;

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={answered}
                className={`p-6 rounded-2xl font-bold text-lg transition transform border-3 ${
                  showCorrect
                    ? "bg-gradient-to-br from-green-300 to-green-400 border-green-600 text-white shadow-lg scale-105"
                    : showIncorrect
                      ? "bg-gradient-to-br from-red-300 to-red-400 border-red-600 text-white shadow-lg"
                      : isSelected && !answered
                        ? "bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600 text-white shadow-lg"
                        : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
                } ${answered ? "cursor-default" : "cursor-pointer hover:scale-105"}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{option}</span>
                  {showCorrect && <span>✓</span>}
                  {showIncorrect && <span>✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className={`p-6 rounded-2xl text-center font-semibold text-lg ${
              isCorrect
                ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800"
                : "bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 text-orange-800"
            }`}
          >
            {isCorrect ? (
              <div className="space-y-2">
                <div className="text-2xl">🎉 Correct!</div>
                <div className="text-sm">Great work! Keep it up!</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl">📚 Not quite</div>
                <div className="text-sm">
                  The correct answer is:{" "}
                  <span className="font-bold">{currentQuestion?.answer}</span>
                </div>
                <div className="text-xs mt-2 opacity-80">
                  {!isPremium && "❤️ -3 hearts"}
                  {isRetrying
                    ? " • This question will appear again later"
                    : " • You'll practice this again in the review phase"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        {!answered ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition transform ${
              selectedOption
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition transform bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
          >
            {isRetrying
              ? currentIndex === questionQueue.length - 1
                ? "Finish Review →"
                : "Next →"
              : currentIndex === questionQueue.length - 1 && wrongQuestions.length === 0
                ? "Finish Quiz →"
                : "Next →"}
          </button>
        )}
      </div>

      {/* Live Score */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
        <div className="text-sm font-bold text-slate-700">
          Score: <span className="text-green-600">{score}</span>
        </div>
        <div className="text-sm font-bold text-slate-700">
          Correct:{" "}
          <span className="text-blue-600">
            {correctAnswers} / {quiz.questions?.length}
          </span>
        </div>
        {isRetrying && (
          <div className="text-sm font-bold text-slate-700">
            Reviewing: <span className="text-orange-600">{questionQueue.length}</span>
          </div>
        )}
      </div>

      {/* Wrong Answer Penalty Modal */}
      {showWrongAnswerPenalty && !isCorrect && answered && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-auto">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce">
            <div className="text-5xl text-center mb-4">❌</div>
            <h2 className="text-3xl font-black text-red-600 text-center mb-2">
              Wrong Answer!
            </h2>
            {!isPremium && (
              <div className="text-center mb-6">
                <p className="text-lg font-bold text-red-500">❤️ -3 Hearts</p>
                <p className="text-slate-600">
                  {isRetrying
                    ? "Even in review, mistakes cost hearts!"
                    : "Premium users don't lose hearts!"}
                </p>
              </div>
            )}
            <p className="text-slate-600 text-center mb-6">
              The correct answer is:{" "}
              <span className="font-bold">{currentQuestion?.answer}</span>
            </p>
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition"
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}