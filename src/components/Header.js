"use client";

import { HiMenuAlt3 } from "react-icons/hi";

export default function Header({ toggleSidebar }) {
  return (
    <header className="h-16 bg-white shadow px-4 flex items-center justify-between md:ml-64">
      <button onClick={() => toggleSidebar()} className="md:hidden">
        <HiMenuAlt3 size={24} />
      </button>
      <h1 className="text-xl font-semibold">Welcome Back!</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 hidden sm:inline">John Doe</span>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}
