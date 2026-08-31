import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Code2,
  Terminal,
  FileCheck2,
  Building2,
  Layers,
  Cpu,
  CalendarDays,
  Award,
  Flag,
  ShieldAlert,
  Settings,
  LogOut,
  Code,
  ExternalLink,
} from 'lucide-react';

const AdminSidebar = ({ isDarkMode = true }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users, badge: '1.2k' },
    { name: 'Problems', path: '/admin/problems', icon: Code2 },
    { name: 'Test Cases', path: '/admin/test-cases', icon: FileCheck2 },
    { name: 'Languages', path: '/admin/languages', icon: Terminal },
    { name: 'Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Task Categories', path: '/admin/task-categories', icon: Layers },
    { name: 'Real World Tasks', path: '/admin/real-world-tasks', icon: Cpu },
    { name: 'Daily Challenges', path: '/admin/daily-challenges', icon: CalendarDays },
    { name: 'Achievements', path: '/admin/achievements', icon: Award },
    { name: 'Reports', path: '/admin/reports', icon: Flag, badge: '3' },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 min-h-screen border-r flex flex-col justify-between p-4 shrink-0 select-none transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#030712] border-slate-800/80 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          {/* Logo links directly to Landing Page ("/") */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="p-2 rounded-xl bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-base font-black tracking-tight block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                JobLink <span className="text-emerald-400">Admin</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Enterprise Suite
              </span>
            </div>
          </Link>

          {/* Shortcut icon to Landing Page */}
          <Link
            to="/"
            title="Switch to Landing Page"
            className={`p-1.5 rounded-lg border transition ${
              isDarkMode
                ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Exit Link - Redirects directly to Landing Page ("/") */}
      <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <Link
          to="/"
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
            isDarkMode
              ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Exit to Landing Page</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;