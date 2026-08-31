import React from 'react';
import { FiUsers, FiCode, FiBriefcase, FiActivity, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';

const Statistics = ({ isDarkMode }) => {
  const stats = [
    { icon: FiUsers, count: '15,000+', label: 'Registered Users' },
    { icon: FiCode, count: '500+', label: 'Coding Problems' },
    { icon: FiBriefcase, count: '120+', label: 'Hiring Companies' },
    { icon: FiActivity, count: '4,500+', label: 'Daily Active Users' },
    { icon: FiHelpCircle, count: '1,200+', label: 'Interview Questions' },
    { icon: FiCheckCircle, count: '95%', label: 'Placement Success Rate' },
  ];

  return (
    <section className={`py-16 border-y transition-colors duration-300 w-full ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-200 text-center group shadow-xs ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500'
                  : 'bg-slate-50 border-slate-200/60 hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className={`inline-flex p-3.5 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform ${
                isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600'
              }`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.count}</p>
              <p className="text-sm font-bold text-slate-400 mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;