import React from 'react';
import { BookingStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true
}) => {
  const configs: Record<BookingStatus, { label: string; bg: string; text: string; border: string; dot: string; symbol: string }> = {
    NEW: {
      label: 'New Request',
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
      symbol: '🟡'
    },
    CONFIRMED: {
      label: 'Confirmed',
      bg: 'bg-blue-500/15',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
      dot: 'bg-blue-400',
      symbol: '🔵'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-orange-500/15',
      text: 'text-orange-300',
      border: 'border-orange-500/30',
      dot: 'bg-orange-400',
      symbol: '🟠'
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      symbol: '🟢'
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-rose-500/15',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
      symbol: '🔴'
    }
  };

  const config = configs[status] || configs.NEW;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
