import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

// 1. Weekly Completion Bar Chart
export const WeeklyBarChart = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
        <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: isDark ? '#334155' : '#cbd5e1',
            borderRadius: '12px',
            color: isDark ? '#f8fafc' : '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          }}
        />
        <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 2. Category Breakdown Donut Chart
export const CategoryPieChart = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: isDark ? '#334155' : '#cbd5e1',
            borderRadius: '12px',
            color: isDark ? '#f8fafc' : '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// 3. Completion Rate Area Chart (Trend)
export const CompletionAreaChart = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
        <XAxis dataKey={data[0]?.date ? 'date' : 'day'} stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} unit="%" domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: isDark ? '#334155' : '#cbd5e1',
            borderRadius: '12px',
            color: isDark ? '#f8fafc' : '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          }}
        />
        <Area type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 4. Day of Week Productivity Rhythm Bar Chart
export const DayOfWeekBarChart = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.6} />
        <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} unit="%" domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: isDark ? '#334155' : '#cbd5e1',
            borderRadius: '12px',
            color: isDark ? '#f8fafc' : '#0f172a',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          }}
        />
        <Bar dataKey="rate" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 5. Github-style Activity Heatmap Component
export const ProductivityHeatmapGrid = ({ heatmapData = [] }) => {
  const map = {};
  heatmapData.forEach((d) => {
    map[d.date] = d.count;
  });

  // Generate days for 2026 (Jan 1 to Jul 25)
  const days = [];
  const start = new Date(2026, 0, 1);
  const end = new Date(2026, 6, 25);
  const cur = new Date(start);

  while (cur <= end) {
    const dStr = cur.toISOString().split('T')[0];
    const count = map[dStr] || 0;
    days.push({ date: dStr, count });
    cur.setDate(cur.getDate() + 1);
  }

  const getColorClass = (count) => {
    if (count === 0) return 'bg-slate-200 dark:bg-slate-800';
    if (count === 1) return 'bg-emerald-300 dark:bg-emerald-900/80';
    if (count <= 3) return 'bg-emerald-400 dark:bg-emerald-700';
    if (count <= 5) return 'bg-emerald-500 dark:bg-emerald-500 shadow-sm';
    return 'bg-emerald-600 dark:bg-emerald-400 font-bold shadow-glow';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Year 2026 Daily Activity Grid ({days.length} days logged)</span>
        <div className="flex items-center gap-1 text-[10px]">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-200 dark:bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-900" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        {days.map((d, idx) => (
          <div
            key={idx}
            className={`h-4 w-4 rounded-md transition-transform hover:scale-125 cursor-pointer ${getColorClass(d.count)}`}
            title={`${d.date}: ${d.count} completed habits`}
          />
        ))}
      </div>
    </div>
  );
};
