import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import PasswordStrength from '../components/PasswordStrength';
import API from '../api/axios';
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Extracts token from URL route: /reset-password/:token

  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form Validation Checks
    if (!pass || !confirmPass) {
      setError('Please fill in both password fields.');
      return;
    }

    if (pass !== confirmPass) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    if (pass.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Connects directly to Express Node.js backend: POST /api/auth/reset-password/:token
      const response = await API.post(`/auth/reset-password/${token}`, {
        password: pass,
      });

      if (response.status === 200) {
        setSuccess('Password updated successfully! Redirecting to login...');
        
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid or expired reset token. Please request a new link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0B101D] border border-slate-800/80 shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="flex justify-center">
          <Logo size="large" />
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black">Set New Password</h2>
          <p className="text-xs text-slate-400 font-medium">
            Choose a robust new password for your JobLink account.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full bg-[#050914] border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition cursor-pointer"
              >
                {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            <PasswordStrength password={pass} />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Confirm New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full bg-[#050914] border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition cursor-pointer"
              >
                {showConfirmPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-lg shadow-emerald-600/25 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;