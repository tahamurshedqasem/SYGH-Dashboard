"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FiUsers,
  FiBookOpen,
  FiGrid,
  FiActivity,
} from "react-icons/fi";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/superadmin/dashboard/stats", {
          headers: getAuthHeaders(),
        });
        setStats(res.data.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  if (!stats) return <p className="p-6 text-red-600">Failed to load dashboard data.</p>;

  const totalCounts = stats.total_counts;

  const projectByYear = {
    labels: stats.projects_stats.by_year.map((p) => p.year),
    datasets: [
      {
        label: "Projects per Year",
        data: stats.projects_stats.by_year.map((p) => p.count),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const usersByRole = {
    labels: stats.users_by_role.map((u) => u.role),
    datasets: [
      {
        label: "Users by Role",
        data: stats.users_by_role.map((u) => u.count),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
      },
    ],
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Super Admin Dashboard</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiUsers />} label="Users" value={totalCounts.users} />
        <StatCard icon={<FiGrid />} label="Universities" value={totalCounts.universities} />
        <StatCard icon={<FiBookOpen />} label="Projects" value={totalCounts.projects} />
        <StatCard icon={<FiActivity />} label="Students" value={totalCounts.students} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Projects by Year</h3>
          <Bar data={projectByYear} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Users by Role</h3>
          <Bar data={usersByRole} />
        </div>
      </div>

      {/* Latest Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">📁 Latest Projects</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {stats.recent_activity.latest_projects.map((proj) => (
              <li key={proj.id}>
                <span className="font-medium">{proj.title}</span> –{" "}
                <span className="text-gray-500">{proj.supervisor}</span> in{" "}
                <span>{proj.department}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">🧑‍💻 Latest Users</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {stats.recent_activity.latest_users.map((user) => (
              <li key={user.id}>
                <span className="font-medium">{user.name}</span> –{" "}
                <span className="text-gray-500">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 shadow rounded flex items-center gap-4">
      <div className="text-blue-600 text-2xl">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-600">{label}</h4>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
