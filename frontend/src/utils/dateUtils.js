import { format, parseISO } from 'date-fns';

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const formatDatePretty = (dateInput) => {
  if (!dateInput) return '';
  const dateObj = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(dateObj, 'EEE, MMM d, yyyy');
};

export const formatTimePretty = (dateInput = new Date()) => {
  return format(dateInput, 'hh:mm a');
};
