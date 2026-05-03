import { useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead } from "../../components/layout/PageLayout";
import { RefreshCw, Rocket, ShieldCheck, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Cpu, BarChart3, Download } from "lucide-react";
import { motion } from "framer-motion";

const Sparkline = ({ data, color }) => {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-14 h-7" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" points={pts} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

export default function Metrics() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [exporting, setExporting] = useState(false);

  const stats = [
    { title: "Total Deployments", value: "28",      change: "+12%", isPositive: true,  icon: Rocket,       sparklineData: [2,4,3,5,4,7,6],              sparklineColor: "#22c55e" },
    { title: "Success Rate",      value: "96.4%",   change: "+3.2%", isPositive: true, icon: ShieldCheck,  sparklineData: [90,92,91,95,94,96,97],       sparklineColor: "#22c55e" },
    { title: "Avg Deploy Time",   value: "2m 34s",  change: "-10s",  isPositive: true, icon: Clock,        sparklineData: [3.5,3.2,3.0,2.8,2.9,2.5,2.4], sparklineColor: "#3b82f6" },
    { title: "Failed Deploys",    value: "2",       change: "-33%",  isPositive: true, icon: AlertCircle,  sparklineData: [4,3,5,2,3,1,2],              sparklineColor: "#ef4444" },
  ];

  const analyticsData = [
    { id: "auth-service",     type: "build_success",  time: "14:22:01", status: "Completed" },
    { id: "payment-gateway",  type: "runtime_error",  time: "13:45:12", status: "Failed" },
    { id: "web-dashboard",    type: "config_sync",    time: "12:10:55", status: "Completed" },
    { id: "api-gateway",      type: "rollback",       time: "11:30:22", status: "Completed" },
  ];

  const exportAnalytics = () => {
    setExporting(true);
    const headers = ["Project", "Event", "Timestamp", "Status"];
    const rows = analyticsData.map(r => [r.id, r.type, r.time, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "velora_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setExporting(false), 1000);
  };

  // Generate mock heatmap data (7 days x 24 hours simplified to 7x12)
  const heatmapData = Array.from({ length: 7 * 12 }, () => Math.floor(Math.random() * 4));

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Metrics" subtitle="Real-time infrastructure performance monitoring">
            <GlassButton variant="secondary" className="gap-2">
              <RefreshCw size={13} /> Refresh
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
                      <div className="flex items-center justify-between mt-2.5">
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

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Deployment heatmap */}
              <Card className="lg:col-span-2">
                <CardHeader icon={BarChart3} title="Deployment Frequency">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#52525b] select-none">
                    Less
                    <div className="flex gap-1 mx-1">
                      {["bg-white/[0.04]", "bg-[#22c55e]/25", "bg-[#22c55e]/55", "bg-[#22c55e]"].map((c, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                      ))}
                    </div>
                    More
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-12 gap-1.5">
                    {heatmapData.map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.005 }}
                        className={`aspect-square rounded-[2px] transition-colors duration-500 hover:ring-1 hover:ring-white/20 ${
                          val === 0 ? "bg-white/[0.03]" :
                          val === 1 ? "bg-[#22c55e]/20" :
                          val === 2 ? "bg-[#22c55e]/50" :
                          "bg-[#22c55e]"
                        }`}
                        title={`Frequency: ${val}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest px-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </CardBody>
              </Card>

              {/* Resource allocation */}
              <Card>
                <CardHeader icon={Cpu} title="Resource Allocation" />
                <CardBody>
                  <div className="space-y-6">
                    {[
                      { label: "CPU Usage", val: "42%", pct: 42, color: "bg-white" },
                      { label: "Memory",    val: "68%", pct: 68, color: "bg-[#22c55e]" },
                      { label: "Network",   val: "15%", pct: 15, color: "bg-[#3b82f6]" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[12px] mb-2.5">
                          <span className="text-[#71717a] font-medium">{bar.label}</span>
                          <span className="text-white font-bold">{bar.val}</span>
                        </div>
                        <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${bar.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.pct}%` }}
                            transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* ── Analytics events table ── */}
            <Card noPad>
              <CardHeader icon={BarChart3} title="Recent Analytics Events">
                <GlassButton variant="secondary" className="h-8 px-3 text-xs gap-2" onClick={exportAnalytics} disabled={exporting}>
                  <Download size={12} /> {exporting ? "Exporting..." : "Export CSV"}
                </GlassButton>
              </CardHeader>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-[13px]">
                  <TableHead cols={["Project", "Event", "Timestamp", "Status"]} />
                  <tbody className="divide-y divide-white/[0.04]">
                    {analyticsData.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-7 py-5 text-[13px] font-semibold text-white">{row.id}</td>
                        <td className="px-7 py-5 text-[12px] font-mono text-[#71717a]">{row.type}</td>
                        <td className="px-7 py-5 text-[12px] font-mono text-[#52525b]">{row.time}</td>
                        <td className="px-7 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold
                            ${row.status === "Failed"
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
            </Card>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}