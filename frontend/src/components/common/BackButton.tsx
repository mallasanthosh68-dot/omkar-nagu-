import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  to?: string;
  className?: string;
  variant?: 'pill' | 'subtle' | 'header';
  onCustomBack?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  to,
  className = '',
  variant = 'pill',
  onCustomBack
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onCustomBack) {
      onCustomBack();
      return;
    }
    if (to) {
      navigate(to);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (variant === 'subtle') {
    return (
      <button
        type="button"
        onClick={handleBack}
        className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-300 hover:text-white transition-colors active:scale-95 cursor-pointer ${className}`}
        title="Go back to previous screen"
        aria-label={label}
      >
        <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'header') {
    return (
      <button
        type="button"
        onClick={handleBack}
        className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#08234d]/90 hover:bg-[#0e3774] border border-sky-400/35 text-xs sm:text-sm font-bold text-sky-200 hover:text-white transition-all shadow-md shadow-[#04142b]/60 active:scale-95 cursor-pointer backdrop-blur-md ${className}`}
        title="Go back to previous screen"
        aria-label={label}
      >
        <ArrowLeft className="w-4 h-4 text-sky-300 shrink-0" />
        <span>{label}</span>
      </button>
    );
  }

  // Default 'pill' variant
  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c2b57]/80 hover:bg-[#12396e] border border-sky-400/30 text-xs sm:text-sm font-semibold text-sky-200 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-sm ${className}`}
      title="Go back to previous screen"
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 text-sky-300 shrink-0" />
      <span>{label}</span>
    </button>
  );
};
