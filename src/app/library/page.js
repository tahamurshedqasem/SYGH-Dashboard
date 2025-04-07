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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function LibraryStaffHomePage() {
  const [stats, setStats] = useState({
    projects: 24,
    students: 132,
    supervisors: 8,
    departments: 6,
    byDepartment: [
      { department: "CS", count: 8 },
      { department: "IT", count: 5 },
      { department: "IS", count: 6 },
      { department: "AI", count: 3 },
    ],
  });

  const chartData = {
    labels: stats.byDepartment.map((d) => d.department),
    datasets: [
      {
        label: "Projects",
        data: stats.byDepartment.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue-500
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Library Staff Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Projects" value={stats.projects} />
        <StatCard title="Students" value={stats.students} />
        <StatCard title="Supervisors" value={stats.supervisors} />
        <StatCard title="Departments" value={stats.departments} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Projects by Department</h3>
        <div className="w-full overflow-x-auto">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

// 🧩 Reusable Card
function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
