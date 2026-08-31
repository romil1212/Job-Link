import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiLogOut, FiLayout, FiUser, FiStar } from 'react-icons/fi';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  // Dynamic user data extraction
  const displayName = user?.fullName || user?.name || user?.username || 'User';
  const displayRole = user?.role ? `${user.role.toUpperCase()} Member` : 'Developer Member';
  const userInitial = displayName.charAt(0).toUpperCase() || 'U';
  const totalXP = user?.xp !== undefined ? user.xp : 0;

  const handleNavClick = (e, targetId) => {
    e.preventDefault();

    const scrollToTarget = () => {
      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // If user is on another page, navigate to Landing Page first, then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToTarget, 100);
    } else {
      scrollToTarget();
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors select-none ${
        isDarkMode
          ? 'bg-[#030712]/90 border-slate-800/80 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Logo size="medium" isDarkMode={isDarkMode} />
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className={`text-sm font-bold transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:text-emerald-400'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Home
          </a>

          <a
            href="#problems"
            onClick={(e) => handleNavClick(e, 'problems')}
            className={`text-sm font-bold transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:text-emerald-400'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Problems
          </a>

          <a
            href="#learning-paths"
            onClick={(e) => handleNavClick(e, 'learning-paths')}
            className={`text-sm font-bold transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:text-emerald-400'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Learning Paths
          </a>

          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className={`text-sm font-bold transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:text-emerald-400'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            About
          </a>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className={`text-sm font-bold transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:text-emerald-400'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark/Light Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>

          {/* Conditional Rendering: Logged In vs Guest */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Dynamic XP Tag */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black font-mono">
                <FiStar className="w-3.5 h-3.5 fill-amber-400" />
                <span>{totalXP} XP</span>
              </div>

              {/* Dashboard Link */}
              <Link
                to="/dashboard/profile"
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-white'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200/80 text-slate-900'
                }`}
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden shadow-sm">
                  {user?.avatar || user?.profileImage ? (
                    <img src={user.avatar || user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-xs font-black truncate max-w-[100px]">{displayName}</p>
                  <p className="text-[9px] text-slate-400 font-medium truncate">{displayRole}</p>
                </div>
              </Link>

              {/* Go to Dashboard CTA */}
              <Link
                to="/dashboard/overview"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-md shadow-emerald-600/20"
              >
                <FiLayout className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logoutUser}
                title="Logout"
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={`text-sm font-bold px-3.5 py-2 rounded-xl transition ${
                  isDarkMode ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition shadow-md shadow-emerald-600/25"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;