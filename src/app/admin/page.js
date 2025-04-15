"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiUsers, 
  FiBook, 
  FiLayout, 
  FiDatabase, 
  FiUserCheck,
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiRefreshCw
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
		const token = localStorage.getItem("token");
		return { Authorization: `Bearer ${token}` };
	};

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/dashboard/stats",
        { headers: getAuthHeaders() }
      );

      console.log(response.data)
      if (response.data.data) {
        setStats(response.data.data);
        console.log("data",response.data)
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
      toast.error("Error fetching dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiRefreshCw className="animate-pulse" /> Refresh Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Projects Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Projects</p>
              <h3 className="text-3xl font-bold mt-1">{stats?.total_counts.projects || 0}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <FiBook className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiTrendingUp className="mr-1" /> {stats?.projects_stats.by_year?.[0]?.count || 0} in {stats?.projects_stats.by_year?.[0]?.year || 'Current Year'}
            </span>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Students</p>
              <h3 className="text-3xl font-bold mt-1">{stats?.total_counts.students || 0}</h3>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <FiUsers className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiActivity className="mr-1" /> Across {stats?.students_stats.by_department?.length || 0} Departments
            </span>
          </div>
        </div>

        {/* Colleges Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold opacity-80">Colleges</p>
              <h3 className="text-3xl font-bold mt-1">{stats?.total_counts.colleges || 0}</h3>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <FiLayout className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiDatabase className="mr-1" /> With {stats?.total_counts.departments || 0} Departments
            </span>
          </div>
        </div>

        {/* Departments Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
          <div>
              <p className="text-sm font-semibold opacity-80">Departments</p>
              <h3 className="text-3xl font-bold mt-1">{stats?.total_counts.departments || 0}</h3>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-full">
              <FiDatabase className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiActivity className="mr-1" /> Across {stats?.departments_stats.by_college?.length || 0} Colleges
            </span>
          </div>
        </div>

        {/* Supervisors Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between items-center">
          <div>
              <p className="text-sm font-semibold opacity-80">Supervisors</p>
              <h3 className="text-3xl font-bold mt-1">{stats?.total_counts.supervisors || 0}</h3>
            </div>
            <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
              <FiUserCheck className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 text-xs">
            <span className="flex items-center text-green-200">
              <FiActivity className="mr-1" /> Guiding {stats?.total_counts.projects || 0} Projects
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects By Department */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FiBook className="mr-2 text-blue-500" /> Projects by Department
            </h3>
          <div className="flex flex-col space-y-4">
            {stats?.projects_stats.by_department.map((dept, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm font-medium text-gray-700">{dept.count} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(dept.count / stats.projects_stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students By Department */}
        <div className="bg-white p-6 rounded-lg shadow-xl transform hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FiUsers className="mr-2 text-green-500" /> Students by Department
          </h3>
          <div className="flex flex-col space-y-4">
            {stats?.students_stats.by_department.map((dept, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm font-medium text-gray-700">{dept.count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(dept.count / stats.students_stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects by Year */}
      <div className="bg-white p-6 rounded-lg shadow-xl mt-8 transform hover:shadow-2xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FiCalendar className="mr-2 text-indigo-500" /> Projects by Year
        </h3>
        <div className="flex items-end h-48 space-x-6 justify-center">
          {stats?.projects_stats.by_year.map((yearData, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-end h-40">
                <div 
                  className="w-16 bg-indigo-500 rounded-t-lg transition-all duration-1000 ease-out flex items-center justify-center text-white font-bold"
                  style={{ 
                    height: `${(yearData.count / Math.max(...stats.projects_stats.by_year.map(y => y.count))) * 100}%`,
                    minHeight: '20px'
                  }}
                >
                  {yearData.count}
                </div>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700">{yearData.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mt-8 transform hover:shadow-2xl transition-all duration-300">
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
              {stats?.recent_activity.latest_projects.map((project) => (
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
                      <FiCalendar className="mr-2 text-gray-400" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Projects Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border border-blue-100 transform hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiBook className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Projects Summary</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {stats?.total_counts.projects || 0} projects across {stats?.projects_stats.by_department.length || 0} departments
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {stats?.projects_stats.by_year.map((year, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>{year.year}: {year.count} projects</span>
              </div>
            ))}
          </div>
        </div>

        {/* Students Summary */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg shadow-md border border-green-100 transform hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiUsers className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Students Summary</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {stats?.total_counts.students || 0} students in {stats?.students_stats.by_department.length || 0} departments
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {stats?.students_stats.by_department.map((dept, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>{dept.department}: {dept.count} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supervisors Summary */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg shadow-md border border-red-100 transform hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FiUserCheck className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Supervisors Summary</h3>
          </div>
          <p className="text-gray-600 mb-4">
            {stats?.total_counts.supervisors || 0} supervisors guiding projects
          </p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {stats?.supervisors_stats.by_college.map((college, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>{college.college}: {college.count || 0} supervisors</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white p-6 rounded-lg shadow-xl mt-8 transform hover:shadow-2xl transition-all duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiDatabase className="mr-2 text-purple-500" /> System Overview
        </h3>
        <p className="text-gray-600 mb-6 text-center max-w-3xl mx-auto leading-relaxed">
          This dashboard provides a comprehensive overview of the entire academic project management system. 
          With {stats?.total_counts.projects || 0} projects across {stats?.total_counts.departments || 0} departments, 
          the system currently manages {stats?.total_counts.students || 0} students and {stats?.total_counts.supervisors || 0} supervisors.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-blue-600 text-2xl font-bold">{stats?.total_counts.projects || 0}</div>
            <div className="text-gray-500 text-sm">Projects</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-green-600 text-2xl font-bold">{stats?.total_counts.students || 0}</div>
            <div className="text-gray-500 text-sm">Students</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-purple-600 text-2xl font-bold">{stats?.total_counts.colleges || 0}</div>
            <div className="text-gray-500 text-sm">Colleges</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-yellow-600 text-2xl font-bold">{stats?.total_counts.departments || 0}</div>
            <div className="text-gray-500 text-sm">Departments</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center transform hover:scale-110 transition-transform duration-300">
            <div className="text-red-600 text-2xl font-bold">{stats?.total_counts.supervisors || 0}</div>
            <div className="text-gray-500 text-sm">Supervisors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
