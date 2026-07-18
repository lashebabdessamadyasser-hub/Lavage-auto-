import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Tag, Sparkles, Edit2, Check, Copy } from 'lucide-react';
import { Promotion } from '../types';

interface HomeViewProps {
  promotions: Promotion[];
  claimPromo: (id: string) => void;
  onBookClick: () => void;
  cmsData: {
    heroTitle: string;
    heroSubtitle: string;
    promoText: string;
  };
  updateCmsData: (data: Partial<{ heroTitle: string; heroSubtitle: string; promoText: string }>) => void;
}

export default function HomeView({ 
  promotions, 
  claimPromo, 
  onBookClick, 
  cmsData, 
  updateCmsData 
}: HomeViewProps) {
  const [isEditingCms, setIsEditingCms] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Local state for the CMS form to prevent lag
  const [formTitle, setFormTitle] = useState(cmsData.heroTitle);
  const [formSubtitle, setFormSubtitle] = useState(cmsData.heroSubtitle);
  const [formPromo, setFormPromo] = useState(cmsData.promoText);

  const handleCmsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsData({
      heroTitle: formTitle,
      heroSubtitle: formSubtitle,
      promoText: formPromo,
    });
    setIsEditingCms(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div id="home-view" className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full bleed background */}
        <div className="absolute inset-0 z-0">
          <div 
            id="hero-bg-img"
            className="bg-cover bg-center w-full h-full opacity-60 scale-105 transition-transform duration-10000 ease-out" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5N9CnJGX8CARoOfqJNNhPcRUslDrsJ6ru64wzpnW8JKtU5mGW2XRTxUewt-SbxThiWtUJJZROkh3HHucuIrwisLZZISdf7QSZp2hA07FVxe53z8RT0LGJHRyXsZ-o3x4DJAdqmQdq7G3hCm5ysBSutUDNCka-5M1QjvXfNWt1ViVelpN9bPEmtKqQ4STAdKz2_5yUP_fDwSrwCXJjzHusAAK-RLBSj1JsOBwt0ontPcOARuWA46RE7A')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-[#0a0e1a]/40"></div>
        </div>

        {/* CMS Editor Trigger Button */}
        <div className="absolute top-20 right-6 z-30">
          <button
            id="btn-toggle-cms"
            onClick={() => {
              setFormTitle(cmsData.heroTitle);
              setFormSubtitle(cmsData.heroSubtitle);
              setFormPromo(cmsData.promoText);
              setIsEditingCms(!isEditingCms);
            }}
            className="glass-panel text-[#7dd3fc] hover:bg-[#7dd3fc]/10 p-2.5 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95 border border-[#7dd3fc]/30 hover:border-[#7dd3fc]/60"
            title="Edit Screen CMS Text"
          >
            <Edit2 size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider ml-1.5 pr-1 hidden sm:inline">CMS Panel</span>
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 id="hero-title-display" className="font-sans text-5xl md:text-7xl font-semibold tracking-tight text-[#e0e8f0] mb-6 drop-shadow-2xl">
              {cmsData.heroTitle}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p id="hero-subtitle-display" className="font-sans text-xl md:text-2xl text-[#a0b4c4] mb-10 max-w-2xl font-light leading-relaxed">
              {cmsData.heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              id="btn-hero-book"
              onClick={onBookClick}
              className="glass-elevated text-[#7dd3fc] font-sans font-semibold py-4 px-10 rounded-full text-lg hover:bg-[#7dd3fc]/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(125,211,252,0.2)] border border-[#7dd3fc]/30 flex items-center space-x-3 group cursor-pointer"
            >
              <span>Book a Wash</span>
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300 text-[#7dd3fc]" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CMS Editing Panel Slide-over/Modal */}
      <AnimatePresence>
        {isEditingCms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0e1a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-elevated p-6 w-full max-w-lg rounded-2xl border border-[#7dd3fc]/20"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#7dd3fc]" size={18} />
                  <h3 className="text-lg font-bold text-[#e0e8f0] uppercase tracking-wider">CMS Content Editor</h3>
                </div>
                <button
                  id="btn-close-cms-modal"
                  onClick={() => setIsEditingCms(false)}
                  className="text-[#a0b4c4] hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCmsSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#0a0e1a]/70 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-2 text-sm text-[#e0e8f0] outline-none"
                    placeholder="E.g. GLACIER WASH"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-2">Hero Subtitle</label>
                  <textarea
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0a0e1a]/70 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-2 text-sm text-[#e0e8f0] outline-none"
                    placeholder="E.g. Precision deep washing with molecular coating."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a0b4c4] uppercase tracking-wider mb-2">Promo Card Description</label>
                  <textarea
                    value={formPromo}
                    onChange={(e) => setFormPromo(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0a0e1a]/70 border border-[#7dd3fc]/20 focus:border-[#7dd3fc] rounded-lg px-3 py-2 text-sm text-[#e0e8f0] outline-none"
                    placeholder="E.g. Get 20% discount on complete detailing packages."
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCms(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#a0b4c4] hover:text-[#e0e8f0] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/30 hover:bg-[#7dd3fc]/25 rounded-full transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promotions Section */}
      <section id="promotions-section" className="py-24 px-6 max-w-6xl mx-auto relative z-20">
        <h2 className="font-sans text-3xl font-semibold text-[#e0e8f0] mb-12 text-center flex items-center justify-center gap-3">
          <Tag className="text-[#7dd3fc]" size={28} />
          <span>Exclusive Offers</span>
        </h2>

        <div className="grid gap-8">
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              id={`promo-card-${promo.id}`}
              className="glass-panel rounded-2xl overflow-hidden group relative p-1 transition-all duration-300 hover:border-[#7dd3fc]/20"
            >
              {/* Background Image for Promo */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="bg-cover bg-center w-full h-full opacity-30 mix-blend-overlay group-hover:scale-[1.03] transition-transform duration-1000" 
                  style={{ backgroundImage: `url('${promo.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] via-[#0a0e1a]/70 to-transparent"></div>
              </div>

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 h-full">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#c8a0f0] text-sm font-semibold tracking-widest uppercase block">
                      {promo.subtitle}
                    </span>
                    <span className="bg-[#7dd3fc]/10 text-[#7dd3fc] border border-[#7dd3fc]/20 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      {promo.discountPercent}% Off
                    </span>
                  </div>
                  
                  <h3 className="font-sans text-3xl md:text-4xl font-semibold text-[#e0e8f0] mb-4">
                    {promo.title}
                  </h3>
                  
                  <p className="text-[#a0b4c4] text-lg font-light leading-relaxed">
                    {promo.id === 'promo-detail' ? cmsData.promoText : promo.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  {promo.claimed ? (
                    <div className="flex flex-col items-stretch gap-2">
                      <div className="flex items-center justify-between gap-3 px-6 py-3 rounded-full bg-[#141c2e] border border-[#7dd3fc]/20">
                        <span className="font-mono text-[#7dd3fc] font-bold text-sm select-all">{promo.promoCode}</span>
                        <button
                          onClick={() => handleCopyCode(promo.promoCode)}
                          className="text-[#a0b4c4] hover:text-[#7dd3fc] transition-colors p-1 cursor-pointer"
                          title="Copy promo code"
                        >
                          {copiedCode === promo.promoCode ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                      <span className="text-center text-xs text-green-400 font-semibold flex items-center justify-center gap-1">
                        <Check size={12} /> Claimed & Applied to Booking!
                      </span>
                    </div>
                  ) : (
                    <button 
                      id={`btn-claim-${promo.id}`}
                      onClick={() => claimPromo(promo.id)}
                      className="whitespace-nowrap px-8 py-3 rounded-full bg-[#7dd3fc]/10 text-[#7dd3fc] border border-[#7dd3fc]/20 hover:bg-[#7dd3fc]/20 hover:border-[#7dd3fc]/40 active:scale-95 transition-all font-medium cursor-pointer"
                    >
                      Claim Offer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
