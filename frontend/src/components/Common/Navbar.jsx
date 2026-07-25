import React from 'react';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { XPBar } from './XPBar';
import { StreakFire } from './StreakFire';

import { getAvatarUrl } from '../../utils/avatarUtils';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <FiMenu className="text-xl" />
        </button>
        <span className="hidden md:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
          🚀 Pro Workspace
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Streak Counter */}
        {user && <StreakFire streak={user.currentStreak || 0} size="sm" />}

        {/* User Level & XP Bar snippet */}
        {user && (
          <div className="hidden sm:block w-36">
            <XPBar xp={user.xp || 0} level={user.level || 1} showDetails={false} />
          </div>
        )}

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/50 transition-colors shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun className="text-lg text-amber-400" /> : <FiMoon className="text-lg text-indigo-600" />}
        </button>

        {/* User Profile Avatar */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white overflow-hidden border border-indigo-400/40">
              {user.avatar ? (
                <img src={getAvatarUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
