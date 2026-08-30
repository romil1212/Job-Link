import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import VerificationCard from '../components/VerificationCard';

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchResume = async () => {
    try {
      const res = await API.get('/resumes/my-resume');
      setResume(res.data.data);
    } catch (err) {
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">Loading dashboard telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#111827] via-[#161f32] to-[#0f172a] rounded-3xl p-8 sm:p-10 mb-10 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Live Verification Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Automated parsing telemetry, structure evaluation, and completeness analytics for your active resume.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {resume ? 'Upload New Resume' : 'Upload Resume'}
          </Link>
        </div>
      </div>

      {!resume ? (
        <div className="bg-[#111827]/80 rounded-3xl border border-dashed border-slate-800 p-12 text-center shadow-xl">
          <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">No active resume uploaded</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1 mb-6">
            Upload your resume in PDF or Word (.docx) format to get instantaneous automated scoring and breakdown.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-md"
          >
            Upload Document &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metric Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111827]/90 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">Target File</span>
                  <h3 className="text-base font-bold text-slate-100 break-words mt-0.5">{resume.fileName}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                    resume.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {resume.verificationStatus}
                </span>
              </div>

              <div className="bg-[#1a2333] border border-slate-800 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Verification Score</span>
                  <span className="text-3xl font-black text-white">{resume.verificationScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      resume.verificationScore >= 70
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-500'
                        : 'bg-gradient-to-r from-amber-400 to-rose-500'
                    }`}
                    style={{ width: `${resume.verificationScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-medium">
                  <span>Threshold: 70%</span>
                  <span>{resume.verificationScore >= 70 ? 'Passed criteria' : 'Needs attention'}</span>
                </div>
              </div>

              <Link
                to={`/resume/${resume._id}`}
                className="w-full py-3 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                Inspect Full Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column: Checklist & Remarks */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#111827]/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Detected Content Checklist</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Automated pattern matches against key resume criteria</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                  6 Core Checks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                <VerificationCard
                  label="Candidate Name"
                  isFound={resume.verificationDetails.nameFound}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                <VerificationCard
                  label="Email Address"
                  isFound={resume.verificationDetails.emailFound}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <VerificationCard
                  label="Phone Number"
                  isFound={resume.verificationDetails.phoneFound}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />
                <VerificationCard
                  label="Education & Academics"
                  isFound={resume.verificationDetails.educationFound}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  }
                />
                <VerificationCard
                  label="Technical Skills"
                  isFound={resume.verificationDetails.skillsFound}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  }
                />
                <VerificationCard
                  label="Experience / Projects"
                  isFound={resume.verificationDetails.experienceFound}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              </div>

              {/* Remarks Panel */}
              <div className="bg-[#1a2333] border border-slate-800 rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  System Diagnostic Remarks
                </h3>
                <div className="space-y-2">
                  {resume.verificationRemarks.map((remark, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="text-sky-400 mt-0.5">•</span>
                      <span>{remark}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;