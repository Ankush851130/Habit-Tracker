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

const usersData = [
  {
    name: 'Ankush Sharma',
    email: 'ankushvivo2020@gmail.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ankush',
    habits: [
      { title: 'Morning 20-Min Cardio', category: 'Fitness', priority: 'High', emoji: '🏃', color: '#EF4444', reminderTime: '07:00' },
      { title: 'Full-Stack Web Development', category: 'Coding', priority: 'High', emoji: '💻', color: '#10B981', reminderTime: '09:00' },
      { title: 'Read 30 Pages Non-Fiction', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '21:00' },
      { title: 'Daily Mindfulness Meditation', category: 'Meditation', priority: 'Medium', emoji: '🧘', color: '#8B5CF6', reminderTime: '08:00' },
      { title: 'Drink 3L of Water', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '12:00' },
      { title: 'Evening Walk & Reflection', category: 'Workout', priority: 'Medium', emoji: '🏋️', color: '#F97316', reminderTime: '20:00' },
    ]
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    habits: [
      { title: 'Morning Yoga & Stretching', category: 'Fitness', priority: 'High', emoji: '🧘', color: '#EF4444', reminderTime: '06:30' },
      { title: 'System Design & Architecture', category: 'Study', priority: 'High', emoji: '📚', color: '#3B82F6', reminderTime: '10:00' },
      { title: 'Read Tech & Business Books', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '20:30' },
      { title: 'Drink 2.5L Water Daily', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '11:00' },
      { title: 'Healthy Meal Prep', category: 'Diet', priority: 'High', emoji: '🥗', color: '#84CC16', reminderTime: '18:30' },
    ]
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    habits: [
      { title: '100 Pushups & Core Challenge', category: 'Workout', priority: 'High', emoji: '🏋️', color: '#F97316', reminderTime: '07:30' },
      { title: 'LeetCode Algorithm Sprint', category: 'Coding', priority: 'High', emoji: '💻', color: '#10B981', reminderTime: '14:00' },
      { title: 'Night Sleep by 11 PM', category: 'Sleep', priority: 'High', emoji: '😴', color: '#6366F1', reminderTime: '22:30' },
      { title: 'Daily Hydration Goal', category: 'Water', priority: 'Medium', emoji: '💧', color: '#06B6D4', reminderTime: '13:00' },
      { title: 'Learn Rust & Go', category: 'Study', priority: 'Medium', emoji: '📚', color: '#3B82F6', reminderTime: '16:00' },
    ]
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    habits: [
      { title: 'Morning Meditation 15 Min', category: 'Meditation', priority: 'High', emoji: '🧘', color: '#8B5CF6', reminderTime: '07:00' },
      { title: 'Python Data Science Project', category: 'Coding', priority: 'High', emoji: '💻', color: '#10B981', reminderTime: '11:00' },
      { title: 'Evening Jog 5K', category: 'Running', priority: 'Medium', emoji: '🏃', color: '#EC4899', reminderTime: '18:00' },
      { title: 'Gratitude & Daily Journaling', category: 'Study', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '21:30' },
      { title: 'Drink 3L Hydration', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '12:30' },
    ]
  },
  {
    name: 'Alex Morgan',
    email: 'alex.morgan@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    habits: [
      { title: 'Heavy Weightlifting Session', category: 'Workout', priority: 'High', emoji: '🏋️', color: '#F97316', reminderTime: '17:00' },
      { title: 'Reading 20 Pages Self-Help', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '22:00' },
      { title: 'Calorie & Macro Tracking', category: 'Diet', priority: 'High', emoji: '🥗', color: '#84CC16', reminderTime: '20:00' },
      { title: 'Hydration Target 3.5L', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '10:00' },
      { title: 'Morning Stretch', category: 'Fitness', priority: 'Medium', emoji: '💪', color: '#EF4444', reminderTime: '06:45' },
    ]
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    habits: [
      { title: 'Piano & Music Practice', category: 'Study', priority: 'High', emoji: '📚', color: '#3B82F6', reminderTime: '15:00' },
      { title: 'Morning Pilates Session', category: 'Fitness', priority: 'Medium', emoji: '💪', color: '#EF4444', reminderTime: '08:00' },
      { title: 'Read World Literature', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '21:00' },
      { title: 'Daily Water Goal 2L', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '11:30' },
      { title: 'Sleep 8 Hours Quality', category: 'Sleep', priority: 'High', emoji: '😴', color: '#6366F1', reminderTime: '22:00' },
    ]
  },
  {
    name: 'David Kim',
    email: 'david.kim@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    habits: [
      { title: 'React & Node.js Coding', category: 'Coding', priority: 'High', emoji: '💻', color: '#10B981', reminderTime: '09:30' },
      { title: 'Morning Run 3 Miles', category: 'Running', priority: 'High', emoji: '🏃', color: '#EC4899', reminderTime: '06:30' },
      { title: 'Meditate 10 Mins', category: 'Meditation', priority: 'Medium', emoji: '🧘', color: '#8B5CF6', reminderTime: '08:15' },
      { title: 'Read Non-Fiction 25 pgs', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '20:00' },
      { title: 'Drink Water 3L', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '14:00' },
    ]
  },
  {
    name: 'Sophia Martinez',
    email: 'sophia.martinez@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    habits: [
      { title: 'Morning Daily Prayer', category: 'Prayer', priority: 'High', emoji: '🙏', color: '#14B8A6', reminderTime: '06:00' },
      { title: 'HIIT Cardio Workout', category: 'Workout', priority: 'High', emoji: '🏋️', color: '#F97316', reminderTime: '17:30' },
      { title: 'Clean Eating & Whole Foods', category: 'Diet', priority: 'Medium', emoji: '🥗', color: '#84CC16', reminderTime: '13:00' },
      { title: 'Hydration Goal 2.5L', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '10:30' },
      { title: 'Reading Inspirational Books', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '21:00' },
    ]
  },
  {
    name: 'Liam Wilson',
    email: 'liam.wilson@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    habits: [
      { title: 'Outdoor Cycling 15 km', category: 'Running', priority: 'High', emoji: '🏃', color: '#EC4899', reminderTime: '07:15' },
      { title: 'Study Cloud Architecture AWS', category: 'Study', priority: 'High', emoji: '📚', color: '#3B82F6', reminderTime: '11:00' },
      { title: 'Nightly Guided Meditation', category: 'Meditation', priority: 'Medium', emoji: '🧘', color: '#8B5CF6', reminderTime: '22:00' },
      { title: 'Drink 3L Hydration', category: 'Water', priority: 'Low', emoji: '💧', color: '#06B6D4', reminderTime: '12:00' },
      { title: 'Core & Strength Training', category: 'Fitness', priority: 'Medium', emoji: '💪', color: '#EF4444', reminderTime: '18:00' },
    ]
  },
  {
    name: 'Aisha Khan',
    email: 'aisha.khan@gmail.com',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    habits: [
      { title: 'Daily Code Review & Refactor', category: 'Coding', priority: 'High', emoji: '💻', color: '#10B981', reminderTime: '10:00' },
      { title: 'Morning Jog 4K', category: 'Running', priority: 'High', emoji: '🏃', color: '#EC4899', reminderTime: '06:45' },
      { title: 'Read 25 Pages of Literature', category: 'Reading', priority: 'Medium', emoji: '📖', color: '#F59E0B', reminderTime: '20:30' },
      { title: 'Sleep 8 Hours Nightly', category: 'Sleep', priority: 'High', emoji: '😴', color: '#6366F1', reminderTime: '22:15' },
      { title: 'Mindful Evening Prayer', category: 'Prayer', priority: 'Medium', emoji: '🙏', color: '#14B8A6', reminderTime: '19:30' },
    ]
  }
];

// Helper to generate dates from Jan 1, 2026 to July 25, 2026
const getDatesIn2026 = () => {
  const dates = [];
  const start = new Date(2026, 0, 1);
  const end = new Date(2026, 6, 25); // July 25, 2026
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const seedData = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Skipping seed: MongoDB connection not established.');
      process.exit(1);
    }

    console.log('⚡ 1️⃣ Seeding Default Categories & Achievements...');
    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate({ name: cat.name, isDefault: true }, cat, { upsert: true, new: true });
    }
    for (const ach of defaultAchievements) {
      await Achievement.findOneAndUpdate({ key: ach.key }, ach, { upsert: true, new: true });
    }

    const year2026Dates = getDatesIn2026();
    console.log(`📅 Generated ${year2026Dates.length} days for 2026 (Jan 1, 2026 - July 25, 2026)`);

    const defaultPassword = '12345678';

    for (let uIdx = 0; uIdx < usersData.length; uIdx++) {
      const uInfo = usersData[uIdx];
      console.log(`\n👤 [${uIdx + 1}/10] Processing User: ${uInfo.name} (${uInfo.email})...`);

      // Find or create user
      let user = await User.findOne({ email: uInfo.email.toLowerCase() });
      if (!user) {
        user = new User({
          name: uInfo.name,
          email: uInfo.email.toLowerCase(),
          password: defaultPassword,
          role: uInfo.role || 'user',
          avatar: uInfo.avatar,
        });
      } else {
        user.name = uInfo.name;
        user.password = defaultPassword; // Trigger password re-hash on save
        user.role = uInfo.role || 'user';
        user.avatar = uInfo.avatar;
      }
      await user.save();

      // Clean existing data for this user to avoid duplicates
      await Habit.deleteMany({ userId: user._id });
      await Activity.deleteMany({ userId: user._id });
      await Notification.deleteMany({ userId: user._id });
      await ExtraTracker.deleteMany({ userId: user._id });

      let totalXPEarned = 0;
      let totalCompletedSessions = 0;
      const activitiesToInsert = [];
      const notificationsToInsert = [];

      // Add Welcome notification
      notificationsToInsert.push({
        userId: user._id,
        title: 'Welcome to Habit Tracker! 🚀',
        message: `Welcome ${user.name}! Your 2026 habit journey is set up and active.`,
        type: 'system',
        isRead: true,
        createdAt: new Date('2026-01-01T08:00:00.000Z'),
      });

      // Seed habits and completion logs
      for (const habitDef of uInfo.habits) {
        const completedDates = [];
        let currentStreak = 0;
        let longestStreak = 0;

        // Completion seed variation per habit (80% - 90% success rate)
        const targetPassRate = 0.80 + (Math.random() * 0.12);

        for (const dateStr of year2026Dates) {
          const isCompleted = Math.random() < targetPassRate;
          const timestamp = new Date(`${dateStr}T${habitDef.reminderTime}:00.000Z`);

          if (isCompleted) {
            completedDates.push({
              date: dateStr,
              status: 'completed',
              timestamp,
            });
            currentStreak++;
            if (currentStreak > longestStreak) longestStreak = currentStreak;

            const xpForSession = 15;
            totalXPEarned += xpForSession;
            totalCompletedSessions++;

            activitiesToInsert.push({
              userId: user._id,
              habitTitle: habitDef.title,
              action: 'completed',
              xpEarned: xpForSession,
              date: dateStr,
              createdAt: timestamp,
            });
          } else {
            currentStreak = 0;
            const isMissed = Math.random() > 0.4;
            completedDates.push({
              date: dateStr,
              status: isMissed ? 'missed' : 'skipped',
              timestamp,
            });

            activitiesToInsert.push({
              userId: user._id,
              habitTitle: habitDef.title,
              action: isMissed ? 'missed' : 'skipped',
              xpEarned: 0,
              date: dateStr,
              createdAt: timestamp,
            });
          }
        }

        const habitObj = await Habit.create({
          userId: user._id,
          title: habitDef.title,
          category: habitDef.category,
          priority: habitDef.priority,
          emoji: habitDef.emoji,
          color: habitDef.color,
          reminderTime: habitDef.reminderTime,
          startDate: new Date('2026-01-01'),
          completedDates,
          currentStreak,
          longestStreak,
        });

        // Set habitId on activities for this habit
        for (const act of activitiesToInsert) {
          if (act.habitTitle === habitDef.title && !act.habitId) {
            act.habitId = habitObj._id;
          }
        }
      }

      // Batch insert activities
      if (activitiesToInsert.length > 0) {
        await Activity.insertMany(activitiesToInsert);
      }

      // Calculate user level & achievements
      const calculatedLevel = Math.floor(totalXPEarned / 100) + 1;
      user.xp = totalXPEarned;
      user.level = calculatedLevel;
      user.currentStreak = Math.floor(Math.random() * 15) + 10;
      user.longestStreak = Math.floor(Math.random() * 25) + 30;

      const unlockedBadges = [
        { badgeId: 'first_habit', unlockedAt: new Date('2026-01-02T10:00:00Z') },
        { badgeId: 'streak_7', unlockedAt: new Date('2026-01-08T10:00:00Z') },
        { badgeId: 'streak_30', unlockedAt: new Date('2026-02-01T10:00:00Z') },
        { badgeId: 'habits_100', unlockedAt: new Date('2026-03-15T10:00:00Z') },
        { badgeId: 'level_5', unlockedAt: new Date('2026-04-10T10:00:00Z') },
        { badgeId: 'level_10', unlockedAt: new Date('2026-06-01T10:00:00Z') },
      ];
      user.unlockedBadges = unlockedBadges;

      await user.save();

      // Notifications for milestones
      notificationsToInsert.push(
        {
          userId: user._id,
          title: '🔥 30-Day Streak Master!',
          message: 'Congratulations! You maintained a 30-day consistent habit streak in 2026!',
          type: 'streak',
          isRead: true,
          createdAt: new Date('2026-02-01T10:00:00Z'),
        },
        {
          userId: user._id,
          title: `⭐ Level Up: Level ${calculatedLevel}!`,
          message: `Awesome progress! You have reached Level ${calculatedLevel} with ${totalXPEarned} XP!`,
          type: 'level',
          isRead: false,
          createdAt: new Date('2026-07-20T12:00:00Z'),
        }
      );
      await Notification.insertMany(notificationsToInsert);

      // Seed ExtraTracker data (Pomodoro, Mood, Water, Sleep, Journal) for 2026
      const moodsList = ['excellent', 'good', 'excellent', 'good', 'neutral', 'excellent', 'good'];
      const sleepQualities = ['great', 'restful', 'great', 'restful', 'average'];
      
      const moodLogs = [];
      const waterIntake = [];
      const sleepTracker = [];

      for (let dIdx = 0; dIdx < year2026Dates.length; dIdx++) {
        const dateStr = year2026Dates[dIdx];

        moodLogs.push({
          date: dateStr,
          mood: moodsList[dIdx % moodsList.length],
          note: `Stayed focused on goals on ${dateStr}!`,
        });

        waterIntake.push({
          date: dateStr,
          glasses: Math.floor(Math.random() * 4) + 6, // 6 to 9 glasses
          targetGlasses: 8,
        });

        sleepTracker.push({
          date: dateStr,
          hours: Math.floor(Math.random() * 2) + 7, // 7 to 8 hours
          quality: sleepQualities[dIdx % sleepQualities.length],
        });
      }

      // Pomodoro focus sessions across 2026
      const pomodoro = [];
      for (let i = 0; i < 40; i++) {
        const sampleDate = year2026Dates[Math.floor(Math.random() * year2026Dates.length)];
        pomodoro.push({
          durationMinutes: 25,
          taskName: i % 2 === 0 ? 'Deep Work & Coding' : 'Reading & Learning Sprint',
          completedAt: new Date(`${sampleDate}T14:30:00.000Z`),
        });
      }

      // Rich Journal Entries across 2026
      const journalEntries = [
        {
          date: '2026-01-01',
          title: '2026 New Year Intentions',
          content: 'Setting ambitious goals for 2026! Focusing on consistency, daily health habits, and deep skill mastery.',
          createdAt: new Date('2026-01-01T09:00:00Z'),
        },
        {
          date: '2026-02-15',
          title: 'Mid-Q1 Reflection',
          content: 'Built great momentum over the last 45 days. My morning routine is now automatic.',
          createdAt: new Date('2026-02-15T21:00:00Z'),
        },
        {
          date: '2026-04-01',
          title: 'Q2 Goal Setting & Systems',
          content: 'Excited for Q2! Doubling down on problem solving, hydration, and high quality sleep.',
          createdAt: new Date('2026-04-01T18:00:00Z'),
        },
        {
          date: '2026-06-15',
          title: 'Mid-Year Milestones',
          content: 'Completed over 500 habit sessions so far this year! The power of compounding is real.',
          createdAt: new Date('2026-06-15T20:00:00Z'),
        },
        {
          date: '2026-07-25',
          title: 'July Progress Sync',
          content: 'Maintaining peak consistency across fitness, coding, meditation, and daily trackers.',
          createdAt: new Date('2026-07-25T19:00:00Z'),
        },
      ];

      await ExtraTracker.create({
        userId: user._id,
        pomodoro,
        moodLogs,
        waterIntake,
        sleepTracker,
        journalEntries,
      });

      console.log(`✅ Seeded ${uInfo.name}: ${totalCompletedSessions} completed sessions in 2026, ${totalXPEarned} XP, Level ${user.level}`);
    }

    console.log('\n====================================================');
    console.log('🎉 10 USERS 2026 RANDOM DATA SEEDED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('🔑 ALL USERS HAVE PASSWORD: 12345678');
    console.log('\nUsers List:');
    usersData.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.name} <${u.email}> (${u.role})`);
    });
    console.log('====================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
