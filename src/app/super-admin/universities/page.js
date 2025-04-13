"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000/api/superadmin";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", image: null });
  const [mode, setMode] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUniversities(page);
  }, [page]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchUniversities = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/universities?page=${pageNum}`, {
        headers: getAuthHeaders(),
      });
      const result = res.data.data;
      setUniversities(result.data);
      setLastPage(result.last_page);
    } catch (err) {
      toast.error("Failed to fetch universities.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address) {
      toast.error("Name and Address are required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("address", form.address);
    if (form.image) formData.append("image", form.image);

    try {
      const config = {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      };
      if (mode === "edit") {
        await axios.post(`${API_BASE}/university/${editId}?_method=PUT`, formData, config);
        toast.success("University updated successfully.");
      } else {
        await axios.post(`${API_BASE}/university`, formData, config);
        toast.success("University added successfully.");
      }
      resetForm();
      fetchUniversities(page);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submit failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/university/${deleteId}`, {
        headers: getAuthHeaders(),
      });
      setShowDeleteModal(false);
      toast.success("University deleted successfully.");
      fetchUniversities(page);
    } catch (err) {
      // toast.error("Delete failed.");
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const resetForm = () => {
    setForm({ name: "", address: "", image: null });
    setEditId(null);
    setMode(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Universities Management</h2>
        <button
          onClick={() => {
            resetForm();
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
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">University</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((uni, index) => (
              <tr key={uni.id} className="border-t">
                <td className="px-4 py-2">{(page - 1) * 10 + index + 1}</td>
                <td className="px-4 py-2">{uni.name}</td>
                <td className="px-4 py-2">{uni.address}</td>
                <td className="px-4 py-2">
                  {uni.image ? (
                    <img
                      src={uni.image.startsWith('http') ? uni.image : `http://127.0.0.1:8000/storage/${uni.image}`}
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
                      setForm({ name: uni.name, address: uni.address, image: null });
                      setEditId(uni.id);
                      setMode("edit");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { setDeleteId(uni.id); setShowDeleteModal(true); }}
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

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-1 rounded ${num === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {num}
          </button>
        ))}
      </div>

      {mode && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{mode === "edit" ? "Edit University" : "Add University"}</h3>

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

            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <FiImage className="text-gray-600" />
              <span className="text-sm text-gray-600">Upload University Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] || null })}
                className="hidden"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="text-gray-600">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
                {mode === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this university?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded border border-gray-400">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}