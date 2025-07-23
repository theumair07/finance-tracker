import React, { useState } from 'react';
import { Plus, Save, X, ShoppingBag, UtensilsCrossed, Car, Home, Package } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { ExpenseCategory } from '../types/finance';
import { formatCurrency } from '../utils/dateUtils';

export function AddExpense() {
  const { addExpense, weeklySummaries } = useFinance();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Other');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    { value: 'Shopping' as ExpenseCategory, label: 'Shopping', icon: ShoppingBag, color: 'from-pink-500 to-rose-500' },
    { value: 'Food' as ExpenseCategory, label: 'Food', icon: UtensilsCrossed, color: 'from-orange-500 to-amber-500' },
    { value: 'Transport' as ExpenseCategory, label: 'Transport', icon: Car, color: 'from-blue-500 to-cyan-500' },
    { value: 'Rent' as ExpenseCategory, label: 'Rent', icon: Home, color: 'from-green-500 to-emerald-500' },
    { value: 'Other' as ExpenseCategory, label: 'Other', icon: Package, color: 'from-purple-500 to-violet-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      (window as any).showToast?.showError('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parseFloat(amount),
      category,
      notes: notes.trim(),
      date,
    });

    // Reset form
    setAmount('');
    setCategory('Other');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    
    (window as any).showToast?.showSuccess('Expense added successfully!');
  };

  const handleReset = () => {
    setAmount('');
    setCategory('Other');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Add New Expense</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                  value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer min-h-[44px]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-gray-800 text-white">
                        {cat.label}
                    </option>
                  ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {(() => {
                      const selectedCategory = categories.find(cat => cat.value === category);
                      if (selectedCategory) {
                        const Icon = selectedCategory.icon;
                        return (
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${selectedCategory.color} shadow-lg`}>
                            <Icon className="w-4 h-4 text-white drop-shadow-sm" />
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[44px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[44px]"
                >
                  <Save className="w-5 h-5" />
                  <span>Add Expense</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600/50 text-gray-300 font-medium rounded-lg hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center justify-center space-x-2 min-h-[44px] sm:flex-initial"
                >
                  <X className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Weekly Budget Status */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6 order-2 lg:order-2">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Weekly Status</h3>
          <div className="space-y-4">
            {weeklySummaries.map((week) => (
              <div
                key={week.week}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">Week {week.week}</span>
                  <span
                    className={`text-sm font-medium break-all ${
                      week.remaining >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(week.remaining)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      week.spent > week.allocated
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                    style={{
                      width: `${Math.min((week.spent / week.allocated) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1 gap-2">
                  <span>{formatCurrency(week.spent)}</span>
                  <span>{formatCurrency(week.allocated)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}