"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const User = "https://avatars.githubusercontent.com/u/105328?v=4";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const premium = localStorage.getItem("isPremium") === "true";
    setIsPremium(premium);
  }, []);

  const isActive = (path: string) => pathname === path;

  if (!isMounted) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BitByBit
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              href="/"
              className={`transition ${
                isActive("/")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`transition ${
                isActive("/coursess")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Learn
            </Link>
            <Link
              href="/pricing"
              className={`transition ${
                isActive("/pricing")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/users"
              className={`transition ${
                isActive("/users")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Community
            </Link>

            {/* Premium Badge */}
            {isPremium && (
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-300 font-bold text-sm">
                ✨ Premium
              </div>
            )}
          </nav>

          {/* Right Side - Search and Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden sm:flex">
              <input
                type="text"
                placeholder="Search lessons..."
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400/50 transition"
              />
            </div>

            {/* Upgrade Button (visible if not premium) */}
            {!isPremium && (
              <Link href="/pricing">
                <button className="hidden sm:block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition">
                  Upgrade
                </button>
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-purple-500 transition"
              >
                <div className="w-10 rounded-full ring-2 ring-purple-400/30">
                  <img alt="User avatar" src={User} />
                </div>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-slate-800/95 backdrop-blur border border-slate-700/50 rounded-lg z-50 w-52 p-2 shadow-xl"
              >
                {/* Premium Status */}
                <li className="menu-title">
                  <span className="text-white font-semibold">
                    {isPremium ? "✨ Premium Member" : "Account"}
                  </span>
                </li>

                <li>
                  <Link
                    href="/profile"
                    className="text-slate-200 hover:text-white hover:bg-purple-500/20"
                  >
                    👤 Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/progress"
                    className="text-slate-200 hover:text-white hover:bg-purple-500/20"
                  >
                    📊 My Progress
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="text-slate-200 hover:text-white hover:bg-purple-500/20"
                  >
                    ⚙️ Settings
                  </Link>
                </li>

                {/* Pricing Link */}
                {!isPremium && (
                  <>
                    <li>
                      <hr className="my-2 border-slate-700" />
                    </li>
                    <li>
                      <Link
                        href="/pricing"
                        className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 font-semibold"
                      >
                        💎 Upgrade to Premium
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <hr className="my-2 border-slate-700" />
                </li>
                <li>
                  <Link
                    href="/logout"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    🚪 Logout
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-ghost btn-circle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-slate-700 pt-4">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
            >
              Learn
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
            >
              Pricing
            </Link>
            <Link
              href="/users"
              className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
            >
              Community
            </Link>

            {/* Premium Badge Mobile */}
            {isPremium && (
              <div className="px-4 py-2 mx-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-300 font-bold text-sm text-center">
                ✨ Premium Member
              </div>
            )}

            {/* Upgrade Button Mobile */}
            {!isPremium && (
              <Link href="/pricing" className="block">
                <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg transition mt-2">
                  💎 Upgrade Now
                </button>
              </Link>
            )}

            <input
              type="text"
              placeholder="Search lessons..."
              className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400/50 transition mt-4"
            />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;