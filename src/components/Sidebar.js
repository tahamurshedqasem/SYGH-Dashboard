"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBook,
  FiUserCheck,
  FiUsers,
  FiShield,
  FiHome,
  FiCheckCircle,
  FiClipboard,
  FiUser,
  FiLayers,
  FiMail,
  FiKey,
  FiInfo
} from "react-icons/fi";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: <FiUsers /> },
  { name: "Colleges", path: "/admin/colleges", icon: <FiBook /> },
  {
    name: "Library Staff",
    path: "/admin/library-staff",
    icon: <FiUserCheck />,
  },
];

const superAdminLinks = [
  { name: "Dashboard", path: "/super-admin", icon: <FiHome /> },
  {
    name: "Universities",
    path: "/super-admin/universities",
    icon: <FiShield />,
  },
  { name: "Admins", path: "/super-admin/admins", icon: <FiUserCheck /> },
];

const libraryStaffLinks = [
  { name: "Dashboard", path: "/library", icon: <FiHome /> },
  { name: "Students", path: "/library/students", icon: <FiUser /> },
  { name: "Student Emails", path: "/library/student-info", icon: <FiInfo /> },
  { name: "Departments", path: "/library/departments", icon: <FiLayers /> },
  { name: "Projects", path: "/library/projects", icon: <FiClipboard /> },
  { name: "Supervisors", path: "/library/supervisors", icon: <FiUserCheck /> },
  { name: "Supervisor Emails", path: "/library/supervisor-info", icon: <FiKey /> },
  { name: "Approvals", path: "/library/approvals", icon: <FiCheckCircle /> },
];

export default function Sidebar({ isOpen, role = "admin" }) {
  const pathname = usePathname();

  const links =
    role === "super-admin"
      ? superAdminLinks
      : role === "library-staff"
      ? libraryStaffLinks
      : adminLinks;

  const title =
    role === "super-admin"
      ? "Super Admin"
      : role === "library-staff"
      ? "Library Staff"
      : "Admin Panel";

  return (
    <aside
      className={`bg-gray-800 text-white h-screen fixed top-0 left-0 z-40 transition-all duration-300
        ${isOpen ? "w-64" : "w-0"} overflow-hidden lg:w-64`}
    >
      <div className="p-4 text-xl font-bold flex items-center justify-center border-b border-gray-700">
        <span className="hidden lg:block">{title}</span>
        <span className="lg:hidden text-2xl">🛠️</span>
      </div>

      <nav className="mt-4">
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition
                  ${pathname === link.path ? "bg-gray-700" : ""}`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden lg:inline">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
