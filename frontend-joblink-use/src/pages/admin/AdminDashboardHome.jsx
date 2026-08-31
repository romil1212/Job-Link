import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Users, Code2, Cpu, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/stats/overview');
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin overview statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-800/60 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-[#0B101D] border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-3xl bg-[#0B101D] border border-slate-800" />
          <div className="h-80 rounded-3xl bg-[#0B101D] border border-slate-800" />
        </div>
      </div>
    );
  }

  // Format Recharts data keys from the dynamic submission trends
  const chartData = (stats.submissionTrends || []).map((t) => ({
    name: t.day,
    submissions: t.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Admin System Overview</h1>
          <p className="text-xs text-slate-400 font-medium pt-0.5">
            JobLink Enterprise Core Diagnostics & Real-Time Performance
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          title="Refresh Statistics"
          className="p-2.5 rounded-xl bg-[#0B101D] border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-[#0B101D] border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Users</p>
            <h3 className="text-2xl font-black text-white pt-1">
              {stats.totalUsers?.toLocaleString() || 0}
            </h3>
            <p className="text-[11px] font-bold text-emerald-400 pt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{stats.newUsersLastWeek || 0} new this week
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Problems */}
        <div className="p-5 rounded-3xl bg-[#0B101D] border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Problems</p>
            <h3 className="text-2xl font-black text-white pt-1">
              {stats.totalProblems?.toLocaleString() || 0}
            </h3>
            <p className="text-[11px] font-bold text-emerald-400 pt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{stats.newProblemsLastWeek || 0} new added
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Code2 className="w-6 h-6" />
          </div>
        </div>

        {/* Real-World Tasks */}
        <div className="p-5 rounded-3xl bg-[#0B101D] border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Real-World Tasks</p>
            <h3 className="text-2xl font-black text-white pt-1">
              {stats.realWorldTasksCount || 0}
            </h3>
            <p className="text-[11px] font-bold text-blue-400 pt-1">DevOps & Cloud active</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="p-5 rounded-3xl bg-[#0B101D] border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Acceptance Rate</p>
            <h3 className="text-2xl font-black text-white pt-1">
              {stats.acceptanceRate}%
            </h3>
            <p className="text-[11px] font-bold text-emerald-400 pt-1">Platform average</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0B101D] border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-white">Platform Submission Trends</h3>
            <span className="text-xs text-slate-500 font-medium">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#030712',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSub)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic System Audit & Flags */}
        <div className="p-6 rounded-3xl bg-[#0B101D] border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white">System Audit & Flags</h3>
          <div className="space-y-3 text-xs">
            {stats.systemFlags && stats.systemFlags.length > 0 ? (
              stats.systemFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-3.5 rounded-2xl bg-[#050914] border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    {flag.level === 'info' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-white leading-tight">{flag.title}</p>
                      <p className="text-[10px] text-slate-500 pt-0.5 leading-snug">{flag.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">{flag.time}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-6">No flags recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;