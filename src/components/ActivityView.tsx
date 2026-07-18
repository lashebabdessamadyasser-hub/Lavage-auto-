import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Car, Trash2, XCircle, CheckCircle2, 
  AlertCircle, History, Sparkles, Receipt, Filter 
} from 'lucide-react';
import { Booking } from '../types';

interface ActivityViewProps {
  bookings: Booking[];
  cancelBooking: (id: string) => void;
}

type FilterStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';

export default function ActivityView({ bookings, cancelBooking }: ActivityViewProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const handleCancelConfirm = (id: string) => {
    cancelBooking(id);
    setCancellingId(null);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="flex items-center gap-1 bg-[#7dd3fc]/10 text-[#7dd3fc] border border-[#7dd3fc]/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            ● Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            ✓ Finished
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/15 text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            ✕ Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="activity-view" className="max-w-4xl mx-auto px-4 py-24 min-h-screen">
      {/* View Header */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-bold text-[#e0e8f0] flex items-center justify-center md:justify-start gap-2">
            <History className="text-[#7dd3fc]" />
            <span>Your Treatment History</span>
          </h2>
          <p className="text-[#a0b4c4] text-sm mt-2">Track your past glacier cleaning and upcoming scheduled packages</p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(['all', 'upcoming', 'completed', 'cancelled'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              id={`filter-chip-${f}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter === f 
                  ? 'bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30' 
                  : 'bg-[#141c2e]/60 text-[#a0b4c4] border border-transparent hover:border-[#7dd3fc]/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Timeline list */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-12 text-center rounded-2xl border border-[#7dd3fc]/10"
            >
              <div className="w-12 h-12 rounded-full bg-[#141c2e] border border-[#7dd3fc]/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-[#a0b4c4]" size={20} />
              </div>
              <h3 className="text-[#e0e8f0] font-bold text-base uppercase tracking-wider">No Appointments Found</h3>
              <p className="text-[#a0b4c4] text-xs font-light mt-1 max-w-sm mx-auto">There are currently no wash treatments in this category. Navigate to the 'Book' tab to schedule a service.</p>
            </motion.div>
          ) : (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-2xl overflow-hidden border border-[#7dd3fc]/10 hover:border-[#7dd3fc]/20 transition-all duration-300"
              >
                {/* Main panel info */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#7dd3fc]/10 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7dd3fc]/15 border border-[#7dd3fc]/30 flex items-center justify-center text-[#7dd3fc]">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-lg text-[#e0e8f0]">{booking.packageName}</h3>
                        <p className="text-[10px] text-[#a0b4c4] font-mono mt-0.5">Booking ID: #{booking.id.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#a0b4c4] mb-4">
                    <div className="flex items-center gap-2 bg-[#141c2e]/30 p-2.5 rounded-lg border border-[#7dd3fc]/5">
                      <Calendar size={14} className="text-[#7dd3fc]" />
                      <div>
                        <p className="text-[10px] text-[#a0b4c4] uppercase tracking-wider font-light">Date</p>
                        <p className="text-[#e0e8f0] font-medium mt-0.5">{booking.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#141c2e]/30 p-2.5 rounded-lg border border-[#7dd3fc]/5">
                      <Clock size={14} className="text-[#7dd3fc]" />
                      <div>
                        <p className="text-[10px] text-[#a0b4c4] uppercase tracking-wider font-light">Appt Time</p>
                        <p className="text-[#e0e8f0] font-medium mt-0.5">{booking.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#141c2e]/30 p-2.5 rounded-lg border border-[#7dd3fc]/5">
                      <Car size={14} className="text-[#7dd3fc]" />
                      <div>
                        <p className="text-[10px] text-[#a0b4c4] uppercase tracking-wider font-light">Vehicle</p>
                        <p className="text-[#e0e8f0] font-medium mt-0.5 uppercase">
                          {booking.vehicle.make} {booking.vehicle.model}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price breakdown */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#7dd3fc]/5">
                    <div className="flex items-center gap-2 text-xs font-light text-[#a0b4c4]">
                      <Receipt size={14} className="text-[#7dd3fc]" />
                      <span>Total Paid:</span>
                      <span className="text-[#e0e8f0] font-bold font-mono text-sm">{booking.packagePrice} €</span>
                    </div>

                    {booking.status === 'upcoming' && (
                      <div>
                        {cancellingId === booking.id ? (
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-red-400 font-semibold flex items-center gap-1 animate-pulse">
                              <AlertCircle size={12} /> Confirm cancellation?
                            </span>
                            <button
                              id={`btn-cancel-yes-${booking.id}`}
                              onClick={() => handleCancelConfirm(booking.id)}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-full text-red-400 text-xs font-bold cursor-pointer"
                            >
                              Yes, Cancel
                            </button>
                            <button
                              id={`btn-cancel-no-${booking.id}`}
                              onClick={() => setCancellingId(null)}
                              className="px-3 py-1.5 bg-[#141c2e] hover:bg-[#141c2e]/80 border border-[#7dd3fc]/10 rounded-full text-[#a0b4c4] text-xs font-medium cursor-pointer"
                            >
                              Keep
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`btn-trigger-cancel-${booking.id}`}
                            onClick={() => setCancellingId(booking.id)}
                            className="flex items-center gap-1 py-1.5 px-4 rounded-full text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all cursor-pointer"
                          >
                            <Trash2 size={12} /> Cancel Wash
                          </button>
                        )}
                      </div>
                    )}

                    {booking.status === 'completed' && (
                      <span className="text-green-400 text-xs font-semibold flex items-center gap-1 select-none">
                        <CheckCircle2 size={13} /> Highly polished vehicle dispatched!
                      </span>
                    )}

                    {booking.status === 'cancelled' && (
                      <span className="text-red-400/60 text-xs font-medium flex items-center gap-1 select-none">
                        <XCircle size={13} /> Wash appointment was voided
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
