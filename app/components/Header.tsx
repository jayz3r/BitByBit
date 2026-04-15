"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const User = "https://avatars.githubusercontent.com/u/105328?v=4";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

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
              href="/subjects"
              className={`transition ${
                isActive("/subjects")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Learn
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
                <li className="menu-title">
                  <span className="text-white font-semibold">Account</span>
                </li>
                <li>
                  <Link href="/profile" className="text-slate-200 hover:text-white hover:bg-purple-500/20">
                    👤 Profile
                  </Link>
                </li>
                <li>
                  <Link href="/progress" className="text-slate-200 hover:text-white hover:bg-purple-500/20">
                    📊 My Progress
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-slate-200 hover:text-white hover:bg-purple-500/20">
                    ⚙️ Settings
                  </Link>
                </li>
                <li>
                  <hr className="my-2 border-slate-700" />
                </li>
                <li>
                  <Link href="/logout" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
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
              href="/subjects"
              className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
            >
              Learn
            </Link>
            <Link
              href="/users"
              className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
            >
              Community
            </Link>
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