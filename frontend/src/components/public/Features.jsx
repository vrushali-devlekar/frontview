import React from "react";
import StatusBadge from "../ui/StatusBadge";

const FeaturesSection = () => {
  const cards = [
    {
      title: "MODULE_01.EXE",
      status: "CONNECTED",
      color: "valora-cyan",
      desc: "SANDBOX INFRASTRUCTURE ONLINE. HIGH-THROUGHPUT PIPELINE MAINTAINED.",
    },
    {
      title: "MODULE_02.EXE",
      status: "ACTIVE",
      color: "valora-yellow",
      desc: "AUTO-SCALING WORKER POOL ENGAGED. SYSTEM READY FOR HIGH-TRAFFIC SURGES.",
    },
    {
      title: "MODULE_03.EXE",
      status: "STABLE",
      color: "valora-cyan",
      desc: "EDGE DEPLOYMENT NODES SYNCED. GLOBAL LATENCY OPTIMIZED.",
    },
  ];

  return (
    <section className="bg-valora-bg text-white font-mono py-20 px-6 md:px-20 select-none">
      {/* Heading Area */}
      <div className="mb-16 flex items-center gap-4">
        <div className="h-6 w-1 bg-valora-cyan"></div>
        <h2 className="text-xl md:text-2xl font-pixel uppercase tracking-widest text-white">
          <span className="text-[#888] mr-4">⚡</span>
          SYSTEMS <span className="text-valora-cyan">ONLINE</span>
        </h2>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-valora-card border-2 border-valora-border p-8 relative flex flex-col items-start hover:border-gray-500 transition-colors"
          >
            {/* Top Left Accent */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-${card.color}`}></div>
            {/* Bottom Right Accent */}
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#333]`}></div>

            <div className={`w-8 h-8 border-2 border-${card.color} flex items-center justify-center mb-6`}>
              <div className={`w-2 h-2 bg-${card.color}`}></div>
            </div>

            <h3 className="text-sm mb-2 font-pixel text-white uppercase tracking-tight">
              {card.title}
            </h3>
            <p className={`text-[10px] mb-6 text-${card.color} font-bold tracking-widest`}>
              STATUS: {card.status}
            </p>
            <p className="text-[10px] leading-relaxed text-[#666] tracking-widest uppercase">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Large Bottom Section */}
      <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* Mockup Terminal Side */}
        <div className="w-full md:w-1/2 bg-[#0a0a0a] border-2 border-[#222] p-8 relative">
           <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-valora-yellow`}></div>
           <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#333]`}></div>
           
           <div className="flex items-center gap-4 mb-8">
             <div className="w-8 h-8 border-2 border-valora-yellow flex items-center justify-center">
               <div className="w-2 h-2 bg-valora-yellow"></div>
             </div>
             <div>
               <h4 className="font-pixel text-[10px] uppercase">VELORA_UX.EXE</h4>
               <span className="text-[8px] text-valora-cyan font-bold tracking-widest">PROTOCOL: ACTIVE</span>
             </div>
           </div>

           <div className="border border-[#333] p-6 mb-6">
             <p className="text-[10px] text-valora-cyan leading-loose tracking-widest uppercase">
               {">"} PIPELINE CHECK: ALL NODES RESPONDING.
             </p>
             <p className="text-[8px] text-[#555] text-right mt-2">SYS: OK / 13MS</p>
           </div>

           <div className="bg-valora-yellow text-black p-4 border border-valora-yellow">
             <p className="text-[10px] font-pixel leading-relaxed uppercase">
               EXECUTING GLOBAL SYNC... SECONDARY CACHE PROTOCOLS INITIALIZED.
             </p>
           </div>
           <p className="text-[8px] text-[#444] mt-4 tracking-widest uppercase">SYS: COMPLETE</p>
        </div>

        {/* Text Side */}
        <div className="w-full md:w-1/2">
          <div className="inline-block border border-[#333] bg-[#0a0a0a] px-4 py-2 mb-8">
            <span className="text-[10px] text-valora-cyan font-bold tracking-widest">OPERATIONAL STATUS</span>
          </div>

          <h3 className="text-2xl md:text-3xl mb-8 font-pixel uppercase leading-snug">
            ENGINEERED BY EXHAUSTED DEVS,<br/>
            FOR EVEN MORE <span className="text-valora-yellow">TIRED</span> HUMANS
          </h3>
          
          <div className="border-l-4 border-valora-cyan pl-6 py-2">
            <p className="text-[10px] text-gray-400 leading-loose uppercase tracking-widest">
              VELORA ELIMINATES THE FRICTION OF MODERN CLOUD COMPLEXITY. WE'VE REPLACED CLUTTERED DASHBOARDS WITH A STREAMLINED INTERFACE FOR BUILDERS WHO VALUE SPEED AND RELIABILITY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
