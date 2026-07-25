import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      default: null,
    },
    habitTitle: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      enum: ['completed', 'missed', 'skipped', 'created', 'level_up', 'badge_unlocked'],
      required: true,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
