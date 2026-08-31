import React from 'react';
import { Link } from 'react-router-dom';
import { FiCode } from 'react-icons/fi';

const Logo = ({ size = 'medium', isDarkMode = true, to = '/' }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const containerDimensions = isLarge 
    ? 'w-11 h-11 rounded-2xl' 
    : isSmall 
    ? 'w-8 h-8 rounded-xl' 
    : 'w-9 h-9 rounded-2xl';

  const iconDimensions = isLarge 
    ? 'w-6 h-6' 
    : isSmall 
    ? 'w-4 h-4' 
    : 'w-5 h-5';

  const textDimensions = isLarge 
    ? 'text-2xl sm:text-3xl' 
    : isSmall 
    ? 'text-lg' 
    : 'text-xl';

  return (
    <Link to={to} className="flex items-center gap-3 select-none group">
      {/* Brand Icon */}
      <div
        className={`${containerDimensions} bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0`}
      >
        <FiCode className={iconDimensions} />
      </div>

      {/* Brand Name */}
      <span
        className={`font-black tracking-tight transition-colors duration-300 ${textDimensions} ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}
      >
        Job<span className="text-emerald-500">Link</span>
      </span>
    </Link>
  );
};

export default Logo;