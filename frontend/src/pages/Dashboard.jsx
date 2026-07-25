import React, { useState } from 'react';
import { FiPlus, FiZap, FiAward } from 'react-icons/fi';
import { useHabits } from '../context/HabitContext';
import { useAuth } from '../context/AuthContext';
import { GreetingHeader } from '../components/Dashboard/GreetingHeader';
import { DailyProgressRing } from '../components/Dashboard/DailyProgressRing';
import { HabitCard } from '../components/Habit/HabitCard';
import { HabitFormModal } from '../components/Habit/HabitFormModal';
import { GlassCard } from '../components/Common/GlassCard';
import { XPBar } from '../components/Common/XPBar';
import { StreakFire } from '../components/Common/StreakFire';

export const Dashboard = () => {
  const { user } = useAuth();
  const { habits, summary, createHabit, updateHabit, deleteHabit, toggleArchiveHabit, toggleHabitStatus } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingHabit) {
      updateHabit(editingHabit._id, data);
    } else {
      createHabit(data);
    }
  };

  const activeHabits = habits.filter((h) => !h.isArchived);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <GreetingHeader />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Today's Completion */}
        <GlassCard className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Daily Progress</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {summary?.todayCompletionRate || 0}%
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {summary?.todayCompletedCount || 0} of {summary?.totalHabits || 0} completed
            </span>
          </div>
          <DailyProgressRing
            completed={summary?.todayCompletedCount || 0}
            total={summary?.totalHabits || 0}
            percentage={summary?.todayCompletionRate || 0}
          />
        </GlassCard>

        {/* Card 2: Current Streak */}
        <GlassCard className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Current Streak</span>
            <div className="mt-1">
              <StreakFire streak={user?.currentStreak || 0} size="lg" />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-1">
              Personal Best: <strong className="text-amber-500 dark:text-amber-400">{user?.longestStreak || 0} days</strong>
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
            <FiZap />
          </div>
        </GlassCard>

        {/* Card 3: Experience & Rank */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Rank & Experience</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Level {user?.level || 1}
            </div>
          </div>
          <div className="mt-2">
            <XPBar xp={user?.xp || 0} level={user?.level || 1} showDetails={true} />
          </div>
        </GlassCard>

        {/* Card 4: Total Badges */}
        <GlassCard className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Achievements</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {user?.unlockedBadges?.length || 0} Badges
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Unlocked rank badges</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl">
            <FiAward />
          </div>
        </GlassCard>
      </div>

      {/* Main Today's Habits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Today's Habits</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track and complete your planned routines</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all"
          >
            <FiPlus className="text-base" /> Add Habit
          </button>
        </div>

        {activeHabits.length === 0 ? (
          <GlassCard className="text-center py-12">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">No active habits yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto my-3">
              Start building consistent daily routines by creating your very first habit.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow"
            >
              + Create First Habit
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggleStatus={toggleHabitStatus}
                onEdit={handleOpenEditModal}
                onDelete={deleteHabit}
                onArchive={toggleArchiveHabit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Habit Create / Edit Modal */}
      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingHabit}
      />
    </div>
  );
};
