import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: 'bg-white border-l-4 border-green-500 text-gray-800',
    error: 'bg-white border-l-4 border-red-500 text-gray-800',
    info: 'bg-white border-l-4 border-royal-gold text-gray-800',
  };
  const iconColors = { success: 'text-green-500', error: 'text-red-500', info: 'text-royal-gold' };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-slide-up ${colors[t.type]}`}
            >
              <Icon size={18} className={`mt-0.5 flex-shrink-0 ${iconColors[t.type]}`} />
              <p className="font-montserrat text-sm flex-1">{t.message}</p>
              <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
