import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Award, AwardIcon, Sparkles, Plus, Trash2, 
  Car, Shield, Info, Check, CheckCircle2 
} from 'lucide-react';
import { UserProfile, Vehicle, VehicleType } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  deleteVehicle: (id: string) => void;
  redeemFreeWash: () => void;
}

export default function ProfileView({ 
  user, 
  vehicles, 
  addVehicle, 
  deleteVehicle,
  redeemFreeWash
}: ProfileViewProps) {
  // New vehicle form inputs
  const [isAdding, setIsAdding] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [type, setType] = useState<VehicleType>('sedan');
  const [formError, setFormError] = useState('');

  // Vehicle deletion safe confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Loyalty rewards calculations
  const REWARD_THRESHOLD = 500;
  const progressPercent = Math.min(100, (user.loyaltyPoints / REWARD_THRESHOLD) * 100);
  const canRedeem = user.loyaltyPoints >= REWARD_THRESHOLD;

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!make.trim() || !model.trim() || !plate.trim()) {
      setFormError('Please fill out all vehicle specifications.');
      return;
    }

    addVehicle({
      make: make.trim(),
      model: model.trim(),
      licensePlate: plate.trim().toUpperCase(),
      type
    });

    // Clear and close
    setMake('');
    setModel('');
    setPlate('');
    setType('sedan');
    setIsAdding(false);
  };

  const handleDeleteConfirm = (id: string) => {
    deleteVehicle(id);
    setDeletingId(null);
  };

  return (
    <div id="profile-view" className="max-w-4xl mx-auto px-4 py-24 min-h-screen space-y-8">
      {/* Profile Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#7dd3fc]/10 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Glow behind avatar */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 w-40 h-40 bg-[#7dd3fc]/10 rounded-full blur-3xl -z-10" />

        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-24 h-24 rounded-full object-cover border-2 border-[#7dd3fc]/30 shadow-[0_0_20px_rgba(125,211,252,0.15)]"
        />

        <div className="text-center sm:text-left flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-2xl font-bold text-[#e0e8f0]">{user.name}</h2>
            {user.premiumStatus && (
              <span className="self-center sm:self-auto flex items-center gap-1 bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                <Sparkles size={10} /> Glacier VIP
              </span>
            )}
          </div>
          <p className="text-sm text-[#a0b4c4] font-light">{user.email}</p>
          <p className="text-xs text-[#a0b4c4]/60">VIP Elite member since {user.memberSince}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Loyalty Rewards program */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-[#e0e8f0] uppercase tracking-widest flex items-center gap-2">
              <Award size={16} className="text-[#7dd3fc]" /> Glacier Loyalty Club
            </h3>

            {/* Points balance */}
            <div className="bg-[#141c2e]/60 border border-[#7dd3fc]/5 p-4 rounded-xl text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a0b4c4]">Your Balance</span>
              <p className="text-4xl font-extrabold font-mono text-[#7dd3fc]">{user.loyaltyPoints}</p>
              <span className="text-[10px] text-[#a0b4c4]/60 font-light block">1 EUR spent = 1 point earned</span>
            </div>

            {/* Progress Bar to Free Wash */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#a0b4c4] font-light">Free Wash Progress:</span>
                <span className="text-[#7dd3fc] font-mono">{user.loyaltyPoints} / {REWARD_THRESHOLD} pts</span>
              </div>
              <div className="w-full h-2.5 bg-[#0a0e1a] rounded-full overflow-hidden border border-[#7dd3fc]/10 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#7dd3fc]/60 to-[#7dd3fc] rounded-full"
                />
              </div>
              <p className="text-[10px] text-[#a0b4c4]/60 font-light leading-relaxed">
                Reach {REWARD_THRESHOLD} points to unlock a complimentary premium Glacier Hydro wash!
              </p>
            </div>

            {/* Redeem button */}
            {canRedeem ? (
              <button
                id="btn-redeem-reward"
                onClick={redeemFreeWash}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles size={12} /> Claim Complimentary Wash!
              </button>
            ) : (
              <div className="w-full py-2 px-3 bg-[#141c2e]/40 border border-[#7dd3fc]/5 rounded-xl text-[10px] text-[#a0b4c4] font-light flex gap-2 items-start">
                <Info size={12} className="text-[#7dd3fc] flex-shrink-0 mt-0.5" />
                <span>Earn {REWARD_THRESHOLD - user.loyaltyPoints} more points to claim a free wash reward.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Vehicle Garage manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-[#e0e8f0] uppercase tracking-widest flex items-center gap-2">
                <Car size={16} className="text-[#7dd3fc]" /> My Garage
              </h3>
              {!isAdding && (
                <button
                  id="btn-add-vehicle-profile"
                  onClick={() => setIsAdding(true)}
                  className="text-xs bg-[#7dd3fc]/15 hover:bg-[#7dd3fc]/25 border border-[#7dd3fc]/20 text-[#7dd3fc] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Vehicle
                </button>
              )}
            </div>

            {/* Inline Add Vehicle Form */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleAddVehicle} className="bg-[#141c2e]/30 border border-[#7dd3fc]/10 p-4 rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#a0b4c4] uppercase tracking-wider mb-1">Make</label>
                        <input 
                          type="text" 
                          placeholder="Porsche" 
                          value={make}
                          onChange={(e) => setMake(e.target.value)}
                          className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-2.5 py-1.5 text-xs text-[#e0e8f0] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#a0b4c4] uppercase tracking-wider mb-1">Model</label>
                        <input 
                          type="text" 
                          placeholder="Taycan 4S" 
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-2.5 py-1.5 text-xs text-[#e0e8f0] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#a0b4c4] uppercase tracking-wider mb-1">License Plate</label>
                        <input 
                          type="text" 
                          placeholder="EL-456-TR" 
                          value={plate}
                          onChange={(e) => setPlate(e.target.value)}
                          className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-2.5 py-1.5 text-xs text-[#e0e8f0] outline-none font-mono uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#a0b4c4] uppercase tracking-wider mb-1">Body Style</label>
                        <select 
                          value={type}
                          onChange={(e) => setType(e.target.value as VehicleType)}
                          className="w-full bg-[#0a0e1a]/80 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-2 py-1.5 text-xs text-[#e0e8f0] outline-none"
                        >
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="truck">Truck</option>
                          <option value="coupe">Coupe</option>
                        </select>
                      </div>
                    </div>

                    {formError && <p className="text-[10px] text-red-400 font-semibold">{formError}</p>}

                    <div className="flex gap-2 justify-end pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAdding(false)}
                        className="px-3 py-1.5 text-[10px] font-semibold text-[#a0b4c4] hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-1.5 text-[10px] font-bold bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30 hover:bg-[#7dd3fc]/25 rounded-full cursor-pointer transition-all"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vehicles list */}
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div 
                  key={v.id} 
                  id={`profile-vehicle-card-${v.id}`}
                  className="bg-[#141c2e]/30 border border-[#7dd3fc]/10 p-4 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#7dd3fc]/5 border border-[#7dd3fc]/20 flex items-center justify-center text-[#7dd3fc]">
                      <Car size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#e0e8f0]">{v.make} {v.model}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#a0b4c4] font-mono uppercase tracking-widest">{v.type}</span>
                        <span className="text-[9px] text-[#a0b4c4]/40">•</span>
                        <span className="text-[10px] text-[#7dd3fc] font-mono font-semibold uppercase">{v.licensePlate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {deletingId === v.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn-del-veh-yes-${v.id}`}
                          onClick={() => handleDeleteConfirm(v.id)}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          id={`btn-del-veh-no-${v.id}`}
                          onClick={() => setDeletingId(null)}
                          className="px-2.5 py-1 bg-[#141c2e] hover:bg-[#141c2e]/80 border border-[#7dd3fc]/10 rounded-lg text-[#a0b4c4] text-[10px] font-semibold cursor-pointer"
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-del-veh-trigger-${v.id}`}
                        onClick={() => setDeletingId(v.id)}
                        className="p-2 text-[#a0b4c4] hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all cursor-pointer"
                        title="Remove vehicle"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
