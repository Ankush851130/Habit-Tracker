import React, { useState, useEffect } from 'react';
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiSmile,
  FiMeh,
  FiFrown,
  FiPlus,
  FiMinus,
  FiBook,
  FiClock,
} from 'react-icons/fi';
import { GlassCard } from '../Common/GlassCard';
import toast from 'react-hot-toast';

// 1. Pomodoro Focus Timer with Increase/Decrease Duration Controls
export const PomodoroTimer = ({ onCompleteSession }) => {
  const [targetMinutes, setTargetMinutes] = useState(25); // Default 25 min
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'

  // Change duration delta (+1m, +5m, -1m, -5m)
  const changeDurationDelta = (delta) => {
    if (isActive) {
      const newMins = Math.max(1, Math.min(180, minutes + delta));
      setMinutes(newMins);
    } else {
      const newMins = Math.max(1, Math.min(180, targetMinutes + delta));
      setTargetMinutes(newMins);
      setMinutes(newMins);
      setSeconds(0);
    }
  };

  // Select quick preset or session mode
  const handleSelectPreset = (mins, type = 'focus') => {
    setIsActive(false);
    setSessionType(type);
    setTargetMinutes(mins);
    setMinutes(mins);
    setSeconds(0);
  };

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
          toast.success(
            sessionType === 'focus'
              ? '🎉 Focus Session Completed! Great job!'
              : '☕ Break Completed! Ready for next focus session!'
          );
          if (onCompleteSession && sessionType === 'focus') {
            onCompleteSession(targetMinutes);
          }
          setMinutes(targetMinutes);
          setSeconds(0);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, sessionType, targetMinutes, onCompleteSession]);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(targetMinutes);
    setSeconds(0);
  };

  return (
    <GlassCard className="text-center flex flex-col items-center justify-between space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
        <FiClock className="text-indigo-500" />
        <span>Pomodoro Focus Timer</span>
      </div>

      {/* Session Mode Selector Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] w-full justify-center">
        <button
          onClick={() => handleSelectPreset(25, 'focus')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            sessionType === 'focus'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          🎯 Focus
        </button>
        <button
          onClick={() => handleSelectPreset(5, 'shortBreak')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            sessionType === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          ☕ Break (5m)
        </button>
        <button
          onClick={() => handleSelectPreset(15, 'longBreak')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            sessionType === 'longBreak'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          🌴 Long (15m)
        </button>
      </div>

      {/* Main Digital Clock Display with Increase & Decrease Controls */}
      <div className="my-1 flex items-center justify-center gap-3 w-full">
        {/* Decrease Controls */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => changeDurationDelta(-5)}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            title="Decrease 5 minutes"
          >
            -5m
          </button>
          <button
            onClick={() => changeDurationDelta(-1)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
            title="Decrease 1 minute"
          >
            <FiMinus className="text-xs" />
          </button>
        </div>

        {/* Big Digital Time Display */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 text-indigo-400 dark:bg-slate-950 dark:text-indigo-400 font-mono font-black text-4xl sm:text-5xl tracking-widest border border-indigo-500/30 shadow-inner">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Increase Controls */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => changeDurationDelta(+5)}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            title="Increase 5 minutes"
          >
            +5m
          </button>
          <button
            onClick={() => changeDurationDelta(+1)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shadow-sm"
            title="Increase 1 minute"
          >
            <FiPlus className="text-xs" />
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex items-center justify-center gap-1.5 my-1">
        <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
        {[15, 25, 45, 60].map((mins) => (
          <button
            key={mins}
            onClick={() => handleSelectPreset(mins, 'focus')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              targetMinutes === mins && sessionType === 'focus'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {mins}m{mins === 25 ? ' (Default)' : ''}
          </button>
        ))}
      </div>

      {/* Play / Pause & Reset Controls */}
      <div className="flex items-center gap-3 w-full pt-1">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {isActive ? <FiPause className="text-base" /> : <FiPlay className="text-base" />}
          <span>{isActive ? 'Pause Timer' : 'Start Focus'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
          title="Reset Timer"
        >
          <FiRotateCcw className="text-base" />
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
