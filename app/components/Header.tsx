import Link from "next/link";
import React from "react";

const User = "https://avatars.githubusercontent.com/u/105328?v=4";

const Header = () => {
  return (
    <header className="navbar bg-base-300">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex">
          <Link href="/" className="btn btn-ghost text-xl">
            BitByBit
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <nav className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/users">Users</Link>
          </nav>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={User} />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
