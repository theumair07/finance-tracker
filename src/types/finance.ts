export interface Budget {
  monthly: number;
  weeks: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  notes?: string;
  date: string;
  week: number;
}

export type ExpenseCategory = 'Shopping' | 'Food' | 'Transport' | 'Rent' | 'Other';

export interface WeeklySummary {
  week: number;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface MonthlySummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  usagePercentage: number;
}