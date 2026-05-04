import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead, AlertBanner, EmptyState } from "../../components/layout/PageLayout";
import { RefreshCw, Rocket, ShieldCheck, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Cpu, BarChart3, Download } from "lucide-react";
import { motion } from "framer-motion";
import { getWorkspaceMetrics } from "../../api/api";

const Sparkline = ({ data, color }) => {
  if (!data?.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-14 h-7" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" points={pts} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const asNumber = (value) => {
  const parsed = Number.parseFloat(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function Metrics() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({
    stats: {},
    heatmap: [],
    resourceBreakdown: [],
    recentEvents: [],
  });

  const loadMetrics = async () => {
    const response = await getWorkspaceMetrics();
    setMetrics(response.data?.data || {
      stats: {},
      heatmap: [],
      resourceBreakdown: [],
      recentEvents: [],
    });
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getWorkspaceMetrics();
        if (!cancelled) {
          setMetrics(response.data?.data || {
            stats: {},
            heatmap: [],
            resourceBreakdown: [],
            recentEvents: [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load metrics");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const heatmapData = metrics.heatmap || [];
  const resourceBars = metrics.resourceBreakdown || [];
  const recentEvents = metrics.recentEvents || [];

  const statCards = useMemo(() => {
    const baseHeatmap = heatmapData.length ? heatmapData : [0, 0, 0, 0, 0, 0, 0];
    const slice = (from, to) => baseHeatmap.slice(from, to);

    return [
      {
        title: "Total Deployments",
        value: metrics.stats?.totalDeployments || "0",
        change: metrics.stats?.deltas?.totalDeployments || "0",
        isPositive: !String(metrics.stats?.deltas?.totalDeployments || "").startsWith("-"),
        icon: Rocket,
        sparklineData: slice(Math.max(baseHeatmap.length - 28, 0), Math.max(baseHeatmap.length - 21, 0) || baseHeatmap.length),
        sparklineColor: "#22c55e",
      },
      {
        title: "Success Rate",
        value: metrics.stats?.successRate || "0%",
        change: metrics.stats?.deltas?.successRate || "0/0",
        isPositive: true,
        icon: ShieldCheck,
        sparklineData: slice(Math.max(baseHeatmap.length - 21, 0), Math.max(baseHeatmap.length - 14, 0) || baseHeatmap.length),
        sparklineColor: "#22c55e",
      },
      {
        title: "Avg Deploy Time",
        value: metrics.stats?.avgBuildTime || "0s",
        change: metrics.stats?.deltas?.avgBuildTime || "0 samples",
        isPositive: true,
        icon: Clock,
        sparklineData: slice(Math.max(baseHeatmap.length - 14, 0), Math.max(baseHeatmap.length - 7, 0) || baseHeatmap.length),
        sparklineColor: "#3b82f6",
      },
      {
        title: "Failed Deploys",
        value: metrics.stats?.failedDeployments || "0",
        change: `${metrics.stats?.failedDeployments || "0"} total`,
        isPositive: asNumber(metrics.stats?.failedDeployments) === 0,
        icon: AlertCircle,
        sparklineData: slice(Math.max(baseHeatmap.length - 7, 0), baseHeatmap.length),
        sparklineColor: "#ef4444",
      },
    ];
  }, [metrics.stats, heatmapData]);

  const exportAnalytics = () => {
    setExporting(true);
    const headers = ["Project", "Event", "Timestamp", "Status"];
    const rows = recentEvents.map((event) => [
      event.project,
      event.event,
      new Date(event.timestamp).toISOString(),
      event.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "velora_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => setExporting(false), 500);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Metrics" subtitle="Real workspace metrics from deployments and projects">
            <GlassButton
              variant="secondary"
              className="gap-2"
              onClick={async () => {
                try {
                  setLoading(true);
                  setError("");
                  await loadMetrics();
                } catch (err) {
                  setError(err.response?.data?.message || "Failed to refresh metrics");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <RefreshCw size={13} /> Refresh
            </GlassButton>
          </PageHeader>

          {error && <AlertBanner type="error">{error}</AlertBanner>}

          {loading ? (
            <div className="px-2 py-8 text-[13px] text-[#71717a]">Loading metrics...</div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <Card className="p-6 flex flex-col gap-4" hover={false}>
                      <div className="flex items-start justify-between">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <item.icon size={15} className="text-[#52525b]" />
                        </div>
                        <div className="opacity-70">
                          <Sparkline data={item.sparklineData} color={item.sparklineColor} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[26px] font-bold text-white tracking-tight leading-none">{item.value}</p>
                        <div className="flex items-center justify-between mt-2.5 gap-2">
                          <p className="text-[11.5px] text-[#71717a] font-medium">{item.title}</p>
                          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${item.isPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                            {item.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {item.change}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="lg:col-span-2 overflow-hidden">
                  <CardHeader icon={BarChart3} title="Deployment Frequency" />
                  <CardBody>
                    {heatmapData.length === 0 ? (
                      <EmptyState icon={BarChart3} title="No deployment activity yet" subtitle="Once deployments run, the frequency map will populate here." />
                    ) : (
                      <div className="grid grid-cols-12 sm:grid-cols-14 md:grid-cols-21 gap-1.5">
                        {heatmapData.map((value, index) => (
                          <div
                            key={`${index}-${value}`}
                            className={`h-6 rounded-md transition-colors ${
                              value === 0
                                ? "bg-white/[0.03]"
                                : value === 1
                                  ? "bg-[#22c55e]/30"
                                  : value === 2
                                    ? "bg-[#22c55e]/55"
                                    : "bg-[#22c55e]"
                            }`}
                            title={`${value} deployments`}
                          />
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader icon={Cpu} title="Resource Allocation" />
                  <CardBody>
                    <div className="space-y-6">
                      {resourceBars.map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-[12px] mb-2.5">
                            <span className="text-[#71717a] font-medium">{bar.label}</span>
                            <span className="text-white font-bold">{bar.value}</span>
                          </div>
                          <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${bar.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${bar.pct}%` }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              <Card noPad>
                <CardHeader icon={BarChart3} title="Recent Analytics Events">
                  <GlassButton variant="secondary" className="h-8 px-3 text-xs gap-2" onClick={exportAnalytics} disabled={exporting || recentEvents.length === 0}>
                    <Download size={12} /> {exporting ? "Exporting..." : "Export CSV"}
                  </GlassButton>
                </CardHeader>
                {recentEvents.length === 0 ? (
                  <EmptyState icon={Rocket} title="No analytics events yet" subtitle="Deployment events will appear here once projects start shipping." />
                ) : (
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-[13px]">
                      <TableHead cols={["Project", "Event", "Timestamp", "Status"]} />
                      <tbody className="divide-y divide-white/[0.04]">
                        {recentEvents.map((row) => (
                          <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-7 py-5 text-[13px] font-semibold text-white">{row.project}</td>
                            <td className="px-7 py-5 text-[12px] font-mono text-[#71717a]">{row.event}</td>
                            <td className="px-7 py-5 text-[12px] font-mono text-[#52525b]">{new Date(row.timestamp).toLocaleString()}</td>
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
                )}
              </Card>
            </div>
          )}
        </PageShell>
      </PageWrapper>
    </div>
  );
}
