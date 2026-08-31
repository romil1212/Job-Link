import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import SubmissionTable from '../components/SubmissionTable';
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';

const SubmissionHistory = ({ isDarkMode = true }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/submissions/my');
      const list = res.data?.submissions || res.data?.data?.submissions || res.data || [];
      setSubmissions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter submissions by title, verdict status, and language
  const filteredSubmissions = submissions.filter((sub) => {
    const title = (sub.problemId?.title || sub.problemTitle || sub.problem || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase());

    const rawStatus = (sub.verdict || sub.status || '').toUpperCase();
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACCEPTED'
        ? rawStatus === 'ACCEPTED'
        : rawStatus !== 'ACCEPTED';

    const lang = (sub.language || sub.lang || '').toLowerCase();
    const matchesLang =
      languageFilter === 'ALL' ? true : lang === languageFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesLang;
  });

  // Summary counts
  const totalSubmissions = submissions.length;
  const acceptedCount = submissions.filter(
    (s) => (s.verdict || s.status || '').toUpperCase() === 'ACCEPTED'
  ).length;
  const failedCount = totalSubmissions - acceptedCount;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 select-none font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Submission History
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Track all your code executions, memory benchmarks, and verdict statuses
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSubmissions}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
            isDarkMode
              ? 'bg-[#0B101D] border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
          }`}
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Runs</p>
            <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {totalSubmissions}
            </h3>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Accepted</p>
            <h3 className="text-xl font-black text-emerald-400">{acceptedCount}</h3>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Errors / Failed</p>
            <h3 className="text-xl font-black text-rose-400">{failedCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
          isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by problem name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full text-xs rounded-xl pl-9 pr-4 py-2 border font-medium focus:outline-none transition ${
              isDarkMode
                ? 'bg-[#050914] border-slate-800 text-white focus:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
            }`}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#050914] border border-slate-800 rounded-xl px-2.5 py-1.5">
            <FiFilter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACCEPTED">Accepted Only</option>
              <option value="FAILED">Failed / Rejected</option>
            </select>
          </div>

          {/* Language Filter */}
          <div className="bg-[#050914] border border-slate-800 rounded-xl px-2.5 py-1.5">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Languages</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table Component */}
      <SubmissionTable
        submissions={filteredSubmissions}
        loading={loading}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default SubmissionHistory;