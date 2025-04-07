"use client";

import { useState } from "react";

export default function LibraryStaffPage() {
  const [staff, setStaff] = useState({
    id: 1,
    name: "Khalid Al-Otaibi",
    email: "khalid@example.com",
    college: "Engineering College",
  });

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [mode, setMode] = useState(null); // 'add' | 'edit'
  const [warning, setWarning] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.email || !form.password) {
      setWarning("All fields are required.");
      return;
    }

    setStaff({
      id: Date.now(),
      name: form.name,
      email: form.email,
      college: "Engineering College",
    });
    

    setForm({ name: "", email: "", password: "" });
    setMode(null);
    setWarning("");
  };

  const handleUpdate = () => {
    if (!form.name || !form.email) {
      setWarning("Name and Email are required.");
      return;
    }

    setStaff((prev) => ({
      ...prev,
      name: form.name,
      email: form.email,
    }));

    setForm({ name: "", email: "", password: "" });
    setMode(null);
    setWarning("");
  };

  const handleDelete = () => {
    setStaff(null);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Library Staff Management</h2>
        <button
          onClick={() => {
            if (staff) {
              setWarning(
                "There is already a library staff assigned to this college."
              );
            } else {
              setForm({ name: "", email: "", password: "" });
              setMode("add");
              setWarning("");
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Library Staff
        </button>
      </div>

      {warning && (
        <div className="mb-4 text-red-600 font-medium">{warning}</div>
      )}

      {staff ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  College
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">1</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {staff.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {staff.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {staff.college}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button
                    onClick={() => {
                      setForm({
                        name: staff.name,
                        email: staff.email,
                        password: "",
                      });
                      setMode("edit");
                      setWarning("");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">
          No library staff assigned to this college.
        </p>
      )}

      {/* Add / Edit Modal */}
      {mode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {mode === "add" ? "Add Library Staff" : "Edit Library Staff"}
            </h3>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mb-4 border p-2 rounded"
            />

            <div className="flex justify-end space-x-3">
              <button onClick={() => setMode(null)} className="text-gray-600">
                Cancel
              </button>
              <button
                onClick={mode === "add" ? handleAdd : handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {mode === "add" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this library staff member?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
