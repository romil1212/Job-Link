import React, { useState } from 'react';
import {
  FiTerminal,
  FiGlobe,
  FiServer,
  FiDatabase,
  FiCheckCircle,
  FiClock,
  FiX,
  FiArrowRight,
  FiPlay,
  FiChevronRight,
  FiStar,
  FiShare2,
  FiZap,
} from 'react-icons/fi';

const RealWorldTasks = ({ isDarkMode = true }) => {
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [activeTask, setActiveTask] = useState(0);

  const modules = [
    {
      id: 'devops',
      title: 'DevOps & Infrastructure',
      category: 'Production Systems',
      level: 'Intermediate',
      duration: '4 Core Modules',
      chaptersCount: 4,
      itemsCount: 24,
      progress: 50,
      accentColor: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: FiTerminal,
      description:
        'Master containerization, CI/CD automation, git branching strategies, and Kubernetes orchestration.',
      subTopics: [
        {
          name: 'Git Version Control',
          details:
            'Handle merge conflicts, interactive rebasing, feature-branch workflows, and git hooks automation.',
          difficulty: 'Easy',
          completed: true,
        },
        {
          name: 'Docker & Containerization',
          details:
            'Write optimized multi-stage Dockerfiles, manage docker-compose environments, and configure volume mounts.',
          difficulty: 'Medium',
          completed: true,
        },
        {
          name: 'CI/CD Pipelines',
          details:
            'Build automated GitHub Actions workflows for testing, linting, semantic versioning, and cloud deployments.',
          difficulty: 'Medium',
          completed: false,
        },
        {
          name: 'Kubernetes Orchestration',
          details:
            'Deploy Pods, Deployments, Services, Ingress controllers, Helm charts, and configure auto-scaling rules.',
          difficulty: 'Hard',
          completed: false,
        },
      ],
    },
    {
      id: 'api',
      title: 'API Engineering',
      category: 'System Architecture',
      level: 'Intermediate',
      duration: '4 Core Modules',
      chaptersCount: 4,
      itemsCount: 18,
      progress: 25,
      accentColor: 'from-blue-600 to-indigo-700',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: FiGlobe,
      description:
        'Design resilient RESTful endpoints, GraphQL schemas, rate limiting, and WebSockets.',
      subTopics: [
        {
          name: 'RESTful API Design',
          details:
            'Implement standard HTTP status codes, structured JSON error formats, query pagination, and filtering.',
          difficulty: 'Easy',
          completed: true,
        },
        {
          name: 'Rate Limiting & Throttling',
          details:
            'Construct Redis sliding-window algorithms to block IP/Token abuse during high-traffic spikes.',
          difficulty: 'Medium',
          completed: false,
        },
        {
          name: 'GraphQL & Apollo Server',
          details:
            'Build dynamic GraphQL schemas, resolve query depth limits, and fix N+1 database queries using DataLoader.',
          difficulty: 'Medium',
          completed: false,
        },
        {
          name: 'WebSockets & Real-Time Sync',
          details:
            'Handle bidirectional pub/sub events for real-time chat, notifications, and socket reconnection handling.',
          difficulty: 'Hard',
          completed: false,
        },
      ],
    },
    {
      id: 'backend',
      title: 'Backend Development',
      category: 'Microservices',
      level: 'Advanced',
      duration: '4 Core Modules',
      chaptersCount: 4,
      itemsCount: 32,
      progress: 10,
      accentColor: 'from-purple-600 to-purple-800',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: FiServer,
      description:
        'Architect scalable microservices, background job queues, authentication mechanisms, and caching layers.',
      subTopics: [
        {
          name: 'JWT & OAuth2 Authentication',
          details:
            'Implement secure Refresh/Access token rotation, RBAC authorization middleware, and session management.',
          difficulty: 'Medium',
          completed: true,
        },
        {
          name: 'Background Worker Queues',
          details:
            'Set up RabbitMQ/Redis BullMQ for asynchronous email sending, video processing, and retry policies.',
          difficulty: 'Medium',
          completed: false,
        },
        {
          name: 'Redis Caching Layer',
          details:
            'Implement Cache-Aside strategies, TTL expiration policies, cache invalidation, and prevention of stampedes.',
          difficulty: 'Medium',
          completed: false,
        },
        {
          name: 'Microservices Communication',
          details:
            'Design gRPC services, Event-Driven architecture with Apache Kafka, and circuit breakers.',
          difficulty: 'Hard',
          completed: false,
        },
      ],
    },
    {
      id: 'database',
      title: 'Database Management',
      category: 'Data Infrastructure',
      level: 'Advanced',
      duration: '4 Core Modules',
      chaptersCount: 4,
      itemsCount: 20,
      progress: 0,
      accentColor: 'from-amber-600 to-orange-700',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: FiDatabase,
      description:
        'Optimize complex SQL queries, index structures, transactions, ORMs, and MongoDB schema designs.',
      subTopics: [
        {
          name: 'SQL Query Optimization & Indexes',
          details:
            'Analyze EXPLAIN plans, implement B-Tree and Composite indexes, and optimize N+1 JOIN queries.',
          difficulty: 'Medium',
          completed: false,
        },
        {
          name: 'ACID Transactions & Locking',
          details:
            'Manage pessimistic/optimistic concurrency locks, isolation levels, and rollback transaction states.',
          difficulty: 'Hard',
          completed: false,
        },
        {
          name: 'NoSQL Schema Modeling',
          details:
            'Design embedded vs referenced documents in MongoDB, manage aggregation pipelines, and indexing strategy.',
          difficulty: 'Easy',
          completed: false,
        },
        {
          name: 'Database Migration & Seeding',
          details:
            'Manage ORM migration scripts (Prisma/TypeORM/Sequelize) without downtime in production DBs.',
          difficulty: 'Medium',
          completed: false,
        },
      ],
    },
  ];

  const selectedTrack = modules.find((m) => m.id === selectedTrackId);

  // VIEW 2: INTERACTIVE TRACK DETAIL PAGE
  if (selectedTrack) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Back Navigation & Controls */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedTrackId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <FiArrowRight className="w-4 h-4 rotate-180" /> Back to Real-World Tasks
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

        {/* Hero Banner Header */}
        <div
          className={`p-8 rounded-3xl bg-gradient-to-r ${selectedTrack.accentColor} text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6`}
        >
          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
              {selectedTrack.category}
            </span>
            <h1 className="text-3xl font-black">{selectedTrack.title}</h1>
            <p className="text-xs text-white/80 font-medium leading-relaxed">
              {selectedTrack.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/90 pt-2">
              <span className="flex items-center gap-1.5">
                <FiClock className="w-4 h-4" /> {selectedTrack.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiZap className="w-4 h-4" /> {selectedTrack.itemsCount} Production Scenarios
              </span>
            </div>
          </div>

          {/* Progress Tracker Widget */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 w-full md:w-64 space-y-2 shrink-0">
            <div className="flex justify-between text-xs font-black">
              <span>Track Progress</span>
              <span>{selectedTrack.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${selectedTrack.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-white/70 font-medium text-right">
              {Math.round((selectedTrack.progress / 100) * selectedTrack.chaptersCount)} of{' '}
              {selectedTrack.chaptersCount} completed
            </p>
          </div>
        </div>

        {/* Content Section: Sidebar Modules + Task Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Module Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3
              className={`text-xs font-black uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Production Modules
            </h3>

            <div className="space-y-2">
              {selectedTrack.subTopics.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTask(idx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    activeTask === idx
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
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          activeTask === idx ? 'border-emerald-400' : 'border-slate-600'
                        }`}
                      />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-extrabold ${
                          activeTask === idx
                            ? 'text-emerald-400'
                            : isDarkMode
                            ? 'text-slate-200'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.name}
                      </h4>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                          item.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : item.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed text-slate-400 line-clamp-2">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Active Task Reader */}
          <div className="lg:col-span-8">
            <div
              className={`p-8 rounded-3xl border space-y-6 ${
                isDarkMode
                  ? 'bg-[#0B101D] border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="border-b border-slate-800/80 pb-4 space-y-2">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  Task Scenario #{activeTask + 1}
                </span>
                <h2 className="text-xl font-black">
                  {selectedTrack.subTopics[activeTask]?.name}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedTrack.subTopics[activeTask]?.details}
                </p>
              </div>

              {/* Task Details Content */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-300 font-medium">
                <p>
                  You are tasked with resolving a critical production issue. Follow the instructions to write, test, and deploy code matching real engineering specifications.
                </p>
                <div className="p-4 rounded-2xl bg-[#050914] border border-slate-800/80 space-y-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <FiZap className="text-emerald-400" /> Engineering Deliverables
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Configure production configuration files and environment settings.</li>
                    <li>Verify fix using automated integration test suite.</li>
                    <li>Ensure zero-downtime deployment compatibility.</li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  <span>Launch Interactive Workspace</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 1: TRACKS OVERVIEW GALLERY
  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Real-World Engineering Tasks
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Practical production problems across DevOps, APIs, Backend, and Database infrastructure.
        </p>
      </div>

      {/* Grid Layout of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isDarkMode
                  ? 'bg-[#0B101D] border-slate-800/80 hover:border-emerald-500/50'
                  : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm'
              }`}
            >
              {/* Card Header with Rich Gradient Background */}
              <div
                className={`p-6 bg-gradient-to-br ${module.accentColor} text-white relative space-y-4 min-h-[150px] flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md ${module.badgeColor}`}
                  >
                    {module.level}
                  </span>
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/70">
                    {module.category}
                  </span>
                  <h3 className="text-base font-black leading-snug line-clamp-2">
                    {module.title}
                  </h3>
                </div>
              </div>

              {/* Card Body Metrics */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                  {module.description}
                </p>

                {/* Progress Stats Bar */}
                <div className="space-y-3 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-400">{module.chaptersCount} Modules</span>
                    <span className="text-slate-400">{module.itemsCount} Tasks</span>
                    <span className="text-emerald-400 font-black">{module.progress}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrackId(module.id);
                    setActiveTask(0);
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer group"
                >
                  <FiPlay className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                  <span>Start Track</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealWorldTasks;