import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiTerminal,
  FiCheckCircle,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    difficulty: 'easy',
    category: 'Algorithms',
    tags: '',
    description: '',
    hints: '',
    timeLimit: 2000,
    memoryLimit: 256
  });

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/problems', {
        params: { search, difficulty: difficultyFilter, page, limit: 10 }
      });
      setProblems(res.data.problems || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficultyFilter, page]);

  const handleOpenModal = (prob = null) => {
    if (prob) {
      setEditingProblem(prob);
      setFormData({
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        category: prob.category || 'Algorithms',
        tags: Array.isArray(prob.tags) ? prob.tags.join(', ') : '',
        description: prob.description || '',
        hints: Array.isArray(prob.hints) ? prob.hints.join('\n') : '',
        timeLimit: prob.timeLimit || 2000,
        memoryLimit: prob.memoryLimit || 256
      });
    } else {
      setEditingProblem(null);
      setFormData({
        title: '',
        slug: '',
        difficulty: 'easy',
        category: 'Algorithms',
        tags: '',
        description: '',
        hints: '',
        timeLimit: 2000,
        memoryLimit: 256
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        hints: formData.hints.split('\n').map(h => h.trim()).filter(Boolean),
        timeLimit: Number(formData.timeLimit),
        memoryLimit: Number(formData.memoryLimit)
      };

      if (editingProblem) {
        await API.put(`/admin/problems/${editingProblem._id}`, payload);
      } else {
        await API.post('/admin/problems', payload);
      }

      setIsModalOpen(false);
      fetchProblems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save problem');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem and all its test cases?')) return;
    try {
      await API.delete(`/admin/problems/${id}`);
      fetchProblems();
    } catch (err) {
      alert('Failed to delete problem');
    }
  };

  return (
    <div className="space-y-6 font-sans select-none text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Problem Repository</h1>
          <p className="text-xs text-slate-400 mt-1">Manage LeetCode algorithmic challenges and configurations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" /> Add Problem
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search problems by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B101D] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-4 flex items-center gap-2">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-[#0B101D] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={fetchProblems}
            className="p-2.5 rounded-xl bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-white"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-[#0B101D] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#050914] text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4">Title</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Category</th>
              <th className="p-4">Time/Mem</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 animate-pulse font-mono">
                  Loading challenges...
                </td>
              </tr>
            ) : problems.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No problems found. Click "Add Problem" to create one.
                </td>
              </tr>
            ) : (
              problems.map((prob) => (
                <tr key={prob._id} className="hover:bg-slate-800/20 transition">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{prob.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">/{prob.slug}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      prob.difficulty === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : prob.difficulty === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{prob.category || 'Algorithms'}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {prob.timeLimit || 2000}ms / {prob.memoryLimit || 256}MB
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(prob)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                        title="Edit Problem"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prob._id)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        title="Delete Problem"
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
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#050914]">
              <h2 className="text-base font-black text-white">
                {editingProblem ? 'Edit Problem' : 'Create New Problem'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Array, Hash Table, Two Pointers"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Time Limit (ms)</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Memory Limit (MB)</label>
                  <input
                    type="number"
                    value={formData.memoryLimit}
                    onChange={(e) => setFormData({ ...formData, memoryLimit: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Problem Description</label>
                <textarea
                  rows="5"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="State the objective, inputs, constraints, and runtime limits..."
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Hints (one per line)</label>
                <textarea
                  rows="3"
                  value={formData.hints}
                  onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                  placeholder="Consider hash maps for linear lookups&#10;Pay attention to 0-indexing"
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition cursor-pointer"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProblems;