import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiCircle,
  FiBriefcase,
  FiCode,
  FiTag,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import API from '../api/axios';

const Problems = ({ isDarkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const companies = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const fetchProblems = async (currentPage = 1) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty.toLowerCase();
      if (selectedCompany !== 'All') params.tags = selectedCompany;

      const response = await API.get('/problems', { params });

      // Support direct array response or standard paginated object
      const rawProblems = Array.isArray(response.data)
        ? response.data
        : response.data?.problems || [];

      setProblems(rawProblems);
      setTotal(response.data?.total || rawProblems.length);
      setPage(response.data?.page || currentPage);
      setTotalPages(response.data?.totalPages || Math.ceil((response.data?.total || rawProblems.length) / limit) || 1);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch problems:', err);
      setError(err.response?.data?.message || 'Failed to load problems. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchProblems(1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedDifficulty, selectedCompany]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      fetchProblems(newPage);
    }
  };

  const calculateAcceptance = (problem) => {
    if (problem.acceptanceRate !== undefined) {
      return `${problem.acceptanceRate}%`;
    }
    if (problem.totalSubmissions && problem.totalSubmissions > 0) {
      const rate = ((problem.acceptedSubmissions || 0) / problem.totalSubmissions) * 100;
      return `${rate.toFixed(1)}%`;
    }
    return 'N/A';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Header Section */}
      <div
        className={`p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#0B101D] border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

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
          isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
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
              type="button"
              onClick={() => setSelectedCompany(company)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCompany === company
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : isDarkMode
                  ? 'bg-[#050914] text-slate-400 hover:text-slate-200 border border-slate-800'
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
                ? 'bg-[#0B101D] border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500'
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
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 border border-transparent'
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
          isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b font-bold uppercase tracking-wider ${
                isDarkMode
                  ? 'bg-[#050914] border-slate-800 text-slate-400'
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
                  <td colSpan="6" className="p-8 text-center text-rose-400">
                    <div className="flex items-center justify-center gap-2">
                      <FiAlertCircle className="w-4 h-4" /> {error}
                    </div>
                  </td>
                </tr>
              ) : problems.length > 0 ? (
                problems.map((problem, index) => {
                  const targetIdentifier = problem.slug || problem._id;
                  const itemIndex = (page - 1) * limit + index + 1;

                  return (
                    <tr
                      key={problem._id || targetIdentifier}
                      className={`transition ${
                        isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Status */}
                      <td className="p-4 text-center">
                        {problem.isSolved || problem.solved ? (
                          <FiCheckCircle className="w-4 h-4 text-emerald-400 inline-block" />
                        ) : (
                          <FiCircle className="w-4 h-4 text-slate-600 inline-block" />
                        )}
                      </td>

                      {/* Title */}
                      <td className="p-4 font-bold">
                        <Link
                          to={`/problems/${targetIdentifier}`}
                          className={`hover:underline flex items-center gap-1.5 ${
                            isDarkMode ? 'text-white hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-600'
                          }`}
                        >
                          <span className="text-slate-500">{itemIndex}.</span> {problem.title}
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <FiTag className="w-3 h-3 text-slate-500" />
                          {problem.category || 'Algorithms'}
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
                                    ? 'bg-[#050914] text-slate-400 border-slate-800'
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
                            problem.difficulty?.toLowerCase() === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : problem.difficulty?.toLowerCase() === 'medium'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}
                        >
                          {problem.difficulty || 'Easy'}
                        </span>
                      </td>

                      {/* Acceptance */}
                      <td className="p-4 text-right font-mono text-slate-400 font-bold">
                        {calculateAcceptance(problem)}
                      </td>
                    </tr>
                  );
                })
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between p-4 border-t ${
              isDarkMode ? 'bg-[#050914] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xs">
              Page <span className="font-bold text-white">{page}</span> of{' '}
              <span className="font-bold text-white">{totalPages}</span> ({total} problems)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;