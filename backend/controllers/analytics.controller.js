import Habit from '../models/Habit.js';
import Activity from '../models/Activity.js';

// @desc    Get comprehensive dashboard & analytics statistics
// @route   GET /api/analytics/summary
export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ userId, isArchived: false });

    const totalHabits = habits.length;
    const todayStr = new Date().toISOString().split('T')[0];

    let todayCompletedCount = 0;
    habits.forEach((h) => {
      if (h.completedDates.some((d) => d.date === todayStr && d.status === 'completed')) {
        todayCompletedCount++;
      }
    });

    const todayCompletionRate = totalHabits > 0 ? Math.round((todayCompletedCount / totalHabits) * 100) : 0;

    // 1. Heatmap Data Matrix (Past 365 days in 2026)
    const heatmapMap = {};
    let totalCompletedSessionsAllTime = 0;

    habits.forEach((h) => {
      h.completedDates.forEach((d) => {
        if (d.status === 'completed') {
          heatmapMap[d.date] = (heatmapMap[d.date] || 0) + 1;
          totalCompletedSessionsAllTime++;
        }
      });
    });

    const heatmapData = Object.keys(heatmapMap).map((date) => ({
      date,
      count: heatmapMap[date],
    }));

    // 2. Category Distribution
    const categoryMap = {};
    habits.forEach((h) => {
      categoryMap[h.category] = (categoryMap[h.category] || 0) + 1;
    });

    const categoryData = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }));

    // 3. Weekly Data (Last 7 Days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      let completed = 0;
      habits.forEach((h) => {
        if (h.completedDates.some((cd) => cd.date === dateStr && cd.status === 'completed')) {
          completed++;
        }
      });

      weeklyData.push({
        day: dayName,
        date: dateStr,
        completed,
        total: totalHabits,
        rate: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
      });
    }

    // 4. Monthly Trend Data (Last 30 Days)
    const monthlyData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      let completed = 0;
      habits.forEach((h) => {
        if (h.completedDates.some((cd) => cd.date === dateStr && cd.status === 'completed')) {
          completed++;
        }
      });

      monthlyData.push({
        date: dateStr.substring(5), // MM-DD
        fullDate: dateStr,
        completed,
        total: totalHabits,
        rate: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
      });
    }

    // 5. Day-of-Week Breakdown (Sun - Sat)
    const dayOfWeekCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    const dayOfWeekTotals = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    habits.forEach((h) => {
      h.completedDates.forEach((cd) => {
        const d = new Date(cd.date);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        dayOfWeekTotals[dayStr] = (dayOfWeekTotals[dayStr] || 0) + 1;
        if (cd.status === 'completed') {
          dayOfWeekCounts[dayStr] = (dayOfWeekCounts[dayStr] || 0) + 1;
        }
      });
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let bestDay = 'Wed';
    let maxDayRate = 0;

    const dayOfWeekData = dayNames.map((day) => {
      const completed = dayOfWeekCounts[day] || 0;
      const total = dayOfWeekTotals[day] || 1;
      const rate = Math.round((completed / total) * 100);
      if (rate > maxDayRate) {
        maxDayRate = rate;
        bestDay = day;
      }
      return { day, completed, total, rate };
    });

    // 6. Habit Performance Detailed Stats Matrix
    const habitStats = habits.map((h) => {
      const completedCount = h.completedDates.filter((cd) => cd.status === 'completed').length;
      const totalLogs = h.completedDates.length || 1;
      const successRate = Math.round((completedCount / totalLogs) * 100);

      return {
        id: h._id,
        title: h.title,
        category: h.category,
        emoji: h.emoji || '⚡',
        color: h.color || '#10B981',
        priority: h.priority || 'Medium',
        currentStreak: h.currentStreak || 0,
        longestStreak: h.longestStreak || 0,
        completedCount,
        totalLogs,
        successRate,
      };
    });

    // Sort habits by successRate descending
    habitStats.sort((a, b) => b.successRate - a.successRate);

    // Compute Overall Average Success Rate
    const avgSuccessRate =
      habitStats.length > 0
        ? Math.round(habitStats.reduce((acc, curr) => acc + curr.successRate, 0) / habitStats.length)
        : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalHabits,
        todayCompletedCount,
        todayCompletionRate,
        totalCompletedSessionsAllTime,
        avgSuccessRate,
        bestDay,
        userLevel: req.user.level || 1,
        userXP: req.user.xp || 0,
        currentStreak: req.user.currentStreak || 0,
        longestStreak: req.user.longestStreak || 0,
      },
      heatmapData,
      categoryData,
      weeklyData,
      monthlyData,
      dayOfWeekData,
      habitStats,
    });
  } catch (error) {
    next(error);
  }
};
