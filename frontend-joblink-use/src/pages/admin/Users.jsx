import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiX,
  FiRefreshCw
} from "react-icons/fi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    xp: 0,
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users", {
        params: { search, page, limit: 10 },
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
        xp: user.xp || 0,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
        role: "user",
        xp: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await API.put(`/admin/users/${editingUser._id}`, formData);
      } else {
        await API.post("/admin/users", formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await API.put(`/admin/users/${user._id}`, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 select-none font-sans text-slate-100">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Users Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage user access, XP stats, and roles</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search user or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B101D] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
          />
        </div>
        <button
          onClick={fetchUsers}
          className="p-3 rounded-xl bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-white"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#0B101D] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#050914] text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">XP</th>
              <th className="p-4">Problems Solved</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 animate-pulse font-mono">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/20 transition">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{u.fullName}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="capitalize font-semibold text-slate-300">{u.role}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        u.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {u.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-4 font-black text-amber-400">{u.xp} XP</td>
                  <td className="p-4 text-slate-300 font-mono">{u.solvedCount}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle Active / Blocked */}
                      <button
                        onClick={() => handleToggleStatus(u)}
                        title={u.isActive ? "Block User" : "Activate User"}
                        className={`p-2 rounded-lg border transition cursor-pointer ${
                          u.isActive
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {u.isActive ? <FiUserX className="w-3.5 h-3.5" /> : <FiUserCheck className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenModal(u)}
                        title="Edit User"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(u._id)}
                        title="Delete User"
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                page === i + 1
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#050914]">
              <h2 className="text-base font-black text-white">
                {editingUser ? "Edit User Details" : "Create New User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {editingUser && (
                <div>
                  <label className="font-bold text-slate-400 block mb-1">XP</label>
                  <input
                    type="number"
                    value={formData.xp}
                    onChange={(e) => setFormData({ ...formData, xp: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition cursor-pointer"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;