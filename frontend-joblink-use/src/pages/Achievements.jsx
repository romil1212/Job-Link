import React from 'react';
import { FiAward, FiCheckCircle, FiLock } from 'react-icons/fi';

const Achievements = ({ isDarkMode }) => {
  const achievementsList = [
    {
      id: 1,
      name: 'Docker Beginner',
      description: 'Successfully containerized your first full-stack application.',
      unlocked: true,
      unlockDate: 'Unlocked Today',
      xp: '+200 XP',
      progress: 100,
    },
    {
      id: 2,
      name: 'React Explorer',
      description: 'Completed 15 frontend state management tasks.',
      unlocked: true,
      unlockDate: 'Unlocked Jul 20, 2026',
      xp: '+150 XP',
      progress: 100,
    },
    {
      id: 3,
      name: 'Java Master',
      description: 'Solved 50 Object-Oriented Programming challenges.',
      unlocked: false,
      unlockDate: 'Locked',
      xp: '+300 XP',
      progress: 65,
    },
    {
      id: 4,
      name: 'Spring Boot Starter',
      description: 'Built REST API with JWT authorization middleware.',
      unlocked: false,
      unlockDate: 'Locked',
      xp: '+250 XP',
      progress: 40,
    },
    {
      id: 5,
      name: '100 Problems Solved',
      description: 'Reached milestone of 100 algorithm problem solutions.',
      unlocked: true,
      unlockDate: 'Unlocked Jun 12, 2026',
      xp: '+500 XP',
      progress: 100,
    },
    {
      id: 6,
      name: '7-Day Streak',
      description: 'Submitted code solutions 7 consecutive days.',
      unlocked: true,
      unlockDate: 'Unlocked Jul 24, 2026',
      xp: '+100 XP',
      progress: 100,
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-black">Achievements & Trophies</h1>
        <p className="text-slate-400 text-xs font-medium pt-1">
          Earn XP badges and unlock achievements by solving problems and completing real-world tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievementsList.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border space-y-4 relative overflow-hidden transition-all ${
              isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-2xl border ${
                  item.unlocked
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800/50 border-slate-800 text-slate-500'
                }`}
              >
                <FiAward className="w-6 h-6" />
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                  item.unlocked
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {item.xp}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black flex items-center gap-2">
                {item.name}
                {item.unlocked ? (
                  <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FiLock className="w-4 h-4 text-slate-500" />
                )}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{item.unlockDate}</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;