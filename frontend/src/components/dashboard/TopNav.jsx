import React from 'react';
import { Search, Bell, Mail, HelpCircle, PlusSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // NavLink import karein

const TopNav = () => {
  return (
    <header className="h-[64px] flex items-center justify-between px-4 md:px-8 border-b border-[#d1c8b4] shrink-0">

      {/* Left Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">

        {/* Overview Link */}
        <NavLink
          to="/overview"
          className={({ isActive }) => `
            relative text-[11px] cursor-pointer transition-colors duration-200 flex items-center
            ${isActive ? 'text-[var(--color-velora-text)]' : 'text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)]'}
          `}
        >
          {({ isActive }) => (
            <>
              <span className="inline-block transform scale-x-[0.85] scale-y-[1.1] tracking-tight">Overview</span>
              {isActive && <div className="absolute bottom-[-8px] left-0 right-0 h-[1px] bg-[var(--color-velora-text)]"></div>}
            </>
          )}
        </NavLink>

        <div className="text-[11px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200 flex items-center">
          {/*Deploy link */}
          <NavLink
            to="/deploy"
            className={({ isActive }) => `
            relative cursor-pointer transition-colors duration-200
            ${isActive ? 'text-[var(--color-velora-text)]' : 'text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)]'}
          `}
          >
            {({ isActive }) => (
              <>
                <span className="inline-block transform scale-x-[0.85] scale-y-[1.1] tracking-tight">Deploy</span>
                {isActive && <div className="absolute bottom-[-8px] left-0 right-0 h-[1px] bg-[var(--color-velora-text)]"></div>}
              </>
            )}
          </NavLink>
        </div>

        {/* Pipeline Link  */}
        <NavLink
          to="/pipelines"
          className={({ isActive }) => `
            relative text-[11px] cursor-pointer transition-colors duration-200 flex items-center
            ${isActive ? 'text-[var(--color-velora-text)]' : 'text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)]'}
          `}
        >
          {({ isActive }) => (
            <>
              <span className="inline-block transform scale-x-[0.85] scale-y-[1.1] tracking-tight">Pipelines</span>
              {isActive && <div className="absolute bottom-[-8px] left-0 right-0 h-[1px] bg-[var(--color-velora-text)]"></div>}
            </>
          )}
        </NavLink>

        <div className="text-[11px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200 flex items-center">
          <span className="inline-block transform scale-x-[0.85] scale-y-[1.1] tracking-tight">Infrastructure</span>
        </div>

        <div className="text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] cursor-pointer transition-colors duration-200">
          <PlusSquare size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Right Icons (Baaki code same rahega) */}
      <div className="flex items-center space-x-4 md:space-x-6 text-[var(--color-velora-text)] ml-auto">
        <Search size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
        <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
          <Bell size={20} />
          <div className="absolute -top-1.5 -right-2 bg-[var(--color-velora-accent-yellow)] text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-[var(--color-velora-bg)]">3</div>
        </div>
        <Mail size={20} className="cursor-pointer hover:opacity-70 transition-opacity hidden sm:block" />
        <HelpCircle size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
      </div>

    </header>
  );
};

export default TopNav;