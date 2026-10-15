import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getApiUrl } from '../../config/api';
import {
  Zap,
  Calendar,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Wrench,
  Layers,
  Sparkles,
  PhoneCall,
  TableProperties,
  LayoutGrid,
  ClipboardEdit,
  Edit3
} from 'lucide-react';
import { ServiceSelectionTable } from '../../components/booking/ServiceSelectionTable';
import { BackButton } from '../../components/common/BackButton';

interface CustomerDashboardProps {
  onOpenBooking: (category?: string, service?: any) => void;
  onOpenBookingDetails: (booking: Booking) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenBooking,
  onOpenBookingDetails
}) => {
  const { user, token } = useAuth();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Selected category accordion/tabs in dashboard
  const [activeTab, setActiveTab] = useState<'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other'>('Wiring');
  const [serviceViewMode, setServiceViewMode] = useState<'cards' | 'table'>('table');
  const [selectedDashboardService, setSelectedDashboardService] = useState('House Wiring (New & Complete)');


  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      try {
        const res = await fetch(getApiUrl('/api/bookings/my'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecentBookings(data.bookings || []);
        }
      } catch (err) {
        console.warn('Failed to fetch customer bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Counts
  const totalCount = recentBookings.length;
  const activeCount = recentBookings.filter(b => ['NEW', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length;
  const completedCount = recentBookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="py-8 lg:py-12 bg-transparent text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#0d3670] via-[#104b99] to-[#08244d] border border-sky-400/30 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-sky-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-left">
            <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Customer Service Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Welcome, {user?.name || 'Valued Customer'}
            </h1>
            <p className="text-sm sm:text-base text-sky-100 mt-1 font-medium">
              What electrical service do you need today?
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Service</span>
            </button>
            <Link
              to="/my-bookings"
              className="px-4 py-3 rounded-xl font-semibold text-sm bg-[#071c3b]/80 hover:bg-[#0c2b57] text-sky-200 border border-sky-400/30 transition-colors"
            >
              View All Bookings ({totalCount})
            </Link>
          </div>
        </div>

        {/* Quick Customer Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div>
              <span className="text-xs text-sky-300/80 font-medium block">Total Bookings</span>
              <span className="text-2xl font-bold text-white mt-1 block">{totalCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div>
              <span className="text-xs text-sky-300/80 font-medium block">In Progress / Scheduled</span>
              <span className="text-2xl font-bold text-amber-300 mt-1 block">{activeCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div>
              <span className="text-xs text-sky-300/80 font-medium block">Completed Services</span>
              <span className="text-2xl font-bold text-emerald-300 mt-1 block">{completedCount}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Interactive Custom Service & Description Board Callout Banner */}
        <div className="bg-gradient-to-r from-[#0b2b57] via-[#0f3d7d] to-[#1c1c4f] border border-amber-400/40 p-6 sm:p-7 rounded-2xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4 z-10">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-400/20 shrink-0">
              <ClipboardEdit className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  Custom Work Feature
                </span>
                <span className="text-xs text-sky-200">Need something not listed?</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">
                Select "Other" & Describe Your Exact Service on the Board
              </h3>
              <p className="text-xs sm:text-sm text-sky-100/80 mt-1 max-w-2xl leading-relaxed">
                Choose the <span className="text-amber-300 font-semibold">Other</span> service option to open our interactive <span className="text-amber-300 font-semibold">Service Description Board</span>. Type your custom requirements, appliance specs, or fault symptoms to get personalized master service.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
            <button
              onClick={() => onOpenBooking('Other', { category: 'Other', name: 'Custom Electrical Service' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ClipboardEdit className="w-4 h-4" />
              <span>Describe Custom Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Major Service Categories */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Select a Service Category</h2>
              <p className="text-xs sm:text-sm text-sky-200/80">Choose below to explore specialized packages or select "Other" to describe your custom needs.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 bg-[#071c3b]/85 p-1.5 rounded-xl border border-sky-400/25 self-start">
                {(['Wiring', 'Ceiling & Lighting', 'Panel Board', 'Other'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-sm'
                        : 'text-sky-200/80 hover:text-white'
                    }`}
                  >
                    {tab === 'Wiring' && '⚡ Wiring'}
                    {tab === 'Ceiling & Lighting' && '💡 Lighting'}
                    {tab === 'Panel Board' && '🔌 Panel Board'}
                    {tab === 'Other' && '🛠️ Other / Custom'}
                  </button>
                ))}
              </div>

              {/* Template View Switcher */}
              <div className="flex items-center gap-1 bg-[#061c3b] p-1 rounded-xl border border-sky-400/25">
                <button
                  type="button"
                  onClick={() => setServiceViewMode('table')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    serviceViewMode === 'table'
                      ? 'bg-sky-400 text-slate-950 font-bold'
                      : 'text-sky-300/70 hover:text-white'
                  }`}
                  title="Switch to Table Template"
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setServiceViewMode('cards')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    serviceViewMode === 'cards'
                      ? 'bg-sky-400 text-slate-950 font-bold'
                      : 'text-sky-300/70 hover:text-white'
                  }`}
                  title="Switch to Cards View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
              </div>
            </div>
          </div>

          {/* TABLE TEMPLATE VIEW */}
          {serviceViewMode === 'table' ? (
            <div className="space-y-4">
              <ServiceSelectionTable
                category={activeTab}
                selectedService={selectedDashboardService}
                onSelectService={(srv) => {
                  setSelectedDashboardService(srv);
                  onOpenBooking(activeTab, { category: activeTab, name: srv });
                }}
              />
            </div>
          ) : (
            <>


          {/* SERVICE CATEGORY 1 — WIRING */}
          {activeTab === 'Wiring' && (
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-left backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-400/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">⚡ WIRING SERVICES</h3>
                    <p className="text-xs text-sky-200/80">
                      Professional electrical wiring solutions for residential and commercial spaces.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking('Wiring')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 self-start shadow-md"
                >
                  Quick Book Wiring
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* House Wiring */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">House Wiring</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• New house wiring</li>
                      <li>• Complete house electrical wiring</li>
                      <li>• Rewiring & upgrades</li>
                      <li>• Switch/socket installation</li>
                      <li>• Fan/light point installation</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Wiring', { category: 'Wiring', name: 'House Wiring' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                {/* Apartment Wiring */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Apartment Wiring</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Individual apartment wiring</li>
                      <li>• Complete apartment electrical setup</li>
                      <li>• Old flat rewiring</li>
                      <li>• Dedicated heavy appliance lines</li>
                      <li>• Electrical point installation</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Wiring', { category: 'Wiring', name: 'Apartment Wiring' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                {/* Function Hall Wiring */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Function Hall Wiring</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Temporary electrical wiring</li>
                      <li>• Event wiring & load distribution</li>
                      <li>• High-power lighting links</li>
                      <li>• Generator transfer switches</li>
                      <li>• Stage electrical connections</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Wiring', { category: 'Wiring', name: 'Function Hall Wiring' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                {/* Other Wiring */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Commercial & Industrial</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Shop & showroom wiring</li>
                      <li>• Office server & cubicle feeds</li>
                      <li>• Commercial building conduit</li>
                      <li>• Industrial machine electricals</li>
                      <li>• Surge protection & grounding</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Wiring', { category: 'Wiring', name: 'Commercial & Shop Wiring' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SERVICE CATEGORY 2 — CEILING & LIGHTING */}
          {activeTab === 'Ceiling & Lighting' && (
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-left backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-400/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">💡 CEILING & LIGHTING SERVICES</h3>
                    <p className="text-xs text-sky-200/80">
                      Modern lighting design and ceiling electrical fixtures for beautiful, energy-efficient spaces.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking('Ceiling & Lighting')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 self-start shadow-md"
                >
                  Quick Book Lighting
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1.5">Ceiling Lights</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed">
                      Recessed lights, surface panel lights, LED downlights, and false ceiling cut-outs.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Ceiling & Lighting', { category: 'Ceiling & Lighting', name: 'Ceiling Lights Installation' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1.5">Profile Lighting</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed">
                      Modern LED profile lights, cove lighting, architectural grooves, and dimmers.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Ceiling & Lighting', { category: 'Ceiling & Lighting', name: 'Profile & Strip Lighting' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1.5">False Ceiling Wiring</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed">
                      Concealed wiring inside gypsum/POP, driver adapters, and fire-resistant cabling.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Ceiling & Lighting', { category: 'Ceiling & Lighting', name: 'False Ceiling Wiring' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1.5">Ceiling Fan Works</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed">
                      Ceiling fan installation, blade balancing, regulator replacement, and repair.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Ceiling & Lighting', { category: 'Ceiling & Lighting', name: 'Ceiling Fan Installation & Repair' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1.5">Chandeliers & Hanging</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed">
                      Pendant lighting, decorative fixtures, chandelier anchor mounting, and safety hooks.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Ceiling & Lighting', { category: 'Ceiling & Lighting', name: 'Chandelier & Pendant Mounting' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SERVICE CATEGORY 3 — PANEL BOARD */}
          {activeTab === 'Panel Board' && (
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-left backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-400/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">🔌 PANEL BOARD SERVICES</h3>
                    <p className="text-xs text-sky-200/80">
                      Heavy-duty power management, distribution boards, circuit breakers, and industrial panels.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking('Panel Board')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 self-start shadow-md"
                >
                  Quick Book Panel Board
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Main Panel Board</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed mb-3">
                      Main switchboard installation, electrical busbar arrangement, load balancing across phases.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Panel Board', { category: 'Panel Board', name: 'Main Panel Board Installation' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Sub Panel Board</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed mb-3">
                      Floor-wise sub-panels, departmental breaker boxes, commercial unit isolation switches.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Panel Board', { category: 'Panel Board', name: 'Sub Panel Board Setup' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Industrial & Commercial</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed mb-3">
                      3-phase industrial power panels, motor control centers (MCC), capacitor banks, generator changeovers.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Panel Board', { category: 'Panel Board', name: 'Industrial & Commercial Panels' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">Safety Upgrades & MCB</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed mb-3">
                      Distribution board overhaul, MCB/RCCB/ELCB installation, circuit combing, and safety audits.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Panel Board', { category: 'Panel Board', name: 'MCB / RCCB & Safety Upgrades' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SERVICE CATEGORY 4 — OTHER & CUSTOM SERVICES */}
          {activeTab === 'Other' && (
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-left backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-400/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">🛠️ OTHER & CUSTOM ELECTRICAL SERVICES</h3>
                    <p className="text-xs text-sky-200/80">
                      Unlisted electrical jobs, specialty appliance setups, emergency fault diagnosis, and customized work.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking('Other', { category: 'Other', name: 'Custom Electrical Service' })}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 self-start shadow-md flex items-center gap-1.5"
                >
                  <ClipboardEdit className="w-3.5 h-3.5" />
                  <span>Open Description Board</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Custom Electrical Service */}
                <div className="bg-gradient-to-b from-[#091f42] to-[#061833] p-5 rounded-xl border border-amber-400/30 flex flex-col justify-between space-y-4 shadow-lg">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40 px-2 py-0.5 rounded-sm">
                        Interactive Board
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Custom Electrical Work</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Unlisted residential or commercial work</li>
                      <li>• Type details in our description board</li>
                      <li>• Free upfront estimate & assessment</li>
                      <li>• Flexible scheduling & priority technician</li>
                      <li>• Certified materials & workmanship</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Other', { category: 'Other', name: 'Custom Electrical Service' })}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <ClipboardEdit className="w-3.5 h-3.5" />
                    <span>Describe & Book</span>
                  </button>
                </div>

                {/* Emergency Fault Diagnosis */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-400/15 border border-rose-400/40 px-2 py-0.5 rounded-sm">
                        Urgent Priority
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Emergency Fault & Sparks</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Breaker tripping / sparking diagnosis</li>
                      <li>• Burning odor & short-circuit check</li>
                      <li>• Sudden power blackout isolation</li>
                      <li>• Loose connection & wire burn fix</li>
                      <li>• Urgent safety clearance report</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Other', { category: 'Other', name: 'Emergency Fault & Sparking Troubleshooting' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book Emergency Inspection
                  </button>
                </div>

                {/* Heavy Appliance & EV Charger */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-sky-300 bg-sky-400/15 border border-sky-400/40 px-2 py-0.5 rounded-sm">
                        High Load
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">High-Load Appliance & EV</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Dedicated EV charger power line</li>
                      <li>• 4.0mm - 10.0mm armored cable run</li>
                      <li>• Heavy rotary isolator switch box</li>
                      <li>• Geyser, oven & heavy machine feeds</li>
                      <li>• Dedicated circuit breaker hookup</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Other', { category: 'Other', name: 'High-Load Appliance & EV Charger Wiring' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book Heavy Line Setup
                  </button>
                </div>

                {/* Full Renovation Overhaul */}
                <div className="bg-[#071c3b]/85 p-5 rounded-xl border border-sky-400/20 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/15 border border-emerald-400/40 px-2 py-0.5 rounded-sm">
                        Full Modernization
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Renovation & Rewiring</h4>
                    <ul className="space-y-1.5 text-xs text-sky-100">
                      <li>• Old apartment / house complete rewiring</li>
                      <li>• Removal of defective aluminum wires</li>
                      <li>• Concealed layout redesign</li>
                      <li>• Inverter backup reorganization</li>
                      <li>• Full safety and load compliance</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onOpenBooking('Other', { category: 'Other', name: 'Full Renovation & Rewiring Audit' })}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 transition-colors"
                  >
                    Book Renovation Overhaul
                  </button>
                </div>
              </div>
            </div>
          )}
          </>
        )}
      </div>


        {/* Recent Service Bookings Snippet */}
        <div className="bg-[#0c2b57]/75 border border-sky-400/25 rounded-2xl p-6 sm:p-8 space-y-6 text-left backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Recent Service Requests</h3>
              <p className="text-xs text-sky-200/80">Track current status and schedule timeline</p>
            </div>
            <Link
              to="/my-bookings"
              className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingBookings ? (
            <div className="py-8 text-center text-xs text-sky-300/60">Loading bookings...</div>
          ) : recentBookings.length === 0 ? (
            <div className="py-10 text-center space-y-3 bg-[#071c3b]/50 rounded-xl border border-sky-400/20">
              <Calendar className="w-8 h-8 text-sky-400/40 mx-auto" />
              <p className="text-sm font-semibold text-sky-100">No bookings yet</p>
              <p className="text-xs text-sky-300/70">Book your first electrical service today.</p>
              <button
                onClick={() => onOpenBooking()}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-400 text-slate-950"
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBookings.slice(0, 3).map((bk) => (
                <div
                  key={bk.id}
                  onClick={() => onOpenBookingDetails(bk)}
                  className="bg-[#071c3b]/85 border border-sky-400/25 hover:border-sky-400/60 rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-300">{bk.bookingNumber}</span>
                    <StatusBadge status={bk.status} size="sm" />
                  </div>
                  <div>
                    {bk.serviceName.includes(' • ') ? (
                      <div>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full inline-block mb-1">
                          {bk.serviceName.split(' • ').length} Services
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {bk.serviceName.split(' • ')[0]} <span className="text-xs text-sky-300 font-normal">+{bk.serviceName.split(' • ').length - 1} more</span>
                        </h4>
                      </div>
                    ) : (
                      <h4 className="text-sm font-bold text-white">{bk.serviceName}</h4>
                    )}
                    <span className="text-[11px] text-sky-300/70 block mt-0.5">{bk.category}</span>
                  </div>
                  <div className="text-xs text-sky-200/70 flex items-center justify-between pt-2 border-t border-sky-400/20">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      {bk.preferredDate}
                    </span>
                    <span className="text-[11px] text-sky-300 font-medium">Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
