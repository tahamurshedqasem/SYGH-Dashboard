"use client";

import Sidebar from "@/components/Sidebar";

export default function LibraryLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar isOpen={true} role="library-staff" />
      <main className="ml-64 p-6 w-full bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
