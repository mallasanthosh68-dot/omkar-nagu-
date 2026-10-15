import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INITIAL_SERVICES } from '../../data/servicesData';
import { ServiceItem } from '../../types';
import { Search, Filter, Zap, CheckCircle2, ArrowRight, LayoutGrid, TableProperties } from 'lucide-react';
import { ServiceSelectionTable } from '../../components/booking/ServiceSelectionTable';
import { BackButton } from '../../components/common/BackButton';


const electricalServices: ServiceItem[] = INITIAL_SERVICES;

interface ServicesPageProps {
  onOpenBooking: (category?: string, service?: ServiceItem) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBooking }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'All';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [selectedTableService, setSelectedTableService] = useState('House Wiring (New & Complete)');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      if (cat.toLowerCase().includes('wire')) setActiveCategory('Wiring');
      else if (cat.toLowerCase().includes('light')) setActiveCategory('Ceiling & Lighting');
      else if (cat.toLowerCase().includes('panel')) setActiveCategory('Panel Board');
      else if (cat.toLowerCase().includes('other') || cat.toLowerCase().includes('custom')) setActiveCategory('Other');
      else setActiveCategory('All');
    }
  }, [searchParams]);

  const categories = ['All', 'Wiring', 'Ceiling & Lighting', 'Panel Board', 'Other'];


  const filteredServices = electricalServices.filter((srv) => {
    let matchesCategory = true;
    if (activeCategory === 'Wiring') {
      matchesCategory = srv.category === 'Wiring';
    } else if (activeCategory === 'Ceiling & Lighting') {
      matchesCategory = srv.category === 'Ceiling & Lighting';
    } else if (activeCategory === 'Panel Board') {
      matchesCategory = srv.category === 'Panel Board';
    } else if (activeCategory === 'Other') {
      matchesCategory = srv.category === 'Other';
    }

    const matchesQuery =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-10 bg-transparent min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Bar */}
        <div className="flex items-center justify-start mb-6">
          <BackButton label="Back" />
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-widest bg-sky-500/15 px-3 py-1 rounded-full border border-sky-400/30">
            Full Service Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3">
            Electrical Engineering Services
          </h1>
          <p className="text-sky-200/85 text-sm sm:text-base mt-3">
            Browse our complete range of residential, commercial, and industrial electrical solutions. Every job is carried out by licensed electricians using ISI-certified materials.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-sky-400/20">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                    : 'bg-[#0c2b57]/80 text-sky-200 hover:text-white hover:bg-[#113a73] border border-sky-400/20'
                }`}
              >
                {cat === 'All' && 'All Services'}
                {cat === 'Wiring' && '⚡ Wiring'}
                {cat === 'Ceiling & Lighting' && '💡 Lighting'}
                {cat === 'Panel Board' && '🔌 Panel Boards'}
                {cat === 'Other' && '🛠️ Other / Custom'}
              </button>
            ))}
          </div>

          {/* Search & Template View Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#061c3b] p-1 rounded-xl border border-sky-400/25">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-sky-400 text-slate-950 font-bold shadow-xs'
                    : 'text-sky-300/70 hover:text-white'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Table Template</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-sky-400 text-slate-950 font-bold shadow-xs'
                    : 'text-sky-300/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards Grid</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-sky-300/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-sky-300/50 focus:outline-hidden focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        {/* VIEW MODE 1: NEW TABLE TEMPLATE (Table Form) */}
        {viewMode === 'table' ? (
          <div className="space-y-8">
            {(activeCategory === 'All'
              ? (['Wiring', 'Ceiling & Lighting', 'Panel Board', 'Other'] as const)
              : [activeCategory as 'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other']
            ).map((cat) => (
              <div key={cat} className="space-y-4">
                <ServiceSelectionTable
                  category={cat}
                  selectedService={selectedTableService}
                  onSelectService={(srv) => {
                    setSelectedTableService(srv);
                    onOpenBooking(cat, { name: srv, category: cat } as any);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          /* VIEW MODE 2: SERVICES CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#0c2b57]/75 border border-sky-400/25 hover:border-sky-400/60 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:translate-y-[-2px] group backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                      {service.category}
                    </span>
                    {service.badge && (
                      <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-sky-200/80 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-xs text-sky-300/70 font-semibold uppercase tracking-wider block">
                      Scope of Work:
                    </span>
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-sky-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-sky-400/20">
                  <button
                    onClick={() => onOpenBooking(service.category, service)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-[1.01]"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Book This Service</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-[#0c2b57]/50 rounded-2xl border border-sky-400/25">
            <Filter className="w-10 h-10 text-sky-400/50 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-sky-100">No matching services found</h4>
            <p className="text-xs text-sky-300/70 mt-1">Try clearing your search query or selecting a different category tab.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
