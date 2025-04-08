"use client";

import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const initialProjects = [
  {
    id: 1,
    name: "AI-Based Library System",
    department: "Computer Science",
    supervisor: "Dr. Ahmed",
    status: "Pending",
  },
  {
    id: 2,
    name: "Green Architecture Design",
    department: "Architecture",
    supervisor: "Prof. Maha",
    status: "Approved",
  },
];

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    department: "",
    supervisor: "",
    status: "",
  });

  const handleEditClick = (project) => {
    setEditing(project.id);
    setForm(project);
  };

  const handleUpdate = () => {
    setProjects((prev) =>
      prev.map((p) => (p.id === editing ? { ...form, id: editing } : p))
    );
    setEditing(null);
    setForm({ name: "", department: "", supervisor: "", status: "" });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        📁 Projects Management
      </h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Project Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Supervisor</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{project.name}</td>
                <td className="px-4 py-2">{project.department}</td>
                <td className="px-4 py-2">{project.supervisor}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      project.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-3">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Edit Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Supervisor"
              value={form.supervisor}
              onChange={(e) => setForm({ ...form, supervisor: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border border-gray-400 rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
