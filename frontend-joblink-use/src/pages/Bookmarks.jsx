import React from 'react';
import { FiStar, FiArrowRight, FiTrash2 } from 'react-icons/fi';

const Bookmarks = ({ isDarkMode, bookmarkedProblems = [], onRemoveBookmark, onSolve }) => {
  return (
    <div className="space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-black">Bookmarked Challenges</h1>
        <p className="text-slate-400 text-xs font-medium pt-1">
          Quickly access algorithm problems saved for review or practice.
        </p>
      </div>

      {bookmarkedProblems.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border space-y-3 ${
          isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <FiStar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-black text-slate-300">No bookmarked problems</h3>
          <p className="text-xs text-slate-500">
            Click the star icon on any problem in the Problem Set to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedProblems.map((prob) => (
            <div
              key={prob.id}
              className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${
                isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Acceptance: {prob.acceptance}</span>
                </div>
                <h3 className="text-sm font-black">{prob.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemoveBookmark(prob.id)}
                  title="Remove Bookmark"
                  className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition cursor-pointer"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSolve(prob.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <span>Solve</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;