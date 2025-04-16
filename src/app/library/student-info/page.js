"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiMail, FiKey, FiSearch, FiDownload, FiCopy, FiFilter, FiX } from "react-icons/fi";

export default function StudentInfoPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copySuccess, setCopySuccess] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    year: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api";
  const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("tempToken")}` });

  // Fetch student information
  const fetchStudentInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/librarayStaff/students/information`, 
        { headers: getAuthHeaders() }
      );
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const studentData = response.data.data;
        setStudents(studentData);
        
        // Extract unique departments and years for filters
        const uniqueDepartments = [...new Set(studentData.map(student => student.department).filter(Boolean))];
        setDepartments(uniqueDepartments.sort());
        
        // Extract unique years and format them
        const uniqueYears = [...new Set(studentData.map(student => {
          if (!student.graduation_year) return null;
          // If it's a date string, extract just the year
          if (typeof student.graduation_year === 'string' && student.graduation_year.includes('-')) {
            return student.graduation_year.split('-')[0];
          }
          return student.graduation_year;
        }).filter(Boolean))];
        setYears(uniqueYears.sort());
      } else {
        toast.error("Failed to load student information");
      }
    } catch (error) {
      console.error("Error fetching student information:", error);
      toast.error(error.response?.data?.message || "Error loading student information");
    } finally {
      setLoading(false);
    }
  };

  // Handle copying text to clipboard
  const copyToClipboard = (text, id) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
        toast.success("Copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy text");
      }
    );
  };

  // Export data to CSV
  const exportToCSV = () => {
    // Apply all filters to the data before export
    const filteredData = getFilteredStudents();
    
    // Create CSV content
    const headers = ["Name", "Email", "Password", "Student ID", "Department", "Graduation Year"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(student => [
        `"${student.name || ''}"`,
        `"${student.email || ''}"`,
        `"${student.plain_password || ''}"`,
        `"${student.id || ''}"`,
        `"${student.department || ''}"`,
        `"${formatGraduationYear(student.graduation_year) || ''}"`,
      ].join(","))
    ].join("\n");
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_information.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Student information exported successfully");
  };

  // Format graduation year for display
  const formatGraduationYear = (yearValue) => {
    if (!yearValue) return "Not set";
    
    // If it's a date string, extract just the year
    if (typeof yearValue === 'string' && yearValue.includes('-')) {
      return yearValue.split('-')[0];
    }
    
    return yearValue;
  };

  // Apply all filters and search to get filtered students
  const getFilteredStudents = () => {
    return students.filter(student => {
      // Apply search filter
      const matchesSearch = search.trim() === "" || 
        (student.name && student.name.toLowerCase().includes(search.toLowerCase())) ||
        (student.email && student.email.toLowerCase().includes(search.toLowerCase()));
      
      // Apply department filter
      const matchesDepartment = filters.department === "" || 
        student.department === filters.department;
      
      // Apply year filter
      const matchesYear = filters.year === "" ||
        (student.graduation_year && formatGraduationYear(student.graduation_year) === filters.year);
      
      return matchesSearch && matchesDepartment && matchesYear;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      department: "",
      year: ""
    });
    setSearch("");
  };

  // Get filtered students based on all criteria
  const filteredStudents = getFilteredStudents();

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiUser className="text-blue-600" />
          Student Information
        </h1>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
              Object.values(filters).some(val => val !== "") 
                ? "bg-blue-50 text-blue-600 border-blue-300" 
                : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <FiFilter size={16} />
            {Object.values(filters).some(val => val !== "") ? (
              <span className="flex items-center">
                Filters ({Object.values(filters).filter(f => f !== "").length})
                <FiX 
                  className="ml-2 hover:text-red-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilters();
                  }} 
                />
              </span>
            ) : (
              "Filters"
            )}
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FiDownload /> Export CSV
          </button>
          
          <button
            onClick={fetchStudentInfo}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      </div>
      
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
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
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="p-2 w-full md:w-auto text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Student Information Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-8 shadow-md rounded-lg text-center text-gray-600">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search.trim() || Object.values(filters).some(val => val !== "") ? 
              "Try adjusting your filters or search criteria" : 
              "No student information available."
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3 text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Email</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Password</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Student ID</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Department</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                    <td className="px-4 py-3 text-blue-600 flex items-center">
                      {student.email}
                      <button 
                        onClick={() => copyToClipboard(student.email, `email-${student.id}`)}
                        className="ml-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copy email"
                      >
                        <FiCopy size={14} />
                      </button>
                      {copySuccess === `email-${student.id}` && (
                        <span className="ml-2 text-green-500 text-xs">Copied!</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {student.plain_password ? (
                        <div className="flex items-center">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{student.plain_password}</span>
                          <button 
                            onClick={() => copyToClipboard(student.plain_password, `pwd-${student.id}`)}
                            className="ml-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy password"
                          >
                            <FiCopy size={14} />
                          </button>
                          {copySuccess === `pwd-${student.id}` && (
                            <span className="ml-2 text-green-500 text-xs">Copied!</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No password</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.id}</td>
                    <td className="px-4 py-3">
                      {student.department ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {student.department}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {student.graduation_year ? 
                        formatGraduationYear(student.graduation_year) : 
                        <span className="text-gray-400 italic">Not set</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Results summary */}
      {!loading && filteredStudents.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
          {search.trim() && ` matching "${search}"`}
          {filters.department && ` in ${filters.department} department`}
          {filters.year && ` graduating in ${filters.year}`}
        </div>
      )}
    </div>
  );
} 