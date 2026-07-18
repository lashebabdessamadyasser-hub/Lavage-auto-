import { WashPackage, Vehicle, Booking, UserProfile, Promotion } from './types';

export const INITIAL_PACKAGES: WashPackage[] = [
  {
    id: 'glacier-hydro',
    name: 'Glacier Hydro',
    price: 25,
    duration: 30,
    description: 'Parfait pour un entretien hebdomadaire rapide. Rinçage précis à haute pression et mousse active protectrice.',
    features: [
      'Lavage à la mousse active haute pression',
      'Rinçage du châssis',
      'Nettoyage des jantes double action',
      'Séchage sans traces par osmose inverse'
    ],
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'glacier-guard',
    name: 'Glacier Guard',
    price: 45,
    duration: 45,
    description: 'Protection et brillance supérieures. Applique un bouclier hydrophobe avancé sur le vernis de votre voiture.',
    features: [
      'Tout ce qui est inclus dans Glacier Hydro',
      'Scellant pour vitres hydrophobe avancé',
      'Application de cire de polissage tri-couleurs',
      'Nettoyage et protection des pneus',
      'Inhibiteur de rouille sous châssis'
    ],
    tag: 'Meilleur Rapport Qualité/Prix',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ice-detail-pro',
    name: 'Ice Detail Pro',
    price: 85,
    duration: 75,
    description: 'Un lavage complet intérieur et extérieur, pour une expérience de conduite fraîche et saine.',
    features: [
      'Tout ce qui est inclus dans Glacier Guard',
      'Aspiration profonde des tapis et sièges',
      'Désinfection à la vapeur et désodorisation',
      'Soin des cuirs / Shampoing des tissus',
      'Nettoyage des conduits d\'air et aérations'
    ],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'thermal-ultimate',
    name: 'Thermal Ultimate',
    price: 140,
    duration: 120,
    description: 'Le summum du rajeunissement automobile. Technologie thermique avancée et polissage céramique de pointe.',
    features: [
      'Tout ce qui est inclus dans Ice Detail Pro',
      'Traitement thermique par infrarouge',
      'Bouclier céramique nanotech pour vitres et carrosserie',
      'Nettoyage et dégraissage du compartiment moteur',
      'Polissage et lustrage haute brillance à la machine'
    ],
    tag: 'Choix Premium',
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
    title: 'Forfait Detail Premium',
    subtitle: 'Protection Hivernale Exclusive',
    promoCode: 'GLACIER_PREMIUM_20',
    discountPercent: 20,
    description: 'Découvrez notre forfait d\'entretien le plus complet à ce jour. Mousse de neige active haute pression, revêtement barrière céramique pour jantes et nettoyage à la vapeur de l\'habitacle.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmzHod5bNbZ-webu2cBp0mvITdvbveBhroDThMDWkx2OJAOHWdncAoj9eQmXwkh7Wen5DenLQ5vjxwpcCG_WEo-PYhBRVle93WHrDAML6uaASy-SDuC1vgNJU_WX2gsXlwf4OqYAP5DRj0vH3m-r5dDPQ68T3NyawalcXmH8SxugdGj7eu4Kzpw9fR-UvrFxdKBBRytA6JJyUDEKH7mnjbIDmBYOkqic_ukVRr_XfwTJih3pRt0ssjDg',
    claimed: false
  },
  {
    id: 'promo-midweek',
    title: 'Éclat de Semaine',
    subtitle: 'Spécial Mardi & Mercredi',
    promoCode: 'GLOW_RUSH_15',
    discountPercent: 15,
    description: 'Évitez l\'affluence du week-end ! Réservez n\'importe quel lavage le mardi ou le mercredi et économisez 15% supplémentaires avec rinçage du châssis inclus.',
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
