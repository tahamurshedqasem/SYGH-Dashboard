  "use client";

import { useState } from "react";
import {
  FiUpload,
  FiSearch,
  FiPlus,
  FiTrash,
  FiEdit,
  FiCheckCircle,
} from "react-icons/fi";

export default function StudentManagementPage() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [edited, setEdited] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const [addForm, setAddForm] = useState({
    groupNumber: "",
    supervisor: "",
    project: "",
    students: [{ name: "", id: "", email: "" }],
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    alert("📤 File uploaded! Data will appear after backend saves.");
  };

  const handleAddGroup = () => {
    if (
      !addForm.groupNumber ||
      !addForm.project ||
      !addForm.supervisor ||
      addForm.students.some((s) => !s.name || !s.id || !s.email)
    )
      return;

    setGroups((prev) => [...prev, { ...addForm }]);
    setAddForm({
      groupNumber: "",
      supervisor: "",
      project: "",
      students: [{ name: "", id: "", email: "" }],
    });
  };

  const updateStudent = (groupIdx, studentIdx, key, value) => {
    const updated = [...groups];
    updated[groupIdx].students[studentIdx][key] = value;
    setGroups(updated);
    setEdited((prev) => ({ ...prev, [`${groupIdx}-${studentIdx}`]: true }));
  };

  const updateGroupMeta = (groupIdx, key, value) => {
    const updated = [...groups];
    updated[groupIdx][key] = value;
    setGroups(updated);
    setEdited((prev) => ({ ...prev, [`group-${groupIdx}`]: true }));
  };

  const confirmAndSave = (type, groupIdx, studentIdx) => {
    setShowConfirmModal({ type, groupIdx, studentIdx });
  };

  const confirmAction = () => {
    const key =
      showConfirmModal.type === "group"
        ? `group-${showConfirmModal.groupIdx}`
        : `${showConfirmModal.groupIdx}-${showConfirmModal.studentIdx}`;
    const newEdited = { ...edited };
    delete newEdited[key];
    setEdited(newEdited);
    setShowConfirmModal(null);
    alert("✅ Changes saved (simulated)");
  };

  const cancelConfirm = () => {
    setShowConfirmModal(null);
  };

  const removeStudentFromGroup = (groupIdx, studentIdx) => {
    const updated = [...groups];
    updated[groupIdx].students.splice(studentIdx, 1);
    if (updated[groupIdx].students.length === 0) updated.splice(groupIdx, 1);
    setGroups(updated);
  };

  const handleDeleteGroup = (index) => {
    if (confirm("Are you sure you want to delete this group?")) {
      const updated = [...groups];
      updated.splice(index, 1);
      setGroups(updated);
    }
  };

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      students: group.students.filter((student) => {
        const query = searchQuery.toLowerCase();
        return (
          student.name.toLowerCase().includes(query) ||
          group.groupNumber.toLowerCase().includes(query) ||
          group.supervisor.toLowerCase().includes(query) ||
          group.project.toLowerCase().includes(query)
        );
      }),
    }))
    .filter((group) => group.students.length > 0);

  return (
    <div className="space-y-6 p-4 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        📚 Student Group Management
      </h2>

      {/* Upload & Search */}
      <div className="bg-white p-6 shadow-xl rounded-lg space-y-4 transition hover:shadow-2xl">
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          <FiUpload />
          Upload Excel/CSV File
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleUpload}
          className="border px-3 py-2 rounded w-full cursor-pointer"
        />
        <p className="text-sm text-gray-500">
          Format: Name, ID, Email, Group Number, Project, Supervisor
        </p>

        <div className="relative">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, group, supervisor or project..."
            className="w-full px-10 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Add Group */}
      <div className="bg-white p-6 shadow-xl rounded-lg space-y-4">
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <FiPlus />
          Add New Group
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {["groupNumber", "supervisor", "project"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="border p-2 rounded"
              value={addForm[field]}
              onChange={(e) =>
                setAddForm({ ...addForm, [field]: e.target.value })
              }
            />
          ))}
        </div>

        {addForm.students.map((student, idx) => (
          <div key={idx} className="grid md:grid-cols-3 gap-4">
            {["name", "id", "email"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={`${field.toUpperCase()} ${idx + 1}`}
                value={student[field]}
                onChange={(e) => {
                  const updated = [...addForm.students];
                  updated[idx][field] = e.target.value;
                  setAddForm({ ...addForm, students: updated });
                }}
                className="border p-2 rounded"
              />
            ))}
          </div>
        ))}

        <button
          onClick={() =>
            setAddForm({
              ...addForm,
              students: [...addForm.students, { name: "", id: "", email: "" }],
            })
          }
          className="text-blue-600 hover:underline text-sm cursor-pointer"
        >
          + Add Another Student
        </button>

        <button
          onClick={handleAddGroup}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow cursor-pointer"
        >
          Save Group
        </button>
      </div>

      {/* Display Groups */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <p className="text-gray-500 text-center">No results found.</p>
        ) : (
          filteredGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition hover:shadow-xl"
            >
              <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
                <div>
                  <strong>Group {group.groupNumber}</strong> - {group.project} |
                  Supervisor: {group.supervisor}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteGroup(groupIdx)}
                    className="text-red-600 hover:underline flex items-center gap-1 text-sm cursor-pointer"
                  >
                    <FiTrash /> Delete
                  </button>
                  <button
                    disabled={!edited[`group-${groupIdx}`]}
                    onClick={() => confirmAndSave("group", groupIdx)}
                    className={`flex items-center gap-1 px-2 py-1 text-sm rounded cursor-pointer ${
                      edited[`group-${groupIdx}`]
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <FiEdit /> Edit
                  </button>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.students.map((student, studentIdx) => {
                    const isEdited = edited[`${groupIdx}-${studentIdx}`];
                    return (
                      <tr key={studentIdx} className="border-t">
                        {["name", "id", "email"].map((field) => (
                          <td key={field} className="px-4 py-2">
                            <input
                              value={student[field]}
                              onChange={(e) =>
                                updateStudent(
                                  groupIdx,
                                  studentIdx,
                                  field,
                                  e.target.value
                                )
                              }
                              className="w-full border p-1 rounded"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center space-x-2">
                          <button
                            onClick={() =>
                              removeStudentFromGroup(groupIdx, studentIdx)
                            }
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <FiTrash />
                          </button>
                          <button
                            disabled={!isEdited}
                            onClick={() =>
                              confirmAndSave("student", groupIdx, studentIdx)
                            }
                            className={`${
                              isEdited
                                ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <FiCheckCircle />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="bg-gray-50 px-6 py-3 flex gap-4">
                <input
                  value={group.supervisor}
                  onChange={(e) =>
                    updateGroupMeta(groupIdx, "supervisor", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                  placeholder="Supervisor"
                />
                <input
                  value={group.project}
                  onChange={(e) =>
                    updateGroupMeta(groupIdx, "project", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                  placeholder="Project"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Edit
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to save these changes?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelConfirm}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
