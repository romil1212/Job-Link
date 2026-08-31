import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const ProblemsTable = ({ isDarkMode = true }) => {
  const navigate = useNavigate();

  const problems = [
    {
      id: 1,
      title: '1. Two Sum',
      status: 'completed',
      difficulty: 'Easy',
      acceptance: '52.4%',
      tags: ['Array', 'Hash Table'],
    },
    {
      id: 2,
      title: '2. Add Two Numbers',
      status: 'pending',
      difficulty: 'Medium',
      acceptance: '41.8%',
      tags: ['Linked List', 'Math'],
    },
    {
      id: 3,
      title: '3. Longest Substring Without Repeating Characters',
      status: 'pending',
      difficulty: 'Medium',
      acceptance: '34.2%',
      tags: ['Sliding Window', 'String'],
    },
    {
      id: 4,
      title: '4. Median of Two Sorted Arrays',
      status: 'pending',
      difficulty: 'Hard',
      acceptance: '38.1%',
      tags: ['Binary Search', 'Divide & Conquer'],
    },
    {
      id: 5,
      title: '5. Valid Parentheses',
      status: 'completed',
      difficulty: 'Easy',
      acceptance: '40.6%',
      tags: ['Stack', 'String'],
    },
  ];

  const handleProblemClick = (problemId) => {
    // Redirect unauthenticated guest to login page
    navigate('/login');
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <section id="problems" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
      <div className="text-center space-y-2 mb-10">
        <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">
          Problem Bank
        </span>
        <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Popular Coding Challenges
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Practice algorithms curated by technical interviewers.
        </p>
      </div>

      <div
        className={`rounded-3xl border shadow-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-[#0B101D] border-slate-800/80'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b font-bold uppercase tracking-wider text-[11px] ${
                  isDarkMode
                    ? 'border-slate-800/80 text-slate-400 bg-slate-900/40'
                    : 'border-slate-200 text-slate-500 bg-slate-50'
                }`}
              >
                <th className="py-4 px-6 w-16">Status</th>
                <th className="py-4 px-6">Problem Name</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6">Acceptance</th>
                <th className="py-4 px-6">Tags</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200'
              }`}
            >
              {problems.map((problem) => (
                <tr
                  key={problem.id}
                  onClick={() => handleProblemClick(problem.id)}
                  className={`cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'hover:bg-slate-800/50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-4 px-6">
                    {problem.status === 'completed' ? (
                      <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <FiCircle className="w-4 h-4 text-slate-600" />
                    )}
                  </td>
                  <td
                    className={`py-4 px-6 font-bold hover:text-emerald-400 transition ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {problem.title}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full border text-[10px] font-extrabold ${getDifficultyBadge(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-400">
                    {problem.acceptance}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border ${
                            isDarkMode
                              ? 'bg-slate-800/80 text-slate-300 border-slate-700/50'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProblemsTable;