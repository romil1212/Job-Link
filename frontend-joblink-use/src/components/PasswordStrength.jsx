import React from 'react';

const PasswordStrength = ({ password = '' }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const score = getStrength(password);
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Password Strength</span>
        <span className={score > 0 ? 'text-slate-200' : 'text-slate-500'}>
          {score > 0 ? labels[score - 1] : 'None'}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${
              index < score ? colors[score - 1] : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;