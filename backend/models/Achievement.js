import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    xpBonus: {
      type: Number,
      default: 50,
    },
    threshold: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Achievement', achievementSchema);
