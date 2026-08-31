import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext'; // 1. Import dynamic user context
import {
  FiGrid,
  FiCode,
  FiUser,
  FiTrendingUp,
  FiTarget,
  FiCompass,
  FiActivity,
  FiCpu,
  FiStar,
  FiAward,
  FiBarChart2,
} from 'react-icons/fi';

const Sidebar = ({ isDarkMode }) => {
  const { user } = useAuth(); // 2. Extract logged-in user

  // Derive initial from user's full name, fallback to 'U'
  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : 'U';

  const mainNav = [
    { name: 'Overview', path: '/dashboard', icon: FiGrid, end: true },
    { name: 'Problem Sets', path: '/dashboard/problems', icon: FiCode },
    { name: 'Real-World Tasks', path: '/dashboard/real-world-tasks', icon: FiCpu },
    { name: 'Bookmarks', path: '/dashboard/bookmarks', icon: FiStar },
    { name: 'Achievements', path: '/dashboard/achievements', icon: FiAward },
    { name: 'Learning Paths', path: '/dashboard/learning-path', icon: FiCompass },
    { name: 'Progress', path: '/dashboard/progress', icon: FiTrendingUp },
    { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
  ];

  const dashboardMetrics = [
    { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
    { name: 'Recommended Problems', path: '/dashboard/recommended', icon: FiTarget },
    { name: 'Upcoming Goals', path: '/dashboard/goals', icon: FiTarget },
    { name: 'Recent Activity', path: '/dashboard/activity', icon: FiActivity },
  ];

  return (
    <aside
      className={`w-64 min-h-screen shrink-0 border-r flex flex-col justify-between p-4 select-none ${
        isDarkMode
          ? 'bg-[#030712] border-slate-800/80 text-slate-300'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      <div className="space-y-6">
        <div className="px-3 pt-2 pb-1">
          <Link to="/">
            <Logo size="medium" isDarkMode={isDarkMode} />
          </Link>
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Main Navigation
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="space-y-1 pt-2">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Dashboard Metrics
          </p>
          {dashboardMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Dynamic Logged-in User Card */}
      <Link
        to="/dashboard/profile"
        className={`pt-4 border-t flex items-center gap-3 px-2 rounded-xl transition hover:opacity-80 group ${
          isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        {user?.avatar || user?.profileImage ? (
          <img
            src={user.avatar || user.profileImage}
            alt="Avatar"
            className="w-9 h-9 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            {userInitial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-bold truncate group-hover:text-emerald-400 transition-colors ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {user?.fullName || 'User'}
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {user?.email || 'Authenticated'}
          </p>
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;