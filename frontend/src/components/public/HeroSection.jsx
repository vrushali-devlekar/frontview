import React from "react";
import { NavLink } from "react-router-dom";
import { Zap, ChevronRight } from "lucide-react";
import GlassButton from "../ui/GlassButton";
import StatusBadge from "../ui/StatusBadge";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#09090b] font-sans overflow-hidden select-none flex flex-col">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22c55e]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full grow">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center">
              <Zap size={16} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">Velora</span>
          </div>

          <div className="hidden md:flex gap-8 text-[13px] font-medium text-[#71717a]">
            {["Products", "Solutions", "Resources", "Pricing"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <NavLink to="/login" className="hidden sm:block text-[13px] font-medium text-[#71717a] hover:text-white transition-colors">
              Log In
            </NavLink>
            <NavLink to="/register">
              <GlassButton variant="primary" className="h-9 px-4">
                Sign Up
              </GlassButton>
            </NavLink>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="grow flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center">
          <div className="max-w-4xl flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] text-[#a1a1aa] mb-8 font-medium">
              <Zap size={14} className="text-[#22c55e]" />
              <span>Velora 2.0 is now available</span>
              <div className="w-px h-3 bg-white/[0.1] mx-1"></div>
              <a href="#" className="flex items-center gap-1 text-white hover:text-[#22c55e] transition-colors">
                Read the release notes <ChevronRight size={14} />
              </a>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1] mb-6">
              Your Complete <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                Deployment Platform
              </span>
            </h1>

            <p className="max-w-2xl text-[#a1a1aa] text-lg md:text-xl font-normal leading-relaxed mb-10">
              Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/register">
                <GlassButton variant="primary" className="h-12 px-8 text-[15px] font-medium w-full sm:w-auto justify-center">
                  Start Deploying
                </GlassButton>
              </NavLink>
              <NavLink to="/docs">
                <GlassButton variant="outline" className="h-12 px-8 text-[15px] font-medium w-full sm:w-auto justify-center">
                  Get a Demo
                </GlassButton>
              </NavLink>
            </div>
            
          </div>
        </main>
      </div>
    </section>
  );
};

export default HeroSection;
