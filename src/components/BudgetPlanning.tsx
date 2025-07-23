import React, { useState } from 'react';
import { PiggyBank, Save, AlertTriangle } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { Budget } from '../types/finance';
import { formatCurrency } from '../utils/dateUtils';

export function BudgetPlanning() {
  const { budget, updateBudget } = useFinance();
  const [monthlyBudget, setMonthlyBudget] = useState(budget.monthly.toString());
  const [weeklyBudgets, setWeeklyBudgets] = useState({
    week1: budget.weeks.week1.toString(),
    week2: budget.weeks.week2.toString(),
    week3: budget.weeks.week3.toString(),
    week4: budget.weeks.week4.toString(),
  });

  const totalWeeklyBudget = Object.values(weeklyBudgets).reduce(
    (sum, value) => sum + (parseFloat(value) || 0),
    0
  );

  const isOverBudget = totalWeeklyBudget > parseFloat(monthlyBudget);

  const handleSave = () => {
    const newBudget: Budget = {
      monthly: parseFloat(monthlyBudget) || 0,
      weeks: {
        week1: parseFloat(weeklyBudgets.week1) || 0,
        week2: parseFloat(weeklyBudgets.week2) || 0,
        week3: parseFloat(weeklyBudgets.week3) || 0,
        week4: parseFloat(weeklyBudgets.week4) || 0,
      },
    };

    updateBudget(newBudget);
    (window as any).showToast?.showSuccess('Budget updated successfully!');
  };

  const handleAutoDistribute = () => {
    const monthly = parseFloat(monthlyBudget) || 0;
    const perWeek = Math.floor(monthly / 4);
    
    setWeeklyBudgets({
      week1: perWeek.toString(),
      week2: perWeek.toString(),
      week3: perWeek.toString(),
      week4: (monthly - perWeek * 3).toString(), // Remainder goes to week 4
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
          <PiggyBank className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Budget Planning</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Configuration */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Monthly Budget</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Monthly Budget (PKR)
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px]"
                placeholder="Enter monthly budget"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-white">Weekly Distribution</h4>
                <button
                  onClick={handleAutoDistribute}
                  className="text-sm text-blue-400 hover:text-blue-300 underline min-h-[44px] px-2"
                >
                  Auto Distribute
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((week) => (
                  <div key={week}>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Week {week}
                    </label>
                    <input
                      type="number"
                      value={weeklyBudgets[`week${week}` as keyof typeof weeklyBudgets]}
                      onChange={(e) =>
                        setWeeklyBudgets(prev => ({
                          ...prev,
                          [`week${week}`]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px]"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {isOverBudget && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-300">
                  Weekly budgets exceed monthly budget by {formatCurrency(totalWeeklyBudget - parseFloat(monthlyBudget))}
                </span>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[44px]"
            >
              <Save className="w-5 h-5" />
              <span>Save Budget</span>
            </button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Budget Overview</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-gray-300">Monthly Budget</span>
              <span className="text-white font-semibold break-all">
                {formatCurrency(parseFloat(monthlyBudget) || 0)}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Weekly Breakdown</h4>
              {[1, 2, 3, 4].map((week) => {
                const amount = parseFloat(weeklyBudgets[`week${week}` as keyof typeof weeklyBudgets]) || 0;
                const percentage = parseFloat(monthlyBudget) > 0 ? (amount / parseFloat(monthlyBudget)) * 100 : 0;
                
                return (
                  <div key={week} className="flex items-center justify-between p-3 rounded-lg bg-white/5 gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">Week {week}</span>
                      <div className="w-12 sm:w-16 bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white text-sm font-medium break-all">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-300">Total Weekly</span>
                <span className={`${isOverBudget ? 'text-red-400' : 'text-white'} break-all`}>
                  {formatCurrency(totalWeeklyBudget)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">Unallocated</span>
                <span className={`font-medium ${
                  parseFloat(monthlyBudget) - totalWeeklyBudget >= 0 ? 'text-green-400' : 'text-red-400'
                } break-all`}>
                  {formatCurrency(parseFloat(monthlyBudget) - totalWeeklyBudget)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}