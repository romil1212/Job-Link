import React from 'react';
import { Link } from 'react-router-dom';
import { FiCode, FiCpu, FiCompass, FiAward, FiPlay, FiUsers } from 'react-icons/fi';

const Hero = ({ isDarkMode }) => {
  return (
    <section
      className={`relative overflow-hidden transition-colors duration-300 min-h-[calc(100vh-80px)] flex items-center py-8 w-full ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <h1
            className={`text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Master Coding. <br />
            Build Skills. <br />
            <span className="text-emerald-500">Get Hired.</span>
          </h1>

          <p
            className={`text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            JobLink helps developers improve coding skills, solve real-world challenges, and receive AI-powered guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/25 transition-all active:scale-95 text-center text-base"
            >
              Start Learning
            </Link>
            <a
              href="#problems"
              className={`w-full sm:w-auto px-8 py-3.5 border font-extrabold rounded-xl shadow-xs transition-all text-center text-base flex items-center justify-center gap-2.5 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <FiPlay className="w-5 h-5 text-emerald-500 fill-emerald-500" /> Explore Problems
            </a>
          </div>

          {/* Feature Badges Grid */}
          <div
            className={`pt-6 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-left ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200/80'
            }`}
          >
            {[
              { icon: FiCode, label: '500+ Problems' },
              { icon: FiCpu, label: 'AI Mentor' },
              { icon: FiCompass, label: '50+ Roadmaps' },
              { icon: FiAward, label: 'Contests' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 p-3 rounded-xl border shadow-2xs ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200/80 text-slate-800'
                }`}
              >
                <badge.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right IDE Column */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 px-1 border-b border-slate-800 text-sm text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-200 font-bold text-xs">TwoSum.java</span>
              </div>
              <span className="text-emerald-400 font-sans font-bold text-xs">● Live Execution</span>
            </div>

            <div className="p-4 font-mono text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed overflow-x-auto">
              <p><span className="text-purple-400 font-bold">public class</span> <span className="text-yellow-300 font-bold">Solution</span> &#123;</p>
              <p className="pl-4"><span className="text-purple-400 font-bold">public int</span>[] <span className="text-blue-400 font-bold">twoSum</span>(<span className="text-purple-400 font-bold">int</span>[] nums, <span className="text-purple-400 font-bold">int</span> target) &#123;</p>
              <p className="pl-8 text-slate-500">// AI Hint: Hash maps optimize to O(N)</p>
              <p className="pl-8">Map&lt;Integer, Integer&gt; map = <span className="text-purple-400 font-bold">new</span> HashMap&lt;&gt;();</p>
              <p className="pl-8"><span className="text-purple-400 font-bold">for</span> (<span className="text-purple-400 font-bold">int</span> i = 0; i &lt; nums.length; i++) &#123;</p>
              <p className="pl-12"><span className="text-purple-400 font-bold">int</span> diff = target - nums[i];</p>
              <p className="pl-12"><span className="text-purple-400 font-bold">if</span> (map.containsKey(diff)) <span className="text-emerald-400 font-bold">return new int</span>[] &#123; map.get(diff), i &#125;;</p>
              <p className="pl-12">map.put(nums[i], i);</p>
              <p className="pl-8">&#125;</p>
              <p className="pl-8"><span className="text-purple-400 font-bold">return new int</span>[] &#123;&#125;;</p>
              <p className="pl-4">&#125;</p>
              <p>&#125;</p>
            </div>
          </div>

          {/* Floating Badges */}
          <div
            className={`absolute -top-4 -left-4 backdrop-blur-md p-3.5 rounded-xl shadow-lg border hidden xl:flex items-center gap-3 z-10 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-100'
            }`}
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FiUsers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Community</p>
              <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>15K+ Developers</p>
            </div>
          </div>

          <div
            className={`absolute -bottom-4 -right-4 backdrop-blur-md p-3.5 rounded-xl shadow-lg border hidden xl:flex items-center gap-3 z-10 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-100'
            }`}
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FiAward className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Satisfaction</p>
              <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>95% Success Rate</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;