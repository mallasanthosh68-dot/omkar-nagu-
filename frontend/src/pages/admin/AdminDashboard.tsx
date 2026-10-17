import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Booking, DashboardStats } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Electrical3DScene } from '../../components/3d/Electrical3DScene';
import { openWhatsAppBooking } from '../../utils/whatsapp';
import { getApiUrl } from '../../config/api';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Play,
  Check,
  XCircle,
  RefreshCw,
  Zap,
  TrendingUp,
  Sparkles,
  Shield,
  EyeOff,
  Copy
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenBookingDetails: (booking: Booking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenBookingDetails }) => {
  const { token } = useAuth();
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    new: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch(getApiUrl('/api/admin/dashboard/stats'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // 2. Bookings
      const bkRes = await fetch(getApiUrl('/api/admin/bookings'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bkRes.ok) {
        const bkData = await bkRes.json();
        setBookings(bkData.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Handle status update (Section 23)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
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
        // Refresh local data
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 text-left">
      {/* 1. Header with Brand Tone #5B86B6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5B86B6]/20 pb-4">
        <div>
          <span className="text-xs font-bold text-[#5B86B6] uppercase tracking-wider block">
            Central Dispatch & Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Operations Dashboard
          </h1>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1a2d47] hover:bg-[#233b5c] text-slate-200 border border-[#5B86B6]/30 self-start transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Admin Account & Access Information Card */}
      <div className="bg-[#0b244d]/85 border border-sky-400/30 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shrink-0 text-sky-300">
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">
                Admin Console Credentials
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Logged In Active
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1 text-xs">
              <span className="text-slate-300 font-mono">
                Username: <strong className="text-white">naguomkar@service.com</strong> <span className="text-sky-300/60">(or admin)</span>
              </span>
              <span className="text-slate-300 font-mono flex items-center gap-1.5">
                Password: <strong className="text-amber-300 font-bold">{showAdminSecret ? '26152215' : '••••••••'}</strong>
                <button
                  type="button"
                  onClick={() => setShowAdminSecret(!showAdminSecret)}
                  className="p-1 text-sky-400 hover:text-sky-200 transition-colors"
                  title={showAdminSecret ? 'Hide password' : 'Show password'}
                >
                  {showAdminSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText('Username: naguomkar@service.com\nPassword: 26152215');
            setSecretCopied(true);
            setTimeout(() => setSecretCopied(false), 2000);
          }}
          className="self-end md:self-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0c2b57] hover:bg-[#12386e] text-sky-200 border border-sky-400/30 transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
        >
          {secretCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-300" />}
          <span>{secretCopied ? 'Credentials Copied!' : 'Copy Credentials'}</span>
        </button>
      </div>

      {/* 2. 3D ELECTRICAL HARDWARE OBJECTS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            3D Quantum Arc Power Core [Interactive Energy Visualizer]
          </span>
        </div>
        <Electrical3DScene height="h-64 sm:h-72" />
      </div>

      {/* 3. ADMIN STATISTICS (Section 21) */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-sky-200 mb-3">
          Booking Statistics & Real-Time Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* TOTAL */}
          <div
            onClick={() => setStatusFilter('ALL')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'ALL'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 border-white/40 text-slate-950 font-bold shadow-lg scale-[1.02]'
                : 'bg-[#0c2b57]/75 border-sky-400/25 hover:border-sky-400/60'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
              TOTAL
            </span>
            <span className="text-2xl sm:text-3xl font-black mt-1 block">
              {stats.total}
            </span>
          </div>

          {/* NEW */}
          <div
            onClick={() => setStatusFilter('NEW')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'NEW'
                ? 'bg-amber-500 border-white/40 text-slate-950 shadow-lg scale-[1.02]'
                : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 opacity-90 block">
              NEW
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 block">
              {stats.new}
            </span>
          </div>

          {/* CONFIRMED */}
          <div
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'CONFIRMED'
                ? 'bg-blue-600 border-white/40 text-white shadow-lg scale-[1.02]'
                : 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 opacity-90 block">
              CONFIRMED
            </span>
            <span className="text-2xl sm:text-3xl font-black text-blue-300 mt-1 block">
              {stats.confirmed}
            </span>
          </div>

          {/* IN PROGRESS */}
          <div
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'IN_PROGRESS'
                ? 'bg-orange-500 border-white/40 text-white shadow-lg scale-[1.02]'
                : 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/60'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 opacity-90 block">
              IN PROGRESS
            </span>
            <span className="text-2xl sm:text-3xl font-black text-orange-300 mt-1 block">
              {stats.inProgress}
            </span>
          </div>

          {/* COMPLETED */}
          <div
            onClick={() => setStatusFilter('COMPLETED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-600 border-white/40 text-white shadow-lg scale-[1.02]'
                : 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 opacity-90 block">
              COMPLETED
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1 block">
              {stats.completed}
            </span>
          </div>

          {/* CANCELLED */}
          <div
            onClick={() => setStatusFilter('CANCELLED')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'CANCELLED'
                ? 'bg-rose-600 border-white/40 text-white shadow-lg scale-[1.02]'
                : 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 opacity-90 block">
              CANCELLED
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-300 mt-1 block">
              {stats.cancelled}
            </span>
          </div>
        </div>
      </div>

      {/* 4. ADMIN BOOKING MANAGEMENT TABLE (Section 22, 23, 24, 25, 26) */}
      <div className="bg-[#142338] border border-[#5B86B6]/25 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#5B86B6]" />
              <span>Service Bookings Console</span>
            </h2>
            <p className="text-xs text-slate-400">
              Showing {filteredBookings.length} bookings • Status workflow: NEW → CONFIRMED → IN PROGRESS → COMPLETED
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, ID, phone..."
              className="w-full bg-[#0d1624] border border-[#5B86B6]/30 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#5B86B6]"
            />
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#5B86B6] text-white shadow-xs'
                  : 'bg-[#0d1624] text-slate-400 hover:text-white border border-[#5B86B6]/20'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Table View (Desktop & Responsive) */}
        <div className="overflow-x-auto rounded-xl border border-sky-400/25 bg-[#0c2b57]/75 backdrop-blur-md">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#071c3b] text-sky-200 text-xs font-semibold uppercase tracking-wider border-b border-sky-400/20">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-400/15">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sky-300/60 text-xs">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#113a73]/60 transition-colors">
                    {/* Booking ID */}
                    <td className="py-3 px-4 font-mono font-bold text-sky-300 whitespace-nowrap">
                      {bk.bookingNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {bk.customerName}
                    </td>

                    {/* Phone + Direct WhatsApp / Call */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-mono text-xs">{bk.customerPhone}</span>
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
                      <div className="font-semibold text-white truncate max-w-[160px]">
                        {bk.serviceName}
                      </div>
                      <span className="text-[10px] text-slate-400">{bk.category}</span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-xs text-slate-300 max-w-[150px] truncate" title={bk.address}>
                      {bk.address}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-300">
                      <div>{bk.preferredDate}</div>
                      <span className="text-[10px] text-slate-500">{bk.preferredTime}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={bk.status} size="sm" />
                    </td>

                    {/* Actions Workflow (Section 22, 23) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => onOpenBookingDetails(bk)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Status workflow transitions */}
                        {bk.status === 'NEW' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'CONFIRMED')}
                            disabled={actionLoadingId === bk.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                            title="Confirm Booking"
                          >
                            Confirm
                          </button>
                        )}

                        {bk.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'IN_PROGRESS')}
                            disabled={actionLoadingId === bk.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-xs"
                            title="Start Service"
                          >
                            Start
                          </button>
                        )}

                        {bk.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'COMPLETED')}
                            disabled={actionLoadingId === bk.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                            title="Complete Service"
                          >
                            Complete
                          </button>
                        )}

                        {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(bk.id, 'CANCELLED')}
                            disabled={actionLoadingId === bk.id}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
