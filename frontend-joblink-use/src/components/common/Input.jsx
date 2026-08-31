import React from 'react';

const Input = ({ label, icon: Icon, error, isDarkMode, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className={`block text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />}
        <input
          className={`w-full text-base rounded-2xl ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
          } ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
};

export default Input;