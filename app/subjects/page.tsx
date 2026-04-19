import Link from "next/link";
import SubjectsGrid from "../components/SubjectsGrid";

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/">
            <button className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-slate-300 font-semibold transition">
              ← Back to Home
            </button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Select a course and embark on your learning journey. Each course is carefully crafted to take you from beginner to expert.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
              <p className="text-2xl font-bold text-purple-400">3</p>
              <p className="text-sm text-slate-300">Courses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
              <p className="text-2xl font-bold text-pink-400">63</p>
              <p className="text-sm text-slate-300">Total Lessons</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
              <p className="text-2xl font-bold text-blue-400">36.5K</p>
              <p className="text-sm text-slate-300">Active Learners</p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <SubjectsGrid />

        {/* Features Section */}
        
      </div>
    </div>
  );
}