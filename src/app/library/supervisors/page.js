// "use client";

// import { useState } from "react";
// import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

// export default function SupervisorManagementPage() {
//   const [supervisors, setSupervisors] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     groupNumber: "",
//     department: "",
//     qualification: "",
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);

//   const handleSubmit = () => {
//     const requiredFields = [
//       "name",
//       "email",
//       "password",
//       "groupNumber",
//       "department",
//       "qualification",
//     ];
//     if (requiredFields.some((field) => !form[field])) return;

//     if (isEditing) {
//       const updated = [...supervisors];
//       updated[editIndex] = form;
//       setSupervisors(updated);
//     } else {
//       setSupervisors((prev) => [...prev, form]);
//     }

//     setForm({
//       name: "",
//       email: "",
//       password: "",
//       groupNumber: "",
//       department: "",
//       qualification: "",
//     });
//     setIsEditing(false);
//     setEditIndex(null);
//   };

//   const handleEdit = (index) => {
//     setForm(supervisors[index]);
//     setIsEditing(true);
//     setEditIndex(index);
//   };

//   const handleDelete = (index) => {
//     if (!confirm("Are you sure you want to delete this supervisor?")) return;
//     const updated = [...supervisors];
//     updated.splice(index, 1);
//     setSupervisors(updated);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800">
//         👨‍🏫 Supervisor Management
//       </h2>

//       {/* Form */}
//       <div className="bg-white shadow rounded p-6 space-y-4">
//         <div className="flex items-center gap-2 text-green-600 font-semibold">
//           <FiPlus />
//           {isEditing ? "Edit Supervisor" : "Add New Supervisor"}
//         </div>

//         <div className="grid md:grid-cols-2 gap-4">
//           {[
//             "name",
//             "email",
//             "password",
//             "groupNumber",
//             "department",
//             "qualification",
//           ].map((field) => (
//             <input
//               key={field}
//               type={field === "password" ? "password" : "text"}
//               placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
//               value={form[field]}
//               onChange={(e) => setForm({ ...form, [field]: e.target.value })}
//               className="border p-2 rounded"
//             />
//           ))}
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow cursor-pointer"
//         >
//           {isEditing ? "Update" : "Add Supervisor"}
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow rounded p-4 overflow-auto">
//         <h3 className="text-lg font-semibold mb-4">📋 Supervisor List</h3>
//         {supervisors.length === 0 ? (
//           <p className="text-gray-500">No supervisors added yet.</p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left">Name</th>
//                 <th className="px-4 py-2 text-left">Email</th>
//                 <th className="px-4 py-2 text-left">Password</th>
//                 <th className="px-4 py-2 text-left">Group No.</th>
//                 <th className="px-4 py-2 text-left">Department</th>
//                 <th className="px-4 py-2 text-left">Qualification</th>
//                 <th className="px-4 py-2 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {supervisors.map((sup, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="px-4 py-2">{sup.name}</td>
//                   <td className="px-4 py-2">{sup.email}</td>
//                   <td className="px-4 py-2">••••••••</td>
//                   <td className="px-4 py-2">{sup.groupNumber}</td>
//                   <td className="px-4 py-2">{sup.department}</td>
//                   <td className="px-4 py-2">{sup.qualification}</td>
//                   <td className="px-4 py-2 text-center space-x-2">
//                     <button
//                       onClick={() => handleEdit(index)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       <FiEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="text-red-600 hover:underline"
//                     >
//                       <FiTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

const API = "http://127.0.0.1:8000/api/librarayStaff/supervisors";


export default function SupervisorManagementPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    supervisorDgree: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchSupervisors = async () => {
    try {
      const res = await axios.get(API, {
        headers: getAuthHeaders(),
      
      });
    

      setSupervisors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch supervisors:", err);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.supervisorDgree) return;
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("supervisorDgree", form.supervisorDgree);

      await axios.post(API, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      resetForm();
      fetchSupervisors();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.email || !form.password || !form.password_confirmation) return;

    try {
      await axios.put(
        `${API}/${editId}`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          supervisorDgree: form.supervisorDgree,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      resetForm();
      fetchSupervisors();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this supervisor?");
    if (!confirm) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchSupervisors();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      supervisorDgree: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (sup) => {
    setForm({
      name: sup.user.name,
      email: sup.user.email,
      password: "",
      password_confirmation: "",
      supervisorDgree: sup.supervisorDgree,
    });
    setIsEditing(true);
    setEditId(sup.id);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        👨‍🏫 Supervisor Management
      </h2>

      {/* Add or Edit Form */}
      {showForm && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <FiPlus />
            {isEditing ? "Edit Supervisor" : "Add New Supervisor"}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.password_confirmation}
                  onChange={(e) =>
                    setForm({ ...form, password_confirmation: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={form.supervisorDgree}
                  onChange={(e) =>
                    setForm({ ...form, supervisorDgree: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Supervisor Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={form.supervisorDgree}
                  onChange={(e) =>
                    setForm({ ...form, supervisorDgree: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={isEditing ? handleUpdate : handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              {isEditing ? "Update Supervisor" : "Add Supervisor"}
            </button>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List Table */}
      <div className="bg-white shadow rounded p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📋 Supervisor List</h3>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            <FiPlus /> Add New
          </button>
        </div>

        {supervisors.length === 0 ? (
          <p className="text-gray-500">No supervisors found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Password</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Qualification</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
  {supervisors.map((sup) => (
    <tr key={sup.id} className="border-t">
      <td className="px-4 py-2">{sup.user?.name}</td>
      <td className="px-4 py-2">{sup.user?.email}</td>
      <td className="px-4 py-2">••••••••</td>
      <td className="px-4 py-2">{sup.college?.name || "N/A"}</td> {/* <-- UPDATED */}
      <td className="px-4 py-2">{sup.supervisorDgree}</td>
      <td className="px-4 py-2 text-center space-x-2">
        <button
          onClick={() => openEdit(sup)}
          className="text-blue-600 hover:underline"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => handleDelete(sup.id)}
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
