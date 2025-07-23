import React from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useFinance } from '../hooks/useFinance';
import { formatCurrency } from '../utils/dateUtils';

export function Reports() {
  const { weeklySummaries, categoryBreakdown, monthlySummary } = useFinance();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const weeklyData = weeklySummaries.map(week => ({
    week: `Week ${week.week}`,
    allocated: week.allocated,
    spent: week.spent,
    remaining: week.remaining,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Budget Usage</h3>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {monthlySummary.usagePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400 break-all">
              {formatCurrency(monthlySummary.totalSpent)} of {formatCurrency(monthlySummary.totalBudget)}
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PieChart className="w-6 h-6 text-green-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Categories</h3>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {categoryBreakdown.length}
            </div>
            <div className="text-sm text-gray-400">
              Active spending categories
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">Weekly Avg</h3>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2 break-all">
              {formatCurrency(monthlySummary.totalSpent / 4)}
            </div>
            <div className="text-sm text-gray-400">
              Average weekly spending
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Category Breakdown</h3>
          {categoryBreakdown.length > 0 ? (
            <div className="h-64 sm:h-80 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 sm:h-80 flex items-center justify-center text-gray-400">
              No expenses to display
            </div>
          )}
        </div>

        {/* Weekly Spending Chart */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Weekly Spending</h3>
          <div className="h-64 sm:h-80 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `₨${value/1000}k`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'allocated' ? 'Allocated' : name === 'spent' ? 'Spent' : 'Remaining'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Legend />
                <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" radius={[2, 2, 0, 0]} />
                <Bar dataKey="spent" fill="#EF4444" name="Spent" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Weekly Breakdown */}
      <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Detailed Weekly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-gray-300 font-medium text-sm sm:text-base">Week</th>
                <th className="text-right py-3 text-gray-300 font-medium text-sm sm:text-base">Allocated</th>
                <th className="text-right py-3 text-gray-300 font-medium text-sm sm:text-base">Spent</th>
                <th className="text-right py-3 text-gray-300 font-medium text-sm sm:text-base">Remaining</th>
                <th className="text-right py-3 text-gray-300 font-medium text-sm sm:text-base">Usage</th>
              </tr>
            </thead>
            <tbody>
              {weeklySummaries.map((week) => {
                const usagePercent = week.allocated > 0 ? (week.spent / week.allocated) * 100 : 0;
                
                return (
                  <tr key={week.week} className="border-b border-white/5">
                    <td className="py-4 text-white font-medium text-sm sm:text-base">Week {week.week}</td>
                    <td className="py-4 text-right text-gray-300 text-sm sm:text-base">{formatCurrency(week.allocated)}</td>
                    <td className="py-4 text-right text-white text-sm sm:text-base">{formatCurrency(week.spent)}</td>
                    <td className={`py-4 text-right font-medium ${
                      week.remaining >= 0 ? 'text-green-400' : 'text-red-400'
                    } text-sm sm:text-base`}>
                      {formatCurrency(week.remaining)}
                    </td>
                    <td className="py-4 text-right text-sm sm:text-base">
                      <span className={`font-medium ${
                        usagePercent > 100 ? 'text-red-400' : 
                        usagePercent > 80 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {usagePercent.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}