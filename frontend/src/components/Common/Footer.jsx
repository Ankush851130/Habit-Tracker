import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/60 py-6 px-8 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div>
          © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">HabitTracker SaaS</span>. Built with React 19 & Express.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};
