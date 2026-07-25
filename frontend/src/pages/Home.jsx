import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiZap, FiAward, FiBarChart2, FiArrowRight } from 'react-icons/fi';

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Hero Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-glow">
            ⚡
          </div>
          <span className="font-extrabold text-xl tracking-tight">HabitTracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white shadow-glow transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-6">
            ⚡ Premium Gamified Habit SaaS
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
            Build Unstoppable Habits with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              Notion + Linear + Stripe Precision
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Track streaks, earn XP, unlock achievements, and visualize habit heatmaps in a gorgeous glassmorphic workspace designed for peak performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 font-extrabold text-base text-white shadow-glow flex items-center justify-center gap-3 transition-all"
            >
              Start Building Habits <FiArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-4">
              <FiZap />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Streak Fire System</h3>
            <p className="text-xs text-slate-400">
              Keep your streak burning with animated flames and smart recovery notifications.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4">
              <FiAward />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Gamification & XP</h3>
            <p className="text-xs text-slate-400">
              Earn XP for every habit completed, level up rank, and unlock exclusive achievement badges.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4">
              <FiBarChart2 />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">GitHub Style Heatmap</h3>
            <p className="text-xs text-slate-400">
              Visualize 365-day habit matrix, category pie charts, and monthly completion trends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-900">
        HabitTracker SaaS © {new Date().getFullYear()} — Built for high achievers.
      </footer>
    </div>
  );
};
