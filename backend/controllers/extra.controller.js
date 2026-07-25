import ExtraTracker from '../models/ExtraTracker.js';
import User from '../models/User.js';

// Get or initialize user ExtraTracker
const getOrCreateExtraTracker = async (userId) => {
  let tracker = await ExtraTracker.findOne({ userId });
  if (!tracker) {
    tracker = await ExtraTracker.create({ userId });
  }
  return tracker;
};

// @desc    Get all extra trackers data
// @route   GET /api/extra
export const getExtraData = async (req, res, next) => {
  try {
    const tracker = await getOrCreateExtraTracker(req.user.id);
    res.status(200).json({ success: true, tracker });
  } catch (error) {
    next(error);
  }
};

// @desc    Log Pomodoro Session
// @route   POST /api/extra/pomodoro
export const logPomodoro = async (req, res, next) => {
  try {
    const { durationMinutes = 25, taskName = 'Focus Session' } = req.body;
    const tracker = await getOrCreateExtraTracker(req.user.id);

    tracker.pomodoro.push({ durationMinutes, taskName, completedAt: new Date() });
    await tracker.save();

    res.status(200).json({ success: true, pomodoro: tracker.pomodoro });
  } catch (error) {
    next(error);
  }
};

// @desc    Log Mood
// @route   POST /api/extra/mood
export const logMood = async (req, res, next) => {
  try {
    const { date, mood, note } = req.body;
    const tracker = await getOrCreateExtraTracker(req.user.id);
    const dateStr = date || new Date().toISOString().split('T')[0];

    const existingIdx = tracker.moodLogs.findIndex((m) => m.date === dateStr);
    if (existingIdx >= 0) {
      tracker.moodLogs[existingIdx] = { date: dateStr, mood, note };
    } else {
      tracker.moodLogs.push({ date: dateStr, mood, note });
    }

    await tracker.save();
    res.status(200).json({ success: true, moodLogs: tracker.moodLogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Log Water Intake
// @route   POST /api/extra/water
export const logWater = async (req, res, next) => {
  try {
    const { date, glasses, targetGlasses = 8 } = req.body;
    const tracker = await getOrCreateExtraTracker(req.user.id);
    const dateStr = date || new Date().toISOString().split('T')[0];

    const existingIdx = tracker.waterIntake.findIndex((w) => w.date === dateStr);
    if (existingIdx >= 0) {
      tracker.waterIntake[existingIdx].glasses = glasses;
    } else {
      tracker.waterIntake.push({ date: dateStr, glasses, targetGlasses });
    }

    await tracker.save();
    res.status(200).json({ success: true, waterIntake: tracker.waterIntake });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Journal Entry
// @route   POST /api/extra/journal
export const addJournalEntry = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const tracker = await getOrCreateExtraTracker(req.user.id);
    const dateStr = new Date().toISOString().split('T')[0];

    tracker.journalEntries.unshift({ title, content, date: dateStr });
    await tracker.save();

    res.status(201).json({ success: true, journalEntries: tracker.journalEntries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Leaderboard
// @route   GET /api/extra/leaderboard
export const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find()
      .select('name avatar xp level currentStreak unlockedBadges')
      .sort({ xp: -1 })
      .limit(10);

    res.status(200).json({ success: true, leaderboard: topUsers });
  } catch (error) {
    next(error);
  }
};
