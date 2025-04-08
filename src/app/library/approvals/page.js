"use client";

import { useState } from "react";
import { FiFileText, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

export default function ApprovalsManagementPage() {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      file: "final-project-group1.pdf",
      groupNumber: "G-101",
      projectName: "Smart Traffic Light System",
    },
    {
      id: 2,
      file: "iot-project.pdf",
      groupNumber: "G-102",
      projectName: "IoT Monitoring Platform",
    },
  ]);

  const [modal, setModal] = useState(null); // { id, action }

  const handleAction = (id, action) => {
    const message = action === "approve" ? "Approved" : "Rejected";
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    setModal(null);
    alert(`✅ Project has been ${message}.`);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FiFileText className="text-blue-600" />
        Approvals Management
      </h2>

      {approvals.length === 0 ? (
        <div className="bg-white p-6 shadow-md rounded-lg text-center text-gray-600">
          <FiInfo className="mx-auto text-3xl mb-2" />
          No pending approvals.
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Group Number</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a
                      href={`#${item.file}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FiFileText />
                      {item.file}
                    </a>
                  </td>
                  <td className="px-4 py-3">{item.groupNumber}</td>
                  <td className="px-4 py-3">{item.projectName}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-4">
                    <button
                      onClick={() =>
                        setModal({ id: item.id, action: "approve" })
                      }
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                    >
                      <FiCheckCircle />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        setModal({ id: item.id, action: "reject" })
                      }
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                    >
                      <FiXCircle />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Confirm {modal.action === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              <strong>
                {modal.action === "approve" ? "approve" : "reject"}
              </strong>{" "}
              this project?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(modal.id, modal.action)}
                className={`px-4 py-2 rounded text-white ${
                  modal.action === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
