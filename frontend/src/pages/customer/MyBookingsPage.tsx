import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { openWhatsAppBooking } from '../../utils/whatsapp';
import { getApiUrl } from '../../config/api';
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  MessageSquare,
  Search,
  Eye
} from 'lucide-react';

interface MyBookingsPageProps {
  onOpenBooking: () => void;
  onOpenBookingDetails: (booking: Booking) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onOpenBooking,
  onOpenBookingDetails
}) => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/bookings/my'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const filterTabs = [
    { id: 'ALL', label: 'All Bookings', count: bookings.length },
    { id: 'NEW', label: '🟡 New', count: bookings.filter(b => b.status === 'NEW').length },
    { id: 'CONFIRMED', label: '🔵 Confirmed', count: bookings.filter(b => b.status === 'CONFIRMED').length },
    { id: 'IN_PROGRESS', label: '🟠 In Progress', count: bookings.filter(b => b.status === 'IN_PROGRESS').length },
    { id: 'COMPLETED', label: '🟢 Completed', count: bookings.filter(b => b.status === 'COMPLETED').length },
    { id: 'CANCELLED', label: '🔴 Cancelled', count: bookings.filter(b => b.status === 'CANCELLED').length },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-10 bg-transparent text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-400/20 pb-6 text-left">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              My Service Bookings
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
              Track status updates, technician appointments, and WhatsApp communications
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md shadow-sky-500/25 self-start transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Service</span>
          </button>
        </div>

        {/* Status Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-sky-500/25'
                    : 'bg-[#0c2b57]/80 text-sky-200 hover:text-white border border-sky-400/20'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-[#071c3b] text-sky-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-sky-400/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or service..."
              className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
            />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-16 text-center text-sm text-sky-300/60">
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center bg-[#0c2b57]/50 rounded-2xl border border-sky-400/25 p-8 space-y-4">
            <Calendar className="w-12 h-12 text-sky-400/40 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">No bookings found</h3>
              <p className="text-xs text-sky-200/80 mt-1 max-w-sm mx-auto">
                {bookings.length === 0
                  ? 'Book your first electrical service today and experience prompt, certified service.'
                  : 'No bookings match your current filter or search criteria.'}
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-400 text-slate-950 shadow-md shadow-sky-500/25 hover:bg-sky-300 transition-all"
            >
              Book Service Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((bk) => (
              <div
                key={bk.id}
                className="bg-[#0c2b57]/75 border border-sky-400/25 hover:border-sky-400/60 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-[#04142b]/50 transition-all duration-300 hover:translate-y-[-2px] text-left group backdrop-blur-md"
              >
                <div className="space-y-4">
                  {/* Top Bar: ID and Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-300 bg-sky-500/15 px-2.5 py-1 rounded-md border border-sky-400/30">
                      {bk.bookingNumber}
                    </span>
                    <StatusBadge status={bk.status} size="sm" />
                  </div>

                  {/* Service & Category */}
                  <div>
                    {bk.serviceName.includes(' • ') ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                            {bk.serviceName.split(' • ').length} Services
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                          {bk.serviceName.split(' • ')[0]}
                          <span className="text-xs text-sky-300/80 font-normal ml-1">
                            +{bk.serviceName.split(' • ').length - 1} more
                          </span>
                        </h3>
                      </div>
                    ) : (
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                        {bk.serviceName}
                      </h3>
                    )}
                    <span className="text-xs text-sky-300/80 font-medium">{bk.category}</span>
                  </div>

                  {/* Schedule Details */}
                  <div className="bg-[#071c3b]/80 p-3 rounded-xl border border-sky-400/20 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-sky-100">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span>Date: <strong className="text-white">{bk.preferredDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sky-100">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Time: <strong className="text-white">{bk.preferredTime}</strong></span>
                    </div>
                    <div className="flex items-start gap-2 text-sky-200/70">
                      <MapPin className="w-3.5 h-3.5 text-sky-400/70 shrink-0 mt-0.5" />
                      <span className="truncate">{bk.address}</span>
                    </div>
                  </div>

                  {/* Brief Description */}
                  <p className="text-xs text-sky-200/80 line-clamp-2 leading-relaxed">
                    {bk.description}
                  </p>
                </div>

                {/* Actions: View Details & WhatsApp */}
                <div className="pt-4 mt-4 border-t border-sky-400/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenBookingDetails(bk)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#071c3b]/90 hover:bg-[#113a73] text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => openWhatsAppBooking(bk)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all"
                    title="Send Details to WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
