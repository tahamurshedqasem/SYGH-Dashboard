"use client";

import { HiMenuAlt3 } from "react-icons/hi";

export default function Topbar({ toggleSidebar, showToggle }) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
      {showToggle && (
        <button onClick={toggleSidebar} className="text-gray-800 text-2xl">
          <HiMenuAlt3 />
        </button>
      )}
      <h1 className="text-xl font-semibold">Welcome Back!</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600 hidden sm:block">John Doe</span>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}
