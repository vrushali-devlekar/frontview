<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, 
  FiBookOpen, 
  FiCheckCircle, 
  FiUploadCloud, 
  FiGithub 
} from 'react-icons/fi';

const VeloraLanding = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-lime-500/30">
      {/* Background Decor - Minecraft Themed */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 opacity-20 blur-sm">
           {/* Placeholder for Ender Dragon/Minecraft Assets */}
           <div className="w-[600px] h-[400px] bg-gradient-to-br from-purple-900/20 to-transparent rounded-full" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime-500 rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tighter uppercase">Velora</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Changelog</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium border border-gray-800 rounded-md hover:bg-white/5 transition-all">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-bold bg-[#84cc16] text-black rounded-md hover:bg-[#a3e635] transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="space-y-8"
        >
          <div className="flex items-center gap-2 text-[#84cc16] text-xs font-bold tracking-widest uppercase">
            <span className="p-1 border border-[#84cc16] rounded">
              <FiGithub size={12} />
            </span>
            Modern Deployment Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight uppercase font-mono">
            Deploy your <br />
            <span className="text-[#84cc16]">Project</span> <br />
            In Seconds
          </h1>

          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            From code to production in minutes. <br />
            Powerful. Simple. Scalable.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 px-6 py-4 bg-[#84cc16] text-black font-bold rounded-lg hover:scale-105 transition-transform">
              Get Started Free <FiArrowRight />
            </button>
            <button className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
              <FiBookOpen /> View Documentation
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-bold text-gray-400">
            <div className="flex items-center gap-2"><FiCheckCircle className="text-[#84cc16]" /> No Credit Card</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-[#84cc16]" /> Open Source</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-[#84cc16]" /> Developer First</div>
          </div>
        </motion.div>

        {/* Right Column - Terminal UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Main Terminal Window */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-lime-500/10">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            <div className="p-8 space-y-8">
              <h3 className="text-lg font-medium text-gray-200">Deploying your project...</h3>
              
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Build', status: 'done' },
                  { label: 'Configure', status: 'done' },
                  { label: 'Deploy', status: 'done' },
                  { label: 'Live', status: 'pending' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${step.status === 'done' ? 'border-lime-500' : 'border-gray-600'}`}>
                      {step.status === 'done' && <div className="w-2 h-2 bg-lime-500 rounded-full" />}
                    </div>
                    <span className={step.status === 'done' ? 'text-white' : 'text-gray-500'}>{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Upload Area */}
              <div className="mt-4 border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-white/[0.02]">
                <FiUploadCloud className="text-gray-500 mb-4" size={40} />
                <p className="text-sm text-gray-400 mb-4">Drag & drop your repository <br /> or</p>
                <button className="px-6 py-2 bg-[#84cc16] text-black font-bold rounded-md text-sm">
                  Choose Repository
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Deploying...</span>
                  <span>75%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="h-full bg-lime-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Character Assets (Optional visual filler) */}
          <div className="absolute -left-12 -bottom-10 w-24 h-24 bg-lime-900/20 blur-2xl rounded-full" />
        </motion.div>

      </main>
    </div>
  );
};

export default VeloraLanding;
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
