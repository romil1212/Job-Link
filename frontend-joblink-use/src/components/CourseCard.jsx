import React from 'react';
import { FiPlay, FiCode, FiLayers, FiBookOpen, FiCpu, FiClock, FiBarChart } from 'react-icons/fi';

const CourseCard = ({
  id,
  title,
  tag = 'DSA',
  category = 'Interview Crash Course',
  level = 'Intermediate',
  duration = '8 Weeks',
  chaptersCount = 12,
  itemsCount = 80,
  progress = 0,
  accentColor = 'from-purple-600 to-indigo-600',
  badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  icon: Icon = FiCode,
  isDarkMode = true,
  onSelect,
}) => {
  return (
    <div
      className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isDarkMode
          ? 'bg-[#0B101D] border-slate-800/80 hover:border-emerald-500/50'
          : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm'
      }`}
    >
      {/* Card Header with Gradient Background */}
      <div className={`p-6 bg-gradient-to-br ${accentColor} text-white relative space-y-4 min-h-[150px] flex flex-col justify-between`}>
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md ${badgeColor}`}>
            {level}
          </span>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">
            {tag || category}
          </span>
          <h3 className="text-base font-black leading-snug line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      {/* Card Body Metrics */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5"><FiBarChart className="text-emerald-400" /> {level}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><FiClock className="text-amber-400" /> {duration}</span>
        </div>

        {/* Progress Stats Bar */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-slate-400">{chaptersCount} Chapters</span>
            <span className="text-slate-400">{itemsCount} Items</span>
            <span className="text-emerald-400 font-black">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onSelect && onSelect(id)}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer group"
        >
          <FiPlay className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
          <span>Continue Path</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;