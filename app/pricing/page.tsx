"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const premium = localStorage.getItem("isPremium") === "true";
    setIsPremium(premium);
  }, []);

  if (!isMounted) return null;

  const handleUpgrade = () => {
    localStorage.setItem("isPremium", "true");
    router.push("/subjects");
  };

  const features = [
    {
      name: "Daily Energy",
      free: "30 points/day",
      premium: "∞ Unlimited",
      icon: "⚡",
    },
    {
      name: "Wrong Answer Penalty",
      free: "-3 hearts each",
      premium: "No penalty",
      icon: "❤️",
    },
    {
      name: "Lessons & Quizzes",
      free: "Full access",
      premium: "Full access",
      icon: "📚",
    },
    {
      name: "Offline Mode",
      free: "❌ No",
      premium: "✅ Yes",
      icon: "📱",
    },
    {
      name: "Advanced Statistics",
      free: "❌ No",
      premium: "✅ Yes",
      icon: "📊",
    },
    {
      name: "Personalized Recommendations",
      free: "❌ No",
      premium: "✅ Yes",
      icon: "🎯",
    },
    {
      name: "Ad-Free Experience",
      free: "❌ No",
      premium: "✅ Yes",
      icon: "🚫",
    },
    {
      name: "Priority Support",
      free: "❌ No",
      premium: "✅ Yes",
      icon: "🎧",
    },
    {
      name: "Exclusive Content",
      free: "❌ No",
      premium: "✅ Yes",
      icon: "🎁",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 py-12 px-4 relative overflow-hidden">
      {/* Animated background clouds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-16 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-20 bg-white rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-18 bg-white rounded-full opacity-25 animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-1/3 w-44 h-24 bg-white rounded-full opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <Link href="/">
          <button className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm text-slate-700 font-semibold transition shadow-lg hover:shadow-xl">
            ← Back
          </button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-800 mb-4 drop-shadow-lg">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Unlock unlimited learning and take your skills to the next level
          </p>

          {isPremium && (
            <div className="mt-6 inline-block bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              ✅ You are a Premium Member!
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-slate-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Free</h2>
              <p className="text-slate-600 mb-4">Start your learning journey</p>
              <div className="text-4xl font-black text-slate-800">
                $0<span className="text-lg text-slate-600">/month</span>
              </div>
            </div>

            <button
              disabled={!isPremium}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 text-white font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPremium ? "Current Plan" : "Get Started"}
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-bold text-slate-800">Daily Energy Limit</p>
                  <p className="text-sm text-slate-600">30 points per day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="font-bold text-slate-800">Heart Penalties</p>
                  <p className="text-sm text-slate-600">-3 for wrong answers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-bold text-slate-800">Core Lessons</p>
                  <p className="text-sm text-slate-600">Full access to lessons</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-bold text-slate-800">Online Learning</p>
                  <p className="text-sm text-slate-600">Web-based only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative">
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                ⭐ Most Popular
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl border-4 border-gradient-to-r from-purple-500 to-pink-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Premium</h2>
                <p className="text-slate-600 mb-4">Unlimited potential</p>
                <div>
                  <div className="text-4xl font-black text-purple-600">
                    $9.99<span className="text-lg text-slate-600">/month</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    First 7 days free. Cancel anytime.
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={isPremium}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPremium ? "✅ You're Premium!" : "Upgrade Now"}
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-bold text-slate-800">Unlimited Energy</p>
                    <p className="text-sm text-slate-600">Learn at your pace</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <p className="font-bold text-slate-800">No Penalties</p>
                    <p className="text-sm text-slate-600">
                      Learn without restrictions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-bold text-slate-800">Full Access</p>
                    <p className="text-sm text-slate-600">All lessons & content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-bold text-slate-800">Offline Mode</p>
                    <p className="text-sm text-slate-600">
                      Learn without internet
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-bold text-slate-800">Advanced Stats</p>
                    <p className="text-sm text-slate-600">
                      Track your progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="font-bold text-slate-800">Exclusive Content</p>
                    <p className="text-sm text-slate-600">Premium courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-slate-200 mb-12">
          <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-4 px-4">
                    <span className="text-2xl mr-2">✨</span> Feature
                  </th>
                  <th className="text-center py-4 px-4">
                    <span className="text-2xl">Free</span>
                  </th>
                  <th className="text-center py-4 px-4">
                    <span className="text-2xl">Premium</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-200 ${
                      idx % 2 === 0 ? "bg-slate-50" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="text-2xl mr-2">{feature.icon}</span>
                      <span className="font-semibold text-slate-800">
                        {feature.name}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4 text-slate-600">
                      {feature.free}
                    </td>
                    <td className="text-center py-4 px-4 font-bold text-green-600">
                      {feature.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes! You can cancel your subscription at any time without penalties.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! You get 7 days free when you first upgrade to Premium.",
              },
              {
                q: "What happens if I don't have energy?",
                a: "Free users can wait for energy to reset daily, or upgrade to Premium for unlimited energy.",
              },
              {
                q: "Will my progress be saved?",
                a: "Absolutely! All your progress, scores, and stats are saved automatically.",
              },
              {
                q: "Can I switch back to free?",
                a: "Yes, you can downgrade to free at any time. You'll just have energy limits again.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-slate-200 cursor-pointer hover:shadow-lg transition"
              >
                <summary className="font-bold text-slate-800 text-lg flex items-center justify-between">
                  {faq.q}
                  <span className="text-2xl group-open:hidden">▶</span>
                  <span className="text-2xl hidden group-open:inline">▼</span>
                </summary>
                <p className="text-slate-600 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-black mb-4">Ready to Level Up?</h3>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Join thousands of learners who have unlocked their full potential with
              Premium. Start your 7-day free trial today!
            </p>
            <button
              onClick={handleUpgrade}
              disabled={isPremium}
              className="px-8 py-4 rounded-xl bg-white text-purple-600 font-bold text-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50"
            >
              {isPremium ? "You're Already Premium! 🎉" : "Start Free Trial"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}