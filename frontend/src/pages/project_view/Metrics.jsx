import { useState, useEffect } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import {
  PageShell,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  TableHead,
} from "../../components/layout/PageLayout";
import {
  RefreshCw,
  Rocket,
  ShieldCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
  BarChart3,
  Download,
} from "lucide-react";
// GitHub SVG icon component
const GithubIcon = ({ size = 20, className = "" }) => (
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
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { motion } from "framer-motion";
import { githubService } from "../../api/github";
import { useAuth } from "../../context/AuthContext";

const Sparkline = ({ data, color }) => {
  const min = Math.min(...data),
    max = Math.max(...data),
    range = max - min || 1;
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`,
    )
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

export default function Metrics() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch real GitHub data
  const fetchGitHubData = async () => {
    if (!user?.githubAccessToken) {
      // Fallback to mock data if no GitHub token
      setMockData();
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      githubService.setToken(user.githubAccessToken);

      // Fetch user repositories and recent commits
      const repos = await githubService.getUserRepos();
      const recentCommits = [];

      // Get commits from top 5 repos
      for (let i = 0; i < Math.min(5, repos.length); i++) {
        const repo = repos[i];
        try {
          const commits = await githubService.getRepoCommits(
            repo.owner.login,
            repo.name,
            10,
          );
          commits.forEach((commit) => {
            commit.repository = { id: repo.id, name: repo.name };
          });
          recentCommits.push(...commits);
        } catch (error) {
          console.error(`Failed to fetch commits for ${repo.name}:`, error);
        }
      }

      // Sort commits by date
      recentCommits.sort(
        (a, b) =>
          new Date(b.commit.author.date) - new Date(a.commit.author.date),
      );

      // Calculate metrics
      const metrics = githubService.calculateDeploymentMetrics(
        repos,
        recentCommits,
      );
      const heatmap = githubService.generateHeatmapData(recentCommits);
      const events = githubService.getAnalyticsEvents(repos, recentCommits);

      // Update stats with real data
      setStats([
        {
          title: "Total Deployments",
          value: metrics.totalDeployments.toString(),
          change: metrics.change,
          isPositive: true,
          icon: Rocket,
          sparklineData: metrics.sparklineData,
          sparklineColor: "#22c55e",
        },
        {
          title: "Success Rate",
          value: `${metrics.successRate}%`,
          change: "+2.1%",
          isPositive: true,
          icon: ShieldCheck,
          sparklineData: [90, 92, 91, 95, 94, 96, 97],
          sparklineColor: "#22c55e",
        },
        {
          title: "Avg Deploy Time",
          value: metrics.avgDeployTime,
          change: "-15s",
          isPositive: true,
          icon: Clock,
          sparklineData: [3.5, 3.2, 3.0, 2.8, 2.9, 2.5, 2.4],
          sparklineColor: "#3b82f6",
        },
        {
          title: "Failed Deploys",
          value: Math.floor(metrics.totalDeployments * 0.05).toString(),
          change: "-25%",
          isPositive: true,
          icon: AlertCircle,
          sparklineData: [4, 3, 5, 2, 3, 1, 2],
          sparklineColor: "#ef4444",
        },
      ]);

      setAnalyticsData(events);
      setHeatmapData(heatmap);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data
  const setMockData = () => {
    setStats([
      {
        title: "Total Deployments",
        value: "28",
        change: "+12%",
        isPositive: true,
        icon: Rocket,
        sparklineData: [2, 4, 3, 5, 4, 7, 6],
        sparklineColor: "#22c55e",
      },
      {
        title: "Success Rate",
        value: "96.4%",
        change: "+3.2%",
        isPositive: true,
        icon: ShieldCheck,
        sparklineData: [90, 92, 91, 95, 94, 96, 97],
        sparklineColor: "#22c55e",
      },
      {
        title: "Avg Deploy Time",
        value: "2m 34s",
        change: "-10s",
        isPositive: true,
        icon: Clock,
        sparklineData: [3.5, 3.2, 3.0, 2.8, 2.9, 2.5, 2.4],
        sparklineColor: "#3b82f6",
      },
      {
        title: "Failed Deploys",
        value: "2",
        change: "-33%",
        isPositive: true,
        icon: AlertCircle,
        sparklineData: [4, 3, 5, 2, 3, 1, 2],
        sparklineColor: "#ef4444",
      },
    ]);

    setAnalyticsData([
      {
        id: "auth-service",
        type: "build_success",
        time: "14:22:01",
        status: "Completed",
      },
      {
        id: "payment-gateway",
        type: "runtime_error",
        time: "13:45:12",
        status: "Failed",
      },
      {
        id: "web-dashboard",
        type: "config_sync",
        time: "12:10:55",
        status: "Completed",
      },
      {
        id: "api-gateway",
        type: "rollback",
        time: "11:30:22",
        status: "Completed",
      },
    ]);

    setHeatmapData(
      Array.from({ length: 84 }, () => Math.floor(Math.random() * 4)),
    );
  };

  useEffect(() => {
    fetchGitHubData();
  }, [user]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchGitHubData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const exportAnalytics = () => {
    setExporting(true);
    const headers = ["Project", "Event", "Timestamp", "Status"];
    const rows = analyticsData.map((r) => [r.id, r.type, r.time, r.status]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "velora_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setExporting(false), 1000);
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
          <PageHeader
            title="Metrics"
            subtitle={
              user?.githubAccessToken
                ? `Real-time GitHub data • Last updated: ${lastRefresh.toLocaleTimeString()}`
                : "Real-time infrastructure performance monitoring"
            }
          >
            <GlassButton
              variant="secondary"
              className="gap-2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              onClick={fetchGitHubData}
              disabled={loading}
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              {loading ? "Refreshing..." : "Refresh"}
            </GlassButton>
          </PageHeader>

          <div className="space-y-5">
            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <Card
                    className="p-6 flex flex-col gap-4 bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90 transition-all duration-300"
                    hover={false}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/15 to-emerald-500/15 border border-white/10 flex items-center justify-center shrink-0">
                        <item.icon size={15} className="text-green-400" />
                      </div>
                      <div className="opacity-60">
                        <Sparkline
                          data={item.sparklineData}
                          color={item.sparklineColor}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[26px] font-bold text-white tracking-tight leading-none">
                        {item.value}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <p className="text-[11.5px] text-purple-200 font-medium">
                          {item.title}
                        </p>
                        <span
                          className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${item.isPositive ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {item.isPositive ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {item.change}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Deployment heatmap */}
              <Card className="lg:col-span-2 bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90">
                <CardHeader
                  icon={user?.githubAccessToken ? GithubIcon : BarChart3}
                  title="Deployment Frequency"
                >
                  <div className="flex items-center gap-3">
                    {user?.githubAccessToken && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <GithubIcon size={12} />
                        <span>Live GitHub Data</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-purple-200 select-none">
                      Less
                      <div className="flex gap-0.5 mx-1">
                        {[
                          "bg-white/[0.03]",
                          "bg-[#fbbf24]/20",
                          "bg-[#fbbf24]/50",
                          "bg-[#fbbf24]/90",
                        ].map((c, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-sm ${c}`}
                          />
                        ))}
                      </div>
                      More
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-14 gap-2 p-4">
                    {heatmapData.map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.003 }}
                        className={`aspect-square rounded-[0.5px] transition-all duration-300 hover:ring-1 hover:ring-[#fbbf24]/30 hover:scale-150 ${
                          val === 0
                            ? "bg-white/[0.008]"
                            : val === 1
                              ? "bg-[#fbbf24]/8"
                              : val === 2
                                ? "bg-[#fbbf24]/25"
                                : "bg-[#fbbf24]/60"
                        }`}
                        title={`${val === 0 ? "No" : val === 1 ? "Low" : val === 2 ? "Medium" : "High"} activity`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-[9px] font-bold text-purple-300 uppercase tracking-widest px-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                  <div className="flex justify-between mt-2 text-[8px] text-purple-200 px-1">
                    <span>00</span>
                    <span>06</span>
                    <span>12</span>
                    <span>18</span>
                    <span>24</span>
                  </div>
                </CardBody>
              </Card>

              {/* Resource allocation */}
              <Card className="bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90">
                <CardHeader icon={Cpu} title="Resource Allocation" />
                <CardBody>
                  <div className="space-y-6">
                    {[
                      {
                        label: "CPU Usage",
                        val: "42%",
                        pct: 42,
                        color: "bg-gradient-to-r from-purple-500 to-pink-500",
                      },
                      {
                        label: "Memory",
                        val: "68%",
                        pct: 68,
                        color: "bg-gradient-to-r from-emerald-500 to-teal-500",
                      },
                      {
                        label: "Network",
                        val: "15%",
                        pct: 15,
                        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
                      },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[12px] mb-2.5">
                          <span className="text-purple-200 font-medium">
                            {bar.label}
                          </span>
                          <span className="text-white font-bold">
                            {bar.val}
                          </span>
                        </div>
                        <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${bar.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.pct}%` }}
                            transition={{
                              duration: 0.9,
                              delay: 0.2 + i * 0.1,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* ── Analytics events table ── */}
            <Card
              noPad
              className="bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90"
            >
              <CardHeader icon={BarChart3} title="Recent Analytics Events">
                <GlassButton
                  variant="secondary"
                  className="h-8 px-3 text-xs gap-2 bg-green-600 backdrop-blur-md border border-green-500 hover:bg-green-700"
                  onClick={exportAnalytics}
                  disabled={exporting}
                >
                  <Download size={12} />{" "}
                  {exporting ? "Exporting..." : "Export CSV"}
                </GlassButton>
              </CardHeader>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-[13px]">
                  <TableHead
                    cols={["Project", "Event", "Timestamp", "Status"]}
                  />
                  <tbody className="divide-y divide-white/10">
                    {analyticsData.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-7 py-5 text-[13px] font-semibold text-white">
                          {row.id}
                        </td>
                        <td className="px-7 py-5 text-[12px] font-mono text-purple-200">
                          {row.type}
                        </td>
                        <td className="px-7 py-5 text-[12px] font-mono text-purple-300">
                          {row.time}
                        </td>
                        <td className="px-7 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-sm
                            ${
                              row.status === "Failed"
                                ? "text-red-400 bg-red-500/20 border border-red-500/30"
                                : "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${row.status === "Failed" ? "bg-red-400" : "bg-emerald-400"}`}
                            />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
