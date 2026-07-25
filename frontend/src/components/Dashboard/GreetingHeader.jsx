import React, { useState, useEffect } from 'react';
import { getRandomQuote } from '../../constants/quotes';
import { formatDatePretty, formatTimePretty } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

export const GreetingHeader = () => {
  const { user } = useAuth();
  const [quoteObj, setQuoteObj] = useState(getRandomQuote());
  const [currentTime, setCurrentTime] = useState(formatTimePretty());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTimePretty());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/60 dark:via-slate-900/80 dark:to-purple-950/40 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
            <span>{formatDatePretty(new Date())}</span>
            <span>•</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono">{currentTime}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 dark:from-indigo-400 dark:via-purple-400 dark:to-emerald-400">{user?.name || 'Habit Builder'}</span> 👋
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 italic max-w-2xl">
            "{quoteObj.quote}" — <span className="text-slate-500 dark:text-slate-400 not-italic font-semibold">{quoteObj.author}</span>
          </p>
        </div>

        <button
          onClick={() => setQuoteObj(getRandomQuote())}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all shadow-sm"
        >
          ✨ New Quote
        </button>
      </div>

      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
