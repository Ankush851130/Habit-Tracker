import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import { formatDatePretty } from '../../utils/dateUtils';
import { HABIT_CATEGORIES } from '../../constants/categories';

export const DayDetailModal = ({ dateStr, onClose, habits = [], onToggleStatus }) => {
  if (!dateStr) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = dateStr === todayStr;

  // Filter non-archived habits
  const activeHabits = habits.filter((h) => !h.isArchived);

  // Determine status of each habit for selected date
  const habitsWithStatus = activeHabits.map((habit) => {
    const entry = habit.completedDates?.find((d) => d.date === dateStr);
    const status = entry ? entry.status : 'pending';
    const catObj = HABIT_CATEGORIES.find((c) => c.name.toLowerCase() === (habit.category || '').toLowerCase());
    const emoji = catObj?.emoji || '🎯';

    return {
      ...habit,
      currentStatus: status,
      emoji,
    };
  });

  const completedCount = habitsWithStatus.filter((h) => h.currentStatus === 'completed').length;
  const totalCount = habitsWithStatus.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl p-6 text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {isToday ? 'Today' : 'Date Activity'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{dateStr}</span>
              </div>
              <h2 className="text-xl font-black mt-1">{formatDatePretty(dateStr)}</h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Daily Progress Stats */}
          <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <FiTrendingUp className="text-emerald-500" /> Completion Progress
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">
                {completedCount} / {totalCount} completed ({completionRate}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Habits List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {habitsWithStatus.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No active habits found for this date.</p>
            ) : (
              habitsWithStatus.map((habit) => {
                const isCompleted = habit.currentStatus === 'completed';
                return (
                  <div
                    key={habit._id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/20'
                        : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/60 hover:border-indigo-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.emoji}</span>
                      <div>
                        <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                          {habit.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 font-semibold text-slate-600 dark:text-slate-300">
                            {habit.category}
                          </span>
                          {habit.priority && (
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              {habit.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleStatus(habit._id, dateStr, isCompleted ? 'pending' : 'completed')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <FiCheckCircle className="text-sm" /> Done
                        </>
                      ) : (
                        <>
                          <FiClock className="text-sm" /> Mark Done
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Clicking "Mark Done" directly updates your habit completion log for this date.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
