import React from 'react';
import { Camera, MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel mt-16 py-12 px-6 border-t border-[#7dd3fc]/10 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold text-[#7dd3fc] tracking-widest uppercase font-sans">
          Glacier
        </div>
        
        <div className="flex space-x-6">
          <a 
            id="footer-social-camera"
            href="#" 
            className="text-[#a0b4c4] hover:text-[#7dd3fc] transition-colors p-2 hover:bg-[#7dd3fc]/5 rounded-full"
            aria-label="Instagram"
          >
            <Camera size={20} />
          </a>
          <a 
            id="footer-social-chat"
            href="#" 
            className="text-[#a0b4c4] hover:text-[#7dd3fc] transition-colors p-2 hover:bg-[#7dd3fc]/5 rounded-full"
            aria-label="Live Chat"
          >
            <MessageSquare size={20} />
          </a>
          <a 
            id="footer-social-mail"
            href="mailto:contact@glacierwash.com" 
            className="text-[#a0b4c4] hover:text-[#7dd3fc] transition-colors p-2 hover:bg-[#7dd3fc]/5 rounded-full"
            aria-label="Email Support"
          >
            <Mail size={20} />
          </a>
        </div>
        
        <div className="text-[#a0b4c4] text-sm font-light">
          © 2026 Glacier Wash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
