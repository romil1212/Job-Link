import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step A: Send OTP to candidate's email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await API.post('/auth/send-otp', { email: formData.email });
      setOtpStep(true);
      setInfo(`A 6-digit code has been sent to ${formData.email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step B: Verify OTP & complete registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Check OTP
      await API.post('/auth/verify-otp', { email: formData.email, otp });

      // 2. Finalize Account Creation
      const res = await API.post('/auth/register', formData);
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#111827]/90 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {otpStep ? 'Verify Code' : 'Create Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {otpStep
              ? 'Enter the 6-digit confirmation code sent to your email'
              : 'Register to start verifying resumes with automated scoring'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm rounded-xl">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-6 p-3.5 bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs sm:text-sm rounded-xl">
            {info}
          </div>
        )}

        {!otpStep ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="Romil Thummar"
                className="w-full px-4 py-2.5 bg-[#1a2333] border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-[#1a2333] border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#1a2333] border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#1a2333] border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
            >
              {loading ? 'Sending Code...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength="6"
                placeholder="123456"
                className="w-full tracking-widest text-center text-xl font-bold py-3 bg-[#1a2333] border border-slate-700/80 rounded-xl text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
            >
              {loading ? 'Verifying...' : 'Verify Code & Register'}
            </button>

            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition"
            >
              &larr; Change Email or Details
            </button>
          </form>
        )}

        <p className="text-center text-xs sm:text-sm text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-sky-400 font-bold hover:text-sky-300 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;