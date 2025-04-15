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
import { FiClock } from "react-icons/fi";

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
      const response = await axios.get(`${API_BASE}/librarayStaff/stats`, {
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

  const projectsChartData = {
    labels: stats.projects.by_department.map((d) => d.department),
    datasets: [
      {
        label: "Projects",
        data: stats.projects.by_department.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue-500
        borderRadius: 5,
      },
    ],
  };

  const studentsChartData = {
    labels: stats.students.by_department.map((d) => d.department),
    datasets: [
      {
        label: "Students",
        data: stats.students.by_department.map((d) => d.count),
        backgroundColor: "rgba(16, 185, 129, 0.7)", // green-500
        borderRadius: 5,
      },
    ],
  };

  const supervisorsChartData = {
    labels: stats.supervisors.by_department.map((d) => d.department),
    datasets: [
      {
        label: "Supervisors",
        data: stats.supervisors.by_department.map((d) => d.count),
        backgroundColor: "rgba(245, 158, 11, 0.7)", // amber-500
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Library Staff Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Projects" value={stats.projects.total} />
        <StatCard title="Students" value={stats.students.total} />
        <StatCard title="Supervisors" value={stats.supervisors.total} />
        <StatCard title="Departments" value={stats.departments.total} />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Projects Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Projects by Department</h3>
          <div className="w-full">
            <Bar data={projectsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Students Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Students by Department</h3>
          <div className="w-full">
            <Bar data={studentsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Supervisors Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Supervisors by Department</h3>
          <div className="w-full">
            <Bar data={supervisorsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {stats.recent_activity.latest_projects.map((project) => (
              <div key={project.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <FiClock className="text-gray-400 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600">
                    {project.supervisor} • {project.department}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧩 Reusable Card
function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 transition-all hover:shadow-lg">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
