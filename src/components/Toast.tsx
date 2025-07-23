import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-100';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-100';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-100';
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border backdrop-blur-md ${getStyles()} shadow-lg animate-in slide-in-from-top duration-300 w-full max-w-md sm:max-w-sm mx-auto sm:mx-0`}>
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="font-medium text-sm sm:text-base break-words">{message}</span>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}