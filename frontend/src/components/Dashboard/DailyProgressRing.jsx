import React from 'react';
import { motion } from 'framer-motion';

export const DailyProgressRing = ({ completed = 0, total = 0, percentage = 0 }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Track Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="text-slate-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            className="text-indigo-500"
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-100">{percentage}%</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">
            {completed}/{total} Done
          </span>
        </div>
      </div>
    </div>
  );
};
