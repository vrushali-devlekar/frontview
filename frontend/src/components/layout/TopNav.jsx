import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, User, Settings, FileText, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../ui/BrandLogo";

const routeLabels = {
  "/dashboard":    "Overview",
  "/applications": "Applications",
  "/deploy":       "Deployments",
  "/environments": "Environments",
  "/metrics":      "Metrics",
  "/members":      "Members",
  "/integrations": "Integrations",
  "/settings":     "Settings",
  "/documentation":"Documentation",
  "/account":      "Account",
  "/projects/new": "New Project",
};

const TopNav = () => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

  const pageLabel = routeLabels[location.pathname] ?? "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 shrink-0 relative z-50 w-full border-b border-white/[0.05] bg-[#050505]/40 backdrop-blur-2xl gap-2">

      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <BrandLogo
          to="/dashboard"
          className="shrink-0 gap-2"
          iconClassName="rounded-md"
          textClassName="text-[12px] md:text-[12.5px] text-[#3f3f46] hover:text-white transition-colors tracking-tight normal-case"
        />
        {pageLabel && (
          <>
            <span className="text-[#1a1a1a] text-[12px] select-none mx-1 hidden sm:inline">/</span>
            <span className="text-[12px] md:text-[13px] font-bold text-[#52525b] select-none tracking-tight truncate">{pageLabel}</span>
          </>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Expandable search */}
        <div
          ref={searchRef}
          className={`relative flex items-center rounded-lg overflow-hidden transition-all duration-200 ${
            isSearchOpen
              ? "w-40 sm:w-44 md:w-52 bg-[#111113] border border-white/[0.08] ring-1 ring-[#22c55e]/20"
              : "w-8 h-8"
          }`}
        >
          <button
            onClick={() => { setIsSearchOpen(true); }}
            className={`flex items-center justify-center shrink-0 transition-colors w-8 h-8 ${
              isSearchOpen ? "text-[#52525b] pointer-events-none" : "text-[#52525b] hover:text-white hover:bg-white/[0.05] rounded-lg"
            }`}
          >
            <Search size={14} />
          </button>
          <input
            type="text"
            placeholder="Search…"
            autoFocus={isSearchOpen}
            className={`bg-transparent text-[12px] text-white placeholder:text-[#3f3f46] pr-3 focus:outline-none transition-all duration-200 ${
              isSearchOpen ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
            }`}
          />
        </div>

        {/* Notifications */}
        <button className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[#52525b] hover:text-white hover:bg-white/[0.05] transition-colors">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-[5px] h-[5px] bg-[#22c55e] rounded-full ring-2 ring-[#09090b]" />
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-white/[0.08] mx-1 hidden sm:block" />

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            {user?.avatar || user?.githubAvatarUrl || user?.googleAvatarUrl ? (
              <img 
                src={user.avatar || user.githubAvatarUrl || user.googleAvatarUrl} 
                className="w-8 h-8 rounded-full object-cover border border-white/10" 
                alt="Avatar"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black text-white shadow-inner"
                style={{ 
                  backgroundColor: (() => {
                    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
                    const name = user?.name || "User";
                    let hash = 0;
                    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
                    return colors[Math.abs(hash) % colors.length];
                  })()
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="hidden md:block text-[13px] font-bold text-white/70 leading-none ml-1 max-w-[120px] truncate">{user?.name || "User"}</span>
            <ChevronDown size={12} className={`hidden md:block text-[#3f3f46] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 top-[calc(100%+8px)] w-44 sm:w-48 bg-[#111113] border border-white/[0.10] rounded-xl shadow-elevation-3 overflow-hidden origin-top-right transition-all duration-150 ${
              isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="py-1.5 flex flex-col gap-0.5 px-1.5">
              <Link
                to="/account"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white rounded-lg transition-colors"
              >
                <User size={13} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white rounded-lg transition-colors"
              >
                <Settings size={13} /> Settings
              </Link>
              <div className="h-px bg-white/[0.06] mx-1 my-1" />
              <Link
                to="/documentation"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white rounded-lg transition-colors"
              >
                <FileText size={13} /> Documentation
              </Link>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopNav;
