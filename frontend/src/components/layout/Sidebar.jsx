import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Grid3X3,
  Zap,
  Layers,
  BarChart2,
  Settings,
  LogOut,
  User,
  Users,
  PanelLeft,
  Plug,
  Monitor,
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
      ${
        isActive
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
      className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-white/[0.05] bg-[#050505]/60 backdrop-blur-3xl md:flex"
    >
      <div className={`flex h-20 items-center px-6 ${isCollapsed ? "justify-center" : ""}`}>
        <BrandLogo to="/dashboard" compact={isCollapsed} />
      </div>

      <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto overflow-x-hidden px-4 py-2">
        <div>
          {!isCollapsed && (
            <h3 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-[#3f3f46]">
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
            <h3 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-[#3f3f46]">
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

      <div className="space-y-2 border-t border-white/[0.05] p-4">
        <button
          onClick={toggleNavMode}
          className={`w-full items-center gap-3 rounded-2xl px-4 py-3 text-[#71717a] transition-all duration-300 hover:bg-white/[0.03] hover:text-white ${
            isCollapsed ? "mx-auto flex h-[48px] w-[48px] justify-center px-0" : "flex"
          }`}
          title="Switch to Dock"
        >
          <Monitor size={18} strokeWidth={1.5} />
          {!isCollapsed && <span className="text-[13px] font-medium">Switch to Dock</span>}
        </button>

        <button
          onClick={toggleSidebar}
          className={`w-full items-center gap-3 rounded-2xl px-4 py-3 text-[#71717a] transition-all duration-300 hover:bg-white/[0.03] hover:text-white ${
            isCollapsed ? "mx-auto flex h-[48px] w-[48px] justify-center px-0" : "flex"
          }`}
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
            className={`w-full items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.03] transition-all hover:bg-white/[0.06] ${
              isCollapsed ? "mx-auto flex h-[48px] w-[48px] justify-center p-0" : "flex p-2.5"
            }`}
          >
            <div className="h-8 w-8 shrink-0 rounded-full bg-white text-[12px] font-bold text-black flex items-center justify-center">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-bold text-white">{user?.username || user?.name || "Operator"}</p>
                <p className="truncate text-[11px] text-[#52525b]">{user?.email || "No email"}</p>
              </div>
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute bottom-full z-50 mb-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113] shadow-2xl ${
                  isCollapsed ? "left-14 w-48" : "left-0 right-0"
                }`}
              >
                <div className="space-y-0.5 p-1.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/account");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#a1a1aa] transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#ef4444] transition-colors hover:bg-[#ef4444]/10"
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
