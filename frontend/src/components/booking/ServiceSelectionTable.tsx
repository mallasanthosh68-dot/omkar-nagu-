import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Home,
  Building2,
  Building,
  Sparkles,
  Shield,
  Lightbulb,
  Clock,
  Layers,
  Search,
  Check,
  AlertCircle,
  Wrench,
  FileText,
  ClipboardEdit,
  Plus,
  X
} from 'lucide-react';

export interface ServicePackageDetails {
  id: string;
  name: string;
  category: 'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other';
  shortDesc: string;
  badge?: string;
  scope: string[];
  propertyType: string;
  duration: string;
  warranty: string;
  standard: string;
}

export const COMPREHENSIVE_SERVICE_PACKAGES: Record<
  'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other',
  ServicePackageDetails[]
> = {
  'Wiring': [
    {
      id: 'wire-house',
      name: 'House Wiring (New & Complete)',
      category: 'Wiring',
      shortDesc: 'End-to-end electrical wiring for newly built or renovated independent houses & villas.',
      badge: 'Most Popular',
      scope: [
        'Concealed & surface conduit pipe laying',
        'ISI flame-retardant copper wiring (1.5mm - 4mm)',
        'Modular switchboards & socket termination',
        'Fan, chandelier & AC dedicated circuit points',
        'Chemical earthing rod & ground resistance testing'
      ],
      propertyType: 'Independent Homes, Villas & Duplexes',
      duration: 'Same-Day / 1-2 Days',
      warranty: '6 Months Service Warranty',
      standard: 'IS:732 Safety Compliant'
    },
    {
      id: 'wire-apt',
      name: 'Apartment & Conduit Layout',
      category: 'Wiring',
      shortDesc: 'Specialized apartment wiring with multi-room load balancing and sub-meter connectivity.',
      badge: 'High Demand',
      scope: [
        'Individual flat complete electrical layout',
        'Dedicated high-load lines for Geyser, AC & Inverter',
        'Concealed false ceiling wire routing',
        'Sub-meter box integration & phase distribution',
        'Old aluminum wire replacement with copper'
      ],
      propertyType: 'Flats, Multi-Story Apartments & Societies',
      duration: '1-2 Days (Per Flat)',
      warranty: '6 Months Service Warranty',
      standard: 'IS:694 Certified Wires'
    },
    {
      id: 'wire-hall',
      name: 'Function Hall & Event Power',
      category: 'Wiring',
      shortDesc: 'Heavy-duty power distribution for marriage halls, auditoriums, and convention centers.',
      badge: 'Heavy Capacity',
      scope: [
        '3-Phase heavy load balance & distribution',
        'Stage & high-wattage decorative lighting feeds',
        'Automatic / manual DG generator transfer switch',
        'Surge suppression & temporary event routing',
        'High-capacity armored cable installation'
      ],
      propertyType: 'Function Halls, Auditoriums & Event Lawns',
      duration: 'Same-Day Express Setup',
      warranty: 'On-Site Event Support',
      standard: 'Industrial Load Certified'
    },
    {
      id: 'wire-comm',
      name: 'Commercial & Shop Wiring',
      category: 'Wiring',
      shortDesc: 'Certified wiring for retail outlets, corporate offices, clinics, and showrooms.',
      badge: 'Commercial Grade',
      scope: [
        'Server rack, UPS & workstation cubicle wiring',
        'Display window & showroom accent lighting links',
        'Emergency exit & backup battery line wiring',
        'Cable tray laying & neat trunking conduit',
        'Fire-resistant casing and insulation check'
      ],
      propertyType: 'Retail Shops, Offices, Showrooms & Clinics',
      duration: '1-3 Business Days',
      warranty: '6 Months Service Warranty',
      standard: 'Commercial Safety Standard'
    },
    {
      id: 'wire-points',
      name: 'Switch / Socket & Point Setup',
      category: 'Wiring',
      shortDesc: 'Precision installation of new electrical points, power sockets, and modular plates.',
      badge: 'Express Service',
      scope: [
        'Modular switch plate & socket installation',
        'Heavy 16A/20A power plugs for oven & geyser',
        'Ceiling fan hook fitting & speed regulator wiring',
        'USB wall socket & smart switch module setup',
        'Loose connection fixing & sparking repair'
      ],
      propertyType: 'All Residential & Commercial Units',
      duration: '2-4 Hours (Same Day)',
      warranty: '90 Days Service Warranty',
      standard: 'ISI Certified Modular Plates'
    },
    {
      id: 'wire-earth',
      name: 'Safety Earthing & Surge Wiring',
      category: 'Wiring',
      shortDesc: 'High-safety ground earthing installation protecting appliances and humans from shock.',
      badge: 'Life Safety',
      scope: [
        'Copper plate / chemical rod pit installation',
        'Earthing resistance test (< 1 Ohm standard)',
        'Main panel ground busbar bonding',
        'Surge protection device (SPD) installation',
        'Lightning protection conductor testing'
      ],
      propertyType: 'Houses, Commercial Buildings & Plants',
      duration: '3-6 Hours',
      warranty: '1 Year Warranty',
      standard: 'IS:3043 Earthing Code'
    },
    {
      id: 'wire-other',
      name: 'Other Wiring Work (Custom Requirement)',
      category: 'Wiring',
      shortDesc: 'Custom wiring specification, unlisted appliance lines, or specialty layouts. Detail on the description board.',
      badge: 'Custom Work',
      scope: [
        'Tailored wiring as per your exact written description',
        'On-site evaluation & copper wire gauge calculation',
        'Custom modular points & safe circuit termination',
        'Comprehensive load testing & safety check'
      ],
      propertyType: 'All Residential & Commercial Units',
      duration: 'Custom Assessment',
      warranty: 'Service Warranty Guaranteed',
      standard: 'Safety Standard Verified'
    }
  ],
  'Ceiling & Lighting': [
    {
      id: 'light-track',
      name: 'Track Lighting Installation',
      category: 'Ceiling & Lighting',
      shortDesc: 'Architectural spotlight rail system for galleries, living rooms, and boutique showrooms.',
      badge: 'Architectural',
      scope: [
        '1-Phase / 3-Phase extruded aluminum track rails',
        'Adjustable 360° directional COB spotlight heads',
        'Surface, recessed or pendant hanging mounting',
        'Flicker-free constant current LED drivers',
        'Beam angle calibration (24° / 36° / 60°)'
      ],
      propertyType: 'Modern Homes, Art Galleries & Boutiques',
      duration: '3-5 Hours',
      warranty: '6 Months Service Warranty',
      standard: 'Architectural Grade'
    },
    {
      id: 'light-led',
      name: 'LED Lights & False Ceiling Strips',
      category: 'Ceiling & Lighting',
      shortDesc: 'Seamless indirect illumination with high-CRI flexible LED strips in false ceiling coves.',
      badge: 'Modern Ambience',
      scope: [
        'False ceiling cove indirect perimeter strip lights',
        'Aluminum profile channels with frosted diffusers',
        'Dual color / RGB tunable controllers & dimmers',
        'High-density 120/240 LED/meter continuous glow',
        'Concealed SMPS power supply heat dissipation'
      ],
      propertyType: 'Living Rooms, Bedrooms & Reception Areas',
      duration: 'Same-Day (3-6 Hours)',
      warranty: '6 Months Service Warranty',
      standard: 'High CRI > 80 LED'
    },
    {
      id: 'light-panel',
      name: 'Panel Lights (Square & Round)',
      category: 'Ceiling & Lighting',
      shortDesc: 'Ultra-slim, anti-glare recessed downlights for clean, bright, and uniform ambient light.',
      badge: 'Energy Saver',
      scope: [
        'Round & Square slim recessed ceiling panel lights',
        'False ceiling gypsum / POP cutout drilling',
        'Even edge-lit diffuser prevents eye strain',
        'Surge-protected internal constant drivers',
        'Retrofit replacement of old CFL fixtures'
      ],
      propertyType: 'Offices, Homes, Hospitals & Classrooms',
      duration: '2-4 Hours',
      warranty: '6 Months Service Warranty',
      standard: 'BIS Certified LED'
    },
    {
      id: 'light-chandelier',
      name: 'Chandelier Structural Hanging',
      category: 'Ceiling & Lighting',
      shortDesc: 'Master structural anchor testing and delicate assembly for luxury crystal chandeliers.',
      badge: 'Luxury Fixture',
      scope: [
        'Heavy-duty ceiling anchor hook load weight test',
        'Intricate crystal teardrop balancing & hanging',
        'Multi-tiered ring chandelier assembly',
        'Remote control / dual circuit switch wiring',
        'High ceiling scaffolding / safety ladder setup'
      ],
      propertyType: 'Luxury Villas, Hotel Lobbies & Dining Halls',
      duration: '4-6 Hours',
      warranty: '6 Months Service Warranty',
      standard: 'Reinforced Structural Mount'
    },
    {
      id: 'light-sconce',
      name: 'Decorative Wall Sconces',
      category: 'Ceiling & Lighting',
      shortDesc: 'Designer up-down wall lights, bedside reading lights, and staircase step lighting.',
      badge: 'Designer Touch',
      scope: [
        'Precision level laser alignment on finished walls',
        'Concealed wire joint inside junction boxes',
        'Warm white ambient glow fixtures',
        'Bedside switch & dual 2-way control wiring',
        'Staircase motion-sensor step lights'
      ],
      propertyType: 'Corridors, Staircases, Bedrooms & Facades',
      duration: '2-4 Hours',
      warranty: '90 Days Service Warranty',
      standard: 'Aesthetic Surface Finish'
    },
    {
      id: 'light-outdoor',
      name: 'Outdoor & Landscape Lighting',
      category: 'Ceiling & Lighting',
      shortDesc: 'IP65 waterproof garden spikes, gate pillars, and building facade illumination.',
      badge: 'Weatherproof',
      scope: [
        'IP65/IP67 waterproof garden spike floodlights',
        'Compound wall & gate pillar decorative fixtures',
        'Underground armored cable conduit runs',
        'Automatic daylight / dusk-to-dawn photocell sensor',
        'Tree uplighting & pathway guide illumination'
      ],
      propertyType: 'Gardens, Balconies, Penthouses & Facades',
      duration: '1-2 Days',
      warranty: '6 Months Service Warranty',
      standard: 'IP67 Waterproof Standard'
    },
    {
      id: 'light-other',
      name: 'Other Lighting Work (Custom Requirement)',
      category: 'Ceiling & Lighting',
      shortDesc: 'Custom lighting design, specialty light fixture, garden lights, or architectural illumination. Detail on the description board.',
      badge: 'Custom Work',
      scope: [
        'Custom lighting fixture fitting & driver hookup',
        'Cove / acoustic ceiling architectural layout',
        'Intelligent dimmers & automation configuration',
        'Lux level balancing & neat finish'
      ],
      propertyType: 'All Residential & Commercial Units',
      duration: 'Custom Assessment',
      warranty: 'Service Warranty Guaranteed',
      standard: 'Safety Standard Verified'
    }
  ],
  'Panel Board': [
    {
      id: 'panel-flush',
      name: 'Flush-Mount Concealed Panels',
      category: 'Panel Board',
      shortDesc: 'Clean in-wall recessed distribution boards fitting flush with the architectural wall plane.',
      badge: 'Architectural',
      scope: [
        'In-wall recess masonry chiseling & steel box mounting',
        'Multi-tier DIN rail busbar alignment',
        'Clean wire grouping, sleeve labeling & dressing',
        'Smoke-grey acrylic transparent door fitting',
        'Clear phase & load balancing across circuits'
      ],
      propertyType: 'Modern Apartments, Villas & Executive Suites',
      duration: '4-8 Hours',
      warranty: '1 Year Warranty',
      standard: 'IEC 61439 Compliant'
    },
    {
      id: 'panel-surface',
      name: 'Surface-Mount Wall Panels',
      category: 'Panel Board',
      shortDesc: 'Heavy-gauge powder-coated steel distribution boards ideal for rapid retrofits & basements.',
      badge: 'Heavy Gauge',
      scope: [
        'Sturdy anchor bolt mounting on concrete / brick walls',
        'Top and bottom cable knockout gland entries',
        'Dust & moisture resistant rubber gasket seal',
        'Single / 3-phase incoming isolator configuration',
        'Instant access for emergency breaker trip resets'
      ],
      propertyType: 'Basements, Workshops, Retails & Utility Rooms',
      duration: '3-6 Hours',
      warranty: '1 Year Warranty',
      standard: 'IP54 Enclosure Rating'
    },
    {
      id: 'panel-floor',
      name: 'Floor-Standing Commercial Panels',
      category: 'Panel Board',
      shortDesc: 'High-amperage main LT switchgear boards with digital metering for heavy complexes.',
      badge: 'Industrial Grade',
      scope: [
        'Heavy-duty floor-mounted sheet steel cubicle',
        'High-capacity copper / aluminum busbars (200A - 800A)',
        'Digital voltmeter, ammeter & multifuction energy meters',
        'MCCB incoming feeder with shunt trip protection',
        'Interlocked changeover switch for DG generator'
      ],
      propertyType: 'Function Halls, Commercial Plazas & Factories',
      duration: '1-3 Business Days',
      warranty: '1 Year Warranty',
      standard: 'IS:8623 Switchgear Standard'
    },
    {
      id: 'panel-mcb',
      name: 'MCB / RCCB Earth-Leakage Upgrades',
      category: 'Panel Board',
      shortDesc: 'Critical life-safety upgrade replacing old fuses with modern trip switches & shock prevention.',
      badge: 'Safety Critical',
      scope: [
        '30mA high-sensitivity RCCB / ELCB shock protection',
        'B/C curve miniature circuit breakers (MCBs)',
        'Messy bird-nest panel rewiring, combing & bundling',
        'Burned neutral link & loose busbar replacement',
        'Trip test verification with calibrated test meter'
      ],
      propertyType: 'All Homes, Apartments & Workplaces',
      duration: '2-4 Hours (Same Day)',
      warranty: '1 Year Warranty',
      standard: 'IS/IEC 60898 & 61008'
    },
    {
      id: 'panel-replace',
      name: 'Distribution Board Replacement',
      category: 'Panel Board',
      shortDesc: 'Complete overhaul and safe replacement of outdated, rusted, or hazardous fuse boards.',
      badge: 'Full Modernization',
      scope: [
        'Safe power shutdown & incoming load isolation',
        'Removal of old porcelain fuse boxes & wooden boards',
        'Installation of fire-retardant metal DB enclosure',
        'Complete circuit re-termination with copper lugs',
        'Detailed circuit identification chart on door'
      ],
      propertyType: 'Older Homes, Flat Complexes & Buildings',
      duration: '4-6 Hours',
      warranty: '1 Year Warranty',
      standard: 'Modern ISI Standard DB'
    },
    {
      id: 'panel-audit',
      name: 'Electrical Safety & Load Audit',
      category: 'Panel Board',
      shortDesc: 'Comprehensive thermal scan, phase load balancing, and insulation safety health check.',
      badge: 'Certified Audit',
      scope: [
        'Infrared thermal scanning for loose wire hotspots',
        'Megger insulation resistance test of cables',
        'Phase load balancing between R-Y-B phases',
        'Earth pit resistance verification with digital tester',
        'Written diagnostic audit report & recommendations'
      ],
      propertyType: 'Commercial Buildings, Hospitals, Villas & Halls',
      duration: '3-5 Hours',
      warranty: 'Official Audit Report',
      standard: 'National Electrical Code (NEC)'
    },
    {
      id: 'panel-other',
      name: 'Other Panel Board Work (Custom Requirement)',
      category: 'Panel Board',
      shortDesc: 'Custom breaker configuration, generator transfer switch, meter shifting, or industrial relay setup. Detail on description board.',
      badge: 'Custom Work',
      scope: [
        'Custom DB box fabrication & busbar sizing',
        'Phase isolation & dedicated trip protection',
        'Surge arrester & earthing bond link',
        'High-voltage load test & verification'
      ],
      propertyType: 'All Residential & Industrial Sites',
      duration: 'Custom Assessment',
      warranty: 'Service Warranty Guaranteed',
      standard: 'Safety Standard Verified'
    }
  ],
  'Other': [
    {
      id: 'other-general',
      name: 'Custom Electrical Service',
      category: 'Other',
      shortDesc: 'Any unlisted electrical repair, maintenance, installation, or unique project. Type and describe in the service description board.',
      badge: 'Most Flexible',
      scope: [
        'Personalized assessment based on your written description',
        'Transparent cost estimation before commencing work',
        'Licensed master electrician on-site with standard tools',
        'Certified safe handover & full testing'
      ],
      propertyType: 'Any Property (Home, Office, Shop, Villa)',
      duration: 'Flexible Schedule / On Demand',
      warranty: 'Standard Service Warranty',
      standard: 'Certified Workmanship'
    },
    {
      id: 'other-fault',
      name: 'Emergency Fault & Sparking Troubleshooting',
      category: 'Other',
      shortDesc: 'Urgent diagnostic investigation for recurring power trips, sparking switchboards, burning odors, or sudden blackouts.',
      badge: 'Urgent Priority',
      scope: [
        'Immediate short-circuit isolation & stabilization',
        'Digital megger & continuity fault tracing',
        'Damaged wire replacement & terminal re-crimping',
        'Root cause explanation & safety clearance'
      ],
      propertyType: 'All Homes, Complexes & Workplaces',
      duration: 'Immediate Priority Call-Out',
      warranty: 'Immediate Diagnostic Fix',
      standard: 'Critical Life-Safety Protocol'
    },
    {
      id: 'other-appliance',
      name: 'High-Load Appliance & EV Charger Wiring',
      category: 'Other',
      shortDesc: 'Heavy 3-phase or 1-phase dedicated lines for Electric Vehicle (EV) chargers, water pumps, commercial heaters, or inverters.',
      badge: 'High Load',
      scope: [
        'Heavy-duty industrial cable run (4.0mm - 10.0mm)',
        'Rotary isolator switch & weatherproof outlet box',
        'Direct distribution panel breaker termination',
        'Continuous peak load heat dissipation check'
      ],
      propertyType: 'Garages, Commercial Spaces & Independent Houses',
      duration: 'Same-Day / 1 Business Day',
      warranty: '6 Months Service Warranty',
      standard: 'Heavy Duty Certified'
    },
    {
      id: 'other-renovation',
      name: 'Full Renovation & Rewiring Audit',
      category: 'Other',
      shortDesc: 'Complete electrical overhaul for remodeled apartments, old building modernization, or comprehensive wire replacement.',
      badge: 'Full Modernization',
      scope: [
        'Old aluminum wire removal & replacement',
        'Modern modular concealed point re-routing',
        'Inverter backup wiring reorganization',
        'Certified compliance certificate upon completion'
      ],
      propertyType: 'Renovation Sites, Old Buildings & Apartments',
      duration: '1-3 Business Days',
      warranty: '1 Year Service Warranty',
      standard: 'Modern ISI Standard'
    }
  ]
};

export interface ServiceSelectionTableProps {
  category: 'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other';
  selectedService?: string;
  selectedServices?: string[];
  onSelectService?: (serviceName: string) => void;
  onToggleService?: (serviceName: string) => void;
  allowMultiple?: boolean;
  className?: string;
}

export const ServiceSelectionTable: React.FC<ServiceSelectionTableProps> = ({
  category,
  selectedService = '',
  selectedServices,
  onSelectService,
  onToggleService,
  allowMultiple = true,
  className = ''
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const packages = COMPREHENSIVE_SERVICE_PACKAGES[category] || [];

  // Determine currently selected list
  const activeSelectedList: string[] =
    selectedServices !== undefined
      ? selectedServices
      : selectedService
      ? [selectedService]
      : [];

  const isPackageSelected = (pkgName: string) => {
    if (selectedServices !== undefined) {
      return selectedServices.includes(pkgName);
    }
    if (!selectedService) return false;
    return (
      selectedService === pkgName ||
      selectedService.toLowerCase().includes(pkgName.toLowerCase()) ||
      pkgName.toLowerCase().includes(selectedService.toLowerCase())
    );
  };

  const handleToggle = (pkgName: string) => {
    if (onToggleService) {
      onToggleService(pkgName);
    } else if (onSelectService) {
      onSelectService(pkgName);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(query) ||
      pkg.shortDesc.toLowerCase().includes(query) ||
      pkg.propertyType.toLowerCase().includes(query) ||
      pkg.scope.some((s) => s.toLowerCase().includes(query))
    );
  });

  const getCategoryIcon = () => {
    switch (category) {
      case 'Wiring':
        return <Zap className="w-4 h-4 text-amber-300" />;
      case 'Ceiling & Lighting':
        return <Lightbulb className="w-4 h-4 text-sky-300" />;
      case 'Panel Board':
        return <Shield className="w-4 h-4 text-emerald-300" />;
      case 'Other':
        return <Wrench className="w-4 h-4 text-purple-300" />;
    }
  };

  const getCategoryTheme = () => {
    switch (category) {
      case 'Wiring':
        return {
          pill: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
          selectedBorder: 'border-amber-400/80',
          selectedBg: 'bg-gradient-to-r from-[#0d3670] to-[#124285]',
          accentText: 'text-amber-300'
        };
      case 'Ceiling & Lighting':
        return {
          pill: 'bg-sky-500/15 border-sky-400/40 text-sky-300',
          selectedBorder: 'border-sky-400/80',
          selectedBg: 'bg-gradient-to-r from-[#0c3166] to-[#0f448c]',
          accentText: 'text-sky-300'
        };
      case 'Panel Board':
        return {
          pill: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
          selectedBorder: 'border-emerald-400/80',
          selectedBg: 'bg-gradient-to-r from-[#0a335c] to-[#0d4778]',
          accentText: 'text-emerald-300'
        };
      case 'Other':
        return {
          pill: 'bg-purple-500/15 border-purple-400/40 text-purple-300',
          selectedBorder: 'border-purple-400/80',
          selectedBg: 'bg-gradient-to-r from-[#1c1242] to-[#2c1d63]',
          accentText: 'text-purple-300'
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table Template Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#061d40] border border-sky-400/25 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
            {getCategoryIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {category} Service Selection Table
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.pill}`}>
                {packages.length} Packages Available
              </span>
              {activeSelectedList.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ✓ {activeSelectedList.length} Selected Total
                </span>
              )}
            </div>
            <p className="text-[11px] text-sky-200/70">
              Select one or multiple service specifications from the table below. Click any row or checkbox to add/remove.
            </p>
          </div>
        </div>

        {/* Quick Search inside Table */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-sky-300/60" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter services..."
            className="w-full bg-[#041530] border border-sky-400/25 rounded-lg pl-8 pr-3 py-1.5 text-xs text-sky-100 placeholder-sky-300/40 focus:outline-hidden focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>
      </div>

      {/* NEW TEMPLATE: INTERACTIVE ELECTRICAL SERVICES TABLE */}
      <div className="border border-sky-400/25 rounded-xl overflow-hidden bg-[#071c3b]/90 shadow-xl backdrop-blur-md">
        {/* Desktop & Tablet Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#0d346b] to-[#124285] border-b border-sky-400/30 text-[11px] uppercase tracking-wider font-bold text-sky-200">
                <th className="py-3 px-3 w-14 text-center">Select</th>
                <th className="py-3 px-4 w-60">Service Package</th>
                <th className="py-3 px-4 min-w-[240px]">Scope & Inclusions</th>
                <th className="py-3 px-4 w-44">Property / Application</th>
                <th className="py-3 px-4 w-36">Est. Turnaround</th>
                <th className="py-3 px-3 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-400/15 text-xs text-sky-100">
              {filteredPackages.map((pkg) => {
                const isSelected = isPackageSelected(pkg.name);

                return (
                  <tr
                    key={pkg.id}
                    onClick={() => handleToggle(pkg.name)}
                    className={`cursor-pointer transition-all duration-150 select-none group ${
                      isSelected
                        ? `${theme.selectedBg} border-l-4 ${theme.selectedBorder} shadow-inner`
                        : 'hover:bg-[#0c2f60]/70'
                    }`}
                  >
                    {/* Select Checkbox Column */}
                    <td className="py-3 px-3 text-center align-top">
                      <div className="mt-1 flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-sky-300 bg-gradient-to-br from-sky-400 to-blue-500 text-slate-950 shadow-md shadow-sky-400/40 scale-105'
                              : 'border-sky-400/40 bg-slate-900 group-hover:border-sky-300 group-hover:bg-[#07244d]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </td>

                    {/* Service Package Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-100 group-hover:text-sky-300'}`}>
                            {pkg.name}
                          </span>
                        </div>
                        {pkg.badge && (
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              pkg.badge === 'Most Popular' || pkg.badge === 'Life Safety'
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                : 'bg-sky-400/20 text-sky-200 border-sky-400/40'
                            }`}
                          >
                            {pkg.badge}
                          </span>
                        )}
                        <p className="text-[11px] text-sky-200/75 leading-tight pt-0.5">
                          {pkg.shortDesc}
                        </p>
                      </div>
                    </td>

                    {/* Scope & Inclusions Column */}
                    <td className="py-3 px-4 align-top">
                      <ul className="space-y-1">
                        {pkg.scope.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-sky-100/90 leading-tight">
                            <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Property / Application Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sky-200 font-medium text-[11px]">
                          {pkg.propertyType.toLowerCase().includes('villa') || pkg.propertyType.toLowerCase().includes('home') ? (
                            <Home className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          ) : pkg.propertyType.toLowerCase().includes('flat') || pkg.propertyType.toLowerCase().includes('apartment') ? (
                            <Building2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                          ) : (
                            <Building className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          )}
                          <span>{pkg.propertyType}</span>
                        </div>
                        <span className="inline-block text-[10px] text-sky-300/70 border border-sky-400/20 px-1.5 py-0.5 rounded-sm bg-[#051833]">
                          {pkg.standard}
                        </span>
                      </div>
                    </td>

                    {/* Turnaround & Standard Column */}
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1 text-sky-200 font-semibold">
                          <Clock className="w-3 h-3 text-sky-400" />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="text-[10px] text-emerald-300 font-medium">
                          ✓ {pkg.warranty}
                        </div>
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="py-3 px-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(pkg.name);
                        }}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/30 hover:bg-rose-500 hover:text-white'
                            : 'bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Select</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Stacked Table Template Cards */}
        <div className="md:hidden divide-y divide-sky-400/20">
          {filteredPackages.map((pkg) => {
            const isSelected = isPackageSelected(pkg.name);

            return (
              <div
                key={pkg.id}
                onClick={() => handleToggle(pkg.name)}
                className={`p-4 transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? `${theme.selectedBg} border-l-4 ${theme.selectedBorder}`
                    : 'bg-[#071c3b]/80 hover:bg-[#0c2f60]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-sky-300 bg-gradient-to-br from-sky-400 to-blue-500 text-slate-950 shadow-md'
                          : 'border-sky-400/40 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{pkg.name}</h4>
                      {pkg.badge && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 px-1.5 py-0.5 rounded-sm border border-amber-400/30 mr-1.5">
                          {pkg.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-sky-300/80">{pkg.duration}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(pkg.name);
                    }}
                    className={`py-1 px-3 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-sky-500/20 text-sky-200 border border-sky-400/30'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : '+ Select'}
                  </button>
                </div>

                <p className="text-xs text-sky-200/80 leading-relaxed">{pkg.shortDesc}</p>

                {/* Scope Inclusions */}
                <div className="bg-[#051733] p-2.5 rounded-lg border border-sky-400/15 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300/70 block">
                    Key Work Scope:
                  </span>
                  {pkg.scope.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-sky-100">
                      <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {pkg.scope.length > 3 && (
                    <span className="text-[10px] text-sky-300/60 block pl-4">
                      + {pkg.scope.length - 3} additional certified tests & connections
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-sky-200/90">
                  <span className="text-[10px] text-sky-300/70">📍 {pkg.propertyType}</span>
                  <span className="text-[10px] text-emerald-300 font-semibold">✓ {pkg.warranty}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="p-8 text-center text-sky-200 space-y-2">
            <AlertCircle className="w-8 h-8 text-sky-400/60 mx-auto" />
            <p className="text-sm font-semibold">No services match your search filter</p>
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="text-xs text-sky-300 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Selected Services Active Confirmation Tray with Multi-Pills */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0c3166] to-[#0f448c] border border-sky-400/40 text-xs text-white shadow-md space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-sky-200 uppercase tracking-wider block font-bold">
                Selected Electrical Services:
              </span>
              <span className="text-xs text-sky-100 font-semibold">
                {activeSelectedList.length === 0
                  ? 'No service options selected yet'
                  : `${activeSelectedList.length} service package${activeSelectedList.length > 1 ? 's' : ''} chosen`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeSelectedList.length > 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Multiple Selected ({activeSelectedList.length})
              </span>
            )}
            <span className="text-[11px] font-semibold text-sky-200 bg-sky-500/20 px-2.5 py-0.5 rounded-md border border-sky-400/30">
              Multi-Select Active
            </span>
          </div>
        </div>

        {/* Selected Service Chips List */}
        {activeSelectedList.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-sky-400/20">
            {activeSelectedList.map((srvName) => (
              <span
                key={srvName}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#041530] text-sky-100 border border-sky-400/40 shadow-sm transition-all hover:border-amber-400/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-white font-medium">{srvName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(srvName);
                  }}
                  className="p-0.5 ml-0.5 rounded hover:bg-rose-500/30 text-sky-300 hover:text-rose-300 transition-colors"
                  title={`Remove ${srvName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="pt-1 border-t border-sky-400/20 text-sky-200/70 text-[11px] italic">
            Click on any service package above to select it. You can select multiple options across categories.
          </div>
        )}
      </div>
    </div>
  );
};
