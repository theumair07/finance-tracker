import React from 'react';
import { Trash2, Calendar, ShoppingBag, UtensilsCrossed, Car, Home, Package } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { ConfirmationModal } from './ConfirmationModal';
import { ExpenseCategory } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/dateUtils';

export function ExpenseList() {
  const { expenses, deleteExpense } = useFinance();
  const [confirmDelete, setConfirmDelete] = React.useState<{ isOpen: boolean; expenseId: string | null }>({
    isOpen: false,
    expenseId: null
  });

  const getCategoryIcon = (category: ExpenseCategory) => {
    const iconMap = {
      Shopping: { icon: ShoppingBag, color: 'from-pink-500 to-rose-500' },
      Food: { icon: UtensilsCrossed, color: 'from-orange-500 to-amber-500' },
      Transport: { icon: Car, color: 'from-blue-500 to-cyan-500' },
      Rent: { icon: Home, color: 'from-green-500 to-emerald-500' },
      Other: { icon: Package, color: 'from-purple-500 to-violet-500' },
    };
    return iconMap[category] || iconMap.Other;
  };

  const handleDeleteClick = (expenseId: string) => {
    setConfirmDelete({ isOpen: true, expenseId });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.expenseId) {
      deleteExpense(confirmDelete.expenseId);
      (window as any).showToast?.showSuccess('Expense deleted successfully!');
    }
    setConfirmDelete({ isOpen: false, expenseId: null });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, expenseId: null });
  };

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (expenses.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-6 sm:p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Expenses Yet</h3>
        <p className="text-gray-400">Start tracking your finances by adding your first expense.</p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Recent Expenses</h3>
      
      <div className="space-y-3">
        {sortedExpenses.slice(0, 10).map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryIcon(expense.category).color} shadow-lg hover:scale-110 transition-transform duration-200`}>
                  {(() => {
                    const Icon = getCategoryIcon(expense.category).icon;
                    return <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <span className="font-medium text-white text-sm sm:text-base break-all">{formatCurrency(expense.amount)}</span>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryIcon(expense.category).color} bg-opacity-20 text-white whitespace-nowrap`}>
                      {expense.category}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 whitespace-nowrap">
                      Week {expense.week}
                    </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                    <span className="text-sm text-gray-400">{formatDate(expense.date)}</span>
                    {expense.notes && (
                      <span className="text-sm text-gray-300 break-words">{expense.notes}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDeleteClick(expense.id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {expenses.length > 10 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">
            Showing 10 of {expenses.length} expenses
          </span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}