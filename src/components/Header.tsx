import React from 'react';
import { Home, Car, History, User, Menu } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
}

export default function Header({ currentTab, setCurrentTab, user }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'book', label: 'Book', icon: Car },
    { id: 'activity', label: 'Activity', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0f1524]/60 backdrop-blur-xl border-b border-[#7dd3fc]/10 shadow-[0_0_30px_rgba(125,211,252,0.05)] flex items-center justify-between px-6 h-16">
      <button 
        id="btn-desktop-menu"
        className="text-[#a0b4c4] hover:bg-[#7dd3fc]/10 transition-colors duration-200 p-2 rounded-full hidden md:block cursor-pointer"
        onClick={() => setCurrentTab('home')}
      >
        <Menu size={20} />
      </button>

      <div 
        id="header-brand"
        className="text-xl font-bold text-[#7dd3fc] tracking-widest uppercase font-sans cursor-pointer mx-auto md:mx-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        onClick={() => setCurrentTab('home')}
      >
        Glacier Wash
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-desk-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`font-medium transition-all duration-300 flex items-center space-x-2 px-3 py-1.5 rounded-lg cursor-pointer ${
                isActive 
                  ? 'text-[#7dd3fc] bg-[#7dd3fc]/10 font-semibold' 
                  : 'text-[#a0b4c4] hover:text-[#7dd3fc] hover:bg-[#7dd3fc]/5'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile Button */}
      <button 
        id="btn-header-profile"
        onClick={() => setCurrentTab('profile')}
        className="text-[#a0b4c4] hover:bg-[#7dd3fc]/15 transition-all duration-300 active:scale-95 p-1 rounded-full overflow-hidden border border-[#7dd3fc]/20 hover:border-[#7dd3fc]/50 cursor-pointer flex items-center gap-2"
      >
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-8 h-8 object-cover rounded-full"
        />
        <span className="hidden lg:inline text-xs text-[#e0e8f0] font-medium pr-1">{user.name.split(' ')[0]}</span>
      </button>
    </header>
  );
}
