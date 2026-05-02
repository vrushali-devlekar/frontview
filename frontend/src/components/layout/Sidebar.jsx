import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Rocket,
  Home,
  Grid,
  Zap,
  Layers,
  BarChart2,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";
import pf1 from "../../assets/p1.jpeg";

const MenuItem = ({ icon: Icon, label, to, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 my-1 cursor-pointer transition-colors duration-200 border-l-2 font-mono uppercase tracking-widest text-[10px] ${
        isActive
          ? "bg-valora-card border-valora-yellow text-valora-yellow"
          : "border-transparent text-[#888] hover:bg-[#111] hover:text-white hover:border-[#444]"
      }`
    }
  >
    <Icon size={20} className="min-w-[20px]" />
    {!isCollapsed && (
      <span className="ml-4 text-sm tracking-wide">{label}</span>
    )}
  </NavLink>
);

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    <>
      {/* Mobile Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          !isCollapsed ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed left-0 top-0 flex flex-col h-screen
        ${isCollapsed ? "w-[72px] -translate-x-full md:translate-x-0" : "w-[260px] translate-x-0"}
        transition-all duration-300 ease-in-out
        bg-valora-bg border-r-2 border-valora-border z-50
        shadow-[4px_0_30px_rgba(0,0,0,0.8)]`}
      >
        {/* Logo */}
        <div
          className="flex items-center p-5 cursor-pointer border-b-2 border-valora-border"
          onClick={toggleSidebar}
        >
          <div className="w-8 h-8 border-2 border-valora-yellow flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-valora-yellow"></div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex flex-col">
              <h1 className="text-valora-yellow text-[11px] font-pixel tracking-tighter uppercase">
                VELORA
              </h1>
              <p className="text-valora-cyan text-[8px] tracking-widest mt-1 uppercase font-bold">
                SYS_ONLINE
              </p>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-5">
          <div className="px-3 mb-4">
            {!isCollapsed && (
              <div className="text-[#555] text-[10px] px-4 mb-3 tracking-widest font-mono uppercase">
                SYS_MODULES
              </div>
            )}

            <MenuItem icon={Home}     label="Dashboard"     to="/dashboard"                  isCollapsed={isCollapsed} />
            <MenuItem icon={Grid}     label="Applications"  to="/applications"     isCollapsed={isCollapsed} />
            <MenuItem icon={Zap}      label="Deployments"   to="/deploy"      isCollapsed={isCollapsed} />
            <MenuItem icon={Layers}   label="Environments"  to="/environments"     isCollapsed={isCollapsed} />
            <MenuItem icon={BarChart2} label="Metrics"      to="/metrics"          isCollapsed={isCollapsed} />
            <MenuItem icon={Settings} label="Settings"      to="/settings"         isCollapsed={isCollapsed} />
          </div>
        </div>

        {/* User */}
        <div className="relative p-4 border-t border-[#2c2c2b]" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center cursor-pointer hover:bg-[#2c2c2b] p-2 -m-2 rounded transition"
          >
            <div className="w-10 h-10 rounded flex items-center justify-center overflow-hidden shrink-0 border border-white/10 bg-slate-800">
              <img src={pf1} alt="avatar" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-white text-sm truncate font-mono">usr_8f3a7c2d</div>
                <div className="text-slate-500 text-xs truncate">Admin</div>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={16} className="text-slate-500 shrink-0 ml-1" />}
          </div>

          {/* Dropdown Menu */}
          <div 
            className={`absolute bottom-full left-4 mb-2 w-48 bg-[#11151c] border border-white/10 rounded-lg shadow-xl overflow-hidden transition-all duration-200 origin-bottom-left ${
              isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="py-1 flex flex-col">
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/");
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
              >
                <Home size={14} /> Home
              </button>
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left border-t border-white/5"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;