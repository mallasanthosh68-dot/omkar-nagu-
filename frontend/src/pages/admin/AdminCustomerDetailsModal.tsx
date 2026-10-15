import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { openWhatsAppBooking } from '../../utils/whatsapp';
import { getApiUrl } from '../../config/api';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  PhoneCall,
  ShieldAlert
} from 'lucide-react';

interface AdminCustomerDetailsModalProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
}

export const AdminCustomerDetailsModal: React.FC<AdminCustomerDetailsModalProps> = ({
  customerId,
  isOpen,
  onClose,
  onSelectBooking
}) => {
  const { token } = useAuth();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId || !token) return;
      setLoading(true);
      try {
        const res = await fetch(getApiUrl(`/api/admin/customers/${customerId}`), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomerData(data.customer);
        }
      } catch (err) {
        console.error('Error fetching customer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId, token]);

  if (!isOpen || !customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#142338] border border-[#5B86B6]/30 rounded-2xl shadow-2xl overflow-hidden my-8 text-left">
        {/* Header */}
        <div className="bg-[#101c2e] border-b border-[#5B86B6]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5B86B6]/20 text-[#5B86B6]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Customer Profile & History</h3>
              <p className="text-xs text-slate-400">Section 27 • Omkar Nagu Electrical Works</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2d47] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {loading || !customerData ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading customer information...</div>
          ) : (
            <>
              {/* Customer Info Card */}
              <div className="bg-[#0d1624] p-5 rounded-xl border border-[#5B86B6]/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-bold text-white">{customerData.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-sm text-[#5B86B6]">{customerData.phone}</span>
                      <a
                        href={`tel:${customerData.phone}`}
                        className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                        title="Call Customer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/91${customerData.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      </a>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 self-start">
                    Customer Since {new Date(customerData.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-[#5B86B6]/15 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-[#5B86B6] shrink-0 mt-0.5" />
                  <span>{customerData.address}</span>
                </div>
              </div>

              {/* Statistics Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#0d1624] p-3.5 rounded-xl border border-[#5B86B6]/20">
                  <span className="text-[11px] text-slate-400 block">Total Bookings</span>
                  <span className="text-2xl font-bold text-white mt-1 block">{customerData.totalBookings}</span>
                </div>
                <div className="bg-[#0d1624] p-3.5 rounded-xl border border-[#5B86B6]/20">
                  <span className="text-[11px] text-slate-400 block">Pending / Active</span>
                  <span className="text-2xl font-bold text-amber-300 mt-1 block">{customerData.pendingServices}</span>
                </div>
                <div className="bg-[#0d1624] p-3.5 rounded-xl border border-[#5B86B6]/20">
                  <span className="text-[11px] text-slate-400 block">Completed</span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">{customerData.completedServices}</span>
                </div>
              </div>

              {/* Customer Booking History (Section 27) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Complete Service Booking History
                </h4>

                {customerData.bookingHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No service history found.</p>
                ) : (
                  <div className="space-y-2.5">
                    {customerData.bookingHistory.map((bk: Booking) => (
                      <div
                        key={bk.id}
                        className="bg-[#0d1624] p-3.5 rounded-xl border border-[#5B86B6]/20 flex items-center justify-between gap-3 hover:border-[#5B86B6]/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#5B86B6]">{bk.bookingNumber}</span>
                            <StatusBadge status={bk.status} size="sm" />
                          </div>
                          <span className="text-sm font-semibold text-white mt-1 block">{bk.serviceName}</span>
                          <span className="text-[11px] text-slate-400 block">
                            Date: {bk.preferredDate} • {bk.preferredTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectBooking(bk);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => openWhatsAppBooking(bk)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
                            title="Send to WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
