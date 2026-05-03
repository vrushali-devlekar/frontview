import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Grid3X3, Zap, Layers, BarChart2,
  Settings, LogOut, User, Users,
  PanelLeft, Plug, Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutRequest } from "../../api/api";
import BrandLogo from "../ui/BrandLogo";

const MenuItem = ({ icon: Icon, label, to, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300
      ${isActive
        ? "bg-white text-black font-bold shadow-lg"
        : "text-[#71717a] hover:text-white hover:bg-white/[0.03] hover:translate-x-1"
      }
      ${isCollapsed ? "justify-center px-0 w-[44px] h-[44px] mx-auto" : ""}
    `}
  >
    {({ isActive }) => (
      <>
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.5} />
        {!isCollapsed && <span className="text-[13.5px] tracking-tight">{label}</span>}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
            {label}
          </div>
        )}
      </>
    )}
  </NavLink>
);

const Sidebar = ({ isCollapsed, toggleSidebar, navMode, toggleNavMode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (navMode === "dock") return null;

  const topItems = [
    { icon: LayoutDashboard, label: "Overview", to: "/dashboard" },
    { icon: Grid3X3, label: "Applications", to: "/applications" },
    { icon: Zap, label: "Deployments", to: "/deploy" },
    { icon: Layers, label: "Environments", to: "/environments" },
    { icon: BarChart2, label: "Metrics", to: "/metrics" },
  ];

  const bottomItems = [
    { icon: Users, label: "Members", to: "/members" },
    { icon: Plug, label: "Integrations", to: "/integrations" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const initials = (user?.username || user?.name || "V").charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // Ignore network failures on logout.
    }
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 92 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-50 bg-[#050505]/60 backdrop-blur-3xl border-r border-white/[0.05] md:flex hidden flex-col"
    >
      <div className={`h-20 flex items-center px-6 ${isCollapsed ? "justify-center" : ""}`}>
        <BrandLogo to="/dashboard" compact={isCollapsed} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-8 scrollbar-hide">
        <div>
          {!isCollapsed && (
            <h3 className="px-4 text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.25em] mb-4">
              Workspace
            </h3>
          )}
          <div className="space-y-1">
            {topItems.map((item) => (
              <MenuItem key={item.to} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="px-4 text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.25em] mb-4">
              Account
            </h3>
          )}
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <MenuItem key={item.to} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2 border-t border-white/[0.05]">
        <button
          onClick={toggleNavMode}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-[#71717a] hover:text-white hover:bg-white/[0.03]
            ${isCollapsed ? "justify-center px-0 w-[48px] h-[48px] mx-auto" : ""}`}
          title="Switch to Dock"
        >
          <Monitor size={18} strokeWidth={1.5} />
          {!isCollapsed && <span className="text-[13px] font-medium">Switch to Dock</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-[#71717a] hover:text-white hover:bg-white/[0.03]
            ${isCollapsed ? "justify-center px-0 w-[48px] h-[48px] mx-auto" : ""}`}
        >
          <PanelLeft
            size={18}
            strokeWidth={1.5}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
          {!isCollapsed && <span className="text-[13px] font-medium">Collapse Sidebar</span>}
        </button>

        <div className="relative pt-2" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className={`w-full flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all rounded-2xl
              ${isCollapsed ? "justify-center p-0 w-[48px] h-[48px] mx-auto" : "p-2.5"}`}
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[12px] font-bold text-black shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-bold text-white truncate">{user?.username || user?.name || "Operator"}</p>
                <p className="text-[11px] text-[#52525b] truncate">{user?.email || "No email"}</p>
              </div>
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute bottom-full mb-3 z-50 bg-[#111113] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden
                  ${isCollapsed ? "left-14 w-48" : "left-0 right-0"}`}
              >
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/account");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#a1a1aa] hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
