"use client";

import Link from "next/link";
import { useState } from "react";

export default function SubjectsPage() {
  const subjects = [
    {
      id: "python",
      name: "Python",
      icon: "🐍",
      description: "Learn Python programming from basics to advanced",
      color: "bg-blue-500",
    },
    {
      id: "ort",
      name: "ORT",
      icon: "🔧",
      description: "Learn ORT fundamentals and best practices",
      color: "bg-orange-500",
    },
    {
      id: "math",
      name: "Math",
      icon: "📐",
      description: "Master mathematical concepts and problem solving",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Choose a Subject</h1>
          <p className="text-xl text-gray-600">
            Select a subject to start your learning journey
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/learning-path?subject=${subject.id}`}>
              <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer h-full">
                <div className={`${subject.color} h-32 flex items-center justify-center`}>
                  <span className="text-6xl">{subject.icon}</span>
                </div>

                <div className="card-body">
                  <h2 className="card-title text-2xl">{subject.name}</h2>
                  <p className="text-gray-700">{subject.description}</p>

                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary">
                      Start Learning
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/">
            <button className="btn btn-ghost">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}