import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiCheckSquare,
  FiCalendar,
  FiBarChart2,
  FiAward,
  FiUser,
  FiSettings,
  FiCpu,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Habits', path: '/habits', icon: FiCheckSquare },
    { name: 'Calendar', path: '/calendar', icon: FiCalendar },
    { name: 'Analytics', path: '/analytics', icon: FiBarChart2 },
    { name: 'Achievements', path: '/achievements', icon: FiAward },
    { name: 'Extra Tools', path: '/extra-tools', icon: FiCpu },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass-panel border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-xl shadow-glow">
            ⚡
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              HabitTracker
            </h1>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase">
              Pro SaaS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-glow border border-indigo-400/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="text-lg" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
