import React, { useState } from 'react';
import { FiCheck, FiX, FiFastForward, FiMoreVertical, FiEdit, FiTrash2, FiArchive } from 'react-icons/fi';
import { GlassCard } from '../Common/GlassCard';
import { StreakFire } from '../Common/StreakFire';

export const HabitCard = ({ habit, onToggleStatus, onEdit, onDelete, onArchive }) => {
  const [showMenu, setShowMenu] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayStatusObj = habit.completedDates.find((d) => d.date === todayStr);
  const todayStatus = todayStatusObj ? todayStatusObj.status : null;

  const priorityColors = {
    High: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  };

  return (
    <GlassCard className="flex flex-col justify-between group relative border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40">
      <div>
        {/* Top bar: Category, Priority, Options */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-inner">
              {habit.emoji || '⚡'}
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                {habit.category}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {habit.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                priorityColors[habit.priority] || priorityColors.Medium
              }`}
            >
              {habit.priority}
            </span>

            {/* Menu dropdown button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FiMoreVertical />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-50 w-36 glass-panel bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-1.5 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(habit);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onArchive(habit._id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <FiArchive /> {habit.isArchived ? 'Restore' : 'Archive'}
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(habit._id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description if present */}
        {habit.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{habit.description}</p>
        )}

        {/* Streak counter */}
        <div className="my-3 flex items-center justify-between bg-slate-100/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Streak</span>
          <StreakFire streak={habit.currentStreak} size="sm" />
        </div>
      </div>

      {/* Action Buttons: Complete, Missed, Skip */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-2">
        <button
          onClick={() => onToggleStatus(habit._id, todayStr, 'completed')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            todayStatus === 'completed'
              ? 'bg-emerald-500 text-white shadow-glow border border-emerald-400'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
          }`}
        >
          <FiCheck /> Done
        </button>

        <button
          onClick={() => onToggleStatus(habit._id, todayStr, 'missed')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            todayStatus === 'missed'
              ? 'bg-rose-500 text-white shadow-glow border border-rose-400'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
          }`}
        >
          <FiX /> Missed
        </button>

        <button
          onClick={() => onToggleStatus(habit._id, todayStr, 'skipped')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            todayStatus === 'skipped'
              ? 'bg-amber-500 text-white shadow-glow border border-amber-400'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
          }`}
        >
          <FiFastForward /> Skip
        </button>
      </div>
    </GlassCard>
  );
};
