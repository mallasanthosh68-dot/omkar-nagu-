import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomerSummary, Booking } from '../../types';
import { AdminCustomerDetailsModal } from './AdminCustomerDetailsModal';
import { getApiUrl } from '../../config/api';
import {
  Users,
  Search,
  PhoneCall,
  MessageSquare,
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminCustomersPageProps {
  onOpenBookingDetails: (booking: Booking) => void;
}

export const AdminCustomersPage: React.FC<AdminCustomersPageProps> = ({ onOpenBookingDetails }) => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/api/admin/customers'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

  const filtered = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5B86B6]/20 pb-4">
        <div>
          <span className="text-xs font-bold text-[#5B86B6] uppercase tracking-wider block">
            Customer Directory (Section 27)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Registered Customers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Total {customers.length} registered customers across Visakhapatnam
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone..."
            className="w-full bg-[#142338] border border-[#5B86B6]/30 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#5B86B6]"
          />
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-[#142338] border border-[#5B86B6]/25 rounded-2xl p-5 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading customer profiles...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No customers found</h3>
            <p className="text-xs text-slate-500">Registered customers will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#101c2e] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#5B86B6]/20">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Registered Address</th>
                  <th className="py-3 px-4 text-center">Total Bookings</th>
                  <th className="py-3 px-4 text-center">Completed</th>
                  <th className="py-3 px-4 text-center">Pending</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5B86B6]/15">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#1a2d47]/50 transition-colors">
                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {cust.name}
                    </td>

                    {/* Phone + Call + WhatsApp */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300 text-xs">{cust.phone}</span>
                        <a
                          href={`tel:${cust.phone}`}
                          className="p-1 rounded text-emerald-400 hover:bg-emerald-500/10"
                          title="Call Customer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${cust.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-emerald-400 hover:bg-emerald-500/10"
                          title="WhatsApp Customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        </a>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 text-xs text-slate-300 max-w-[200px] truncate" title={cust.address}>
                      {cust.address}
                    </td>

                    {/* Total Bookings */}
                    <td className="py-3 px-4 text-center font-bold text-white">
                      {cust.totalBookings}
                    </td>

                    {/* Completed */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {cust.completedServices}
                      </span>
                    </td>

                    {/* Pending */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {cust.pendingServices}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#5B86B6] hover:bg-[#4a729e] text-white shadow-xs ml-auto transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal (Section 27) */}
      <AdminCustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onSelectBooking={onOpenBookingDetails}
      />
    </div>
  );
};
