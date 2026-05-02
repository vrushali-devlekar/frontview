import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, CheckCircle2 } from "lucide-react";

// IMPORT YOUR IMAGE HERE
import bgImage from "../../assets/val.png";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#10B981] selection:text-black font-minecraft overflow-x-hidden">
      {/* --- NAVBAR --- */}
      {/* --- NAVBAR --- */}
      <div className="fixed top-6 w-full z-50 flex justify-center px-6">
        <nav className="w-full max-w-4xl border-2 border-[#1A1A1A] bg-black/50 backdrop-blur-xl rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="size-8 bg-[#EAB308] flex items-center justify-center border-b-4 border-r-4 border-[#854d0e] group-active:translate-y-0.5 transition-all rounded-sm">
                <span className="text-black text-[10px] font-bold">V</span>
              </div>
              <span className="text-[12px] font-bold uppercase text-[#EAB308] hidden sm:block">
                Velora
              </span>
            </motion.div>

            {/* Desktop Menu - Centered Links */}
            <div className="hidden md:flex items-center gap-8">
              {["About", "Features", "Pricing", "Docs"].map((item, i) => (
                <motion.a
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[8px] uppercase font-bold text-slate-300 hover:text-[#10B981] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Nav Actions */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden md:flex items-center gap-4"
            >
              <button className="text-[8px] uppercase font-bold text-slate-400 hover:text-white transition-colors">
                Log In
              </button>
              <button className="bg-[#EAB308] text-black px-4 py-2 rounded-full border-b-2 border-r-2 border-[#854d0e] text-[8px] font-bold uppercase active:translate-y-0.5 transition-all">
                Deploy
              </button>
            </motion.div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-[#EAB308]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Overlay - Adjusted for Capsule Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden pt-4 flex flex-col gap-4 overflow-hidden"
              >
                {["About", "Features", "Pricing", "Docs"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[10px] uppercase font-bold text-[#EAB308]"
                  >
                    {item}
                  </a>
                ))}
                <div className="flex gap-4 pt-2 border-t border-[#1A1A1A]">
                  <button className="text-[10px] uppercase font-bold text-white">
                    Log In
                  </button>
                  <button className="bg-[#EAB308] text-black px-4 py-2 text-[10px] font-bold uppercase rounded-full">
                    Deploy
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* --- HERO SECTION --- */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 z-10 bg-black/55 backdrop-blur-[1px]" />

        {/* Subtle Green Secondary Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-[#10B981]/10 blur-[120px] rounded-full z-0" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto px-6 relative z-20 pt-28 flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="max-w-4xl flex flex-col items-center"
          >
            <h1 className="text-xl md:text-3xl lg:text-3xl font-thin leading-[1.6] mb-8 tracking-tighter">
              MANAGE YOUR <span className="text-[#EAB308]">WORKFLOW</span>
              <br />
              AND CONQUER <span className="text-[#10B981]">DEADLINES</span>
              <br />
              WITH{" "}
              <span className="text-[#EAB308] drop-shadow-[4px_4px_0px_#000]">
                VELORA
              </span>
            </h1>

            <motion.p
              variants={fadeInUp}
              className="text-[10px] md:text-xs text-slate-400 max-w-xl mb-10 leading-loose uppercase tracking-wide"
            >
              The modern deployment platform for developers. Scale
              infrastructure, ship faster, and stay in control.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <button className="group flex items-center gap-3 bg-[#EAB308] text-black px-6 py-3 border-b-4 border-r-4 border-[#854d0e] active:translate-y-1 active:border-0 transition-all">
                <span className="text-[9px] font-bold uppercase">Deploy</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button className="flex items-center gap-2 text-white hover:text-[#10B981] transition-colors group">
                {/* Manual SVG Terminal Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                <span className="text-[9px] font-bold uppercase border-b-2 border-transparent group-hover:border-[#10B981]">
                  Get free access
                </span>
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 flex flex-wrap justify-center gap-8 opacity-60"
            >
              {["No Credit Card", "Open Source", "99.9% Uptime"].map((stat) => (
                <div key={stat} className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-[#10B981]" />
                  <span className="text-[8px] uppercase">{stat}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES PREVIEW --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-[#050505] border-t-4 border-[#1A1A1A] relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-96 bg-[#10B981]/5 blur-[120px] rounded-full -z-10" />

        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-4 mb-12 border-l-4 border-[#10B981] pl-6"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h2 className="text-sm md:text-lg uppercase font-bold tracking-tight">
              Systems <span className="text-[#10B981]">Online</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "MODULE_01.EXE",
                status: "Status: Encrypted",
                path: (
                  <path d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a9 9 0 0 0 9 9" />
                ),
                color: "text-[#EAB308]",
                borderColor: "border-[#854d0e]",
                desc: "Seamlessly connect repositories. High-speed <span class='text-[#EAB308]'>syncing</span> ensures source code is prepped for all environments.",
              },
              {
                title: "MODULE_02.EXE",
                status: "Protocol: Active",
                path: <rect x="4" y="4" width="16" height="16" rx="2" />,
                color: "text-[#10B981]",
                borderColor: "border-[#065f46]",
                desc: "Automatically manage environment variables. isolated <span class='text-[#EAB308]'>runtime</span> environments ensure 100% global stability.",
              },
              {
                title: "MODULE_03.EXE",
                status: "Health: Stable",
                path: <circle cx="12" cy="12" r="10" />,
                color: "text-[#EAB308]",
                borderColor: "border-[#854d0e]",
                desc: "Push to high-performance nodes. Autonomous <span class='text-[#EAB308]'>scaling</span> distributes load keeping latency under 50ms.",
              },
            ].map((module, index) => (
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: "#10B981" }}
                key={index}
                className="p-8 border-2 border-[#1A1A1A] bg-[#0A0A0A] transition-all relative group shadow-[8px_8px_0px_0px_#000]"
              >
                <div
                  className={`size-10 flex items-center justify-center mb-6 bg-[#111] border-b-4 border-r-4 ${module.borderColor} ${module.color}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {module.path}
                  </svg>
                </div>

                <h3 className="text-[10px] font-bold uppercase mb-2 text-white">
                  {module.title}
                </h3>
                <div className="text-[7px] text-[#10B981] mb-4 uppercase font-bold tracking-[0.2em]">
                  {module.status}
                </div>
                <p
                  className="text-[9px] text-slate-500 leading-relaxed uppercase font-sans tracking-wide"
                  dangerouslySetInnerHTML={{ __html: module.desc }}
                />
                <div className="absolute bottom-0 right-0 size-2 bg-[#1A1A1A] group-hover:bg-[#10B981] transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
