import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';
import { formatDatePretty } from '../../utils/dateUtils';
import { HABIT_CATEGORIES } from '../../constants/categories';

export const WeeklyBreakdown = ({ habits = [], onToggleStatus, onSelectDate }) => {
  const [currentOffsetWeeks, setCurrentOffsetWeeks] = useState(0);

  // Calculate start of current week (Monday)
  const getStartOfWeek = (offsetWeeks = 0) => {
    const d = new Date();
    const day = d.getDay(); // 0 = Sun, 1 = Mon
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    monday.setDate(monday.getDate() + offsetWeeks * 7);
    return monday;
  };

  const monday = getStartOfWeek(currentOffsetWeeks);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    weekDays.push(dayDate.toISOString().split('T')[0]);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabits = habits.filter((h) => !h.isArchived);

  return (
    <div className="w-full space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
            <FiActivity />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Week of {formatDatePretty(weekDays[0])}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">7-day habit breakdown & direct tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentOffsetWeeks(0)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            This Week
          </button>
          <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            <button
              onClick={() => setCurrentOffsetWeeks((prev) => prev - 1)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700"
              title="Previous Week"
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <button
              onClick={() => setCurrentOffsetWeeks((prev) => prev + 1)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Next Week"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Day Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((dateStr) => {
          const isToday = dateStr === todayStr;
          const dateObj = new Date(dateStr);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dateObj.getDate();

          const habitsForDay = activeHabits.map((habit) => {
            const entry = habit.completedDates?.find((d) => d.date === dateStr);
            const isCompleted = entry?.status === 'completed';
            const catObj = HABIT_CATEGORIES.find((c) => c.name.toLowerCase() === (habit.category || '').toLowerCase());
            return {
              ...habit,
              isCompleted,
              emoji: catObj?.emoji || '🎯',
            };
          });

          const completedCount = habitsForDay.filter((h) => h.isCompleted).length;
          const totalCount = habitsForDay.length;
          const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <motion.div
              key={dateStr}
              whileHover={{ y: -3 }}
              className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                isToday
                  ? 'bg-indigo-500/10 dark:bg-indigo-950/30 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-white/80 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <div>
                {/* Header */}
                <div
                  onClick={() => onSelectDate && onSelectDate(dateStr)}
                  className="cursor-pointer flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60 mb-3"
                >
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
                      {dayName}
                    </span>
                    <span className={`text-base font-black ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {dayNum}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      completionRate === 100
                        ? 'bg-emerald-500 text-white'
                        : completedCount > 0
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </span>
                </div>

                {/* Habit items */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {habitsForDay.map((habit) => (
                    <div
                      key={habit._id}
                      onClick={() => onToggleStatus(habit._id, dateStr, habit.isCompleted ? 'pending' : 'completed')}
                      className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        habit.isCompleted
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200/70 dark:border-slate-700/50 hover:border-indigo-400 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{habit.emoji}</span>
                        <span className={`truncate ${habit.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                          {habit.title}
                        </span>
                      </div>
                      {habit.isCompleted ? (
                        <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                      ) : (
                        <FiClock className="text-slate-400 shrink-0 text-xs" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
