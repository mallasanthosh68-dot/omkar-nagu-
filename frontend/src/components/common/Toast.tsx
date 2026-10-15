import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-200',
    error: 'border-rose-500/40 bg-slate-900/95 text-rose-200',
    warning: 'border-amber-500/40 bg-slate-900/95 text-amber-200',
    info: 'border-sky-500/40 bg-slate-900/95 text-sky-200'
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-300 ${borders[type]}`}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1 text-slate-100">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
