import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/Common/GlassCard';
import {
  WeeklyBarChart,
  CategoryPieChart,
  CompletionAreaChart,
  DayOfWeekBarChart,
  ProductivityHeatmapGrid,
} from '../components/Charts/AnalyticsCharts';
import { analyticsService } from '../services/analyticsService';
import { useHabits } from '../context/HabitContext';
import { exportHabitsToCSV, printSummaryReport } from '../utils/exportUtils';
import {
  FiDownload,
  FiPrinter,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiCalendar,
  FiZap,
  FiAward,
  FiCheckCircle,
  FiActivity,
  FiSliders,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export const Analytics = () => {
  const { habits } = useHabits();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('charts'); // 'charts' | 'leaderboard'
  const [timeRange, setTimeRange] = useState('30d'); // '7d' | '30d' | '2026'

  const [summary, setSummary] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dayOfWeekData, setDayOfWeekData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [habitStats, setHabitStats] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getSummary();
        setSummary(data.summary || {});
        setWeeklyData(data.weeklyData || []);
        setMonthlyData(data.monthlyData || []);
        setCategoryData(data.categoryData || []);
        setDayOfWeekData(data.dayOfWeekData || []);
        setHeatmapData(data.heatmapData || []);
        setHabitStats(data.habitStats || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const handleExportCSV = () => {
    exportHabitsToCSV(habits);
    toast.success('CSV Export Downloaded! 📊');
  };

  // Determine trend data based on selected time range filter
  const activeTrendData = timeRange === '7d' ? weeklyData : monthlyData;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep-dive habit completion trends, category distribution & productivity matrix
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filter Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === '7d'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === '30d'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('2026')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === '2026'
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Year 2026
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <FiDownload /> Export CSV
          </button>
          <button
            onClick={printSummaryReport}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow transition-all cursor-pointer"
          >
            <FiPrinter /> Print PDF Report
          </button>
        </div>
      </div>

      {/* 4 High-Impact KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Success Rate</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-sm">
              <FiTrendingUp />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {summary.avgSuccessRate || 85}%
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            Consistent High Performance
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Completed</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold text-sm">
              <FiZap />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {summary.totalCompletedSessionsAllTime || 0}
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
            Habit Sessions Logged in 2026
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Streak</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-sm">
              🔥
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {summary.currentStreak || 0} <span className="text-xs font-bold text-slate-400">days</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
            Best Record: {summary.longestStreak || 0} days
          </span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Peak Day Rhythm</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500 font-bold text-sm">
              <FiAward />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {summary.bestDay || 'Wednesday'}
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">
            Highest Completion Rate Day
          </span>
        </GlassCard>
      </div>

      {/* Navigation Tabs (Charts vs Habit Matrix) */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'charts'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FiActivity className="text-sm" /> Performance & Visual Charts
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FiAward className="text-sm" /> Habit Performance Matrix ({habitStats.length})
        </button>
      </div>

      {/* TAB 1: VISUAL CHARTS & HEATMAP */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Row 1: Trend Area Chart + Category Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-500 text-lg" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Completion Rate Trend ({timeRange === '7d' ? 'Last 7 Days' : '30-Day Curve'})
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-semibold">% Daily Target Success</span>
              </div>
              <CompletionAreaChart data={activeTrendData} />
            </GlassCard>

            <GlassCard className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <FiPieChart className="text-purple-500 text-lg" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Category Distribution
                </h3>
              </div>
              <CategoryPieChart data={categoryData} />
            </GlassCard>
          </div>

          {/* Row 2: Weekly Bar + Day of Week Rhythm Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <FiBarChart2 className="text-indigo-500 text-lg" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Weekly Habit Completions (Last 7 Days)
                </h3>
              </div>
              <WeeklyBarChart data={weeklyData} />
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-purple-500 text-lg" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Day of Week Productivity Rhythm
                </h3>
              </div>
              <DayOfWeekBarChart data={dayOfWeekData} />
            </GlassCard>
          </div>

          {/* Row 3: 365-Day Contribution Heatmap Grid */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <FiZap className="text-emerald-500 text-lg" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                2026 Year Contribution & Activity Heatmap
              </h3>
            </div>
            <ProductivityHeatmapGrid heatmapData={heatmapData} />
          </GlassCard>

          {/* AI Productivity Insights */}
          <GlassCard className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 border-indigo-500/30">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl shrink-0">
                💡
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-100">Smart Productivity Insight</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your peak productive day is <strong className="text-indigo-400">{summary.bestDay || 'Wednesday'}</strong> with an average completion rate over 90%. Maintaining morning routines early in the day correlates with a 35% higher overall streak retention!
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: HABIT PERFORMANCE MATRIX */}
      {activeTab === 'leaderboard' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Habit Performance Breakdown Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed success rates, streak metrics, and completion counts per habit
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {habitStats.length} Active Habits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Habit</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Priority</th>
                  <th className="pb-3 px-2">Current Streak</th>
                  <th className="pb-3 px-2">Completed</th>
                  <th className="pb-3 px-2">Success Rate</th>
                  <th className="pb-3 px-2 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {habitStats.map((h, idx) => {
                  let grade = 'S';
                  let gradeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                  if (h.successRate < 70) {
                    grade = 'B';
                    gradeColor = 'bg-slate-500/20 text-slate-400 border-slate-500/30';
                  } else if (h.successRate < 82) {
                    grade = 'A';
                    gradeColor = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
                  } else if (h.successRate < 90) {
                    grade = 'A+';
                    gradeColor = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
                  }

                  return (
                    <tr key={h.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <span className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow-sm">
                            {h.emoji}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{h.title}</span>
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                          {h.category}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            h.priority === 'High'
                              ? 'bg-red-500/10 text-red-500'
                              : h.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {h.priority}
                        </span>
                      </td>

                      <td className="py-3 px-2 font-bold text-amber-600 dark:text-amber-400">
                        🔥 {h.currentStreak}d <span className="text-[10px] text-slate-400 font-normal">(best: {h.longestStreak}d)</span>
                      </td>

                      <td className="py-3 px-2 font-bold text-slate-900 dark:text-slate-100">
                        {h.completedCount} / {h.totalLogs}
                      </td>

                      <td className="py-3 px-2">
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                            <span>{h.successRate}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                              style={{ width: `${h.successRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-right">
                        <span className={`px-2.5 py-1 rounded-lg border text-xs font-black ${gradeColor}`}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
