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

<<<<<<< HEAD
          <div className="hidden md:flex gap-8 text-[13px] font-medium text-[#71717a]">
            {["Products", "Solutions", "Resources", "Pricing"].map((item) => (
=======
          <div className="hidden lg:flex gap-8 text-[10px] uppercase tracking-widest text-gray-400">
            {["Product", "Templates", "Docs", "Pricing"].map((item) => (
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
