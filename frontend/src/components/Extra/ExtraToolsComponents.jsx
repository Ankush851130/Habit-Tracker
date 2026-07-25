import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiSmile, FiMeh, FiFrown, FiPlus, FiBook } from 'react-icons/fi';
import { GlassCard } from '../Common/GlassCard';
import toast from 'react-hot-toast';

// 1. Pomodoro Timer
export const PomodoroTimer = ({ onCompleteSession }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          toast.success('🎉 Pomodoro Session Completed! Great Focus!');
          if (onCompleteSession) onCompleteSession(25);
          setMinutes(25);
          setSeconds(0);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, onCompleteSession]);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <GlassCard className="text-center flex flex-col items-center">
      <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider mb-2">
        ⏱️ Pomodoro Focus Timer
      </span>

      <div className="my-4 text-5xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
            isActive
              ? 'bg-amber-500 text-white shadow-glow'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow'
          }`}
        >
          {isActive ? <FiPause /> : <FiPlay />}
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <FiRotateCcw />
        </button>
      </div>
    </GlassCard>
  );
};

// 2. Mood Tracker
export const MoodTracker = ({ onLogMood }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { label: 'excellent', emoji: '🤩' },
    { label: 'good', emoji: '😊' },
    { label: 'neutral', emoji: '😐' },
    { label: 'bad', emoji: '😔' },
    { label: 'terrible', emoji: '😫' },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    if (onLogMood) onLogMood(mood);
    toast.success(`Logged mood as ${mood}! 💭`);
  };

  return (
    <GlassCard className="text-center">
      <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider mb-2 block">
        🎭 Daily Mood Tracker
      </span>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">How are you feeling today?</p>

      <div className="flex items-center justify-center gap-3">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => handleMoodSelect(m.label)}
            className={`p-3 rounded-2xl border transition-all text-2xl ${
              selectedMood === m.label
                ? 'bg-purple-600/30 border-purple-400 scale-110 shadow-glow'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

// 3. Water Intake Tracker
export const WaterTracker = ({ glasses = 0, onUpdateWater }) => {
  const [count, setCount] = useState(glasses);

  const addGlass = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (onUpdateWater) onUpdateWater(newCount);
    toast.success('💧 Glass of water logged!');
  };

  return (
    <GlassCard className="text-center">
      <span className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-400 tracking-wider mb-2 block">
        💧 Water Intake Tracker
      </span>
      <div className="my-3 flex items-center justify-center gap-2">
        <span className="text-4xl font-black text-slate-900 dark:text-slate-100">{count}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">/ 8 glasses</span>
      </div>

      <button
        onClick={addGlass}
        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow transition-all"
      >
        <FiPlus /> Drink Glass (+1)
      </button>
    </GlassCard>
  );
};

// 4. Daily Journal
export const DailyJournal = ({ onAddEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (onAddEntry) onAddEntry({ title, content });
    setTitle('');
    setContent('');
    toast.success('Journal entry saved! 📖');
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <FiBook className="text-indigo-600 dark:text-indigo-400 text-lg" />
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Daily Reflection Journal</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Entry Title (e.g. Daily Win)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none text-xs"
        />
        <textarea
          rows="3"
          placeholder="Write down your thoughts, reflections, or gratitude..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none text-xs resize-none"
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
        >
          Save Entry
        </button>
      </form>
    </GlassCard>
  );
};
