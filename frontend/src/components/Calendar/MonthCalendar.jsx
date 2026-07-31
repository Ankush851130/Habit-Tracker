import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

export const MonthCalendar = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  habits = [],
  onSelectDate,
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabitsCount = habits.filter((h) => !h.isArchived).length;

  // Build a map of dateStr -> completed habit count for fast lookup
  const dateCompletionMap = {};
  habits.forEach((habit) => {
    if (habit.isArchived) return;
    habit.completedDates?.forEach((item) => {
      if (item.status === 'completed') {
        dateCompletionMap[item.date] = (dateCompletionMap[item.date] || 0) + 1;
      }
    });
  });

  // Days list construction
  const cells = [];

  // Previous month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    cells.push({
      type: 'prev',
      dayNumber: prevDay,
      dateStr: null,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const completedCount = dateCompletionMap[dateStr] || 0;

    cells.push({
      type: 'current',
      dayNumber: day,
      dateStr,
      completedCount,
    });
  }

  // Next month padding to fill out 42 cells (6 rows) or 35 cells
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      type: 'next',
      dayNumber: i,
      dateStr: null,
    });
  }

  return (
    <div className="w-full">
      {/* Month Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
            <FiCalendar />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly overview & habit logs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-sm"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            <button
              onClick={onPrevMonth}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700"
              title="Previous Month"
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Next Month"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {dayNames.map((d, index) => (
          <div
            key={d}
            className={`text-xs font-extrabold tracking-wider uppercase py-1 ${
              index === 0 || index === 6 ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, idx) => {
          if (cell.type !== 'current') {
            return (
              <div
                key={`padding-${idx}`}
                className="h-20 sm:h-24 p-2 rounded-2xl border border-dashed border-slate-200/50 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 text-xs font-medium"
              >
                {cell.dayNumber}
              </div>
            );
          }

          const isToday = cell.dateStr === todayStr;
          const completed = cell.completedCount;
          const ratio = activeHabitsCount > 0 ? Math.min(completed / activeHabitsCount, 1) : 0;

          // Cell styling based on completion ratio
          let bgClass = 'bg-white/80 dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400';
          let badgeColor = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';

          if (completed > 0) {
            if (ratio >= 1) {
              bgClass = 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500 shadow-sm';
              badgeColor = 'bg-emerald-500 text-white font-bold shadow-emerald-500/20';
            } else if (ratio >= 0.5) {
              bgClass = 'bg-indigo-500/10 dark:bg-indigo-950/30 border-indigo-500/40 hover:border-indigo-500 shadow-sm';
              badgeColor = 'bg-indigo-500 text-white font-bold shadow-indigo-500/20';
            } else {
              bgClass = 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/40 hover:border-amber-500 shadow-sm';
              badgeColor = 'bg-amber-500 text-white font-bold shadow-amber-500/20';
            }
          }

          return (
            <motion.div
              key={cell.dateStr}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => onSelectDate && onSelectDate(cell.dateStr, completed)}
              className={`relative h-20 sm:h-24 p-2 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between overflow-hidden group ${bgClass} ${
                isToday ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md' : ''
              }`}
            >
              {/* Top row in cell: Day number + Today indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-black rounded-lg h-6 w-6 flex items-center justify-center ${
                    isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {completed > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${badgeColor}`}>
                    {completed} ✓
                  </span>
                )}
              </div>

              {/* Progress bar at bottom of cell */}
              {activeHabitsCount > 0 && (
                <div className="w-full mt-auto">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{Math.round(ratio * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200/60 dark:bg-slate-700/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        ratio >= 1
                          ? 'bg-emerald-500'
                          : ratio >= 0.5
                          ? 'bg-indigo-500'
                          : completed > 0
                          ? 'bg-amber-500'
                          : 'bg-transparent'
                      }`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
