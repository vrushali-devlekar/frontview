import React from "react";
import { Link, useLocation } from "react-router-dom";

const Slidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Applications", path: "/applications", icon: "📦" },
    { name: "Deployments", path: "/deployment", icon: "⚡" },
    { name: "Templates", path: "/templates", icon: "📄" },
    { name: "Metrics", path: "/metrics", icon: "📊" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#090a0c] border-r border-white/5 flex flex-col p-6 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-[#f1e05a] flex items-center justify-center rounded-sm shadow-[2px_2px_0px_#8a7b2e]">
          <span className="text-black text-xs font-bold">▲</span>
        </div>
        <span className="text-sm font-bold tracking-widest text-white uppercase">Velora</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mb-4 ml-2 italic">Main Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] uppercase transition-all duration-200 ${
              pathname === item.path
                ? "bg-[#f1e05a]/10 text-[#f1e05a] border-l-2 border-[#f1e05a]"
                : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-600 rounded-sm shadow-inner"></div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase">Sheryian</p>
            <p className="text-[8px] text-gray-500 uppercase tracking-tighter italic text-green-500">Developer • Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Slidebar;