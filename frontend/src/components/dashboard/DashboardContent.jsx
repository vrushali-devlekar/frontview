import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import {
  Rocket,
  Folder,
  Terminal,
  ExternalLink,
  Cpu,
  BrainCircuit,
  History,
  Settings
} from "lucide-react";

import heroBg from "../../assets/new-top.png";

const StatusBadge = ({ status }) => {
  const styles = {
    RUNNING: "text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10",
    FAILED: "text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10",
    BUILDING: "text-[#FFCC00] border-[#FFCC00]/30 bg-[#FFCC00]/10",
  };

  return (
    <span className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-[#00FFCC]' : status === 'FAILED' ? 'bg-[#FF3333]' : 'bg-[#FFCC00] animate-pulse'}`}></span>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const myProjects = [
    {
      name: "VALORA_FRONTEND",
      framework: "React",
      status: "RUNNING",
      url: "valora-front.vercel.app",
      lastDeploy: "10m ago",
      version: "v4.0.1"
    },
    {
      name: "PAYMENT_MICROSERVICE",
      framework: "Node.js",
      status: "FAILED",
      url: "api.payments.com",
      lastDeploy: "2h ago",
      version: "v2.1.0"
    },
    {
      name: "AUTH_GATEWAY",
      framework: "Express",
      status: "BUILDING",
      url: "auth.valora.io",
      lastDeploy: "Just now",
      version: "v1.0.5"
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>

        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest" style={{ fontFamily: "'Press Start 2P', cursive" }}>OVERVIEW</h1>
              <p className="text-[10px] text-[#888] mt-1">YOUR PERSONAL DEPLOYMENT FLEET</p>
            </div>

            {/* 🌟 THEME FIX: Exact Landing Page Style Button */}
            <button
              className="bg-[#FFCC00] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                boxShadow: "4px 4px 0px 0px #CC9900" // Hard shadow for 3D retro effect
              }}
            >
              <Rocket size={14} strokeWidth={3} /> IMPORT_REPO
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          <h2 className="text-sm text-[#888] mb-4 flex items-center gap-2 border-b border-[#222] pb-2 font-bold">
            <Folder size={14} /> ACTIVE_PROJECTS ({myProjects.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProjects.map((project, i) => (
              <div key={i} className="bg-[#0a0a0a] border-2 border-[#222] hover:border-[#FFCC00] transition-colors flex flex-col relative group" style={{ boxShadow: "4px 4px 0px 0px rgba(255, 204, 0, 0.1)" }}>

                <div className="p-4 border-b border-[#111]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-[#FFCC00] truncate pr-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', lineHeight: '1.5' }}>
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#666]">
                    <Cpu size={12} /> {project.framework} • {project.version}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-[#555]">LAST_DEPLOY:</span>
                    <span className="text-[10px] text-[#AAA]">{project.lastDeploy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#555]">DOMAIN:</span>
                    <a href={`https://${project.url}`} target="_blank" className="text-[10px] text-[#00FFCC] hover:underline flex items-center gap-1 font-bold">
                      {project.url} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* 🌟 THEME FIX: Action Bar styling updated to match */}
                <div className="grid grid-cols-4 border-t-2 border-[#111] bg-[#050505]">
                  <button className="p-3 text-[#555] hover:text-[#00FFCC] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors" title="View Logs (Phase 5)">
                    <Terminal size={14} />
                  </button>
                  <button className="p-3 text-[#555] hover:text-[#FFCC00] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors" title="Env Vars (Phase 6)">
                    <Settings size={14} />
                  </button>
                  <button className="p-3 text-[#555] hover:text-[#FFCC00] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors" title="Rollback (Phase 7)">
                    <History size={14} />
                  </button>

                  <button className={`p-3 flex justify-center transition-all ${project.status === 'FAILED' ? 'text-[#050505] bg-[#FFCC00] hover:bg-yellow-400' : 'text-[#555] hover:text-[#FFCC00] hover:bg-[#111]'}`} title="Ask AI (Phase 8)">
                    <BrainCircuit size={14} className={project.status === 'FAILED' ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}