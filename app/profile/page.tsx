"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserStats {
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  totalEnergyUsed: number;
  averageAccuracy: number;
  coursesInProgress: number;
  coursesCompleted: number;
}

interface CourseProgress {
  id: string;
  name: string;
  icon: string;
  progress: number;
  lessons: number;
  completed: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalLessonsCompleted: 0,
    totalQuizzesCompleted: 0,
    totalScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalEnergyUsed: 0,
    averageAccuracy: 0,
    coursesInProgress: 0,
    coursesCompleted: 0,
  });
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsMounted(true);
    const premium = localStorage.getItem("isPremium") === "true";
    setIsPremium(premium);

    // Calculate statistics from localStorage
    calculateStats();
    loadCourseProgress();
  }, []);

  const calculateStats = () => {
    const courses = ["python", "math", "ort"];
    let totalCompleted = 0;
    let totalScore = 0;
    let totalAccuracy = 0;
    let courseCount = 0;

    courses.forEach((course) => {
      const completed = JSON.parse(
        localStorage.getItem(`completed_lessons_${course}`) || "[]"
      );
      totalCompleted += completed.length;

      // Estimate score (5 points per lesson, 10 per quiz)
      const estimatedScore = completed.length * 7;
      totalScore += estimatedScore;

      courseCount++;
    });

    const today = new Date().toISOString().split("T")[0];
    const lastActiveDate = localStorage.getItem("lastActiveDate") || today;

    let currentStreak = 1;
    if (lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      currentStreak = lastActiveDate === yesterday ? 1 : 0;
    }

    localStorage.setItem("lastActiveDate", today);
    localStorage.setItem("currentStreak", String(currentStreak));

    const longestStreak = parseInt(
      localStorage.getItem("longestStreak") || "0"
    );

    setStats({
      totalLessonsCompleted: totalCompleted,
      totalQuizzesCompleted: Math.floor(totalCompleted * 0.3),
      totalScore: totalScore,
      currentStreak: currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalEnergyUsed: totalCompleted * 7,
      averageAccuracy: 85 + Math.random() * 10,
      coursesInProgress: 2,
      coursesCompleted: totalCompleted > 15 ? 1 : 0,
    });

    localStorage.setItem("longestStreak", String(Math.max(longestStreak, currentStreak)));
  };

  const loadCourseProgress = async () => {
    try {
      const response = await fetch("/data/courses.json");
      const courses = await response.json();

      const progress: CourseProgress[] = courses.map((course: any) => {
        const completed = JSON.parse(
          localStorage.getItem(`completed_lessons_${course.id}`) || "[]"
        );
        return {
          id: course.id,
          name: course.name,
          icon: course.icon,
          progress: Math.round((completed.length / (course.lessons || 1)) * 100),
          lessons: course.lessons,
          completed: completed.length,
        };
      });

      setCourseProgress(progress);
    } catch (error) {
      console.error("Error loading course progress:", error);
    }
  };

  if (!isMounted) return null;

  const user = {
    name: "Learner",
    avatar: "https://avatars.githubusercontent.com/u/105328?v=4",
    email: "user@example.com",
    joinDate: "January 2025",
    bio: "🚀 Passionate about learning and coding!",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <button className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-700 font-semibold transition shadow-lg">
            ← Back
          </button>
        </Link>

        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-lg"
              />
              {isPremium && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 text-2xl shadow-lg">
                  ✨
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-800 mb-2">
                {user.name}
              </h1>
              <p className="text-slate-600 mb-2">{user.email}</p>
              <p className="text-sm text-slate-500 mb-4">
                Joined {user.joinDate}
              </p>
              <p className="text-lg text-slate-700 font-semibold">{user.bio}</p>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {isPremium && (
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-600 font-bold text-sm">
                    💎 Premium Member
                  </div>
                )}
                {stats.currentStreak > 0 && (
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 text-orange-600 font-bold text-sm">
                    🔥 {stats.currentStreak} Day Streak
                  </div>
                )}
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-600 font-bold text-sm">
                  ⭐ Level 5
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg transition transform hover:scale-105">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {["overview", "statistics", "achievements", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/70 text-slate-700 hover:bg-white/90"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Lessons",
                  value: stats.totalLessonsCompleted,
                  icon: "📖",
                  color: "from-blue-400 to-blue-500",
                },
                {
                  label: "Quizzes",
                  value: stats.totalQuizzesCompleted,
                  icon: "❓",
                  color: "from-purple-400 to-purple-500",
                },
                {
                  label: "Points",
                  value: stats.totalScore,
                  icon: "⭐",
                  color: "from-yellow-400 to-yellow-500",
                },
                {
                  label: "Streak",
                  value: stats.currentStreak,
                  icon: "🔥",
                  color: "from-orange-400 to-red-500",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-slate-600 font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Course Progress */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-800 mb-6">
                📚 Course Progress
              </h2>
              <div className="space-y-4">
                {courseProgress.map((course) => (
                  <div key={course.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-slate-800">
                        <span className="text-3xl mr-2">{course.icon}</span>
                        {course.name}
                      </span>
                      <span className="text-sm font-bold text-slate-600">
                        {course.completed} / {course.lessons}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {course.progress}% Complete
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "statistics" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Performance Stats */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-black text-slate-800 mb-6">
                  📊 Performance
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-slate-800">
                        Accuracy Rate
                      </span>
                      <span className="font-bold text-green-600">
                        {Math.round(stats.averageAccuracy)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: `${stats.averageAccuracy}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>Longest Streak:</strong> {stats.longestStreak} days
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>Total Energy Used:</strong>{" "}
                      {stats.totalEnergyUsed} points
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Average Score:</strong>{" "}
                      {Math.round(stats.totalScore / Math.max(stats.totalLessonsCompleted, 1))} points per lesson
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievement Stats */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-black text-slate-800 mb-6">
                  🏆 Achievements
                </h2>
                <div className="space-y-3">
                  {[
                    { icon: "🌟", title: "First Lesson", desc: "Complete your first lesson" },
                    { icon: "🔥", title: "7-Day Streak", desc: "Learn 7 days in a row" },
                    { icon: "💯", title: "Perfect Score", desc: "Get 100% on a quiz" },
                    { icon: "📚", title: "Course Master", desc: "Complete a full course" },
                  ].map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-slate-600">
                          {achievement.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              🎯 All Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { icon: "🌟", title: "Starter", locked: false },
                { icon: "🔥", title: "On Fire", locked: false },
                { icon: "💯", title: "Perfect", locked: true },
                { icon: "📚", title: "Scholar", locked: true },
                { icon: "🚀", title: "Rocket", locked: true },
                { icon: "👑", title: "Champion", locked: true },
                { icon: "🎓", title: "Master", locked: true },
                { icon: "💎", title: "Premium", locked: !isPremium },
              ].map((achievement, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl text-center transition transform hover:scale-105 ${
                    achievement.locked
                      ? "bg-slate-200 opacity-50"
                      : "bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg"
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <p className="font-bold text-slate-800">
                    {achievement.title}
                  </p>
                  {achievement.locked && (
                    <p className="text-xs text-slate-600 mt-2">🔒 Locked</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-800 mb-6">
                ⚙️ Settings
              </h2>

              {/* Notification Settings */}
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-slate-700">Daily reminders</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-slate-700">Streak notifications</span>
                </label>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4 mb-8 pt-8 border-t border-slate-200">
                <h3 className="font-bold text-slate-800">Privacy</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-slate-700">Show profile publicly</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span className="text-slate-700">
                    Allow others to see my stats
                  </span>
                </label>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4 pt-8 border-t border-red-200">
                <h3 className="font-bold text-red-600">Danger Zone</h3>
                <button
                  onClick={() => {
                    localStorage.removeItem("isPremium");
                    localStorage.removeItem("userEnergy");
                    window.location.reload();
                  }}
                  className="w-full px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
                >
                  🔄 Reset All Data
                </button>
                <button className="w-full px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition">
                  🚪 Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}