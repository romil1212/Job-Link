import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiBriefcase,
  FiCode,
  FiTag,
  FiAlertCircle
} from 'react-icons/fi';
import API from '../api/axios';

const Problems = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const companies = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty.toLowerCase();
        if (selectedCompany !== 'All') params.tags = selectedCompany;
        
        const response = await API.get('/problems', { params });
        setProblems(response.data?.problems || []);
        setTotal(response.data?.total || 0);
        setPage(response.data?.page || 1);
        setTotalPages(response.data?.totalPages || 0);
        setLimit(response.data?.limit || 10);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch problems", err);
        setError("Failed to load problems. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProblems();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedDifficulty, selectedCompany]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div
        className={`p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#0B101D] border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/20">
            <FiCode className="w-4 h-4" /> Problem Set
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Level Up Your <span className="text-emerald-500">Skills</span>
          </h1>
          <p className={`text-sm font-medium max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Filter coding challenges by company tags and difficulty levels.
          </p>
        </div>
      </div>

      {/* Company Selection Bar */}
      <div
        className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          <FiBriefcase className="w-4 h-4 text-emerald-500" />
          <span>Top Tech Companies</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {companies.map((company) => (
            <button
              key={company}
              onClick={() => setSelectedCompany(company)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCompany === company
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : isDarkMode
                  ? 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {company}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search problem title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs rounded-xl pl-10 pr-4 py-2.5 border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
            }`}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-slate-400 w-4 h-4" />
          <span className="text-xs font-bold text-slate-400">Difficulty:</span>
          <div className="flex gap-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b font-bold uppercase tracking-wider ${
                isDarkMode
                  ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="p-4 w-12 text-center">Status</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Companies</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4 text-right">Acceptance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 animate-pulse">
                    Loading problems...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-500 flex items-center justify-center gap-2">
                    <FiAlertCircle className="w-4 h-4" /> {error}
                  </td>
                </tr>
              ) : problems.length > 0 ? (
                problems.map((problem, index) => (
                  <tr
                    key={problem._id || problem.slug}
                    className={`transition ${
                      isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Status - Mocked as false for now */}
                    <td className="p-4 text-center">
                      <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                    </td>

                    {/* Title */}
                    <td className="p-4 font-bold">
                      <Link
                        to={`/dashboard/problems/${problem.slug}`}
                        className={`hover:underline flex items-center gap-1.5 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        <span>{index + 1}.</span> {problem.title}
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <FiTag className="w-3 h-3 text-slate-500" />
                        {problem.category}
                      </span>
                    </td>

                    {/* Company Tags */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags && problem.tags.length > 0 ? (
                          problem.tags.slice(0, 3).map((comp) => (
                            <span
                              key={comp}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                selectedCompany === comp
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : isDarkMode
                                  ? 'bg-slate-950 text-slate-400 border-slate-800'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {comp}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[10px]">-</span>
                        )}
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          problem.difficulty === 'easy'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : problem.difficulty === 'medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Acceptance - Mocked for now */}
                    <td className="p-4 text-right font-mono text-slate-400 font-bold">
                      N/A
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No problems found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problems;
