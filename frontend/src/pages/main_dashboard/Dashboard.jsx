import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rocket,
  Folder,
  Terminal,
  History,
  Settings,
  ArrowUpRight,
  Shield,
  Clock,
  Plus,
  GitBranch,
  Globe,
  Activity,
  TrendingUp,
  AlertTriangle,
  Layers
} from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { EmptyState } from "../../components/layout/PageLayout";
import { getWorkspaceOverview } from "../../api/api";

const StatusDot = ({ status }) => {
  const colors = {
    RUNNING: "bg-[#22c55e]",
    FAILED: "bg-[#ef4444]",
    BUILDING: "bg-[#eab308]",
    INACTIVE: "bg-[#52525b]",
  };
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colors[status] || "bg-[#52525b]"}`} />;
};

const StatusBadge = ({ status }) => {
  const map = {
    RUNNING: { cls: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20", label: "Running" },
    FAILED: { cls: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20", label: "Failed" },
    BUILDING: { cls: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20", label: "Building" },
    INACTIVE: { cls: "bg-white/[0.05] text-[#71717a] border-white/10", label: "Inactive" },
  };
  const cfg = map[status] || { cls: "bg-white/[0.05] text-[#71717a] border-white/10", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${cfg.cls}`}>
      <StatusDot status={status} />
      {cfg.label}
    </span>
  );
};

const Spark = ({ data, color = "#22c55e" }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 56;
  const H = 24;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

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

const StatCard = ({ label, value, delta, Icon, iconColor, sparkData, sparkColor }) => (
  <BentoCard hover={false} className="p-5 md:p-7 flex flex-col justify-between gap-6">
    <div className="flex items-start justify-between gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <Spark data={sparkData} color={sparkColor} />
    </div>
    <div>
      <p className="text-[26px] md:text-[30px] font-bold text-white tracking-tight leading-none">{value}</p>
      <div className="flex items-center justify-between gap-3 mt-3">
        <p className="text-[12px] text-[#71717a] font-medium">{label}</p>
        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#22c55e]">
          <ArrowUpRight size={12} />
          {delta}
        </span>
      </div>
    </div>
  </BentoCard>
);

export default function Dashboard() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    stats: {
      totalProjects: "0",
      totalDeployments: "0",
      successRate: "0%",
      avgBuildTime: "0s",
      failedDeployments: "0",
      runningDeployments: "0",
      deltas: {
        totalProjects: "0",
        totalDeployments: "0",
        successRate: "0/0",
        avgBuildTime: "0 samples",
      },
      activityBars: [],
    },
    recentDeployments: [],
    projects: [],
    environmentPreview: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadOverview = async () => {
      setLoading(true);
      try {
        const { data } = await getWorkspaceOverview();
        if (!ignore && data?.data) {
          setOverview(data.data);
        }
      } catch (error) {
        if (!ignore) {
          setOverview((prev) => ({ ...prev, recentDeployments: [], projects: [], environmentPreview: [] }));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadOverview();
    return () => {
      ignore = true;
    };
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: overview.stats.totalProjects,
      delta: overview.stats.deltas.totalProjects,
      Icon: Folder,
      iconColor: "bg-[#22c55e]/10 text-[#22c55e]",
      sparkData: [...(overview.stats.activityBars || []).slice(-7), Number(overview.stats.totalProjects) || 0],
      sparkColor: "#22c55e",
    },
    {
      label: "Deployments",
      value: overview.stats.totalDeployments,
      delta: overview.stats.deltas.totalDeployments,
      Icon: Rocket,
      iconColor: "bg-[#3b82f6]/10 text-[#3b82f6]",
      sparkData: overview.stats.activityBars || [0, 0],
      sparkColor: "#3b82f6",
    },
    {
      label: "Success Rate",
      value: overview.stats.successRate,
      delta: overview.stats.deltas.successRate,
      Icon: Shield,
      iconColor: "bg-[#a855f7]/10 text-[#a855f7]",
      sparkData: [
        Number(overview.stats.successRate.replace("%", "")) || 0,
        Number(overview.stats.successRate.replace("%", "")) || 0,
      ],
      sparkColor: "#a855f7",
    },
    {
      label: "Avg Build",
      value: overview.stats.avgBuildTime,
      delta: overview.stats.deltas.avgBuildTime,
      Icon: Clock,
      iconColor: "bg-[#eab308]/10 text-[#eab308]",
      sparkData: overview.stats.activityBars || [0, 0],
      sparkColor: "#eab308",
    },
  ];

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#050505] text-white font-sans">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8 max-w-[1400px] mx-auto pb-24 md:pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8 pb-6 border-b border-white/[0.06]">
              <div>
                <h1 className="text-[22px] md:text-[28px] font-bold text-white tracking-tight leading-tight">Overview</h1>
                <p className="text-[13px] text-[#52525b] mt-1.5">
                  Your live workspace health, recent deployments, and environment summary.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <GlassButton variant="secondary" onClick={() => navigate("/projects/new")}>
                  <Plus size={14} /> New Project
                </GlassButton>
                <GlassButton variant="primary" onClick={() => navigate("/deploy")}>
                  <Rocket size={14} /> Deploy
                </GlassButton>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="col-span-12 sm:col-span-6 xl:col-span-3"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}

              <motion.div
                className="col-span-12 xl:col-span-7"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.28 }}
              >
                <BentoCard hover={false} className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 md:px-6 py-5 border-b border-white/[0.06]">
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
                    {loading ? (
                      <div className="px-6 py-8 text-[13px] text-[#71717a]">Loading recent deployments...</div>
                    ) : overview.recentDeployments.length === 0 ? (
                      <div className="px-6 py-8 text-[13px] text-[#71717a]">No deployments yet.</div>
                    ) : (
                      overview.recentDeployments.map((deployment) => (
                        <div
                          key={deployment.id}
                          onClick={() => navigate(`/deploy?projectId=${deployment.projectId}`)}
                          className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 px-4 md:px-6 py-4 hover:bg-white/[0.025] cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <StatusDot status={deployment.status} />
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-white truncate group-hover:text-[#e4e4e7] transition-colors">
                                {deployment.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <GitBranch size={10} className="text-[#3f3f46] shrink-0" />
                                <span className="text-[11px] text-[#3f3f46] font-mono truncate">
                                  {deployment.branch} • {deployment.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-3">
                            <StatusBadge status={deployment.status} />
                            <span className="text-[11px] text-[#3f3f46] shrink-0">
                              {new Date(deployment.time).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </BentoCard>
              </motion.div>

              <div className="col-span-12 xl:col-span-5 flex flex-col gap-4 md:gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.32 }}
                >
                  <BentoCard hover={false} className="px-5 md:px-6 py-6">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[14px] font-semibold text-white">Deployment Activity</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={13} className="text-[#22c55e]" />
                        <span className="text-[13px] font-bold text-[#22c55e]">
                          {overview.stats.runningDeployments} live
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end gap-[2px] h-10 w-full">
                      {(overview.stats.activityBars || []).map((value, idx) => {
                        const max = Math.max(...(overview.stats.activityBars || [1]), 1);
                        return (
                          <div
                            key={idx}
                            style={{ height: `${Math.max(10, (value / max) * 100)}%` }}
                            className="flex-1 rounded-[2px] bg-[#22c55e]/40 hover:bg-[#22c55e]/70 transition-colors"
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[10.5px] text-[#2d2d33] mt-3 font-mono select-none">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </BentoCard>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.36 }}
                    className="h-full"
                  >
                    <BentoCard hover={false} className="px-5 py-5 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[13px] font-semibold text-white">Failures</p>
                        <AlertTriangle size={13} className="text-[#ef4444]" />
                      </div>
                      <p className="text-[28px] font-bold text-white">{overview.stats.failedDeployments}</p>
                      <p className="text-[11px] text-[#3f3f46] font-medium mt-auto">
                        Failed deployments in your workspace
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
                        <p className="text-[13px] font-semibold text-white">Secrets</p>
                        <button
                          onClick={() => navigate("/environments")}
                          className="text-[11px] text-[#52525b] hover:text-white transition-colors font-medium"
                        >
                          Edit →
                        </button>
                      </div>
                      <div className="flex flex-col divide-y divide-white/[0.04] flex-1">
                        {overview.environmentPreview.length === 0 ? (
                          <div className="px-5 py-5 text-[12px] text-[#71717a]">No environment variables saved yet.</div>
                        ) : (
                          overview.environmentPreview.map((env) => (
                            <div key={`${env.projectId}-${env.key}`} className="flex items-center justify-between px-5 py-3.5 gap-3">
                              <div className="min-w-0">
                                <span className="text-[11px] font-mono text-[#3b82f6] truncate block">{env.key}</span>
                                <span className="text-[10px] text-[#3f3f46] truncate block">{env.projectName}</span>
                              </div>
                              <span className="text-[11px] font-mono text-[#2d2d33] shrink-0">{env.masked}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </BentoCard>
                  </motion.div>
                </div>
              </div>

              <div className="col-span-12 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <p className="text-[16px] font-bold text-white">Projects</p>
                    {!loading && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] font-semibold text-[#71717a]">
                        {overview.projects.length}
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

                {!loading && overview.projects.length === 0 && (
                  <BentoCard hover={false} className="mb-10">
                    <EmptyState
                      icon={Rocket}
                      title="No projects yet"
                      subtitle="Deploy your first application to unlock dashboard activity."
                    >
                      <GlassButton variant="primary" onClick={() => navigate("/projects/new")}>
                        <Plus size={14} /> Create project
                      </GlassButton>
                    </EmptyState>
                  </BentoCard>
                )}

                {!loading && overview.projects.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
                  >
                    {overview.projects.map((project) => (
                      <motion.div
                        key={project.id}
                        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                      >
                        <BentoCard className="group flex flex-col" onClick={() => navigate(`/deploy?projectId=${project.id}`)}>
                          <div className="px-5 md:px-6 py-6 flex-1">
                            <div className="flex items-start justify-between gap-3 mb-5">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-[#18181b] border border-white/[0.08] flex items-center justify-center text-[#22c55e] shrink-0">
                                  <Globe size={15} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13.5px] font-semibold text-white truncate group-hover:text-[#22c55e] transition-colors">
                                    {project.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <GitBranch size={10} className="text-[#3f3f46] shrink-0" />
                                    <span className="text-[11px] text-[#3f3f46] font-mono">{project.branch}</span>
                                  </div>
                                </div>
                              </div>
                              <StatusBadge status={project.status} />
                            </div>

                            <div className="flex items-center gap-2 text-[12px] text-[#71717a]">
                              <Layers size={12} />
                              <span>{project.variables} environment variables</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 border-t border-white/[0.05]">
                            {[
                              { icon: Terminal, label: "Logs", fn: () => navigate(`/deploy?projectId=${project.id}`) },
                              { icon: History, label: "Deploys", fn: () => navigate(`/deploy?projectId=${project.id}`) },
                              { icon: Settings, label: "Config", fn: () => navigate(`/settings?projectId=${project.id}`) },
                              { icon: Globe, label: "Env", fn: () => navigate(`/settings?projectId=${project.id}`) },
                            ].map(({ icon: Icon, label, fn }) => (
                              <button
                                key={label}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  fn();
                                }}
                                className="flex flex-col items-center justify-center gap-1.5 py-4 text-[#3f3f46] hover:text-white hover:bg-white/[0.04] transition-colors border-r border-white/[0.05] last:border-r-0"
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
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
