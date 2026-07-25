import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/Common/GlassCard';
import { XPBar } from '../components/Common/XPBar';
import { achievementService } from '../services/achievementService';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiCheck } from 'react-icons/fi';
import { formatDatePretty } from '../utils/dateUtils';

export const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await achievementService.getAchievements();
        setAchievements(data.achievements || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Achievement Badges & XP</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Level up your rank and unlock milestone trophies</p>
      </div>

      {/* User Rank Overview Banner */}
      <GlassCard className="bg-gradient-to-r from-indigo-100/90 via-white to-purple-100/70 dark:from-indigo-950/80 dark:via-slate-900 dark:to-purple-950/60 border border-indigo-200 dark:border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-glow">
              {user?.level || 1}
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
                Current Champion Rank
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Level {user?.level || 1} Builder</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Experience: {user?.xp || 0} XP</p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <XPBar xp={user?.xp || 0} level={user?.level || 1} showDetails={true} />
          </div>
        </div>
      </GlassCard>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((badge) => (
          <GlassCard
            key={badge.key}
            className={`flex flex-col justify-between border transition-all ${
              badge.isUnlocked
                ? 'border-indigo-400/40 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500/40'
                : 'border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-inner">
                  {badge.icon}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    badge.isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {badge.isUnlocked ? <FiCheck /> : <FiLock />}
                  {badge.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{badge.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{badge.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-amber-600 dark:text-amber-400">+{badge.xpBonus} XP Bonus</span>
              {badge.isUnlocked && badge.unlockedAt && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {formatDatePretty(badge.unlockedAt)}
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
