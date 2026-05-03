
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Grid3X3, Zap, Layers, BarChart2,
  Settings, Users, Plug, Monitor
} from "lucide-react";
import { motion } from "framer-motion";

const Dock = ({ navMode, toggleNavMode }) => {
  const items = [
    { icon: LayoutDashboard, label: "Overview", to: "/dashboard" },
    { icon: Grid3X3, label: "Apps", to: "/applications" },
    { icon: Zap, label: "Deploys", to: "/deploy" },
    { icon: Layers, label: "Env", to: "/environments" },
    { icon: BarChart2, label: "Metrics", to: "/metrics" },
    { icon: Users, label: "Members", to: "/members" },
    { icon: Plug, label: "Plugins", to: "/integrations" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const isDesktopDock = navMode === "dock";
  const visibilityClass = isDesktopDock ? "flex" : "flex md:hidden";

  return (
    <div className={`fixed bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] px-3 md:px-6 ${visibilityClass}`}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-end gap-1 p-2 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] max-w-[95vw] overflow-x-auto scrollbar-hide"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              group relative flex flex-col items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl transition-all duration-300 shrink-0
              ${isActive ? "bg-white/[0.08] text-white" : "text-[#71717a] hover:bg-white/[0.05] hover:text-white md:hover:-translate-y-1.5"}
            `}
          >
            <item.icon size={18} strokeWidth={1.5} />
            <span className="absolute bottom-full mb-6 px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl translate-y-2 group-hover:translate-y-0 hidden md:block">
              {item.label}
            </span>
          </NavLink>
        ))}

        <div className="w-[1px] h-6 bg-white/[0.1] mx-1 self-center hidden md:block" />

        {isDesktopDock && (
          <button
            onClick={toggleNavMode}
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl text-[#52525b] hover:bg-white/[0.05] hover:text-white transition-all duration-300 hover:-translate-y-1.5"
            title="Switch to Sidebar"
          >
            <Monitor size={20} strokeWidth={1.5} />
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Dock;
