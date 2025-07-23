import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AddExpense } from './components/AddExpense';
import { BudgetPlanning } from './components/BudgetPlanning';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { ExpenseList } from './components/ExpenseList';
import { ToastContainer } from './components/ToastContainer';
import { useToast } from './hooks/useToast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  // Listen for custom navigation events
  React.useEffect(() => {
    const handleNavigateToAddExpense = () => {
      setActiveTab('add-expense');
    };

    window.addEventListener('navigate-to-add-expense', handleNavigateToAddExpense);
    return () => {
      window.removeEventListener('navigate-to-add-expense', handleNavigateToAddExpense);
    };
  }, []);

  // Provide toast context to child components
  React.useEffect(() => {
    (window as any).showToast = { showSuccess, showError, showWarning };
  }, [showSuccess, showError, showWarning]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard />
            <ExpenseList />
          </div>
        );
      case 'add-expense':
        return <AddExpense />;
      case 'budget':
        return <BudgetPlanning />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0 pt-20 lg:pt-6">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => setActiveTab('add-expense')}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-blue-500 to-cyan-400 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 active:scale-95 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm border border-white/20"
        aria-label="Add Expense"
      >
        <div className="relative">
          <Plus className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/30 transition-all duration-200" />
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </button>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;