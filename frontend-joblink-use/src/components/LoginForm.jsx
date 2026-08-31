import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import InputField from './InputField';
import SocialLogin from './SocialLogin';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Login successful:', formData);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: 'Invalid email or password credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={FiMail}
          autoComplete="email"
          required
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={FiLock}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              // Changed to text-violet-600 and focus:ring-violet-600
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-600 focus:ring-offset-0 transition"
            />
            <span className="text-slate-600 text-xs sm:text-sm">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            // Changed to text-violet-600 hover:text-violet-700
            className="text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 focus:outline-none focus:underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          // Changed background to violet-600 and updated shadow/ring colors
          className="w-full mt-2 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-md shadow-violet-600/20 hover:shadow-lg hover:shadow-violet-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/80 backdrop-blur-md px-3 text-slate-400 font-medium tracking-wider">
            OR
          </span>
        </div>
      </div>

      <SocialLogin />

      <p className="mt-6 text-center text-xs sm:text-sm text-slate-600">
        Don't have an account?{' '}
        <Link
          to="/register"
          // Changed to text-violet-600 hover:text-violet-700
          className="font-semibold text-violet-600 hover:text-violet-700 hover:underline focus:outline-none focus:underline transition-colors"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;