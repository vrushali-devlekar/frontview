import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, User, Settings, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import pf1 from "../../assets/pf1.jpeg";

const TopNav = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[64px] flex items-center justify-end px-4 md:px-6 bg-transparent shrink-0 relative z-50 w-full">
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
        <div className="relative cursor-pointer w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-valora-cyan transition-colors text-white">
          <Bell size={18} />
          <div className="absolute top-0 right-0 bg-valora-cyan text-black text-[8px] px-1 font-pixel">
            3
          </div>
        </div>
        
        {/* Profile ID Button with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center pl-3 border-l border-white/10 ml-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-slate-400 overflow-hidden">
              <img src={pf1} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </button>
          
          {/* Dropdown Menu */}
          <div 
            className={`absolute right-0 top-full mt-2 w-48 bg-valora-card border-2 border-valora-border shadow-[4px_4px_0px_0px_#111] overflow-hidden transition-all duration-200 origin-top-right ${
              isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="py-1 flex flex-col font-mono text-[10px] uppercase tracking-widest">
              <Link 
                to="/profile" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-valora-cyan hover:text-black transition-colors"
              >
                <User size={14} /> SYS_PROFILE
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-valora-cyan hover:text-black transition-colors"
              >
                <Settings size={14} /> SYS_CONFIG
              </Link>
              <Link 
                to="/documentation" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-valora-cyan hover:text-black transition-colors border-t border-[#333]"
              >
                <FileText size={14} /> READ_DOCS
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default TopNav;
