import React from 'react';
import { GlassCard } from '../components/Common/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { FiSun, FiMoon, FiBell, FiTrash2, FiShield } from 'react-icons/fi';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    if (window.confirm('⚠️ Are you sure you want to delete your account? All habits and progress will be permanently erased.')) {
      try {
        await authService.deleteAccount();
        toast.success('Account deleted successfully');
        logout();
      } catch (err) {
        toast.error(err.message || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Application Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure theme, notifications, and privacy options</p>
      </div>

      {/* Theme Preference */}
      <GlassCard className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
            {theme === 'dark' ? <FiMoon /> : <FiSun />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Interface Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Switch between dark mode obsidian theme and light mode</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
        >
          {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
        </button>
      </GlassCard>

      {/* Notifications Settings */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
            <FiBell />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Notification Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure email reminders and daily summary alerts</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <span>Daily Email Summary & Missed Habit Reminders</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-indigo-600 rounded" />
          </label>
        </div>
      </GlassCard>

      {/* Danger Zone: Delete Account */}
      <GlassCard className="border border-rose-500/30 bg-rose-50 dark:bg-rose-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl">
              <FiShield />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">Danger Zone: Delete Account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Permanently remove your account and all associated habit data</p>
            </div>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all"
          >
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
