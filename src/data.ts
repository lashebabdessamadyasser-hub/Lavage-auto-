import { WashPackage, Vehicle, Booking, UserProfile, Promotion } from './types';

export const INITIAL_PACKAGES: WashPackage[] = [
  {
    id: 'glacier-hydro',
    name: 'Glacier Hydro',
    price: 25,
    duration: 30,
    description: 'Perfect for quick weekly maintenance. Precise high-pressure rinse and protective active snow foam.',
    features: [
      'High-pressure active foam wash',
      'Underbody spray rinse',
      'Dual-action wheel cleaning',
      'Spot-free reverse osmosis dry'
    ],
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'glacier-guard',
    name: 'Glacier Guard',
    price: 45,
    duration: 45,
    description: 'Superior protection and shine. Imparts an advanced hydrophobic shield on your car\'s clear coat.',
    features: [
      'Everything in Glacier Hydro',
      'Advanced hydrophobic glass sealant',
      'Tri-color polish wax application',
      'Tire cleaning and tire dress barrier',
      'Rust-shield undercarriage inhibitor'
    ],
    tag: 'Best Value',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ice-detail-pro',
    name: 'Ice Detail Pro',
    price: 85,
    duration: 75,
    description: 'An exhaustive deep wash inside and out, keeping your driving experience fresh and sanitary.',
    features: [
      'Everything in Glacier Guard',
      'Deep interior carpet & seat vacuuming',
      'Interior steam disinfection & deodorizing',
      'Leather conditioning / upholstery shampoo',
      'Air duct & vents cleaning'
    ],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'thermal-ultimate',
    name: 'Thermal Ultimate',
    price: 140,
    duration: 120,
    description: 'The pinnacle of automotive rejuvenation. Features advanced thermal tech and state-of-the-art ceramic polish.',
    features: [
      'Everything in Ice Detail Pro',
      'Infrared thermal treatment cure',
      'Nanotech glass & paint ceramic shield',
      'Engine bay wash and deep-degreasing',
      'High-gloss machine swirl buff & polish'
    ],
    tag: 'Premium Choice',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'car-1',
    make: 'Porsche',
    model: '911 GT3 RS',
    licensePlate: 'GL-911-ICE',
    type: 'coupe'
  },
  {
    id: 'car-2',
    make: 'Tesla',
    model: 'Model S Plaid',
    licensePlate: 'EV-800-WSH',
    type: 'sedan'
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-detail',
    title: 'Premium Detail Package',
    subtitle: 'Exclusive Winter Protection',
    promoCode: 'GLACIER_PREMIUM_20',
    discountPercent: 20,
    description: 'Experience our most comprehensive detail package yet. Deep high-pressure active snow foam, wheel-ceramic barrier coating, and pristine interior steam cleaning.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmzHod5bNbZ-webu2cBp0mvITdvbveBhroDThMDWkx2OJAOHWdncAoj9eQmXwkh7Wen5DenLQ5vjxwpcCG_WEo-PYhBRVle93WHrDAML6uaASy-SDuC1vgNJU_WX2gsXlwf4OqYAP5DRj0vH3m-r5dDPQ68T3NyawalcXmH8SxugdGj7eu4Kzpw9fR-UvrFxdKBBRytA6JJyUDEKH7mnjbIDmBYOkqic_ukVRr_XfwTJih3pRt0ssjDg',
    claimed: false
  },
  {
    id: 'promo-midweek',
    title: 'Midweek Glow Rush',
    subtitle: 'Tuesday & Wednesday Special',
    promoCode: 'GLOW_RUSH_15',
    discountPercent: 15,
    description: 'Beat the weekend rush! Book any wash on Tuesday or Wednesday and save an extra 15% with complete undercarriage rinse included.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600',
    claimed: false
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Yasser Lasheb',
  email: 'lashebabdessamadyasser@gmail.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHFetXTE8qX5YgKJd_9kcKAB3vbsyD693_wwhNG51dqpfSiWqhQXkeZUGvatSHcspolW3gA_paSePGN8plJBVcdLF7XR-GBBATUl6CU-WaXaEuWyFU0U9K8bhur8kX0NIsCuEIJt-hRZlU3GJzhKokFqe52qglwWCgPqYk-ggNfSBFwnTIpdUfxr2EdZ_mDhcbTf5x8MGjsaCopG9ls_lGqDNeYW1F_HhH7ScvcQ0KhGZZvAvJ6B8guA',
  loyaltyPoints: 340,
  premiumStatus: true,
  memberSince: 'Oct 2024'
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    packageId: 'ice-detail-pro',
    packageName: 'Ice Detail Pro',
    packagePrice: 85,
    date: '2026-07-10',
    time: '14:30',
    vehicle: INITIAL_VEHICLES[0],
    status: 'completed',
    createdAt: '2026-07-08T10:15:00Z'
  },
  {
    id: 'b-2',
    packageId: 'glacier-guard',
    packageName: 'Glacier Guard',
    packagePrice: 45,
    date: '2026-07-20',
    time: '10:00',
    vehicle: INITIAL_VEHICLES[1],
    status: 'upcoming',
    createdAt: '2026-07-16T15:40:00Z'
  }
];
