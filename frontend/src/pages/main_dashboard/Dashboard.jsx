<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
=======
import { useState } from "react";
>>>>>>> 1b78a6f (fix: restore frontend changes)
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
<<<<<<< HEAD
import GlassButton from "../../components/ui/GlassButton";
import { motion } from "framer-motion";
import {
  Rocket, Folder, Terminal, BrainCircuit, History,
  Settings, ArrowUpRight, ArrowDownRight,
  Clock, Plus, GitBranch, Globe, Activity, TrendingUp,
  Shield, MoreHorizontal
} from "lucide-react";
import {
  getProjects,
  getDashboardStats
} from "../../api/api";
=======
import {
  Rocket,
  Folder,
  Terminal,
  ExternalLink,
  Cpu,
  BrainCircuit,
  History,
  Settings,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
>>>>>>> 1b78a6f (fix: restore frontend changes)

import heroBg from "../../assets/new-top.png";

<<<<<<< HEAD
/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    RUNNING: { cls: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20", label: "Running" },
    FAILED: { cls: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20", label: "Failed" },
    BUILDING: { cls: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20", label: "Building" },
    SUCCESS: { cls: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20", label: "Ready" },
  };
  const cfg = map[status] || { cls: "bg-white/5 text-[#71717a] border-white/10", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${cfg.cls}`}>
      <StatusDot status={status} />
      {cfg.label}
    </span>
  );
};

/* ── Micro sparkline ── */
const Spark = ({ data, color = "#22c55e" }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const W = 56, H = 24;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`
  ).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

/* ── Uptime bar ── */
const UptimeBar = () => {
  const data = [60, 70, 65, 80, 75, 90, 85, 95, 88, 92, 78, 82, 90, 95, 88, 92, 85, 90, 95, 88, 92, 85, 90, 95, 88, 92, 85, 90, 95, 100];
  return (
    <div className="flex items-end gap-[2px] h-10 w-full">
      {data.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className={`flex-1 rounded-[2px] transition-colors ${i === 6 ? "bg-[#ef4444]/60" : "bg-[#22c55e]/40 hover:bg-[#22c55e]/70"}`}
        />
      ))}
    </div>
=======
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
>>>>>>> 1b78a6f (fix: restore frontend changes)
  );
};

/* ── Bento card wrapper ── */
const BentoCard = ({ children, className = "", onClick, hover = true }) => (
  <div
    onClick={onClick}
    className={`
      bg-[#111113] border border-white/[0.07] rounded-2xl overflow-hidden
      ${hover ? "hover:border-white/[0.13] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] cursor-pointer" : ""}
      transition-all duration-200
      ${className}
    `}
  >
    {children}
  </div>
);

/* ── Stat card ── */
const StatCard = ({ label, value, delta, isPositive, Icon, iconColor, sparkData, sparkColor }) => (
  <BentoCard hover={false} className="p-7 flex flex-col justify-between gap-6">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <Spark data={sparkData} color={sparkColor} />
    </div>
    <div>
      <p className="text-[30px] font-bold text-white tracking-tight leading-none">{value}</p>
      <div className="flex items-center justify-between mt-3">
        <p className="text-[12px] text-[#71717a] font-medium">{label}</p>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${isPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {delta}
        </span>
      </div>
    </div>
  </BentoCard>
);

/* ═══════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════ */
export default function Dashboard() {
<<<<<<< HEAD
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStats, setDbStats] = useState({
    totalProjects: "0",
    totalDeployments: "0",
    successRate: "0%",
    avgBuildTime: "0s"
  });

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const [projRes, statsRes] = await Promise.all([
          getProjects(),
          getDashboardStats()
        ]);
        if (dead) return;
        setProjects(
          (projRes.data?.data || []).map((p) => ({
            id: p._id, name: p.name, status: "RUNNING",
            branch: p.branch || "main", createdAt: p.createdAt,
          }))
        );
        if (statsRes.data?.stats) {
          setDbStats(statsRes.data.stats);
        }
      } catch { if (!dead) setProjects([]); }
      finally { if (!dead) setLoading(false); }
    })();
    return () => { dead = true; };
  }, []);

  const stats = [
    { label: "Total Projects", value: dbStats.totalProjects, delta: "+1", isPositive: true, Icon: Folder, iconColor: "bg-[#22c55e]/10 text-[#22c55e]", sparkData: [5, 7, 6, 9, 8, 10, 11, parseInt(dbStats.totalProjects) || 0], sparkColor: "#22c55e" },
    { label: "Deployments", value: dbStats.totalDeployments, delta: "+2", isPositive: true, Icon: Rocket, iconColor: "bg-[#3b82f6]/10 text-[#3b82f6]", sparkData: [180, 195, 210, 205, 220, 235, 240, parseInt(dbStats.totalDeployments) || 0], sparkColor: "#3b82f6" },
    { label: "Success Rate", value: dbStats.successRate, delta: "+0.1%", isPositive: true, Icon: Shield, iconColor: "bg-[#a855f7]/10 text-[#a855f7]", sparkData: [97, 98, 97.5, 98.5, 98.8, 99, 98.9, 99.1], sparkColor: "#a855f7" },
    { label: "Avg Build", value: dbStats.avgBuildTime, delta: "-2s", isPositive: true, Icon: Clock, iconColor: "bg-[#eab308]/10 text-[#eab308]", sparkData: [38, 40, 39, 41, 43, 42, 44, 42], sparkColor: "#eab308" },
  ];

  const recentDeploys = [
    { name: "auth-service", status: "RUNNING", branch: "main", time: "3m", commit: "a3f2c81" },
    { name: "frontend-app", status: "RUNNING", branch: "main", time: "15m", commit: "b8e19d2" },
    { name: "payments-api", status: "FAILED", branch: "fix/stripe", time: "1h", commit: "c1d43e0" },
    { name: "data-pipeline", status: "BUILDING", branch: "dev", time: "2h", commit: "f92a117" },
    { name: "notification-svc", status: "RUNNING", branch: "main", time: "3h", commit: "7ba22f4" },
  ];

  const activityBars = dbStats.activityBars || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-sans">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
=======
  const [isCollapsed, setIsCollapsed] = useState(true);

  const myProjects = [{ id: 1, name: "Demo", url: "app.example.com" }];

  const stats = [
    { title: "Projects", value: "12", icon: Folder },
    { title: "Deploys", value: "28", icon: Rocket },
    { title: "Failures", value: "2", icon: AlertCircle },
    { title: "Uptime", value: "99.98%", icon: ShieldCheck },
  ];

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0b0f14] text-white"
      style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}
    >
>>>>>>> 1b78a6f (fix: restore frontend changes)

      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

<<<<<<< HEAD
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="p-8 max-w-[1400px] mx-auto">

            {/* ══ PAGE HEADER ══ */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/[0.06]">
              <div>
                <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight">Overview</h1>
                <p className="text-[13px] text-[#52525b] mt-1.5">Good morning — here's what's happening.</p>
              </div>
              <div className="flex items-center gap-3">
                <GlassButton variant="secondary" onClick={() => navigate("/projects/new")}>
                  <Plus size={14} /> New Project
                </GlassButton>
                <GlassButton variant="primary" onClick={() => navigate("/deploy")}>
                  <Rocket size={14} /> Deploy
                </GlassButton>
              </div>
            </div>

            {/* ══ BENTO GRID ══ */}
            <div className="grid grid-cols-12 gap-5">

              {/* ─── Row 1: 4 stat cards ─── */}
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="col-span-12 sm:col-span-6 lg:col-span-3"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                >
                  <StatCard {...s} />
                </motion.div>
              ))}

              {/* ─── Row 2 left: Recent Deployments ─── */}
              <motion.div
                className="col-span-12 lg:col-span-7"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.28 }}
              >
                <BentoCard hover={false} className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <Activity size={13} className="text-[#52525b]" />
                      </div>
                      <p className="text-[14px] font-semibold text-white">Recent Deployments</p>
                    </div>
                    <button
                      onClick={() => navigate("/deploy")}
                      className="text-[12px] text-[#52525b] hover:text-white transition-colors font-medium"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="flex flex-col divide-y divide-white/[0.04] flex-1">
                    {recentDeploys.map((d, i) => (
                      <div
                        key={i}
                        onClick={() => navigate("/deploy")}
                        className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.025] cursor-pointer transition-colors group"
                      >
                        <StatusDot status={d.status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-white truncate group-hover:text-[#e4e4e7] transition-colors">
                            {d.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <GitBranch size={10} className="text-[#3f3f46] shrink-0" />
                            <span className="text-[11px] text-[#3f3f46] font-mono truncate">
                              {d.branch} · {d.commit}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={d.status} />
                        <span className="text-[11px] text-[#3f3f46] w-8 text-right shrink-0 tabular-nums">
                          {d.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </BentoCard>
              </motion.div>

              {/* ─── Row 2 right: stacked small cards ─── */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.32 }}
                >
                  <BentoCard hover={false} className="px-6 py-6">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[14px] font-semibold text-white">System Uptime</p>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        <span className="text-[13px] font-bold text-[#22c55e]">99.97%</span>
                      </div>
                    </div>
                    <UptimeBar />
                    <div className="flex justify-between text-[10.5px] text-[#2d2d33] mt-3 font-mono select-none">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </BentoCard>
                </motion.div>

                <div className="grid grid-cols-2 gap-5 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.36 }}
                    className="h-full"
                  >
                    <BentoCard hover={false} className="px-5 py-5 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[13px] font-semibold text-white">Activity</p>
                        <TrendingUp size={13} className="text-[#22c55e]" />
                      </div>
                      <div className="flex items-end gap-[2.5px] h-14 mb-4">
                        {activityBars.map((v, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-[2px] bg-[#22c55e]"
                            style={{ height: `${(v / 9) * 100}%`, opacity: 0.1 + (v / 9) * 0.8 }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-[#3f3f46] font-medium mt-auto">
                        247 deploys / year
                      </p>
                    </BentoCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="h-full"
                  >
                    <BentoCard hover={false} className="h-full flex flex-col">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                        <p className="text-[13px] font-semibold text-white">Env</p>
                        <button
                          onClick={() => navigate("/environments")}
                          className="text-[11px] text-[#52525b] hover:text-white transition-colors font-medium"
                        >
                          Edit →
                        </button>
                      </div>
                      <div className="flex flex-col divide-y divide-white/[0.04] flex-1">
                        {[["DB_URL", "••••••"], ["JWT", "••••••"], ["STRIPE", "••••••"]].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between px-5 py-3.5">
                            <span className="text-[11px] font-mono text-[#3b82f6] truncate">{k}</span>
                            <span className="text-[11px] font-mono text-[#2d2d33] ml-2">{v}</span>
                          </div>
                        ))}
                      </div>
                    </BentoCard>
                  </motion.div>
                </div>
              </div>

              {/* ─── Row 3: Projects ─── */}
              <div className="col-span-12 mt-2">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <p className="text-[16px] font-bold text-white">Projects</p>
                    {!loading && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] font-semibold text-[#71717a]">
                        {projects.length}
                      </span>
                    )}
                  </div>
                  <GlassButton variant="secondary" onClick={() => navigate("/applications")}>
                    View all
                  </GlassButton>
                </div>

                {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-44 bg-[#111113] border border-white/[0.06] rounded-2xl animate-pulse" />
                    ))}
                  </div>
                )}

                {!loading && projects.length === 0 && (
                  <BentoCard hover={false} className="flex flex-col items-center justify-center py-20 border-dashed mb-10">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                      <Rocket size={20} className="text-[#2d2d33]" />
                    </div>
                    <p className="text-[14px] font-semibold text-white mb-2">No projects yet</p>
                    <p className="text-[13px] text-[#52525b] mb-6">Deploy your first application</p>
                    <GlassButton variant="primary" onClick={() => navigate("/projects/new")}>
                      <Plus size={14} /> Create project
                    </GlassButton>
                  </BentoCard>
                )}

                {!loading && projects.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
                  >
                    {projects.map((p) => (
                      <motion.div
                        key={p.id}
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                      >
                        <BentoCard
                          className="group flex flex-col"
                          onClick={() => navigate(`/deploy?projectId=${p.id}`)}
                        >
                          <div className="px-6 py-6 flex-1">
                            <div className="flex items-start justify-between gap-3 mb-5">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-[#18181b] border border-white/[0.08] flex items-center justify-center text-[#22c55e] shrink-0">
                                  <Globe size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13.5px] font-semibold text-white truncate group-hover:text-[#22c55e] transition-colors">
                                    {p.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <GitBranch size={10} className="text-[#3f3f46] shrink-0" />
                                    <span className="text-[11px] text-[#3f3f46] font-mono">{p.branch}</span>
                                  </div>
                                </div>
                              </div>
                              <StatusBadge status={p.status} />
                            </div>
                          </div>

                          <div className="flex border-t border-white/[0.05]">
                            {[
                              { icon: Terminal, label: "Logs", fn: () => navigate(`/deploy?projectId=${p.id}`) },
                              { icon: History, label: "Deploys", fn: () => navigate(`/deploy?projectId=${p.id}`) },
                              { icon: Settings, label: "Config", fn: () => navigate(`/settings?projectId=${p.id}`) },
                              { icon: BrainCircuit, label: "AI", fn: () => { } },
                            ].map(({ icon: Icon, label, fn }, i) => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); fn(); }}
                                title={label}
                                className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 text-[#3f3f46] hover:text-white hover:bg-white/[0.04] transition-colors border-r border-white/[0.05] last:border-0"
                              >
                                <Icon size={13} strokeWidth={1.75} />
                                <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em]">{label}</span>
                              </button>
                            ))}
                          </div>
                        </BentoCard>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
=======
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300
        ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}
      >

        {/* HERO */}
        <div
          className="relative min-h-[160px] md:min-h-[180px] bg-cover bg-center flex flex-col justify-between border-b border-white/10"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

          <TopNav />

          <div
            className="relative z-10 px-4 md:px-6 pb-4 font-normal tracking-tighter"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            <h1 className="text-sm md:text-base leading-relaxed">
              Good evening, Sheryian 🚀
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-300 mt-2 leading-loose tracking-tighter">
              Here's what's happening with your projects today.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-3 md:p-4 flex flex-col gap-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-[#11151c] border border-white/10 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-[9px] text-slate-400">
                      {item.title}
                    </p>
                    <h2 className="text-base md:text-lg mt-1 font-medium">
                      {item.value}
                    </h2>
                  </div>
                  <Icon className="w-8 h-8 text-slate-500 opacity-50" strokeWidth={1.5} />
                </div>
              );
            })}
          </div>

          <h2 className="text-sm text-[#888] mb-4 flex items-center gap-2 border-b border-[#222] pb-2 font-bold">
            <Folder size={14} /> ACTIVE_PROJECTS ({myProjects.length})
          </h2>

          {/* MIDDLE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-hidden items-start">

            {/* RECENT DEPLOYMENTS */}
            <div className="md:col-span-2 bg-[#11151c] border border-white/10 rounded-lg p-3 flex flex-col">

              <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                <h2 className="text-xl text-slate-300">
                  Recent Deployments
                </h2>
                <span className="text-xs text-slate-400 cursor-pointer">
                  View all →
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Auth Service", status: "SUCCESS", time: "3m" },
                  { name: "Frontend", status: "SUCCESS", time: "15m" },
                  { name: "Payments", status: "FAILED", time: "1h" },
                  { name: "Data Pipeline", status: "RUNNING", time: "1h" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5"
                  >
                    <span className="text-sm text-slate-200">
                      {item.name}
                    </span>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} />
                      <span className="text-xs text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TECH STACK */}
            <div className="bg-[#11151c] border border-white/10 rounded-lg p-3 flex flex-col">

              <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                <h2 className="text-xl text-slate-300">
                  Tech Stack
                </h2>
                <span className="text-xs text-slate-400 cursor-pointer">
                  View all →
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "React", color: "bg-blue-400" },
                  { name: "Node", color: "bg-green-400" },
                  { name: "Mongo", color: "bg-green-500" },
                  { name: "Redis", color: "bg-red-400" },
                  { name: "Docker", color: "bg-blue-300" },
                  { name: "AWS", color: "bg-yellow-400" },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/5 rounded px-2 py-1.5"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${tech.color}`} />
                    <span className="text-xs text-slate-200">
                      {tech.name}
                    </span>
                  </div>
                ))}
>>>>>>> 1b78a6f (fix: restore frontend changes)
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              "New Project",
              "Deploy",
              "Rollback",
              "Logs",
              "AI",
            ].map((action, i) => (
              <div
                key={i}
                className="bg-[#11151c] border border-white/10 rounded-lg py-3 text-sm text-center hover:bg-white/5 cursor-pointer"
              >
                {action}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
