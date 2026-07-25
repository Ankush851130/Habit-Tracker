import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      default: 'Fitness',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Custom'],
      default: 'Daily',
    },
    customDays: [
      {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    targetValue: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: 'times',
    },
    color: {
      type: String,
      default: '#10B981',
    },
    emoji: {
      type: String,
      default: '⚡',
    },
    reminderTime: {
      type: String,
      default: '09:00',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    // Array of completed dates in YYYY-MM-DD format for fast querying & calendar heatmaps
    completedDates: [
      {
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        status: { type: String, enum: ['completed', 'missed', 'skipped'], default: 'completed' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient queries by userId and isArchived
habitSchema.index({ userId: 1, isArchived: 1 });

export default mongoose.model('Habit', habitSchema);
