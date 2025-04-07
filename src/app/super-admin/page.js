"use client";

export default function SuperAdminHome() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
      <p className="text-gray-600">
        Welcome, Super Admin! Use the sidebar to manage universities and admins.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-lg font-semibold">Universities</h3>
          <p className="text-gray-600 mt-2">
            Manage all registered universities and their data.
          </p>
        </div>
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-lg font-semibold">Admins</h3>
          <p className="text-gray-600 mt-2">
            View, add, and manage university admins.
          </p>
        </div>
      </div>
    </div>
  );
}
