import React, { useState } from 'react';
import { 
  CalendarDays, Plus, Search, Filter, Clock, Users, 
  CheckCircle2, Flame, Award, MoreVertical, Edit, Trash2, 
  ArrowUpRight, ShieldAlert, Sparkles 
} from 'lucide-react';

const INITIAL_CHALLENGES = [
  {
    id: 'DC-2026-0809',
    title: 'Optimize System Cache (Redis LRU Eviction)',
    category: 'System Architecture',
    difficulty: 'Hard',
    date: 'Today (Aug 9)',
    participants: 412,
    completionRate: '68%',
    companyTag: 'Meta',
    status: 'Active',
    rewardPoints: 100
  },
  {
    id: 'DC-2026-0808',
    title: 'Implement Custom Debounce & Throttle Hooks',
    category: 'Frontend React',
    difficulty: 'Medium',
    date: 'Aug 8, 2026',
    participants: 890,
    completionRate: '84%',
    companyTag: 'Airbnb',
    status: 'Completed',
    rewardPoints: 50
  },
  {
    id: 'DC-2026-0807',
    title: 'PostgreSQL Index Optimization for High Throughput',
    category: 'Database Systems',
    difficulty: 'Medium',
    date: 'Aug 7, 2026',
    participants: 742,
    completionRate: '79%',
    companyTag: 'Datadog',
    status: 'Completed',
    rewardPoints: 50
  },
  {
    id: 'DC-2026-0810',
    title: 'Distributed Transaction Rollback with Saga Pattern',
    category: 'Cloud & Microservices',
    difficulty: 'Hard',
    date: 'Tomorrow (Aug 10)',
    participants: 0,
    completionRate: '0%',
    companyTag: 'Stripe',
    status: 'Scheduled',
    rewardPoints: 120
  }
];

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Challenge Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend React');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newCompany, setNewCompany] = useState('Google');
  const [newPoints, setNewPoints] = useState(50);

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newEntry = {
      id: `DC-2026-08${Math.floor(10 + Math.random() * 89)}`,
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      date: 'Scheduled',
      participants: 0,
      completionRate: '0%',
      companyTag: newCompany,
      status: 'Scheduled',
      rewardPoints: Number(newPoints)
    };

    setChallenges([newEntry, ...challenges]);
    setNewTitle('');
    setShowCreateModal(false);
  };

  const handleDelete = (id) => {
    setChallenges(challenges.filter(item => item.id !== id));
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = filterDifficulty === 'All' || c.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="space-y-6 text-zinc-200">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
            <span>Daily Challenges Control Center</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage daily candidate referral tasks, problem assignments, and streak rewards.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Publish New Challenge</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#0d111a] border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Active Today</div>
            <div className="text-2xl font-bold text-white mt-1">412</div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
              <Flame className="w-3 h-3" />
              <span>+18% participation</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d111a] border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Avg Completion Rate</div>
            <div className="text-2xl font-bold text-white mt-1">77%</div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>High submission quality</span>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d111a] border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Points Distributed</div>
            <div className="text-2xl font-bold text-white mt-1">48.2k</div>
            <div className="text-[11px] text-amber-400 flex items-center space-x-1 mt-1">
              <Award className="w-3 h-3" />
              <span>Streak multiplier active</span>
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0d111a] border border-zinc-800/80 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Active Referral Trackers</div>
            <div className="text-2xl font-bold text-white mt-1">12 Roles</div>
            <div className="text-[11px] text-zinc-400 flex items-center space-x-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span>Meta, Stripe, Airbnb</span>
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0d111a] border border-zinc-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search challenge or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121824] border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-[#121824] border border-zinc-800 text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Challenges Data Table */}
      <div className="bg-[#0d111a] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#121824] border-b border-zinc-800 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Challenge Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Target Referral</th>
                <th className="p-4">Participants</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-mono text-zinc-500">{item.id}</td>
                    <td className="p-4 font-semibold text-white">
                      <div>{item.title}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">{item.date} • {item.rewardPoints} Points</div>
                    </td>
                    <td className="p-4 text-zinc-300">{item.category}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        item.difficulty === 'Easy' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : item.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-zinc-300">
                      <span className="bg-[#121824] border border-zinc-800 px-2 py-1 rounded text-[11px]">
                        {item.companyTag}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-zinc-200">{item.participants} users</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{item.completionRate} pass</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                          : item.status === 'Scheduled'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 text-xs">
                    No daily challenges match your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Daily Challenge */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d111a] border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Publish Daily Challenge</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Challenge Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Implement Concurrent Rate Limiter in Go"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121824] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#121824] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>Frontend React</option>
                    <option>System Architecture</option>
                    <option>Backend Microservices</option>
                    <option>Database Systems</option>
                    <option>Cloud & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Difficulty</label>
                  <select 
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full bg-[#121824] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Target Company Tag</label>
                  <input 
                    type="text" 
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-[#121824] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Reward Points</label>
                  <input 
                    type="number" 
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="w-full bg-[#121824] border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3 border-t border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-600"
                >
                  Publish Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}