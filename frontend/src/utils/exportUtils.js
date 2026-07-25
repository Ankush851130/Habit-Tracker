export const exportHabitsToCSV = (habits) => {
  if (!habits || habits.length === 0) return;

  const headers = ['Title', 'Category', 'Priority', 'Frequency', 'Current Streak', 'Longest Streak', 'Archived'];
  const rows = habits.map((h) => [
    `"${h.title}"`,
    `"${h.category}"`,
    `"${h.priority}"`,
    `"${h.frequency}"`,
    h.currentStreak,
    h.longestStreak,
    h.isArchived ? 'Yes' : 'No',
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `habit_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printSummaryReport = () => {
  window.print();
};
