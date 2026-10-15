import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Electrical3DScene } from '../../components/3d/Electrical3DScene';
import { TiltCard } from '../../components/effects/TiltCard';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Flame,
  Award,
  Cpu,
  Wrench,
  ChevronRight
} from 'lucide-react';

import { getBusinessWhatsAppNumber } from '../../utils/whatsapp';

interface HomePageProps {
  onOpenBooking: (category?: string, service?: any) => void;
  onOpenSketch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking, onOpenSketch }) => {
  const { isAuthenticated } = useAuth();

  const whatsappNum = getBusinessWhatsAppNumber();

  const handleBookClick = (category?: string) => {
    if (onOpenBooking) {
      onOpenBooking(category);
    }
  };

  return (
    <div className="flex flex-col w-full bg-transparent text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-sky-500/20">
        {/* Cobalt & Ice Blue ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-sky-400/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-200 text-xs font-semibold backdrop-blur-md shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                <span>Certified Electrical Engineers & Master Electricians</span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  OMKAR NAGU <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-blue-400">
                    ELECTRICAL WORKS
                  </span>
                </h1>
                <p className="mt-4 text-xl sm:text-2xl font-medium text-sky-100">
                  "Reliable Electrical Solutions for Every Space"
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-sky-200/85 max-w-2xl leading-relaxed">
                Professional electrical installation, wiring, lighting and panel board services for homes, apartments, commercial buildings, function halls and more.
              </p>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleBookClick()}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-sky-400/40"
                >
                  <Zap className="w-5 h-5 text-amber-300 fill-current" />
                  <span>Book a Service</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="px-6 py-3.5 rounded-xl font-semibold text-base text-sky-100 bg-[#0c2b57]/80 hover:bg-[#113a73] border border-sky-400/30 transition-all hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-3.5 rounded-xl font-semibold text-base text-sky-200 hover:text-white hover:bg-sky-500/10 transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-6 py-3.5 rounded-xl font-semibold text-base text-sky-100 bg-[#0c2b57]/80 hover:bg-[#113a73] border border-sky-400/30 transition-all hover:text-white"
                  >
                    Go to Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={onOpenSketch}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-400/10"
                  title="Watch 8-10s Logo Outline Sketch Animation"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>9s Logo Sketch</span>
                </button>
              </div>



              {/* Key Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sky-500/20 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sky-100 font-medium">100% Safety Tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-sky-100 font-medium">On-Time Arrival</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-sky-100 font-medium">Genuine ISI Switchgear</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual with High-Resolution Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-sky-400/40 shadow-2xl group">
                <img
                  src="/images/hero-banner.jpg"
                  alt="Omkar Nagu Electrical Works Installation"
                  className="w-full h-[400px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061938] via-transparent to-transparent" />

                {/* Subtle Electric Accent Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#09254d]/90 backdrop-blur-md border border-sky-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Direct WhatsApp Booking</h4>
                      <p className="text-xs text-sky-200/80">Instant scheduling & technician dispatch</p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNum}?text=Hello%20Omkar%20Nagu%20Electrical%20Works,%20I%20would%20like%20to%20inquire%20about%20electrical%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE MAJOR SERVICE CATEGORIES */}
      <section className="py-20 border-b border-sky-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-widest bg-sky-500/15 px-3 py-1 rounded-full border border-sky-400/30">
              Our Professional Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Comprehensive Electrical Solutions
            </h2>
            <p className="text-sky-200/85 text-base mt-3">
              Precision installation, certified wiring safety, modern lighting design, and industrial distribution boards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CATEGORY 1: WIRING */}
            <TiltCard maxTilt={5} className="h-full rounded-2xl">
              <div className="flex flex-col h-full bg-[#0c2b57]/75 border border-sky-400/25 hover:border-sky-400/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group backdrop-blur-md">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="/images/service-wiring.jpg"
                    alt="Electrical Wiring Services"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b57] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                    ⚡ WIRING
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <span>Wiring Services</span>
                    </h3>
                    <p className="text-sm text-sky-200/80 mb-5 leading-relaxed">
                      Professional electrical wiring solutions for residential and commercial spaces.
                    </p>

                    <ul className="space-y-2 mb-6 text-xs text-sky-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>House Wiring (New, Rewiring, Sockets & Points)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Apartment & Conduit Layout</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Function Hall & Event Power Distribution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Shop, Office & Commercial Wiring</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBookClick('Wiring')}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </TiltCard>

            {/* CATEGORY 2: CEILING & LIGHTING */}
            <TiltCard maxTilt={5} className="h-full rounded-2xl">
              <div className="flex flex-col h-full bg-[#0c2b57]/75 border border-sky-400/25 hover:border-sky-400/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group backdrop-blur-md">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="/images/service-lighting.jpg"
                    alt="Ceiling and Lighting Installation"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b57] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-sky-400 text-slate-950 shadow-md">
                    💡 LIGHTING
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <span>Ceiling & Lighting</span>
                    </h3>
                    <p className="text-sm text-sky-200/80 mb-5 leading-relaxed">
                      Modern lighting design and ceiling electrical fixtures for beautiful ambiances.
                    </p>

                    <ul className="space-y-2 mb-6 text-xs text-sky-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Ceiling Fan (Installation, Balancing & Speed Regulators)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>POP Profile & False Ceiling Spotlights</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Chandelier & Statement Pendant Light Mounting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Garden & Outdoor Waterproof Flood Lighting</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBookClick('Ceiling & Lighting')}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </TiltCard>

            {/* CATEGORY 3: PANEL BOARD */}
            <TiltCard maxTilt={5} className="h-full rounded-2xl">
              <div className="flex flex-col h-full bg-[#0c2b57]/75 border border-sky-400/25 hover:border-sky-400/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group backdrop-blur-md">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="/images/service-panel.jpg"
                    alt="Panel Board and Distribution Services"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b57] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 shadow-md">
                    🛡️ PANEL BOARD
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <span>Panel Board Services</span>
                    </h3>
                    <p className="text-sm text-sky-200/80 mb-5 leading-relaxed">
                      Heavy-duty power management, switchboards, circuit breakers and safety units.
                    </p>

                    <ul className="space-y-2 mb-6 text-xs text-sky-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Main Panel Board Assembly & Load Balancing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>MCB & ELCB / RCCB Earth Leakage Tripping Protection</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Automatic Changeover & Generator Interlocks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>Copper Chemical Earthing & Ground Spike Testing</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBookClick('Panel Board')}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. 3D INTERACTIVE ARC TECHNOLOGY SHOWCASE */}
      <section className="py-20 bg-[#092247]/60 border-b border-sky-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5 text-left">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-widest bg-sky-500/15 px-3 py-1 rounded-full border border-sky-400/30">
                Interactive Arc Technology
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Engineered for Safety & Zero Hazards
              </h2>
              <p className="text-sky-200/85 text-sm leading-relaxed">
                We equip our certified technicians with industry-standard insulation testers, calibrated cutting tools, and heavy-duty switchgear to guarantee zero electrical hazards on every job.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Balanced 3-Phase Power Distribution</h4>
                    <p className="text-xs text-sky-200/70">Load balancing across circuits to prevent tripping and overheated mains.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 mt-0.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">High-Sensitivity Voltage Testing</h4>
                    <p className="text-xs text-sky-200/70">Testing for live current leakage, phase reversals, and grounding continuity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Heavy-Duty Cable Jointing</h4>
                    <p className="text-xs text-sky-200/70">Crimped copper terminal lugs and flame-retardant heat shrink insulation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Visual Scene */}
            <div className="lg:col-span-7">
              <Electrical3DScene height="h-96" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW PROCESS */}
      <section className="py-20 border-b border-sky-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-widest bg-sky-500/15 px-3 py-1 rounded-full border border-sky-400/30">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              How Our Service Booking Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TiltCard maxTilt={6} className="h-full rounded-2xl">
              <div className="h-full bg-[#0c2b57]/70 p-6 rounded-2xl border border-sky-400/25 relative text-left backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">Choose Service</h4>
                <p className="text-xs text-sky-200/80 leading-relaxed">
                  Select your required category (Wiring, Lighting, or Panel Board) and specific service package.
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={6} className="h-full rounded-2xl">
              <div className="h-full bg-[#0c2b57]/70 p-6 rounded-2xl border border-sky-400/25 relative text-left backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">Pick Date & Time</h4>
                <p className="text-xs text-sky-200/80 leading-relaxed">
                  Provide your address and preferred slot. Optional: attach a photo of your electrical setup.
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={6} className="h-full rounded-2xl">
              <div className="h-full bg-[#0c2b57]/70 p-6 rounded-2xl border border-sky-400/25 relative text-left backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">WhatsApp & Admin Sync</h4>
                <p className="text-xs text-sky-200/80 leading-relaxed">
                  Booking is immediately logged with the admin portal and prepared with pre-filled WhatsApp text.
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={6} className="h-full rounded-2xl">
              <div className="h-full bg-[#0c2b57]/70 p-6 rounded-2xl border border-sky-400/25 relative text-left backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center justify-center font-bold text-lg mb-4">
                  4
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">Expert Service</h4>
                <p className="text-xs text-sky-200/80 leading-relaxed">
                  Our licensed electrician arrives on schedule with tools and complete testing equipment.
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-[#0d3b7a] via-[#104b99] to-[#08244d] border-t border-sky-400/30 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
              Have An Electrical Requirement or Emergency?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Connect Directly with Master Electrician Omkar Nagu
            </h2>
            <p className="text-sm text-sky-100 max-w-xl mt-1">
              Available 7 days a week for residential, commercial, and emergency electrical repair across Visakhapatnam.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:+${whatsappNum}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#051838] font-bold text-sm shadow-lg hover:bg-sky-50 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Call +91 94946 66420</span>
            </a>
            <button
              onClick={() => handleBookClick()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-[#051838] font-bold text-sm shadow-lg shadow-sky-500/30 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>Book Online</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
