"use client";

import { useState } from "react";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

export default function SupervisorManagementPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    groupNumber: "",
    department: "",
    qualification: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = () => {
    const requiredFields = [
      "name",
      "email",
      "password",
      "groupNumber",
      "department",
      "qualification",
    ];
    if (requiredFields.some((field) => !form[field])) return;

    if (isEditing) {
      const updated = [...supervisors];
      updated[editIndex] = form;
      setSupervisors(updated);
    } else {
      setSupervisors((prev) => [...prev, form]);
    }

    setForm({
      name: "",
      email: "",
      password: "",
      groupNumber: "",
      department: "",
      qualification: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setForm(supervisors[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!confirm("Are you sure you want to delete this supervisor?")) return;
    const updated = [...supervisors];
    updated.splice(index, 1);
    setSupervisors(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        👨‍🏫 Supervisor Management
      </h2>

      {/* Form */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <FiPlus />
          {isEditing ? "Edit Supervisor" : "Add New Supervisor"}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "name",
            "email",
            "password",
            "groupNumber",
            "department",
            "qualification",
          ].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border p-2 rounded"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow cursor-pointer"
        >
          {isEditing ? "Update" : "Add Supervisor"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-4">📋 Supervisor List</h3>
        {supervisors.length === 0 ? (
          <p className="text-gray-500">No supervisors added yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Password</th>
                <th className="px-4 py-2 text-left">Group No.</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Qualification</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map((sup, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{sup.name}</td>
                  <td className="px-4 py-2">{sup.email}</td>
                  <td className="px-4 py-2">••••••••</td>
                  <td className="px-4 py-2">{sup.groupNumber}</td>
                  <td className="px-4 py-2">{sup.department}</td>
                  <td className="px-4 py-2">{sup.qualification}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:underline"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
