import React from 'react';

export const SkeletonLoader = ({ count = 3, height = 'h-24' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${height} bg-slate-800/60 rounded-2xl animate-pulse border border-slate-700/40`}
        />
      ))}
    </div>
  );
};
