import React from 'react';
import { Outlet } from 'react-router-dom';

const Dashboard = ({ isDarkMode = true }) => {
  return (
    <div
      className={`flex-1 p-4 sm:p-8 overflow-y-auto min-w-0 transition-colors duration-200 ${
        isDarkMode ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Outlet renders child views (DashboardHome, Problems, Profile, Submissions) */}
      <Outlet context={{ isDarkMode }} />
    </div>
  );
};

export default Dashboard;