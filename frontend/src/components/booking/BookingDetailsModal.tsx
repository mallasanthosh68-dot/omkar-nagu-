import React from 'react';
import { Booking } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { openWhatsAppBooking } from '../../utils/whatsapp';
import { getImageUrl } from '../../config/api';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Phone,
  FileText,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  Clock3,
  Check,
  AlertCircle
} from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminView?: boolean;
  onUpdateStatus?: (bookingId: string, newStatus: any) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  isAdminView = false,
  onUpdateStatus
}) => {
  if (!isOpen || !booking) return null;

  const statuses = ['NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] as const;
  const currentStatusIndex = statuses.indexOf(booking.status as any);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051634]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#08234d] border border-sky-400/30 rounded-2xl shadow-2xl shadow-[#04142b]/70 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#061c3d] border-b border-sky-400/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/35 text-sky-300">
              {booking.bookingNumber}
            </span>
            <StatusBadge status={booking.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-300 hover:text-white hover:bg-sky-500/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Timeline */}
          {booking.status !== 'CANCELLED' ? (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">
                Service Progress
              </span>
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
                <div
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#5B86B6] -z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStatusIndex / (statuses.length - 1)) * 100)}%`
                  }}
                />

                {statuses.map((st, idx) => {
                  const isDone = currentStatusIndex >= idx;
                  const isCurrent = currentStatusIndex === idx;

                  return (
                    <div key={st} className="flex flex-col items-center z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#5B86B6] text-white ring-4 ring-[#5B86B6]/20 shadow-md'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                          isCurrent
                            ? 'text-white font-bold'
                            : isDone
                            ? 'text-[#5B86B6]'
                            : 'text-slate-500'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>This booking was cancelled.</span>
            </div>
          )}

          {/* Service Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">Service Category</span>
              <p className="font-semibold text-white text-base">{booking.category}</p>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">
                Specific Services {booking.serviceName.includes(' • ') ? `(${booking.serviceName.split(' • ').length} selected)` : ''}
              </span>
              {booking.serviceName.includes(' • ') ? (
                <div className="space-y-1.5 mt-1">
                  {booking.serviceName.split(' • ').map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{item.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-semibold text-amber-300 text-base">{booking.serviceName}</p>
              )}
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <Calendar className="w-5 h-5 text-[#5B86B6] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block">Preferred Date & Time</span>
                <p className="text-sm font-semibold text-slate-200">{booking.preferredDate}</p>
                <p className="text-xs text-slate-400">{booking.preferredTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <MapPin className="w-5 h-5 text-[#5B86B6] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block">Service Address</span>
                <p className="text-sm text-slate-200 leading-snug">{booking.address}</p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="flex items-start gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <UserIcon className="w-5 h-5 text-[#5B86B6] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs text-slate-500 block">Customer Information</span>
              <p className="text-sm font-semibold text-white">{booking.customerName}</p>
              <div className="flex items-center gap-4 mt-1">
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  <Phone className="w-3 h-3" />
                  {booking.customerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-500 block mb-1">Work Description</span>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {booking.description}
            </p>
          </div>

          {/* Uploaded Photo Preview if any */}
          {booking.imageUrl && (
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-2">Uploaded Setup / Problem Photo</span>
              <div className="w-full max-h-60 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                <img
                  src={getImageUrl(booking.imageUrl)}
                  alt="Customer Uploaded Photo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => openWhatsAppBooking(booking)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Send to WhatsApp
              </button>

              <a
                href={`tel:${booking.customerPhone}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Call Customer
              </a>
            </div>

            {/* Admin status update quick actions */}
            {isAdminView && onUpdateStatus && (
              <div className="flex items-center gap-2">
                {booking.status === 'NEW' && (
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'CONFIRMED')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Confirm Booking
                  </button>
                )}
                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'IN_PROGRESS')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white"
                  >
                    Start Service
                  </button>
                )}
                {booking.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'COMPLETED')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Mark Completed
                  </button>
                )}
                {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onUpdateStatus(booking.id, 'CANCELLED')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
