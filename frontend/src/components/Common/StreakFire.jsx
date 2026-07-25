import React from 'react';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

export const StreakFire = ({ streak = 0, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-xl gap-2',
    xl: 'text-3xl gap-3',
  };

  return (
    <div className={`inline-flex items-center font-extrabold ${sizeClasses[size]}`}>
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${
          streak > 0 ? 'text-amber-500 drop-shadow-fire' : 'text-slate-600'
        }`}
      >
        <FaFire />
      </motion.div>
      <span className={streak > 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500' : 'text-slate-500'}>
        {streak} {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
};
