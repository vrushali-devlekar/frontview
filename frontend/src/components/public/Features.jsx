import React from "react";
import { Activity, Server, Zap, Globe, Shield, Cpu } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="bg-[#09090b] text-white font-sans py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      
      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
            Infrastructure Overview
          </h2>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
            A comprehensive look at your global deployment network, worker nodes, and active pipeline statuses. 
            All systems are currently operating within nominal parameters.
          </p>
        </div>

        {/* 60/40 Split Pattern (The Ungrid) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          
          {/* Left (60%): Large Featured Metric */}
          <div className="w-full lg:w-[60%] bg-[#111113] border border-white/[0.06] rounded-xl p-8 shadow-elevation-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Server size={120} />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white">
                    Primary Global Cluster
                  </h3>
                  <span className="text-xs text-[#22c55e] flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                    Operational
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-6xl font-mono font-bold tracking-tight mb-2">
                  99.99<span className="text-2xl text-[#71717a]">%</span>
                </div>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest font-medium">
                  Uptime SLA · Last 30 Days
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest mb-1 font-medium">Compute</p>
                <p className="text-sm font-mono text-white">42 Nodes</p>
              </div>
              <div>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest mb-1 font-medium">Network</p>
                <p className="text-sm font-mono text-white">2.4 Tbps</p>
              </div>
              <div>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest mb-1 font-medium">Latency</p>
                <p className="text-sm font-mono text-white">12ms avg</p>
              </div>
            </div>
          </div>

          {/* Right (40%): Four stacked/grid cards */}
          <div className="w-full lg:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Small Card 1 */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-elevation-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                  <Zap size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-mono font-bold mb-1">1.2M</h4>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest font-medium">Req / Minute</p>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-elevation-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4]">
                  <Globe size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-mono font-bold mb-1">24</h4>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest font-medium">Edge Regions</p>
              </div>
            </div>

            {/* Small Card 3 */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-elevation-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                  <Shield size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-mono font-bold mb-1">0</h4>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest font-medium">Active Threats</p>
              </div>
            </div>

            {/* Small Card 4 */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-5 shadow-elevation-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#71717a]/10 flex items-center justify-center text-[#a1a1aa]">
                  <Cpu size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-mono font-bold mb-1">48%</h4>
                <p className="text-[11px] text-[#71717a] uppercase tracking-widest font-medium">Avg Load</p>
              </div>
            </div>

          </div>
        </div>

        {/* Full-width Table Section */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
          <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wide text-white">Active Deployments</h3>
            <button className="px-4 py-1.5 text-xs font-medium bg-white/[0.04] text-white rounded-md border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#09090b] text-[#71717a] border-b border-white/[0.06]">
                  <th className="py-3 px-6 font-medium text-[11px] tracking-wider uppercase">Project</th>
                  <th className="py-3 px-6 font-medium text-[11px] tracking-wider uppercase">Status</th>
                  <th className="py-3 px-6 font-medium text-[11px] tracking-wider uppercase">Branch</th>
                  <th className="py-3 px-6 font-medium text-[11px] tracking-wider uppercase text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  { name: 'velora-core-api', status: 'Healthy', branch: 'main', latency: '12ms' },
                  { name: 'auth-service-v2', status: 'Healthy', branch: 'main', latency: '18ms' },
                  { name: 'frontend-dashboard', status: 'Deploying', branch: 'feat/ungrid', latency: '-' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6 border-l-2 border-transparent group-hover:border-[#22c55e] transition-colors">
                      <span className="font-mono text-[13px]">{row.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide ${
                        row.status === 'Healthy' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                      }`}>
                        {row.status === 'Healthy' && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>}
                        {row.status === 'Deploying' && <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse"></span>}
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#a1a1aa] text-[13px]">{row.branch}</td>
                    <td className="py-4 px-6 text-right font-mono text-[13px] text-[#a1a1aa]">{row.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
