// "use client";

// import { useState } from "react";

// const mockUniversities = [
//   { id: 101, name: "University A" },
//   { id: 102, name: "University B" },
// ];

// const initialColleges = [
//   { id: 1, name: "Engineering College", universityId: 101 },
//   { id: 2, name: "Business College", universityId: 102 },
// ];

// export default function CollegesPage() {
//   const [colleges, setColleges] = useState(initialColleges);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(null);
//   const [showDeleteId, setShowDeleteId] = useState(null);
//   const [form, setForm] = useState({ name: "", universityId: "" });

//   const getUniversityName = (id) =>
//     mockUniversities.find((u) => u.id === id)?.name || "Unknown";

//   const resetForm = () => {
//     setForm({ name: "", universityId: "" });
//     setShowAddModal(false);
//     setShowEditModal(null);
//     setShowDeleteId(null);
//   };

//   const handleAdd = () => {
//     const newCollege = {
//       id: Date.now(),
//       name: form.name,
//       universityId: parseInt(form.universityId),
//     };
//     setColleges([...colleges, newCollege]);
//     resetForm();
//   };

//   const handleUpdate = () => {
//     setColleges(
//       colleges.map((c) =>
//         c.id === showEditModal
//           ? { ...c, name: form.name, universityId: parseInt(form.universityId) }
//           : c
//       )
//     );
//     resetForm();
//   };

//   const handleDelete = () => {
//     setColleges(colleges.filter((c) => c.id !== showDeleteId));
//     resetForm();
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Colleges Management</h2>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           + Add College
//         </button>
//       </div>

//       <div className="overflow-x-auto bg-white rounded-lg shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 #
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 College Name
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 University
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {colleges.map((college, index) => (
//               <tr key={college.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
//                 <td className="px-6 py-4 text-sm text-gray-800">
//                   {college.name}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {getUniversityName(college.universityId)}
//                 </td>
//                 <td className="px-6 py-4 text-sm space-x-3">
//                   <button
//                     onClick={() => {
//                       setShowEditModal(college.id);
//                       setForm({
//                         name: college.name,
//                         universityId: college.universityId.toString(),
//                       });
//                     }}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteId(college.id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add / Edit Modal */}
//       {(showAddModal || showEditModal) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded w-full max-w-md">
//             <h3 className="text-xl font-bold mb-4">
//               {showAddModal ? "Add New College" : "Edit College"}
//             </h3>

//             <input
//               type="text"
//               placeholder="College Name"
//               className="w-full mb-3 border p-2 rounded"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />

//             <select
//               value={form.universityId}
//               onChange={(e) =>
//                 setForm({ ...form, universityId: e.target.value })
//               }
//               className="w-full mb-4 border p-2 rounded"
//             >
//               <option value="">Select University</option>
//               {mockUniversities.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>

//             <div className="flex justify-end space-x-3">
//               <button onClick={resetForm} className="text-gray-600">
//                 Cancel
//               </button>
//               <button
//                 onClick={showAddModal ? handleAdd : handleUpdate}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 {showAddModal ? "Add" : "Update"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded w-full max-w-sm text-center">
//             <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
//             <p className="mb-4">
//               Are you sure you want to delete this college?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setShowDeleteId(null)}
//                 className="px-4 py-2 border rounded text-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", universityId: "" });

  localStorage.setItem("token", "3|MfXdNGk4UVLfXaOdNZKHE1fwZjuS0lgXgFvxB1dIca5e7063"); // Set your token here

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };
  
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const res = await axios.get(`${API_BASE}/universities`);
      setUniversities(res.data);
      if (res.data.length > 0) {
        fetchColleges(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch universities:", err);
    }
  };

  const fetchColleges = async (universityId) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/colleges/${universityId}`, {
        headers: getAuthHeaders(),
      });
      setColleges(res.data.data);
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
    }
  };

  const getUniversityName = (id) => {
    const uni = universities.find((u) => u.id === id);
    return uni ? uni.name : "Unknown";
  };

  const resetForm = () => {
    setForm({ name: "", universityId: "" });
    setShowAddModal(false);
    setShowEditModal(null);
    setShowDeleteId(null);
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);

      await axios.post(`${API_BASE}/admin/colleges/${form.universityId}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchColleges(form.universityId);
      resetForm();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("_method", "PUT");

      await axios.post(`${API_BASE}/admin/colleges/${showEditModal}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchColleges(form.universityId);
      resetForm();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/admin/colleges/${showDeleteId}`, {
        headers: getAuthHeaders(),
      });

      await fetchColleges(form.universityId);
      resetForm();
    } catch (err) {
      console.error("Delete error:", err);
    }
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">College Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">University</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {colleges.map((college, index) => (
              <tr key={college.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{college.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {getUniversityName(college.university_id)}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button
                    onClick={() => {
                      setShowEditModal(college.id);
                      setForm({
                        name: college.name,
                        universityId: String(college.university_id),
                      });
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteId(college.id);
                      setForm((prev) => ({ ...prev, universityId: college.university_id }));
                    }}
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

      {/* Add/Edit Modal */}
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
              onChange={(e) => setForm({ ...form, universityId: e.target.value })}
              className="w-full mb-4 border p-2 rounded"
            >
              <option value="">Select University</option>
              {universities.map((u) => (
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
            <p className="mb-4">Are you sure you want to delete this college?</p>
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
