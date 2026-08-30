import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0e1626]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-12 py-3.5 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            ResumeVerify
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {token ? (
            <>
              <div className="hidden md:flex items-center gap-2 pr-3 border-r border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs uppercase">
                  {user.name ? user.name.slice(0, 2) : 'US'}
                </div>
                <span className="text-sm font-medium text-slate-300">
                  {user.name}
                </span>
              </div>

              <Link
                to="/dashboard"
                className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition ${
                  isActive('/dashboard')
                    ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/upload"
                className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition ${
                  isActive('/upload')
                    ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Upload
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-3.5 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-4 py-1.5 rounded-lg shadow-lg shadow-sky-500/20 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;