import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiList
} from 'react-icons/fi';

const TestCases = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    input: '',
    expectedOutput: '',
    isHidden: false,
    order: 0,
    explanation: ''
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (selectedProblem) {
      fetchTestCases(selectedProblem);
    } else {
      setTestCases([]);
    }
  }, [selectedProblem]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/problems');
      setProblems(res.data?.problems || res.data?.data?.problems || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestCases = async (problemId) => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/problems/${problemId}/test-cases`);
      setTestCases(res.data?.testCases || res.data?.data?.testCases || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load test cases');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    if (!selectedProblem) {
      alert("Please select a problem first.");
      return;
    }
    setFormData({
      input: '',
      expectedOutput: '',
      isHidden: false,
      order: testCases.length,
      explanation: ''
    });
    setIsEditing(false);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tc) => {
    setFormData({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
      order: tc.order,
      explanation: tc.explanation || ''
    });
    setIsEditing(true);
    setCurrentId(tc._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test case?")) return;
    try {
      await API.delete(`/admin/test-cases/${id}`);
      fetchTestCases(selectedProblem);
    } catch (err) {
      console.error(err);
      alert('Failed to delete test case');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        order: parseInt(formData.order) || 0
      };

      if (isEditing) {
        await API.put(`/admin/test-cases/${currentId}`, data);
      } else {
        await API.post(`/admin/problems/${selectedProblem}/test-cases`, data);
      }
      setIsModalOpen(false);
      fetchTestCases(selectedProblem);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Test Cases</h1>
          <p className="text-sm text-slate-400 mt-1">Manage problem test cases</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={!selectedProblem}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${selectedProblem ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
        >
          <FiPlus /> Create Test Case
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-sm font-bold">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* Problem Selector */}
      <div className="p-4 rounded-2xl bg-[#0B101D] border border-slate-800 flex items-center gap-4">
        <label className="text-sm font-bold text-slate-300 whitespace-nowrap">Select Problem:</label>
        <select
          value={selectedProblem}
          onChange={(e) => setSelectedProblem(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-emerald-500 transition"
        >
          <option value="">-- Choose a problem --</option>
          {problems.map(p => (
            <option key={p._id} value={p._id}>{p.title} ({p.difficulty})</option>
          ))}
        </select>
      </div>

      {/* Test Cases Table */}
      {selectedProblem && (
        <div className="bg-[#0B101D] border border-slate-800 rounded-3xl overflow-hidden">
          {loading && testCases.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-bold animate-pulse">Loading test cases...</div>
          ) : testCases.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <FiList className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-400 font-bold">No test cases found for this problem.</p>
              <p className="text-sm text-slate-500 mt-1">Click "Create Test Case" to add one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-bold">Order</th>
                    <th className="px-6 py-4 font-bold">Input</th>
                    <th className="px-6 py-4 font-bold">Expected Output</th>
                    <th className="px-6 py-4 font-bold">Visibility</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {testCases.map((tc) => (
                    <tr key={tc._id} className="hover:bg-slate-800/20 transition">
                      <td className="px-6 py-4 font-bold text-slate-300">{tc.order}</td>
                      <td className="px-6 py-4 font-mono text-xs max-w-xs truncate">{tc.input}</td>
                      <td className="px-6 py-4 font-mono text-xs max-w-xs truncate">{tc.expectedOutput}</td>
                      <td className="px-6 py-4">
                        {tc.isHidden ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full w-fit">
                            <FiEyeOff className="w-3.5 h-3.5" /> Hidden
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                            <FiEye className="w-3.5 h-3.5" /> Public
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => openEditModal(tc)}
                          className="text-slate-400 hover:text-emerald-400 transition"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tc._id)}
                          className="text-slate-400 hover:text-red-400 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0B101D] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
              <h2 className="text-xl font-black text-white">{isEditing ? 'Edit Test Case' : 'Create Test Case'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Input</label>
                  <textarea
                    name="input"
                    value={formData.input}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 transition font-mono"
                    placeholder="e.g. [2,7,11,15]\n9"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Expected Output</label>
                  <textarea
                    name="expectedOutput"
                    value={formData.expectedOutput}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 transition font-mono"
                    placeholder="e.g. [0,1]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Explanation (Optional)</label>
                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 transition"
                  placeholder="Optional explanation for public test cases..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Execution Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 transition"
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isHidden"
                    name="isHidden"
                    checked={formData.isHidden}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <label htmlFor="isHidden" className="text-sm font-bold text-slate-300 select-none cursor-pointer">
                    Hidden Test Case
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
                <strong>Note:</strong> Hidden test cases will only be used by the code execution engine and will never be exposed to users.
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2"
                >
                  <FiCheckCircle /> {isEditing ? 'Save Changes' : 'Create Test Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCases;
