import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  // Support either loginUser or login method from AuthContext
  const loginFn = auth?.loginUser || auth?.login;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.status === 200 || response.data?.success) {
        const token = response.data.accessToken || response.data.token;
        const user = response.data.user;

        // Persist token for Axios request interceptor and AuthContext reloads
        if (token) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('token', token);
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Update global React Auth context
        if (loginFn) {
          loginFn(user, token);
        }

        // Role-based navigation
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard/profile');
        }
      }
    } catch (err) {
      console.error('Login error response:', err.response?.data);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials.';

      // Automatically redirect unverified users to the OTP verification page
      if (
        errorMessage.toLowerCase().includes('email not verified') ||
        errorMessage.toLowerCase().includes('not verified')
      ) {
        setError('Email not verified. Redirecting to OTP verification...');
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: formData.email.trim().toLowerCase() } });
        }, 1200);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between p-4 sm:p-6 bg-[#030712] relative font-sans select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[400px] mx-auto my-auto p-5 sm:p-6 rounded-3xl bg-[#0B101D] border border-slate-800/80 shadow-2xl space-y-3">
        <div className="flex flex-col items-center text-center space-y-1">
          <Logo size="large" isDarkMode={true} />
          <h1 className="text-xl sm:text-2xl font-black text-white pt-1">
            Welcome Back
          </h1>
          <p className="text-[11px] font-medium text-slate-400">
            Sign in to continue your progress
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold flex items-center justify-center gap-2">
            <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full text-xs rounded-xl pl-9 pr-3 py-2 bg-[#050914] border border-slate-800 text-white font-medium focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[10px] font-extrabold text-emerald-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-xs rounded-xl pl-9 pr-9 py-2 bg-[#050914] border border-slate-800 text-white font-medium focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-md shadow-emerald-600/25 cursor-pointer mt-1 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* OAuth Social Buttons */}
        <div className="space-y-2 pt-0.5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 px-3 rounded-xl bg-white text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <FcGoogle className="w-4 h-4 shrink-0" />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="w-full py-2 px-3 rounded-xl bg-[#050914] hover:bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-800 transition cursor-pointer"
          >
            <FaGithub className="w-4 h-4 shrink-0" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-[11px] text-slate-400 font-semibold pt-0.5">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-500 font-extrabold hover:underline">
            Register
          </Link>
        </p>
      </div>

      <div className="h-2" />
    </div>
  );
};

export default Login;