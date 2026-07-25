import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/Common/GoogleSignInButton';
import toast from 'react-hot-toast';

export const Register = () => {
  const { register, handleSubmit } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 items-center justify-center text-2xl mb-3 shadow-glow">
          ⚡
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">Create Account</h2>
        <p className="text-xs text-slate-400 mt-1">Join the gamified habit tracking system</p>
      </div>

      {/* Google Sign Up Button */}
      <div className="mb-5">
        <GoogleSignInButton text="Sign up with Google" />
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/80" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-3 text-slate-400 font-semibold">Or register with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            {...register('name', { required: true })}
            placeholder="Alex Vance"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            {...register('email', { required: true })}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            placeholder="At least 6 characters"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold text-sm shadow-glow transition-all mt-2 cursor-pointer"
        >
          Create Free Account
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-indigo-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

