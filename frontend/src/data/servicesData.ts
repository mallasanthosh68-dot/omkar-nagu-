import { ServiceItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  // WIRING SERVICES
  {
    id: 'wire-house',
    category: 'Wiring',
    name: 'House Wiring',
    description: 'Comprehensive electrical wiring solutions for individual houses, villas, and independent residential spaces.',
    features: [
      'New house complete wiring',
      'Complete house electrical rewiring',
      'Modular switch & socket installation',
      'Fan & ceiling light points layout',
      'Earthing & surge safety setup'
    ],
    badge: 'Popular'
  },
  {
    id: 'wire-apt',
    category: 'Wiring',
    name: 'Apartment Wiring',
    description: 'Specialized apartment and multi-floor electrical wiring ensuring load distribution and safety codes.',
    features: [
      'Individual flat electrical wiring',
      'Complete apartment conduit setup',
      'Old apartment rewiring & upgrades',
      'Heavy appliance dedicated lines (AC, Geyser)',
      'Sub-meter and distribution connection'
    ]
  },
  {
    id: 'wire-hall',
    category: 'Wiring',
    name: 'Function Hall Wiring',
    description: 'High-capacity temporary & permanent electrical setup for wedding halls, convention centers, and event spaces.',
    features: [
      'Temporary heavy electrical wiring',
      'Stage power distribution & connections',
      'High-wattage event lighting links',
      'Generator transfer switch wiring',
      '3-phase load balance management'
    ],
    badge: 'High Capacity'
  },
  {
    id: 'wire-other',
    category: 'Wiring',
    name: 'Commercial & Shop Wiring',
    description: 'Professional wiring for retail shops, corporate offices, warehouses, and industrial facilities.',
    features: [
      'Shop display & retail wiring',
      'Office cubicle & server power wiring',
      'Commercial building conduit runs',
      'Industrial electrical wiring & machinery feeds',
      'Emergency backup circuit wiring'
    ]
  },

  // CEILING & LIGHTING SERVICES
  {
    id: 'light-track',
    category: 'Ceiling & Lighting',
    name: 'Track Lighting Installation',
    description: 'Precision architectural track light installations for art galleries, modern residences, and retail showcases.',
    features: [
      'Single-phase & 3-phase track rails',
      'Adjustable spotlight focus alignment',
      'Dimmer switch compatibility',
      'Sleek surface and pendant track mounting',
      'Energy-efficient driver setup'
    ]
  },
  {
    id: 'light-led',
    category: 'Ceiling & Lighting',
    name: 'LED Lights & Strips',
    description: 'Modern LED illumination including hidden cove lights, false ceiling strips, and high-lumen tube fittings.',
    features: [
      'False ceiling LED cove strip lights',
      'High-lumen LED tube light fitting',
      'Ultra-slim LED ceiling downlights',
      'Color-tunable (Warm/Cool/Natural) drivers',
      'Aluminum profile channel mounting'
    ],
    badge: 'Modern'
  },
  {
    id: 'light-panel',
    category: 'Ceiling & Lighting',
    name: 'Panel Lights (Square & Round)',
    description: 'Clean, glare-free recessed and surface-mount panel lights designed for uniform illumination.',
    features: [
      'Square flush-mount panel fixtures',
      'Round slim recessed downlights',
      'Surface-mounted ceiling panels',
      'Office & hospital grade anti-glare diffusers',
      'Quick replacement and retrofit services'
    ]
  },
  {
    id: 'light-chandelier',
    category: 'Ceiling & Lighting',
    name: 'Chandelier Installation',
    description: 'Expert structural hanging and electrical wiring for luxury crystal and modern chandeliers.',
    features: [
      'Home luxury crystal chandelier mounting',
      'Hotel lobby large-scale fixtures',
      'Function hall decorative hanging lights',
      'Reinforced ceiling anchor hook testing',
      'Intricate crystal assembly & bulb balancing'
    ],
    badge: 'Premium'
  },
  {
    id: 'light-decorative',
    category: 'Ceiling & Lighting',
    name: 'Decorative & Outdoor Lighting',
    description: 'Weatherproof landscape lighting, facade illumination, garden lights, and designer interior wall sconces.',
    features: [
      'Waterproof IP65/IP67 outdoor lights',
      'Garden spike & pathway illumination',
      'Modern decorative wall sconces',
      'Building facade accent lighting',
      'Automatic twilight/daylight sensor switches'
    ]
  },

  // PANEL BOARD INSTALLATION
  {
    id: 'panel-flush',
    category: 'Panel Board',
    name: 'Flush-Mount Panels',
    description: 'Concealed in-wall distribution boards providing a seamless, flush architectural appearance.',
    features: [
      'In-wall recessed enclosure installation',
      'Clean cable gland entry & dressing',
      'Multi-tier modular MCB capacity',
      'Aesthetic smoke-grey acrylic door',
      'Clear phase circuit identification labels'
    ]
  },
  {
    id: 'panel-surface',
    category: 'Panel Board',
    name: 'Surface-Mount Panels',
    description: 'Sturdy wall-mounted distribution boards ideal for retrofit installations, basements, and workshops.',
    features: [
      'Heavy-gauge powder-coated steel box',
      'Direct wall surface anchoring',
      'Easy accessibility for maintenance',
      'Conduit knockout flexibility',
      'Weather-resistant seal options'
    ]
  },
  {
    id: 'panel-floor',
    category: 'Panel Board',
    name: 'Floor-Standing Panels',
    description: 'High-power main LT distribution boards and control panels for commercial complexes and function halls.',
    features: [
      'Heavy-duty floor-anchored steel cubicle',
      'High-amperage busbar configuration',
      'Digital voltmeter & ammeter integration',
      'Multi-feeder breaker distribution',
      'Industrial safety interlocks & venting'
    ],
    badge: 'Industrial'
  },
  {
    id: 'panel-additional',
    category: 'Panel Board',
    name: 'MCB / RCCB & Safety Upgrades',
    description: 'Comprehensive electrical protection upgrades, fault current safety, and panel reorganization.',
    features: [
      'MCB (Miniature Circuit Breaker) setup',
      'RCCB / ELCB earth-leakage shock protection',
      'Messy panel circuit rewiring & combing',
      'Burned breaker & busbar replacement',
      'Complete safety load audit & inspection'
    ],
    badge: 'Safety Critical'
  },

  // OTHER / CUSTOM ELECTRICAL SERVICES
  {
    id: 'other-custom',
    category: 'Other',
    name: 'Custom Electrical Service',
    description: 'Any unlisted electrical repair, custom installation, specialty machine, or unique residential/commercial requirement. Describe your needs on our service description board.',
    features: [
      'Personalized consultation based on your written description',
      'Transparent on-site estimate before starting',
      'Licensed master electricians with full toolkit',
      'Flexible scheduling tailored to your convenience'
    ],
    badge: 'Custom Specification'
  },
  {
    id: 'other-emergency',
    category: 'Other',
    name: 'Emergency Fault & Sparking Repair',
    description: 'Rapid troubleshooting and emergency stabilization for power tripping, sparking switchboards, burning odors, or sudden blackouts.',
    features: [
      'Immediate short-circuit isolation & stabilization',
      'Digital continuity & megger fault tracing',
      'Damaged wire replacement & safety clearance',
      'Root-cause electrical inspection'
    ],
    badge: 'Urgent Priority'
  },
  {
    id: 'other-appliance',
    category: 'Other',
    name: 'High-Load Appliance & EV Charger Wiring',
    description: 'Dedicated heavy single/three-phase line installation for EV charging stations, water pumps, water heaters, or industrial machinery.',
    features: [
      'Dedicated 4.0mm - 10.0mm copper line run',
      'Rotary isolator switch & weatherproof point',
      'Direct panel breaker connection & load test',
      'Safe earthing path verification'
    ],
    badge: 'Heavy Capacity'
  }
];
