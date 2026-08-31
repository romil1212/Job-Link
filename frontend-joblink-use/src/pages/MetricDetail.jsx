import React from 'react';
import { useLocation } from 'react-router-dom';

const MetricDetail = ({ title, description, isDarkMode }) => {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Dashboard Metric</span>
        <h1 className={`text-3xl font-black mt-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h1>
        <p className="text-slate-400 font-medium mt-2">{description}</p>
      </div>

      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
        <p className="text-sm font-medium">
          Route active: <code className="text-emerald-500 font-mono">{location.pathname}</code>
        </p>
        <div className="mt-6 p-6 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-center text-slate-400">
          Metric statistics and detailed graphs will load here.
        </div>
      </div>
    </div>
  );
};

export default MetricDetail;