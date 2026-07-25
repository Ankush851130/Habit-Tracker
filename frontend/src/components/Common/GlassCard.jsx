import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true, onClick, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden ${
        hover ? 'glass-panel-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
