import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { HABIT_CATEGORIES } from '../../constants/categories';

export const HabitFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Fitness',
      priority: 'Medium',
      frequency: 'Daily',
      color: '#10B981',
      emoji: '⚡',
      reminderTime: '09:00',
    },
  });

  const emojis = ['⚡', '💪', '📚', '💻', '🧘', '📖', '💧', '🏋️', '😴', '🥗', '🏃', '🙏', '🎯', '🔥', '🧠'];

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Fitness',
        priority: initialData.priority || 'Medium',
        frequency: initialData.frequency || 'Daily',
        color: initialData.color || '#10B981',
        emoji: initialData.emoji || '⚡',
        reminderTime: initialData.reminderTime || '09:00',
      });
    } else {
      reset({
        title: '',
        description: '',
        category: 'Fitness',
        priority: 'Medium',
        frequency: 'Daily',
        color: '#10B981',
        emoji: '⚡',
        reminderTime: '09:00',
      });
    }
  }, [initialData, reset, isOpen]);

  const selectedEmoji = watch('emoji');

  const onFormSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {initialData ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Habit Title *
              </label>
              <input
                type="text"
                {...register('title', { required: true })}
                placeholder="e.g. Read 20 pages of a book"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                rows="2"
                placeholder="Details or notes about your goal..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm resize-none"
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Emoji Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setValue('emoji', e)}
                    className={`h-10 w-10 text-xl rounded-xl border flex items-center justify-center transition-all ${
                      selectedEmoji === e
                        ? 'bg-indigo-600 border-indigo-400 scale-110 shadow-glow text-white'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 2 Cols: Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  {HABIT_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Grid 2 Cols: Frequency & Reminder */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Repeat Frequency
                </label>
                <select
                  {...register('frequency')}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Reminder
                </label>
                <input
                  type="time"
                  {...register('reminderTime')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-glow transition-all"
              >
                {initialData ? 'Save Changes' : 'Create Habit'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
