import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import API from '../api/axios';
import { FiMail, FiArrowLeft, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send reset link. Please verify your email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] text-white p-4 sm:p-6 font-sans relative select-none">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Single Card Container */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0B101D] border border-slate-800/80 shadow-2xl space-y-6 text-center">
        
        {/* Brand Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Logo size="large" isDarkMode={true} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">
              {isSubmitted ? 'Check Your Inbox' : 'Forgot Password?'}
            </h2>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {isSubmitted ? (
                <>
                  We sent a password reset link to{' '}
                  <span className="font-bold text-emerald-400 break-all">{email}</span>
                </>
              ) : (
                'Enter your email address to receive a secure password reset link.'
              )}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {!isSubmitted ? (
          /* Step 1: Email Submission Form */
          <form onSubmit={handleSubmit} className="space-y-5 text-left pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl pl-10 pr-4 py-3 bg-[#050914] border border-slate-800/80 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Sent Confirmation State */
          <div className="space-y-5 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-8 h-8" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Click the link in the email to set a new password. If you don't see it, check your spam folder.
            </p>

            <button
              type="button"
              onClick={handleTryAgain}
              className="w-full py-2.5 text-xs font-bold rounded-xl border border-slate-800 bg-[#050914] text-slate-400 hover:text-white transition cursor-pointer hover:bg-slate-900"
            >
              Didn't get the email? Try again
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center text-xs">
          <Link
            to="/login"
            className="text-slate-400 hover:text-white font-bold flex items-center gap-1.5 transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;