import React from 'react';
import {
  Rocket,
  Home,
  Grid,
  Zap,
  FileText,
  Layers,
  BarChart2,
  Settings,
  Circle,
  ChevronDown
} from 'lucide-react';

const MenuItem = ({ icon: Icon, label, active, isCollapsed }) => (
  <div className={`flex items-center px-4 py-3 my-1 cursor-pointer rounded-lg transition-colors duration-200 ${active ? 'bg-[#3b3b38] text-[var(--color-velora-text-light)]' : 'text-[var(--color-velora-text-light-muted)] hover:bg-[#2c2c2b] hover:text-[var(--color-velora-text-light)]'}`}>
    <Icon size={20} className="min-w-[20px]" />
    {!isCollapsed && <span className="ml-4 text-[10px] tracking-wide">{label}</span>}
  </div>
);

const LabelItem = ({ color, label, isCollapsed }) => (
  <div className="flex items-center px-4 py-2 cursor-pointer text-[var(--color-velora-text-light-muted)] hover:bg-[#2c2c2b] hover:text-[var(--color-velora-text-light)] rounded-lg transition-colors duration-200">
    <Circle size={12} className="min-w-[12px]" style={{ fill: color, color }} />
    {!isCollapsed && <span className="ml-4 text-[10px] tracking-wide">{label}</span>}
  </div>
);

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${!isCollapsed ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleSidebar}
      />

      <aside className={`fixed left-0 top-0 flex flex-col bg-[var(--color-velora-sidebar)] h-screen transition-[width] duration-300 ease-in-out border-r border-[#2c2c2b] z-50 overflow-hidden ${isCollapsed ? 'w-[72px]' : 'w-[280px] shadow-2xl md:shadow-none'}`}>

        {/* Logo Area */}
        <div
          className="flex items-center p-6 cursor-pointer border-b border-[#2c2c2b]"
          onClick={toggleSidebar}
        >
          <div className="relative flex items-center justify-center min-w-[32px]">
            <Rocket size={32} className="text-[var(--color-velora-text-light)]" />
          </div>
          {!isCollapsed && (
            <div className="ml-4 flex flex-col justify-center overflow-hidden">
              <h1 className="text-[var(--color-velora-text-light)] text-base font-bold tracking-widest leading-none mb-2">VELORA</h1>
              <p className="text-[#9e9e9e] text-[6px] tracking-widest truncate">DEPLOY. SCALE. DOMINATE.</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6">
          {/* Main Menu */}
          <div className="px-3 mb-8">
            {!isCollapsed && <div className="text-[#6b6b6b] text-[8px] px-4 mb-4 tracking-widest">MAIN MENU</div>}
            <MenuItem icon={Home} label="Dashboard" active={true} isCollapsed={isCollapsed} />
            <MenuItem icon={Grid} label="Applications" isCollapsed={isCollapsed} />
            <MenuItem icon={Zap} label="Deployments" isCollapsed={isCollapsed} />
            <MenuItem icon={FileText} label="Templates" isCollapsed={isCollapsed} />
            <MenuItem icon={Layers} label="Environments" isCollapsed={isCollapsed} />
            <MenuItem icon={BarChart2} label="Metrics" isCollapsed={isCollapsed} />
            <MenuItem icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          </div>

          {/* Labels */}
          <div className="px-3">
            {!isCollapsed && (
              <div className="px-4 mb-4 mt-6">
                <div className="h-[1px] w-full bg-[#2c2c2b] mb-4"></div>
                <div className="text-[#6b6b6b] text-[8px] tracking-widest">LABELS</div>
              </div>
            )}
            <LabelItem color="var(--color-velora-accent-green)" label="Production" isCollapsed={isCollapsed} />
            <LabelItem color="var(--color-velora-accent-blue)" label="Staging" isCollapsed={isCollapsed} />
            <LabelItem color="var(--color-velora-accent-yellow)" label="Development" isCollapsed={isCollapsed} />
            <LabelItem color="var(--color-velora-accent-purple)" label="Database" isCollapsed={isCollapsed} />
            <LabelItem color="var(--color-velora-accent-red)" label="Worker" isCollapsed={isCollapsed} />
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[#2c2c2b] flex items-center cursor-pointer hover:bg-[#2c2c2b] transition-colors duration-200">
          <div className="w-10 h-10 rounded bg-[#d2b48c] min-w-[40px] flex items-center justify-center overflow-hidden border-2 border-[#1e1e1d]">
            {/* Pixelated avatar placeholder using simple shapes to mimic retro look */}
            <div className="w-6 h-6 bg-[#8b4513] rounded-t-sm relative">
              <div className="absolute bottom-0 w-full h-4 bg-[#f5deb3]">
                <div className="flex justify-around pt-1">
                  <div className="w-1 h-1 bg-black"></div>
                  <div className="w-1 h-1 bg-black"></div>
                </div>
              </div>
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="text-[var(--color-velora-text-light)] text-[10px] mb-1 truncate">Henrich Vegh</div>
              <div className="text-[#6b6b6b] text-[8px] truncate">ADMIN</div>
            </div>
          )}
          {!isCollapsed && (
            <ChevronDown size={16} className="text-[#6b6b6b]" />
          )}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
