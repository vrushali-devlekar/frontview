<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<<< HEAD:frontend/src/pages/project_view/Overview.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
========
import { useState } from "react";
>>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4:frontend/src/components/ActiveLinks/Applications.jsx
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
<<<<<<< HEAD
import { PageShell, PageHeader, Card, EmptyState } from "../../components/layout/PageLayout";
import { Search, Plus, Globe, GitBranch, Terminal, Layers, Settings, Clock, Rocket } from "lucide-react";
import { getProjects } from "../../api/api";
import GlassButton from "../../components/ui/GlassButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { motion } from "framer-motion";

export default function Overview() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
=======
import {
<<<<<<< HEAD
<<<<<<< HEAD
  Rocket,
  Folder,
  Terminal,
  ExternalLink,
  Cpu,
  BrainCircuit,
  History,
  Settings,
  Layers
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import { getProjects } from "../../api/api";

const StatusBadge = ({ status }) => {
  const styles = {
    RUNNING: "text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10",
    FAILED: "text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10",
    BUILDING: "text-[#FFCC00] border-[#FFCC00]/30 bg-[#FFCC00]/10",
  };

  return (
    <span className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-[#00FFCC]' : status === 'FAILED' ? 'bg-[#FF3333]' : 'bg-[#FFCC00] animate-pulse'}`}></span>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
  Search,
  Star,
  MoreVertical,
  Upload,
  Plus,
  Grid,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import heroBg from "../../assets/new-top.png";

const StatusBadge = ({ status }) => {
  const map = {
    Deployed: { dot: "bg-green-400", text: "text-green-400" },
    Failed: { dot: "bg-red-400", text: "text-red-400" },
    Running: { dot: "bg-yellow-400", text: "text-yellow-400" },
  };
  const s = map[status] ?? { dot: "bg-slate-400", text: "text-slate-400" };
  return (
    <span className={`flex items-center gap-1.5 text-[10px] ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
      {status}
    </span>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<<< HEAD:frontend/src/pages/project_view/Overview.jsx
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
const AppIcon = ({ name, color }) => (
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${color}`}>
    {name.slice(0, 2).toUpperCase()}
  </div>
);

<<<<<<< HEAD
<<<<<<< HEAD
const AppRow = ({ app, starred, onStar, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="w-full text-left flex items-center justify-between px-3 py-2 border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
  >
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onStar();
        }}
        className="text-slate-600 hover:text-yellow-400 transition-colors"
      >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
const AppRow = ({ app, starred, onStar }) => (
  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
    <div className="flex items-center gap-3">
      <button onClick={onStar} className="text-slate-600 hover:text-yellow-400 transition-colors">
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        <Star size={11} className={starred ? "fill-yellow-400 text-yellow-400" : ""} />
      </button>
      <AppIcon name={app.name} color={app.color} />
      <div>
        <p className="text-[11px] font-medium text-slate-100 leading-none mb-1">{app.name}</p>
        <div className="flex items-center gap-2 text-[9px] text-slate-500">
          <span className="truncate w-32">{app.repo}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex flex-col items-end gap-0.5">
        <StatusBadge status={app.status} />
        <span className="text-[8px] text-slate-500">{app.time}</span>
      </div>
      <div className="hidden md:flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-slate-300 font-mono">{app.version}</span>
        <span className="text-[8px] text-slate-500">{app.buildTime}</span>
      </div>
      <button className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={12} />
      </button>
    </div>
<<<<<<< HEAD
<<<<<<< HEAD
  </button>
);

const QuickAction = ({ icon: Icon, label, sub, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
  >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
  </div>
);

const QuickAction = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
      <Icon size={11} className="text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-200 leading-tight">{label}</p>
      <p className="text-[8px] text-slate-500 truncate leading-tight">{sub}</p>
    </div>
    <ChevronRight size={10} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
<<<<<<< HEAD
<<<<<<< HEAD
  </button>
=======
  </div>
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
  </div>
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
);

export default function Applications() {
  const { isCollapsed, toggleSidebar } = useSidebar();
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [starredIds, setStarredIds] = useState(new Set([3]));
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getProjects();
        if (cancelled) return;
        setProjects(Array.isArray(data?.data) ? data.data : []);
      } catch { if (!cancelled) setProjects([]); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

<<<<<<< HEAD
  const filtered = useMemo(() =>
    projects.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.repoUrl?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [projects, searchQuery]);
=======
  const apps = useMemo(() => {
    const colors = [
      "bg-emerald-700",
      "bg-blue-600",
      "bg-orange-600",
      "bg-teal-700",
      "bg-violet-700",
    ];
    return projects.map((p, idx) => ({
      id: p._id,
      name: p.name,
      repo: p.repoName || p.repoUrl,
      branch: p.branch,
      status: "Running",
      time: "—",
      version: p.branch ? `branch:${p.branch}` : "—",
      buildTime: "—",
      color: colors[idx % colors.length],
    }));
  }, [projects]);
========
export default function Applications() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const myApplications = [
    {
      name: "USER_AUTH_SERVICE",
      framework: "Node.js",
      status: "RUNNING",
      url: "auth.valora.io",
      lastDeploy: "10m ago",
      version: "v2.1.0"
    },
    {
      name: "PAYMENT_API",
      framework: "Python",
      status: "RUNNING",
      url: "api.payments.valora.io",
      lastDeploy: "1h ago",
      version: "v1.4.2"
    },
    {
      name: "FRONTEND_WEB",
      framework: "React",
      status: "BUILDING",
      url: "valora-front.vercel.app",
      lastDeploy: "Just now",
      version: "v4.0.1"
    },
    {
      name: "DATA_INGESTION",
      framework: "Go",
      status: "FAILED",
      url: "data.valora.io",
      lastDeploy: "2h ago",
      version: "v1.0.0"
    }
  ];
>>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4:frontend/src/components/ActiveLinks/Applications.jsx

  return (
<<<<<<<< HEAD:frontend/src/pages/project_view/Overview.jsx
    <div className="flex h-screen overflow-hidden bg-[#0b0f14] text-white" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
========
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

>>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4:frontend/src/components/ActiveLinks/Applications.jsx
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>

        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest" style={{ fontFamily: "'Press Start 2P', cursive" }}>APPLICATIONS</h1>
              <p className="text-[10px] text-[#888] mt-1">MANAGE YOUR DEPLOYED SERVICES</p>
            </div>

            <button
              className="bg-[#FFCC00] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                boxShadow: "4px 4px 0px 0px #CC9900"
              }}
            >
              <Layers size={14} strokeWidth={3} /> NEW_APPLICATION
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          <h2 className="text-sm text-[#888] mb-4 flex items-center gap-2 border-b border-[#222] pb-2 font-bold">
            <Folder size={14} /> ACTIVE_APPLICATIONS ({myApplications.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myApplications.map((app, i) => (
              <div key={i} className="bg-[#0a0a0a] border-2 border-[#222] hover:border-[#FFCC00] transition-colors flex flex-col relative group" style={{ boxShadow: "4px 4px 0px 0px rgba(255, 204, 0, 0.1)" }}>

                <div className="p-4 border-b border-[#111]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-[#FFCC00] truncate pr-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', lineHeight: '1.5' }}>
                      {app.name}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#666]">
                    <Cpu size={12} /> {app.framework} • {app.version}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-[#555]">LAST_DEPLOY:</span>
                    <span className="text-[10px] text-[#AAA]">{app.lastDeploy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#555]">DOMAIN:</span>
                    <a href={`https://${app.url}`} target="_blank" className="text-[10px] text-[#00FFCC] hover:underline flex items-center gap-1 font-bold">
                      {app.url} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-4 border-t-2 border-[#111] bg-[#050505]">
                  <button className="p-3 text-[#555] hover:text-[#00FFCC] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors" title="View Logs">
                    <Terminal size={14} />
                  </button>
                  <button className="p-3 text-[#555] hover:text-[#FFCC00] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors" title="Settings">
                    <Settings size={14} />
                  </button>
                  <button className="p-3 text-[#555] hover:text-[#FFCC00] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors" title="Rollback">
                    <History size={14} />
                  </button>

                  <button className={`p-3 flex justify-center transition-all ${app.status === 'FAILED' ? 'text-[#050505] bg-[#FFCC00] hover:bg-yellow-400' : 'text-[#555] hover:text-[#FFCC00] hover:bg-[#111]'}`} title="Ask AI">
                    <BrainCircuit size={14} className={app.status === 'FAILED' ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>
<<<<<<<< HEAD:frontend/src/pages/project_view/Overview.jsx
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4

  const apps = [
    { id: 1, name: "User Auth Service", repo: "sheryians/auth-service", branch: "main", status: "Deployed", time: "2m ago", version: "v1.2.3", buildTime: "3m 24s", color: "bg-emerald-700" },
    { id: 2, name: "Frontend Web", repo: "sheryians/frontend-web", branch: "main", status: "Deployed", time: "15m ago", version: "v2.4.1", buildTime: "1m 45s", color: "bg-blue-600" },
    { id: 3, name: "Payment Service", repo: "sheryians/payment-service", branch: "develop", status: "Failed", time: "1h ago", version: "v1.0.5", buildTime: "2m 10s", color: "bg-orange-600" },
    { id: 4, name: "Data Ingest Service", repo: "sheryians/data-ingest", branch: "main", status: "Running", time: "1h 20m ago", version: "v0.9.1", buildTime: "5m 8s", color: "bg-teal-700" },
    { id: 5, name: "Notification Service", repo: "sheryians/notification-service", branch: "main", status: "Deployed", time: "2h ago", version: "v1.3.0", buildTime: "1m 12s", color: "bg-violet-700" },
  ];
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7

  // sidebarAttr removed in favor of PageWrapper inline styles

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Applications" subtitle="Manage and deploy your applications">
            <GlassButton variant="primary" onClick={() => navigate("/projects/new")}>
              <Plus size={14} /> New Project
            </GlassButton>
          </PageHeader>

          {/* Search + count row */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525b]" />
              <input
                type="text"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 text-[13px] w-64 bg-[#111113] border border-white/[0.08] rounded-xl text-white placeholder:text-[#3f3f46] focus:outline-none focus:border-white/[0.16] transition-colors"
              />
            </div>
            <p className="text-[13px] text-[#52525b]">
              {loading ? "Loading…" : `${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="h-52 bg-[#111113] border border-white/[0.06] rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

<<<<<<< HEAD
          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <Card noPad>
              <EmptyState
                icon={searchQuery ? Globe : Rocket}
                title={searchQuery ? "No projects found" : "No projects yet"}
                subtitle={searchQuery ? "Try a different search term" : "Deploy your first application"}
              >
                {!searchQuery && (
                  <GlassButton variant="primary" onClick={() => navigate("/projects/new")}>
                    <Plus size={14} /> Create Project
                  </GlassButton>
=======
            {/* LEFT: app list */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl flex flex-col min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  {[{ id: "all", label: "All Applications" }, { id: "starred", label: "Starred" }].map((t) => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${activeTab === t.id ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                      {t.id === "starred" && <Star size={10} />} {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search apps..." className="bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 placeholder-slate-600 pl-6 pr-2 py-1 w-36 outline-none focus:border-white/20 transition-colors" />
                  </div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 px-2 py-1 outline-none cursor-pointer appearance-none pr-4" style={{ backgroundImage: "none" }}>
                    {["All Status", "Deployed", "Failed", "Running"].map((s) => <option key={s} value={s} className="bg-[#11151c]">{s}</option>)}
                  </select>
                </div>
              </div>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4

              <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {filtered.length === 0 ? (
                  <div className="flex items-center justify-center py-10 text-slate-600 text-[10px]">No applications found.</div>
                ) : (
<<<<<<< HEAD
<<<<<<< HEAD
                  filtered.map((app) => (
                    <AppRow
                      key={app.id}
                      app={app}
                      starred={starredIds.has(app.id)}
                      onStar={() => toggleStar(app.id)}
                      onOpen={() =>
                        navigate(
                          `/deploy?projectId=${encodeURIComponent(String(app.id))}`
                        )
                      }
                    />
                  ))
=======
                  filtered.map((app) => <AppRow key={app.id} app={app} starred={starredIds.has(app.id)} onStar={() => toggleStar(app.id)} />)
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
                  filtered.map((app) => <AppRow key={app.id} app={app} starred={starredIds.has(app.id)} onStar={() => toggleStar(app.id)} />)
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
                )}
              </EmptyState>
            </Card>
          )}

<<<<<<< HEAD
          {/* Projects grid */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial="hidden" animate="show"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project) => (
                <motion.div
                  key={project._id}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                >
                  <Card
                    className="group flex flex-col h-full"
                    onClick={() => navigate(`/deploy?projectId=${project._id}`)}
                  >
                    {/* Card body */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                            <Globe size={14} className="text-[#71717a]" />
                          </div>
                          <p className="text-[14px] font-bold text-white truncate group-hover:text-[#22c55e] transition-colors">
                            {project.name}
                          </p>
                        </div>
                        <StatusBadge status={project.lastDeploymentStatus || "RUNNING"} />
                      </div>

                      <div className="space-y-2.5 ml-[48px]">
                        <div className="flex items-center gap-2">
                          <GitBranch size={11} className="text-[#3f3f46] shrink-0" />
                          <span className="text-[11.5px] text-[#71717a] font-mono">{project.branch || "main"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={11} className="text-[#3f3f46] shrink-0" />
                          <span className="text-[11.5px] text-[#71717a]">
                            {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {project.repoUrl && (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Globe size={11} className="text-[#3f3f46] shrink-0" />
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11.5px] text-[#3b82f6] hover:underline truncate"
                            >
                              {project.repoUrl.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex border-t border-white/[0.05]" onClick={(e) => e.stopPropagation()}>
                      {[
                        { icon: Terminal, label: "Logs",     fn: () => navigate(`/deploy?projectId=${project._id}`) },
                        { icon: Layers,   label: "Deploys",  fn: () => navigate(`/deploy?projectId=${project._id}`) },
                        { icon: Settings, label: "Settings", fn: () => navigate(`/settings?projectId=${project._id}`) },
                      ].map(({ icon: Icon, label, fn }, i) => (
                        <button
                          key={i}
                          onClick={fn}
                          className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 text-[#3f3f46] hover:text-white hover:bg-white/[0.04] transition-colors border-r border-white/[0.05] last:border-0"
                        >
                          <Icon size={13} strokeWidth={1.75} />
                          <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em]">{label}</span>
                        </button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </PageShell>
      </PageWrapper>
=======
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 shrink-0">
                <span className="text-[8px] text-slate-500">Showing 1 to {filtered.length} of {apps.length}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"><ChevronLeft size={10} /></button>
                  {[1, 2].map((p) => (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`w-5 h-5 rounded text-[9px] transition-colors ${currentPage === p ? "bg-white/20 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => p + 1)} className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"><ChevronRight size={10} /></button>
                </div>
              </div>
            </div>

            {/* RIGHT: sidebar panels */}
            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-[#11151c] border border-white/10 rounded-xl p-3 shrink-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-xl font-medium text-slate-200">Connect Repository</h3>
                </div>
                <p className="text-[9px] text-slate-500 mb-3 leading-relaxed">Connect your GitHub repository to create a new application.</p>
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-white/10" /><span className="text-[8px] text-slate-600">or</span><div className="flex-1 h-px bg-white/10" />
                </div>
<<<<<<< HEAD
<<<<<<< HEAD
                <button
                  type="button"
                  onClick={() => navigate("/projects/new")}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm py-2 rounded-lg transition-colors"
                >
=======
                <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm py-2 rounded-lg transition-colors">
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
                <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm py-2 rounded-lg transition-colors">
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                  <Upload size={14} /> Import Existing Project
                </button>
              </div>

              <div className="bg-[#11151c] border border-white/10 rounded-xl p-3 flex-1 min-h-0 overflow-hidden flex flex-col">
                <h3 className="text-xl font-medium text-slate-200 mb-2 shrink-0">Quick Actions</h3>
                <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: 'none' }}>
<<<<<<< HEAD
<<<<<<< HEAD
                  <QuickAction icon={Plus} label="New Application" sub="Import a GitHub repo" onClick={() => navigate("/projects/new")} />
                  <QuickAction icon={Grid} label="Browse Templates" sub="Coming soon" onClick={() => navigate("/projects/new")} />
                  <QuickAction icon={Layers} label="Manage Environments" sub="Add or edit environments" onClick={() => navigate("/environments")} />
                  <QuickAction icon={Zap} label="View All Deployments" sub="See deployment history" onClick={() => {
                    const first = projects?.[0]?._id;
                    navigate(first ? `/deploy?projectId=${encodeURIComponent(String(first))}` : "/deploy");
                  }} />
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                  <QuickAction icon={Plus} label="New Application" sub="Create from scratch" />
                  <QuickAction icon={Grid} label="Browse Templates" sub="Use pre-configured templates" />
                  <QuickAction icon={Layers} label="Manage Environments" sub="Add or edit environments" />
                  <QuickAction icon={Zap} label="View All Deployments" sub="See deployment history" />
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                </div>
              </div>
            </div>

<<<<<<< HEAD
<<<<<<< HEAD
========
            ))}
>>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4:frontend/src/components/ActiveLinks/Applications.jsx
          </div>

=======
          </div>
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
          </div>
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        </div>
      </div>
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
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
