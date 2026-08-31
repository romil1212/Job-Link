import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import {
  FiEdit2,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiCheckCircle,
  FiStar,
  FiBookOpen,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiGlobe,
  FiUsers,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';

const Profile = ({ isDarkMode = true }) => {
  const { user, updateUser, refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState(user || null);
  const [communityStats, setCommunityStats] = useState({
    totalSolvers: 0,
    globalAcceptanceRate: '0%',
    rank: '—',
    userSolutions: 0,
    reputation: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [activityMap, setActivityMap] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: '',
    college: '',
    location: '',
    github: '',
    linkedin: '',
    website: '',
    avatar: '',
  });

  const extractTitle = (sub) => {
    if (typeof sub.problem === 'object' && sub.problem !== null) {
      return sub.problem.title || sub.problem.slug || 'Coding Problem';
    }
    if (typeof sub.problemId === 'object' && sub.problemId !== null) {
      return sub.problemId.title || sub.problemId.slug || 'Coding Problem';
    }
    return sub.problemTitle || sub.title || 'Coding Problem';
  };

  const extractSlug = (sub) => {
    if (typeof sub.problem === 'object' && sub.problem !== null) {
      return sub.problem.slug || sub.problem._id || '';
    }
    if (typeof sub.problemId === 'object' && sub.problemId !== null) {
      return sub.problemId.slug || sub.problemId._id || '';
    }
    return sub.problemSlug || sub.slug || '';
  };

  // Load backend profile, community metrics, submissions, and heatmap
  useEffect(() => {
    const loadAllProfileData = async () => {
      try {
        const [meRes, commRes, subRes, heatmapRes] = await Promise.allSettled([
          API.get('/auth/me'),
          API.get('/auth/community-stats'),
          API.get('/submissions/my'),
          API.get('/submissions/heatmap'),
        ]);

        if (meRes.status === 'fulfilled' && meRes.value.data?.user) {
          setProfileData(meRes.value.data.user);
          if (updateUser) updateUser(meRes.value.data.user);
        }

        if (commRes.status === 'fulfilled' && commRes.value.data?.data) {
          setCommunityStats(commRes.value.data.data);
        }

        if (heatmapRes.status === 'fulfilled' && heatmapRes.value.data?.data) {
          setActivityMap(heatmapRes.value.data.data);
        }

        if (subRes.status === 'fulfilled') {
          const list = subRes.value.data?.submissions || subRes.value.data?.data?.submissions || subRes.value.data || [];
          if (Array.isArray(list)) {
            setRecentSubmissions(
              list.slice(0, 8).map((sub) => ({
                _id: sub._id || Math.random().toString(),
                title: extractTitle(sub),
                slug: extractSlug(sub),
                difficulty: typeof sub.difficulty === 'string' ? sub.difficulty : (sub.problem?.difficulty || 'Medium'),
                lang: typeof sub.language === 'string' ? sub.language : (sub.lang || 'Java'),
                time: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recently',
                status: String(sub.verdict || sub.status || 'Accepted').toUpperCase(),
                runtime: sub.runtime !== undefined && sub.runtime !== null ? `${sub.runtime} ms` : '—',
              }))
            );
          }
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      }
    };

    loadAllProfileData();
  }, []);

  const activeUser = profileData || user;

  // Sync Form State
  useEffect(() => {
    if (activeUser) {
      setFormData({
        fullName: activeUser.fullName || activeUser.name || '',
        username: activeUser.username || '',
        bio: activeUser.bio || '',
        college: activeUser.college || '',
        location: activeUser.location || '',
        github: activeUser.github || '',
        linkedin: activeUser.linkedin || '',
        website: activeUser.website || '',
        avatar: activeUser.avatar || activeUser.profileImage || '',
      });
    }
  }, [activeUser, isEditModalOpen]);

  const displayName = String(activeUser?.fullName || activeUser?.name || activeUser?.username || 'Developer');
  const displayUsername = String(activeUser?.username || 'member');
  const displayEmail = String(activeUser?.email || '');
  const userInitial = displayName.charAt(0).toUpperCase() || 'U';

  const totalSolved = Number(activeUser?.problemsSolved ?? (activeUser?.solvedProblems?.length || 0));
  const easySolved = Number(activeUser?.easySolved ?? 0);
  const mediumSolved = Number(activeUser?.mediumSolved ?? 0);
  const hardSolved = Number(activeUser?.hardSolved ?? 0);

  // Dynamic Heatmap Calculation (52 Weeks / 365 Days)
  const { heatmapWeeks, dynamicActiveDays, dynamicMaxStreak } = useMemo(() => {
    const today = new Date();
    const daysArray = [];

    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap[dateStr] || 0;
      daysArray.push({ date: dateStr, count });
    }

    // If no submissions exist in heatmap yet but user has solved problems, illuminate today
    if (totalSolved > 0 && Object.keys(activityMap).length === 0) {
      daysArray[daysArray.length - 1].count = totalSolved;
    }

    const groupedWeeks = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      groupedWeeks.push(daysArray.slice(i, i + 7));
    }

    let totalActive = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    daysArray.forEach((day) => {
      if (day.count > 0) {
        totalActive++;
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    return {
      heatmapWeeks: groupedWeeks,
      dynamicActiveDays: totalActive || (totalSolved > 0 ? 1 : 0),
      dynamicMaxStreak: longestStreak || (totalSolved > 0 ? 1 : 0),
    };
  }, [activityMap, totalSolved]);

  const stats = {
    totalSolved,
    totalProblems: 3341,
    easySolved,
    easyTotal: 843,
    mediumSolved,
    mediumTotal: 1764,
    hardSolved,
    hardTotal: 734,
    activeDays: dynamicActiveDays,
    maxStreak: dynamicMaxStreak,
    views: Number(activeUser?.views ?? 0),
    solutions: Number(activeUser?.solutionsPublished ?? totalSolved),
    discussions: Number(activeUser?.discussPosts ?? 0),
    reputation: Number(activeUser?.xp ?? 0),
  };

  const badges = [
    { id: 1, title: '50 Days Streak', icon: '🔥', earned: stats.maxStreak >= 50 },
    { id: 2, title: 'Problem Solver', icon: '⚙️', earned: totalSolved >= 1 },
    { id: 3, title: '100 Days Streak', icon: '⚡', earned: stats.maxStreak >= 100 },
  ];

  const getIntensityColor = (count) => {
    if (count >= 6) return 'bg-emerald-400';
    if (count >= 3) return 'bg-emerald-500';
    if (count >= 1) return 'bg-emerald-600';
    return isDarkMode ? 'bg-slate-800/60 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300';
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setEditError('');
    setLoading(true);

    const payload = {
      fullName: formData.fullName.trim(),
      name: formData.fullName.trim(),
      username: formData.username.trim().toLowerCase(),
      bio: formData.bio.trim(),
      college: formData.college.trim(),
      location: formData.location.trim(),
      github: formData.github.trim(),
      linkedin: formData.linkedin.trim(),
      website: formData.website.trim(),
      avatar: formData.avatar.trim(),
    };

    try {
      let res;
      try {
        res = await API.put('/users/profile', payload);
      } catch {
        res = await API.put('/auth/profile', payload);
      }

      const updated = res.data?.user || res.data?.data?.user || res.data;
      if (updated) {
        setProfileData(updated);
        if (updateUser) updateUser(updated);
      }
      setIsEditModalOpen(false);
      if (refreshProfile) refreshProfile();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                {activeUser?.avatar || activeUser?.profileImage ? (
                  <img
                    src={activeUser.avatar || activeUser.profileImage}
                    alt="Avatar"
                    className="w-24 h-24 rounded-3xl object-cover shadow-xl border-2 border-emerald-500/30"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-emerald-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-emerald-600/30">
                    {userInitial}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0B101D]" />
              </div>

              <div>
                <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{displayName}</h2>
                <p className="text-xs text-slate-400 font-medium">@{displayUsername}</p>
                {displayEmail && <p className="text-[11px] text-slate-500 font-medium pt-0.5">{displayEmail}</p>}
              </div>

              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
                {activeUser?.bio || 'Full-Stack Developer | Software Engineer'}
              </p>

              <button
                type="button"
                onClick={() => {
                  setEditError('');
                  setIsEditModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer mt-2"
              >
                <FiEdit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800/80 space-y-3 text-xs mt-6">
              {activeUser?.college && (
                <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                  <FiBookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{String(activeUser.college)}</span>
                </div>
              )}
              {activeUser?.location && (
                <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                  <FiMapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{String(activeUser.location)}</span>
                </div>
              )}
              {activeUser?.website && (
                <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                  <FiGlobe className="w-4 h-4 text-slate-500 shrink-0" />
                  <a
                    href={String(activeUser.website).startsWith('http') ? activeUser.website : `https://${activeUser.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 truncate"
                  >
                    {String(activeUser.website).replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
              {activeUser?.github && (
                <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                  <FiGithub className="w-4 h-4 text-slate-500 shrink-0" />
                  <a
                    href={String(activeUser.github).startsWith('http') ? activeUser.github : `https://${activeUser.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 truncate"
                  >
                    {String(activeUser.github).replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
              {activeUser?.linkedin && (
                <div className="flex items-center gap-2.5 text-slate-400 font-medium">
                  <FiLinkedin className="w-4 h-4 text-slate-500 shrink-0" />
                  <a
                    href={String(activeUser.linkedin).startsWith('http') ? activeUser.linkedin : `https://${activeUser.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 truncate"
                  >
                    {String(activeUser.linkedin).replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Community Stats Card */}
          <div className={`p-6 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Community Stats
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Platform
              </span>
            </div>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FiUsers className="text-emerald-400 w-4 h-4" /> Solvers in Community
                </span>
                <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {communityStats.totalSolvers.toLocaleString()} Users
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FiCheckCircle className="text-blue-400 w-4 h-4" /> Solutions Solved
                </span>
                <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {communityStats.userSolutions || stats.totalSolved}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FiTrendingUp className="text-cyan-400 w-4 h-4" /> Global Acceptance
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {communityStats.globalAcceptanceRate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <FiAward className="text-purple-400 w-4 h-4" /> Global Rank
                </span>
                <span className="text-purple-400 font-mono font-bold">
                  #{communityStats.rank}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <FiStar className="text-amber-400 w-4 h-4" /> Total XP Earned
                </span>
                <span className="text-amber-400 font-mono font-black">
                  {communityStats.reputation || stats.reputation} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className={`md:col-span-7 p-6 rounded-3xl border flex items-center gap-6 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center rounded-full bg-[#050914] border-4 border-emerald-500 shadow-lg shadow-emerald-500/10">
                <div className="text-center">
                  <span className={`text-2xl font-black block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stats.totalSolved}</span>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">/{stats.totalProblems}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-emerald-400">Easy</span>
                    <span className="text-slate-400">{stats.easySolved} / {stats.easyTotal}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.easySolved / stats.easyTotal) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-amber-400">Medium</span>
                    <span className="text-slate-400">{stats.mediumSolved} / {stats.mediumTotal}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.mediumSolved / stats.mediumTotal) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-rose-400">Hard</span>
                    <span className="text-slate-400">{stats.hardSolved} / {stats.hardTotal}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.hardSolved / stats.hardTotal) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`md:col-span-5 p-5 rounded-3xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Badges ({badges.filter((b) => b.earned).length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      title={badge.title}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                        badge.earned ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-50'
                      }`}
                    >
                      <span className="text-lg mb-1">{badge.icon}</span>
                      <span className="text-[10px] font-bold leading-tight line-clamp-2 w-full break-words">{badge.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold pt-3 truncate">Streak: {stats.maxStreak} Days Active</p>
            </div>
          </div>

          {/* Dynamic Activity Heatmap Grid */}
          <div className={`p-6 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Submissions in the Past Year
              </h3>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                <span>Active Days: <strong className="text-emerald-400">{stats.activeDays}</strong></span>
                <span>Max Streak: <strong className="text-amber-400">{stats.maxStreak} Days</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1.5 min-w-[700px]">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.count} submissions`}
                        className={`w-3.5 h-3.5 rounded-xs transition-colors cursor-pointer ${getIntensityColor(day.count)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end text-[10px] text-slate-500 font-semibold gap-1.5 pt-1">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-xs bg-slate-800/60" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
              <span>More</span>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex border-b border-slate-800/80 px-6 pt-4 gap-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`pb-3 transition border-b-2 cursor-pointer ${
                  activeTab === 'recent'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Recent Submissions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('solutions')}
                className={`pb-3 transition border-b-2 cursor-pointer ${
                  activeTab === 'solutions'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Solutions ({stats.solutions})
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'recent' ? (
                recentSubmissions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 font-medium">
                    No submissions logged yet. Start solving problems!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSubmissions.map((sub, i) => {
                      const isAccepted = sub.status === 'ACCEPTED';
                      const isPending = sub.status === 'PENDING' || sub.status === 'RUNNING' || sub.status === 'QUEUED';

                      return (
                        <div
                          key={sub._id || i}
                          className="p-3.5 rounded-2xl bg-[#050914] border border-slate-800/80 flex items-center justify-between text-xs transition hover:border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`p-2 rounded-xl border ${
                                isAccepted
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : isPending
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              {isAccepted ? <FiCheck className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                            </span>
                            <div>
                              {sub.slug ? (
                                <Link
                                  to={`/problems/${sub.slug}`}
                                  className="font-bold text-white hover:text-emerald-400 transition"
                                >
                                  {sub.title}
                                </Link>
                              ) : (
                                <p className="font-bold text-white">{sub.title}</p>
                              )}
                              <p className="text-[10px] text-slate-400 font-medium">
                                <span className="uppercase font-mono">{sub.lang}</span> • {sub.runtime} • {sub.time}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                              isAccepted
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : isPending
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-400 text-center py-6">
                  {stats.solutions} Published Community Solutions available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveChanges}
            className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#0B101D] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <FiAlertCircle className="shrink-0" /> {editError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Bio / Headline</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Avatar URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">College</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#050914] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;