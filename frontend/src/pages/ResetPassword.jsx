import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const { resetToken } = useParams();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword(resetToken, data.password);
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-100">Set New Password</h2>
        <p className="text-xs text-slate-400 mt-1">Enter your new secure password below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
          <input
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            placeholder="At least 6 characters"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};
