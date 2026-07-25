import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import Activity from '../models/Activity.js';
import ExtraTracker from '../models/ExtraTracker.js';
import Notification from '../models/Notification.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const defaultCategories = [
  { name: 'Fitness', emoji: '💪', color: '#EF4444', isDefault: true },
  { name: 'Study', emoji: '📚', color: '#3B82F6', isDefault: true },
  { name: 'Coding', emoji: '💻', color: '#10B981', isDefault: true },
  { name: 'Meditation', emoji: '🧘', color: '#8B5CF6', isDefault: true },
  { name: 'Reading', emoji: '📖', color: '#F59E0B', isDefault: true },
  { name: 'Water', emoji: '💧', color: '#06B6D4', isDefault: true },
  { name: 'Workout', emoji: '🏋️', color: '#F97316', isDefault: true },
  { name: 'Sleep', emoji: '😴', color: '#6366F1', isDefault: true },
  { name: 'Diet', emoji: '🥗', color: '#84CC16', isDefault: true },
  { name: 'Running', emoji: '🏃', color: '#EC4899', isDefault: true },
  { name: 'Prayer', emoji: '🙏', color: '#14B8A6', isDefault: true },
];

const defaultAchievements = [
  { key: 'first_habit', title: 'First Step', description: 'Completed your very first habit!', icon: '🌱', category: 'Milestone', xpBonus: 50, threshold: 1 },
  { key: 'streak_7', title: '7 Day Streak', description: 'Maintained a consistent habit streak for 7 full days!', icon: '🔥', category: 'Streak', xpBonus: 100, threshold: 7 },
  { key: 'streak_30', title: '30 Day Master', description: 'Unstoppable! Reached a 30-day streak!', icon: '⚡', category: 'Streak', xpBonus: 300, threshold: 30 },
  { key: 'habits_100', title: 'Consistency King', description: 'Completed 100 total habit sessions!', icon: '👑', category: 'Milestone', xpBonus: 500, threshold: 100 },
  { key: 'level_5', title: 'Rising Star', description: 'Reached Level 5 experience rank!', icon: '⭐', category: 'Level', xpBonus: 200, threshold: 5 },
  { key: 'level_10', title: 'Habit Champion', description: 'Reached Level 10 master rank!', icon: '🏆', category: 'Level', xpBonus: 1000, threshold: 10 },
];

const sampleHabits = [
  { title: 'Morning 20-Min Cardio', category: 'Fitness', priority: 'High', emoji: '🏃', color: '#EF4444', reminderTime: '07:00' },
  { title: 'Solve 2 LeetCode Problems', category: 'Coding', priority: 'High', emoji: '💻', color: '#10B981', reminderTime: '09:00' },
  { title: 'Read 25 Pages of Non-Fiction', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '21:00' },
  { title: 'Mindfulness Meditation', category: 'Meditation', priority: 'Medium', emoji: '🧘', color: '#8B5CF6', reminderTime: '08:00' },
  { title: 'Drink 3L of Water', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '12:00' },
  { title: 'Study System Design', category: 'Study', priority: 'High', emoji: '📚', color: '#3B82F6', reminderTime: '16:00' },
];

const seedData = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.log('Skipping seed: MongoDB connection not established.');
      process.exit(0);
    }

    console.log('1️⃣ Seeding Default Categories & Achievements...');
    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate({ name: cat.name, isDefault: true }, cat, { upsert: true, new: true });
    }
    for (const ach of defaultAchievements) {
      await Achievement.findOneAndUpdate({ key: ach.key }, ach, { upsert: true, new: true });
    }

    console.log('2️⃣ Creating Demo User (demo@example.com / password123)...');
    let demoUser = await User.findOne({ email: 'demo@example.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Vance',
        email: 'demo@example.com',
        password: 'password123', // will be hashed by pre-save hook
      });
    }

    // Clean past habits for demo user to rebuild clean 30-day realistic dataset
    await Habit.deleteMany({ userId: demoUser._id });
    await Activity.deleteMany({ userId: demoUser._id });
    await Notification.deleteMany({ userId: demoUser._id });
    await ExtraTracker.deleteMany({ userId: demoUser._id });

    console.log('3️⃣ Generating 30 Days of Habit Logs...');
    const today = new Date();
    let totalXPEarned = 0;
    let completedActivitiesCount = 0;

    for (const sample of sampleHabits) {
      const completedDates = [];
      let currentStreak = 0;
      let longestStreak = 0;

      // Generate 30 past days data
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // 80% completion probability for realistic high consistency
        const isCompleted = Math.random() > 0.18;
        if (isCompleted) {
          completedDates.push({ date: dateStr, status: 'completed' });
          currentStreak++;
          if (currentStreak > longestStreak) longestStreak = currentStreak;

          totalXPEarned += 15;
          completedActivitiesCount++;

          await Activity.create({
            userId: demoUser._id,
            habitTitle: sample.title,
            action: 'completed',
            xpEarned: 15,
            date: dateStr,
          });
        } else {
          currentStreak = 0;
          const isMissed = Math.random() > 0.5;
          completedDates.push({ date: dateStr, status: isMissed ? 'missed' : 'skipped' });
        }
      }

      await Habit.create({
        userId: demoUser._id,
        ...sample,
        completedDates,
        currentStreak,
        longestStreak,
      });
    }

    // Update demo user level & streaks
    const calculatedLevel = Math.floor(totalXPEarned / 100) + 1;
    demoUser.xp = totalXPEarned;
    demoUser.level = calculatedLevel;
    demoUser.currentStreak = 14; // Strong streak
    demoUser.longestStreak = 24;
    demoUser.unlockedBadges = [
      { badgeId: 'first_habit', unlockedAt: new Date(Date.now() - 28 * 86400000) },
      { badgeId: 'streak_7', unlockedAt: new Date(Date.now() - 21 * 86400000) },
      { badgeId: 'level_5', unlockedAt: new Date(Date.now() - 10 * 86400000) },
      { badgeId: 'habits_100', unlockedAt: new Date(Date.now() - 5 * 86400000) },
    ];
    await demoUser.save();

    // 4️⃣ Populate ExtraTracker Data
    console.log('4️⃣ Seeding Extra Tracker Data (Pomodoro, Moods, Water, Journal)...');
    const moodLogs = [];
    const waterIntake = [];
    const journalEntries = [];

    const moods = ['excellent', 'good', 'excellent', 'good', 'neutral'];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      moodLogs.push({
        date: dateStr,
        mood: moods[i % moods.length],
        note: `Productive day working on goals!`,
      });

      waterIntake.push({
        date: dateStr,
        glasses: Math.floor(Math.random() * 4) + 5, // 5 to 8 glasses
        targetGlasses: 8,
      });
    }

    journalEntries.push(
      { date: today.toISOString().split('T')[0], title: 'Reflections on Month 1', content: 'Maintained great focus on coding and workout routines. Excited to keep building compounding momentum!' },
      { date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], title: 'Weekly Sprint Retrospective', content: 'Completed all LeetCode target problems and read 150 pages this week.' }
    );

    await ExtraTracker.create({
      userId: demoUser._id,
      pomodoro: Array.from({ length: 18 }).map((_, i) => ({
        durationMinutes: 25,
        taskName: i % 2 === 0 ? 'Coding Focus Session' : 'Deep Reading',
        completedAt: new Date(Date.now() - i * 86400000),
      })),
      moodLogs,
      waterIntake,
      journalEntries,
    });

    console.log('====================================================');
    console.log('🎉 1-MONTH DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('👤 Demo User Email: demo@example.com');
    console.log('🔑 Password: password123');
    console.log(`⚡ Experience Points: ${demoUser.xp} XP (Level ${demoUser.level})`);
    console.log(`🏆 Habits Completed: ${completedActivitiesCount} sessions over 30 days`);
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(0);
  }
};

seedData();
