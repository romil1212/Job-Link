import React from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDatabase,
  FiZap,
  FiArrowLeft,
  FiChevronDown
} from 'react-icons/fi';

const SubmissionResultView = ({
  result,
  onBackToDescription,
  submittedCode,
  language = 'java',
  isDarkMode = true
}) => {
  if (!result) return null;

  const isAccepted =
    result.verdict === 'ACCEPTED' ||
    result.status === 'ACCEPTED' ||
    result.status === 'Accepted';

  const runtime = result.runtime ?? 2;
  const memory = result.memory ?? 46.8;
  const totalCases = result.totalTestCases || result.totalCases || 65;
  const passedCases = isAccepted ? totalCases : (result.passedTestCases || 0);

  // Dynamic beat percent calculations
  const runtimeBeats = result.runtimeBeats ?? Math.max(10, Math.min(99.4, (100 - (runtime / 10) * 12)).toFixed(2));
  const memoryBeats = result.memoryBeats ?? Math.max(10, Math.min(95.2, (100 - (memory / 50) * 15)).toFixed(2));

  // Chart distribution buckets
  const runtimeBins = [15, 45, 90, 30, 20, 15, 10, 8, 25, 40, 12, 6, 4];

  return (
    <div className={`h-full overflow-y-auto p-5 space-y-6 select-none font-sans ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* Back button */}
      <button
        onClick={onBackToDescription}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> All Submissions
      </button>

      {/* Header status */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {isAccepted ? (
            <span className="text-xl font-black text-emerald-400">Accepted</span>
          ) : (
            <span className="text-xl font-black text-rose-500">
              {result.verdict || result.status || 'Wrong Answer'}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-400">
            {passedCases} / {totalCases} testcases passed
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Submitted just now • {language.toUpperCase()}
        </p>
      </div>

      {/* Runtime & Memory Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Runtime Card */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1">
            <FiClock className="w-3.5 h-3.5 text-emerald-400" /> Runtime
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black">{runtime} ms</span>
            <span className="text-xs font-bold text-emerald-400">
              Beats {runtimeBeats}%
            </span>
          </div>
        </div>

        {/* Memory Card */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1">
            <FiDatabase className="w-3.5 h-3.5 text-blue-400" /> Memory
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black">{memory} MB</span>
            <span className="text-xs font-bold text-emerald-400">
              Beats {memoryBeats}%
            </span>
          </div>
        </div>
      </div>

      {/* Runtime Distribution Graph */}
      <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-400">Runtime Distribution</span>
          <span className="text-[10px] text-emerald-400 font-semibold">You are here</span>
        </div>
        <div className="h-24 flex items-end gap-1.5 pt-4 px-1 border-b border-slate-800">
          {runtimeBins.map((height, i) => {
            const isUserBin = i === 2;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-t-xs transition-all ${
                    isUserBin
                      ? 'bg-blue-500 shadow-md shadow-blue-500/50 relative'
                      : isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  {isUserBin && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0ms</span>
          <span>10ms</span>
          <span>20ms</span>
          <span>30ms</span>
          <span>40ms+</span>
        </div>
      </div>

      {/* Code Viewer */}
      {submittedCode && (
        <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#050914] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 text-xs font-bold text-slate-400">
            <span>Submitted Code ({language})</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
            <code>{submittedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default SubmissionResultView;