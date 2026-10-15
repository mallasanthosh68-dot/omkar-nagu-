import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Phone, MessageSquare, MapPin, Clock, ShieldCheck, Zap, Lock } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { getBusinessWhatsAppNumber } from '../../utils/whatsapp';
import { getInstagramProfileUrl, getInstagramUsername } from '../../utils/instagram';

export const Footer: React.FC = () => {
  const whatsappNum = getBusinessWhatsAppNumber();
  const instagramUrl = getInstagramProfileUrl();
  const instagramUser = getInstagramUsername();

  return (
    <footer className="w-full bg-[#061836] border-t border-sky-400/25 text-sky-200/80 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sky-200/80 text-xs leading-relaxed mt-3">
              Certified electrical installation, rewiring, architectural lighting, and industrial panel board engineering. Delivering safe, reliable power solutions to homes and businesses across Andhra Pradesh.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-sky-200 font-medium bg-sky-500/15 border border-sky-400/30 px-3 py-1.5 rounded-xl w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Govt. Licensed & Safety Certified</span>
              </div>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-pink-300 font-medium bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border border-pink-400/30 px-3 py-1.5 rounded-xl w-fit hover:border-pink-400/60 hover:text-white transition-all hover:scale-105"
              >
                <InstagramIcon size={16} className="text-pink-400 shrink-0" />
                <span>Follow @{instagramUser}</span>
              </a>
            </div>
          </div>

          {/* Electrical Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Core Services
            </h4>
            <ul className="space-y-2.5 text-xs text-sky-200/80">
              <li>
                <Link to="/services?cat=Wiring" className="hover:text-white transition-colors">
                  House & Villa Wiring
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Wiring" className="hover:text-white transition-colors">
                  Apartment & Conduit Layout
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Wiring" className="hover:text-white transition-colors">
                  Function Hall & Event Power
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Lighting" className="hover:text-white transition-colors">
                  Architectural Track Lighting
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Lighting" className="hover:text-white transition-colors">
                  Recessed LED Panels & Strips
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Lighting" className="hover:text-white transition-colors">
                  Chandelier Structural Hanging
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Panel" className="hover:text-white transition-colors">
                  Flush & Surface Panel Boards
                </Link>
              </li>
              <li>
                <Link to="/services?cat=Panel" className="hover:text-white transition-colors">
                  MCB / RCCB Earth-Leakage Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-sky-200/90">
                  Main Workshop & Office,<br />
                  Visakhapatnam, Andhra Pradesh, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:+${whatsappNum}`} className="text-sky-100 hover:text-white transition-colors font-medium">
                  +91 94946 66420
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsappNum}?text=Hello%20Omkar%20Nagu%20Electrical%20Works,%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  WhatsApp Business Chat
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <InstagramIcon size={16} className="text-pink-400 shrink-0" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-pink-200 transition-colors font-medium truncate"
                  title="Follow on Instagram"
                >
                  Instagram: @{instagramUser}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sky-100 font-medium">Mon - Sun: 8:00 AM – 9:00 PM</p>
                  <p className="text-[11px] text-amber-300">24/7 Emergency Breakdown Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Guarantee */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Quality Commitment
            </h4>
            <p className="text-xs text-sky-200/80 leading-relaxed">
              Every job is executed by qualified electrical technicians adhering strictly to National Electrical Safety Code (NEC) standards, IS specifications, and 100% genuine ISI-marked copper wiring and switchgear.
            </p>

            <div className="mt-6 pt-4 border-t border-sky-400/20 flex items-center justify-between text-xs">
              <span className="text-sky-300/70">Staff Portal:</span>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white transition-colors font-semibold"
              >
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                Admin Portal Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-sky-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-300/70">
          <p>© {new Date().getFullYear()} OMKAR NAGU ELECTRICAL WORKS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Safety First • Precision Engineering • Guaranteed Reliability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
