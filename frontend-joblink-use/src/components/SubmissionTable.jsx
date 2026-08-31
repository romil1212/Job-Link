import React from 'react';
import { Link } from 'react-router-dom';

const SubmissionTable = ({ submissions = [], loading = false, isDarkMode = true }) => {
  // Format verdict badge with appropriate styling
  const getStatusBadge = (status, verdict) => {
    const raw = (verdict || status || 'PENDING').toUpperCase();

    if (raw === 'ACCEPTED') {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
          Accepted
        </span>
      );
    }

    if (raw.includes('TIME_LIMIT')) {
      return (
        <span className="px-3 py-1 rounded-lg text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20">
          Time Limit Exceeded
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-lg text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20">
        {raw.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div
        className={`w-full p-12 rounded-3xl border text-center text-xs font-mono animate-pulse ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
        }`}
      >
        Loading submission records...
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div
        className={`w-full p-12 rounded-3xl border text-center text-xs font-medium ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
        }`}
      >
        No submissions found.
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border overflow-hidden ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-base">
          <thead>
            <tr
              className={`border-b text-xs font-bold text-slate-400 uppercase ${
                isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <th className="py-4 px-6">Problem</th>
              <th className="py-4 px-6">Language</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Runtime</th>
              <th className="py-4 px-6">Memory</th>
              <th className="py-4 px-6 text-right">Submitted</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {submissions.map((sub, i) => {
              // Extract fields accommodating both backend schema and dummy objects
              const problemTitle = sub.problemId?.title || sub.problemTitle || sub.problem || 'Coding Problem';
              const problemSlug = sub.problemId?.slug || sub.problemId?._id || sub.problemSlug || sub.problemId;
              const languageName = sub.language || sub.lang || 'Java';
              const runtimeVal = sub.runtime !== undefined ? (typeof sub.runtime === 'number' ? `${sub.runtime} ms` : sub.runtime) : '—';
              const memoryVal = sub.memory !== undefined ? (typeof sub.memory === 'number' ? `${sub.memory} MB` : sub.memory) : '—';
              const submittedTime = sub.createdAt
                ? new Date(sub.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : sub.time || 'Recently';

              return (
                <tr
                  key={sub._id || i}
                  className={`transition ${
                    isDarkMode ? 'hover:bg-slate-800/40 text-slate-300' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {/* Problem Title & Navigation Link */}
                  <td className={`py-4 px-6 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {problemSlug ? (
                      <Link
                        to={`/problems/${problemSlug}`}
                        className="hover:text-emerald-500 hover:underline transition"
                      >
                        {problemTitle}
                      </Link>
                    ) : (
                      problemTitle
                    )}
                  </td>

                  {/* Language */}
                  <td className="py-4 px-6 text-slate-400 font-mono uppercase text-[11px]">
                    {languageName}
                  </td>

                  {/* Status / Verdict */}
                  <td className="py-4 px-6">
                    {getStatusBadge(sub.status, sub.verdict)}
                  </td>

                  {/* Runtime */}
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {runtimeVal}
                  </td>

                  {/* Memory */}
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                    {memoryVal}
                  </td>

                  {/* Submitted Date */}
                  <td className="py-4 px-6 text-slate-500 text-right text-[11px]">
                    {submittedTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;