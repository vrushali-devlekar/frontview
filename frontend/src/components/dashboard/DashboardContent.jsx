import { useState } from "react";
import Sidebar from "./Sidebar";
import {
  Rocket,
  AlertCircle,
  ShieldCheck,
  Folder,
} from "lucide-react";

import heroBg from "../../assets/bg-top.png";

const StatusBadge = ({ status }) => {
  const styles = {
    SUCCESS: "bg-green-500/10 text-green-400 border border-green-500/20",
    FAILED: "bg-red-500/10 text-red-400 border border-red-500/20",
    RUNNING: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  };

  return (
    <span className={`text-[10px] px-2 py-[2px] rounded ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const stats = [
    { title: "Projects", value: "12", icon: Folder },
    { title: "Deploys", value: "28", icon: Rocket },
    { title: "Failures", value: "2", icon: AlertCircle },
    { title: "Uptime", value: "99.98%", icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f14] text-white">
      
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
          className="relative h-[140px] md:h-[150px] bg-cover bg-center px-4 md:px-6 py-4 flex flex-col justify-end border-b border-white/10"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

          <div className="relative z-10">
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">
              Good evening, Sheryian 🚀
            </h1>
            <p className="text-[11px] md:text-xs text-slate-300 mt-1">
              Here's what's happening with your projects today.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-3 md:p-4 grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden">
          
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-[#11151c] border border-white/10 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-[10px] text-slate-400">
                      {item.title}
                    </p>
                    <h2 className="text-lg md:text-xl mt-1">
                      {item.value}
                    </h2>
                  </div>

                  <div className="p-2 rounded bg-white/5">
                    <Icon size={16} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* MIDDLE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-hidden">
            
            {/* RECENT DEPLOYMENTS */}
            <div className="md:col-span-2 bg-[#11151c] border border-white/10 rounded-lg p-2.5 flex flex-col">
              
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs text-slate-300">
                  Recent Deployments
                </h2>
                <span className="text-[10px] text-slate-400 cursor-pointer">
                  View all →
                </span>
              </div>

              <div className="space-y-1">
                {[
                  { name: "Auth Service", status: "SUCCESS", time: "3m" },
                  { name: "Frontend", status: "SUCCESS", time: "15m" },
                  { name: "Payments", status: "FAILED", time: "1h" },
                  { name: "Data Pipeline", status: "RUNNING", time: "1h" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5"
                  >
                    <span className="text-[11px] text-slate-200">
                      {item.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-[10px] text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TECH STACK */}
            <div className="bg-[#11151c] border border-white/10 rounded-lg p-2.5 flex flex-col">
              
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs text-slate-300">
                  Tech Stack
                </h2>
                <span className="text-[10px] text-slate-400 cursor-pointer">
                  View all →
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: "React", color: "bg-blue-400" },
                  { name: "Node", color: "bg-green-400" },
                  { name: "Mongo", color: "bg-green-500" },
                  { name: "Redis", color: "bg-red-400" },
                  { name: "Docker", color: "bg-blue-300" },
                  { name: "AWS", color: "bg-yellow-400" },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/5 rounded px-2 py-1"
                  >
                    <div className={`w-2 h-2 rounded-full ${tech.color}`} />
                    <span className="text-[10px] text-slate-200">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              "New Project",
              "Deploy",
              "Rollback",
              "Logs",
              "AI",
            ].map((action, i) => (
              <div
                key={i}
                className="bg-[#11151c] border border-white/10 rounded-lg py-3 text-sm text-center hover:bg-white/5 cursor-pointer"
              >
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
