"use client";

export default function AdminHome() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Colleges Card */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm uppercase font-semibold">
              Colleges
            </h3>
            <p className="text-3xl font-bold mt-1">12</p>{" "}
            {/* Replace with dynamic data later */}
          </div>
          <div className="text-blue-600 text-4xl">🏛️</div>
        </div>

        {/* Library Staff Card */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm uppercase font-semibold">
              Library Staff
            </h3>
            <p className="text-3xl font-bold mt-1">5</p>{" "}
            {/* Replace with dynamic data later */}
          </div>
          <div className="text-green-600 text-4xl">📚</div>
        </div>

        {/* Placeholder for more stats */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm uppercase font-semibold">
              Instructors
            </h3>
            <p className="text-3xl font-bold mt-1">20</p>
          </div>
          <div className="text-purple-600 text-4xl">👨‍🏫</div>
        </div>
      </div>

      <p className="text-gray-600 mt-8">
        Use the sidebar to access management sections.
      </p>
    </>
  );
}
