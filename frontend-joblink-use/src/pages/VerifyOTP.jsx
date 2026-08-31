import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import OTPInput from '../components/OTPInput';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  // Retrieve email and flow type from Router State, sessionStorage, or fallback
  const email =
    location.state?.email ||
    sessionStorage.getItem('userEmail') ||
    sessionStorage.getItem('resetEmail') ||
    '';

  const isPasswordReset =
    location.state?.isPasswordReset || !!sessionStorage.getItem('resetEmail');

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isSubmittingRef = useRef(false);

  // Redirect back if no target email is found
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Resend OTP Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP Handler
  const handleVerify = async (otpValue) => {
    const codeToVerify =
      typeof otpValue === 'string' ? otpValue.trim() : String(otp).trim();

    if (isSubmittingRef.current || loading) return;

    setError('');
    setSuccess('');

    if (!email) {
      setError('Email address not found. Please register or start over.');
      return;
    }

    if (!codeToVerify || codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      // POST endpoint for email/OTP verification
      const endpoint = isPasswordReset
        ? '/auth/verify-reset-otp'
        : '/auth/verify-email';

      const response = await API.post(endpoint, {
        email: email.trim().toLowerCase(),
        otp: codeToVerify,
      });

      setSuccess(
        response.data?.message || 'Verification completed successfully!'
      );

      // Clean up temporary session storage items
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('resetEmail');

      const token = response.data?.accessToken || response.data?.token;
      const user = response.data?.user;

      if (isPasswordReset) {
        // Forward to password reset page with token/code
        setTimeout(() => {
          navigate('/reset-password', {
            state: {
              email: email.trim().toLowerCase(),
              resetToken: token || codeToVerify,
            },
          });
        }, 1200);
      } else if (token && user) {
        // Automatically save session to AuthContext and localStorage
        if (loginUser) {
          loginUser(user, token);
        }

        setTimeout(() => {
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }, 1200);
      } else {
        // Fallback to login page if no session returned
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Invalid verification code. Please try again.';

      setError(message);
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResend = async () => {
    if (timer > 0 || loading) return;

    if (!email) {
      setError('Email address not found. Please register again.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = isPasswordReset
        ? '/auth/forgot-password'
        : '/auth/resend-otp';

      const response = await API.post(endpoint, {
        email: email.trim().toLowerCase(),
      });

      setOtp('');
      setTimer(30);
      setSuccess(
        response.data?.message || 'A new security code has been sent to your email.'
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to resend OTP. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0B101D] border border-slate-800/80 shadow-2xl space-y-6 text-center">
        
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Logo size="large" isDarkMode={true} />
        </div>

        {/* Header Information */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight">
            Verify Security Code
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Enter the 6-digit OTP code sent to{' '}
            <span className="text-emerald-400 font-bold break-all">
              {email || 'your registered email'}
            </span>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-2">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* OTP Input Component */}
        <div className="flex justify-center py-2">
          <OTPInput
            length={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError('');
            }}
            onComplete={(val) => handleVerify(val)}
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => handleVerify(otp)}
          disabled={loading || otp.length !== 6}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-lg shadow-emerald-600/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            'Verify & Continue'
          )}
        </button>

        {/* Resend & Back Navigation */}
        <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-800/80">
          <button
            type="button"
            disabled={timer > 0 || loading}
            onClick={handleResend}
            className={`transition ${
              timer > 0 || loading
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-emerald-400 hover:underline cursor-pointer'
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </button>

          <Link
            to="/login"
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;