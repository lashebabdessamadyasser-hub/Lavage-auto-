import React from 'react';
import { Home, Car, History, User } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function MobileNav({ currentTab, setCurrentTab }: MobileNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'book', label: 'Book', icon: Car },
    { id: 'activity', label: 'Activity', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0f1524]/80 backdrop-blur-2xl border-t border-[#7dd3fc]/10 shadow-[0_-5px_30px_rgba(125,211,252,0.05)] flex justify-around items-center h-20 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-mob-${item.id}`}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all duration-300 active:scale-90 cursor-pointer ${
              isActive 
                ? 'text-[#7dd3fc] bg-[#7dd3fc]/10 scale-105' 
                : 'text-[#a0b4c4] hover:text-[#7dd3fc]'
            }`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
