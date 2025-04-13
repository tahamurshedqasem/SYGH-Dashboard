"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const API = "http://127.0.0.1:8000/api/superadmin";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", universityId: "" });
  const [mode, setMode] = useState(null); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API}/admins`, { headers: getAuthHeaders() });
      setAdmins(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch admins");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await axios.get(`${API}/universities/statices`, { headers: getAuthHeaders() });
      setUniversities(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch universities");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchUniversities();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || (mode === "add" && (!form.universityId || !form.password))) {
      toast.error("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "edit") {
        await axios.put(`${API}/admin/${editId}`, {
          name: form.name,
          email: form.email,
          password: form.password || undefined,
        }, { headers: getAuthHeaders() });
        toast.success("Admin updated successfully");
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("password_confirmation", form.password);

        await axios.post(`${API}/admin/${form.universityId}`, formData, {
          headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
        });
        toast.success("Admin added successfully");
      }
      setForm({ name: "", email: "", password: "", universityId: "" });
      setEditId(null);
      setMode(null);
      setError("");
      fetchAdmins();
      fetchUniversities();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${API}/admin/${deleteId}`, { headers: getAuthHeaders() });
      setShowDeleteModal(false);
      toast.success("Admin deleted successfully");
      fetchAdmins();
      fetchUniversities();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
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
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">University</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{admin.name}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2">{admin.university_name || "-"}</td>
                <td className="px-4 py-2 text-center space-x-3">
                  <button
                    onClick={() => {
                      setForm({
                        name: admin.name,
                        email: admin.email,
                        password: "",
                        universityId: "",
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
                    onClick={() => confirmDelete(admin.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <div className="p-4 text-center">Loading...</div>}
      </div>

      {/* Form Modal */}
      {mode && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
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

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />

            {mode === "add" && (
              <select
                value={form.universityId}
                onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                className="w-full mb-4 border p-2 rounded"
              >
                <option value="">Select University</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
            )}

            {error && <p className="text-red-600 mb-3">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMode(null);
                  setForm({ name: "", email: "", password: "", universityId: "" });
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

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this admin?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
