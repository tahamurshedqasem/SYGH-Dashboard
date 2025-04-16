"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiClock, 
  FiBook, 
  FiUsers, 
  FiUserCheck, 
  FiDatabase,
  FiActivity,
  FiRefreshCw,
  FiTrendingUp
} from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API_BASE = "http://127.0.0.1:8000/api";

export default function LibraryStaffHomePage() {
  const [stats, setStats] = useState({
    projects: { total: 0, by_department: [] },
    students: { total: 0, by_department: [] },
    supervisors: { total: 0, by_department: [] },
    departments: { total: 0, departments: [] },
    recent_activity: { latest_projects: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/librarayStaff/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tempToken')}`
        }
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-700">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Library Staff Dashboard</h2>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiRefreshCw className="animate-pulse" /> Refresh Data
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Total Projects</p>
              <h3 className="text-3xl font-bold mt-1">{stats.projects.total}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <FiBook className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiTrendingUp className="mr-1" /> Across {stats.projects.by_department.length} Departments
            </span>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Total Students</p>
              <h3 className="text-3xl font-bold mt-1">{stats.students.total}</h3>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <FiUsers className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiActivity className="mr-1" /> Active in Projects
            </span>
          </div>
        </div>

        {/* Supervisors Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Supervisors</p>
              <h3 className="text-3xl font-bold mt-1">{stats.supervisors.total}</h3>
            </div>
            <div className="bg-amber-400 bg-opacity-30 p-3 rounded-full">
              <FiUserCheck className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiActivity className="mr-1" /> Guiding Projects
            </span>
          </div>
        </div>

        {/* Departments Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Departments</p>
              <h3 className="text-3xl font-bold mt-1">{stats.departments.total}</h3>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <FiDatabase className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiActivity className="mr-1" /> Active Departments
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FiBook className="mr-2 text-blue-500" /> Projects by Department
          </h3>
          <div className="flex flex-col space-y-4">
            {stats.projects.by_department.map((dept, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm font-medium text-gray-700">{dept.count} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(dept.count / stats.projects.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FiUsers className="mr-2 text-green-500" /> Students by Department
          </h3>
          <div className="flex flex-col space-y-4">
            {stats.students.by_department.map((dept, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm font-medium text-gray-700">{dept.count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(dept.count / stats.students.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white p-6 rounded-lg shadow-xl transform hover:shadow-2xl transition-all duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiActivity className="mr-2 text-blue-500" /> Recent Projects
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recent_activity.latest_projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{project.supervisor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {project.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
