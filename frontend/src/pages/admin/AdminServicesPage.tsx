import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ServiceItem } from '../../types';
import { INITIAL_SERVICES } from '../../data/servicesData';
import { CheckCircle2, Search } from 'lucide-react';
import { getApiUrl } from '../../config/api';


export const AdminServicesPage: React.FC = () => {
  const { token } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(getApiUrl('/api/services'));
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
        } else {
          setServices(INITIAL_SERVICES);
        }
      } catch {
        setServices(INITIAL_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  const filtered = services.filter((s) => {
    const matchesCat = selectedCat === 'ALL' || s.category === selectedCat;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5B86B6]/20 pb-4">
        <div>
          <span className="text-xs font-bold text-[#5B86B6] uppercase tracking-wider block">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Electrical Service Offerings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active service catalog displayed on the customer booking portal
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service..."
            className="w-full bg-[#142338] border border-[#5B86B6]/30 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#5B86B6]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Wiring', 'Ceiling & Lighting', 'Panel Board'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-[#5B86B6] text-white shadow-md'
                : 'bg-[#142338] text-slate-400 hover:text-white border border-[#5B86B6]/20'
            }`}
          >
            {cat === 'ALL' && 'All Offerings'}
            {cat === 'Wiring' && '⚡ Wiring'}
            {cat === 'Ceiling & Lighting' && '💡 Ceiling & Lighting'}
            {cat === 'Panel Board' && '🔌 Panel Boards'}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-[#142338] border border-[#5B86B6]/25 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B86B6] bg-[#5B86B6]/10 px-2 py-0.5 rounded border border-[#5B86B6]/30">
                  {srv.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Active in Portal
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{srv.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.description}</p>

              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Service Specs:
                </span>
                {srv.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B86B6] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#5B86B6]/20 flex items-center justify-between text-xs text-slate-400">
              <span>Standard Pricing / Quote</span>
              <span className="text-sky-300 font-semibold">Available for Booking</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
