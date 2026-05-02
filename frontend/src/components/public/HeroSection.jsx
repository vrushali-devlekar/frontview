import React from "react";
import { NavLink } from "react-router-dom";
import valoBg from "../../assets/herobg.png";
import logo from "../../assets/logo.png";
import CyberButton from "../ui/CyberButton";
import StatusBadge from "../ui/StatusBadge";
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
            <NavLink to="/login" className="hidden sm:block text-[10px] uppercase text-gray-400 hover:text-white transition font-mono tracking-widest">
              Log In
            </NavLink>
            <NavLink to="/register">
              <CyberButton variant="primary">
                Deploy
              </CyberButton>
            </NavLink>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="grow flex flex-col justify-center px-4 md:px-20 lg:px-32">
          <div className="max-w-5xl">
            {/* Sizing adjusted: 4xl on mobile, 7xl on desktop to prevent overflow */}
            <h1 className="text-3xl md:text-5xl lg:text-5xl leading-[1.4] font-pixel text-white tracking-tighter uppercase ">
              Manage Your <span className="text-valora-yellow">Workflow</span>
              <br />
              And Conquer <span className="text-valora-cyan">Deadlines</span>
              <br />
              With <span className="text-valora-yellow">Velora</span>
            </h1>

            <p className="mt-8 max-w-lg text-gray-400 text-[10px] font-mono tracking-widest leading-loose uppercase">
              The modern deployment platform for developers. Scale infrastructure, ship faster, and stay in control.
            </p>

            <div className="mt-10 flex flex-wrap gap-6 font-pixel">
              <NavLink to="/register">
                <CyberButton variant="primary">
                  Deploy {">"}
                </CyberButton>
              </NavLink>
              <NavLink to="/docs">
                <CyberButton variant="outline">
                  Get Free Access
                </CyberButton>
              </NavLink>
            </div>
          </div>
        </main>

        {/*  Stats */}
        <section className="px-6 pb-10 md:px-20 lg:px-32">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <StatusBadge status="No Credit Card" type="success" />
            <StatusBadge status="Open Source" type="success" />
            <StatusBadge status="99.99% Uptime" type="success" />
          </div>
        </section>
      </div>
    </section>
  );
};

export default HeroSection;
