import React from "react";
import {
  Rocket,
  Home,
  Grid,
  Zap,
  Layers,
  BarChart2,
  Settings,
  ChevronDown,
} from "lucide-react";

const MenuItem = ({ icon: Icon, label, active, isCollapsed }) => (
  <div
    className={`flex items-center px-4 py-3 my-1 cursor-pointer rounded-lg transition-colors duration-200 ${active
        ? "bg-[#3b3b38] text-white"
        : "text-slate-400 hover:bg-[#2c2c2b] hover:text-white"
      }`}
  >
    <Icon size={20} className="min-w-[20px]" />
    {!isCollapsed && (
      <span className="ml-4 text-[11px] tracking-wide">{label}</span>
    )}
  </div>
);

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${!isCollapsed ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed left-0 top-0 flex flex-col h-screen
        ${isCollapsed ? "w-[72px]" : "w-[260px]"}
        transition-all duration-300 ease-in-out
        bg-[#0d1117] border-r border-white/10 z-50
        shadow-[4px_0_30px_rgba(0,0,0,0.6)]`}
      >
        {/* 🔰 Logo Area */}
        <div
          className="flex items-center p-5 cursor-pointer border-b border-[#2c2c2b]"
          onClick={toggleSidebar}
        >
          <Rocket size={28} className="text-white" />

          {!isCollapsed && (
            <div className="ml-3 flex flex-col">
              <h1 className="text-white text-sm font-semibold tracking-wide">
                Velora
              </h1>
              <p className="text-slate-500 text-[9px] tracking-widest">
                DEPLOY. SCALE. DOMINATE.
              </p>
            </div>
          )}
        </div>

        {/* 📂 Menu */}
        <div className="flex-1 overflow-y-auto py-5">
          <div className="px-3 mb-4">
            {!isCollapsed && (
              <div className="text-slate-500 text-[10px] px-4 mb-3 tracking-widest">
                MAIN MENU
              </div>
            )}

            <MenuItem
              icon={Home}
              label="Dashboard"
              active
              isCollapsed={isCollapsed}
            />
            <MenuItem
              icon={Grid}
              label="Applications"
              isCollapsed={isCollapsed}
            />
            <MenuItem
              icon={Zap}
              label="Deployments"
              isCollapsed={isCollapsed}
            />
            <MenuItem
              icon={Layers}
              label="Environments"
              isCollapsed={isCollapsed}
            />
            <MenuItem
              icon={BarChart2}
              label="Metrics"
              isCollapsed={isCollapsed}
            />
            <MenuItem
              icon={Settings}
              label="Settings"
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        {/* 👤 User */}
        <div className="p-4 border-t border-[#2c2c2b] flex items-center cursor-pointer hover:bg-[#2c2c2b] transition">
          <div className="w-10 h-10 rounded bg-amber-300 flex items-center justify-center text-black text-xs font-bold">
            HV
          </div>

          {!isCollapsed && (
            <div className="ml-3 flex-1">
              <div className="text-white text-xs truncate">
                Henrich Vegh
              </div>
              <div className="text-slate-500 text-[10px] truncate">
                Admin
              </div>
            </div>
          )}

          {!isCollapsed && (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;