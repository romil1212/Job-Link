import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Layout & UI Components
import Sidebar from './components/Sidebar';
import DashboardNavbar from './components/DashboardNavbar';
import AIAssistantDrawer from './components/AIAssistantDrawer';

// Public & Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuthSuccess from './pages/OAuthSuccess';

// User Dashboard & Workspace Pages
import DashboardHome from './pages/DashboardHome';
import Problems from './pages/Problems';
import ProblemDetails from './pages/ProblemDetails';
import RealWorldTasks from './pages/RealWorldTasks';
import LearningPath from './pages/LearningPath';
import Bookmarks from './pages/Bookmarks';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import SubmissionHistory from './pages/SubmissionHistory';
import Progress from './pages/Progress';

// Admin Layout & Page Imports
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminUsers from './pages/admin/Users';
import AdminProblems from './pages/admin/Problems';
import AdminTestCases from './pages/admin/TestCases';
import AdminLanguages from './pages/admin/ProgrammingLanguages';
import AdminCompanies from './pages/admin/Companies';
import AdminRealWorldTasks from './pages/admin/RealWorldTasks';
import AdminDailyChallenges from './pages/admin/DailyChallenges';
import AdminSettings from './pages/admin/Settings';

// Fallback component for secondary placeholder views
const PlaceholderPage = ({ title, isDarkMode }) => (
  <div className="space-y-4 p-6">
    <h1 className="text-2xl font-black">{title}</h1>
    <div
      className={`p-8 rounded-3xl border text-center font-medium text-xs text-slate-400 ${
        isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {title} module content is active and operational.
    </div>
  </div>
);

// Fallbacks for remaining admin routes
const AdminTaskCategories = () => <PlaceholderPage title="Task Categories" isDarkMode={true} />;
const AdminAchievements = () => <PlaceholderPage title="Achievements" isDarkMode={true} />;
const AdminReports = () => <PlaceholderPage title="Reports & Moderation" isDarkMode={true} />;
const AdminAuditLogs = () => <PlaceholderPage title="Audit Security Logs" isDarkMode={true} />;

// Admin Protected Layout Component
const AdminLayout = ({ isDarkMode }) => {
  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('joblink_user') || localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Optional: Redirect non-admins back to dashboard if user data exists
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-100 font-sans overflow-hidden">
      <AdminSidebar isDarkMode={isDarkMode} />
      <main className="flex-1 min-w-0 h-full p-6 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

// User Dashboard Layout Component
const UserDashboardLayout = ({
  isDarkMode,
  toggleDarkMode,
  userXp,
  onOpenAiMentor,
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <DashboardNavbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          xp={userXp}
          onOpenAiMentor={onOpenAiMentor}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [userXp, setUserXp] = useState(() => {
    const saved = localStorage.getItem('joblink_user');
    return saved ? JSON.parse(saved).xp || 2450 : 2450;
  });

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [codeContext, setCodeContext] = useState({
    problemName: 'Quick Sort',
    language: 'Java',
    code: 'public class Main {\n    public static void main(String[] args) {\n        // Code here\n    }\n}',
  });

  const [bookmarkedProblems, setBookmarkedProblems] = useState(() => {
    const saved = localStorage.getItem('joblink_bookmarks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: '1. Two Sum',
            difficulty: 'Easy',
            acceptance: '52.4%',
            tags: ['Array', 'Hash Table'],
          },
        ];
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const updated = !prev;
      localStorage.setItem('isDarkMode', JSON.stringify(updated));
      return updated;
    });
  };

  const handleEarnXp = (amount) => {
    setUserXp((prev) => {
      const updated = prev + amount;
      const cached = localStorage.getItem('joblink_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.xp = updated;
        localStorage.setItem('joblink_user', JSON.stringify(parsed));
      }
      return updated;
    });
  };

  const handleToggleBookmark = (problem) => {
    setBookmarkedProblems((prev) => {
      const exists = prev.some((p) => (p.id || p._id) === (problem.id || problem._id));
      const next = exists
        ? prev.filter((p) => (p.id || p._id) !== (problem.id || problem._id))
        : [...prev, problem];
      localStorage.setItem('joblink_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div
        className={`min-h-screen font-sans transition-colors duration-200 ${
          isDarkMode ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <Routes>
          {/* Public & Authentication Routes */}
          <Route path="/" element={<Home isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/register" element={<Register isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/google-success" element={<OAuthSuccess />} />
          <Route path="/github-success" element={<OAuthSuccess />} />

          {/* Standalone Problem Solver Workspace */}
          <Route
            path="/problems/:slug"
            element={
              <ProblemDetails
                isDarkMode={isDarkMode}
                onEarnXp={handleEarnXp}
                setCodeContext={setCodeContext}
              />
            }
          />

          {/* User Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <UserDashboardLayout
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                xp={userXp}
                onOpenAiMentor={() => setAiDrawerOpen(true)}
              />
            }
          >
            <Route index element={<DashboardHome isDarkMode={isDarkMode} onEarnXp={handleEarnXp} />} />
            <Route
              path="problems"
              element={
                <Problems
                  isDarkMode={isDarkMode}
                  bookmarkedProblems={bookmarkedProblems}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />
            <Route
              path="problems/:slug"
              element={
                <ProblemDetails
                  isDarkMode={isDarkMode}
                  onEarnXp={handleEarnXp}
                  setCodeContext={setCodeContext}
                />
              }
            />
            <Route path="submissions" element={<SubmissionHistory isDarkMode={isDarkMode} />} />
            <Route path="real-world-tasks" element={<RealWorldTasks isDarkMode={isDarkMode} />} />
            <Route path="learning-path" element={<LearningPath isDarkMode={isDarkMode} />} />
            <Route
              path="bookmarks"
              element={
                <Bookmarks
                  isDarkMode={isDarkMode}
                  bookmarkedProblems={bookmarkedProblems}
                  onRemoveBookmark={(id) =>
                    setBookmarkedProblems((prev) => {
                      const next = prev.filter((p) => (p.id || p._id) !== id);
                      localStorage.setItem('joblink_bookmarks', JSON.stringify(next));
                      return next;
                    })
                  }
                />
              }
            />
            <Route path="achievements" element={<Achievements isDarkMode={isDarkMode} />} />
            <Route path="profile" element={<Profile isDarkMode={isDarkMode} />} />
            <Route path="roadmaps" element={<PlaceholderPage title="My Roadmaps" isDarkMode={isDarkMode} />} />
            <Route path="progress" element={<Progress isDarkMode={isDarkMode} />} />
            <Route path="recommended" element={<PlaceholderPage title="Recommended Problems" isDarkMode={isDarkMode} />} />
            <Route path="goals" element={<PlaceholderPage title="Upcoming Goals" isDarkMode={isDarkMode} />} />
            <Route path="activity" element={<PlaceholderPage title="Recent Activity" isDarkMode={isDarkMode} />} />
          </Route>

          {/* Direct Aliases for Top-level Navigation */}
          <Route
            path="/problems"
            element={
              <UserDashboardLayout
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                xp={userXp}
                onOpenAiMentor={() => setAiDrawerOpen(true)}
              >
                <Problems
                  isDarkMode={isDarkMode}
                  bookmarkedProblems={bookmarkedProblems}
                  onToggleBookmark={handleToggleBookmark}
                />
              </UserDashboardLayout>
            }
          />

          {/* Enterprise Admin Dashboard Layout */}
          <Route path="/admin" element={<AdminLayout isDarkMode={isDarkMode} />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="problems" element={<AdminProblems />} />
            <Route path="test-cases" element={<AdminTestCases />} />
            <Route path="languages" element={<AdminLanguages />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="task-categories" element={<AdminTaskCategories />} />
            <Route path="real-world-tasks" element={<AdminRealWorldTasks />} />
            <Route path="daily-challenges" element={<AdminDailyChallenges />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global AI Mentor Drawer */}
        <AIAssistantDrawer
          isOpen={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          codeContext={codeContext}
          isDarkMode={isDarkMode}
        />
      </div>
    </Router>
  );
}

export default App;