export interface WashPackage {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
  features: string[];
  tag?: string;
  image: string;
}

export type VehicleType = 'sedan' | 'suv' | 'truck' | 'coupe';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
}

export interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  vehicle: Vehicle;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  loyaltyPoints: number;
  premiumStatus: boolean;
  memberSince: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  promoCode: string;
  discountPercent: number;
  description: string;
  image: string;
  claimed: boolean;
}
