import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/Common/GoogleSignInButton';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const Login = () => {
  const { register, handleSubmit, setValue } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const cleanData = {
        email: data.email ? data.email.trim().toLowerCase() : '',
        password: data.password || '',
      };
      await login(cleanData);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    toast.success(`Demo credentials filled for ${email}! Click Sign In.`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 items-center justify-center text-2xl mb-3 shadow-glow">
          ⚡
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to your habit tracker workspace</p>
      </div>

      {/* Google Sign In Button */}
      <div>
        <GoogleSignInButton text="Sign in with Google" />
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/80" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-slate-900 px-3 text-slate-400 font-semibold">Or sign in with email</span>
        </div>
      </div>

      {/* Quick Demo Login Preset Buttons */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
          <span>⚡ Quick 1-Click Fill Credentials</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('ankushvivo2020@gmail.com', '12345678')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-[11px] font-bold text-indigo-300 transition-all text-center truncate cursor-pointer"
          >
            Ankush Sharma
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('demo@example.com', 'password123')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 transition-all text-center truncate cursor-pointer"
          >
            Demo User
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="ankushvivo2020@gmail.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <FiMail className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-[11px] text-indigo-400 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: true })}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <FiLock className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-glow transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 font-bold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
};
