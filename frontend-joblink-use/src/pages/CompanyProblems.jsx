import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiBriefcase, FiTag } from 'react-icons/fi';

const CompanyProblems = ({ isDarkMode }) => {
  const { companyName } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const companyData = {
    google: { name: 'Google', total: 420, easy: 110, medium: 210, hard: 100 },
    amazon: { name: 'Amazon', total: 380, easy: 95, medium: 195, hard: 90 },
    meta: { name: 'Meta', total: 310, easy: 80, medium: 160, hard: 70 },
    microsoft: { name: 'Microsoft', total: 290, easy: 90, medium: 140, hard: 60 },
    apple: { name: 'Apple', total: 210, easy: 60, medium: 110, hard: 40 },
    netflix: { name: 'Netflix', total: 150, easy: 30, medium: 80, hard: 40 },
  };

  const activeCompany = companyData[companyName?.toLowerCase()] || {
    name: companyName || 'Company',
    total: 250,
    easy: 70,
    medium: 120,
    hard: 60,
  };

  const problemsList = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '52.4%', category: 'Array & Hash Table', solved: true },
    { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '34.8%', category: 'Sliding Window', solved: true },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: '38.1%', category: 'Binary Search', solved: false },
    { id: 5, title: 'Trapping Rain Water', difficulty: 'Hard', acceptance: '61.0%', category: 'Two Pointers', solved: false },
    { id: 6, title: 'LRU Cache', difficulty: 'Medium', acceptance: '42.5%', category: 'Design', solved: true },
  ];

  const filtered = problemsList.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-8 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
            <FiBriefcase /> Company Problem Tag
          </div>
          <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {activeCompany.name} Interview Questions
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Most frequently asked coding interview problems at {activeCompany.name}.
          </p>
        </div>

        <div className="flex items-center gap-4 border-l pl-6 border-slate-800">
          <div>
            <span className="text-2xl font-black text-emerald-500">{activeCompany.total}</span>
            <p className="text-xs text-slate-400 font-bold">Total Problems</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder={`Search ${activeCompany.name} problems...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full text-xs rounded-xl pl-10 pr-4 py-2.5 border font-medium focus:outline-none ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        />
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <table className="w-full text-left text-xs">
          <thead className={`border-b font-bold uppercase tracking-wider ${isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <tr>
              <th className="p-4 w-12 text-center">Status</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4 text-right">Acceptance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-medium">
            {filtered.map((problem) => (
              <tr key={problem.id} className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                <td className="p-4 text-center">
                  {problem.solved ? <FiCheckCircle className="w-4 h-4 text-emerald-500 inline-block" /> : <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />}
                </td>
                <td className="p-4 font-bold">
                  <Link to={`/dashboard/problems/${problem.id}`} className={`hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {problem.id}. {problem.title}
                  </Link>
                </td>
                <td className="p-4 text-slate-400">
                  <span className="inline-flex items-center gap-1"><FiTag className="w-3 h-3 text-slate-500" />{problem.category}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' : problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-slate-400 font-bold">{problem.acceptance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyProblems;