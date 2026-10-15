import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Clock, Send, CheckCircle2, Zap } from 'lucide-react';
import { InstagramIcon } from '../../components/common/InstagramIcon';
import { getBusinessWhatsAppNumber } from '../../utils/whatsapp';
import { getInstagramProfileUrl, getInstagramUsername, getInstagramDmUrl } from '../../utils/instagram';
import { BackButton } from '../../components/common/BackButton';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const whatsappNum = getBusinessWhatsAppNumber();
  const instagramUrl = getInstagramProfileUrl();
  const instagramUser = getInstagramUsername();
  const instagramDm = getInstagramDmUrl();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [igCopied, setIgCopied] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim() || !inquiryMsg.trim()) return;

    // Compose formatted WhatsApp text message
    const formattedText = `*Inquiry from Omkar Nagu Website*%0A%0A*Name:* ${encodeURIComponent(
      inquiryName
    )}%0A*Phone:* ${encodeURIComponent(inquiryPhone)}%0A*Message / Requirement:* ${encodeURIComponent(
      inquiryMsg
    )}`;

    const waUrl = `https://wa.me/${whatsappNum}?text=${formattedText}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

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
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3">
            Contact Omkar Nagu Electrical Works
          </h1>
          <p className="text-sky-200/85 text-sm sm:text-base mt-3">
            We are here to assist with domestic wiring, commercial panels, architectural ceiling lighting, or emergency electrical repairs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Quick Action Buttons */}
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-6 rounded-2xl space-y-3.5 shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-2">Immediate Assistance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={`tel:+${whatsappNum}`}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNum}?text=Hello%20Omkar%20Nagu%20Electrical%20Works,%20I%20need%20electrical%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href={instagramDm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  <InstagramIcon size={16} />
                  <span>Instagram DM</span>
                </a>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>Book a Service Online</span>
              </button>
            </div>

            {/* Contact Details Cards */}
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-6 rounded-2xl space-y-5 shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-sky-300/80 block font-medium">Telephone</span>
                  <a href={`tel:+${whatsappNum}`} className="text-base font-bold text-white hover:text-sky-300 transition-colors">
                    +91 94946 66420
                  </a>
                  <p className="text-xs text-sky-200/70 mt-0.5">Primary service & dispatch helpline</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-sky-300/80 block font-medium">WhatsApp Business</span>
                  <a
                    href={`https://wa.me/${whatsappNum}?text=Hello%20Omkar%20Nagu%20Electrical%20Works,%20I%20have%20an%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    +91 94946 66420
                  </a>
                  <p className="text-xs text-sky-200/70 mt-0.5">Instant quotes, photos & status updates</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-amber-500/20 text-pink-400 border border-pink-500/30 shrink-0">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <span className="text-xs text-pink-300/80 block font-medium">Official Instagram</span>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-pink-300 hover:text-white transition-colors"
                  >
                    @{instagramUser}
                  </a>
                  <p className="text-xs text-sky-200/70 mt-0.5">Explore our daily electrical projects, wiring & panel reels</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-sky-300/80 block font-medium">Workshop & Service Hub</span>
                  <p className="text-sm font-semibold text-white">
                    Visakhapatnam, Andhra Pradesh, India
                  </p>
                  <p className="text-xs text-sky-200/70 mt-0.5">Serving Gajuwaka, MVP Colony, Madhurawada & all areas</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-sky-300/80 block font-medium">Working Hours</span>
                  <p className="text-sm font-semibold text-white">Monday - Sunday: 8:00 AM – 9:00 PM</p>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">
                    24/7 Breakdown & Short Circuit Emergency Response
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Quick Message Form */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="bg-[#0c2b57]/75 border border-sky-400/25 p-8 rounded-2xl shadow-xl shadow-[#04142b]/50 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-2">Send an Instant Inquiry</h3>
              <p className="text-xs text-sky-200/80 mb-6 leading-relaxed">
                Have a customized electrical plan or need an on-site technician inspection? Fill out this form to connect directly via WhatsApp.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Inquiry Forwarded to WhatsApp!</h4>
                  <p className="text-xs text-sky-200">
                    Our master electrician will review your details and respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-sky-300 font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-sky-200/80 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="e.g. Ramesh Varma"
                        className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-sky-200/80 mb-1">Your Phone Number</label>
                      <input
                        type="tel"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-sky-200/80 mb-1">Service Required / Inquiry Details</label>
                    <textarea
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      rows={4}
                      placeholder="Tell us about the wiring, light points, or distribution panel board requirements..."
                      className="w-full bg-[#071c3b]/85 border border-sky-400/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>

            {/* Electrical Services Quick Summary Box */}
            <div className="bg-[#0c2b57]/70 border border-sky-400/25 p-6 rounded-2xl backdrop-blur-md">
              <h4 className="text-xs font-bold text-sky-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                Available Service Categories
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#071c3b]/80 border border-sky-400/20">
                  <span className="font-bold text-amber-300 block mb-1">⚡ Wiring</span>
                  <p className="text-sky-200/70 text-xs">House, Apartment, Function Hall, Office & Shop rewiring</p>
                </div>
                <div className="p-3 rounded-xl bg-[#071c3b]/80 border border-sky-400/20">
                  <span className="font-bold text-sky-300 block mb-1">💡 Lighting</span>
                  <p className="text-sky-200/70 text-xs">Track lights, LED strips, panel downlights, chandeliers</p>
                </div>
                <div className="p-3 rounded-xl bg-[#071c3b]/80 border border-sky-400/20">
                  <span className="font-bold text-blue-300 block mb-1">🔌 Panel Boards</span>
                  <p className="text-sky-200/70 text-xs">Flush-mount, surface-mount, floor panels, MCB & RCCB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
