import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/Common/GlassCard';
import { HeatmapCalendar } from '../components/Calendar/HeatmapCalendar';
import { MonthCalendar } from '../components/Calendar/MonthCalendar';
import { WeeklyBreakdown } from '../components/Calendar/WeeklyBreakdown';
import { DayDetailModal } from '../components/Calendar/DayDetailModal';
import { analyticsService } from '../services/analyticsService';
import { useHabits } from '../context/HabitContext';
import { HABIT_CATEGORIES } from '../constants/categories';
import {
  FiCalendar,
  FiGrid,
  FiActivity,
  FiFilter,
  FiCheckCircle,
  FiZap,
  FiAward,
  FiLayers,
} from 'react-icons/fi';

export const Calendar = () => {
  const { habits = [], toggleHabitStatus, summary } = useHabits();
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'heatmap' | 'weekly'
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Local Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHabitId, setSelectedHabitId] = useState('All');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getSummary();
        setHeatmapData(data.heatmapData || []);
      } catch (err) {
        console.error('Error fetching analytics for calendar:', err);
      }
    };
    fetchAnalytics();
  }, []);

  // Filter habits according to selected category and habit dropdowns
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (habit.isArchived) return false;
      const categoryMatch =
        selectedCategory === 'All' ||
        habit.category?.toLowerCase() === selectedCategory.toLowerCase();
      const habitMatch = selectedHabitId === 'All' || habit._id === selectedHabitId;
      return categoryMatch && habitMatch;
    });
  }, [habits, selectedCategory, selectedHabitId]);

  // Compute filtered heatmap data based on filteredHabits
  const computedHeatmapData = useMemo(() => {
    if (selectedCategory === 'All' && selectedHabitId === 'All') {
      return heatmapData;
    }
    // Reconstruct heatmap count per date from filteredHabits
    const dateCounts = {};
    filteredHabits.forEach((habit) => {
      habit.completedDates?.forEach((item) => {
        if (item.status === 'completed') {
          dateCounts[item.date] = (dateCounts[item.date] || 0) + 1;
        }
      });
    });

    return Object.keys(dateCounts).map((date) => ({
      date,
      count: dateCounts[date],
    }));
  }, [heatmapData, filteredHabits, selectedCategory, selectedHabitId]);

  // Calculations for quick monthly stats bar
  const stats = useMemo(() => {
    const activeHabitsCount = filteredHabits.length;
    let totalCompletionsThisMonth = 0;
    const year = currentMonth.getFullYear();
    const monthStr = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${year}-${monthStr}`;

    filteredHabits.forEach((h) => {
      h.completedDates?.forEach((item) => {
        if (item.date.startsWith(monthPrefix) && item.status === 'completed') {
          totalCompletionsThisMonth += 1;
        }
      });
    });

    const daysInCurrentMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
    const maxPossibleCompletions = activeHabitsCount * daysInCurrentMonth;
    const monthlyRate =
      maxPossibleCompletions > 0
        ? Math.round((totalCompletionsThisMonth / maxPossibleCompletions) * 100)
        : 0;

    return {
      activeHabitsCount,
      totalCompletionsThisMonth,
      monthlyRate,
      longestStreak: summary?.longestStreak || 0,
    };
  }, [filteredHabits, currentMonth, summary]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiCalendar className="text-indigo-600 dark:text-indigo-400" /> Interactive Calendar Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track habit consistency, analyze monthly patterns, and log daily accomplishments.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/50 self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'month'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FiGrid /> Month View
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'heatmap'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FiActivity /> 365 Matrix
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FiLayers /> Weekly
          </button>
        </div>
      </div>

      {/* Top Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-3 border-l-4 border-l-emerald-500">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Month Completions</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {stats.totalCompletionsThisMonth}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 border-l-4 border-l-indigo-500">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
            <FiZap />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Monthly Success Rate</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.monthlyRate}%</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 border-l-4 border-l-amber-500">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
            <FiAward />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Longest Streak</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.longestStreak} Days</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3 border-l-4 border-l-purple-500">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl font-bold">
            <FiLayers />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Tracked Habits</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.activeHabitsCount}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Filter Toolbar */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
            <FiFilter className="text-indigo-500" /> Filter View:
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Categories</option>
                {HABIT_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Individual Habit Dropdown */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Habit:</label>
              <select
                value={selectedHabitId}
                onChange={(e) => setSelectedHabitId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[180px]"
              >
                <option value="All">All Habits</option>
                {habits
                  .filter((h) => !h.isArchived)
                  .map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.title}
                    </option>
                  ))}
              </select>
            </div>

            {(selectedCategory !== 'All' || selectedHabitId !== 'All') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedHabitId('All');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-800"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Main View Container */}
      <GlassCard className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'month' && (
            <motion.div
              key="month"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MonthCalendar
                currentMonth={currentMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                habits={filteredHabits}
                onSelectDate={(dateStr) => setSelectedDate(dateStr)}
              />
            </motion.div>
          )}

          {viewMode === 'heatmap' && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-indigo-500 text-xl" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  365-Day Consistency Matrix
                </h2>
              </div>
              <HeatmapCalendar
                heatmapData={computedHeatmapData}
                onSelectDate={(dateStr) => setSelectedDate(dateStr)}
              />
            </motion.div>
          )}

          {viewMode === 'weekly' && (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <WeeklyBreakdown
                habits={filteredHabits}
                onToggleStatus={toggleHabitStatus}
                onSelectDate={(dateStr) => setSelectedDate(dateStr)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Day Details Modal */}
      {selectedDate && (
        <DayDetailModal
          dateStr={selectedDate}
          onClose={() => setSelectedDate(null)}
          habits={filteredHabits}
          onToggleStatus={toggleHabitStatus}
        />
      )}
    </div>
  );
};
