// deployment history , kab kab git se new code push hua hai and kab kab server restart hua haii
// status - success fail pending
// deployment time
// main logs like rps(request per second) , concurrency(visit of active user) para(1day,1hr,1m,1w)
import React from "react";

const Deployment = () => {
  const logs = [
    { id: 1, event: "New code pushed to main", status: "success", time: "10 mins ago", commit: "7a2b9c1", rps: 124 },
    { id: 2, event: "Server Auto-Restart", status: "success", time: "1 hour ago", commit: "-", rps: 0 },
    { id: 3, event: "Fix: Auth middleware bug", status: "failed", time: "3 hours ago", commit: "bc812d4", rps: 82 },
    { id: 4, event: "Production Build v1.0", status: "success", time: "1 day ago", commit: "01f3e9a", rps: 110 },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0f11] border border-white/10 p-6 rounded-sm">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Requests / Sec</p>
          <p className="text-3xl font-bold text-[#f1e05a]">124 <span className="text-[10px] text-green-500">▲ 12%</span></p>
        </div>
        <div className="bg-[#0d0f11] border border-white/10 p-6 rounded-sm">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Active Concurrency</p>
          <p className="text-3xl font-bold text-white">842 <span className="text-[10px] text-gray-600 italic">LIVE</span></p>
        </div>
        <div className="bg-[#39ff14]/5 border border-[#39ff14]/20 p-6 rounded-sm">
          <p className="text-[9px] text-[#39ff14] uppercase font-bold mb-2 tracking-widest">Server Status</p>
          <p className="text-xs text-[#39ff14]/80 uppercase">All Nodes Operational • 14ms Latency</p>
        </div>
      </div>

      {/* Deployment History Feed */}
      <div className="bg-[#0d0f11] border border-white/10 rounded-sm">
        <div className="p-4 border-b border-white/5 bg-[#161b22]/30 flex justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest">Deployment Activity</h3>
          <span className="text-[9px] text-gray-600 font-mono">Filter: Last 24 Hours</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {logs.map((log) => (
            <div key={log.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 border flex items-center justify-center bg-black ${log.status === 'success' ? 'border-[#39ff14]/20 text-[#39ff14]' : 'border-red-500/20 text-red-500'}`}>
                   {log.event.includes('Restart') ? '🔄' : ''}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase group-hover:text-[#f1e05a] transition-colors">{log.event}</h4>
                  <p className="text-[9px] text-gray-600 uppercase mt-1">Commit: {log.commit} • {log.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Avg RPS: {log.rps}</p>
                </div>
                <div className={`px-4 py-1 text-[9px] font-bold uppercase border-b-2 ${
                  log.status === 'success' ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#1a7a0a]' : 'bg-red-500/10 text-red-500 border-red-900'
                }`}>
                  {log.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Mockup */}
      <div className="bg-black border border-white/10 p-4 rounded-sm font-mono text-[10px] text-gray-500 h-32 overflow-y-auto">
        <p className="text-blue-400">[INFO] Optimizing production build...</p>
        <p>[LOG] Minifying CSS bundles (14kb saved)</p>
        <p className="text-[#39ff14]">[SUCCESS] Build verified in 4.2s</p>
        <p>[INFO] Propagating to edge network...</p>
        <p className="animate-pulse">_</p>
      </div>
    </div>
  );
};

export default Deployment;