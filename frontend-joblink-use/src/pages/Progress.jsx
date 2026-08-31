import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiAward,
  FiZap,
  FiTrendingUp,
  FiCode,
  FiArrowRight,
  FiLayers
} from 'react-icons/fi';

const Progress = ({ isDarkMode = true }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);

  const TOTAL_PROBLEMS = 3341;
  const TOTAL_EASY = 843;
  const TOTAL_MEDIUM = 1764;
  const TOTAL_HARD = 734;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data?.user) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error('Failed to load progress details:', err);
      }
    };
    fetchUserData();
  }, []);

  const activeUser = profile || user;

  const solvedEasy = Number(activeUser?.easySolved || 0);
  const solvedMedium = Number(activeUser?.mediumSolved || 0);
  const solvedHard = Number(activeUser?.hardSolved || 0);
  const totalSolved = Number(
    activeUser?.problemsSolved ||
    (solvedEasy + solvedMedium + solvedHard) ||
    activeUser?.solvedProblems?.length ||
    0
  );

  const xpEarned = Number(activeUser?.xp || 0);
  const currentStreak = Number(activeUser?.streak || 0);

  const overallPercent = Math.min(Math.round((totalSolved / TOTAL_PROBLEMS) * 100), 100);
  const easyPercent = Math.min(Math.round((solvedEasy / TOTAL_EASY) * 100), 100);
  const mediumPercent = Math.min(Math.round((solvedMedium / TOTAL_MEDIUM) * 100), 100);
  const hardPercent = Math.min(Math.round((solvedHard / TOTAL_HARD) * 100), 100);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  const topicTracks = [
    { title: 'Arrays & Hashing', completed: Math.min(totalSolved, 24), total: 40, color: 'bg-emerald-500' },
    { title: 'Two Pointers & Sliding Window', completed: Math.min(Math.floor(totalSolved * 0.6), 18), total: 30, color: 'bg-teal-500' },
    { title: 'Trees & Binary Search', completed: Math.min(Math.floor(totalSolved * 0.4), 12), total: 35, color: 'bg-amber-500' },
    { title: 'Dynamic Programming', completed: Math.min(Math.floor(totalSolved * 0.2), 6), total: 50, color: 'bg-rose-500' },
    { title: 'Graphs & BFS/DFS', completed: Math.min(Math.floor(totalSolved * 0.3), 8), total: 45, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-sans p-4 sm:p-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Learning Progress
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Real-time tracking of your solved problems, algorithmic tracks, and XP milestones.
          </p>
        </div>

        <Link
          to="/problems"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <FiCode className="w-4 h-4" />
          <span>Solve Next Problem</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold mb-1">
            <FiCheckCircle className="text-emerald-400 w-4 h-4" />
            <span>Solved</span>
          </div>
          <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {totalSolved} <span className="text-[10px] text-slate-500 font-semibold">/ {TOTAL_PROBLEMS}</span>
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold mb-1">
            <FiZap className="text-amber-400 w-4 h-4" />
            <span>Active Streak</span>
          </div>
          <p className="text-2xl font-black text-amber-400">
            {currentStreak} <span className="text-xs font-bold text-slate-500">Days</span>
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold mb-1">
            <FiAward className="text-purple-400 w-4 h-4" />
            <span>Total XP</span>
          </div>
          <p className="text-2xl font-black text-purple-400">
            {xpEarned} <span className="text-xs font-bold text-slate-500">XP</span>
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold mb-1">
            <FiTrendingUp className="text-cyan-400 w-4 h-4" />
            <span>Completion</span>
          </div>
          <p className="text-2xl font-black text-cyan-400">
            {overallPercent}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`lg:col-span-6 p-6 rounded-3xl border space-y-6 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Difficulty Mastery
            </h2>
            <span className="text-[11px] font-bold text-slate-400">
              {overallPercent}% Completed
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className={isDarkMode ? 'stroke-slate-800' : 'stroke-slate-200'}
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {totalSolved}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Total Solved
                </span>
              </div>
            </div>

            <div className="w-full space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Easy
                  </span>
                  <span className="text-slate-400">
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{solvedEasy}</strong> / {TOTAL_EASY} ({easyPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${easyPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium
                  </span>
                  <span className="text-slate-400">
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{solvedMedium}</strong> / {TOTAL_MEDIUM} ({mediumPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${mediumPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Hard
                  </span>
                  <span className="text-slate-400">
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{solvedHard}</strong> / {TOTAL_HARD} ({hardPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${hardPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-6 p-6 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <FiLayers className="w-4 h-4 text-emerald-400" /> Topic Specialization
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Algorithm Curriculums</span>
          </div>

          <div className="space-y-4 pt-1">
            {topicTracks.map((topic, idx) => {
              const percent = Math.min(Math.round((topic.completed / topic.total) * 100), 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {topic.title}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {topic.completed} / {topic.total} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${topic.color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;