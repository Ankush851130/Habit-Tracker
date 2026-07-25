import React from 'react';
import { motion } from 'framer-motion';

export const HeatmapCalendar = ({ heatmapData = [], onSelectDate }) => {
  const generatePastYearDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 180; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const datesList = generatePastYearDates();

  const dataMap = {};
  heatmapData.forEach((item) => {
    dataMap[item.date] = item.count;
  });

  const getColorClass = (count) => {
    if (!count || count === 0) return 'bg-slate-200 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700/40 hover:border-slate-400';
    if (count === 1) return 'bg-amber-500/80 text-white shadow-glow border-amber-400';
    if (count === 2) return 'bg-emerald-500/80 text-white shadow-glow border-emerald-400';
    return 'bg-emerald-500 text-white shadow-glow border-emerald-400';
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-max p-2">
        {datesList.map((dateStr) => {
          const count = dataMap[dateStr] || 0;
          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 1.25 }}
              onClick={() => onSelectDate && onSelectDate(dateStr, count)}
              className={`h-4 w-4 rounded-md border text-[8px] font-bold flex items-center justify-center transition-all ${getColorClass(
                count
              )}`}
              title={`${dateStr}: ${count} habit(s) completed`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 text-xs text-slate-600 dark:text-slate-400 pr-2">
        <span>Less</span>
        <div className="flex gap-1.5 items-center">
          <div className="h-3.5 w-3.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
          <div className="h-3.5 w-3.5 rounded bg-amber-500/80" />
          <div className="h-3.5 w-3.5 rounded bg-emerald-500/80" />
          <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
