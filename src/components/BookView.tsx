import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, Calendar, Clock, ChevronRight, ChevronLeft, Plus, 
  Check, Shield, Sparkles, Tag, Info, ListTodo, CheckCircle2 
} from 'lucide-react';
import { WashPackage, Vehicle, VehicleType, Booking, Promotion } from '../types';

interface BookViewProps {
  packages: WashPackage[];
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  activePromotions: Promotion[];
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:30', '15:30', '16:30', '17:30', '18:30'
];

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

const ADD_ONS: AddOn[] = [
  { id: 'scent', name: 'Premium Interior Lavender Scent', price: 5, description: 'Infuse your cabin with calming therapeutic oils' },
  { id: 'engine', name: 'Engine Bay Cleaning & Dressing', price: 25, description: 'Safely degrease and coat all synthetic engine covers' },
  { id: 'repel', name: 'Ceramic Shield Rain Repellent', price: 15, description: 'Double polymer glass protection for maximum storm visibility' },
];

export default function BookView({ 
  packages, 
  vehicles, 
  addVehicle, 
  activePromotions, 
  createBooking 
}: BookViewProps) {
  // Steps: 0 = Vehicle, 1 = Package, 2 = Date & Time, 3 = Add-ons, 4 = Summary
  const [step, setStep] = useState(0);

  // Form selections
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // New vehicle form modal toggle
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState<VehicleType>('sedan');

  // Pre-select first vehicle
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  // Pre-select first package
  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [packages, selectedPackageId]);

  // Apply claimed promotions by default if present
  useEffect(() => {
    const claimedPromo = activePromotions.find(p => p.claimed);
    if (claimedPromo && !appliedDiscount) {
      setAppliedDiscount({
        code: claimedPromo.promoCode,
        percent: claimedPromo.discountPercent
      });
      setPromoCode(claimedPromo.promoCode);
    }
  }, [activePromotions, appliedDiscount]);

  // Generate next 7 days visual calendar
  const getNext7Days = () => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Start from the current day 2026-07-18
    const baseDate = new Date('2026-07-18T11:15:10-07:00');
    
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(baseDate);
      futureDate.setDate(baseDate.getDate() + i);
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const date = String(futureDate.getDate()).padStart(2, '0');
      
      days.push({
        formatted: `${year}-${month}-${date}`,
        dayName: weekdays[futureDate.getDay()],
        dayNum: futureDate.getDate(),
        monthName: futureDate.toLocaleString('default', { month: 'short' }),
        isToday: i === 0
      });
    }
    return days;
  };

  const datesList = getNext7Days();

  // Set default date
  useEffect(() => {
    if (!selectedDate && datesList.length > 0) {
      setSelectedDate(datesList[0].formatted);
    }
  }, [datesList, selectedDate]);

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMake || !newModel || !newPlate) return;

    const created = addVehicle({
      make: newMake,
      model: newModel,
      licensePlate: newPlate,
      type: newType
    });

    setSelectedVehicleId(created.id);
    setNewMake('');
    setNewModel('');
    setNewPlate('');
    setShowAddVehicleForm(false);
  };

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter(item => item !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  const handleApplyPromoCode = () => {
    setPromoError('');
    if (!promoCode) return;

    // Check against active promotions
    const found = activePromotions.find(
      p => p.promoCode.toLowerCase().trim() === promoCode.toLowerCase().trim()
    );

    if (found) {
      setAppliedDiscount({
        code: found.promoCode,
        percent: found.discountPercent
      });
    } else if (promoCode.toUpperCase() === 'GLACIER_ULTIMATE') {
      setAppliedDiscount({
        code: 'GLACIER_ULTIMATE',
        percent: 25
      });
    } else {
      setPromoError('Invalid coupon code. Try GLACIER_PREMIUM_20');
      setAppliedDiscount(null);
    }
  };

  // Calculations
  const selectedPkg = packages.find(p => p.id === selectedPackageId) || packages[0];
  const addonsTotal = ADD_ONS
    .filter(a => selectedAddOns.includes(a.id))
    .reduce((sum, current) => sum + current.price, 0);
  const basePrice = selectedPkg?.price || 0;
  const subtotal = basePrice + addonsTotal;
  const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent) / 100) : 0;
  const total = subtotal - discountAmount;
  const pointsToEarn = total;

  const handleConfirmBooking = () => {
    const selectedVeh = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
    if (!selectedVeh || !selectedPkg || !selectedDate || !selectedTime) return;

    // Assemble dynamic add-on names for features if any
    const finalPkgName = selectedPkg.name + (selectedAddOns.length > 0 ? ' (with Add-ons)' : '');

    createBooking({
      packageId: selectedPkg.id,
      packageName: finalPkgName,
      packagePrice: total,
      date: selectedDate,
      time: selectedTime,
      vehicle: selectedVeh
    });
  };

  return (
    <div id="booking-wizard-view" className="max-w-5xl mx-auto px-4 py-24 min-h-screen">
      {/* Title */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-sans text-3xl font-bold text-[#e0e8f0] flex items-center justify-center md:justify-start gap-2">
          <Sparkles className="text-[#7dd3fc]" />
          <span>Book Your Glacier Treatment</span>
        </h2>
        <p className="text-[#a0b4c4] text-sm mt-2">Precision wash booking simulator with real-time slot selection and pricing</p>
      </div>

      {/* Progress Stepper bar */}
      <div className="grid grid-cols-5 gap-2 mb-8 select-none">
        {['Vehicle', 'Package', 'Schedule', 'Add-ons', 'Confirm'].map((lbl, idx) => (
          <button
            key={lbl}
            id={`step-indicator-${idx}`}
            onClick={() => idx <= step && setStep(idx)}
            className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              idx === step 
                ? 'bg-[#7dd3fc]/15 border-[#7dd3fc]/40 text-[#7dd3fc]' 
                : idx < step 
                  ? 'bg-[#0f1524]/40 border-[#7dd3fc]/10 text-green-400'
                  : 'bg-[#0f1524]/20 border-transparent text-[#a0b4c4]'
            }`}
          >
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center ${
              idx === step ? 'bg-[#7dd3fc]/20' : idx < step ? 'bg-green-500/10' : 'bg-[#141c2e]'
            }`}>
              {idx < step ? <Check size={12} /> : idx + 1}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block">{lbl}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: VEHICLE */}
            {step === 0 && (
              <motion.div
                key="step-veh"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-panel p-6 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-[#e0e8f0] uppercase tracking-wider flex items-center gap-2">
                    <Car size={18} className="text-[#7dd3fc]" />
                    Select Your Vehicle
                  </h3>
                  <button
                    id="btn-trigger-add-vehicle"
                    onClick={() => setShowAddVehicleForm(true)}
                    className="flex items-center gap-1 bg-[#7dd3fc]/15 hover:bg-[#7dd3fc]/25 border border-[#7dd3fc]/30 text-[#7dd3fc] text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Add Vehicle
                  </button>
                </div>

                {vehicles.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-[#a0b4c4] text-sm">No vehicles registered yet. Register your vehicle to continue.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map((v) => {
                      const isSelected = selectedVehicleId === v.id;
                      return (
                        <div
                          key={v.id}
                          id={`vehicle-card-${v.id}`}
                          onClick={() => setSelectedVehicleId(v.id)}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                            isSelected 
                              ? 'bg-[#7dd3fc]/10 border-[#7dd3fc]/50 shadow-[0_0_15px_rgba(125,211,252,0.1)]' 
                              : 'bg-[#141c2e]/40 border-[#7dd3fc]/10 hover:border-[#7dd3fc]/30'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-[#e0e8f0] font-semibold">{v.make} {v.model}</h4>
                              <p className="text-[#a0b4c4] text-xs uppercase tracking-wider mt-1">{v.type}</p>
                            </div>
                            <span className="bg-[#0a0e1a] text-[#7dd3fc] text-[10px] px-2 py-1 rounded font-mono font-semibold border border-[#7dd3fc]/20 uppercase">
                              {v.licensePlate}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-6 pt-3 border-t border-[#7dd3fc]/10">
                            <span className="text-[10px] font-semibold text-[#a0b4c4] uppercase tracking-wider">Status: Verified</span>
                            {isSelected && <span className="text-xs text-[#7dd3fc] font-bold flex items-center gap-1">Selected <CheckCircle2 size={12} /></span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Vehicle Form Drawer overlay */}
                <AnimatePresence>
                  {showAddVehicleForm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-[#0a0e1a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="glass-elevated p-6 w-full max-w-md rounded-2xl border border-[#7dd3fc]/20"
                      >
                        <h4 className="text-[#e0e8f0] font-bold text-lg mb-4 flex items-center gap-2">
                          <Car size={18} className="text-[#7dd3fc]" /> Register New Vehicle
                        </h4>
                        
                        <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-1.5">Make</label>
                              <input
                                type="text"
                                placeholder="e.g. Audi"
                                value={newMake}
                                onChange={(e) => setNewMake(e.target.value)}
                                className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-2 text-sm text-[#e0e8f0] outline-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-1.5">Model</label>
                              <input
                                type="text"
                                placeholder="e.g. RS6"
                                value={newModel}
                                onChange={(e) => setNewModel(e.target.value)}
                                className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-2 text-sm text-[#e0e8f0] outline-none"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-1.5">License Plate</label>
                            <input
                              type="text"
                              placeholder="e.g. EX-789-PT"
                              value={newPlate}
                              onChange={(e) => setNewPlate(e.target.value)}
                              className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-2 text-sm text-[#e0e8f0] outline-none font-mono uppercase"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-1.5">Body Style</label>
                            <div className="grid grid-cols-4 gap-2">
                              {(['sedan', 'suv', 'truck', 'coupe'] as VehicleType[]).map((t) => (
                                <button
                                  type="button"
                                  key={t}
                                  onClick={() => setNewType(t)}
                                  className={`py-2 text-xs font-semibold uppercase rounded-lg border text-center cursor-pointer transition-all ${
                                    newType === t 
                                      ? 'bg-[#7dd3fc]/15 border-[#7dd3fc] text-[#7dd3fc]' 
                                      : 'bg-[#141c2e]/60 border-transparent text-[#a0b4c4]'
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3 justify-end pt-4 border-t border-[#7dd3fc]/10">
                            <button
                              type="button"
                              onClick={() => setShowAddVehicleForm(false)}
                              className="px-4 py-2 text-xs font-semibold text-[#a0b4c4] hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-xs font-bold bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30 hover:bg-[#7dd3fc]/25 rounded-full cursor-pointer transition-all"
                            >
                              Add Vehicle
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* STEP 1: WASH PACKAGE */}
            {step === 1 && (
              <motion.div
                key="step-pkg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#e0e8f0] uppercase tracking-wider flex items-center gap-2">
                    <ListTodo size={18} className="text-[#7dd3fc]" />
                    Choose Your Level of Treatment
                  </h3>
                </div>
                
                <div className="grid gap-4">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        id={`package-row-${pkg.id}`}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`glass-panel rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col md:flex-row ${
                          isSelected 
                            ? 'border-[#7dd3fc]/50 bg-[#7dd3fc]/5 shadow-[0_0_20px_rgba(125,211,252,0.08)]' 
                            : 'border-[#7dd3fc]/10 hover:border-[#7dd3fc]/30'
                        }`}
                      >
                        {/* Package Thumbnail Image */}
                        <div className="w-full md:w-48 h-32 md:h-auto relative bg-cover bg-center" style={{ backgroundImage: `url('${pkg.image}')` }}>
                          {pkg.tag && (
                            <span className="absolute top-3 left-3 bg-[#c8a0f0] text-[#1a002e] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow">
                              {pkg.tag}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0e1a] to-transparent opacity-60"></div>
                        </div>

                        {/* Package Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-bold text-[#e0e8f0]">{pkg.name}</h4>
                              <span className="text-[#7dd3fc] font-bold text-xl">{pkg.price} €</span>
                            </div>
                            <p className="text-xs text-[#a0b4c4] mt-1 line-clamp-2 font-light leading-relaxed">{pkg.description}</p>
                          </div>

                          {/* Features grid */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-[#e0e8f0]">
                            {pkg.features.slice(0, 4).map((f) => (
                              <span key={f} className="flex items-center gap-1 text-[#a0b4c4]">
                                <Check size={10} className="text-[#7dd3fc]" /> {f}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#7dd3fc]/5 flex items-center justify-between text-xs text-[#a0b4c4]">
                            <span className="flex items-center gap-1"><Clock size={12} /> {pkg.duration} mins treatment</span>
                            {isSelected && <span className="text-[#7dd3fc] font-bold flex items-center gap-1 text-xs">Selected <CheckCircle2 size={12} /></span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SCHEDULE */}
            {step === 2 && (
              <motion.div
                key="step-sched"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-panel p-6 rounded-2xl space-y-6"
              >
                <h3 className="text-lg font-bold text-[#e0e8f0] uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={18} className="text-[#7dd3fc]" /> Choose Appointment Date & Time
                </h3>

                {/* Dates visual carousel */}
                <div>
                  <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-3">Available Dates</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {datesList.map((d) => {
                      const isSelected = selectedDate === d.formatted;
                      return (
                        <button
                          key={d.formatted}
                          type="button"
                          id={`date-capsule-${d.formatted}`}
                          onClick={() => setSelectedDate(d.formatted)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-[#7dd3fc]/15 border-[#7dd3fc] text-[#7dd3fc] scale-105' 
                              : 'bg-[#141c2e]/40 border-[#7dd3fc]/10 hover:border-[#7dd3fc]/30 text-[#a0b4c4]'
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase">{d.dayName}</span>
                          <span className="text-base font-bold my-0.5">{d.dayNum}</span>
                          <span className="text-[9px] uppercase font-light">{d.monthName}</span>
                          {d.isToday && <span className="text-[8px] font-bold text-amber-400 mt-1 uppercase">Today</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots grid */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider">Available Timeslots</label>
                    <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">● Instant Booking</span>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const isSelected = selectedTime === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          id={`time-slot-${t}`}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 px-1 rounded-lg border text-center font-mono text-xs cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-[#7dd3fc]/15 border-[#7dd3fc] text-[#7dd3fc] font-bold scale-105 shadow-[0_0_10px_rgba(125,211,252,0.15)]' 
                              : 'bg-[#141c2e]/40 border-[#7dd3fc]/10 hover:border-[#7dd3fc]/30 text-[#a0b4c4]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Clock size={10} />
                            <span>{t}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: OPTIONAL ADD-ONS */}
            {step === 3 && (
              <motion.div
                key="step-addons"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-panel p-6 rounded-2xl space-y-6"
              >
                <h3 className="text-lg font-bold text-[#e0e8f0] uppercase tracking-wider flex items-center gap-2">
                  <Shield size={18} className="text-[#7dd3fc]" /> Premium Protective Upgrades
                </h3>

                <div className="space-y-3">
                  {ADD_ONS.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        id={`addon-row-${addon.id}`}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 ${
                          isChecked 
                            ? 'bg-[#7dd3fc]/10 border-[#7dd3fc]/40' 
                            : 'bg-[#141c2e]/40 border-[#7dd3fc]/10 hover:border-[#7dd3fc]/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-1 rounded ${isChecked ? 'bg-[#7dd3fc]/20 text-[#7dd3fc]' : 'bg-[#0a0e1a] text-[#a0b4c4]'}`}>
                            <Check size={14} className={isChecked ? 'opacity-100' : 'opacity-20'} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#e0e8f0]">{addon.name}</h4>
                            <p className="text-xs text-[#a0b4c4] font-light mt-0.5 leading-relaxed">{addon.description}</p>
                          </div>
                        </div>
                        <span className="text-[#7dd3fc] font-bold font-mono text-sm whitespace-nowrap">+{addon.price} €</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {step === 4 && (
              <motion.div
                key="step-review"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-panel p-6 rounded-2xl space-y-6"
              >
                <h3 className="text-lg font-bold text-[#e0e8f0] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#7dd3fc]" /> Final Treatment Summary
                </h3>

                <div className="space-y-4 text-sm divide-y divide-[#7dd3fc]/10">
                  {/* Vehicle details summary */}
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-[#a0b4c4] font-light flex items-center gap-1.5"><Car size={16} /> Selected Vehicle</span>
                    <span className="font-semibold text-[#e0e8f0]">
                      {vehicles.find(v => v.id === selectedVehicleId)?.make} {vehicles.find(v => v.id === selectedVehicleId)?.model}
                      <span className="text-[10px] font-mono bg-[#0a0e1a] text-[#7dd3fc] px-1.5 py-0.5 border border-[#7dd3fc]/20 rounded ml-2 uppercase">
                        {vehicles.find(v => v.id === selectedVehicleId)?.licensePlate}
                      </span>
                    </span>
                  </div>

                  {/* Package Summary */}
                  <div className="pt-4 pb-2 flex justify-between items-center">
                    <span className="text-[#a0b4c4] font-light flex items-center gap-1.5"><Sparkles size={16} /> Package</span>
                    <span className="font-semibold text-[#e0e8f0]">{selectedPkg.name}</span>
                  </div>

                  {/* Date & Time Summary */}
                  <div className="pt-4 pb-2 flex justify-between items-center">
                    <span className="text-[#a0b4c4] font-light flex items-center gap-1.5"><Calendar size={16} /> Appointment Slot</span>
                    <span className="font-mono text-[#e0e8f0]">{selectedDate} at <span className="text-[#7dd3fc] font-bold">{selectedTime || 'Select Time'}</span></span>
                  </div>

                  {/* Selected Add-ons summary */}
                  {selectedAddOns.length > 0 && (
                    <div className="pt-4 pb-2 space-y-2">
                      <span className="text-[#a0b4c4] font-light block">Selected Protective Upgrades:</span>
                      <div className="space-y-1.5 pl-4">
                        {ADD_ONS.filter(a => selectedAddOns.includes(a.id)).map(a => (
                          <div key={a.id} className="flex justify-between text-xs">
                            <span className="text-[#e0e8f0] font-light flex items-center gap-1">✓ {a.name}</span>
                            <span className="text-[#7dd3fc] font-mono">+{a.price} €</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coupon Promo section inside step */}
                  <div className="pt-4 pb-2 flex flex-col gap-2">
                    <span className="text-[#a0b4c4] font-light">Promotional Discount Coupon:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="E.g. GLACIER_PREMIUM_20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-1.5 text-xs text-[#e0e8f0] outline-none font-mono uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromoCode}
                        className="px-4 py-1.5 text-xs font-semibold bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30 hover:bg-[#7dd3fc]/25 rounded-lg transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-400 mt-1">{promoError}</p>}
                    {appliedDiscount && (
                      <p className="text-xs text-green-400 font-semibold flex items-center gap-1 mt-1">
                        ✓ Discount Code Applied: <span className="font-mono">{appliedDiscount.code}</span> (-{appliedDiscount.percent}% discount)
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              id="btn-stepper-back"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              className={`flex items-center gap-1 py-2.5 px-5 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
                step === 0 
                  ? 'border-transparent text-[#a0b4c4] opacity-30 cursor-not-allowed' 
                  : 'bg-transparent border-[#7dd3fc]/20 text-[#a0b4c4] hover:text-white hover:border-[#7dd3fc]/40'
              }`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 4 ? (
              <button
                id="btn-stepper-next"
                disabled={
                  (step === 0 && !selectedVehicleId) ||
                  (step === 1 && !selectedPackageId) ||
                  (step === 2 && (!selectedDate || !selectedTime))
                }
                onClick={() => setStep(step + 1)}
                className={`flex items-center gap-1 py-2.5 px-6 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  ((step === 0 && !selectedVehicleId) || (step === 1 && !selectedPackageId) || (step === 2 && (!selectedDate || !selectedTime)))
                    ? 'bg-[#141c2e] text-[#a0b4c4] opacity-50 cursor-not-allowed'
                    : 'bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30 hover:bg-[#7dd3fc]/25'
                }`}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                id="btn-stepper-confirm"
                onClick={handleConfirmBooking}
                className="flex items-center gap-1.5 py-3 px-8 rounded-full text-sm font-bold bg-[#7dd3fc]/20 hover:bg-[#7dd3fc]/30 border border-[#7dd3fc]/50 text-[#7dd3fc] transition-all hover:shadow-[0_0_25px_rgba(125,211,252,0.25)] cursor-pointer"
              >
                Confirm Treatment Booking <Check size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Invoice Receipt Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl sticky top-24 space-y-6">
            <h3 className="text-sm font-bold text-[#e0e8f0] uppercase tracking-widest border-b border-[#7dd3fc]/10 pb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#7dd3fc]" /> Live Invoice Detail
            </h3>

            {/* Calculations layout */}
            <div className="space-y-3.5 text-xs text-[#a0b4c4]">
              <div className="flex justify-between items-center">
                <span className="font-light">Treatment Wash:</span>
                <span className="text-[#e0e8f0] font-medium">{selectedPkg?.name || '---'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-light">Base Price:</span>
                <span className="text-[#e0e8f0] font-mono font-bold">{selectedPkg ? `${basePrice} €` : '0 €'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-light">Protective Upgrades:</span>
                <span className="text-[#e0e8f0] font-mono font-bold">+{addonsTotal} €</span>
              </div>
              
              <div className="border-t border-[#7dd3fc]/10 pt-3 flex justify-between items-center text-sm font-semibold">
                <span className="text-[#e0e8f0]">Subtotal:</span>
                <span className="text-[#e0e8f0] font-mono font-bold">{subtotal} €</span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between items-center text-green-400 font-semibold bg-green-500/5 p-2 rounded border border-green-500/10">
                  <span>Coupon ({appliedDiscount.code}):</span>
                  <span className="font-mono font-bold">-{discountAmount} € (-{appliedDiscount.percent}%)</span>
                </div>
              )}

              <div className="border-t border-[#7dd3fc]/20 pt-4 flex justify-between items-end text-[#e0e8f0]">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider block">Total Due:</span>
                  <span className="text-[10px] text-[#a0b4c4] font-light">Taxes and fees included</span>
                </div>
                <span className="text-2xl font-bold font-mono text-[#7dd3fc] tracking-tight">{total} €</span>
              </div>
            </div>

            {/* Loyalty points banner */}
            <div className="bg-[#7dd3fc]/5 border border-[#7dd3fc]/15 rounded-xl p-3 text-xs flex items-center gap-3">
              <Sparkles className="text-[#7dd3fc] flex-shrink-0" size={16} />
              <div>
                <p className="text-[#e0e8f0] font-semibold">Earn {Math.round(pointsToEarn)} Loyalty Points</p>
                <p className="text-[#a0b4c4] text-[10px] font-light mt-0.5">Use points to claim free detailing packages in your profile.</p>
              </div>
            </div>

            {/* Quick Helper guidelines */}
            <div className="text-[11px] text-[#a0b4c4] font-light bg-[#141c2e]/20 p-3 rounded-lg flex gap-1.5 items-start">
              <Info className="text-[#7dd3fc] flex-shrink-0 mt-0.5" size={13} />
              <p className="leading-relaxed">Need to cancel or reschedule? No worries! You can cancel up to 2 hours before your appointment directly from your activity history without any penalty.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
