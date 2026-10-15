import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, CheckCircle2, AlertCircle, Save, Calendar, Clock, Shield } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export const CustomerProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Profile stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    activeBookings: 0,
    createdAt: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(getApiUrl('/api/customers/profile'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalBookings: data.profile.totalBookings,
            completedBookings: data.profile.completedBookings,
            activeBookings: data.profile.activeBookings,
            createdAt: data.profile.createdAt
          });
        }
      } catch (err) {
        console.warn('Failed to load profile details:', err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone number cannot be empty.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Service address cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/customers/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, address })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Profile update failed.');
      }

      updateUser(data.user);
      setSuccessMsg('Your profile has been updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-transparent text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Customer Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
            Manage your personal dispatch information and electrical service history
          </p>
        </div>

        {/* Profile Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-5 rounded-2xl shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <span className="text-xs text-sky-300/80 block">Total Services Booked</span>
            <span className="text-2xl font-bold text-white mt-1 block">{stats.totalBookings}</span>
          </div>
          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-5 rounded-2xl shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <span className="text-xs text-sky-300/80 block">Active Requests</span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{stats.activeBookings}</span>
          </div>
          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-5 rounded-2xl shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <span className="text-xs text-sky-300/80 block">Completed Works</span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">{stats.completedBookings}</span>
          </div>
        </div>

        {/* Profile Edit Card */}
        <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-6 sm:p-8 rounded-2xl shadow-xl shadow-[#04142b]/60 space-y-6 backdrop-blur-md">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-sky-200/90 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-sky-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sky-200/90 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-sky-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sky-200/90 mb-1.5">
                Default Service Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-sky-400/70" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-sky-400"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-sky-300/70 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Customer Account Protected by JWT & Encrypted Auth
              </span>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-sky-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
