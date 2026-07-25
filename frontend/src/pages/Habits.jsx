import React, { useState } from 'react';
import { FiPlus, FiSearch, FiArchive } from 'react-icons/fi';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from '../components/Habit/HabitCard';
import { HabitFormModal } from '../components/Habit/HabitFormModal';
import { HABIT_CATEGORIES } from '../constants/categories';
import { GlassCard } from '../components/Common/GlassCard';

export const Habits = () => {
  const {
    habits,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    searchQuery,
    setSearchQuery,
    showArchived,
    setShowArchived,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleArchiveHabit,
    toggleHabitStatus,
  } = useHabits();

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

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Habit Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage, edit, and organize all your routines</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <FiPlus className="text-base" /> Create New Habit
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search habits by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Priority & Archived Controls */}
          <div className="flex items-center gap-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${
                showArchived
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                  : 'bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FiArchive /> {showArchived ? 'Archived Habits' : 'Active Habits'}
            </button>
          </div>
        </div>

        {/* Categories horizontal pill tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories
          </button>
          {HABIT_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Habits Grid Display */}
      {habits.length === 0 ? (
        <GlassCard className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No habits found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your category or search filter</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
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

      {/* Modal */}
      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingHabit}
      />
    </div>
  );
};
