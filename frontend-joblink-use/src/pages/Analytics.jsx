import React from 'react';
import StatCard from '../components/StatCard';
import { FiCheckCircle, FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';

const Analytics = ({ isDarkMode }) => {
  return (
    <div className="space-y-8">
      <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Progress & Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={FiCheckCircle} value="42" label="Solved" color="text-emerald-500 bg-emerald-500/10" isDarkMode={isDarkMode} />
        <StatCard icon={FiTrendingUp} value="7 Days" label="Streak" color="text-amber-500 bg-amber-500/10" isDarkMode={isDarkMode} />
        <StatCard icon={FiClock} value="18.5 hrs" label="Time" color="text-blue-500 bg-blue-500/10" isDarkMode={isDarkMode} />
        <StatCard icon={FiAward} value="#1,240" label="Rank" color="text-purple-500 bg-purple-500/10" isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Analytics;