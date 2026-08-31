import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const AvatarSelector = ({ isOpen, onClose, selectedAvatar, onSelect }) => {
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-3xl bg-[#0B101D] border border-slate-800 text-white space-y-5 relative shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
            Choose Default Avatar
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {defaultAvatars.map((url, idx) => {
            const isSelected = selectedAvatar === url;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelect(url);
                  onClose();
                }}
                className={`relative group rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-emerald-500 scale-105' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={url} alt={`Avatar ${idx}`} className="w-full h-24 object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-white font-black" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;