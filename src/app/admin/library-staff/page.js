"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiPlus, FiInfo, FiUser, FiChevronDown } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "http://127.0.0.1:8000/api";

export default function LibraryStaffPage() {
  const [staff, setStaff] = useState(null);
  const [college, setCollege] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    password_confirmation: "",
    college_id: "" 
  });
  const [mode, setMode] = useState(null); // 'add' | 'edit'
  const [warning, setWarning] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCollegeData();
  }, []);

  const fetchCollegeData = async () => {
    try {
      setLoading(true);
      setWarning("");
      
      // Fetch all available colleges
      const collegesRes = await axios.get(`${API_BASE}/admin/colleges`, {
        headers: getAuthHeaders(),
      });
      
      if (collegesRes.data.data && collegesRes.data.data.length > 0) {
        const collegesData = collegesRes.data.data;
        setColleges(collegesData);
        
        // If there's at least one college, use the first one as default
        const defaultCollege = collegesData[0];
        setCollege(defaultCollege);
        
        // Now fetch library staff data for this college
        await fetchLibraryStaff();
      } else {
        setWarning("No colleges found for this admin");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch college data:", err);
      setWarning(err.response?.data?.message || "Failed to load college data");
      toast.error("Failed to load college data");
      setLoading(false);
    }
  };

  const fetchLibraryStaff = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/libraraystaffs`, {
        headers: getAuthHeaders()
      });
      
      console.log("Library Staff API Response:", response.data);
      
      if (response.data && response.data.data) {
        const staffData = response.data.data;
        console.log("Raw Staff Data:", staffData);
        
        if (Array.isArray(staffData) && staffData.length > 0) {
          // Map the data to include user details directly
          const processedStaffData = staffData.map(staff => {
            console.log("Processing staff member:", staff);
            return {
              id: staff.id,
              name: staff.user?.name || "Unknown",
              email: staff.user?.email || "No email",
              user_id: staff.user_id,
              college_id: staff.college_id,
              created_at: staff.created_at,
              updated_at: staff.updated_at,
              raw_data: staff // Store original data for reference
            };
          });
          
          console.log("Processed Staff Data:", processedStaffData);
          
          // Store the full list of staff
          setStaffList(processedStaffData);
          
          // Use the first staff member as the currently selected one
          // or find one that matches the current college if possible
          if (college) {
            const collegeStaff = processedStaffData.find(s => s.college_id === college.id);
            if (collegeStaff) {
              setStaff(collegeStaff);
            } else {
              setStaff(processedStaffData[0]);
              
              // Update the current college to match the selected staff's college
              const staffCollege = colleges.find(c => c.id === processedStaffData[0].college_id);
              if (staffCollege) {
                setCollege(staffCollege);
              }
            }
          } else {
            setStaff(processedStaffData[0]);
          }
        } else {
          setStaff(null);
          setStaffList([]);
        }
      } else {
        setStaff(null);
        setStaffList([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch library staff:", err);
      setWarning(err.response?.data?.message || "Failed to load library staff data");
      toast.error("Failed to load library staff data");
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!form.name || !form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    
    if (!form.email || !form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    if (mode === 'add') {
      if (!form.college_id) {
        toast.error("Please select a college");
        return false;
      }
      
      if (!form.password || form.password.length < 10) {
        toast.error("Password must be at least 10 characters");
        return false;
      }
      
      if (form.password !== form.password_confirmation) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    
    const addToastId = toast.loading("Adding library staff...");
    
    try {
      const selectedCollegeId = form.college_id;
      if (!selectedCollegeId) {
        toast.error("No college selected", { id: addToastId });
        return;
      }
      
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);

      const response = await axios.post(
        `${API_BASE}/admin/colleges/${selectedCollegeId}/addlibraraystaff`, 
        formData, 
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Library staff added successfully", { id: addToastId });
        
        // Find the selected college name
        const selectedCollege = colleges.find(c => c.id == selectedCollegeId);
        
        // Update the local state with the new staff data
        if (response.data.data) {
          // Create a properly formatted staff object
          const newStaff = {
            id: response.data.data.id,
            name: form.name,
            email: form.email,
            user_id: response.data.data.user_id,
            college_id: selectedCollegeId,
            college_name: selectedCollege?.name || "Unknown College"
          };
          
          setStaff(newStaff);
          setStaffList(prev => [...prev, newStaff]);
          
          // Update the current college
          if (selectedCollege) {
            setCollege(selectedCollege);
          }
        }
        
        resetForm();
      } else {
        toast.error(response.data.message || "Failed to add library staff", { id: addToastId });
      }
    } catch (err) {
      console.error("Add error:", err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        toast.error(errorMessages[0] || "Validation error", { id: addToastId });
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error, { id: addToastId });
      } else {
        toast.error(err.response?.data?.message || "Failed to add library staff", { id: addToastId });
      }
    }
  };

  const handleUpdate = async () => {
    if (!form.name || !form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const updateToastId = toast.loading("Updating library staff...");
    
    try {
      if (!staff || !staff.id) {
        toast.error("No staff selected", { id: updateToastId });
        return;
      }
      
      // Get the user ID from the staff object
      const userId = staff.user_id;
      
      if (!userId) {
        toast.error("User ID is missing", { id: updateToastId });
        console.error("Missing user_id in staff object:", staff);
        return;
      }

      console.log("Updating staff with user ID:", userId);
      
      const formData = new FormData();
      formData.append("name", form.name.trim());
      
      if (form.password) {
        formData.append("password", form.password);
      }
      
      // Set the method to PUT
      formData.append("_method", "PUT");

      const response = await axios.post(
        `${API_BASE}/admin/colleges/${userId}/updatelibraraystaff`, 
        formData, 
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Library staff updated successfully", { id: updateToastId });
        
        // Update the local state with the updated staff data
        const updatedStaff = {
          ...staff,
          name: form.name
        };
        
        setStaff(updatedStaff);
        
        // Update in the staff list as well
        setStaffList(prev => 
          prev.map(s => s.id === staff.id ? updatedStaff : s)
        );
        
        resetForm();
      } else {
        toast.error(response.data.message || "Failed to update library staff", { id: updateToastId });
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        toast.error(errorMessages[0] || "Validation error", { id: updateToastId });
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error, { id: updateToastId });
      } else {
        toast.error(err.response?.data?.message || "Failed to update library staff", { id: updateToastId });
      }
    }
  };

  const handleDelete = async () => {
    if (!staff || !staff.id) {
      toast.error("No library staff to delete");
      return;
    }

    const deleteToastId = toast.loading("Deleting library staff...");
    
    try {
      // Log the staff data we're attempting to delete
      console.log("Attempting to delete staff:", staff);
      
      // Get the user ID from the staff object
      const userId = staff.id;
      // console.log(staff)
      
      if (!userId) {
        toast.error("User ID is missing", { id: deleteToastId });
        console.error("Missing user_id in staff object:", staff);
        return;
      }

      console.log("Deleting staff with user ID:", userId);

      const response = await axios.delete(
        `${API_BASE}/admin/colleges/${userId}/deletelibraraystaff`, 
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Delete response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Library staff deleted successfully", { id: deleteToastId });
        
        // Remove from the staff list
        setStaffList(prev => prev.filter(s => s.id !== staff.id));
        
        // Set next staff as selected, or null if none left
        if (staffList.length > 1) {
          const remainingStaff = staffList.filter(s => s.id !== staff.id);
          setStaff(remainingStaff[0]);
        } else {
          setStaff(null);
        }
        
        setShowDeleteConfirm(false);
      } else {
        toast.error(response.data.message || "Failed to delete library staff", { id: deleteToastId });
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete library staff", { id: deleteToastId });
    }
  };

  const resetForm = () => {
    setForm({ 
      name: "", 
      email: "", 
      password: "", 
      password_confirmation: "",
      college_id: college?.id || "" 
    });
    setMode(null);
    setWarning("");
  };

  // Add a helper function to select a specific library staff
  const selectStaff = (staffMember) => {
    setStaff(staffMember);
    
    // Find and update the college if necessary
    if (staffMember && staffMember.college_id) {
      const staffCollege = colleges.find(c => c.id === staffMember.college_id);
      if (staffCollege) {
        setCollege(staffCollege);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Library Staff Management</h2>
        <div className="flex gap-2">
        <button
          onClick={() => {
              setForm({ 
                name: "", 
                email: "", 
                password: "", 
                password_confirmation: "",
                college_id: college?.id || "" 
              });
              setMode("add");
              setWarning("");
          }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
            <FiPlus /> Add Library Staff
        </button>
        </div>
      </div>


      {warning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded flex items-center">
          <FiInfo className="mr-2" /> {warning}
        </div>
      )}

      {colleges.length === 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded flex items-center">
          <FiInfo className="mr-2" /> No colleges found. You need to add colleges first before managing library staff.
        </div>
      )}

      {staffList.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  College
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffList.map((staffMember, index) => (
                <tr key={staffMember.id} className={`hover:bg-gray-50 ${staff && staff.id === staffMember.id ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                    {staffMember.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    {staffMember.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    {colleges.find(c => c.id === staffMember.college_id)?.name || staffMember.college_name || "Unknown College"}
                </td>
                <td className="px-6 py-4 text-sm space-x-3">
                  <button
                    onClick={() => {
                        selectStaff(staffMember);
                      setForm({
                          name: staffMember.name,
                          email: staffMember.email,
                        password: "",
                          password_confirmation: "",
                          college_id: staffMember.college_id || ""
                      });
                      setMode("edit");
                      setWarning("");
                    }}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 inline-flex"
                  >
                      <FiEdit size={14} /> Edit
                  </button>
                  <button
                      onClick={() => {
                        selectStaff(staffMember);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 inline-flex"
                    >
                      <FiTrash size={14} /> Delete
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <FiUser className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-600 mb-4 text-lg">
              No library staff found.
            </p>
            <p className="text-gray-500 max-w-md mx-auto">
              Library staff members can manage projects, supervisors, and students for their assigned college.
            </p>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {mode && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {mode === "add" ? "Add Library Staff" : "Edit Library Staff"}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
            <input
              type="text"
                placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email {mode === "add" && <span className="text-red-500">*</span>}
              </label>
            <input
              type="email"
                placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={mode === "edit"}
                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  mode === "edit" ? "bg-gray-100" : ""
                }`}
              />
              {mode === "edit" && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              )}
            </div>

            {mode === "add" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={form.college_id} 
                    onChange={(e) => setForm({ ...form, college_id: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                  >
                    <option value="">Select a college</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FiChevronDown className="text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {mode === "add" && <span className="text-red-500">*</span>}
              </label>
            <input
              type="password"
                placeholder={mode === "add" ? "Enter password (min 10 characters)" : "Enter new password (optional)"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {mode === "edit" && (
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
              )}
            </div>

            {mode === "add" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={mode === "add" ? handleAdd : handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {mode === "add" ? "Add Staff" : "Update Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this library staff member? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
              >
                <FiTrash size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
