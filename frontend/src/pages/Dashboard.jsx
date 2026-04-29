// user ke sare project listing
// new prj btn
// deployment list
// navbar on top logo name..
// status of server up/down

import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import val from "../assets/val.png";

const Dashboard = () => {
  // Navigation Items
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Applications", path: "/applications", icon: "📦" },
    { name: "Deployments", path: "/deployment", icon: "⚡" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#050505] text-[#d1d1d1] font-['Minecraftia',monospace] flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-[#090a0c] flex flex-col h-full sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-[#f1e05a] flex items-center justify-center rounded-sm shadow-[2px_2px_0px_#8a7b2e]">
            <span className="text-black text-xs font-bold">▲</span>
          </div>
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            Velora
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-4 ml-2 italic">
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 text-[10px] uppercase transition-all duration-200 border-l-2 ${
                  isActive
                    ? "bg-[#f1e05a]/10 text-[#f1e05a] border-[#f1e05a]"
                    : "text-gray-500 border-transparent hover:text-white hover:bg-white/[0.03]"
                }`
              }
            >
              <span>{item.icon}</span> {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Status at Bottom */}
        <div className="p-4 border-t border-white/5 bg-[#0d0f11]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-sm shadow-inner"></div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase">
                Sheryian
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[8px] text-green-500 uppercase">Server Up</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#090a0c]/80 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">
            Welcome back, <span className="text-white">Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="bg-[#f1e05a] text-black px-4 py-1.5 text-[9px] font-bold border-b-2 border-[#8a7b2e] active:border-b-0 active:translate-y-[2px] transition-all">
              + NEW PROJECT
            </button>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <span className="text-gray-500 hover:text-white cursor-pointer text-sm font-bold">
              🔔
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#050505] relative">
          {/* Subtle Background Hint */}
          <div
            className="absolute inset-0 z-0 opacity-5 pointer-events-none grayscale bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url(${val})` }}
          ></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <Outlet /> {/* Isme pages load honge */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
