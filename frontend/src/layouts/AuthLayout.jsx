import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl relative z-10 my-4"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};
