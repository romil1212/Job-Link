import React, { useState } from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiClock,
  FiCode,
  FiCalendar,
  FiArrowRight,
  FiZap,
} from 'react-icons/fi';

const DashboardHome = ({ isDarkMode }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const submissions = [
    {
      id: 1,
      title: 'Two Sum',
      status: 'Accepted',
      difficulty: 'Easy',
      language: 'Python',
      runtime: '2 ms',
      date: 'Jul 24, 2026',
      description:
        'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
      input: 'nums = [2, 7, 11, 15], target = 9',
      output: '[0, 1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      id: 2,
      title: '3Sum',
      status: 'Accepted',
      difficulty: 'Medium',
      language: 'TypeScript',
      runtime: '68 ms',
      date: 'Jul 23, 2026',
      description:
        'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.',
      input: 'nums = [-1, 0, 1, 2, -1, -4]',
      output: '[[-1, -1, 2], [-1, 0, 1]]',
      explanation: 'The distinct triplets that sum up to 0 are [-1, 0, 1] and [-1, -1, 2].',
    },
    {
      id: 3,
      title: 'Trapping Rain Water',
      status: 'Failed',
      difficulty: 'Hard',
      language: 'Python',
      runtime: 'Time Limit Exceeded',
      date: 'Jul 22, 2026',
      description:
        'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
      output: '6',
      explanation: 'The elevation map above (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are trapped.',
    },
    {
      id: 4,
      title: 'Container With Most Water',
      status: 'Accepted',
      difficulty: 'Medium',
      language: 'JavaScript',
      runtime: '84 ms',
      date: 'Jul 22, 2026',
      description:
        'Given `n` non-negative integers `a1, a2, ..., an`, where each represents a point at coordinate `(i, ai)`. Find two lines that together with the x-axis form a container that contains the most water.',
      input: 'height = [1,8,6,2,5,4,8,3,7]',
      output: '49',
      explanation: 'The max area of water the container can contain is 49.',
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Top Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Problems Solved */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Problems Solved
            </p>
            <h3 className="text-2xl font-black pt-1">342</h3>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">out of 3,341 total</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Current Streak */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Current Streak
            </p>
            <h3 className="text-2xl font-black pt-1">18</h3>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">consecutive days</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FiZap className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Acceptance Rate */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Acceptance Rate
            </p>
            <h3 className="text-2xl font-black pt-1">68.4%</h3>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">all-time submissions</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiCode className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Submissions List */}
        <div
          className={`lg:col-span-8 p-6 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Recent Submissions</h2>
            <span className="text-xs text-slate-400 font-medium">Click item to view details</span>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isDarkMode
                    ? 'bg-[#050914] border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/40'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2 rounded-xl border ${
                      sub.status === 'Accepted'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}
                  >
                    {sub.status === 'Accepted' ? (
                      <FiCheckCircle className="w-4 h-4" />
                    ) : (
                      <FiXCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black hover:text-emerald-400 transition">
                      {sub.title}
                    </h4>
                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          sub.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : sub.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {sub.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {sub.language}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-300">{sub.runtime}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{sub.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel: Difficulty Progress */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h2 className="text-lg font-black">Difficulty Progress</h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-400">Easy</span>
                  <span className="text-slate-400">198 / 843</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-[23%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-amber-400">Medium</span>
                  <span className="text-slate-400">119 / 1764</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-[12%] h-full bg-amber-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-rose-400">Hard</span>
                  <span className="text-slate-400">25 / 734</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-[5%] h-full bg-rose-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Details Modal Pop-Up */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 relative ${
              isDarkMode ? 'bg-[#0B101D] border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl border ${
                    selectedSubmission.status === 'Accepted'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}
                >
                  {selectedSubmission.status === 'Accepted' ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : (
                    <FiXCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black">{selectedSubmission.title}</h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        selectedSubmission.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : selectedSubmission.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {selectedSubmission.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Language: <span className="text-emerald-400">{selectedSubmission.language}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Metadata Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#050914] border border-slate-800/80 flex items-center gap-2.5">
                <FiClock className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Runtime</p>
                  <p className="text-xs font-black">{selectedSubmission.runtime}</p>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#050914] border border-slate-800/80 flex items-center gap-2.5">
                <FiCalendar className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Submitted On</p>
                  <p className="text-xs font-black">{selectedSubmission.date}</p>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Problem Description
              </h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed bg-[#050914] p-3.5 rounded-2xl border border-slate-800/80">
                {selectedSubmission.description}
              </p>
            </div>

            {/* Sample Input & Output */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Input & Expected Output
              </h4>
              <div className="p-3.5 rounded-2xl bg-[#050914] border border-slate-800/80 font-mono text-xs space-y-2">
                <div>
                  <span className="text-slate-500">Input: </span>
                  <span className="text-amber-300">{selectedSubmission.input}</span>
                </div>
                <div>
                  <span className="text-slate-500">Output: </span>
                  <span className="text-emerald-400">{selectedSubmission.output}</span>
                </div>
                {selectedSubmission.explanation && (
                  <div className="pt-1 text-[11px] text-slate-400 font-sans border-t border-slate-800">
                    <span className="font-bold text-slate-300">Explanation: </span>
                    {selectedSubmission.explanation}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <span>Re-Solve Problem</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;