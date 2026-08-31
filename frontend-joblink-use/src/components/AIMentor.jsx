import React from 'react';
import { FiCpu, FiCheck } from 'react-icons/fi';

const AIMentor = () => {
  const capabilities = [
    'Line-by-line syntax & logic explanations',
    'Automated execution bug detection & fixes',
    'Optimal time & space complexity suggestions',
    'Dynamic problem hints without giving full answers',
    'Mock technical interview practice drills',
  ];

  return (
    <section id="ai-mentor" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 p-1 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center p-8 text-center relative">
              <FiCpu className="w-16 h-16 text-emerald-400 animate-pulse mb-4" />
              <p className="text-lg font-bold text-white">JobLink AI 2.0</p>
              <span className="text-xs text-emerald-400 mt-1">Ready to assist</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full inline-block">
            Smart Learning Assistant
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Personal AI Coding Mentor
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            Never get stuck on algorithmic logic again. JobLink AI analyzes your code, provides context-aware assistance, and guides you toward optimal solutions.
          </p>

          <ul className="space-y-3 pt-2">
            {capabilities.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                  <FiCheck className="w-4 h-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm">
              Try AI Mentor
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AIMentor;