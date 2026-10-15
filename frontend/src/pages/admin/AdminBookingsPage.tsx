import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { openWhatsAppBooking } from '../../utils/whatsapp';
import { getApiUrl } from '../../config/api';
import {
  CalendarDays,
  Clock,
  MapPin,
  PhoneCall,
  MessageSquare,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';

interface AdminBookingsPageProps {
  onOpenBookingDetails: (booking: Booking) => void;
}

export const AdminBookingsPage: React.FC<AdminBookingsPageProps> = ({ onOpenBookingDetails }) => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || 'ALL';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = statusParam && statusParam !== 'ALL'
        ? getApiUrl(`/api/admin/bookings?status=${statusParam}`)
        : getApiUrl('/api/admin/bookings');
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusParam, token]);

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(getApiUrl(`/api/admin/bookings/${id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All Bookings' },
    { id: 'NEW', label: '🟡 New Requests' },
    { id: 'CONFIRMED', label: '🔵 Confirmed' },
    { id: 'IN_PROGRESS', label: '🟠 In Progress' },
    { id: 'COMPLETED', label: '🟢 Completed (History)' },
    { id: 'CANCELLED', label: '🔴 Cancelled' }
  ];

  const filtered = bookings.filter((b) => {
    return (
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5B86B6]/20 pb-4">
        <div>
          <span className="text-xs font-bold text-[#5B86B6] uppercase tracking-wider block">
            Operations Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {statusParam === 'NEW' && 'New Service Requests (Pending Review)'}
            {statusParam === 'CONFIRMED' && 'Confirmed Electrical Bookings'}
            {statusParam === 'IN_PROGRESS' && 'Active Works In Progress'}
            {statusParam === 'COMPLETED' && 'Completed Services (Business History)'}
            {statusParam === 'CANCELLED' && 'Cancelled Service Requests'}
            {statusParam === 'ALL' && 'All Customer Service Bookings'}
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking or customer..."
            className="w-full bg-[#142338] border border-[#5B86B6]/30 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#5B86B6]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ status: tab.id })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusParam === tab.id
                ? 'bg-[#5B86B6] text-white shadow-md'
                : 'bg-[#142338] text-slate-400 hover:text-white border border-[#5B86B6]/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-[#142338] border border-[#5B86B6]/25 rounded-2xl p-5 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading service bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No bookings in this category</h3>
            <p className="text-xs text-slate-500">Service requests will appear here dynamically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#101c2e] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#5B86B6]/20">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Service Required</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5B86B6]/15">
                {filtered.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#1a2d47]/50 transition-colors">
                    {/* Booking ID */}
                    <td className="py-3 px-4 font-mono font-bold text-[#5B86B6] whitespace-nowrap">
                      {bk.bookingNumber}
                    </td>

                    {/* Customer & Direct Contacts */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{bk.customerName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-slate-300">{bk.customerPhone}</span>
                        <a
                          href={`tel:${bk.customerPhone}`}
                          className="p-1 rounded-md text-emerald-400 hover:bg-emerald-500/10"
                          title="Call Customer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openWhatsAppBooking(bk, bk.customerPhone)}
                          className="p-1 rounded-md text-emerald-400 hover:bg-emerald-500/10"
                          title="Open WhatsApp Chat with Customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white max-w-[170px] truncate">{bk.serviceName}</div>
                      <span className="text-[10px] text-slate-400 block">{bk.category}</span>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 max-w-[150px] truncate text-slate-300" title={bk.address}>
                      {bk.address}
                    </td>

                    {/* Schedule */}
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-300">
                      <div>{bk.preferredDate}</div>
                      <span className="text-[10px] text-slate-500">{bk.preferredTime}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={bk.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenBookingDetails(bk)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Status transition actions */}
                        {bk.status === 'NEW' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'CONFIRMED')}
                            disabled={actionLoadingId === bk.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                          >
                            Confirm Booking
                          </button>
                        )}

                        {bk.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'IN_PROGRESS')}
                            disabled={actionLoadingId === bk.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-xs"
                          >
                            Start Service
                          </button>
                        )}

                        {bk.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'COMPLETED')}
                            disabled={actionLoadingId === bk.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                          >
                            Complete
                          </button>
                        )}

                        {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'CANCELLED')}
                            disabled={actionLoadingId === bk.id}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            title="Reject / Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
