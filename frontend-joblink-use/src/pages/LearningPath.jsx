import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';
import {
  FiArrowLeft,
  FiClock,
  FiBookOpen,
  FiAward,
  FiStar,
  FiShare2,
  FiCheckCircle,
  FiCode,
  FiChevronRight,
  FiLayers,
  FiCpu,
} from 'react-icons/fi';

const LearningPath = ({ isDarkMode = true }) => {
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const paths = [
    {
      id: 'dsa-essentials',
      title: 'Data Structures Essentials',
      category: 'Interview Crash Course',
      level: 'Intermediate',
      duration: '8 Weeks',
      chaptersCount: 13,
      itemsCount: 149,
      progress: 65,
      accentColor: 'from-purple-600 to-indigo-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: FiCode,
      description: 'Master core DSA patterns, time/space complexity analysis, and pass top-tech coding interviews.',
      syllabus: [
        { title: '1. Introduction & Complexity', desc: 'Big-O notation, memory allocation, and problem-solving framework.', completed: true },
        { title: '2. Arrays & Sliding Window', desc: 'Two pointers, sliding window pattern, and prefix sum arrays.', completed: true },
        { title: '3. Hash Maps & Sets', desc: 'O(1) lookups, collision handling, and frequency counting algorithms.', completed: true },
        { title: '4. Linked Lists & Fast-Slow Pointers', desc: 'Reversing lists, cycle detection, and doubly linked structures.', completed: false },
        { title: '5. Trees & Graph Traversals', desc: 'BFS, DFS, Dijkstra algorithm, and Topological Sorting.', completed: false },
        { title: '6. Dynamic Programming Patterns', desc: 'Memoization, tabulation, and 0/1 Knapsack variations.', completed: false },
      ],
    },
    {
      id: 'react-frontend',
      title: 'React Frontend Specialist',
      category: 'Full-Stack Path',
      level: 'Intermediate',
      duration: '10 Weeks',
      chaptersCount: 9,
      itemsCount: 64,
      progress: 40,
      accentColor: 'from-blue-600 to-cyan-600',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: FiBookOpen,
      description: 'Deep-dive into modern JavaScript, React state management, virtual DOM, and performance optimization.',
      syllabus: [
        { title: '1. Advanced JavaScript Core', desc: 'Event loop, closures, promises, async/await internals.', completed: true },
        { title: '2. React Hooks & Architecture', desc: 'Custom hooks, Context API, and state machines.', completed: true },
        { title: '3. Performance & Rendering', desc: 'Memoization, lazy loading, and bundle optimization.', completed: false },
      ],
    },
    {
      id: 'system-design',
      title: 'System Design for Interviews',
      category: 'Architecture Masterclass',
      level: 'Advanced',
      duration: '10 Weeks',
      chaptersCount: 16,
      itemsCount: 81,
      progress: 15,
      accentColor: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: FiLayers,
      description: 'Learn how to design scalable distributed systems like Netflix, Uber, and WhatsApp from scratch.',
      syllabus: [
        { title: '1. Fundamentals of Distributed Systems', desc: 'Scalability, latency, throughput, and CAP theorem.', completed: true },
        { title: '2. Load Balancing & Reverse Proxies', desc: 'Nginx, HAProxy, and round-robin routing strategies.', completed: false },
        { title: '3. Caching & Message Queues', desc: 'Redis, Memcached, RabbitMQ, and Apache Kafka pub-sub.', completed: false },
        { title: '4. Database Sharding & Replication', desc: 'SQL vs NoSQL, master-slave replication, and consistent hashing.', completed: false },
      ],
    },
    {
      id: 'devops-cloud',
      title: 'DevOps & Docker Kubernetes',
      category: 'Cloud Engineering',
      level: 'Advanced',
      duration: '12 Weeks',
      chaptersCount: 14,
      itemsCount: 92,
      progress: 0,
      accentColor: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: FiCpu,
      description: 'Build production CI/CD pipelines, containerize microservices, and deploy to Kubernetes clusters.',
      syllabus: [
        { title: '1. Linux CLI & Shell Scripting', desc: 'Process management, networking commands, and bash scripts.', completed: false },
        { title: '2. Docker Containerization', desc: 'Dockerfiles, multi-stage builds, and docker-compose.', completed: false },
        { title: '3. Kubernetes Orchestration', desc: 'Pods, Deployments, Services, and Ingress controllers.', completed: false },
      ],
    },
  ];

  const selectedPath = paths.find((p) => p.id === selectedPathId);

  // VIEW 2: PATH DETAIL VIEW
  if (selectedPath) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Back Button & Top Toolbar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedPathId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Learning Paths
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FiStar className="w-3.5 h-3.5 fill-amber-400" /> Save Track
            </button>
            <button
              type="button"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Course Banner Header */}
        <div className={`p-8 rounded-3xl bg-gradient-to-r ${selectedPath.accentColor} text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6`}>
          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
              {selectedPath.category}
            </span>
            <h1 className="text-3xl font-black">{selectedPath.title}</h1>
            <p className="text-xs text-white/80 font-medium leading-relaxed">
              {selectedPath.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/90 pt-2">
              <span className="flex items-center gap-1.5">
                <FiClock className="w-4 h-4" /> {selectedPath.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiBookOpen className="w-4 h-4" /> {selectedPath.chaptersCount} Chapters
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiAward className="w-4 h-4" /> {selectedPath.itemsCount} Challenges
              </span>
            </div>
          </div>

          {/* Progress Tracker Widget */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 w-full md:w-64 space-y-2 shrink-0">
            <div className="flex justify-between text-xs font-black">
              <span>Path Progress</span>
              <span>{selectedPath.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${selectedPath.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-white/70 font-medium text-right">
              {Math.round((selectedPath.progress / 100) * selectedPath.itemsCount)} of {selectedPath.itemsCount} completed
            </p>
          </div>
        </div>

        {/* Content Grid: Chapter Timeline + Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chapter Timeline Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Curriculum Roadmap
            </h3>

            <div className="space-y-2">
              {selectedPath.syllabus.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveChapter(idx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    activeChapter === idx
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : isDarkMode
                      ? 'bg-[#0B101D] border-slate-800 text-slate-400 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {item.completed ? (
                      <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${activeChapter === idx ? 'border-emerald-400' : 'border-slate-600'}`} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-xs font-extrabold ${activeChapter === idx ? 'text-emerald-400' : isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-medium leading-relaxed text-slate-400 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Lesson Reader */}
          <div className="lg:col-span-8">
            <div
              className={`p-8 rounded-3xl border space-y-6 ${
                isDarkMode ? 'bg-[#0B101D] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="border-b border-slate-800/80 pb-4 space-y-2">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  Chapter {activeChapter + 1}
                </span>
                <h2 className="text-xl font-black">
                  {selectedPath.syllabus[activeChapter]?.title}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedPath.syllabus[activeChapter]?.desc}
                </p>
              </div>

              {/* Lesson Text */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-300 font-medium">
                <p>
                  Welcome to this module. In this section, we take a pragmatic approach to mastering interview-level concepts with a strong focus on real-world coding problems.
                </p>
                <div className="p-4 rounded-2xl bg-[#050914] border border-slate-800/80 space-y-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <FiCode className="text-emerald-400" /> Key Takeaways in this Chapter
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Analyze time and space complexity tradeoffs.</li>
                    <li>Recognize optimal algorithmic patterns quickly.</li>
                    <li>Solve guided practice challenges with test cases.</li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  <span>Start Practice Problems</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 1: PATHS OVERVIEW GALLERY
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Learning Paths
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Structured interview prep tracks curated by senior engineers and hiring managers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paths.map((p) => (
          <CourseCard
            key={p.id}
            {...p}
            isDarkMode={isDarkMode}
            onSelect={(id) => {
              setSelectedPathId(id);
              setActiveChapter(0);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LearningPath;