import React from 'react';
import { motion } from 'framer-motion';

export const XPBar = ({ xp = 0, level = 1, showDetails = true }) => {
  const xpInCurrentLevel = xp % 100;
  const progressPercent = Math.min(xpInCurrentLevel, 100);

  return (
    <div class="w-full">
      {showDetails && (
        <div class="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-300">
          <span class="flex items-center gap-1.5">
            <span class="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/30 font-bold">
              LVL {level}
            </span>
            <span>XP Progress</span>
          </span>
          <span class="text-indigo-400">{xpInCurrentLevel} / 100 XP</span>
        </div>
      )}
      <div class="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-slate-700/50 overflow-hidden relative">
        <motion.div
          class="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
