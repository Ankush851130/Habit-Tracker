import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Animated Ambient Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
        style={{ animationDelay: '2s' }}
      />

      {/* Top Header Logo Link Back to Landing */}
      <header className="w-full max-w-md flex items-center justify-between py-2 relative z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-glow group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="font-black text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            HabitTracker
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Glass Panel Auth Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative z-10 my-6 backdrop-blur-2xl bg-slate-900/80"
      >
        <Outlet />
      </motion.div>

      {/* Auth Footer */}
      <footer className="text-center py-4 text-xs text-slate-500 relative z-20">
        HabitTracker © {new Date().getFullYear()} — Built for consistency & growth.
      </footer>
    </div>
  );
};
