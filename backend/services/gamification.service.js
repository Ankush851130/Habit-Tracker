import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';

/**
 * Calculates Level from total XP. Formula: Level = Math.floor(XP / 100) + 1
 */
export const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

/**
 * Award XP to a user, update their level, check badge unlocks, and log activity
 */
export const awardXP = async (userId, habit, xpAmount, action = 'completed') => {
  const user = await User.findById(userId);
  if (!user) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const oldLevel = user.level;
  user.xp += xpAmount;
  const newLevel = calculateLevel(user.xp);
  user.level = newLevel;

  let levelUp = false;
  if (newLevel > oldLevel) {
    levelUp = true;
    await Notification.create({
      userId,
      title: '🎉 Level Up!',
      message: `Congratulations! You reached Level ${newLevel}!`,
      type: 'level',
    });

    await Activity.create({
      userId,
      action: 'level_up',
      xpEarned: 0,
      date: todayStr,
    });
  }

  // Save User
  await user.save();

  // Log Habit Activity
  await Activity.create({
    userId,
    habitId: habit ? habit._id : null,
    habitTitle: habit ? habit.title : '',
    action,
    xpEarned: xpAmount,
    date: todayStr,
  });

  // Check Badges
  const newBadges = await checkBadges(user);

  return {
    xp: user.xp,
    level: user.level,
    levelUp,
    newBadges,
  };
};

/**
 * Check if user unlocked any new badges based on completed habits, streaks, level, etc.
 */
export const checkBadges = async (user) => {
  const allBadges = await Achievement.find();
  const unlockedIds = new Set(user.unlockedBadges.map((b) => b.badgeId));
  const newUnlocked = [];

  // Fetch counts from database
  const totalCompletedActivities = await Activity.countDocuments({
    userId: user._id,
    action: 'completed',
  });

  for (const badge of allBadges) {
    if (unlockedIds.has(badge.key)) continue;

    let unlocked = false;

    switch (badge.key) {
      case 'first_habit':
        if (totalCompletedActivities >= 1) unlocked = true;
        break;
      case 'streak_7':
        if (user.currentStreak >= 7 || user.longestStreak >= 7) unlocked = true;
        break;
      case 'streak_30':
        if (user.currentStreak >= 30 || user.longestStreak >= 30) unlocked = true;
        break;
      case 'habits_100':
        if (totalCompletedActivities >= 100) unlocked = true;
        break;
      case 'level_5':
        if (user.level >= 5) unlocked = true;
        break;
      case 'level_10':
        if (user.level >= 10) unlocked = true;
        break;
      default:
        break;
    }

    if (unlocked) {
      user.unlockedBadges.push({ badgeId: badge.key, unlockedAt: new Date() });
      user.xp += badge.xpBonus;
      newUnlocked.push(badge);

      await Notification.create({
        userId: user._id,
        title: `🏆 Badge Unlocked: ${badge.title}`,
        message: badge.description,
        type: 'badge',
      });

      await Activity.create({
        userId: user._id,
        action: 'badge_unlocked',
        xpEarned: badge.xpBonus,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }

  if (newUnlocked.length > 0) {
    user.level = calculateLevel(user.xp);
    await user.save();
  }

  return newUnlocked;
};
