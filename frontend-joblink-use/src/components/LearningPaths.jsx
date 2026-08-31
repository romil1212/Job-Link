import React from 'react';
import { FiClock, FiBarChart } from 'react-icons/fi';

const LearningPaths = ({ isDarkMode }) => {
  const paths = [
    { title: 'Java Development', level: 'Beginner', duration: '8 Weeks', progress: 0, tag: 'Language' },
    { title: 'Python Programming', level: 'Beginner', duration: '6 Weeks', progress: 0, tag: 'Language' },
    { title: 'Modern JavaScript', level: 'Intermediate', duration: '6 Weeks', progress: 0, tag: 'Frontend' },
    { title: 'React Frontend Specialist', level: 'Intermediate', duration: '10 Weeks', progress: 0, tag: 'Frontend' },
    { title: 'Spring Boot Backend Architecture', level: 'Advanced', duration: '12 Weeks', progress: 0, tag: 'Backend' },
    { title: 'Full-Stack MERN Mastery', level: 'Advanced', duration: '14 Weeks', progress: 0, tag: 'Full-Stack' },
    { title: 'Data Structures Essentials', level: 'Intermediate', duration: '8 Weeks', progress: 0, tag: 'DSA' },
    { title: 'Advanced Algorithms', level: 'Advanced', duration: '10 Weeks', progress: 0, tag: 'DSA' },
  ];

  return (
    <section
      id="learning-paths"
      className={`py-24 w-full transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase">Structured Learning</h2>
          <p className={`text-4xl sm:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Curated Learning Paths
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Follow tailored curriculum paths designed by industry experts.
          </p>
        </div>

        {/* Path Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {paths.map((path, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-xl'
              }`}
            >
              <div>
                <span className="inline-block px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-lg mb-4">
                  {path.tag}
                </span>
                <h3 className={`text-xl font-extrabold mb-3 leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {path.title}
                </h3>
                
                <div className="flex items-center gap-5 text-sm font-semibold text-slate-400 my-4">
                  <span className="flex items-center gap-1.5">
                    <FiBarChart className="w-4 h-4" /> {path.level}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="w-4 h-4" /> {path.duration}
                  </span>
                </div>
              </div>

              <div className={`pt-5 border-t mt-5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200/60'}`}>
                <div className={`w-full h-2 rounded-full overflow-hidden mb-5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className="bg-emerald-600 h-full w-0" />
                </div>
                <button
                  className={`w-full py-3 border font-bold text-sm rounded-xl transition-colors duration-200 ${
                    isDarkMode
                      ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                      : 'bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-xs'
                  }`}
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LearningPaths;