import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <Header/>

      {/* Hero Section */}
      <div className="pt-32 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-sm font-semibold">
                    🚀 Learn Smarter, Not Harder
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Master Any Skill,{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Bit by Bit
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Practice skills, track your progress, and get AI-powered guidance. 
                  Learn programming, math, languages, and more—all at your own pace.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-8">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-400">10K+</div>
                  <p className="text-slate-400">Active Learners</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-pink-400">50+</div>
                  <p className="text-slate-400">Courses</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-400">95%</div>
                  <p className="text-slate-400">Success Rate</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/subjects" className="flex-1">
                  <button className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105">
                    Start Learning Now
                  </button>
                </Link>
                <Link href="/login" className="flex-1">
                  <button className="w-full px-8 py-4 rounded-lg border-2 border-purple-400/50 text-purple-300 font-semibold hover:bg-purple-500/10 transition">
                    Already have an account?
                  </button>
                </Link>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-2xl">✨</span>
                  <span>Interactive lessons with real-time feedback</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-2xl">🎯</span>
                  <span>Track progress with visual learning paths</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="text-2xl">🏆</span>
                  <span>Earn achievements and unlock new levels</span>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-80 h-80 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl border border-purple-400/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📚</div>
                    <p className="text-white font-semibold">Learning in Progress</p>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-700 rounded-full w-32 mx-auto"></div>
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-24 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Preview Section */}
      <div className="py-20 px-6 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Popular Courses
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🐍",
                title: "Python",
                desc: "Master programming from basics to advanced",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "📐",
                title: "Math",
                desc: "Build strong mathematical foundations",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "🔧",
                title: "ORT",
                desc: "Learn industry-standard tools and practices",
                color: "from-orange-500 to-red-500"
              }
            ].map((course, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl`}></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition">
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-slate-400 mb-4">{course.desc}</p>
                  <button className={`w-full py-2 rounded-lg bg-gradient-to-r ${course.color} text-white font-semibold hover:shadow-lg transition`}>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <Footer/> */}
    </main>
  );
}