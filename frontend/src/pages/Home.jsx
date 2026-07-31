import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiZap,
  FiAward,
  FiBarChart2,
  FiArrowRight,
  FiClock,
  FiMusic,
  FiLayers,
  FiCalendar,
  FiShield,
  FiStar,
  FiPlay,
  FiBook,
} from 'react-icons/fi';

export const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('routines');
  const [demoChecked, setDemoChecked] = useState({ 1: true, 2: false, 3: true });

  const toggleDemoHabit = (id) => {
    setDemoChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Hero Ambient Glowing Orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-glow group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="font-black text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            HabitTracker
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-white transition-colors">
            Live Preview
          </a>
          <a href="#soundscapes" className="hover:text-white transition-colors">
            Focus Soundscapes
          </a>
          <a href="#gamification" className="hover:text-white transition-colors">
            Gamification
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-extrabold text-xs text-white shadow-glow transition-all transform active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-extrabold shadow-sm">
            ✨ Premium Gamified Habit Workspace & Soundscapes
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Build Unstoppable Habits with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              Notion + Linear + Gamified Precision
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            Track daily streaks, earn XP levels, listen to soothing nature soundscapes, and visualize 365-day consistency in a gorgeous glassmorphic workspace built for high achievers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 font-black text-sm text-white shadow-glow flex items-center justify-center gap-3 transition-all transform active:scale-95"
            >
              🚀 Start Building Habits Free <FiArrowRight className="text-base" />
            </Link>

            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 font-bold text-sm text-slate-200 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              ⚡ Quick Demo Login
            </button>
          </div>
        </motion.div>
      </section>

      {/* Interactive App Workspace Showcase Preview */}
      <section id="preview" className="max-w-6xl mx-auto px-6 py-8 relative z-10 w-full">
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-2xl">
          {/* Browser Top Window Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-500 ml-2">habit-tracker.app/workspace</span>
            </div>

            {/* Showcase Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('routines')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'routines'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎯 Routines
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📅 365 Calendar
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'music'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌿 Focus Soundscapes
              </button>
              <button
                onClick={() => setActiveTab('gamification')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'gamification'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏆 Level & XP
              </button>
            </div>
          </div>

          {/* Interactive Mockup Body */}
          <div className="min-h-[320px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* Tab 1: Routines */}
              {activeTab === 'routines' && (
                <motion.div
                  key="routines"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                    <span>Interactive Demo: Click boxes below to test habit completion</span>
                    <span className="text-emerald-400">+15 XP per habit</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 1, title: 'Morning Meditation & Breathing', category: 'Mindset', emoji: '🧘', streak: 14 },
                      { id: 2, title: 'Code 1 Hour of React & Node', category: 'Coding', emoji: '💻', streak: 28 },
                      { id: 3, title: 'Drink 8 Glasses of Water', category: 'Health', emoji: '💧', streak: 7 },
                    ].map((item) => {
                      const isDone = demoChecked[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleDemoHabit(item.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isDone
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-indigo-500/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.emoji}</span>
                              <div>
                                <h4 className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : ''}`}>
                                  {item.title}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-semibold mt-1 inline-block">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              🔥 {item.streak} Day Streak
                            </span>
                            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${isDone ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>
                              {isDone ? 'Done ✓' : 'Mark Done'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Tab 2: 365 Calendar */}
              {activeTab === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 text-center py-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                    <span>12-Month Calendar Overview Preview</span>
                    <span className="text-indigo-400 font-bold">Jan 2026 ➔ Dec 2026</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['January 2026', 'February 2026', 'March 2026', 'April 2026'].map((mName, idx) => (
                      <div key={mName} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
                        <div className="text-xs font-black text-slate-200 mb-2 border-b border-slate-800 pb-1">
                          {mName}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-[8px] text-center font-mono">
                          {Array.from({ length: 28 }).map((_, dIdx) => (
                            <div
                              key={dIdx}
                              className={`h-4 rounded-sm flex items-center justify-center font-bold ${
                                dIdx % 3 === 0
                                  ? 'bg-emerald-500 text-white'
                                  : dIdx % 5 === 0
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {dIdx + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Nature Soundscapes */}
              {activeTab === 'music' && (
                <motion.div
                  key="music"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border border-emerald-800/40 text-left space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                        🌲
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                          Nature Soundscape
                        </span>
                        <h4 className="font-extrabold text-base text-white">Morning Forest & Songbirds</h4>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow flex items-center gap-2"
                    >
                      <FiPlay /> Listen Free
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 h-6">
                    {[0.5, 0.9, 0.4, 0.8, 0.6, 1.0, 0.7, 0.4, 0.9, 0.5, 0.8].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-emerald-400/80 animate-pulse"
                        style={{ height: `${h * 100}%` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Gamification XP */}
              {activeTab === 'gamification' && (
                <motion.div
                  key="gamification"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-400 font-bold uppercase">Level Progress</span>
                      <h4 className="text-2xl font-black text-white">Level 5 Master Builder</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-amber-400">1,250 XP</span>
                    </div>
                  </div>

                  {/* XP Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 w-3/4" />
                  </div>

                  {/* Badges preview */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-slate-400 font-bold">Unlocked Badges:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                      🔥 7-Day Streak
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
                      ⚡ Focus Master
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                      🏆 Habit Titan
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6-Grid Feature Showcase */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
            Comprehensive Productivity Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Everything You Need for Peak Performance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-4">
              <FiZap />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Streak Fire System</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain daily streak flames, record personal bests, and receive streak recovery alerts.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4">
              <FiAward />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Gamification & XP Levels</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn XP for every habit completed, level up rank, and unlock exclusive achievement badges.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-4">
              <FiCalendar />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">365-Day Consistency View</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize 12-month calendar cards and activity matrix to spot routine trends easily.
            </p>
          </div>

          <div id="soundscapes" className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4">
              <FiMusic />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Nature & Forest Soundscapes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Listen to 20+ soothing nature soundscapes (birdsong, heavy rain, streams, binaural beats).
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mb-4">
              <FiClock />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Flexible Pomodoro Timer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Focus sessions with +1m/+5m time adjusters, 15m/25m/45m/60m presets, and break tabs.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mb-4">
              <FiBook />
            </div>
            <h3 className="font-bold text-lg text-slate-100 mb-2">Journal & Wellness Log</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track daily hydration, log mood states, and write reflection journals to stay balanced.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full relative z-10">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">100% Free</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Open Habit Workspace</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">20+ Tracks</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Nature & Focus Soundscapes</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-400">365 Days</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Consistency Calendar</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">10+ Categories</div>
            <div className="text-xs font-bold text-slate-400 mt-1">Tailored Routine Themes</div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="p-10 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Build Your Best Habits?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Join thousands of high achievers building consistent daily routines today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-sm shadow-xl transition-all"
            >
              Get Started Free Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-extrabold text-sm border border-white/20 transition-all"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-900 relative z-10">
        HabitTracker SaaS © {new Date().getFullYear()} — Built for high achievers.
      </footer>
    </div>
  );
};
