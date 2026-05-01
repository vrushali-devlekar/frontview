import React, { useState } from 'react';
import Sidebar from "../dashboard/Sidebar.jsx";
import TopNav from "../dashboard/TopNav.jsx";
import { Rocket, RotateCcw, FileText, Settings, Hexagon, Box, Layers, Database } from 'lucide-react';
import heroBg from "../../assets/new-top.png";

export default function DeploymentsPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const chartPath = "M0,80 C100,50 150,10 250,15 C350,20 380,80 450,70 C550,60 580,30 650,40 C750,50 800,90 900,45 L900,120 L0,120 Z";
  
  const recentDeploys = [
    { project: "User Auth Service", icon: Hexagon, iconColor: "text-purple-500", env: "production", envColor: "text-green-500", status: "Success", statusColor: "text-green-500", by: "div641", time: "2m ago", duration: "2m 18s" },
    { project: "Frontend Web", icon: Box, iconColor: "text-blue-500", env: "production", envColor: "text-green-500", status: "Success", statusColor: "text-green-500", by: "div641", time: "15m ago", duration: "1m 45s" },
    { project: "Payment Service", icon: Layers, iconColor: "text-yellow-500", env: "staging", envColor: "text-yellow-500", status: "Failed", statusColor: "text-red-500", by: "div641", time: "1h ago", duration: "-" },
    { project: "Data Ingest Service", icon: Database, iconColor: "text-green-500", env: "development", envColor: "text-blue-500", status: "Success", statusColor: "text-green-500", by: "div641", time: "2h ago", duration: "3m 21s" },
    { project: "Notification Service", icon: Box, iconColor: "text-slate-300", env: "production", envColor: "text-green-500", status: "Success", statusColor: "text-green-500", by: "div641", time: "3h ago", duration: "45s" }
  ];

  const activeApps = [
    { name: "Payments Service", status: "Healthy", dot: "bg-green-500", progress: "80%", pColor: "bg-green-500" },
    { name: "User Auth", status: "Healthy", dot: "bg-green-500", progress: "85%", pColor: "bg-green-500" },
    { name: "Data Ingest", status: "Healthy", dot: "bg-green-500", progress: "90%", pColor: "bg-green-500" },
    { name: "Process Service", status: "Degraded", dot: "bg-yellow-500", progress: "60%", pColor: "bg-yellow-500" },
    { name: "Notification Service", status: "Healthy", dot: "bg-green-500", progress: "70%", pColor: "bg-green-500" }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f14] text-white" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-[72px]" : "ml-[260px]"}`}>
        
        {/* HERO */}
        <div className="relative shrink-0 min-h-[120px] md:min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-white/10" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          <TopNav />
          <div className="relative z-10 px-4 pb-3">
            <h1 className="text-xl md:text-2xl leading-relaxed uppercase" style={{ fontFamily: "'Press Start 2P', cursive" }}>Deployments</h1>
            <p className="text-[7px] md:text-[9px] text-slate-300 mt-2 leading-loose uppercase" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Dashboard Overview
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-2 md:p-3 overflow-y-auto lg:overflow-hidden bg-[#0b0f14]" style={{ scrollbarWidth: 'none' }}>
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 grid-rows-none lg:grid-rows-2 gap-3">
            
            {/* ── TOP ROW ── */}

            {/* Line Chart */}
            <div className="lg:col-span-2 bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col min-h-[250px] lg:min-h-0">
              <div className="flex justify-between items-center mb-6 uppercase shrink-0">
                <h3 className="text-base lg:text-xl font-medium text-slate-200">Deployment Frequency (7 Days)</h3>
                <span className="text-xs text-slate-400">Total Deploys: 142</span>
              </div>
              
              <div className="flex-1 relative min-h-0 border-b border-l border-white/10 ml-6 mb-6">
                <div className="absolute inset-0 flex flex-col justify-between z-0">
                  {[24, 18, 12, 6, 0].map((val) => (
                    <div key={val} className="flex items-center w-full">
                      <span className="text-[10px] text-slate-500 w-6 absolute -left-8 text-right">{val}</span>
                      <div className="flex-1 border-b border-dashed border-white/10" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 z-10 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 900 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={chartPath} fill="url(#chartGrad)" />
                    <path d="M0,80 C100,50 150,10 250,15 C350,20 380,80 450,70 C550,60 580,30 650,40 C750,50 800,90 900,45" fill="none" stroke="#22c55e" strokeWidth="2" />
                  </svg>
                </div>
                <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-slate-400">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="col-span-1 bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col items-center min-h-[250px] lg:min-h-0 relative">
              <h3 className="text-base lg:text-xl font-medium text-slate-200 uppercase w-full text-left shrink-0 mb-4">Deployments by Env</h3>
              <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-6 w-full min-h-0">
                <div className="relative w-24 h-24 xl:w-28 xl:h-28 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.05)] overflow-visible">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="12" strokeDasharray="140.7 110.6" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eab308" strokeWidth="12" strokeDasharray="60.3 191" strokeDashoffset="-140.7" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray="30.1 221.2" strokeDashoffset="-201" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="15 236.3" strokeDashoffset="-231.1" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5 text-[10px] xl:text-xs text-slate-300">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-sm shrink-0"></div> <span className="w-16 xl:w-20">Production</span> <span>56%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-sm shrink-0"></div> <span className="w-16 xl:w-20">Staging</span> <span>24%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-sm shrink-0"></div> <span className="w-16 xl:w-20">Development</span> <span>12%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-sm shrink-0"></div> <span className="w-16 xl:w-20">Preview</span> <span>6%</span></div>
                </div>
              </div>
            </div>

            {/* Gauge */}
            <div className="col-span-1 bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col items-center min-h-[200px] lg:min-h-0 relative">
              <h3 className="text-base lg:text-xl font-medium text-slate-200 uppercase w-full text-left shrink-0 mb-4">System Health</h3>
              <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                <svg viewBox="0 0 100 50" className="w-full max-w-[160px] overflow-visible drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - 0.98)} />
                </svg>
                <div className="absolute bottom-0 flex flex-col items-center translate-y-1/4">
                  <span className="text-3xl font-bold text-slate-200">98%</span>
                  <span className="text-[10px] text-green-500 uppercase mt-1 tracking-widest">Optimal</span>
                </div>
              </div>
            </div>


            {/* ── BOTTOM ROW ── */}

            {/* Recent Deployments Table */}
            <div className="lg:col-span-2 bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col min-h-[300px] lg:min-h-0">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-base lg:text-xl font-medium text-slate-200 uppercase">Recent Deployments</h3>
                <span className="text-xs text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">View all deployments &rarr;</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="text-slate-500 border-b border-white/5 sticky top-0 bg-[#11151c] z-10">
                    <tr>
                      <th className="font-normal pb-2 pr-4">Project</th>
                      <th className="font-normal pb-2 pr-4">Environment</th>
                      <th className="font-normal pb-2 pr-4">Status</th>
                      <th className="font-normal pb-2 pr-4">Deployed By</th>
                      <th className="font-normal pb-2 pr-4">Time</th>
                      <th className="font-normal pb-2 pr-4">Duration</th>
                      <th className="font-normal pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeploys.map((dep, i) => {
                      const Icon = dep.icon;
                      return (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <Icon size={12} className={dep.iconColor} />
                              <span className="text-slate-200">{dep.project}</span>
                            </div>
                          </td>
                          <td className="pr-4"><span className={`text-[10px] px-1.5 py-0.5 rounded border border-current/20 bg-current/10 ${dep.envColor}`}>{dep.env}</span></td>
                          <td className="pr-4"><span className={dep.statusColor}>{dep.status}</span></td>
                          <td className="pr-4">
                            <div className="flex items-center gap-1.5">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dep.by}&backgroundColor=transparent`} alt="avatar" className="w-5 h-5 rounded-full bg-white/10" />
                              <span className="text-slate-300">{dep.by}</span>
                            </div>
                          </td>
                          <td className="text-slate-400 pr-4">{dep.time}</td>
                          <td className="text-slate-400 pr-4">{dep.duration}</td>
                          <td className="text-right text-slate-500 group-hover:text-slate-300 cursor-pointer">&gt;</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Applications */}
            <div className="col-span-1 bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col min-h-[250px] lg:min-h-0">
              <h3 className="text-base lg:text-xl font-medium text-slate-200 uppercase mb-4 shrink-0">Active Applications</h3>
              <div className="flex-1 flex flex-col justify-start gap-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {activeApps.map((app, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${app.dot}`} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-slate-200 truncate">{app.name}</span>
                        <span className={`text-[10px] ${app.status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}`}>{app.status}</span>
                      </div>
                    </div>
                    <div className="w-16 xl:w-20 h-1.5 bg-[#1e293b] flex rounded-full overflow-hidden shrink-0 mt-1">
                      <div className={`h-full ${app.pColor} rounded-full`} style={{ width: app.progress }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-1 bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col min-h-[250px] lg:min-h-0">
              <h3 className="text-base lg:text-xl font-medium text-slate-200 uppercase mb-4 shrink-0">Quick Actions</h3>
              <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
                <button className="flex flex-col items-center justify-center gap-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-300 min-h-0 py-3">
                  <Rocket size={20} className="text-slate-400" />
                  <span className="uppercase text-[9px] xl:text-[10px] tracking-widest mt-1">New Deploy</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-300 min-h-0 py-3">
                  <RotateCcw size={20} className="text-slate-400" />
                  <span className="uppercase text-[9px] xl:text-[10px] tracking-widest mt-1">Rollback</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-300 min-h-0 py-3">
                  <FileText size={20} className="text-slate-400" />
                  <span className="uppercase text-[9px] xl:text-[10px] tracking-widest mt-1">View Logs</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-300 min-h-0 py-3">
                  <Settings size={20} className="text-slate-400" />
                  <span className="uppercase text-[9px] xl:text-[10px] tracking-widest mt-1">Settings</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}