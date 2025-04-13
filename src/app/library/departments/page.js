
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const API_BASE = "http://127.0.0.1:8000/api/librarayStaff/departments";
localStorage.setItem("token", "3|OVPMmiaiBnJzMHhipQBgeC6i8DSuiyxb6Dl47PFnf738c628"); // Set your token here

export default function DepartmentManagementPage() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [mode, setMode] = useState(null); // 'add' | 'edit'
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: getAuthHeaders(),
      });

      const departmentsList = res.data.data?.[0]?.college?.department || [];
      setDepartments(departmentsList);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  const openModal = (type, dept = null) => {
    setMode(type);
    if (type === "edit" && dept) {
      setForm({ name: dept.name });
      setEditId(dept.id);
    } else {
      setForm({ name: "" });
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);

      if (mode === "add") {
        await axios.post(API_BASE, formData, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (mode === "edit") {
        formData.append("_method", "PUT");
        await axios.post(`${API_BASE}/${editId}`, formData, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        });
      }

      await fetchDepartments();
      setForm({ name: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this department?");
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: getAuthHeaders(),
      });

      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6 p-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          🏛 Department Management
        </h2>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow cursor-pointer"
        >
          <FiPlus /> Add Department
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Department Name</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{dept.name}</td>
                <td className="px-4 py-2 text-center space-x-3">
                  <button
                    onClick={() => openModal("edit", dept)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {departments.length === 0 && (
          <p className="text-center text-gray-500 py-4">No departments found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {mode === "edit" ? "Edit Department" : "Add Department"}
            </h3>
            <input
              type="text"
              placeholder="Department Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-4 border p-2 rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              >
                <FiXCircle /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              >
                <FiCheckCircle /> {mode === "edit" ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
