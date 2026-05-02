import { useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import {
  Calendar as CalendarIcon,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Shield,
  Layers,
  Database,
  Globe,
  Box,
  Cpu
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import CyberButton from "../../components/ui/CyberButton";

const Sparkline = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-8 preserve-aspect-ratio-none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="4"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default function Metrics() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const stats = [
    {
      title: "DEPLOYMENTS",
      value: "28",
      change: "+12%",
      isPositive: true,
      icon: Rocket,
      iconColor: "text-[#00FFCC]",
      sparklineData: [2, 4, 3, 5, 4, 7, 6],
      sparklineColor: "#00FFCC"
    },
    {
      title: "SUCCESS_RATE",
      value: "96.4%",
      change: "+3.2%",
      isPositive: true,
      icon: ShieldCheck,
      iconColor: "text-[#00FFCC]",
      sparklineData: [90, 92, 91, 95, 94, 96, 97],
      sparklineColor: "#00FFCC"
    },
    {
      title: "AVG_DEPLOY_TIME",
      value: "2m 34s",
      change: "-10s",
      isPositive: false,
      icon: Clock,
      iconColor: "text-[#FFCC00]",
      sparklineData: [3.5, 3.2, 3.0, 2.8, 2.9, 2.5, 2.4],
      sparklineColor: "#FFCC00"
    },
    {
      title: "FAILED_DEPLOYS",
      value: "2",
      change: "-33%",
      isPositive: false,
      icon: AlertCircle,
      iconColor: "text-[#FF3333]",
      sparklineData: [4, 3, 5, 2, 3, 1, 2],
      sparklineColor: "#FF3333"
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-mono uppercase tracking-wide">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        
        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4">
            <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest font-pixel">FLEET_METRICS</h1>
            <p className="text-[10px] text-[#888] mt-1 tracking-widest">REAL-TIME INFRASTRUCTURE PERFORMANCE MONITORING</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((item, i) => (
                <div key={i} className="bg-[#0a0a0a] border-2 border-[#222] p-4 flex flex-col justify-between hover:border-[#444] transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <item.icon size={14} className={item.iconColor} />
                        <span className="text-[9px] text-[#666] tracking-widest">{item.title}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-2xl font-pixel text-white mb-1">{item.value}</div>
                            <div className={`text-[9px] flex items-center gap-1 ${item.isPositive ? 'text-[#00FFCC]' : 'text-[#FF3333]'}`}>
                                {item.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {item.change}
                            </div>
                        </div>
                        <Sparkline data={item.sparklineData} color={item.sparklineColor} />
                    </div>
                </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* FREQUENCY HEATMAP */}
              <div className="lg:col-span-2 bg-[#0a0a0a] border-2 border-[#222] p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-[11px] font-pixel text-white">DEPLOYMENT_FREQUENCY</h2>
                      <div className="flex items-center gap-2 text-[8px] text-[#444]">
                          LESS <div className="flex gap-1"><div className="w-2 h-2 bg-[#111]" /><div className="w-2 h-2 bg-[#00FFCC]/20" /><div className="w-2 h-2 bg-[#00FFCC]/50" /><div className="w-2 h-2 bg-[#00FFCC]" /></div> MORE
                      </div>
                  </div>
                  <div className="h-32 flex items-center justify-center border border-[#111] bg-[#050505]">
                      <span className="text-[9px] text-[#444] font-pixel animate-pulse">GENERATING_HEATMAP_DATA...</span>
                  </div>
              </div>

              {/* RESOURCE USAGE */}
              <div className="bg-[#0a0a0a] border-2 border-[#222] p-6">
                  <h2 className="text-[11px] font-pixel text-white mb-6">RESOURCE_ALLOCATION</h2>
                  <div className="space-y-6">
                      {[
                          { label: 'CPU_CORE', val: '42%', color: 'bg-[#FFCC00]' },
                          { label: 'MEMORY_USAGE', val: '68%', color: 'bg-[#00FFCC]' },
                          { label: 'NETWORK_IO', val: '15%', color: 'bg-white' },
                      ].map((bar, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-[9px] mb-2">
                                  <span className="text-[#666]">{bar.label}</span>
                                  <span className="text-white">{bar.value}</span>
                              </div>
                              <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                                  <div className={`h-full ${bar.color}`} style={{ width: bar.val }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

          </div>

          {/* RECENT ACTIVITY TABLE */}
          <div className="mt-6 bg-[#0a0a0a] border-2 border-[#222]">
                <div className="p-4 border-b border-[#222] flex justify-between items-center">
                    <h2 className="text-[11px] font-pixel text-white">RECENT_ANALYTICS_EVENT</h2>
                    <CyberButton variant="outline" className="text-[8px] py-1 px-3">EXPORT_CSV</CyberButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[9px]">
                        <thead>
                            <tr className="bg-[#111] text-[#666] tracking-widest uppercase">
                                <th className="p-4 font-bold">PROJECT_ID</th>
                                <th className="p-4 font-bold">EVENT_TYPE</th>
                                <th className="p-4 font-bold">TIMESTAMP</th>
                                <th className="p-4 font-bold">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'AUTH_SERVICE', type: 'BUILD_SUCCESS', time: '14:22:01', status: 'COMPLETED' },
                                { id: 'PAYMENT_GW', type: 'RUNTIME_ERROR', time: '13:45:12', status: 'FAILED' },
                                { id: 'WEB_DASHBOARD', type: 'CONFIG_SYNC', time: '12:10:55', status: 'COMPLETED' },
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-[#111] hover:bg-[#050505]">
                                    <td className="p-4 text-white font-bold">{row.id}</td>
                                    <td className="p-4 text-[#888]">{row.type}</td>
                                    <td className="p-4 text-[#666]">{row.time}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 border ${row.status === 'FAILED' ? 'text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10' : 'text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </div>

        </div>
      </div>
    </div>
  );
}
