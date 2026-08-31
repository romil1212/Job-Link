import React from 'react';
import { FiCode, FiCpu, FiCompass, FiAward, FiBarChart2, FiBriefcase } from 'react-icons/fi';

const Features = ({ isDarkMode }) => {
  const features = [
    {
      icon: FiCode,
      title: 'Coding Challenges',
      description: 'Practice multi-topic algorithmic problems with integrated IDE and automated unit test cases.',
    },
    {
      icon: FiCpu,
      title: 'AI Mentor',
      description: 'Get instant code debugging, optimization feedback, and personalized logic hints.',
    },
    {
      icon: FiCompass,
      title: 'Learning Paths',
      description: 'Structured step-by-step roadmaps for mastering backend, frontend, and core DSA.',
    },
    {
      icon: FiAward,
      title: 'Coding Contests',
      description: 'Participate in live timed challenges and compete on global developer leaderboards.',
    },
    {
      icon: FiBarChart2,
      title: 'Progress Tracking',
      description: 'Visualize your submission heatmaps, topic accuracy rates, and speed improvements.',
    },
    {
      icon: FiBriefcase,
      title: 'Company Interview Prep',
      description: 'Solve real interview questions curated from tier-1 tech companies.',
    },
  ];

  return (
    <section
      id="features"
      className={`py-24 w-full transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase">Platform Features</h2>
          <p className={`text-4xl sm:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Everything You Need to Succeed
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Accelerate your engineering journey with comprehensive developer assessment tools.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-9 rounded-3xl border shadow-sm transition-all duration-300 group hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-white border-slate-200/80 hover:shadow-xl'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-colors duration-300 ${
                  isDarkMode
                    ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                    : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                }`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {feature.title}
              </h3>
              <p className="text-slate-400 text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;