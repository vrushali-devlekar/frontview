<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import { Rocket, History, PlayCircle } from "lucide-react";
import DeployRow from "../../components/project/DeployRow";
<<<<<<< HEAD
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, Badge, EmptyState, AlertBanner } from "../../components/layout/PageLayout";
import { motion } from "framer-motion";
import { listDeployments, triggerDeployment, getProject, getProjects } from "../../api/api";
import { mapBackendStatusToUi, formatTimeAgo } from "../../utils/deploymentUi";

export default function DeploymentsPage() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
=======
import heroBg from "../../assets/new-top.png";
import {
  listDeployments,
  triggerDeployment,
  getProject,
  getProjects,
} from "../../api/api";
import {
  mapBackendStatusToUi,
  formatTimeAgo,
} from "../../utils/deploymentUi";

const Github = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
import React, { useState } from 'react';
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import { Rocket, History, Terminal, Cpu, Clock, GitBranch } from 'lucide-react';
import DeployRow from '../../components/project/DeployRow';
import heroBg from "../../assets/new-top.png"; // Make sure path is correct

const Github = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

<<<<<<< HEAD
<<<<<<< HEAD
export default function DeploymentsPage() {
  const { isCollapsed, toggleSidebar } = useSidebar();
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId") || "";

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [triggering, setTriggering] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await getProjects();
        if (cancelled) return;
        const rows = Array.isArray(data?.data) ? data.data : [];
        setProjects(rows);
        if (!projectId && rows[0]?._id) {
          navigate(`/deploy?projectId=${encodeURIComponent(rows[0]._id)}`, { replace: true });
        }
      } catch { if (!cancelled) setProjects([]); }
    })();
    return () => { cancelled = true; };
  }, [projectId, navigate]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (!projectId) { if (!cancelled) { setDeployments([]); setProjectName(""); } return; }
      if (!cancelled) { setLoading(true); setError(""); }
      try {
        const [projRes, depRes] = await Promise.all([getProject(projectId), listDeployments(projectId)]);
        if (cancelled) return;
        setProjectName(projRes.data?.data?.name || "PROJECT");
        setDeployments(depRes.data?.data || []);
      } catch (e) {
        if (!cancelled) { setError(e.response?.data?.message || e.message || "Failed to load deployments"); setDeployments([]); }
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [projectId, refreshKey]);

  const handleTriggerBuild = async () => {
    if (!projectId) return;
    setTriggering(true); setError("");
    try {
      const { data } = await triggerDeployment(projectId);
      const newId = data?.deploymentId != null ? String(data.deploymentId) : "";
      if (newId) navigate(`/deploy/logs/${newId}?projectId=${encodeURIComponent(projectId)}`);
      else setRefreshKey((k) => k + 1);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to trigger deployment");
    } finally { setTriggering(false); }
  };

  const pickFirstProject = async () => {
    try {
      const { data } = await getProjects();
      const first = data?.data?.[0];
      if (first?._id) navigate(`/deploy?projectId=${encodeURIComponent(first._id)}`, { replace: true });
    } catch { /* ignore */ }
  };

  // sidebarAttr removed in favor of PageWrapper inline styles

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader
            title="Deployments"
            subtitle={projectName ? `Build pipeline for ${projectName}` : "Select a project to view deployments"}
          >
            <GlassButton variant="primary" disabled={!projectId || triggering} onClick={handleTriggerBuild}>
              <PlayCircle size={14} />
              {triggering ? "Starting…" : "Trigger Build"}
            </GlassButton>
          </PageHeader>

<<<<<<< HEAD
          {/* No project */}
=======
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"
        }`}
      >
        <div
          className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1
                className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                DEPLOYMENTS
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <p className="text-[10px] text-[#888] flex items-center gap-1">
                  <Github size={12} /> {projectName || "SELECT_PROJECT"}
                </p>
                {projects.length > 0 && (
                  <select
                    value={projectId}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (next) {
                        navigate(
                          `/deploy?projectId=${encodeURIComponent(String(next))}`
                        );
                      }
                    }}
                    className="bg-[#0a0a0a] border border-[#333] text-[#ccc] text-[10px] font-mono px-2 py-1 outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p._id} value={p._id} className="bg-[#0a0a0a]">
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
                {projectId && (
                  <span className="text-[9px] text-[#00FFCC] bg-[#00FFCC]/10 border border-[#00FFCC]/30 px-2 py-0.5 font-mono truncate max-w-[200px]">
                    {projectId}
                  </span>
                )}
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
const StatusBadge = ({ status }) => {
  const styles = {
    SUCCESS: "text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10",
    FAILED: "text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10",
    BUILDING: "text-[#FFCC00] border-[#FFCC00]/30 bg-[#FFCC00]/10",
    QUEUED: "text-[#888] border-[#888]/30 bg-[#888]/10",
    ROLLING_BACK: "text-[#FF00FF] border-[#FF00FF]/30 bg-[#FF00FF]/10 animate-pulse", // Special color for Phase 7
  };

  return (
    <span className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'SUCCESS' ? 'bg-[#00FFCC]' : status === 'FAILED' ? 'bg-[#FF3333]' : status === 'ROLLING_BACK' ? 'bg-[#FF00FF]' : 'bg-current'}`}></span>
      {status}
    </span>
  );
};

export default function DeploymentsPage() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  // 🌟 Simulated Data from Backend (Phase 4 & 7)
  const deploymentHistory = [
    { version: "v45", commit: "a1b2c3d", message: "Fix: Auth middleware bug", branch: "main", status: "SUCCESS", duration: "1m 12s", time: "10m ago", author: "siddhartha" },
    { version: "v44", commit: "f9e8d7c", message: "Feat: Add AES-256 Env vars", branch: "main", status: "SUCCESS", duration: "1m 45s", time: "2h ago", author: "siddhartha" },
    { version: "v43", commit: "b4a5d6e", message: "Update: Redis Cache config", branch: "feature/redis", status: "FAILED", duration: "45s", time: "5h ago", author: "siddhartha" },
    { version: "v42", commit: "c7d8e9f", message: "Hotfix: Memory leak in AI logs", branch: "main", status: "SUCCESS", duration: "2m 05s", time: "1d ago", author: "siddhartha" },
    { version: "v41", commit: "rollback", message: "SYSTEM_ROLLBACK_INITIATED", branch: "main", status: "ROLLING_BACK", duration: "-", time: "1d ago", author: "system" },
    { version: "v40", commit: "e2f3g4h", message: "Initial Release v2.0", branch: "main", status: "SUCCESS", duration: "3m 20s", time: "2d ago", author: "siddhartha" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>

        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest" style={{ fontFamily: "'Press Start 2P', cursive" }}>DEPLOYMENTS</h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-[10px] text-[#888] flex items-center gap-1">
                  <Github size={12} /> VALORA_FRONTEND_CORE
                </p>
                <span className="text-[9px] text-[#00FFCC] bg-[#00FFCC]/10 border border-[#00FFCC]/30 px-2 py-0.5">PRODUCTION_ENV</span>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
              </div>
            </div>

            <button
<<<<<<< HEAD
<<<<<<< HEAD
              type="button"
              disabled={!projectId || triggering}
              onClick={handleTriggerBuild}
              className="bg-[#FFCC00] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                boxShadow: "4px 4px 0px 0px #CC9900",
              }}
            >
              <Rocket size={14} strokeWidth={3} />{" "}
              {triggering ? "STARTING..." : "TRIGGER_BUILD"}
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
              className="bg-[#FFCC00] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                boxShadow: "4px 4px 0px 0px #CC9900"
              }}
            >
              <Rocket size={14} strokeWidth={3} /> TRIGGER_BUILD
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
            </button>
          </div>
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
          {!projectId && (
            <Card noPad>
              <EmptyState icon={Rocket} title="No project selected" subtitle="Open a project from the dashboard to view its deployment history.">
                <GlassButton variant="secondary" onClick={pickFirstProject}>Load Latest Project</GlassButton>
              </EmptyState>
            </Card>
          )}

          {/* Error */}
          {projectId && error && (
            <AlertBanner type="error">{error}</AlertBanner>
          )}

          {/* Deployments list */}
          {projectId && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <History size={14} className="text-[#52525b]" />
                  <p className="text-[13px] font-semibold text-white">Version History</p>
                </div>
                <Badge>{loading ? "…" : deployments.length} builds</Badge>
              </div>

              <Card noPad>
                {loading && (
                  <div className="py-20 flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                  </div>
                )}
                {!loading && deployments.length === 0 && (
                  <EmptyState
                    icon={Rocket}
                    title="No deployments yet"
                    subtitle="Trigger a build to start the pipeline."
                  />
                )}
                {!loading && deployments.map((dep, idx) => (
                  <div key={dep._id} className={idx !== deployments.length - 1 ? "border-b border-white/[0.04]" : ""}>
                    <DeployRow
                      projectId={projectId}
                      deployment={{
                        id: dep._id,
                        version: `v${dep.version}`,
                        versionNumber: dep.version,
                        status: mapBackendStatusToUi(dep.status),
                        liveUrl: dep.url || null,
                        branch: dep.branch || "main",
                        commitMessage: dep.errorMessage || dep.commitHash || "—",
                        timeAgo: formatTimeAgo(dep.createdAt || dep.updatedAt),
                        author: dep.triggeredBy || "manual",
                      }}
                      onRollback={() => setRefreshKey((k) => k + 1)}
                    />
                  </div>
                ))}
              </Card>
            </motion.div>
          )}
<<<<<<< HEAD
        </PageShell>
      </PageWrapper>
    </div>
  );
}
=======
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          <div className="flex justify-between items-center mb-4 border-b border-[#222] pb-2">
            <h2 className="text-sm text-[#888] flex items-center gap-2 font-bold">
              <History size={14} /> VERSION_HISTORY
            </h2>
            <span className="text-[10px] text-[#555]">TOTAL_BUILDS: 45</span>
          </div>

          {/* VERCEL/RENDER STYLE HISTORY TABLE - THEMED CYBERPUNK */}
          <div className="bg-[#0a0a0a] border-2 border-[#222] shadow-[4px_4px_0px_0px_rgba(255,204,0,0.05)]">

            {/* Table Rows replaced by DeployRow Engine */}
            <div className="flex flex-col p-4">
              {deploymentHistory.map((deploy, i) => (
                <DeployRow 
                  key={i} 
                  deployment={{
                    id: `dep-${i}`,
                    version: deploy.version,
                    status: deploy.status,
                    branch: deploy.branch,
                    commitMessage: deploy.message,
                    timeAgo: deploy.time,
                    author: deploy.author
                  }} 
                  onRollback={(id) => console.log('Rolling back', id)}
                />
              ))}
            </div>

          </div>

<<<<<<< HEAD
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
