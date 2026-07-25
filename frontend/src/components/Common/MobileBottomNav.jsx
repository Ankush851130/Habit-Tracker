import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiCheckSquare,
  FiBarChart2,
  FiCpu,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';

export const MobileBottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: FiGrid },
    { name: 'Habits', path: '/habits', icon: FiCheckSquare },
    { name: 'Calendar', path: '/calendar', icon: FiCalendar },
    { name: 'Analytics', path: '/analytics', icon: FiBarChart2 },
    { name: 'Tools', path: '/extra-tools', icon: FiCpu },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="text-lg mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
