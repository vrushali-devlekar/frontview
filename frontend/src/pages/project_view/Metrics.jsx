import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead, EmptyState } from "../../components/layout/PageLayout";
import { RefreshCw, Rocket, ShieldCheck, Clock, AlertCircle, ArrowUpRight, Cpu, BarChart3, Download, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { getWorkspaceMetrics } from "../../api/api";

const Sparkline = ({ data = [], color }) => {
  const values = data.length ? data : [0, 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-14 h-7" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const formatDateTime = (value) => {
  if (!value) return "No timestamp";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function Metrics() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getWorkspaceMetrics();
      setMetrics(response.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspace metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMetrics();
  }, []);

  const heatmap = metrics?.heatmap || [];
  const stats = metrics?.stats || {};
  const deltas = stats?.deltas || {};
  const recentEvents = metrics?.recentEvents || [];
  const resourceBreakdown = metrics?.resourceBreakdown || [];

  const statCards = useMemo(() => {
    const sparkline = heatmap.length ? heatmap.slice(-14) : [0, 0, 0, 0, 0, 0, 0];
    return [
      {
        title: "Total Deployments",
        value: stats.totalDeployments || "0",
        change: deltas.totalDeployments || "0",
        icon: Rocket,
        sparklineData: sparkline,
        sparklineColor: "#22c55e",
      },
      {
        title: "Success Rate",
        value: stats.successRate || "0%",
        change: deltas.successRate || "0/0",
        icon: ShieldCheck,
        sparklineData: sparkline.map((value) => Math.max(value, 0)),
        sparklineColor: "#22c55e",
      },
      {
        title: "Avg Deploy Time",
        value: stats.avgBuildTime || "0s",
        change: deltas.avgBuildTime || "0 samples",
        icon: Clock,
        sparklineData: sparkline,
        sparklineColor: "#3b82f6",
      },
      {
        title: "Failed Deploys",
        value: stats.failedDeployments || "0",
        change: stats.runningDeployments ? `${stats.runningDeployments} running` : "0 running",
        icon: AlertCircle,
        sparklineData: sparkline,
        sparklineColor: "#ef4444",
      },
    ];
  }, [deltas, heatmap, stats]);

  const exportAnalytics = () => {
    setExporting(true);
    const headers = ["Project", "Event", "Timestamp", "Status"];
    const rows = recentEvents.map((row) => [
      row.project,
      row.event,
      row.timestamp ? new Date(row.timestamp).toISOString() : "",
      row.status,
    ]);
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(",")}\n${rows
      .map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      .join("\n")}`;

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "velora_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => setExporting(false), 500);
  };

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
          <PageHeader title="Metrics" subtitle="Workspace performance calculated from your real projects and deployments">
            <GlassButton variant="secondary" className="gap-2" onClick={fetchMetrics} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} /> Refresh
            </GlassButton>
          </PageHeader>

          {error && (
            <div className="mb-5 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/10 px-4 py-3 text-[13px] text-[#f87171]">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {statCards.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <Card className="p-5 md:p-6 flex flex-col gap-4 min-h-[150px]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                        <item.icon size={15} className="text-[#a1a1aa]" />
                      </div>
                      <div className="opacity-80">
                        <Sparkline data={item.sparklineData} color={item.sparklineColor} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[24px] md:text-[26px] font-bold text-white tracking-tight leading-none">{isLoading ? "..." : item.value}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
                        <p className="text-[11.5px] text-[#71717a] font-medium">{item.title}</p>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#22c55e]">
                          <ArrowUpRight size={12} />
                          {item.change}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <Card className="xl:col-span-2">
                <CardHeader icon={BarChart3} title="Deployment Frequency">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#52525b] select-none">
                    Less
                    <div className="flex gap-1 mx-1">
                      {["bg-white/[0.04]", "bg-[#22c55e]/25", "bg-[#22c55e]/55", "bg-[#22c55e]"].map((c) => (
                        <div key={c} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {heatmap.length ? (
                    <>
                      <div className="grid grid-cols-12 gap-1.5">
                        {heatmap.map((val, i) => (
                          <motion.div
                            key={`${i}-${val}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.004 }}
                            className={`aspect-square rounded-[2px] transition-colors duration-500 hover:ring-1 hover:ring-white/20 ${
                              val === 0 ? "bg-white/[0.03]" :
                              val === 1 ? "bg-[#22c55e]/20" :
                              val === 2 ? "bg-[#22c55e]/50" :
                              "bg-[#22c55e]"
                            }`}
                            title={`Deployments: ${val}`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest px-1">
                        <span>84h ago</span>
                        <span>Now</span>
                      </div>
                    </>
                  ) : (
                    <EmptyState icon={Activity} title="No deployments yet" subtitle="Metrics will appear after your first deployment runs." />
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader icon={Cpu} title="Resource Allocation" />
                <CardBody>
                  {resourceBreakdown.length ? (
                    <div className="space-y-6">
                      {resourceBreakdown.map((bar, i) => (
                        <div key={bar.label}>
                          <div className="flex justify-between gap-3 text-[12px] mb-2.5">
                            <span className="text-[#71717a] font-medium">{bar.label}</span>
                            <span className="text-white font-bold">{bar.value}</span>
                          </div>
                          <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${bar.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(Math.max(Number(bar.pct) || 0, 0), 100)}%` }}
                              transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Cpu} title="No resource data" subtitle="Deployment activity will populate this panel." />
                  )}
                </CardBody>
              </Card>
            </div>

            <Card noPad>
              <CardHeader icon={BarChart3} title="Recent Analytics Events">
                <GlassButton variant="secondary" className="h-8 px-3 text-xs gap-2" onClick={exportAnalytics} disabled={exporting || recentEvents.length === 0}>
                  <Download size={12} /> {exporting ? "Exporting..." : "Export CSV"}
                </GlassButton>
              </CardHeader>
              {recentEvents.length ? (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full min-w-[680px] text-[13px]">
                    <TableHead cols={["Project", "Event", "Timestamp", "Status"]} />
                    <tbody className="divide-y divide-white/[0.04]">
                      {recentEvents.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-7 py-5 text-[13px] font-semibold text-white">{row.project}</td>
                          <td className="px-7 py-5 text-[12px] font-mono text-[#71717a]">{row.event}</td>
                          <td className="px-7 py-5 text-[12px] font-mono text-[#52525b]">{formatDateTime(row.timestamp)}</td>
                          <td className="px-7 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                              row.status === "Failed"
                                ? "text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20"
                                : "text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Failed" ? "bg-[#ef4444]" : "bg-[#22c55e]"}`} />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon={BarChart3} title={isLoading ? "Loading events..." : "No analytics events"} subtitle={isLoading ? "" : "Deployment history will appear here automatically."} />
              )}
            </Card>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
