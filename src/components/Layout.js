"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Auto-detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Tailwind's `lg`
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isLargeScreen || sidebarOpen} />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isLargeScreen ? "lg:ml-64" : sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Topbar toggleSidebar={toggleSidebar} showToggle={!isLargeScreen} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
