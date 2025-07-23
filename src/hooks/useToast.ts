import { useState, useCallback } from 'react';
import { ToastProps } from '../components/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'warning', message: string) => {
    const id = crypto.randomUUID();
    const newToast: ToastProps = {
      id,
      type,
      message,
      onClose: () => {},
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    addToast('success', message);
  }, [addToast]);

  const showError = useCallback((message: string) => {
    addToast('error', message);
  }, [addToast]);

  const showWarning = useCallback((message: string) => {
    addToast('warning', message);
  }, [addToast]);

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
  };
}