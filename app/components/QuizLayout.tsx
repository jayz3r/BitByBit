"use client";
import Link from "next/link";
import { useState } from "react";

export default function QuizLayout({ quiz }: { quiz: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [lives, setLives] = useState(3);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // For Correct/Wrong message

  const currentQuestion = quiz.questions[currentIndex];

  const handleCheck = () => {
    if (selectedOption === currentQuestion.answer) {
      // CORRECT
      setShowFeedback(true);
    } else {
      // WRONG
      setLives((prev) => Math.max(0, prev - 1));
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (lives === 0) return <div className="text-center p-10 text-3xl">Game Over! 💔</div>;
  if (isFinished) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center gap-6">
      <div className="text-6xl animate-bounce">🎊</div>
      <h2 className="text-3xl font-bold">Quiz Complete!</h2>
      <p className="text-xl opacity-70">You're getting smarter every day.</p>
      
      <div className="flex gap-4">
        <Link href="/learn">
          <button className="btn btn-outline">Back to Map</button>
        </Link>
        {/* Logic to find the next ID could go here */}
        <Link href="/lessons/algebra_2">
          <button className="btn btn-primary">Next Lesson: algebra_2</button>
        </Link>
      </div>
    </div>
  );
}

  return (
    <div className="flex flex-col min-h-[60vh] justify-between">
      {/* Top Header: Progress and Lives */}
      <div className="flex justify-between items-center mb-8">
        <progress 
          className="progress progress-success w-3/4" 
          value={currentIndex} 
          max={quiz.questions.length}
        ></progress>
        <div className="text-2xl">❤️ {lives}</div>
      </div>

      {/* Question Area */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option: string) => (
            <button
              key={option}
              onClick={() => !showFeedback && setSelectedOption(option)}
              className={`btn btn-lg h-20 ${
                selectedOption === option ? "btn-primary" : "btn-outline"
              } ${showFeedback && option === currentQuestion.answer ? "btn-success" : ""} 
                ${showFeedback && option === selectedOption && option !== currentQuestion.answer ? "btn-error" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Footer: Dynamic Button */}
      <div className="mt-10 border-t pt-6 flex justify-end">
        {!showFeedback ? (
          <button 
            disabled={!selectedOption} 
            onClick={handleCheck} 
            className="btn btn-wide btn-success"
          >
            Check
          </button>
        ) : (
          <button onClick={handleNext} className="btn btn-wide btn-primary">
            Continue
          </button>
        )}
      </div>

      {/* Feedback Message */}
      {showFeedback && (
        <div className={`mt-4 p-4 rounded-lg text-white font-bold text-center ${
          selectedOption === currentQuestion.answer ? "bg-success" : "bg-error"
        }`}>
          {selectedOption === currentQuestion.answer ? "Amazing! Correct." : `Wrong! The answer was ${currentQuestion.answer}`}
        </div>
      )}
    </div>
  );
}

