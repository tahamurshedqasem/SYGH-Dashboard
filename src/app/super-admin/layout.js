import Sidebar from "@/components/Sidebar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar isOpen={true} role="super-admin" />
      <main className="ml-64 p-6 w-full bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
