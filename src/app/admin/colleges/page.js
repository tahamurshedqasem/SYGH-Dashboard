"use client";

import { useState } from "react";

const mockUniversities = [
  { id: 101, name: "University A" },
  { id: 102, name: "University B" },
];

const initialColleges = [
  { id: 1, name: "Engineering College", universityId: 101 },
  { id: 2, name: "Business College", universityId: 102 },
];

export default function CollegesPage() {
  const [colleges, setColleges] = useState(initialColleges);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", universityId: "" });

  const getUniversityName = (id) =>
    mockUniversities.find((u) => u.id === id)?.name || "Unknown";

  const resetForm = () => {
    setForm({ name: "", universityId: "" });
    setShowAddModal(false);
    setShowEditModal(null);
    setShowDeleteId(null);
  };

  const handleAdd = () => {
    const newCollege = {
      id: Date.now(),
      name: form.name,
      universityId: parseInt(form.universityId),
    };
    setColleges([...colleges, newCollege]);
    resetForm();
  };

  const handleUpdate = () => {
    setColleges(
      colleges.map((c) =>
        c.id === showEditModal
          ? { ...c, name: form.name, universityId: parseInt(form.universityId) }
          : c
      )
    );
    resetForm();
  };

  const handleDelete = () => {
    setColleges(colleges.filter((c) => c.id !== showDeleteId));
    resetForm();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Colleges Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add College
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                College Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                University
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {colleges.map((college, index) => (
              <tr key={college.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {college.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {getUniversityName(college.universityId)}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button
                    onClick={() => {
                      setShowEditModal(college.id);
                      setForm({
                        name: college.name,
                        universityId: college.universityId.toString(),
                      });
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteId(college.id)}
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

      {/* Add / Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {showAddModal ? "Add New College" : "Edit College"}
            </h3>

            <input
              type="text"
              placeholder="College Name"
              className="w-full mb-3 border p-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.universityId}
              onChange={(e) =>
                setForm({ ...form, universityId: e.target.value })
              }
              className="w-full mb-4 border p-2 rounded"
            >
              <option value="">Select University</option>
              {mockUniversities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button onClick={resetForm} className="text-gray-600">
                Cancel
              </button>
              <button
                onClick={showAddModal ? handleAdd : handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {showAddModal ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-sm text-center">
            <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this college?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteId(null)}
                className="px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
