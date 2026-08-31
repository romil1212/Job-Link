import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiZap,
  FiLogOut,
  FiX,
  FiArrowRight,
  FiCpu,
  FiAward,
  FiCheckCircle,
  FiLock,
  FiTrendingUp,
  FiStar,
} from 'react-icons/fi';

const DashboardNavbar = ({
  isDarkMode = true,
  toggleDarkMode,
  xp = 2450,
  onOpenAiMentor,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  // Derive display names accommodating various backend user document structures
  const displayName = user?.fullName || user?.name || user?.username || 'User';
  const displayUsername = user?.username ? `@${user.username}` : '';
  const userInitial = displayName.charAt(0).toUpperCase();

  // Dynamic user role label
  const userRole = user?.role === 'admin' ? 'Admin Member' : 'Developer Member';

  // Dynamic XP value from user profile or props
  const currentXp = user?.xp ?? xp;

  // Dynamic achievements data calculated from real user progress
  const achievements = [
    {
      id: 1,
      title: 'First Accepted Solution',
      desc: 'Solved your first coding challenge',
      xp: '+50 XP',
      unlocked: (user?.problemsSolved ?? 0) >= 1,
      icon: '🎯',
    },
    {
      id: 2,
      title: '7-Day Streak Master',
      desc: 'Maintained a 7-day coding streak',
      xp: '+200 XP',
      unlocked: (user?.streak ?? 0) >= 7,
      icon: '🔥',
    },
    {
      id: 3,
      title: 'Algorithm Explorer',
      desc: 'Solved 10 challenge problems',
      xp: '+500 XP',
      unlocked: (user?.problemsSolved ?? 0) >= 10,
      icon: '⚡',
    },
    {
      id: 4,
      title: 'Centurion Coder',
      desc: 'Reach 1,000 XP milestone on JobLink',
      xp: '+1000 XP',
      unlocked: currentXp >= 1000,
      icon: '🏆',
    },
  ];

  return (
    <>
      <header
        className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors ${
          isDarkMode
            ? 'bg-[#030712]/90 border-slate-800/80 text-white backdrop-blur-md'
            : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md shadow-xs'
        }`}
      >
        {/* Global Search Bar */}
        <div className="relative w-64 sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search problems, submissions..."
            className={`w-full text-xs rounded-xl pl-10 pr-4 py-2 border font-medium focus:outline-none transition ${
              isDarkMode
                ? 'bg-[#0B101D] border-slate-800 text-white focus:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
            }`}
          />
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          {/* Interactive XP Badge Button */}
          <button
            type="button"
            onClick={() => setShowAchievementsModal(true)}
            title="Click to view Achievements & XP details"
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center gap-1.5 hover:bg-amber-500/20 transition cursor-pointer group"
          >
            <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
            <span>{currentXp} XP</span>
          </button>

          {/* AI Mentor Trigger Button */}
          <button
            type="button"
            onClick={onOpenAiMentor}
            title="Open AI Mentor"
            className="p-2 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <FiCpu className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDarkMode
                ? 'bg-[#0B101D] border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>

          {/* Real-Life Challenge Button */}
          <button
            type="button"
            onClick={() => setShowProblemModal(true)}
            title="Real-World Production Challenge"
            className={`relative p-2 rounded-xl border transition cursor-pointer ${
              isDarkMode
                ? 'bg-[#0B101D] border-slate-800 text-emerald-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-emerald-600 hover:bg-slate-200'
            }`}
          >
            <FiZap className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Clickable Dynamic User Profile Badge */}
          <Link
            to="/dashboard/profile"
            title="View Profile"
            className="flex items-center gap-2.5 pl-2 border-l border-slate-800 hover:opacity-80 transition cursor-pointer group"
          >
            {user?.avatar || user?.profileImage ? (
              <img
                src={user.avatar || user.profileImage}
                alt="Avatar"
                className="w-8 h-8 rounded-xl object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                {userInitial}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold leading-tight group-hover:text-emerald-400 transition-colors">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {displayUsername ? `${displayUsername} • ` : ''}{userRole}
              </p>
            </div>
          </Link>

          {/* Dedicated Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ml-1 ${
              isDarkMode
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
            }`}
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Achievements & XP Breakdown Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl relative space-y-5 ${
              isDarkMode ? 'bg-[#0B101D] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Achievements & XP</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Track your earned rewards and rank progression</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAchievementsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* XP Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Total Progress</span>
                <h4 className="text-2xl font-black text-amber-400">{currentXp} XP</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {user?.problemsSolved ?? 0} Problems Solved • {userRole}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <FiTrendingUp className="w-7 h-7" />
              </div>
            </div>

            {/* Achievements List */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                    item.unlocked
                      ? isDarkMode
                        ? 'bg-[#050914] border-slate-800/80 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'opacity-50 bg-slate-900/30 border-slate-800/40 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold">{item.title}</h5>
                        {item.unlocked ? (
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FiLock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                      item.unlocked
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.xp}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAchievementsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-Life Task Challenge Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative space-y-4 ${
              isDarkMode
                ? 'bg-[#0B101D] border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FiZap className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Real-World Challenge
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProblemModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Medium Severity
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Company: Stripe / Fintech
                </span>
              </div>
              <h4 className="text-base font-black pt-1">Design a Distributed Rate Limiter</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Microservices are experiencing cascading failures during traffic spikes. Implement a sliding-window counter using Redis.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowProblemModal(false);
                  navigate('/dashboard/problems');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <span>Solve Issue</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowProblemModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;