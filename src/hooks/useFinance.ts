import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Budget, Expense, WeeklySummary, MonthlySummary } from '../types/finance';
import { getCurrentWeekOfMonth } from '../utils/dateUtils';

const defaultBudget: Budget = {
  monthly: 50000,
  weeks: {
    week1: 12500,
    week2: 12500,
    week3: 12500,
    week4: 12500,
  },
};

export function useFinance() {
  const [budget, setBudget] = useLocalStorage<Budget>('finance-budget', defaultBudget);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('finance-expenses', []);

  const addExpense = (expense: Omit<Expense, 'id' | 'week'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      week: getCurrentWeekOfMonth(new Date(expense.date)),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateBudget = (newBudget: Budget) => {
    setBudget(newBudget);
  };

  const weeklySummaries: WeeklySummary[] = useMemo(() => {
    const weeks = [1, 2, 3, 4];
    return weeks.map(week => {
      const allocated = budget.weeks[`week${week}` as keyof typeof budget.weeks];
      const spent = expenses
        .filter(expense => expense.week === week)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        week,
        allocated,
        spent,
        remaining: allocated - spent,
      };
    });
  }, [budget, expenses]);

  const monthlySummary: MonthlySummary = useMemo(() => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalRemaining = budget.monthly - totalSpent;
    const usagePercentage = (totalSpent / budget.monthly) * 100;

    return {
      totalBudget: budget.monthly,
      totalSpent,
      totalRemaining,
      usagePercentage,
    };
  }, [budget, expenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [expenses]);

  const exportData = () => {
    const data = {
      budget,
      expenses,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.budget) setBudget(data.budget);
        if (data.expenses) setExpenses(data.expenses);
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return {
    budget,
    expenses,
    weeklySummaries,
    monthlySummary,
    categoryBreakdown,
    addExpense,
    deleteExpense,
    updateBudget,
    exportData,
    importData,
  };
}