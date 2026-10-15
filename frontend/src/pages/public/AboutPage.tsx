import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, CheckCircle, Zap, HardHat } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-10 bg-transparent text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Bar */}
        <div className="flex items-center justify-start mb-6">
          <BackButton label="Back" />
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-widest bg-sky-500/15 px-3 py-1 rounded-full border border-sky-400/30">
            About Our Enterprise
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 leading-tight">
            Safety, Quality & Engineering Excellence
          </h1>
          <p className="text-sky-200/85 text-sm sm:text-base mt-3 leading-relaxed">
            Omkar Nagu Electrical Works is dedicated to delivering dependable, code-compliant, and high-efficiency electrical engineering solutions across Andhra Pradesh.
          </p>
        </div>

        {/* Company Mission & Core Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Over a Decade of Master Electrical Craftsmanship
            </h2>
            <p className="text-sky-200/80 text-sm leading-relaxed">
              Founded under the leadership of master technician Omkar Nagu, our firm delivers end-to-end electrical infrastructure for residential, commercial, and industrial facilities.
            </p>
            <p className="text-sky-200/80 text-sm leading-relaxed">
              We understand that electrical systems are the lifeblood of any modern building. A single compromised connection or sub-standard breaker can lead to catastrophic damage or fire hazards. That is why our work follows rigorous safety audits, thermal imaging checks, and 100% pure copper ISI-grade standards.
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-3">
                Spaces We Specialize In:
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-sky-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Independent Homes & Luxury Villas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Multi-story Apartment Complexes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Function Halls & Convention Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Retail Shops & Showrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Corporate IT & Office Spaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Commercial & Industrial Distribution</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-sky-400/35 shadow-2xl">
              <img
                src="/images/hero-banner.jpg"
                alt="Electrical panel testing"
                className="w-full h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061836] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#09254d]/90 border border-sky-400/30 backdrop-blur-md">
                <span className="text-xs font-bold text-sky-300 block mb-0.5">National Electrical Code Standard</span>
                <p className="text-xs text-sky-100">
                  Adhering to IS 732 & IS 3043 grounding specifications for guaranteed surge and fault current immunity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-[#0c2b57]/75 p-6 rounded-2xl border border-sky-400/25 text-left shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Safety First</h3>
            <p className="text-xs text-sky-200/80 leading-relaxed">
              RCCB shock protection, calibrated circuit breakers, and zero-spark concealed junctions for absolute peace of mind.
            </p>
          </div>

          <div className="bg-[#0c2b57]/75 p-6 rounded-2xl border border-sky-400/25 text-left shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Uncompromising Quality</h3>
            <p className="text-xs text-sky-200/80 leading-relaxed">
              We exclusively utilize high-conductivity electrolytic copper wire and flame-retardant conduits from top brands.
            </p>
          </div>

          <div className="bg-[#0c2b57]/75 p-6 rounded-2xl border border-sky-400/25 text-left shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center mb-4">
              <HardHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Skilled Electricians</h3>
            <p className="text-xs text-sky-200/80 leading-relaxed">
              Our technicians undergo continuous practical training in high-voltage panels, phase balancing, and smart automation.
            </p>
          </div>

          <div className="bg-[#0c2b57]/75 p-6 rounded-2xl border border-sky-400/25 text-left shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-400/30 text-sky-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reliable Service</h3>
            <p className="text-xs text-sky-200/80 leading-relaxed">
              From initial conduit laying to switchboard final testing, we respect strict deadlines and provide transparent warranties.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0d3670] to-[#0a2754] border border-sky-400/30 p-8 sm:p-12 rounded-2xl text-center shadow-2xl backdrop-blur-md">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Electrify Your Next Project?
          </h3>
          <p className="text-sky-200/80 text-sm max-w-xl mx-auto mb-6">
            Get in touch with Omkar Nagu Electrical Works for residential wiring estimates or commercial panel consultations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold text-sm shadow-md shadow-sky-500/30 transition-all hover:scale-105"
            >
              Contact Our Engineers
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 rounded-xl bg-[#071c3b]/90 border border-sky-400/30 hover:bg-[#0c2b57] text-sky-100 font-semibold text-sm transition-all"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
