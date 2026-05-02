import React, { useState } from 'react';
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import { 
  Terminal, ShieldCheck, Mail, Globe, Clock, 
  Activity, Users, Edit3, Key, Cpu, Copy
} from "lucide-react";

const Github = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import CyberButton from "../../components/ui/CyberButton";

// Image Assets
import coverImg from "../../assets/bghero.png";
import mainAvatar from "../../assets/pf1.jpeg";
import valoraBadge from "../../assets/veloraimg.png";
import shieldIcon from "../../assets/shieldImg.png";
import logoImg from "../../assets/logo.png";
import team1 from "../../assets/pf2.jpeg";
import team2 from "../../assets/pf3.jpeg";
import team3 from "../../assets/pf4.jpeg";
import team4 from "../../assets/pf5.jpeg";

export default function Account() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const teamMembers = [
    { name: "ALEX_M", role: "SR_DEV", img: team1, status: "online" },
    { name: "SAM_K", role: "SYS_ADMIN", img: team2, status: "offline" },
    { name: "JORDAN_L", role: "QA_LEAD", img: team3, status: "online" },
    { name: "TAYLOR_R", role: "DATA_ENG", img: team4, status: "busy" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-valora-bg text-white font-sans select-none">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        
        {/* TOP NAV OVERLAY (absolute for transparency over banner) */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <TopNav />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          
          {/* 1. COVER BANNER */}
          <div className="relative h-[250px] md:h-[300px] shrink-0">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${coverImg})` }}
            />
            {/* Dark gradient to blend into background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay" />
            
            {/* Page Title overlay */}
            <div className="absolute top-[80px] left-6 md:left-12">
              <h1 className="text-2xl md:text-4xl text-valora-cyan font-pixel uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,255,204,0.5)]">
                OPERATOR_PROFILE
              </h1>
              <p className="text-[10px] md:text-xs text-[#aaa] mt-2 tracking-widest font-mono uppercase">
                IDENTITY & ACCESS MANAGEMENT DASHBOARD
              </p>
            </div>
          </div>

          <div className="px-6 md:px-12 pb-12 -mt-[60px] relative z-10 max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* 2. USER IDENTITY CARD (Hologram Profile) */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border-2 border-[#222] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row gap-8 items-center md:items-start group hover:border-[#333] transition-colors">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-valora-yellow transition-all duration-300 group-hover:w-8 group-hover:h-8" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-valora-cyan transition-all duration-300 group-hover:w-8 group-hover:h-8" />

              {/* Avatar Hexagon Wrapper */}
              <div className="relative shrink-0 w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0">
                {/* Outer rotating ring */}
                <div className="absolute inset-[-10px] border border-valora-cyan/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-[-10px] border border-t-valora-yellow border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_4s_linear_infinite]" />
                
                {/* The Image */}
                <div className="w-full h-full border-2 border-valora-cyan overflow-hidden bg-[#111] relative z-10 clip-hex">
                  <img src={mainAvatar} alt="Operator" className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                </div>
                
                {/* Active Dot */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-valora-cyan border-2 border-[#050505] rounded-full z-20 shadow-[0_0_10px_#00FFCC]" />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between w-full">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-pixel text-white uppercase tracking-wider mb-2">SHERYIANS_SDE</h2>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-mono text-[#888] tracking-widest">
                      <span className="flex items-center gap-1"><Terminal size={12} className="text-valora-yellow" /> LEVEL 9 OPERATOR</span>
                      <span>|</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> JOINED 2024</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center mt-4 md:mt-0">
                    <CyberButton variant="neutral" className="px-4 py-2">
                      <Edit3 size={14} className="mr-2" /> EDIT_PROFILE
                    </CyberButton>
                    <CyberButton variant="primary" className="px-4 py-2">
                      <Globe size={14} className="mr-2" /> PUBLIC_VIEW
                    </CyberButton>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#222] grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {[
                    { label: "TOTAL_BUILDS", val: "1,204", icon: Activity, color: "text-valora-cyan" },
                    { label: "ENV_VAULTS", val: "14", icon: Key, color: "text-valora-yellow" },
                    { label: "ACTIVE_NODES", val: "8", icon: Cpu, color: "text-white" },
                    { label: "SUDO_ACCESS", val: "GRANTED", icon: ShieldCheck, color: "text-green-400" },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1 p-3 bg-[#050505] border border-[#111] hover:border-[#333] transition-colors">
                      <div className="flex items-center gap-2 text-[9px] text-[#666] font-mono tracking-widest uppercase">
                        <stat.icon size={10} className={stat.color} /> {stat.label}
                      </div>
                      <div className={`text-lg font-pixel ${stat.color} tracking-wider`}>{stat.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. LOWER GRID: SECURITY & NETWORK */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Security Vault (Spans 2 cols) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Security Header Card */}
                <div className="bg-[#0a0a0a] border-2 border-[#222] p-6 relative overflow-hidden group">
                  {/* Background Shield Watermark */}
                  <img src={shieldIcon} alt="" className="absolute -right-10 -top-10 w-48 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none mix-blend-screen grayscale" />
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-valora-yellow/10 border border-valora-yellow text-valora-yellow">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-pixel text-valora-yellow uppercase tracking-widest">ACCESS_&_SECURITY</h3>
                      <p className="text-[9px] font-mono text-[#666] tracking-widest mt-1">MANAGE OAUTH CONNECTIONS AND 2FA</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {/* GitHub Connection */}
                    <div className="p-4 border border-[#222] bg-[#050505] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-sm">
                          <Github size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] font-mono text-white tracking-widest uppercase">GITHUB_LINKED</p>
                          <p className="text-[9px] font-mono text-[#666]">@sheryian_sde</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold font-mono text-valora-cyan border border-valora-cyan/30 bg-valora-cyan/10 px-2 py-1 tracking-widest">SYNCED</span>
                    </div>

                    {/* Email Connection */}
                    <div className="p-4 border border-[#222] bg-[#050505] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#ea4335] text-white flex items-center justify-center rounded-sm">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] font-mono text-white tracking-widest uppercase">EMAIL_VERIFIED</p>
                          <p className="text-[9px] font-mono text-[#666]">sysadmin@valora.io</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold font-mono text-valora-cyan border border-valora-cyan/30 bg-valora-cyan/10 px-2 py-1 tracking-widest">VERIFIED</span>
                    </div>
                  </div>

                  {/* API Keys Mock */}
                  <div className="mt-6 border border-[#222] bg-[#050505] p-4 font-mono text-[10px] tracking-widest">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#888] uppercase">PERSONAL_ACCESS_TOKEN</span>
                      <button className="text-valora-cyan hover:text-white flex items-center gap-1 transition-colors"><Plus size={12}/> GENERATE</button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#111] border border-[#333]">
                      <span className="text-[#555]">vlt_************************************</span>
                      <button className="text-[#666] hover:text-white"><Copy size={12} /></button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Organization/Network */}
              <div className="flex flex-col gap-6">
                
                {/* Org Badge / License Card */}
                <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-2 border-valora-cyan p-6 relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute top-0 w-full h-1 bg-valora-cyan shadow-[0_0_15px_#00FFCC]" />
                  <img src={logoImg} alt="Logo" className="h-12 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  <h3 className="text-xl font-pixel text-white mb-1 uppercase tracking-widest">VELORA_CORP</h3>
                  <p className="text-[9px] font-mono text-valora-cyan tracking-widest uppercase border border-valora-cyan/30 px-2 py-0.5 rounded-full mb-4">ENTERPRISE_LICENSE</p>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent my-2" />
                  
                  <img src={valoraBadge} alt="Badge" className="h-20 mt-4 opacity-80 mix-blend-screen" />
                </div>

                {/* Team Network */}
                <div className="bg-[#0a0a0a] border-2 border-[#222] p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Users size={16} className="text-[#888]" />
                    <h3 className="text-[12px] font-pixel text-white uppercase tracking-widest">NETWORK_NODES</h3>
                  </div>

                  <div className="flex flex-col gap-4 font-mono">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={member.img} alt={member.name} className="w-8 h-8 object-cover border border-[#444] grayscale group-hover:grayscale-0 transition-all duration-300" />
                            <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-[#0a0a0a] ${
                              member.status === 'online' ? 'bg-valora-cyan' : 
                              member.status === 'busy' ? 'bg-valora-yellow' : 'bg-[#555]'
                            }`} />
                          </div>
                          <div>
                            <p className="text-[11px] text-[#ccc] group-hover:text-white transition-colors tracking-widest">{member.name}</p>
                            <p className="text-[9px] text-[#666] tracking-widest">{member.role}</p>
                          </div>
                        </div>
                        <div className="w-6 h-px bg-[#333] group-hover:bg-valora-cyan transition-colors" />
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-6 py-2 border border-[#333] text-[9px] font-mono text-[#888] hover:text-white hover:border-[#666] uppercase tracking-widest transition-colors">
                    VIEW_ALL_NODES
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .clip-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}
