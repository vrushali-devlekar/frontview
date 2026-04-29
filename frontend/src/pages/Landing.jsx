import React from "react";
import val from "../assets/val.png";
// Note: You may need to install lucide-react: npm install lucide-react
import { Bell, Search, Mail, HelpCircle } from "lucide-react";

const features = [
  { title: "Any Stack", desc: "Build in Node, Python, Java, or anything else.", icon: "📦" },
  { title: "Auto-Scaling", desc: "Blocks grow as your traffic spikes.", icon: "📈" },
  { title: "Private Mesh", desc: "Services talk securely over a private grid.", icon: "🌐" },
  { title: "Zero Config", desc: "Just push code. We handle the rest.", icon: "⚡" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e4e4e7] font-['Press_Start_2P',cursive] selection:bg-yellow-500/30 overflow-x-hidden">
      
      {/* 1. RAILWAY SIDE RAIL */}
      <div className="fixed left-8 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent z-0 hidden lg:block">
        <div className="sticky top-1/4 w-3 h-3 rounded-full bg-[#0d0e12] border border-[#39ff14] -left-[6px] shadow-[0_0_8px_#39ff14]"></div>
        <div className="sticky top-1/2 w-2 h-16 bg-[#39ff14]/5 -left-[1px] blur-sm"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="border-b border-white/5 px-10 py-4 flex justify-between items-center bg-[#0d0e12]/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-[#f1e05a] flex items-center justify-center border-b-4 border-yellow-700">
              <span className="text-black text-[10px]">▲</span>
            </div>
            <span className="text-[12px] tracking-widest text-white uppercase">VELORA</span>
          </div>
        </div>

        {/* Updated Navbar Icons Section */}
        <div className="flex items-center gap-5">
          <button className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Search size={16} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
            <Mail size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
          </button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#39ff14] rounded-full"></span>
          </button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors">
            <HelpCircle size={16} />
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
          <button className="bg-[#f1e05a] text-black px-5 py-2 text-[8px] font-bold border-b-4 border-yellow-700 hover:brightness-110 active:translate-y-0.5 transition-all">
            NEW PROJECT
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 lg:pl-40 flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#39ff14]/5 text-[#39ff14] border border-[#39ff14]/20 px-4 py-2 mb-8 text-[8px] uppercase tracking-widest">
            <span className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse"></span>
            Network and connect
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tighter">
            Instant networking.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 font-serif italic capitalize tracking-normal">
              Zero setup.
            </span>
          </h1>
          <p className="text-[10px] text-zinc-500 max-w-xl mb-12 leading-[2] font-sans font-medium uppercase tracking-tighter">
            Private connections, public endpoints, SSL, and load balancing live
            from the moment you deploy. No VPC configuration required.
          </p>

          <div className="space-y-10 mb-16">
            <div className="flex items-start gap-4 group">
              <div className="text-xl">🛡️</div>
              <div>
                <h4 className="text-[10px] text-white uppercase mb-1">Private, fast connections by default</h4>
                <p className="text-[8px] text-zinc-600 leading-relaxed font-sans uppercase">
                  100 Gbps internal networking with protocol detection built-in.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="text-xl">💻</div>
              <div>
                <h4 className="text-[10px] text-white uppercase mb-1">Global Edge Deployment</h4>
                <p className="text-[8px] text-zinc-600 leading-relaxed font-sans uppercase">
                  Run your application closer to where your users are located.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC CANVAS --- */}
        <div className="relative mt-20 lg:mt-0 w-full max-w-[500px]">
          <div className="relative p-1 bg-white/[0.03] rounded-xl border border-white/5 shadow-2xl backdrop-blur-3xl aspect-square lg:aspect-auto min-h-[450px] overflow-hidden bg-[radial-gradient(#1e2025_1px,transparent_1px)] [background-size:24px_24px]">
            <div className="absolute top-10 left-10 bg-[#16181d] border border-white/5 p-5 rounded-sm w-52 z-10 shadow-2xl border-t-2 border-t-[#39ff14]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#39ff14]"></div>
                <span className="text-[7px] uppercase font-bold text-zinc-400">node-api-server</span>
              </div>
              <div className="space-y-2">
                <div className="h-1 w-full bg-white/5 rounded"></div>
                <div className="h-1 w-[60%] bg-white/5 rounded"></div>
              </div>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path d="M 120 150 L 120 280 L 250 280" stroke="#39ff14" strokeWidth="1" fill="none" />
              <circle cx="250" cy="280" r="3" fill="#3b82f6" />
            </svg>

            <div className="absolute bottom-10 right-10 bg-[#16181d] border border-white/5 p-5 rounded-sm w-52 z-10 shadow-2xl border-t-2 border-t-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[7px] uppercase font-bold text-zinc-400">postgres-database</span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="text-[6px] bg-blue-500/10 text-blue-400 px-2 py-1 uppercase font-bold">PORT:5432</span>
              </div>
              <div className="text-[6px] text-zinc-600 uppercase">Status: Connected</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="max-w-6xl mx-auto px-12 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group">
              <div className="text-4xl mb-8 transform group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-[11px] text-white mb-4 uppercase tracking-tighter">{f.title}</h3>
              <p className="text-[9px] text-zinc-500 leading-relaxed font-sans font-medium uppercase tracking-tighter">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- WORKFLOW & ENVIRONMENTS SECTION --- */}
      <section className="relative py-32 px-6 lg:pl-40 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute left-8 top-0 h-full w-[1px] bg-white/5 hidden lg:block">
          <div className="sticky top-40 w-4 h-4 rounded-full bg-[#0d0e12] border-2 border-purple-500 -left-[7px]"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="w-full lg:w-1/2 relative min-h-[450px] flex items-center justify-center">
            <div className="absolute top-0 left-0 w-72 bg-[#16181d] border border-white/5 rounded-lg p-5 shadow-2xl z-30 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px]">📁</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white">production</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
                <span className="text-[7px] text-zinc-600 uppercase">3 Services</span>
                <span className="text-[7px] text-purple-400 font-bold uppercase underline">View Live</span>
              </div>
            </div>
            {/* ... other cards (Staging, PR) remain same ... */}
          </div>

          <div className="w-full lg:w-1/2">
            <div className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 mb-6 text-[8px] uppercase tracking-widest font-bold">
              Evolve and collaborate
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tighter leading-tight text-white">
              A workflow that <br />
              <span className="font-serif italic text-purple-300">actually flows.</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <li className="space-y-2">
                <div className="text-lg">🔄</div>
                <h4 className="text-[10px] text-white uppercase font-bold tracking-tighter">Instant Rollbacks</h4>
                <p className="text-[8px] text-zinc-600 uppercase">Deploy went wrong? Go back in one click.</p>
              </li>
              <li className="space-y-2">
                <div className="text-lg">🌿</div>
                <h4 className="text-[10px] text-white uppercase font-bold tracking-tighter">Ephemeral Envs</h4>
                <p className="text-[8px] text-zinc-600 uppercase">Every branch gets its own temporary URL.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0b0c10] border-t border-white/5 pt-24 pb-12 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] text-zinc-700 uppercase tracking-[0.4em]">© 2026 Velora Inc.</p>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#39ff14] rounded-full"></span>
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Global Systems: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}