"use client";

import { useEnergy } from "./hooks/useEnergy";
import { useState } from "react";

export default function EnergyBar() {
  const { energy, maxEnergy, isPremium } = useEnergy();
  const [showPremium, setShowPremium] = useState(false);

  const percentage = (energy / maxEnergy) * 100;

  if (isPremium) {
    return null; // Hide for premium users
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Energy Hearts */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <span className="font-bold text-slate-800">
            {energy} / {maxEnergy}
          </span>
        </div>

        {/* Energy Bar */}
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
          <div
            className={`h-full transition-all duration-300 ${
              percentage > 50
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : percentage > 20
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                  : "bg-gradient-to-r from-red-400 to-pink-500"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Premium Button */}
        {energy < 5 && (
          <button
            onClick={() => setShowPremium(true)}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs hover:shadow-lg transition"
          >
            🔓 Unlock
          </button>
        )}
      </div>

      {/* Premium Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowPremium(false)}
              className="absolute top-4 right-4 text-2xl hover:opacity-50"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="text-6xl text-center mb-4">⚡</div>

            {/* Title */}
            <h2 className="text-3xl font-black text-slate-800 text-center mb-2">
              Out of Energy!
            </h2>

            {/* Subtitle */}
            <p className="text-slate-600 text-center mb-6">
              You've used up your daily energy. Get unlimited access with
              Premium!
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <span className="text-slate-700 font-semibold">
                  Unlimited Energy
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <span className="text-slate-700 font-semibold">
                  Offline Access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-slate-700 font-semibold">
                  Advanced Stats
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <span className="text-slate-700 font-semibold">
                  Exclusive Content
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 rounded-xl bg-slate-100 text-center">
              <p className="text-sm text-slate-600 mb-1">Special Offer</p>
              <p className="text-3xl font-black text-slate-800">$9.99/mo</p>
              <p className="text-xs text-slate-600">
                First 7 days free. Cancel anytime.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  localStorage.setItem("isPremium", "true");
                  setShowPremium(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-lg transition"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => setShowPremium(false)}
                className="w-full py-3 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition"
              >
                Come Back Tomorrow
              </button>
            </div>

            {/* Fine Print */}
            <p className="text-xs text-slate-500 text-center mt-4">
              Energy refreshes daily at midnight
            </p>
          </div>
        </div>
      )}
    </>
  );
}