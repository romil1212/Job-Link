import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const SocialLogin = ({ isDarkMode }) => {
  const navigate = useNavigate();

  // Handle Google Login redirect
  const handleGoogleLogin = () => {
    // For production OAuth redirect:
    // window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';

    // Mock navigation to dashboard:
    navigate('/dashboard');
  };

  // Handle GitHub Login redirect
  const handleGithubLogin = () => {
    // For production OAuth redirect:
    // window.location.href = 'https://github.com/login/oauth/authorize?...';

    // Mock navigation to dashboard:
    navigate('/dashboard');
  };

  return (
    <div className="space-y-3 w-full">
      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 border border-slate-200 hover:bg-slate-50 transition shadow-sm cursor-pointer"
      >
        <FcGoogle className="w-4 h-4 shrink-0" />
        <span>Continue with Google</span>
      </button>

      {/* GitHub Login Button */}
      <button
        type="button"
        onClick={handleGithubLogin}
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 border transition cursor-pointer ${
          isDarkMode
            ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
        }`}
      >
        <FaGithub className="w-4 h-4 shrink-0" />
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
};

export default SocialLogin;