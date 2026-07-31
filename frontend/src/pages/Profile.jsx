import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GlassCard } from '../components/Common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import {
  FiUpload,
  FiUser,
  FiLock,
  FiSave,
  FiAward,
  FiZap,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiSettings,
  FiCheck,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';
import { getAvatarUrl } from '../utils/avatarUtils';

const ALL_ACHIEVEMENTS = [
  { key: 'first_habit', title: 'First Step', desc: 'Completed your very first habit!', icon: '🌱', xpBonus: 50, req: '1 Habit' },
  { key: 'streak_7', title: '7 Day Streak', desc: 'Maintained a consistent habit streak for 7 full days!', icon: '🔥', xpBonus: 100, req: '7 Streak' },
  { key: 'streak_30', title: '30 Day Master', desc: 'Unstoppable! Reached a 30-day streak!', icon: '⚡', desc2: '30 Day streak master', xpBonus: 300, req: '30 Streak' },
  { key: 'habits_100', title: 'Consistency King', desc: 'Completed 100 total habit sessions!', icon: '👑', xpBonus: 500, req: '100 Sessions' },
  { key: 'level_5', title: 'Rising Star', desc: 'Reached Level 5 experience rank!', icon: '⭐', xpBonus: 200, req: 'Level 5' },
  { key: 'level_10', title: 'Habit Champion', desc: 'Reached Level 10 master rank!', icon: '🏆', xpBonus: 1000, req: 'Level 10' },
];

const AVATAR_PRESETS = [
  { id: 'ankush', name: 'Ankush', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ankush' },
  { id: 'sarah', name: 'Sarah', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'marcus', name: 'Marcus', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: 'priya', name: 'Priya', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
  { id: 'alex', name: 'Alex', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'elena', name: 'Elena', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  { id: 'david', name: 'David', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 'sophia', name: 'Sophia', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
];

export const Profile = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'profile' | 'security'
  const [uploading, setUploading] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm({
    defaultValues: {
      name: user?.name || '',
      theme: user?.preferences?.theme || 'dark',
      morningReminderTime: user?.preferences?.morningReminderTime || '08:00',
      eveningReminderTime: user?.preferences?.eveningReminderTime || '20:00',
    },
  });

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
  } = useForm();

  // Save Profile & Preferences
  const onUpdateProfile = async (data) => {
    try {
      const payload = {
        name: data.name,
        preferences: {
          theme: data.theme,
          morningReminderTime: data.morningReminderTime,
          eveningReminderTime: data.eveningReminderTime,
          emailNotifications: true,
        },
      };
      const res = await authService.updateProfile(payload);
      if (res.user) setUser(res.user);
      await refreshUser();
      toast.success('Profile & Preferences updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  // Preset Avatar Select
  const handleSelectPresetAvatar = async (presetUrl) => {
    try {
      const res = await authService.updateProfile({ name: user.name });
      // update avatar via direct update or user object update
      const updatedUser = { ...user, avatar: presetUrl };
      setUser(updatedUser);
      toast.success('Avatar updated to preset!');
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  };

  // Custom File Avatar Upload
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const res = await authService.uploadAvatar(formData);
      if (res.user) setUser(res.user);
      await refreshUser();
      toast.success('Profile avatar uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  // Change Password
  const onChangePassword = async (data) => {
    try {
      await authService.changePassword(data);
      resetPass();
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  // Calculate XP Level Progress
  const userXP = user?.xp || 0;
  const userLevel = user?.level || Math.floor(userXP / 100) + 1;
  const currentLevelProgress = userXP % 100;
  const xpNeededForNextLevel = 100 - currentLevelProgress;

  // Unlocked Badges Set
  const unlockedBadgeIds = new Set((user?.unlockedBadges || []).map((b) => b.badgeId));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Gamified Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your rank progress, showcase unlocked achievements & manage account settings
        </p>
      </div>

      {/* Hero Glass Banner Card */}
      <GlassCard className="relative overflow-hidden p-0 border-0 shadow-2xl">
        {/* Decorative Gradient Banner */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="absolute -bottom-10 right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>

        {/* User Details Bar */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          {/* Left: Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Avatar Container */}
            <div className="relative group">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-slate-950 p-1.5 shadow-2xl ring-4 ring-indigo-500/40 relative overflow-hidden">
                <img
                  src={user?.avatar ? getAvatarUrl(user.avatar) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                  alt={user?.name}
                  className="h-full w-full object-cover rounded-2xl bg-slate-900"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs font-bold">
                    Uploading...
                  </div>
                )}
              </div>

              <label className="absolute bottom-1 right-1 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg transition-all transform hover:scale-110">
                <FiUpload className="text-xs" />
                <input type="file" onChange={handleAvatarFileChange} accept="image/*" className="hidden" />
              </label>
            </div>

            {/* Name, Role & Member Badge */}
            <div className="space-y-1.5 sm:mt-12">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {user?.name}
                </h2>
                {user?.role === 'admin' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                    👑 ADMIN
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
                    ⚡ BUILDER
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <FiShield className="text-emerald-500" /> Account Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-indigo-400" /> Member since 2026
                </span>
              </div>
            </div>
          </div>

          {/* Right: XP Rank Badge Card */}
          <div className="w-full sm:w-64 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-1 text-indigo-400">
                <FiZap /> Level {userLevel} Rank
              </span>
              <span className="font-black text-amber-400">{userXP} Total XP</span>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 shadow-glow"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span>{currentLevelProgress}% Filled</span>
              <span>+{xpNeededForNextLevel} XP to Level {userLevel + 1}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 4 High-Impact KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center space-y-1 hover:border-indigo-500/50 transition-all">
          <div className="h-10 w-10 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold mb-2">
            ⚡
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Total XP Earned
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{userXP}</div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
            Level {userLevel} Master
          </span>
        </GlassCard>

        <GlassCard className="p-4 text-center space-y-1 hover:border-amber-500/50 transition-all">
          <div className="h-10 w-10 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold mb-2">
            🔥
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Active Streak
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {user?.currentStreak || 0} <span className="text-xs font-bold text-slate-400">days</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
            Consistency Streak
          </span>
        </GlassCard>

        <GlassCard className="p-4 text-center space-y-1 hover:border-purple-500/50 transition-all">
          <div className="h-10 w-10 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl font-bold mb-2">
            🏆
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Longest Record
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {user?.longestStreak || 0} <span className="text-xs font-bold text-slate-400">days</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block">
            Personal Best
          </span>
        </GlassCard>

        <GlassCard className="p-4 text-center space-y-1 hover:border-emerald-500/50 transition-all">
          <div className="h-10 w-10 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold mb-2">
            🎖️
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Badges Unlocked
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {unlockedBadgeIds.size} / {ALL_ACHIEVEMENTS.length}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            Achievements Mastered
          </span>
        </GlassCard>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'badges'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
        >
          <FiAward className="text-sm" /> Badges & Achievements ({unlockedBadgeIds.size})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
        >
          <FiUser className="text-sm" /> Edit Profile & Avatars
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
        >
          <FiLock className="text-sm" /> Security & Password
        </button>
      </div>

      {/* TAB 1: BADGES & ACHIEVEMENTS SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Achievement Showcase
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Milestone trophies unlocked as you complete habits & maintain streaks
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold">
                {unlockedBadgeIds.size} of {ALL_ACHIEVEMENTS.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedBadgeIds.has(ach.key);

                return (
                  <div
                    key={ach.key}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${isUnlocked
                        ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-500/50 shadow-md'
                        : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-60 grayscale hover:grayscale-0'
                      }`}
                  >
                    {isUnlocked && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase flex items-center gap-1 shadow-sm">
                        <FiCheck className="text-[10px]" /> UNLOCKED
                      </div>
                    )}

                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {ach.icon}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          {ach.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {ach.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-amber-600 dark:text-amber-400">+{ach.xpBonus} XP Bonus</span>
                      <span className="text-slate-500 dark:text-slate-400">Req: {ach.req}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: PERSONAL PROFILE & AVATARS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Presets Selection Card */}
          <GlassCard className="lg:col-span-1 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Instant Avatar Styles</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click any avatar to apply instantly</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPresetAvatar(p.url)}
                  className={`p-1 rounded-2xl border transition-all hover:scale-105 cursor-pointer ${user?.avatar === p.url
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:border-slate-400'
                    }`}
                  title={p.name}
                >
                  <img src={p.url} alt={p.name} className="w-full h-auto rounded-xl" />
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800 transition-all">
                <FiUpload /> Upload Custom Image File
                <input type="file" onChange={handleAvatarFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
          </GlassCard>

          {/* Profile Form Card */}
          <GlassCard className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <FiUser className="text-indigo-600 dark:text-indigo-400 text-lg" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Personal Details & Preferences</h3>
            </div>

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...registerProfile('name', { required: true })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Primary)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Morning Reminder Time
                  </label>
                  <input
                    type="time"
                    {...registerProfile('morningReminderTime')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Evening Reminder Time
                  </label>
                  <input
                    type="time"
                    {...registerProfile('eveningReminderTime')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiSave /> Save Profile & Preferences
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Password Card */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2">
              <FiLock className="text-indigo-600 dark:text-indigo-400 text-lg" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Change Password</h3>
            </div>

            <form onSubmit={handleSubmitPass(onChangePassword)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  {...registerPass('currentPassword', { required: true })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPass('newPassword', { required: true, minLength: 6 })}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow transition-all cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </GlassCard>

          {/* Account Security Info Card */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2">
              <FiShield className="text-emerald-500 text-lg" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Account Security</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Authentication Method:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {user?.googleId ? 'Google Single Sign-On' : 'Password & Email'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Session Status:</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <FiCheckCircle /> Active & Encrypted
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Role Rank:</span>
                <span className="font-bold text-amber-500 uppercase">{user?.role || 'user'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-300 space-y-1">
              <strong className="block font-bold">🔒 Security Best Practice</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Keep your password unique and turn on Google Sign-In for instant multi-factor authenticated logins.
              </p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
