import mongoose from 'mongoose';

const extraTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    pomodoro: [
      {
        durationMinutes: { type: Number, default: 25 },
        completedAt: { type: Date, default: Date.now },
        taskName: { type: String, default: 'Focus Session' },
      },
    ],
    moodLogs: [
      {
        date: { type: String, required: true }, // YYYY-MM-DD
        mood: { type: String, enum: ['excellent', 'good', 'neutral', 'bad', 'terrible'], default: 'good' },
        note: { type: String, default: '' },
      },
    ],
    waterIntake: [
      {
        date: { type: String, required: true }, // YYYY-MM-DD
        glasses: { type: Number, default: 0 },
        targetGlasses: { type: Number, default: 8 },
      },
    ],
    sleepTracker: [
      {
        date: { type: String, required: true }, // YYYY-MM-DD
        hours: { type: Number, default: 8 },
        quality: { type: String, enum: ['great', 'restful', 'average', 'poor'], default: 'restful' },
      },
    ],
    journalEntries: [
      {
        date: { type: String, required: true }, // YYYY-MM-DD
        title: { type: String, default: '' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('ExtraTracker', extraTrackerSchema);
