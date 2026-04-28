import React from 'react';
import { Search, Bell, Mail, HelpCircle, PlusSquare } from 'lucide-react';

const TopNav =() => {
  return (
    <header className="h-[88px] flex items-center justify-between px-4 md:px-8 border-b border-[#d1c8b4] shrink-0">
      
      {/* Left Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <div className="relative text-[10px] cursor-pointer">
          <span className="text-[var(--color-velora-text)] pb-2">Overview</span>
          <div className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-[var(--color-velora-text)]"></div>
        </div>
        <div className="text-[10px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200">Deploy</div>
        <div className="text-[10px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200">Pipelines</div>
        <div className="text-[10px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200">Infrastructure</div>
        <div className="text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200">
          <PlusSquare size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 md:space-x-6 text-[var(--color-velora-text)] ml-auto">
        <Search size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
          <Bell size={20} />
          <div className="absolute -top-1.5 -right-2 bg-[var(--color-velora-accent-yellow)] text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-[var(--color-velora-bg)]">3</div>
        </div>
        <Mail size={20} className="cursor-pointer hover:opacity-70 transition-opacity hidden sm:block" />
        <HelpCircle size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
      </div>

    </header>
  );
};

export default TopNav;
