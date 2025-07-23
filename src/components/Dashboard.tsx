import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ShoppingBag, UtensilsCrossed, Car, Home, Package, Plus } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { ExpenseCategory } from '../types/finance';
import { formatCurrency, getCurrentWeekOfMonth } from '../utils/dateUtils';

export function Dashboard() {
  const { monthlySummary, weeklySummaries, categoryBreakdown } = useFinance();
  const currentWeek = getCurrentWeekOfMonth();
  const currentWeekSummary = weeklySummaries[currentWeek - 1];

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      Shopping: { icon: ShoppingBag, color: 'from-pink-500 to-rose-500' },
      Food: { icon: UtensilsCrossed, color: 'from-orange-500 to-amber-500' },
      Transport: { icon: Car, color: 'from-blue-500 to-cyan-500' },
      Rent: { icon: Home, color: 'from-green-500 to-emerald-500' },
      Other: { icon: Package, color: 'from-purple-500 to-violet-500' },
    };
    return iconMap[category as ExpenseCategory] || iconMap.Other;
  };

  const stats = [
    {
      title: 'Monthly Budget',
      value: formatCurrency(monthlySummary.totalBudget),
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(monthlySummary.totalSpent),
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Remaining',
      value: formatCurrency(monthlySummary.totalRemaining),
      icon: TrendingUp,
      color: monthlySummary.totalRemaining >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
    },
    {
      title: 'This Week Remaining',
      value: formatCurrency(currentWeekSummary?.remaining || 0),
      icon: Calendar,
      color: (currentWeekSummary?.remaining || 0) >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <div className="flex items-center space-x-4">
          {/* Desktop Quick Add Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-add-expense'))}
            className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add</span>
          </button>
          <div className="text-sm text-gray-400">
            Current Week: Week {currentWeek}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 break-all">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">Monthly Usage</h3>
          <span className="text-sm text-gray-400">
            {monthlySummary.usagePercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r transition-all duration-500 ${
              monthlySummary.usagePercentage > 100
                ? 'from-red-500 to-red-600'
                : monthlySummary.usagePercentage > 80
                ? 'from-yellow-500 to-orange-600'
                : 'from-blue-500 to-purple-600'
            }`}
            style={{
              width: `${Math.min(monthlySummary.usagePercentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Weekly Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {weeklySummaries.map((week) => (
            <div
              key={week.week}
              className={`p-4 rounded-lg border backdrop-blur-sm ${
                week.week === currentWeek
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Week {week.week}</p>
                <p className="text-sm sm:text-lg font-semibold text-white break-all">
                  {formatCurrency(week.spent)}
                </p>
                <p className="text-xs text-gray-400 break-all">
                  of {formatCurrency(week.allocated)}
                </p>
                <p
                  className={`text-xs font-medium mt-1 break-all ${
                    week.remaining >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {week.remaining >= 0 ? '+' : ''}{formatCurrency(week.remaining)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      {categoryBreakdown.length > 0 && (
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Top Categories</h3>
          <div className="space-y-3">
            {categoryBreakdown
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((category, index) => (
                <div key={category.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-4">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getCategoryIcon(category.name).color} shadow-lg hover:scale-110 transition-transform duration-200`}>
                      {(() => {
                        const Icon = getCategoryIcon(category.name).icon;
                        return <Icon className="w-4 h-4 text-white drop-shadow-sm" />;
                      })()}
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">{category.name}</span>
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base break-all">{formatCurrency(category.value)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}