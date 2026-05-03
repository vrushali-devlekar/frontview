import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, History as HistoryIcon, ArrowUpRight, ArrowDownRight,
  Clock, Plus, GitBranch, Globe, Activity, TrendingUp,
  Shield, Check, Box, Cpu, HardDrive, BarChart3, Search
} from "lucide-react";
import {
  getProjects,
  getDashboardStats,
  deleteProject
} from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { getFrameworkIcon } from "../../utils/frameworkIcons";

/* ── Status dot ── */
const StatusDot = ({ status }) => {
  const colors = { RUNNING: "bg-[#22c55e]", FAILED: "bg-[#ef4444]", BUILDING: "bg-[#eab308]" };
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colors[status] || "bg-[#52525b]"}`} />;
};

/* ── Stat card ── */
const StatCard = ({ label, value, Icon, color }) => (
  <div className="bg-[#1e1e20] border border-white/[0.04] p-6 rounded-[24px] flex flex-col gap-5 shadow-elevation-1 hover:border-white/[0.08] transition-all">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center bg-[#0d0d0f] border border-white/[0.05] shadow-2xl ${color}`}>
        <Icon size={18} />
      </div>
      <ArrowUpRight size={12} className="text-[#3f3f46]" />
    </div>
    <div>
      <p className="text-[20px] font-black text-[#e4e4e7] tracking-tighter leading-none">{value}</p>
      <p className="text-[8px] text-[#52525b] font-black uppercase tracking-[0.2em] mt-2">{label}</p>
    </div>
  </div>
);

/* ── Uptime bar ── */
const UptimeBar = ({ activityData = [] }) => {
  // Use activityData from props, or fallback to zeros if empty
  const data = activityData.length > 0 ? activityData : new Array(30).fill(0);
  const max = Math.max(...data, 1); // Avoid division by zero
  
  return (
    <div className="flex items-end gap-[2px] h-12 w-full">
      {data.map((val, i) => (
        <div
          key={i}
          style={{ height: `${(val / max) * 100}%` }}
          className={`flex-1 rounded-[2px] transition-colors ${val === 0 ? "bg-white/[0.05]" : "bg-[#22c55e]/40 hover:bg-[#22c55e]/70"}`}
          title={`${val} Deployments`}
        />
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalProjects: 0, 
    totalDeployments: 0, 
    successRate: "0%", 
    avgBuildTime: "42s",
    activityBars: [] 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, statsRes] = await Promise.all([getProjects(), getDashboardStats()]);
      setProjects(projRes.data.data || []);
      if (statsRes.data.stats) setStats(statsRes.data.stats);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)] text-white font-sans">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />

      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
            
            {/* Header Area */}
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/[0.04]">
              <div>
                <h1 className="text-[22px] font-black tracking-tighter text-[#e4e4e7] mb-2 uppercase leading-none">Welcome, {user?.name || 'Operator'}</h1>
                <p className="text-[9px] text-[#52525b] font-black uppercase tracking-[0.4em] mt-2">Central Command & Infrastructure Control</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3f3f46] group-focus-within:text-white transition-colors" />
                  <input 
                    type="text" 
                    placeholder="SCAN REGISTRY..."
                    className="h-10 pl-11 pr-6 bg-[#161618] border border-white/[0.04] rounded-xl text-[9px] font-black uppercase tracking-[0.2em] w-72 focus:outline-none focus:border-white/10 transition-all shadow-elevation-1 placeholder:text-[#2d2d33]"
                  />
                </div>
                <GlassButton variant="primary" onClick={() => navigate("/projects/new")} className="h-10 px-6 text-[9px] font-black uppercase tracking-[0.2em] shadow-elevation-2">
                  <Plus size={14} /> INITIALIZE NODE
                </GlassButton>
              </div>
            </div>

            {/* Top Row: Mini Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              <StatCard label="Total Nodes" value={stats.totalProjects} Icon={Box} color="text-white" />
              <StatCard label="Active Clusters" value={stats.totalDeployments} Icon={Rocket} color="text-white" />
              <StatCard label="Operational Stability" value={stats.successRate} Icon={Check} color="text-white" />
              <StatCard label="Sync Latency" value={stats.avgBuildTime} Icon={Clock} color="text-white" />
            </div>

            {/* Middle Section: Projects & Analytics */}
            <div className="grid grid-cols-12 gap-10">
              
              {/* Left: Projects List */}
              <div className="col-span-12 lg:col-span-8 space-y-10">
                <div className="bg-[#1e1e20] border border-white/[0.04] rounded-[32px] overflow-hidden shadow-elevation-2">
                    <div className="px-8 py-6 border-b border-white/[0.04] flex items-center justify-between bg-[#161618]">
                        <h2 className="text-[10px] font-black text-[#52525b] uppercase tracking-[0.3em]">Authority Node Registry</h2>
                        <button onClick={() => navigate("/projects")} className="text-[9px] font-black text-[#a1a1aa] hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-white/5 pb-0.5">FULL_REGISTRY_SYNC</button>
                    </div>
                    <div className="divide-y divide-white/[0.02] bg-[#0d0d0f]/20">
                        {loading ? (
                            [1,2,3].map(i => <div key={i} className="h-28 bg-white/[0.01] animate-pulse m-6 rounded-2xl" />)
                        ) : projects.length === 0 ? (
                            <div className="p-24 text-center text-[#3f3f46] text-[12px] font-black uppercase tracking-[0.3em]">No active nodes detected.</div>
                        ) : (
                            projects.slice(0, 5).map((p) => {
                                const lastDeploy = p.latestDeployment;
                                return (
                                    <div 
                                        key={p._id} 
                                        onClick={() => navigate(`/deploy?projectId=${p._id}`)}
                                        className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.01] cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-[18px] bg-[#0d0d0f] border border-white/[0.04] flex items-center justify-center relative shadow-elevation-1 transition-transform group-hover:scale-105">
                                                {(() => {
                                                    const { Icon: FrameworkIcon } = getFrameworkIcon(p.framework || 'other');
                                                    return <FrameworkIcon size={24} className="text-[#3f3f46] group-hover:text-white transition-colors" />;
                                                })()}
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[2.5px] border-[#1e1e20] shadow-elevation-1 ${lastDeploy?.status === 'running' ? 'bg-[#22c55e]' : 'bg-[#1e1e20] border-white/5'} `} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-black text-[#e4e4e7] mb-1.5 uppercase tracking-tighter group-hover:text-[#22c55e] transition-colors">{p.name}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-2 text-[10px] text-[#52525b] font-black uppercase tracking-widest"><GitBranch size={12} /> {p.branch || 'main'}</span>
                                                    <div className="w-1 h-1 rounded-full bg-[#1e1e20] border border-white/5" />
                                                    <span className="text-[10px] text-[#52525b] font-black uppercase tracking-widest">{p.framework}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[9px] font-black text-[#3f3f46] uppercase tracking-[0.2em] mb-1.5">Cluster Status: {lastDeploy?.status === 'running' ? 'NOMINAL' : 'IDLE'}</p>
                                                <p className={`text-[11px] font-black uppercase tracking-widest ${lastDeploy?.status === 'running' ? 'text-[#22c55e]' : 'text-[#3f3f46]'}`}>{lastDeploy?.status === 'running' ? '99.99% Stability' : 'Offline'}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-[18px] bg-[#0d0d0f] border border-white/[0.04] flex items-center justify-center text-[#3f3f46] group-hover:text-white group-hover:bg-[#1e1e20] transition-all shadow-elevation-1">
                                                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Network Speed / Analytics Chart Placeholder */}
                <div className="bg-[#1e1e20] border border-white/[0.04] p-8 rounded-[32px] shadow-elevation-1">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-[12px] font-black text-[#52525b] uppercase tracking-[0.3em]">Operational Telemetry</h2>
                        <div className="flex bg-[#0d0d0f] p-1 rounded-xl gap-1 border border-white/5">
                            {['Daily', 'Weekly', 'Monthly'].map(t => (
                                <button key={t} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${t === 'Monthly' ? 'bg-[#1e1e20] text-white shadow-elevation-1 border border-white/5' : 'text-[#3f3f46] hover:text-[#52525b]'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-72 relative">
                        {/* Glowy SVG Chart */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
                            <defs>
                                <linearGradient id="greyGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.05" />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,150 C50,140 100,160 150,120 C200,80 250,130 300,100 C350,70 400,140 450,120 C500,100 550,40 600,60 C650,80 700,50 750,70" 
                                  fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.2)]" />
                            <path d="M0,150 C50,140 100,160 150,120 C200,80 250,130 300,100 C350,70 400,140 450,120 C500,100 550,40 600,60 C650,80 700,50 750,70 L750,200 L0,200 Z" 
                                  fill="url(#greyGlow)" />
                        </svg>
                        <div className="absolute inset-0 flex justify-between items-end text-[9px] text-[#1e1e20] font-black uppercase tracking-[0.25em] pb-2 border-b border-white/[0.02]">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                        </div>
                    </div>
                </div>
              </div>

              {/* Right Sidebar: Messages & Uptime */}
              <div className="col-span-12 lg:col-span-4 space-y-10">
                {/* Consultation Card */}
                <div className="bg-[#1e1e20] border border-white/[0.04] p-8 rounded-[32px] shadow-elevation-1">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-[9px] font-black text-[#52525b] uppercase tracking-[0.3em]">Authority Identity</p>
                        <button className="text-[9px] font-black text-[#a1a1aa] hover:text-white transition-colors uppercase tracking-widest">Profile</button>
                    </div>
                    <div className="bg-[#0d0d0f] rounded-2xl p-5 flex items-center gap-5 border border-white/[0.04] shadow-elevation-1">
                        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Velora'}&background=1e1e20&color=fff`} className="w-12 h-12 rounded-xl border border-white/5" />
                        <div className="flex-1">
                            <p className="text-[13px] font-black text-[#e4e4e7] uppercase tracking-tighter leading-tight">{user?.name || 'Operator'}</p>
                            <p className="text-[9px] text-[#52525b] font-black uppercase tracking-[0.2em] mt-1.5">Authority Node</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shadow-elevation-1"><Activity size={16} /></div>
                    </div>
                </div>

                {/* Uptime Monitoring */}
                <div className="bg-[#1e1e20] border border-white/[0.04] p-8 rounded-[32px] shadow-elevation-1">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[9px] font-black text-[#52525b] uppercase tracking-[0.3em]">Real-time Pulse</h3>
                        <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest">{stats.successRate} Nominal</span>
                    </div>
                    <div className="py-4">
                        <UptimeBar activityData={stats.activityBars} />
                    </div>
                    <div className="flex justify-between mt-8">
                        <span className="text-[8px] font-black text-[#3f3f46] uppercase tracking-[0.25em]">30d SEQUENCE</span>
                        <span className="text-[8px] font-black text-[#3f3f46] uppercase tracking-[0.25em]">LIVE_TELEMETRY</span>
                    </div>
                </div>

                {/* Messages Sidebar Mock */}
                <div className="bg-[#1e1e20] border border-white/[0.04] rounded-[32px] overflow-hidden shadow-elevation-1">
                    <div className="px-8 py-6 border-b border-white/[0.04] bg-[#161618]">
                        <h3 className="text-[9px] font-black text-[#52525b] uppercase tracking-[0.3em]">Operational Logs</h3>
                    </div>
                    <div className="p-3 space-y-2 bg-[#0d0d0f]/20">
                        {[
                            { user: "WAF", msg: "Mitigation Sequence Nominal", time: "01m" },
                            { user: "AUTH", msg: "Access Verified: Global", time: "12m" },
                            { user: "NODE", msg: "Cluster Optimization: Alpha", time: "45m" }
                        ].map((m, i) => (
                            <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.01] rounded-[20px] transition-all group">
                                <div className="w-10 h-10 rounded-[14px] bg-[#0d0d0f] flex items-center justify-center text-[#3f3f46] group-hover:text-white font-black text-[9px] border border-white/[0.04] uppercase tracking-widest transition-colors shadow-elevation-1">{m.user}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-black text-[#e4e4e7] uppercase tracking-tighter leading-tight">{m.user}_LOG</p>
                                    <p className="text-[9px] text-[#52525b] font-black uppercase tracking-widest truncate mt-1">{m.msg}</p>
                                </div>
                                <span className="text-[8px] text-[#3f3f46] font-black uppercase tracking-widest whitespace-nowrap">{m.time} AGO</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 bg-[#0d0d0f]">
                        <div className="relative">
                            <input type="text" placeholder="DISPATCH_COMMAND..." className="w-full h-12 bg-[#1e1e20] border border-white/[0.04] rounded-xl pl-5 pr-12 text-[9px] font-black uppercase tracking-[0.25em] text-white focus:outline-none focus:border-white/10 transition-all placeholder:text-[#2d2d33] shadow-inner" />
                            <Rocket size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3f3f46]" />
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
