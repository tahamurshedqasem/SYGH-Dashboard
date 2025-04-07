"use client";

import { useState } from "react";

const initialUniversities = [
  {
    id: 1,
    name: "University A",
    address: "123 King Abdulaziz St.",
    image: null,
  },
  {
    id: 2,
    name: "University B",
    address: "456 Al Imam Rd.",
    image: null,
  },
];

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState(initialUniversities);
  const [form, setForm] = useState({ name: "", address: "", image: null });
  const [mode, setMode] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleSubmit = () => {
    if (!form.name || !form.address) return;

    if (mode === "edit") {
      setUniversities((prev) =>
        prev.map((u) =>
          u.id === editId ? { ...u, ...form, image: form.image || u.image } : u
        )
      );
    } else {
      setUniversities((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          address: form.address,
          image: form.image,
        },
      ]);
    }

    setForm({ name: "", address: "", image: null });
    setEditId(null);
    setMode(null);
  };

  const handleDelete = (id) => {
    setUniversities((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Universities Management</h2>
        <button
          onClick={() => {
            setForm({ name: "", address: "", image: null });
            setMode("add");
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add University
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">University</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((uni) => (
              <tr key={uni.id} className="border-t">
                <td className="px-4 py-2">{uni.name}</td>
                <td className="px-4 py-2">{uni.address}</td>
                <td className="px-4 py-2">
                  {uni.image ? (
                    <img
                      src={URL.createObjectURL(uni.image)}
                      alt="university"
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => {
                      setForm({
                        name: uni.name,
                        address: uni.address,
                        image: uni.image,
                      });
                      setEditId(uni.id);
                      setMode("edit");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(uni.id)}
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
              {mode === "edit" ? "Edit University" : "Add University"}
            </h3>

            <input
              type="text"
              placeholder="University Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] || null })
              }
              className="w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMode(null);
                  setForm({ name: "", address: "", image: null });
                }}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
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
