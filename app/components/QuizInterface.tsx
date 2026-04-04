// components/QuizInterface.tsx
"use client";
import { useState } from "react";

export default function QuizInterface() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const wordBank = ["Торт", "кофе", "и", "чай", "милый", "колотый"];

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex flex-col p-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
        <button className="btn btn-ghost text-xl">✕</button>
        <progress className="progress progress-success w-full h-4" value="40" max="100"></progress>
        <div className="flex items-center gap-1 text-error">
          ❤️ <span className="font-bold">3</span>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-8">
        <h1 className="text-3xl font-bold self-start">Напишите на русском</h1>
        
        <div className="flex items-center gap-6 self-start">
          <div className="w-32 h-32 bg-gray-500 rounded-full flex items-center justify-center text-5xl">👤</div>
          <div className="chat chat-left">
            <div className="chat-bubble bg-base-100 text-xl flex items-center gap-2">
              <button className="btn btn-circle btn-sm btn-primary">🔊</button>
              케이크랑 커피
            </div>
          </div>
        </div>

        {/* Selected Words Area */}
        <div className="w-full min-h-[60px] border-b-2 border-gray-600 flex flex-wrap gap-2 p-2">
          {selectedWords.map(word => (
            <button key={word} onClick={() => toggleWord(word)} className="btn btn-outline btn-sm">
              {word}
            </button>
          ))}
        </div>

        {/* Word Bank */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {wordBank.map(word => (
            <button 
              key={word} 
              onClick={() => toggleWord(word)}
              disabled={selectedWords.includes(word)}
              className={`btn btn-md shadow-md ${selectedWords.includes(word) ? 'opacity-20' : ''}`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <button className="btn btn-outline px-10">ПРОПУСТИТЬ</button>
        <button className={`btn px-10 ${selectedWords.length > 0 ? 'btn-success' : 'btn-disabled'}`}>
          ПРОВЕРИТЬ
        </button>
      </div>
    </div>
  );
}