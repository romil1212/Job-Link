import React from 'react';
import { Link } from 'react-router-dom';

const Companies = ({ isDarkMode }) => {
  const companies = [
    { name: 'Google', initial: 'G', questions: '350+ Questions' },
    { name: 'Amazon', initial: 'A', questions: '420+ Questions' },
    { name: 'Microsoft', initial: 'M', questions: '290+ Questions' },
    { name: 'Meta', initial: 'M', questions: '310+ Questions' },
    { name: 'Netflix', initial: 'N', questions: '110+ Questions' },
    { name: 'Adobe', initial: 'A', questions: '180+ Questions' },
    { name: 'Oracle', initial: 'O', questions: '150+ Questions' },
    { name: 'TCS', initial: 'T', questions: '220+ Questions' },
  ];

  return (
    <section
      id="companies"
      className={`py-24 w-full transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase">Targeted Preparation</h2>
          <p className={`text-4xl sm:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Company Interview Prep
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Focus your practice on question sets reported by candidates.
          </p>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border text-center flex flex-col items-center justify-between transition-all duration-300 group hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-emerald-500 hover:shadow-xl hover:bg-white'
              }`}
            >
              {/* Initial Circle */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl mb-5 shadow-xs transition-colors ${
                  isDarkMode
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                {company.initial}
              </div>

              {/* Title & Question Count */}
              <div className="space-y-1 mb-6">
                <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {company.name}
                </h3>
                <p className="text-sm font-semibold text-slate-400">{company.questions}</p>
              </div>

              {/* Practice Questions Button */}
              <Link
                to="/login"
                className={`w-full py-3 rounded-2xl border font-bold text-sm transition-all duration-200 text-center ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 group-hover:border-emerald-500'
                }`}
              >
                Practice Questions
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Companies;