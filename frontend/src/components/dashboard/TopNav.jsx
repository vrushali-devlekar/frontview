import React, { useState } from "react";
import { Search, Bell, User } from "lucide-react";

const TopNav = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-[64px] flex items-center justify-end px-4 md:px-6 bg-transparent shrink-0 relative z-20 w-full">
      <div className="flex items-center gap-3 text-white">
        
        {/* Expandable Search */}
        <div 
          className={`relative flex items-center transition-all duration-300 ease-in-out overflow-hidden rounded-full ${
            isSearchOpen ? "w-48 bg-white/5 border border-white/10" : "w-8 bg-transparent border border-transparent"
          }`}
        >
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-colors flex items-center justify-center ${
              isSearchOpen ? "w-8 h-8 text-slate-400 pointer-events-none" : "w-8 h-8 text-slate-300 hover:bg-white/5"
            }`}
          >
            <Search size={isSearchOpen ? 14 : 18} />
          </button>
          
          <input 
            type="text" 
            placeholder="Search..." 
            autoFocus={isSearchOpen}
            className={`w-full bg-transparent py-1.5 pl-8 pr-3 text-[11px] text-white placeholder:text-slate-400 focus:outline-none transition-opacity duration-300 ${
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onBlur={(e) => {
              if (e.target.value === "") {
                setIsSearchOpen(false);
              }
            }}
          />
        </div>

        {/* Notification Icon */}
        <div className="relative cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-slate-300">
          <Bell size={18} />
          <div className="absolute top-1.5 right-1.5 bg-[#39ff14] text-black text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
            3
          </div>
        </div>
        
        {/* Profile ID Button */}
        <button className="flex items-center pl-3 border-l border-white/10 ml-1 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-400 overflow-hidden">
            <User size={16} />
          </div>
        </button>
        
      </div>
    </header>
  );
};

export default TopNav;
