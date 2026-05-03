import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import {
  PageShell,
  PageHeader,
  Card,
  EmptyState,
} from "../../components/layout/PageLayout";
import {
  Search,
  Plus,
  Globe,
  GitBranch,
  Terminal,
  Layers,
  Settings,
  Clock,
  Rocket,
} from "lucide-react";
import { getProjects } from "../../api/api";
import GlassButton from "../../components/ui/GlassButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { motion } from "framer-motion";

export default function Overview() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
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
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.repoUrl?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [projects, searchQuery],
  );

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        navMode={navMode}
        toggleNavMode={toggleNavMode}
      />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader
            title="Applications"
            subtitle="Manage and deploy your applications"
          >
            <GlassButton
              variant="primary"
              className="bg-green-600 backdrop-blur-md border border-green-500 hover:bg-green-700"
              onClick={() => navigate("/projects/new")}
            >
              <Plus size={14} /> New Project
            </GlassButton>
          </PageHeader>

          {/* Search + count row */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300"
              />
              <input
                type="text"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-4 text-[12px] w-48 bg-transparent backdrop-blur-md border border-green-500 rounded-lg text-white placeholder:text-green-300 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
            <p className="text-[13px] text-green-200">
              {loading
                ? "Loading…"
                : `${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-52 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <Card
              noPad
              className="bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90"
            >
              <EmptyState
                icon={searchQuery ? Globe : Rocket}
                title={searchQuery ? "No projects found" : "No projects yet"}
                subtitle={
                  searchQuery
                    ? "Try a different search term"
                    : "Deploy your first application"
                }
              >
                {!searchQuery && (
                  <GlassButton
                    variant="primary"
                    className="bg-green-600 backdrop-blur-md border border-green-500 hover:bg-green-700"
                    onClick={() => navigate("/projects/new")}
                  >
                    <Plus size={14} /> Create Project
                  </GlassButton>
                )}
              </EmptyState>
            </Card>
          )}

          {/* Projects grid */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project) => (
                <motion.div
                  key={project._id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Card
                    className="group flex flex-col h-full bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90 transition-all duration-300"
                    onClick={() => navigate(`/deploy?projectId=${project._id}`)}
                  >
                    {/* Card body */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/20 flex items-center justify-center shrink-0">
                            <Globe size={14} className="text-green-300" />
                          </div>
                          <p className="text-[14px] font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {project.name}
                          </p>
                        </div>
                        <StatusBadge
                          status={project.lastDeploymentStatus || "RUNNING"}
                        />
                      </div>

                      <div className="space-y-2.5 ml-[48px]">
                        <div className="flex items-center gap-2">
                          <GitBranch
                            size={11}
                            className="text-green-300 shrink-0"
                          />
                          <span className="text-[11.5px] text-green-200 font-mono">
                            {project.branch || "main"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock
                            size={11}
                            className="text-green-300 shrink-0"
                          />
                          <span className="text-[11.5px] text-green-200">
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        {project.repoUrl && (
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe
                              size={11}
                              className="text-green-300 shrink-0"
                            />
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11.5px] text-emerald-400 hover:underline truncate"
                            >
                              {project.repoUrl.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card footer */}
                    <div
                      className="flex border-t border-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        {
                          icon: Terminal,
                          label: "Logs",
                          fn: () =>
                            navigate(`/deploy?projectId=${project._id}`),
                        },
                        {
                          icon: Layers,
                          label: "Deploys",
                          fn: () =>
                            navigate(`/deploy?projectId=${project._id}`),
                        },
                        {
                          icon: Settings,
                          label: "Settings",
                          fn: () =>
                            navigate(`/settings?projectId=${project._id}`),
                        },
                      ].map(({ icon: Icon, label, fn }, i) => (
                        <button
                          key={i}
                          onClick={fn}
                          className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 text-green-300 hover:text-white hover:bg-green-600/20 transition-colors border-r border-white/10 last:border-0"
                        >
                          <Icon size={13} strokeWidth={1.75} />
                          <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em]">
                            {label}
                          </span>
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
    </div>
  );
}
