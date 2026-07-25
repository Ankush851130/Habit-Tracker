import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-100">Forgot Password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your email address and we'll send you a password reset link.
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs">
            ✉️ Check your inbox for the reset link!
          </div>
          <Link to="/login" className="inline-block text-xs text-indigo-400 font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};
