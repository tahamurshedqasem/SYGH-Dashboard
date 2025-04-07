"use client";

import { useState } from "react";

const universities = [
  { id: 1, name: "University A", hasAdmin: true },
  { id: 2, name: "University B", hasAdmin: false },
  { id: 3, name: "University C", hasAdmin: false },
];

const initialAdmins = [
  {
    id: 1,
    name: "Ali Mohammed",
    email: "ali@example.com",
    universityId: 1,
  },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    universityId: "",
  });
  const [mode, setMode] = useState(null); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const getUniversityName = (id) => {
    return universities.find((u) => u.id === parseInt(id))?.name || "Unknown";
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.email ||
      !form.universityId ||
      (mode === "add" && !form.password)
    ) {
      setError("All fields are required.");
      return;
    }

    // Prevent assigning multiple admins to same university
    const isDuplicate =
      mode === "add" &&
      admins.find(
        (admin) => admin.universityId === parseInt(form.universityId)
      );
    if (isDuplicate) {
      setError("This university already has an admin.");
      return;
    }

    if (mode === "edit") {
      setAdmins((prev) =>
        prev.map((a) => (a.id === editId ? { ...a, ...form } : a))
      );
    } else {
      const newAdmin = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        universityId: parseInt(form.universityId),
      };
      setAdmins([...admins, newAdmin]);
    }

    setForm({ name: "", email: "", password: "", universityId: "" });
    setEditId(null);
    setMode(null);
    setError("");
  };

  const handleDelete = (id) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admins Management</h2>
        <button
          onClick={() => {
            setMode("add");
            setForm({ name: "", email: "", password: "", universityId: "" });
            setError("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Admin
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">University</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="px-4 py-2">{admin.name}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2">
                  {getUniversityName(admin.universityId)}
                </td>
                <td className="px-4 py-2 space-x-3 text-center">
                  <button
                    onClick={() => {
                      setForm({
                        name: admin.name,
                        email: admin.email,
                        password: "",
                        universityId: admin.universityId,
                      });
                      setEditId(admin.id);
                      setMode("edit");
                      setError("");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {mode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {mode === "edit" ? "Edit Admin" : "Add Admin"}
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

            {mode === "add" && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full mb-3 border p-2 rounded"
              />
            )}

            <select
              value={form.universityId}
              onChange={(e) =>
                setForm({ ...form, universityId: e.target.value })
              }
              className="w-full mb-4 border p-2 rounded"
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option
                  key={uni.id}
                  value={uni.id}
                  disabled={
                    mode === "add" &&
                    uni.hasAdmin &&
                    admins.some((a) => a.universityId === uni.id)
                  }
                >
                  {uni.name}
                </option>
              ))}
            </select>

            {error && <p className="text-red-600 mb-3">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMode(null);
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    universityId: "",
                  });
                }}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {mode === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
