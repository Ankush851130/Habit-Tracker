import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/Common/GlassCard';
import {
  PomodoroTimer,
  MoodTracker,
  WaterTracker,
  DailyJournal,
} from '../components/Extra/ExtraToolsComponents';
import { FocusMusicPlayer } from '../components/Extra/FocusMusicPlayer';
import { extraService } from '../services/extraService';
import { FiAward } from 'react-icons/fi';

export const ExtraTools = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const lbData = await extraService.getLeaderboard();
        setLeaderboard(lbData.leaderboard || []);

        const extData = await extraService.getExtraData();
        setJournalEntries(extData.tracker?.journalEntries || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExtra();
  }, []);

  const handlePomodoroComplete = async (duration) => {
    await extraService.logPomodoro({ durationMinutes: duration });
  };

  const handleLogMood = async (mood) => {
    await extraService.logMood({ mood });
  };

  const handleLogWater = async (glasses) => {
    await extraService.logWater({ glasses });
  };

  const handleAddJournal = async (entry) => {
    const res = await extraService.addJournalEntry(entry);
    setJournalEntries(res.journalEntries || []);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Extra Productivity Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Focus music soundscapes, Pomodoro timer, mood tracker, hydration log & community leaderboard
        </p>
      </div>

      {/* Focus Music Player with Multiple Varieties */}
      <FocusMusicPlayer />

      {/* Pomodoro, Mood & Water Tracker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PomodoroTimer onCompleteSession={handlePomodoroComplete} />
        <MoodTracker onLogMood={handleLogMood} />
        <WaterTracker onUpdateWater={handleLogWater} />
      </div>

      {/* Journal & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journal Section */}
        <div className="space-y-6">
          <DailyJournal onAddEntry={handleAddJournal} />

          {/* Journal Entries History */}
          <GlassCard>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">
              Recent Journal Entries
            </h3>
            {journalEntries.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No journal entries written yet.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {journalEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      <span>{entry.title || 'Journal Entry'}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{entry.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Global Leaderboard */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="text-amber-500 dark:text-amber-400 text-xl" />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Community Leaderboard
            </h3>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user, rank) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      rank === 0
                        ? 'bg-amber-500 text-slate-950 font-black shadow-glow'
                        : rank === 1
                        ? 'bg-slate-300 text-slate-950 font-black'
                        : rank === 2
                        ? 'bg-amber-700 text-white font-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    #{rank + 1}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Level {user.level || 1} Builder
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                    {user.xp || 0} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

