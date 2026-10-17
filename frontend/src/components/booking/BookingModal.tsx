import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ServiceItem, Booking } from '../../types';
import { openWhatsAppBooking } from '../../utils/whatsapp';
import confetti from 'canvas-confetti';
import { getApiUrl } from '../../config/api';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Phone,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Zap,
  Sparkles,
  ClipboardEdit,
  Edit3,
  Eraser,
  Plus,
  Wrench
} from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';
import { openInstagramBooking, getInstagramUsername } from '../../utils/instagram';
import { ServiceSelectionTable, COMPREHENSIVE_SERVICE_PACKAGES } from './ServiceSelectionTable';


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
  preselectedService?: ServiceItem | null;
  onBookingSuccess?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory,
  preselectedService,
  onBookingSuccess
}) => {
  const { user, token, setAuthSession } = useAuth();

  // Steps: 'form' | 'confirm' | 'success'
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other'>('Wiring');
  const [serviceName, setServiceName] = useState('House Wiring (New & Complete)');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'House Wiring (New & Complete)'
  ]);
  const [customServiceTitle, setCustomServiceTitle] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [description, setDescription] = useState('');
  const [roomArea, setRoomArea] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Check if "Other" or custom service is chosen
  const isOtherSelected =
    category === 'Other' ||
    selectedServices.some(
      (s) => s.toLowerCase().includes('other') || s.toLowerCase().includes('custom')
    );

  // Computed list of all selected services including custom title if specified
  const computedServicesList: string[] = [...selectedServices];
  if (isOtherSelected && customServiceTitle.trim() && !computedServicesList.includes(customServiceTitle.trim())) {
    computedServicesList.push(customServiceTitle.trim());
  }

  // Compute final service name submitted (combines multiple selections)
  const finalServiceName =
    computedServicesList.length > 0
      ? computedServicesList.join(' • ')
      : customServiceTitle.trim() || 'Custom Electrical Service';

  // Services catalog mapped by category
  const servicesByCategory: Record<string, string[]> = {
    'Wiring': [
      'House Wiring (New & Complete)',
      'Apartment & Conduit Layout',
      'Function Hall & Event Power',
      'Commercial & Shop Wiring',
      'Switch / Socket & Fan Point Setup',
      'Safety Earthing & Surge Wiring',
      'Other Wiring Work (Custom Requirement)'
    ],
    'Ceiling & Lighting': [
      'Track Lighting Installation',
      'LED Lights & False Ceiling Strips',
      'Panel Lights (Square & Round)',
      'Chandelier Structural Hanging',
      'Decorative Wall Sconces',
      'Outdoor & Landscape Lighting',
      'Other Lighting Work (Custom Requirement)'
    ],
    'Panel Board': [
      'Flush-Mount Concealed Panels',
      'Surface-Mount Wall Panels',
      'Floor-Standing Commercial Panels',
      'MCB / RCCB Earth-Leakage Upgrades',
      'Distribution Board Replacement',
      'Complete Electrical Safety Audit',
      'Other Panel Board Work (Custom Requirement)'
    ],
    'Other': [
      'Custom Electrical Service',
      'Emergency Fault & Sparking Troubleshooting',
      'High-Load Appliance & EV Charger Wiring',
      'Full Renovation & Rewiring Audit',
      'Other Unlisted Electrical Work'
    ]
  };

  // Sync initial user info & preselected options
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }

    if (preselectedService) {
      setCategory(preselectedService.category);
      setServiceName(preselectedService.name);
      setSelectedServices([preselectedService.name]);
    } else if (preselectedCategory && ['Wiring', 'Ceiling & Lighting', 'Panel Board', 'Other'].includes(preselectedCategory)) {
      const validCat = preselectedCategory as 'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other';
      setCategory(validCat);
      const def = COMPREHENSIVE_SERVICE_PACKAGES[validCat]?.[0]?.name || servicesByCategory[validCat]?.[0] || 'Custom Electrical Service';
      setServiceName(def);
      setSelectedServices([def]);
    }

    // Default preferred date to tomorrow formatted YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, [user, preselectedCategory, preselectedService, isOpen]);

  // Handle category switch
  const handleCategoryChange = (newCat: 'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other') => {
    setCategory(newCat);
    // If no services currently selected, preselect first from this new category
    if (selectedServices.length === 0) {
      const defaultPackage = COMPREHENSIVE_SERVICE_PACKAGES[newCat]?.[0]?.name || servicesByCategory[newCat]?.[0] || 'House Wiring';
      setServiceName(defaultPackage);
      setSelectedServices([defaultPackage]);
    }
  };

  // Handle multi-service toggle
  const handleToggleService = (nameToToggle: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(nameToToggle)) {
        return prev.filter((s) => s !== nameToToggle);
      } else {
        return [...prev, nameToToggle];
      }
    });
    setServiceName(nameToToggle);
  };

  // Handle image selection & upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));

      // Upload photo to backend
      setIsUploadingPhoto(true);
      const formData = new FormData();
      formData.append('photo', file);
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(getApiUrl('/api/upload'), {
          method: 'POST',
          headers,
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          setUploadedImageUrl(data.url);
        }
      } catch (err) {
        console.warn('Image upload failed, proceeding without preview URL:', err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (computedServicesList.length === 0) {
      setErrorMsg('Please select at least one electrical service option.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Customer name is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone number is required.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Service address is required.');
      return;
    }
    if (!preferredDate) {
      setErrorMsg('Please select a preferred service date.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description of the electrical work.');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        category,
        serviceName: finalServiceName,
        selectedServices: computedServicesList,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        address: address.trim(),
        preferredDate,
        preferredTime,
        description: roomArea ? `${description} (Estimated Area/Rooms: ${roomArea})` : description,
        imageUrl: uploadedImageUrl
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(getApiUrl('/api/bookings'), {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Booking submission failed.');
      }

      // If user was a guest and backend generated an auto-token/account, log them in seamlessly!
      if (data.token && data.user && !token) {
        setAuthSession(data.user, data.token);
      }

      setConfirmedBooking(data.booking);
      setStep('success');

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Automatically dispatch booking summary directly to WhatsApp (+91 94946 66420)
      try {
        openWhatsAppBooking(data.booking);
      } catch (e) {
        console.warn('Auto-open WhatsApp prevented by browser popup rule:', e);
      }

      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const [instagramCopied, setInstagramCopied] = useState(false);

  const handleSendToWhatsApp = () => {
    if (confirmedBooking) {
      openWhatsAppBooking(confirmedBooking);
    }
  };

  const handleSendToInstagram = async () => {
    if (confirmedBooking) {
      const copied = await openInstagramBooking(confirmedBooking);
      if (copied) {
        setInstagramCopied(true);
      }
    }
  };

  const resetAndClose = () => {
    setStep('form');
    setErrorMsg('');
    setConfirmedBooking(null);
    setInstagramCopied(false);
    setSelectedFile(null);
    setFilePreview(null);
    setCustomServiceTitle('');
    setDescription('');
    setSelectedServices(['House Wiring (New & Complete)']);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051634]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#08234d] border border-sky-400/30 rounded-2xl shadow-2xl shadow-[#04142b]/70 overflow-hidden my-8">
        {/* Modal Top Header with Cobalt & Ice Blue */}
        <div className="bg-gradient-to-r from-[#0d3670] to-[#104b99] border-b border-sky-400/20 px-6 py-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 backdrop-blur-sm">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {step === 'form' && 'Book Professional Electrical Service'}
                {step === 'confirm' && 'Confirm Your Service Booking'}
                {step === 'success' && 'Booking Submitted Successfully!'}
              </h3>
              <p className="text-xs text-sky-200">OMKAR NAGU ELECTRICAL WORKS</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-sky-300 hover:text-white hover:bg-sky-500/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: SERVICE BOOKING FORM */}
          {step === 'form' && (
            <form onSubmit={handleProceedToReview} className="space-y-6">
              {/* Category Picker Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Service Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Wiring', 'Ceiling & Lighting', 'Panel Board', 'Other'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                        category === cat
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-md scale-[1.02]'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {cat === 'Wiring' && '⚡ Wiring'}
                      {cat === 'Ceiling & Lighting' && '💡 Lighting'}
                      {cat === 'Panel Board' && '🔌 Panel Board'}
                      {cat === 'Other' && '🛠️ Other / Custom'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Selection in Table Form Template */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      2. Select Required Service Specifications (Multi-Select Supported)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedServices.length > 0 && (
                      <span className="text-[11px] font-bold text-sky-200 bg-sky-500/20 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
                        ✓ {selectedServices.length} Selected
                      </span>
                    )}
                    {isOtherSelected && (
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                        Custom / Other Active
                      </span>
                    )}
                  </div>
                </div>
                <ServiceSelectionTable
                  category={category}
                  selectedService={serviceName}
                  selectedServices={selectedServices}
                  onToggleService={handleToggleService}
                  onSelectService={handleToggleService}
                  allowMultiple={true}
                />
              </div>

              {/* INTERACTIVE SERVICE DESCRIPTION BOARD */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                  isOtherSelected
                    ? 'bg-gradient-to-b from-[#0b244d] to-[#071936] border-amber-400/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30'
                    : 'bg-[#061c3d]/90 border-sky-400/25 shadow-lg'
                }`}
              >
                {/* Board Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-sky-400/20">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl flex items-center justify-center ${
                        isOtherSelected
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                      }`}
                    >
                      <ClipboardEdit className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          SERVICE DESCRIPTION BOARD
                        </h4>
                        {isOtherSelected && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                            Custom Service Board
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-200/80">
                        Type and describe the service you want, equipment involved, problems, or custom specifications.
                      </p>
                    </div>
                  </div>

                  {/* Toolbar buttons */}
                  <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (computedServicesList.length === 0) return;
                        const servicesBullet = computedServicesList.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n');
                        const section = `• Selected Services:\n${servicesBullet}`;
                        setDescription((prev) => (prev ? `${prev}\n\n${section}` : section));
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 transition-all flex items-center gap-1.5"
                      title="Add currently selected services to description board"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Selected Services</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const template =
`• Service Requirement: 
• Equipment / Appliances: 
• Rooms / Work Location: 
• Specific Timing or Urgent Needs: `;
                        setDescription((prev) => (prev ? `${prev}\n\n${template}` : template));
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border border-sky-400/30 transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Insert Template</span>
                    </button>

                    {description && (
                      <button
                        type="button"
                        onClick={() => setDescription('')}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-all flex items-center gap-1"
                        title="Clear Description Board"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Custom Service Name / Title Input (If Other or Custom) */}
                {isOtherSelected && (
                  <div className="mt-4 pt-1">
                    <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Specify Custom Service Name / Title (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={customServiceTitle}
                      onChange={(e) => setCustomServiceTitle(e.target.value)}
                      placeholder={`e.g. Inverter Wiring & Heavy Socket Setup (Default: ${serviceName})`}
                      className="w-full bg-[#031126] border border-amber-400/40 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    <span className="text-[11px] text-sky-300/70 block mt-1">
                      This custom title will appear on your booking record and WhatsApp summary.
                    </span>
                  </div>
                )}

                {/* Quick Insert Tags / Chip Board */}
                <div className="mt-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-sky-300/80 mb-2 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Quick Click-to-Add Requirement Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '⚡ Breaker Keeps Tripping / Sparks',
                      '🔌 Add Extra Modular Sockets & Switches',
                      '🔋 Inverter & Battery Wiring Line',
                      '💡 Chandelier / Pendant Light Mounting',
                      '🚗 EV Charger Dedicated Connection',
                      '🌊 Water Motor / Pump Starter Fix',
                      '🚨 Emergency Short Circuit Inspection',
                      '🏢 Office / Commercial Power Extension',
                      '🏠 House Renovation Wire Rerouting'
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setDescription((prev) => {
                            if (!prev.trim()) return tag;
                            if (prev.includes(tag)) return prev;
                            return `${prev}, ${tag}`;
                          });
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#051a3b] hover:bg-sky-500/25 border border-sky-400/25 hover:border-sky-400/60 text-sky-200 hover:text-white transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-sky-400" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Board Textarea Canvas */}
                <div className="mt-3.5 relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={isOtherSelected ? 5 : 4}
                    placeholder="Type and describe your service requirements here in detail...
Example:
- Need 2 new 16A power points in kitchen for microwave and induction stove
- Master bedroom fan point spark inspection and inverter line connection
- Need same-day visit if possible"
                    className="w-full bg-[#031126] border border-sky-400/35 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-sky-100 placeholder-sky-300/40 focus:outline-hidden focus:ring-1 focus:ring-amber-400 font-sans leading-relaxed transition-all shadow-inner"
                    required
                  />

                  {/* Counter & Status */}
                  <div className="flex items-center justify-between text-[11px] text-sky-300/60 mt-1 px-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Description Board Active & Synced</span>
                    </span>
                    <span>
                      {description.trim().length} characters | {description.trim() ? description.trim().split(/\s+/).length : 0} words
                    </span>
                  </div>
                </div>
              </div>


              {/* Customer Details (Auto-filled, editable) */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  3. Contact & Location Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Customer Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Santhosh Kumar"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-slate-400 mb-1">Service Address (Complete Location)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      placeholder="Door / Flat No, Street, Landmark, Visakhapatnam..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Work Details */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  4. Schedule & Work Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Preferred Time Slot</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                      >
                        <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Morning)</option>
                        <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                        <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM (Afternoon)</option>
                        <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                        <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                        <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-slate-400 mb-1">Description of Work Needed</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe the issue, requirements, number of points, switchboard needs, etc."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Number of Rooms / Estimated Area (Optional)</label>
                    <input
                      type="text"
                      value={roomArea}
                      onChange={(e) => setRoomArea(e.target.value)}
                      placeholder="e.g. 3 BHK, 1500 sq ft, 4 rooms"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-[#5B86B6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Upload Photo of Setup / Problem (Optional)</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 bg-slate-950 border border-dashed border-slate-700 hover:border-[#5B86B6] rounded-xl text-xs text-slate-400 hover:text-white transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{selectedFile ? selectedFile.name.substring(0, 18) + '...' : 'Choose image...'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {filePreview && (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                          <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#5B86B6] hover:bg-[#4a729e] text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: BOOKING CONFIRMATION SCREEN (Table Design) */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-slate-950/85 border border-sky-400/30 rounded-2xl p-5 overflow-hidden shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-sky-400/20">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-sky-500/20 text-amber-300">
                      <Zap className="w-4 h-4" />
                    </span>
                    <span className="text-xs uppercase tracking-wider text-sky-200 font-bold">
                      Booking Review & Specification Summary Table
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Ready to Confirm
                  </span>
                </div>

                {/* Structured Table Format */}
                <div className="border border-sky-400/20 rounded-xl overflow-hidden bg-[#071c3b]/80">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-sky-400/15">
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 w-1/3 bg-[#051733]/50">Selected Category</td>
                        <td className="py-2.5 px-4 font-bold text-white">
                          <span className="px-2 py-0.5 rounded-md bg-sky-400/20 text-sky-200 border border-sky-400/30 text-[11px]">
                            {category}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 bg-[#051733]/50 align-top">
                          <div>
                            <span>Selected Services</span>
                            <span className="block text-[10px] text-sky-400 font-normal">
                              ({computedServicesList.length} package{computedServicesList.length > 1 ? 's' : ''} selected)
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="space-y-1.5">
                            {computedServicesList.map((srv, idx) => {
                              const isCustom = srv.toLowerCase().includes('custom') || srv.toLowerCase().includes('other');
                              return (
                                <div key={idx} className="flex items-center gap-2 flex-wrap">
                                  <span className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/30 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="font-bold text-amber-300 text-sm">{srv}</span>
                                  {isCustom && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold inline-block">
                                      Custom Specification
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 bg-[#051733]/50">Customer Name</td>
                        <td className="py-2.5 px-4 font-semibold text-white">{name}</td>
                      </tr>
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 bg-[#051733]/50">Contact Phone</td>
                        <td className="py-2.5 px-4 text-sky-100">{phone}</td>
                      </tr>
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 bg-[#051733]/50">Service Address</td>
                        <td className="py-2.5 px-4 text-sky-100 leading-relaxed">{address}</td>
                      </tr>
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 bg-[#051733]/50">Preferred Schedule</td>
                        <td className="py-2.5 px-4 font-medium text-white">
                          <span>📅 {preferredDate}</span>
                          <span className="text-sky-400 mx-2">|</span>
                          <span>⏰ {preferredTime}</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-500/5">
                        <td className="py-2.5 px-4 font-semibold text-sky-300/80 bg-[#051733]/50">
                          Description Board Notes
                        </td>
                        <td className="py-2.5 px-4 text-sky-200 leading-relaxed whitespace-pre-wrap font-sans">
                          {description}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>


              {/* Two-Way Notice */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#5B86B6]/15 border border-[#5B86B6]/30 text-xs text-sky-200">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p>
                  Upon confirmation, this booking is registered directly with Omkar Nagu Electrical Works admin and you can immediately send the booking summary to WhatsApp with one click.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Booking
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#5B86B6] hover:bg-[#4a729e] text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & WHATSAPP ACTION (Section 17) */}
          {step === 'success' && confirmedBooking && (
            <div className="py-6 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1">Booking Submitted Successfully!</h3>
                <p className="text-sm text-slate-300">
                  Your service request has been registered in the system with Booking ID:
                </p>
                <div className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-[#5B86B6]/20 border border-[#5B86B6]/50 text-sky-300 font-mono font-bold text-lg">
                  {confirmedBooking.bookingNumber}
                </div>
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dispatching booking directly to WhatsApp (+91 94946 66420)</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp, Instagram & View My Booking */}
              <div className="max-w-md mx-auto space-y-3 pt-2">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  Send Directly to WhatsApp (+91 94946 66420)
                </button>

                <button
                  onClick={handleSendToInstagram}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white shadow-xl shadow-pink-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <InstagramIcon size={20} className="w-5 h-5" />
                  Send Details to Instagram DM (@{getInstagramUsername()})
                </button>

                {instagramCopied && (
                  <div className="p-2.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-medium text-center animate-in fade-in">
                    ✓ Booking summary copied to clipboard! Just paste into your Instagram DM to send.
                  </div>
                )}

                <button
                  onClick={resetAndClose}
                  className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  View My Bookings / Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
