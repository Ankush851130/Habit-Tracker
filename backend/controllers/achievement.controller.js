import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

// @desc    Get all achievements and user unlocked status
// @route   GET /api/achievements
export const getAchievements = async (req, res, next) => {
  try {
    const allAchievements = await Achievement.find();
    const user = await User.findById(req.user.id);

    const unlockedMap = {};
    user.unlockedBadges.forEach((b) => {
      unlockedMap[b.badgeId] = b.unlockedAt;
    });

    const achievementsWithStatus = allAchievements.map((ach) => ({
      ...ach.toObject(),
      isUnlocked: !!unlockedMap[ach.key],
      unlockedAt: unlockedMap[ach.key] || null,
    }));

    res.status(200).json({
      success: true,
      achievements: achievementsWithStatus,
      userLevel: user.level,
      userXP: user.xp,
    });
  } catch (error) {
    next(error);
  }
};
