import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BrandLogo from "../ui/BrandLogo";
import heroBg from "../../assets/mcrft-bg.png";

const HeroSection = () => {
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#how-it-works" },
    { label: "Deploy", href: "#ready-to-deploy" },
    { label: "Docs", to: "/documentation" },
  ];

  return (
    <section id="hero" className="relative min-h-screen w-full bg-[#060606] font-sans overflow-hidden select-none flex flex-col">
      {/* Background Image */}
      <div
        className='absolute inset-0 z-0 h-full w-full bg-cover bg-no-repeat'
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'left 20% 85%',
          filter: 'brightness(0.6) contrast(1.1)'
        }}
      />
      {/* Overlays */}
      <div className='absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/10 to-transparent' />
      <div className='absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent' />

      <div className="relative z-10 flex flex-col h-full grow">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md">
          <BrandLogo to="/" textClassName="text-lg font-semibold tracking-tight normal-case" iconClassName="rounded-md" />

          <div className="hidden md:flex gap-8 text-[13px] font-medium text-[#71717a]">
            {navItems.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <NavLink to="/login" className="hidden sm:flex items-center justify-center h-8 px-4 text-[12px] font-medium text-white border border-white/20 rounded hover:bg-white/5 transition-colors">
              Sign In
            </NavLink>
            <NavLink to="/register">
              <button className="h-8 px-4 bg-[#a3e635] text-black text-[12px] font-bold rounded hover:bg-[#bef264] transition-colors">
                Get Started
              </button>
            </NavLink>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="grow flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center">
          <div className="max-w-4xl flex flex-col items-center">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#a3e635]/20 text-[10px] text-[#a3e635] mb-8 font-mono uppercase font-bold tracking-widest">
              <div className='w-2 h-2 bg-[#a3e635] rounded-sm rotate-45' />
              <span>Velora 2.0 is now available</span>
              <div className="w-px h-3 bg-white/[0.1] mx-1"></div>
              <NavLink to="/documentation" className="flex items-center gap-1 hover:text-white transition-colors">
                Read the release notes <ChevronRight size={14} />
              </NavLink>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tighter leading-[1.3] mb-6 font-['Press_Start_2P'] uppercase">
              Your Complete <br />
              <span className="text-[#a3e635]">
                Deployment
              </span>{" "}
              <span className="text-[#facc15]">
                Platform
              </span>
            </h1>

            <p className="max-w-2xl text-[#a1a1aa] text-lg md:text-xl font-normal leading-relaxed mb-10">
              Velora provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/register">
                <button className="h-12 px-6 text-[13px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 bg-[#a3e635] hover:bg-[#bef264] text-black rounded transition-colors font-mono">
                  Get Started Free <span>→</span>
                </button>
              </NavLink>
              <NavLink to="/documentation">
                <button className="h-12 px-6 text-[13px] font-bold w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded transition-colors font-mono">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  View Documentation
                </button>
              </NavLink>
            </div>

          </div>
        </main>
      </div>
    </section>
  );
};

export default HeroSection;
