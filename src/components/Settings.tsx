import React, { useRef } from 'react';
import { Settings as SettingsIcon, Download, Upload, Trash2, Database } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { ConfirmationModal } from './ConfirmationModal';

export function Settings() {
  const { exportData, importData, expenses } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearDataModal, setShowClearDataModal] = React.useState(false);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('finance-budget');
    localStorage.removeItem('finance-expenses');
    setShowClearDataModal(false);
    (window as any).showToast?.showSuccess('All data cleared successfully!');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-slate-600">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Management</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white mb-2">Export Data</h4>
              <p className="text-sm text-gray-400 mb-3">
                Download your budget and expense data as a JSON file for backup.
              </p>
              <button
                onClick={exportData}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 min-h-[44px] w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white mb-2">Import Data</h4>
              <p className="text-sm text-gray-400 mb-3">
                Restore your budget and expense data from a previously exported file.
              </p>
              <button
                onClick={handleImport}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 min-h-[44px] w-full sm:w-auto"
              >
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <h4 className="font-medium text-red-400 mb-2">Clear All Data</h4>
              <p className="text-sm text-gray-400 mb-3">
                Permanently delete all budget and expense data. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowClearDataModal(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 min-h-[44px] w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-6">App Information</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white mb-2">Storage</h4>
              <p className="text-sm text-gray-400 break-words">
                All data is stored locally in your browser. No data is sent to external servers.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white mb-2">Data Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Expenses:</span>
                  <span className="text-white">{expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Used:</span>
                  <span className="text-white">
                    {Math.round((JSON.stringify({ expenses }).length / 1024) * 100) / 100} KB
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-medium text-white mb-2">Features</h4>
              <ul className="space-y-1 text-sm text-gray-400 break-words">
                <li>• Monthly and weekly budget planning</li>
                <li>• Automatic expense categorization</li>
                <li>• Real-time balance tracking</li>
                <li>• Visual charts and analytics</li>
                <li>• Data export and import</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="Are you sure you want to permanently delete all budget and expense data? This action cannot be undone and you will lose all your financial records."
        confirmText="Yes, Clear All Data"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}