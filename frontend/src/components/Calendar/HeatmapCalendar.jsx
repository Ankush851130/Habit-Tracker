import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiGrid, FiHelpCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const HeatmapCalendar = ({ heatmapData = [], onSelectDate }) => {
  const [viewStyle, setViewStyle] = useState('12months'); // '12months' (Easy 12-Month Grid) | 'matrix' (GitHub Matrix)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showGuide, setShowGuide] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Map dateStr -> completed count lookup
  const dataMap = {};
  heatmapData.forEach((item) => {
    dataMap[item.date] = item.count;
  });

  const getColorClass = (count, isToday) => {
    if (isToday) {
      if (!count || count === 0) {
        return 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black border border-indigo-500 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900';
      }
      return 'bg-emerald-500 text-white font-black border border-emerald-400 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 shadow-md';
    }
    if (!count || count === 0)
      return 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-400 text-slate-400 dark:text-slate-500';
    if (count === 1) return 'bg-amber-400 text-amber-950 font-bold border border-amber-300 shadow-sm';
    if (count === 2) return 'bg-emerald-400 text-emerald-950 font-bold border border-emerald-300 shadow-sm';
    if (count >= 3) return 'bg-purple-600 text-white font-bold border border-purple-500 shadow-md shadow-purple-500/20';
    return 'bg-emerald-500 text-white font-bold border border-emerald-400 shadow-md';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayLabelsShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Helper to generate 12 months array for selectedYear
  const generateMonthsForYear = (year) => {
    return monthNames.map((monthName, monthIndex) => {
      const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      const days = [];
      // Empty padding cells for start of month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ type: 'empty', id: `empty-${monthIndex}-${i}` });
      }

      // Actual days 1 to daysInMonth
      for (let d = 1; d <= daysInMonth; d++) {
        const mStr = String(monthIndex + 1).padStart(2, '0');
        const dStr = String(d).padStart(2, '0');
        const dateStr = `${year}-${mStr}-${dStr}`;
        const count = dataMap[dateStr] || 0;
        const isToday = dateStr === todayStr;

        days.push({
          type: 'day',
          dayNumber: d,
          dateStr,
          count,
          isToday,
        });
      }

      return {
        monthName,
        monthIndex,
        days,
      };
    });
  };

  const monthsData = generateMonthsForYear(selectedYear);

  // Generate 52 weeks rolling dates for GitHub Matrix view
  const generateRollingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const matrixDates = generateRollingDates();
  const matrixWeeks = [];
  for (let i = 0; i < matrixDates.length; i += 7) {
    matrixWeeks.push(matrixDates.slice(i, i + 7));
  }

  const dayOfWeekLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Layout Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Consistency Calendar Overview
            </h3>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
            >
              <FiHelpCircle /> How to read
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {viewStyle === '12months'
              ? `Showing full 12-month calendar for ${selectedYear}`
              : `Showing 365-day continuous activity matrix leading up to today`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Year selector for 12-month view */}
          {viewStyle === '12months' && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs font-bold shadow-sm">
              <button
                onClick={() => setSelectedYear((prev) => prev - 1)}
                className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Previous Year"
              >
                <FiChevronLeft />
              </button>
              <span className="px-1 text-slate-900 dark:text-slate-100">{selectedYear}</span>
              <button
                onClick={() => setSelectedYear((prev) => prev + 1)}
                className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Next Year"
              >
                <FiChevronRight />
              </button>
            </div>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewStyle('12months')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewStyle === '12months'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FiCalendar /> 12 Months View
            </button>
            <button
              onClick={() => setViewStyle('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewStyle === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FiGrid /> GitHub Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Guide Explanation Modal / Box */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-2 text-indigo-950 dark:text-indigo-200"
        >
          <div className="font-extrabold flex items-center gap-1.5">
            <FiHelpCircle className="text-indigo-600 dark:text-indigo-400" /> How to Read This Calendar:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            <li>
              <strong>12 Months View (Default)</strong>: Shows every month of {selectedYear} as a standard calendar page (Jan 1 to Dec 31). Every box is a date with its number!
            </li>
            <li>
              <strong>Colors</strong>: Gray = 0 habits, Amber = 1 habit completed, Emerald = 2 habits completed, Purple = 3+ habits completed.
            </li>
            <li>
              <strong>Interactive</strong>: Click on any date box to see the habit completion details for that day or toggle habit status!
            </li>
          </ul>
        </motion.div>
      )}

      {/* View Mode 1: 12-Month Calendar Cards Grid (Easy to Understand) */}
      {viewStyle === '12months' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthsData.map((month) => {
            const isCurrentMonth =
              selectedYear === new Date().getFullYear() &&
              month.monthIndex === new Date().getMonth();

            return (
              <div
                key={month.monthName}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrentMonth
                    ? 'bg-indigo-500/5 dark:bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Month Title */}
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                    {month.monthName} <span className="text-slate-400 text-xs font-normal">{selectedYear}</span>
                  </h4>
                  {isCurrentMonth && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow-sm">
                      Current
                    </span>
                  )}
                </div>

                {/* Day Labels Header (S M T W T F S) */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {dayLabelsShort.map((d, i) => (
                    <span key={i} className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Dates Grid for this month */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {month.days.map((item) => {
                    if (item.type === 'empty') {
                      return <div key={item.id} className="h-6 w-6" />;
                    }

                    return (
                      <motion.button
                        key={item.dateStr}
                        whileHover={{ scale: 1.25 }}
                        onClick={() => onSelectDate && onSelectDate(item.dateStr, item.count)}
                        className={`h-6 w-6 rounded-md text-[10px] flex items-center justify-center transition-all ${getColorClass(
                          item.count,
                          item.isToday
                        )}`}
                        title={`${item.dateStr}${item.isToday ? ' (Today)' : ''}: ${item.count} habit(s) completed`}
                      >
                        {item.dayNumber}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: GitHub 52-Week Activity Matrix Grid */}
      {viewStyle === 'matrix' && (
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="inline-block min-w-max">
            <div className="flex pl-8 mb-2 text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
              {matrixWeeks.map((week, index) => {
                const firstDayInWeek = new Date(week[0]);
                const month = firstDayInWeek.getMonth();
                const yearShort = String(firstDayInWeek.getFullYear()).slice(-2);

                const isFirstOfWeekMonth =
                  index === 0 || new Date(matrixWeeks[index - 1][0]).getMonth() !== month;

                return (
                  <div key={index} className="w-4 text-center whitespace-nowrap overflow-visible">
                    {isFirstOfWeekMonth ? `${monthNames[month].slice(0, 3)} '${yearShort}` : ''}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-1.5">
              <div className="flex flex-col gap-1.5 pr-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 justify-between py-0.5">
                {dayOfWeekLabels.map((lbl, idx) => (
                  <div key={idx} className="h-3.5 flex items-center justify-end">
                    {lbl}
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5">
                {matrixWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5">
                    {week.map((dateStr) => {
                      const count = dataMap[dateStr] || 0;
                      const isToday = dateStr === todayStr;
                      return (
                        <motion.button
                          key={dateStr}
                          whileHover={{ scale: 1.3, zIndex: 10 }}
                          onClick={() => onSelectDate && onSelectDate(dateStr, count)}
                          className={`h-3.5 w-3.5 rounded-sm border transition-all relative ${getColorClass(
                            count,
                            isToday
                          )}`}
                          title={`${dateStr}${isToday ? ' (Today)' : ''}: ${count} habit(s) completed`}
                        >
                          {isToday && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-2 text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <FiCalendar className="text-indigo-500" />
          <span>Click on any date to inspect and toggle completed habits</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span>0 Done</span>
          <div className="flex gap-1 items-center">
            <div className="h-3.5 w-3.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            <div className="h-3.5 w-3.5 rounded bg-amber-400" />
            <div className="h-3.5 w-3.5 rounded bg-emerald-400" />
            <div className="h-3.5 w-3.5 rounded bg-purple-600" />
          </div>
          <span>3+ Done</span>
        </div>
      </div>
    </div>
  );
};
