import React from 'react';
import { FiCheckCircle, FiTarget, FiShield, FiUsers } from 'react-icons/fi';

const About = ({ isDarkMode }) => {
  const values = [
    {
      icon: FiTarget,
      title: 'Real-World Focus',
      description: 'We curate problem sets and learning modules modeled after actual technical interviews at top engineering firms.',
    },
    {
      icon: FiUsers,
      title: 'Community Driven',
      description: 'Connect with a thriving global network of developers, share solutions, and collaborate on complex challenges.',
    },
    {
      icon: FiShield,
      title: 'Automated Feedback',
      description: 'Get immediate performance analysis, code execution metrics, and AI-assisted debugging insights on every submission.',
    },
  ];

  return (
    <section
      id="about"
      className={`py-24 w-full transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <h2 className="text-sm font-bold text-emerald-500 tracking-wider uppercase">About JobLink</h2>
          <p className={`text-4xl sm:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Empowering Next-Gen Engineers
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            JobLink bridges the gap between coding practice and landing high-impact software engineering roles.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <h3 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Built for Developers, Guided by Industry Experts
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              JobLink was created to simplify technical interview preparation. We combine structured learning paths, algorithmic problem banks, and real-time execution tools into a single platform.
            </p>
            <ul className="space-y-4 pt-2">
              {[
                'Structured roadmaps covering DSA, System Design, and Web Stack',
                'Comprehensive execution environments with unit test coverage',
                'Personalized analytics to track weekly problem-solving milestones',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base font-semibold">
                  <FiCheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div
              className={`p-10 rounded-3xl border shadow-xl ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="p-6 rounded-2xl bg-emerald-500/10">
                  <p className="text-4xl font-black text-emerald-500">100%</p>
                  <p className="text-sm font-bold text-slate-400 mt-2">Hands-On Practice</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-500/10">
                  <p className="text-4xl font-black text-emerald-500">500+</p>
                  <p className="text-sm font-bold text-slate-400 mt-2">Curated Questions</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-500/10">
                  <p className="text-4xl font-black text-emerald-500">24/7</p>
                  <p className="text-sm font-bold text-slate-400 mt-2">AI Guidance</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-500/10">
                  <p className="text-4xl font-black text-emerald-500">15K+</p>
                  <p className="text-sm font-bold text-slate-400 mt-2">Active Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border shadow-sm ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <val.icon className="w-6 h-6" />
              </div>
              <h4 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {val.title}
              </h4>
              <p className="text-slate-400 text-base leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;