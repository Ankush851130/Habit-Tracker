import Habit from '../models/Habit.js';
import User from '../models/User.js';
import { awardXP } from '../services/gamification.service.js';

// @desc    Get user habits
// @route   GET /api/habits
export const getHabits = async (req, res, next) => {
  try {
    const { category, priority, isArchived, search } = req.query;
    const query = { userId: req.user.id };

    if (isArchived !== undefined) {
      query.isArchived = isArchived === 'true';
    } else {
      query.isArchived = false; // default active habits
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const habits = await Habit.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: habits.length,
      habits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new habit
// @route   POST /api/habits
export const createHabit = async (req, res, next) => {
  try {
    const habitData = {
      ...req.body,
      userId: req.user.id,
    };

    const habit = await Habit.create(habitData);

    res.status(201).json({
      success: true,
      habit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
export const getHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    res.status(200).json({ success: true, habit });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
export const updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, habit });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    res.status(200).json({ success: true, message: 'Habit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive / Restore habit
// @route   PATCH /api/habits/:id/archive
export const toggleArchiveHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    habit.isArchived = !habit.isArchived;
    await habit.save();

    res.status(200).json({
      success: true,
      message: `Habit ${habit.isArchived ? 'archived' : 'restored'} successfully`,
      habit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Habit status (completed, missed, skipped) for a specific date
// @route   POST /api/habits/:id/toggle-status
export const toggleHabitStatus = async (req, res, next) => {
  try {
    const { date, status = 'completed' } = req.body; // format YYYY-MM-DD
    const targetDateStr = date || new Date().toISOString().split('T')[0];

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const existingIndex = habit.completedDates.findIndex((item) => item.date === targetDateStr);

    let xpResult = null;

    if (existingIndex >= 0) {
      // Toggle off if already marked with same status
      if (habit.completedDates[existingIndex].status === status) {
        habit.completedDates.splice(existingIndex, 1);
      } else {
        habit.completedDates[existingIndex].status = status;
        if (status === 'completed') {
          xpResult = await awardXP(req.user.id, habit, 15, 'completed');
        }
      }
    } else {
      // Add new completion record
      habit.completedDates.push({ date: targetDateStr, status });
      if (status === 'completed') {
        xpResult = await awardXP(req.user.id, habit, 15, 'completed');
      }
    }

    // Recalculate streak
    recalculateHabitStreak(habit);
    await habit.save();

    // Recalculate user overall streak
    const user = await User.findById(req.user.id);
    const userHabits = await Habit.find({ userId: req.user.id, isArchived: false });
    let maxStreak = 0;
    userHabits.forEach((h) => {
      if (h.currentStreak > maxStreak) maxStreak = h.currentStreak;
    });
    user.currentStreak = maxStreak;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
    await user.save();

    res.status(200).json({
      success: true,
      habit,
      xpResult,
      userStreak: user.currentStreak,
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Calculate streak for habit based on completedDates array
function recalculateHabitStreak(habit) {
  const dates = habit.completedDates
    .filter((d) => d.status === 'completed')
    .map((d) => d.date)
    .sort()
    .reverse();

  if (dates.length === 0) {
    habit.currentStreak = 0;
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Streak continues if today or yesterday is completed
  let count = 0;
  let curr = new Date(dates.includes(todayStr) ? todayStr : dates.includes(yesterdayStr) ? yesterdayStr : null);

  if (!curr || isNaN(curr.getTime())) {
    habit.currentStreak = 0;
    return;
  }

  while (true) {
    const formattedStr = curr.toISOString().split('T')[0];
    if (dates.includes(formattedStr)) {
      count++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  habit.currentStreak = count;
  if (count > habit.longestStreak) {
    habit.longestStreak = count;
  }
}
