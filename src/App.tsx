import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Data & Types
import { 
  INITIAL_PACKAGES, 
  INITIAL_VEHICLES, 
  INITIAL_PROMOTIONS, 
  INITIAL_PROFILE, 
  INITIAL_BOOKINGS 
} from './data';
import { UserProfile, Vehicle, Booking, Promotion } from './types';

// Components
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import BookView from './components/BookView';
import ActivityView from './components/ActivityView';
import ProfileView from './components/ProfileView';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  
  // State with Local Storage synchronization
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('glacier_user');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('glacier_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('glacier_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('glacier_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [cmsData, setCmsData] = useState(() => {
    const saved = localStorage.getItem('glacier_cms');
    return saved ? JSON.parse(saved) : {
      heroTitle: "L'EXPÉRIENCE GLACIER",
      heroSubtitle: "Nettoyage de précision futuriste et revêtements céramiques haute brillance pour véhicules de performance.",
      promoText: "Découvrez notre forfait d'entretien le plus complet à ce jour. Mousse de neige active haute pression, revêtement barrière céramique pour jantes et nettoyage à la vapeur de l'habitacle."
    };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('glacier_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('glacier_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('glacier_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('glacier_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('glacier_cms', JSON.stringify(cmsData));
  }, [cmsData]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Toast dispatch helper
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Actions
  const handleClaimPromo = (id: string) => {
    setPromotions((prev) => 
      prev.map((promo) => 
        promo.id === id ? { ...promo, claimed: true } : promo
      )
    );
    const promo = promotions.find(p => p.id === id);
    if (promo) {
      addToast(`Code Promo ${promo.promoCode} appliqué à votre prochain lavage !`, 'success');
    }
  };

  const handleAddVehicle = (newVeh: Omit<Vehicle, 'id'>): Vehicle => {
    const created: Vehicle = {
      ...newVeh,
      id: `car-${Date.now()}`
    };
    setVehicles((prev) => [...prev, created]);
    addToast(`${created.make} ${created.model} ajouté avec succès à votre garage !`, 'success');
    return created;
  };

  const handleDeleteVehicle = (id: string) => {
    const toDelete = vehicles.find(v => v.id === id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (toDelete) {
      addToast(`${toDelete.make} ${toDelete.model} retiré du garage.`, 'info');
    }
  };

  const handleCreateBooking = (newBooking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const booking: Booking = {
      ...newBooking,
      id: `gl-${Math.random().toString(36).substring(2, 7)}`,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [booking, ...prev]);
    
    // Add points based on price
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.round(booking.packagePrice)
    }));

    addToast(`Réservation réussie pour ${booking.packageName} ! Détails dans l\'onglet Activité.`, 'success');
    
    // Redirect to Activity tab
    setCurrentTab('activity');
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) => 
      prev.map((b) => 
        b.id === id ? { ...b, status: 'cancelled' } : b
      )
    );
    addToast('Votre rendez-vous a été annulé avec succès.', 'info');
  };

  const handleRedeemFreeWash = () => {
    if (user.loyaltyPoints < 500) return;

    // Deduct points
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - 500
    }));

    // Find first available vehicle
    const targetVehicle = vehicles[0] || INITIAL_VEHICLES[0];

    // Create free booking
    const freeBooking: Booking = {
      id: `gl-free-${Math.random().toString(36).substring(2, 7)}`,
      packageId: 'glacier-hydro',
      packageName: 'Glacier Hydro (Récompense gratuite)',
      packagePrice: 0,
      date: '2026-07-22',
      time: '11:00',
      vehicle: targetVehicle,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [freeBooking, ...prev]);
    addToast('Lavage gratuit réclamé ! Détails dans l\'onglet Activité.', 'success');
    setCurrentTab('activity');
  };

  const handleUpdateCmsData = (newData: Partial<typeof cmsData>) => {
    setCmsData((prev) => ({ ...prev, ...newData }));
    addToast('Contenu CMS de l\'application mis à jour avec succès.', 'success');
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView 
            promotions={promotions}
            claimPromo={handleClaimPromo}
            onBookClick={() => setCurrentTab('book')}
            cmsData={cmsData}
            updateCmsData={handleUpdateCmsData}
          />
        );
      case 'book':
        return (
          <BookView 
            packages={INITIAL_PACKAGES}
            vehicles={vehicles}
            addVehicle={handleAddVehicle}
            activePromotions={promotions}
            createBooking={handleCreateBooking}
          />
        );
      case 'activity':
        return (
          <ActivityView 
            bookings={bookings}
            cancelBooking={handleCancelBooking}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            user={user}
            vehicles={vehicles}
            addVehicle={handleAddVehicle}
            deleteVehicle={handleDeleteVehicle}
            redeemFreeWash={handleRedeemFreeWash}
          />
        );
      default:
        return (
          <HomeView 
            promotions={promotions}
            claimPromo={handleClaimPromo}
            onBookClick={() => setCurrentTab('book')}
            cmsData={cmsData}
            updateCmsData={handleUpdateCmsData}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0e1a] text-[#e0e8f0] pb-24 md:pb-6">
      {/* Dynamic Background subtle overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[#7dd3fc]/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#c8a0f0]/5 blur-[120px]" />
      </div>

      {/* Header element */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user} 
      />

      {/* Main interactive content frame */}
      <main className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer element */}
      <Footer />

      {/* Mobile Sticky Bottom Nav bar */}
      <MobileNav 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* dynamic Toast alerts portal overlay */}
      <div id="toast-portal" className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="pointer-events-auto glass-elevated border border-[#7dd3fc]/20 rounded-xl p-4 flex gap-3 shadow-lg"
            >
              {t.type === 'success' && <CheckCircle className="text-green-400 flex-shrink-0" size={20} />}
              {t.type === 'info' && <Bell className="text-[#7dd3fc] flex-shrink-0" size={20} />}
              {t.type === 'error' && <XCircle className="text-red-400 flex-shrink-0" size={20} />}
              
              <div className="text-xs text-[#e0e8f0] font-medium leading-relaxed flex-1">
                {t.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
