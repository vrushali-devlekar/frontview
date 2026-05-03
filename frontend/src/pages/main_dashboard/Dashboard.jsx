<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
=======
<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
=======
import { useState } from "react";
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
import { useState } from "react";
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { motion } from "framer-motion";
import {
<<<<<<< HEAD
  Rocket, Folder, Terminal, BrainCircuit, History,
  Settings, ArrowUpRight, ArrowDownRight,
  Clock, Plus, GitBranch, Globe, Activity, TrendingUp,
  Shield, MoreHorizontal
} from "lucide-react";
import {
  getProjects,
  getDashboardStats
} from "../../api/api";

/* ── Status dot ── */
const StatusDot = ({ status }) => {
  const colors = { RUNNING: "bg-[#22c55e]", FAILED: "bg-[#ef4444]", BUILDING: "bg-[#eab308]" };
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colors[status] || "bg-[#52525b]"}`} />;
};
=======
  Rocket,
  Folder,
  Terminal,
  ExternalLink,
  Cpu,
  BrainCircuit,
  History,
<<<<<<< HEAD
<<<<<<< HEAD
  Settings,
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import { getProjects } from "../../api/api";
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
  Settings
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    RUNNING: { cls: "badge-green", label: "Running" },
    FAILED: { cls: "badge-red", label: "Failed" },
    BUILDING: { cls: "badge-yellow", label: "Building" },
    SUCCESS: { cls: "badge-green", label: "Ready" },
  };
  const cfg = map[status] || { cls: "badge-muted", label: status };
  return (
<<<<<<< HEAD
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.cls}`}>
      <StatusDot status={status} />
      {cfg.label}
=======
<<<<<<< HEAD
<<<<<<< HEAD
    <span
      className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status] || styles.BUILDING}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "RUNNING"
            ? "bg-[#00FFCC]"
            : status === "FAILED"
              ? "bg-[#FF3333]"
              : "bg-[#FFCC00] animate-pulse"
        }`}
      ></span>
=======
    <span className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-[#00FFCC]' : status === 'FAILED' ? 'bg-[#FF3333]' : 'bg-[#FFCC00] animate-pulse'}`}></span>
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
    <span className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-[#00FFCC]' : status === 'FAILED' ? 'bg-[#FF3333]' : 'bg-[#FFCC00] animate-pulse'}`}></span>
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
      {status}
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
    </span>
  );
};

<<<<<<< HEAD
/* ── Micro sparkline ── */
const Spark = ({ data, color = "#22c55e" }) => {
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
=======
export default function Dashboard() {
  const { isCollapsed, toggleSidebar } = useSidebar();
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getProjects();
        if (cancelled) return;
        const rows = (data?.data || []).map((p) => ({
          id: p._id,
          name: p.name,
          framework: "—",
          status: "RUNNING",
          url: p.repoUrl?.replace(/^https?:\/\//, "") || "—",
          lastDeploy: "—",
          version: p.branch || "main",
        }));
        setMyProjects(rows);
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message || e.message || "Failed to load projects"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7

/* ── Uptime bar ── */
const UptimeBar = () => {
  const data = [60, 70, 65, 80, 75, 90, 85, 95, 88, 92, 78, 82, 90, 95, 88, 92, 85, 90, 95, 88, 92, 85, 90, 95, 88, 92, 85, 90, 95, 100];
  return (
    <div className="flex items-end gap-[2px] h-10 w-full">
      {data.map((h, i) => (
        <div
<<<<<<< HEAD
          key={i}
          style={{ height: `${h}%` }}
          className={`flex-1 rounded-[2px] transition-colors ${i === 6 ? "bg-[#ef4444]/60" : "bg-[#22c55e]/40 hover:bg-[#22c55e]/70"}`}
        />
      ))}
    </div>
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

  const sidebarAttr = ""; // legacy — not needed

  const stats = [
    { label: "Total Projects", value: dbStats.totalProjects, delta: "+1", isPositive: true, Icon: Folder, iconColor: "bg-[#22c55e]/10 text-[#22c55e]", sparkData: [5, 7, 6, 9, 8, 10, 11, dbStats.totalProjects], sparkColor: "#22c55e" },
    { label: "Deployments", value: dbStats.totalDeployments, delta: "+2", isPositive: true, Icon: Rocket, iconColor: "bg-[#3b82f6]/10 text-[#3b82f6]", sparkData: [180, 195, 210, 205, 220, 235, 240, dbStats.totalDeployments], sparkColor: "#3b82f6" },
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

  const activityBars = [3, 7, 2, 8, 5, 9, 4, 6, 8, 3, 7, 5, 9, 6, 4, 8, 5, 9, 7, 4, 6, 8, 5, 9, 6, 4, 8, 7];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-sans">
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#22c55e]/[0.03] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-[#3b82f6]/[0.025] rounded-full blur-[100px]" />
      </div>

      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />

      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />

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
                  {/* ── Card header ── */}
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

                  {/* ── Deploy rows ── */}
                  <div className="flex flex-col divide-y divide-white/[0.04] flex-1">
                    {recentDeploys.map((d, i) => (
                      <div
                        key={i}
                        onClick={() => navigate("/deploy")}
                        className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.025] cursor-pointer transition-colors group"
                      >
                        {/* Status dot */}
                        <StatusDot status={d.status} />

                        {/* Name + branch */}
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

                        {/* Badge */}
                        <StatusBadge status={d.status} />

                        {/* Time */}
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

                {/* Uptime */}
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

                {/* Activity + Env side by side */}
                <div className="grid grid-cols-2 gap-5 flex-1">

                  {/* Activity */}
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

                  {/* Env Variables */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="h-full"
                  >
                    <BentoCard hover={false} className="h-full flex flex-col">
                      {/* Env header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                        <p className="text-[13px] font-semibold text-white">Env</p>
                        <button
                          onClick={() => navigate("/environments")}
                          className="text-[11px] text-[#52525b] hover:text-white transition-colors font-medium"
                        >
                          Edit →
                        </button>
                      </div>
                      {/* Env rows */}
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
                {/* Section header */}
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

                {/* Skeleton */}
                {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-44 bg-[#111113] border border-white/[0.06] rounded-2xl animate-pulse" />
                    ))}
                  </div>
                )}

                {/* Empty state */}
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

                {/* Project cards */}
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
                          {/* Card body — generous padding so nothing touches the border */}
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

                          {/* Card footer */}
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
              </div>

            </div>
            {/* ══ END BENTO GRID ══ */}

          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
=======
          className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4

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
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>

        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
<<<<<<< HEAD
<<<<<<< HEAD
              <h1
                className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                OVERVIEW
              </h1>
              <p className="text-[10px] text-[#888] mt-1">
                YOUR PERSONAL DEPLOYMENT FLEET
              </p>
              {error && (
                <p className="text-[10px] text-red-400 mt-2 normal-case">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/projects/new")}
                className="bg-[#0a0a0a] text-[#FFCC00] border-2 border-[#FFCC00] px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 flex items-center gap-2 font-mono"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                <Rocket size={14} strokeWidth={3} /> IMPORT_REPO
              </button>
              <button
                type="button"
                onClick={() => navigate("/applications")}
                className="bg-[#FFCC00] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  boxShadow: "4px 4px 0px 0px #CC9900",
                }}
              >
                <Rocket size={14} strokeWidth={3} /> PROJECTS
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <h2 className="text-sm text-[#888] mb-4 flex items-center gap-2 border-b border-[#222] pb-2 font-bold">
            <Folder size={14} /> ACTIVE_PROJECTS (
            {loading ? "…" : myProjects.length})
          </h2>

          {!loading && myProjects.length === 0 && !error && (
            <div className="mb-8 p-6 border-2 border-[#333] bg-[#0a0a0a] text-[11px] text-[#888] max-w-xl font-mono normal-case">
              No projects yet.{" "}
              <button
                type="button"
                onClick={() => navigate("/projects/new")}
                className="text-[#00FFCC] hover:underline font-bold"
              >
                Import a GitHub repo
              </button>{" "}
              to deploy.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0a0a0a] border-2 border-[#222] hover:border-[#FFCC00] transition-colors flex flex-col relative group"
                style={{ boxShadow: "4px 4px 0px 0px rgba(255, 204, 0, 0.1)" }}
              >
                <div className="p-4 border-b border-[#111]">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-sm font-bold text-[#FFCC00] truncate pr-2"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: "10px",
                        lineHeight: "1.5",
                      }}
                    >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
<<<<<<< HEAD
                    <span className="text-[10px] text-[#AAA]">
                      {project.lastDeploy}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#555]">REPO:</span>
                    <a
                      href={
                        project.url.startsWith("http")
                          ? project.url
                          : `https://${project.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#00FFCC] hover:underline flex items-center gap-1 font-bold truncate max-w-[60%]"
                    >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                    <span className="text-[10px] text-[#AAA]">{project.lastDeploy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#555]">DOMAIN:</span>
                    <a href={`https://${project.url}`} target="_blank" className="text-[10px] text-[#00FFCC] hover:underline flex items-center gap-1 font-bold">
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                      {project.url} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

<<<<<<< HEAD
<<<<<<< HEAD
                <div className="grid grid-cols-4 border-t-2 border-[#111] bg-[#050505]">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/deploy?projectId=${encodeURIComponent(project.id)}`
                      )
                    }
                    className="p-3 text-[#555] hover:text-[#00FFCC] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors"
                    title="Deployments & logs"
                  >
                    <Terminal size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/environments")}
                    className="p-3 text-[#555] hover:text-[#FFCC00] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors"
                    title="Environments"
                  >
                    <Settings size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/deploy?projectId=${encodeURIComponent(project.id)}`
                      )
                    }
                    className="p-3 text-[#555] hover:text-[#FFCC00] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors"
                    title="Deployments"
                  >
                    <History size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/deploy?projectId=${encodeURIComponent(project.id)}`
                      )
                    }
                    className={`p-3 flex justify-center transition-all ${
                      project.status === "FAILED"
                        ? "text-[#050505] bg-[#FFCC00] hover:bg-yellow-400"
                        : "text-[#555] hover:text-[#FFCC00] hover:bg-[#111]"
                    }`}
                    title="Open project (AI analyze from deployment logs)"
                  >
                    <BrainCircuit
                      size={14}
                      className={
                        project.status === "FAILED" ? "animate-pulse" : ""
                      }
                    />
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                  </button>
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======

>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
}
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
