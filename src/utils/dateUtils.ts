import { startOfMonth, getWeek, format, parseISO } from 'date-fns';

export const getCurrentWeekOfMonth = (date: Date = new Date()): number => {
  const startOfCurrentMonth = startOfMonth(date);
  const weekOfYear = getWeek(date, { weekStartsOn: 1 });
  const weekOfMonthStart = getWeek(startOfCurrentMonth, { weekStartsOn: 1 });
  
  let weekOfMonth = weekOfYear - weekOfMonthStart + 1;
  
  // Handle edge cases for weeks spanning months
  if (weekOfMonth <= 0) {
    weekOfMonth = 1;
  } else if (weekOfMonth > 4) {
    weekOfMonth = 4;
  }
  
  return weekOfMonth;
};

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(amount);
};