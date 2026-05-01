import { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import TopNav from "../dashboard/TopNav";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Shield,
  Layers,
  Database,
  Globe,
  Box
} from "lucide-react";

import heroBg from "../../assets/new-top.png";

const Sparkline = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-8 preserve-aspect-ratio-none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="4"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default function Metrics() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const stats = [
    {
      title: "Deployments",
      value: "28",
      change: "+12%",
      isPositive: true,
      vs: "vs last 7 days",
      icon: Rocket,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      sparklineData: [2, 4, 3, 5, 4, 7, 6],
      sparklineColor: "#4ade80"
    },
    {
      title: "Success Rate",
      value: "96.4%",
      change: "+3.2%",
      isPositive: true,
      vs: "vs last 7 days",
      icon: ShieldCheck,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      sparklineData: [90, 92, 91, 95, 94, 96, 97],
      sparklineColor: "#4ade80"
    },
    {
      title: "Avg. Deploy Time",
      value: "2m 34s",
      change: "-10s",
      isPositive: false,
      isYellow: true,
      vs: "vs last 7 days",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      sparklineData: [3.5, 3.2, 3.0, 2.8, 2.9, 2.5, 2.4],
      sparklineColor: "#facc15"
    },
    {
      title: "Failed Deployments",
      value: "2",
      change: "-33%",
      isPositive: false,
      isRed: true,
      vs: "vs last 7 days",
      icon: AlertCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      sparklineData: [4, 3, 5, 2, 3, 1, 2],
      sparklineColor: "#f87171"
    }
  ];

  const topProjects = [
    { name: "User Auth Service", deploys: 12, max: 12, color: "bg-green-500", icon: Shield, iconBg: "bg-green-500/10", iconColor: "text-green-500" },
    { name: "Frontend Web", deploys: 8, max: 12, color: "bg-blue-500", icon: Globe, iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
    { name: "Payment Service", deploys: 4, max: 12, color: "bg-yellow-500", icon: Layers, iconBg: "bg-yellow-500/10", iconColor: "text-yellow-500" },
    { name: "Data Ingest Service", deploys: 3, max: 12, color: "bg-green-500", icon: Database, iconBg: "bg-green-500/10", iconColor: "text-green-500" },
    { name: "Notification Service", deploys: 1, max: 12, color: "bg-slate-500", icon: Box, iconBg: "bg-slate-500/10", iconColor: "text-slate-500" },
  ];

  const recentDeploys = [
    { project: "User Auth Service", icon: Shield, iconBg: "bg-green-500/10", iconColor: "text-green-500", env: "production", status: "Success", user: "Sheryian", time: "2m ago", duration: "2m 18s" },
    { project: "Frontend Web", icon: Globe, iconBg: "bg-purple-500/10", iconColor: "text-purple-500", env: "production", status: "Success", user: "Sheryian", time: "15m ago", duration: "1m 45s" },
    { project: "Payment Service", icon: Layers, iconBg: "bg-yellow-500/10", iconColor: "text-yellow-500", env: "staging", status: "Failed", user: "Sheryian", time: "1h ago", duration: "-" },
  ];

  const calendarMonths = [
    { name: 'May', weeks: 4 },
    { name: 'Jun', weeks: 4 },
    { name: 'Jul', weeks: 4 },
    { name: 'Aug', weeks: 4 },
    { name: 'Sep', weeks: 4 },
    { name: 'Oct', weeks: 4 },
    { name: 'Nov', weeks: 4 },
    { name: 'Dec', weeks: 4 },
    { name: 'Jan', weeks: 4 },
    { name: 'Feb', weeks: 4 },
    { name: 'Mar', weeks: 4 },
    { name: 'Apr', weeks: 4 },
    { name: 'May', weeks: 4 },
  ];

  const getCalendarColor = (value) => {
    switch(value) {
      case 4: return "bg-[#22c55e]"; 
      case 3: return "bg-[#16a34a]"; 
      case 2: return "bg-[#15803d]"; 
      case 1: return "bg-[#14532d]"; 
      case 0: 
      default: return "bg-white/5"; 
    }
  };

  return (
    <div 
      className="flex h-screen overflow-hidden bg-[#0b0f14] text-white"
      style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300
        ${isCollapsed ? "ml-[72px]" : "ml-[260px]"}`}
      >
        {/* HERO */}
        <div
          className="relative shrink-0 min-h-[120px] md:min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-white/10"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

          <TopNav />

          <div className="relative z-10 px-4 pb-3">
            <h1 className="text-xl md:text-2xl leading-relaxed" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Metrics
            </h1>
            <p className="text-[7px] md:text-[9px] text-slate-300 mt-2 leading-loose" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Real-time insights and performance overview across all projects.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-2 md:p-3 gap-2 overflow-hidden bg-[#0b0f14]">
          
          {/* FILTER BAR */}
          <div className="shrink-0 flex justify-between items-center bg-[#11151c] border border-white/10 rounded-lg px-3 py-1.5 gap-3">
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center justify-between px-3 py-1.5 bg-[#1a1e26] border border-white/10 rounded text-xs text-slate-300 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={12} className="text-slate-400" />
                  <span>Apr 20 - Apr 26, 2026</span>
                </div>
                <ChevronDown size={12} className="ml-3 text-slate-400" />
              </button>
              <button className="flex items-center justify-between px-3 py-1.5 bg-[#1a1e26] border border-white/10 rounded text-xs text-slate-300 hover:bg-white/5 transition-colors">
                <span>All Projects</span>
                <ChevronDown size={12} className="ml-3 text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Auto refresh: On
              </span>
              <RefreshCw size={12} className="ml-2 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          {/* STATS */}
          <div className="shrink-0 grid grid-cols-4 gap-2">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-[#11151c] border border-white/10 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded ${item.iconBg}`}>
                        <Icon size={12} className={item.iconColor} />
                      </div>
                      <p className="text-[10px] text-slate-400">{item.title}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-lg font-semibold leading-none">{item.value}</h2>
                      <div className="flex items-center text-[9px] gap-0.5 mt-1">
                        {item.isPositive ? <ArrowUpRight size={10} className="text-green-400" /> : <ArrowDownRight size={10} className={item.isYellow ? "text-yellow-400" : "text-red-400"} />}
                        <span className={item.isPositive ? "text-green-400" : (item.isYellow ? "text-yellow-400" : "text-red-400")}>
                          {item.change}
                        </span>
                        <span className="text-slate-500 ml-0.5">{item.vs}</span>
                      </div>
                    </div>
                    <div className="mb-0.5"><Sparkline data={item.sparklineData} color={item.sparklineColor} /></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MIDDLE ROW */}
          <div className="flex-1 min-h-0 grid grid-cols-4 gap-2">
            {/* CALENDAR */}
            <div className="col-span-3 bg-[#11151c] border border-white/10 rounded-lg p-3 flex flex-col">
              <div className="flex justify-between items-center mb-2 shrink-0">
                <h3 className="text-xl text-slate-300">Deployment Frequency</h3>
                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <span>Less</span>
                  <div className="flex gap-0.5">
                    <div className="w-2 h-2 rounded-sm bg-white/5"></div>
                    <div className="w-2 h-2 rounded-sm bg-[#14532d]"></div>
                    <div className="w-2 h-2 rounded-sm bg-[#15803d]"></div>
                    <div className="w-2 h-2 rounded-sm bg-[#16a34a]"></div>
                    <div className="w-2 h-2 rounded-sm bg-[#22c55e]"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                <div className="flex gap-2">
                  {calendarMonths.map((month, mIndex) => (
                    <div key={mIndex} className="flex flex-col">
                      <span className="text-[10px] text-slate-500 mb-1">{month.name}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: month.weeks }).map((_, wIndex) => (
                          <div key={wIndex} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, dIndex) => {
                               const value = Math.floor(Math.random() * 5);
                               return <div key={dIndex} className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${getCalendarColor(value)}`} title={`Deploys: ${value}`}></div>
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TOP PROJECTS */}
            <div className="col-span-1 bg-[#11151c] border border-white/10 rounded-lg p-3 flex flex-col">
              <div className="flex justify-between items-center mb-2 shrink-0">
                <h3 className="text-xl text-slate-300">Top Projects</h3>
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-0">
                {topProjects.map((project, i) => {
                  const Icon = project.icon;
                  const widthPercent = (project.deploys / project.max) * 100;
                  return (
                    <div key={i} className="flex flex-col gap-1 text-[10px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <Icon size={10} className={project.iconColor} />
                          <span className="text-slate-300 truncate">{project.name}</span>
                        </div>
                        <span className="text-slate-400">{project.deploys}</span>
                      </div>
                      <div className="w-full bg-[#1a1e26] h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${project.color}`} style={{ width: `${widthPercent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex-1 min-h-0 bg-[#11151c] border border-white/10 rounded-lg p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="text-xl text-slate-300">Recent Deployment Activity</h3>
              <button className="text-[10px] text-slate-400 flex items-center hover:text-white transition-colors">
                View all <ChevronRight size={10} className="ml-0.5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
              <table className="w-full text-left text-[10px]">
                <thead className="text-slate-500 sticky top-0 bg-[#11151c] z-10">
                  <tr>
                    <th className="font-normal pb-1.5 pl-2">Project</th>
                    <th className="font-normal pb-1.5">Environment</th>
                    <th className="font-normal pb-1.5">Status</th>
                    <th className="font-normal pb-1.5">Deployed By</th>
                    <th className="font-normal pb-1.5">Time</th>
                    <th className="font-normal pb-1.5">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeploys.map((deploy, i) => {
                    const Icon = deploy.icon;
                    return (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-1.5 pl-2 flex items-center gap-1.5 text-slate-200">
                          <div className={`p-1 rounded bg-white/5`}><Icon size={10} className={deploy.iconColor} /></div>
                          {deploy.project}
                        </td>
                        <td className="py-1.5 text-slate-400">
                          <span className="px-1.5 py-0.5 rounded text-[9px] border border-white/10 bg-white/5">{deploy.env}</span>
                        </td>
                        <td className="py-1.5">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${deploy.status === 'Success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {deploy.status}
                          </span>
                        </td>
                        <td className="py-1.5 flex items-center gap-1.5 text-slate-300">
                          <div className="w-4 h-4 rounded bg-amber-600 flex items-center justify-center text-[7px] font-bold">{deploy.user.charAt(0)}</div>
                          {deploy.user}
                        </td>
                        <td className="py-1.5 text-slate-400">{deploy.time}</td>
                        <td className="py-1.5 text-slate-400">{deploy.duration}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
