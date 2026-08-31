import React from 'react';

const StatCard = ({ icon: Icon, value, label, color, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
        <p className="text-sm font-semibold text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;