import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/Common/GlassCard';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <GlassCard className="text-center max-w-md py-12">
        <div className="text-6xl font-black text-indigo-500 mb-2">404</div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow inline-block transition-all"
        >
          Back to Dashboard
        </Link>
      </GlassCard>
    </div>
  );
};
