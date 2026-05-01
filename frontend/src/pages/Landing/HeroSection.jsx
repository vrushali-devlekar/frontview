import React from "react";
import { NavLink } from "react-router-dom";
import valoBg from "../../assets/herobg.png";
import logo from "../../assets/logo.png";
const HeroSection = () => {
  return (
    <section className="relative h-screen w-full bg-black text-[#facc159c] font-press-start overflow-hidden select-none">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 z-0 bg-contain bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${valoBg})` }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-3 text-sm md:text-lg font-bold tracking-tighter uppercase">
            {/* The Logo Image */}
            <img
              src={logo}
              alt="Velora Logo"
              className="h-6 w-auto md:h-8 object-contain"
            />
            Velora
          </div>

          <div className="hidden lg:flex gap-8 text-[10px] uppercase tracking-widest text-gray-400">
            {["Product", "Templates", "Docs", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-[#facc15] transition"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <NavLink to="/login" className="hidden sm:block text-[10px] uppercase text-gray-400 hover:text-white transition">
              Log In
            </NavLink>
            <NavLink to="/register" className="bg-[#facc15] text-black px-4 py-2 text-[9px] md:text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center">
              Start Building
            </NavLink>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="grow flex flex-col justify-center px-4 md:px-20 lg:px-32">
          <div className="max-w-5xl">
            {/* Sizing adjusted: 4xl on mobile, 7xl on desktop to prevent overflow */}
            <h1 className="text-3xl md:text-5xl lg:text-5xl leading-[1.4] font-black tracking-tighter uppercase ">
              Deploy.
              <br />
              Scale.
              <br />
              Relax.
            </h1>

            <p className="mt-8 max-w-lg text-gray-400 text-[9px] md:text-xs leading-loose border-l-4 border-[#facc15] pl-6 py-2">
              The modern deployment platform for builders. Scale infrastructure,
              ship faster, and stay in control.
            </p>

            <div className="mt-10 flex flex-wrap gap-6">
              <NavLink to="/register" className="bg-[#facc15] text-black px-5 py-2 text-[8px] md:text-xs font-md uppercase shadow-[5px_5px_0px_0px_rgba(255,255,255,0.4)] hover:scale-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center">
                Start Building
              </NavLink>
              <button className="border-2 border-gray-700 bg-black/40 backdrop-blur-sm text-gray-400 px-6 py-4 text-[8px] md:text-xs uppercase hover:bg-gray-800 transition-all">
                Read Docs
              </button>
            </div>
          </div>
        </main>

        {/*  Stats */}
        <section className="px-6 pb-10 md:px-20 lg:px-32">
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-900/30"></span>
              No Credit Card
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-900/30"></span>
              Open Source
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-900/30"></span>
              99.99% Uptime
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default HeroSection;
