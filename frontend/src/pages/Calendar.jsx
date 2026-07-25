import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/Common/GlassCard';
import { HeatmapCalendar } from '../components/Calendar/HeatmapCalendar';
import { analyticsService } from '../services/analyticsService';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { formatDatePretty } from '../utils/dateUtils';

export const Calendar = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getSummary();
        setHeatmapData(data.heatmapData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  const handleSelectDate = (dateStr, count) => {
    setSelectedDate(dateStr);
    setSelectedCount(count);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Interactive Calendar & Heatmap</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">GitHub-style activity matrix tracking your consistency</p>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-indigo-600 dark:text-indigo-400 text-lg" />
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">365-Day Consistency Heatmap</h2>
          </div>
        </div>

        <HeatmapCalendar heatmapData={heatmapData} onSelectDate={handleSelectDate} />
      </GlassCard>

      {/* Selected Date Details */}
      {selectedDate && (
        <GlassCard className="border border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
              <FiCheckCircle />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{formatDatePretty(selectedDate)}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You completed <strong className="text-emerald-600 dark:text-emerald-400">{selectedCount} habit(s)</strong> on this date.
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
