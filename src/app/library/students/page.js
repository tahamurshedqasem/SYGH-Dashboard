// app/src/library/page.jsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
	FiUpload,
	FiPlus,
  FiEdit,
	FiTrash,
	FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function StudentManagementPage() {
	const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editStudentModal, setEditStudentModal] = useState(null);
  const [deleteStudentConfirm, setDeleteStudentConfirm] = useState(null);
  const [addStudentModal, setAddStudentModal] = useState(null);
  const [addStudentForm, setAddStudentForm] = useState({ name: "", email: "", studentUnid: "", isTemLeder: 0, graduation_year: new Date().getFullYear() });
  const [selectedFile, setSelectedFile] = useState(null);

  const API_BASE = "http://127.0.0.1:8000/api";
  const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("tempToken")}` });

	const fetchGroups = async () => {
		try {
			setLoading(true);
      const res = await axios.get(`${API_BASE}/librarayStaff/students`, { headers: getAuthHeaders() });
      if (res.data.successes && Array.isArray(res.data.data)) {
        const grouped = res.data.data.map(project => ({
          project_id: project.id,
          title: project.title,
          supervisor: project.supervisor_id,
          department: project.department?.name || "",
          department_id: project.department?.id || null,
          students: (project.students || []).map(student => ({
            id: student.id,
            user_id: student.user.id,
					name: student.user.name,
					email: student.user.email,
            studentUnid: student.studentUnid
          }))
			}));
			setGroups(grouped);
      }
		} catch (err) {
      toast.error("Error loading students", {
        duration: 3000,
        position: "top-right",
      });
		} finally {
			setLoading(false);
		}
	};

  const handleStudentUpdate = async () => {
    if (!editStudentModal.student.name || !editStudentModal.student.email) {
      return toast.error("Name and email are required");
    }
    
    try {
      const { student } = editStudentModal;
      setLoading(true);
      
      const res = await axios.put(`${API_BASE}/librarayStaff/students/${student.id}`, {
        name: student.name,
        email: student.email,
        studentUnid: student.studentUnid,
      }, { headers: getAuthHeaders() });

      if (res.data.success) {
        toast.success("Student updated successfully", {
          icon: "✅",
          duration: 3000,
        });
        setEditStudentModal(null);
        fetchGroups();
      } else {
        toast.error(res.data.message || "Failed to update student");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteStudent = async () => {
    try {
      setLoading(true);
      const id = deleteStudentConfirm.id;
      const res = await axios.delete(`${API_BASE}/librarayStaff/students/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (res.data.success) {
        toast.success("Student deleted successfully", {
          icon: "🗑️",
          duration: 3000,
        });
        fetchGroups();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
		} catch (err) {
      toast.error(err.response?.data?.message || "Delete error");
    } finally {
      setLoading(false);
      setDeleteStudentConfirm(null);
    }
  };

  const handleAddStudent = async (projectId, departmentId) => {
    if (!addStudentForm.name || !addStudentForm.email || !addStudentForm.studentUnid) {
      return toast.error("All fields are required");
    }
    
    try {
      setLoading(true);
      
      // Add debugging information
      console.log("Adding student with raw values:", {
        projectId,
        departmentId,
        formData: addStudentForm
      });
      
      // Safety check for valid IDs
      if (!projectId) {
        toast.error("Project ID is required");
        setLoading(false);
        return;
      }
      
      if (!departmentId) {
        toast.error("Department ID is required");
        setLoading(false);
        return;
      }
      
      // Parse values and convert to proper types
      const parsedProjectId = parseInt(projectId);
      const parsedDepartmentId = parseInt(departmentId);
      const parsedStudentId = parseInt(addStudentForm.studentUnid);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(parsedProjectId)) {
        toast.error("Invalid project ID");
        setLoading(false);
        return;
      }
      
      if (isNaN(parsedDepartmentId)) {
        toast.error("Invalid department ID");
        setLoading(false);
        return;
      }
      
      if (isNaN(parsedStudentId)) {
        toast.error("Invalid student ID format");
        setLoading(false);
        return;
      }
      
      // Create payload with proper type conversion - send directly, not wrapped in studentData
      const payload = {
        name: addStudentForm.name.trim(),
        email: addStudentForm.email.trim(),
        studentUnid: parsedStudentId,
        isTemLeder: 0, // Use integer 0 instead of boolean false as expected by Laravel
        project_id: parsedProjectId,
        department_id: parsedDepartmentId, // Now required
        graduation_year: currentYear // Now required
      };
      
      console.log("Adding student with formatted payload:", payload);
      
      // Send the data directly, not wrapped in studentData
      const res = await axios.post(
        `${API_BASE}/librarayStaff/students`, 
        payload, 
        { headers: getAuthHeaders() }
      );

      console.log("Add student response:", res.data);

      if (res.data.success) {
        toast.success("Student added successfully");
        
        // Clear form and close modal before fetching to avoid race conditions
        setAddStudentForm({ name: "", email: "", studentUnid: "", isTemLeder: 0, graduation_year: currentYear });
        setAddStudentModal(null);
        
        // Wait a brief moment before fetching to ensure UI state is updated
        setTimeout(() => {
          fetchGroups();
        }, 100);
      } else {
        toast.error(res.data.message || "Failed to add student");
      }
    } catch (err) {
      console.error("Add student error:", err);
      
      if (err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);
        
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Error (${err.response.status})`;
        toast.error(errorMessage);
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("No response from server. Check your connection.");
      } else {
        console.error("Error details:", err.message);
        toast.error("Request failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      await axios.post(
        `${API_BASE}/librarayStaff/import-excel`, 
        formData, 
        { 
          headers: getAuthHeaders(),
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      toast.success("Excel file uploaded successfully", {
        duration: 3000,
        position: "top-right",
        icon: "🎉",
      });
      
      setSelectedFile(null);
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Create a derived array of all students flattened with project info
  const filteredStudents = search.trim().length > 0 
    ? groups.flatMap(group => 
        group.students.map(student => ({
          ...student,
          projectTitle: group.title,
          departmentName: group.department,
          project_id: group.project_id
        }))
      ).filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  useEffect(() => {
    fetchGroups();
  }, []);

	return (
    <>
      <Toaster position="top-right" />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📚 Student Management</h1>
          <button 
            onClick={fetchGroups} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
				</div>

        {/* Add search input */}
        <div className="mb-6">
				<div className="relative">
					<input
						type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name..."
              className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {search.trim().length > 0 && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
				</div>
			</div>

        <div className="mb-8 p-5 bg-white rounded-lg shadow-md transition-all hover:shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
            <FiUpload className="mr-2 text-blue-500" /> Upload Student Data
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
						<input
                type="file"
                id="file-upload"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                accept=".xlsx,.xls,.csv"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="truncate">
                  {selectedFile ? selectedFile.name : "Choose Excel file"}
                </span>
                <FiUpload className="ml-2 text-gray-500" />
              </label>
				</div>

				<button
              onClick={handleFileUpload}
              disabled={!selectedFile || isUploading}
              className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 flex items-center gap-2 ${
                !selectedFile || isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload /> Upload
                </>
              )}
				</button>
			</div>

          {isUploading && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}% complete</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {search.trim().length > 0 && (
          <div className="mt-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔍 Search Results ({filteredStudents.length})</h3>
            
            {filteredStudents.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left text-gray-600 font-medium">Name</th>
                        <th className="p-3 text-left text-gray-600 font-medium">Email</th>
                        <th className="p-3 text-left text-gray-600 font-medium">Student ID</th>
                        <th className="p-3 text-left text-gray-600 font-medium">Project</th>
                        <th className="p-3 text-left text-gray-600 font-medium">Department</th>
                        <th className="p-3 text-center text-gray-600 font-medium w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr 
                          key={student.id} 
                          className="border-t hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 font-medium">{student.name}</td>
                          <td className="p-3 text-gray-600">{student.email}</td>
                          <td className="p-3 font-mono text-sm">{student.studentUnid}</td>
                          <td className="p-3">
                            <span className="text-blue-600">{student.projectTitle}</span>
                          </td>
                          <td className="p-3">
                            {student.departmentName && (
                              <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                                {student.departmentName}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center space-x-2">
									<button
                                onClick={() => setEditStudentModal({ student: { ...student } })}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                title="Edit student"
									>
                                <FiEdit size={16} />
									</button>
									<button
                                onClick={() => setDeleteStudentConfirm(student)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Delete student"
                              >
                                <FiTrash size={16} />
									</button>
								</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-100">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">No students matching "{search}" were found.</p>
              </div>
            )}
          </div>
        )}

        {/* Only show groups list if not searching or if searching is empty */}
        {(!search.trim().length > 0) && (
          <>
            {loading && groups.length === 0 && (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {groups.map((group, groupIdx) => (
              <div key={group.project_id} className="bg-white shadow-md rounded-lg mb-6 overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                  <h2 className="font-semibold text-lg text-gray-800">
                    <span className="text-blue-600">{group.title}</span>
                    {group.department && (
                      <span className="text-gray-500 ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {group.department}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setAddStudentModal({ project_id: group.project_id, department: group.department })}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-all shadow-sm"
                  >
                    <FiPlus size={16} /> Add Student
                  </button>
							</div>

                <div className="overflow-x-auto">
							<table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 text-gray-600 font-medium">Name</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Email</th>
                        <th className="text-left p-3 text-gray-600 font-medium">Student ID</th>
                        <th className="text-center p-3 text-gray-600 font-medium w-24">Actions</th>
									</tr>
								</thead>
								<tbody>
                      {group.students.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-500">
                            No students assigned to this project
													</td>
                        </tr>
                      ) : (
                        group.students.map((student, studentIdx) => (
                          <tr 
                            key={student.id} 
                            className="border-t hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3">{student.name}</td>
                            <td className="p-3 text-gray-600">{student.email}</td>
                            <td className="p-3 font-mono text-sm">{student.studentUnid}</td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center space-x-2">
													<button
                                  onClick={() => setEditStudentModal({ student: { ...student }, groupIdx })}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                  title="Edit student"
                                >
                                  <FiEdit size={16} />
													</button>
													<button
                                  onClick={() => setDeleteStudentConfirm(student)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                  title="Delete student"
                                >
                                  <FiTrash size={16} />
													</button>
                              </div>
												</td>
											</tr>
                        ))
                      )}
								</tbody>
							</table>
                </div>
              </div>
            ))}
          </>
        )}

        {addStudentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg transform transition-all">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FiPlus className="mr-2 text-green-500" /> 
                Add Student to Project
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter student name"
                    value={addStudentForm.name}
                    onChange={(e) => setAddStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter student email"
                    value={addStudentForm.email}
                    onChange={(e) => setAddStudentForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter student ID"
                    value={addStudentForm.studentUnid}
                    onChange={(e) => setAddStudentForm(prev => ({ ...prev, studentUnid: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter graduation year"
                    value={addStudentForm.graduation_year || new Date().getFullYear()}
                    onChange={(e) => setAddStudentForm(prev => ({ ...prev, graduation_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  />
                </div>

                {/* Show selected project info */}
                <div className="mt-2 p-2 bg-blue-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Selected Project:</span> {
                      groups.find(g => g.project_id === addStudentModal.project_id)?.title || "Unknown"
                    }
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Department:</span> {
                      groups.find(g => g.project_id === addStudentModal.project_id)?.department || "None"
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setAddStudentModal(null)}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!addStudentModal || !addStudentModal.project_id) {
                      return toast.error("Project selection is required");
                    }
                    
                    // Find the selected group based on project_id
                    const selectedGroup = groups.find(g => g.project_id === addStudentModal.project_id);
                    
                    if (!selectedGroup) {
                      return toast.error("Selected project not found");
                    }
                    
                    // Get department_id from the selected group
                    const departmentId = selectedGroup.department_id;
                    
                    console.log("Selected project and department:", {
                      project_id: addStudentModal.project_id,
                      department_id: departmentId,
                      selectedGroup
                    });
                    
                    // Call handleAddStudent with both IDs
                    handleAddStudent(addStudentModal.project_id, departmentId);
                  }}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    "Add Student"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {editStudentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg transform transition-all">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FiEdit className="mr-2 text-blue-500" /> Edit Student
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter student name"
                    value={editStudentModal.student.name}
                    onChange={(e) => setEditStudentModal(prev => ({ 
                      ...prev, 
                      student: { ...prev.student, name: e.target.value } 
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter student email"
                    value={editStudentModal.student.email}
                    onChange={(e) => setEditStudentModal(prev => ({ 
                      ...prev, 
                      student: { ...prev.student, email: e.target.value } 
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (Read-only)</label>
								<input
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-md bg-gray-50 text-gray-500"
                    placeholder="Student ID"
                    value={editStudentModal.student.studentUnid}
                    readOnly
								/>
							</div>
						</div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setEditStudentModal(null)}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStudentUpdate}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Student"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteStudentConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg transform transition-all">
              <div className="text-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiAlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Confirm Deletion</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to delete <span className="font-medium text-gray-800">{deleteStudentConfirm.name}</span>? 
                  This action cannot be undone.
                </p>
			</div>

              <div className="flex justify-center gap-3 mt-6">
							<button
                  onClick={() => setDeleteStudentConfirm(null)}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
							>
								Cancel
							</button>
							<button
                  onClick={confirmDeleteStudent}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
    </>
	);
}