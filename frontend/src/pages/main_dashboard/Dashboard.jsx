import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import {
  Rocket,
  Folder,
  Terminal,
  ExternalLink,
  Cpu,
  BrainCircuit,
  History,
  Settings,
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import { getProjects } from "../../api/api";

const StatusBadge = ({ status }) => {
  const styles = {
    RUNNING: "text-[#6EE7B7] border-[#6EE7B7]/30 bg-[#6EE7B7]/10",
    FAILED: "text-[#E55B5B] border-[#E55B5B]/30 bg-[#E55B5B]/10",
    BUILDING: "text-[#D4A84B] border-[#D4A84B]/30 bg-[#D4A84B]/10",
  };

  return (
    <span
      className={`text-[9px] px-2 py-1 border font-mono tracking-widest flex items-center gap-1 ${styles[status] || styles.BUILDING}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "RUNNING"
            ? "bg-[#6EE7B7]"
            : status === "FAILED"
              ? "bg-[#E55B5B]"
              : "bg-[#D4A84B] animate-pulse"
        }`}
      ></span>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const { isCollapsed, toggleSidebar } = useSidebar();
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

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

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
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
              <h1
                className="text-xl md:text-2xl text-[#D4A84B] font-bold tracking-widest"
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
                className="bg-[#0a0a0a] text-[#D4A84B] border-2 border-[#D4A84B] px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 flex items-center gap-2 font-mono"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                <Rocket size={14} strokeWidth={3} /> IMPORT_REPO
              </button>
              <button
                type="button"
                onClick={() => navigate("/applications")}
                className="bg-[#D4A84B] text-black px-5 py-3 text-[10px] font-bold transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2"
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
                className="text-[#6EE7B7] hover:underline font-bold"
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
                className="bg-[#0a0a0a] border-2 border-[#222] hover:border-[#D4A84B] transition-colors flex flex-col relative group"
                style={{ boxShadow: "4px 4px 0px 0px rgba(255, 204, 0, 0.1)" }}
              >
                <div className="p-4 border-b border-[#111]">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-sm font-bold text-[#D4A84B] truncate pr-2"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: "10px",
                        lineHeight: "1.5",
                      }}
                    >
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
                      className="text-[10px] text-[#6EE7B7] hover:underline flex items-center gap-1 font-bold truncate max-w-[60%]"
                    >
                      {project.url} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-4 border-t-2 border-[#111] bg-[#050505]">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/deploy?projectId=${encodeURIComponent(project.id)}`
                      )
                    }
                    className="p-3 text-[#555] hover:text-[#6EE7B7] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors"
                    title="Deployments & logs"
                  >
                    <Terminal size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/environments")}
                    className="p-3 text-[#555] hover:text-[#D4A84B] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors"
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
                    className="p-3 text-[#555] hover:text-[#D4A84B] hover:bg-[#111] flex justify-center border-r border-[#111] transition-colors"
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
                        ? "text-[#050505] bg-[#D4A84B] hover:bg-yellow-400"
                        : "text-[#555] hover:text-[#D4A84B] hover:bg-[#111]"
                    }`}
                    title="Open project (AI analyze from deployment logs)"
                  >
                    <BrainCircuit
                      size={14}
                      className={
                        project.status === "FAILED" ? "animate-pulse" : ""
                      }
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
