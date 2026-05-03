import React, { useState } from 'react';
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import { Terminal, RefreshCw, Filter, Search, Download } from 'lucide-react';
import heroBg from "../../assets/new-top.png";

export default function Logs() {
  // Default data "no logs for now" for development stage
  const [logs, setLogs] = useState([]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden w-full max-w-[1600px] mx-auto pb-24">
        
        {/* HERO */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-4 md:px-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-16 md:mt-0">
            <div>
              <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest flex items-center gap-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                <Terminal size={24} /> LOGS
              </h1>
              <p className="text-[10px] text-[#888] mt-2">
                SYSTEM OUTPUT AND DEPLOYMENT LOGS
              </p>
            </div>
            <button className="w-full md:w-auto bg-[#FFCC00] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-2" style={{ fontFamily: "'Press Start 2P', cursive", boxShadow: "4px 4px 0px 0px #CC9900" }}>
              <RefreshCw size={14} strokeWidth={3} /> REFRESH
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto bg-[#050505]" style={{ scrollbarWidth: 'none' }}>
          
          {/* TOOLBAR */}
          <div className="shrink-0 flex flex-col md:flex-row justify-between md:items-center bg-[#0a0a0a] border-2 border-[#222] p-4 gap-4 mb-6" style={{ boxShadow: "4px 4px 0px 0px rgba(255, 204, 0, 0.1)" }}>
            <div className="w-full md:flex-1 relative md:max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input 
                type="text" 
                placeholder="SEARCH LOGS..." 
                className="w-full bg-[#050505] border-2 border-[#222] pl-9 pr-3 py-2 text-[10px] text-white outline-none focus:border-[#FFCC00] transition-colors font-bold"
              />
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#050505] border-2 border-[#222] text-[10px] text-[#AAA] hover:border-[#00FFCC] hover:text-[#00FFCC] transition-colors font-bold whitespace-nowrap">
                <Filter size={12} /> FILTER
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#050505] border-2 border-[#222] text-[10px] text-[#AAA] hover:border-[#FFCC00] hover:text-[#FFCC00] transition-colors font-bold whitespace-nowrap">
                <Download size={12} /> EXPORT
              </button>
            </div>
          </div>

          {/* LOGS BLOCK */}
          <div className="bg-[#0a0a0a] border-2 border-[#222] flex flex-col flex-1" style={{ boxShadow: "4px 4px 0px 0px rgba(255, 204, 0, 0.1)" }}>
            <div className="flex items-center justify-between p-4 border-b-2 border-[#222] bg-[#050505]">
              <h3 className="text-[10px] font-bold text-[#FFCC00] tracking-widest" style={{ fontFamily: "'Press Start 2P', cursive", lineHeight: '1.5' }}>LIVE_STREAM</h3>
              <div className="flex items-center gap-2 text-[10px] text-[#888] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span>
                POLLING...
              </div>
            </div>

            <div className="flex-1 overflow-x-auto p-4 pt-0" style={{ scrollbarWidth: 'none' }}>
              <table className="w-full text-left text-[10px] font-bold border-separate" style={{ borderSpacing: '0 8px' }}>
                <thead className="text-[#555]">
                  <tr>
                    <th className="pb-4 pl-4 w-24 md:w-32 border-b-2 border-[#222] whitespace-nowrap">TIME</th>
                    <th className="pb-4 w-20 md:w-24 border-b-2 border-[#222] whitespace-nowrap">STATUS</th>
                    <th className="pb-4 w-24 md:w-32 border-b-2 border-[#222] whitespace-nowrap">HOST</th>
                    <th className="pb-4 w-32 md:w-48 border-b-2 border-[#222] whitespace-nowrap">REQUEST</th>
                    <th className="pb-4 pr-4 border-b-2 border-[#222]">MESSAGE</th>
                  </tr>
                </thead>
                <tbody className="mt-4">
                  {logs.length > 0 ? (
                    logs.map((log, i) => (
                      <tr key={i} className="hover:bg-[#111] transition-colors font-mono">
                        <td className="py-4 pl-4 text-[#888] border-b border-[#111] whitespace-nowrap">{log.time}</td>
                        <td className="py-4 border-b border-[#111] whitespace-nowrap">
                          <span className={`px-2 py-1 border text-[9px] tracking-widest ${
                            log.status >= 500 ? 'text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10' :
                            log.status >= 400 ? 'text-[#FFCC00] border-[#FFCC00]/30 bg-[#FFCC00]/10' :
                            'text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-4 text-[#AAA] border-b border-[#111] whitespace-nowrap">{log.host}</td>
                        <td className="py-4 text-[#00FFCC] border-b border-[#111] whitespace-nowrap">{log.request}</td>
                        <td className="py-4 pr-4 text-[#CCC] break-all border-b border-[#111] min-w-[200px]">{log.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 text-[#555]">
                          <Terminal size={32} className="text-[#333]" />
                          <p className="text-[10px] tracking-widest font-bold" style={{ fontFamily: "'Press Start 2P', cursive" }}>NO LOGS FOR NOW</p>
                          <p className="text-[9px]">AWAITING DEPLOYMENT DATA...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}