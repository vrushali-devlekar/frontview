import React from "react";
import { Search, Bell, Mail, HelpCircle } from "lucide-react";

const TopNav = () => {
  return (
    <header className="h-[64px] flex items-center justify-end px-4 md:px-8 border-b border-[#2c2c2b] shrink-0 bg-[var(--color-velora-bg)]">
      {/* Right Icons only */}
      <div className="flex items-center space-x-4 md:space-x-6 text-[var(--color-velora-text)]">
        <Search
          size={20}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        />
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
          <Bell size={20} />
          <div className="absolute -top-1.5 -right-2 bg-[var(--color-velora-accent-yellow)] text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-[var(--color-velora-bg)]">
            3
          </div>
        </div>
        <Mail
          size={20}
          className="cursor-pointer hover:opacity-70 transition-opacity hidden sm:block"
        />
        <HelpCircle
          size={20}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        />
      </div>
    </header>
  );
};

export default TopNav;
