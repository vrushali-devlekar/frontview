import { useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import {
  Search,
  MoreVertical,
  GitBranch,
  Layers,
  Plus,
  ExternalLink,
  Check,
  ChevronDown,
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import CyberButton from "../../components/ui/CyberButton";
import StatusBadge from "../../components/ui/StatusBadge";
import InputField from "../../components/ui/InputField";

const EnvTag = ({ label, color }) => (
  <span className={`text-[7px] px-1.5 py-[2px] border font-bold tracking-widest ${color}`}>
    {label}
  </span>
);

const tagColors = {
  PROD: "text-valora-cyan border-valora-cyan bg-valora-cyan/10",
  STAGING: "text-valora-yellow border-valora-yellow bg-valora-yellow/10",
  DEV: "text-blue-400 border-blue-400 bg-blue-400/10",
  PREVIEW: "text-purple-400 border-purple-400 bg-purple-400/10",
};

const EnvIcon = ({ color }) => (
  <div className={`w-8 h-8 flex items-center justify-center shrink-0 border-2 ${color}`}>
    <Layers size={14} className="text-white" />
  </div>
);

const EnvRow = ({ env }) => (
  <tr className="border-b border-[#222] hover:bg-[#111] transition-colors group">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <EnvIcon color={env.iconColor} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{env.name}</span>
            <EnvTag label={env.tag} color={tagColors[env.tag]} />
          </div>
          <span className="text-[8px] text-[#555] tracking-widest uppercase">{env.slug}</span>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <p className="text-[9px] text-[#ccc] truncate max-w-[100px] uppercase tracking-widest">{env.project}</p>
      <div className="flex items-center gap-1 text-[8px] text-valora-yellow mt-1">
        <GitBranch size={9} /> {env.branch}
      </div>
    </td>
    <td className="px-4 py-3">
      <p className="text-[10px] text-white font-bold">{env.variables}</p>
      <p className="text-[8px] text-[#555] tracking-widest uppercase">variables</p>
    </td>
    <td className="px-4 py-3">
      <p className="text-[9px] text-[#ccc] uppercase tracking-widest">{env.timeAgo}</p>
      <p className="text-[8px] text-[#555] tracking-widest uppercase">{env.date}</p>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#333] border border-[#555] flex items-center justify-center text-white text-[7px] font-bold shrink-0">
          {env.updatedBy.slice(0, 2).toUpperCase()}
        </div>
        <span className="text-[9px] text-[#ccc] uppercase tracking-widest">{env.updatedBy}</span>
      </div>
    </td>
    <td className="px-4 py-3">
      <StatusBadge status={env.status} type={env.status === "Active" ? "success" : env.status === "Inactive" ? "warning" : "neutral"} />
    </td>
    <td className="px-4 py-3 text-right">
      <button className="text-[#555] hover:text-valora-yellow transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={14} />
      </button>
    </td>
  </tr>
);

export default function Environments() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");

  const environments = [
    { id: 1, name: "Production", tag: "PROD", slug: "production", project: "User Auth Service", branch: "main", variables: 12, timeAgo: "2m ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Active", iconColor: "border-valora-cyan bg-[#0a0a0a]" },
    { id: 2, name: "Staging", tag: "STAGING", slug: "staging", project: "User Auth Service", branch: "develop", variables: 8, timeAgo: "15m ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Active", iconColor: "border-valora-yellow bg-[#0a0a0a]" },
    { id: 3, name: "Development", tag: "DEV", slug: "development", project: "Frontend Web", branch: "main", variables: 10, timeAgo: "1h ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Active", iconColor: "border-[#444] bg-[#0a0a0a]" },
    { id: 4, name: "Preview", tag: "PREVIEW", slug: "preview", project: "Payment Service", branch: "feature/checkout", variables: 6, timeAgo: "3h ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Inactive", iconColor: "border-[#444] bg-[#0a0a0a]" },
  ];

  const filtered = environments.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProject = projectFilter === "All Projects" || e.project === projectFilter;
    const matchTab = activeTab === "all" || (activeTab === "archived" && e.status === "Archived");
    return matchSearch && matchProject && matchTab;
  });

  const totalVars = environments.reduce((s, e) => s + e.variables, 0);
  const uniqueProjects = [...new Set(environments.map((e) => e.project))];

  return (
    <div className="flex h-screen overflow-hidden bg-valora-bg text-white font-mono select-none">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>

        {/* HERO */}
        <div className="relative shrink-0 min-h-[120px] md:min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b-2 border-valora-border" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4">
            <h1 className="text-xl md:text-2xl text-valora-cyan font-pixel uppercase tracking-widest">ENVIRONMENTS</h1>
            <p className="text-[9px] text-[#888] mt-2 tracking-widest uppercase font-bold">
              MANAGE SECURE CONFIGURATIONS ACROSS ALL ACTIVE MODULES.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto bg-valora-bg" style={{ scrollbarWidth: 'none' }}>
          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">

            {/* LEFT (MAIN TABLE) */}
            <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
              <div className="bg-valora-card border-2 border-valora-border flex flex-col flex-1 min-h-0 overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-valora-cyan"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#333]"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b-2 border-[#222] shrink-0">
                  <div className="flex items-center gap-2">
                    {[{ id: "all", label: "ALL_ENVIRONMENTS" }, { id: "archived", label: "ARCHIVED" }].map((t) => (
                      <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-colors border-2 ${activeTab === t.id ? "border-valora-cyan text-valora-cyan bg-valora-cyan/10" : "border-transparent text-[#666] hover:text-white"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SEARCH..." className="bg-[#050505] border-2 border-[#333] text-[9px] text-white placeholder-[#555] pl-8 pr-3 py-2 w-48 outline-none focus:border-valora-cyan transition-colors uppercase tracking-widest" />
                    </div>
                    <div className="relative">
                      <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="bg-[#050505] border-2 border-[#333] text-[9px] text-white pl-3 pr-8 py-2 outline-none cursor-pointer appearance-none uppercase tracking-widest">
                        <option value="All Projects" className="bg-[#111]">ALL PROJECTS</option>
                        {uniqueProjects.map((p) => <option key={p} value={p} className="bg-[#111] uppercase">{p}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#0a0a0a] z-10">
                      <tr className="border-b-2 border-[#222]">
                        {["SYS_ENVIRONMENT", "PROJECT_ID", "VARIABLES", "LAST_SYNC", "SYNC_AUTHOR", "SYS_STATUS", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[9px] text-[#666] font-bold tracking-widest uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="py-12 text-center text-[#555] text-[10px] font-pixel">NO_ENVIRONMENTS_FOUND</td></tr>
                      ) : (
                        filtered.map((env) => <EnvRow key={env.id} env={env} />)
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t-2 border-[#222] shrink-0 bg-[#0a0a0a]">
                  <span className="text-[9px] text-[#555] tracking-widest uppercase">SYS_PAGINATION: {filtered.length} / {environments.length} ACTIVE_MODULES</span>
                </div>
              </div>

              {/* BOTTOM INFO STRIP */}
              <div className="bg-valora-card border-2 border-valora-border p-4 flex flex-col sm:flex-row items-center gap-4 shrink-0 relative">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 border-2 border-valora-cyan flex items-center justify-center shrink-0">
                    <Check size={16} className="text-valora-cyan" />
                  </div>
                  <div>
                    <p className="text-[10px] font-pixel text-valora-cyan uppercase">AES-256 SECURED</p>
                    <p className="text-[9px] text-[#666] mt-1 tracking-widest uppercase">ALL VARIABLES ARE ENCRYPTED AT REST AND IN TRANSIT.</p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-[#333]" />
                <div className="text-center px-4">
                  <p className="text-[9px] text-[#666] mb-1 tracking-widest uppercase">TOTAL_VARS</p>
                  <p className="text-xl font-pixel text-white leading-none">{totalVars}</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-[#333]" />
                <div className="text-center px-4">
                  <p className="text-[9px] text-[#666] mb-1 tracking-widest uppercase">PROJECTS_USING</p>
                  <p className="text-xl font-pixel text-white leading-none">{uniqueProjects.length}</p>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-4 min-h-0">
              <div className="bg-valora-card border-2 border-valora-border p-6 shrink-0 relative">
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-valora-yellow"></div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-[12px] font-pixel text-valora-yellow uppercase tracking-tight">SYS_MANUAL</h3>
                  <Layers size={16} className="text-[#555]" />
                </div>
                <p className="text-[10px] text-[#888] leading-relaxed mb-6 tracking-widest uppercase">
                  MANAGE DIFFERENT SETS OF ENVIRONMENT VARIABLES FOR YOUR APPLICATIONS.
                </p>
                <ul className="space-y-3 mb-6">
                  {["SECURELY STORE & ENCRYPT", "SCOPE VARIABLES TO PROJECTS", "SWITCH ENVIRONMENTS EASILY", "USE IN BUILD & RUNTIME"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-valora-cyan shrink-0"></div>
                      <span className="text-[9px] text-[#aaa] tracking-widest">{item}</span>
                    </li>
                  ))}
                </ul>
                <CyberButton variant="primary" className="w-full">
                  <Plus size={14} className="mr-2" /> CREATE_ENVIRONMENT
                </CyberButton>
              </div>

              <div className="bg-[#050505] border-2 border-[#222] p-6 shrink-0 flex-1 flex flex-col justify-between hover:border-[#444] transition-colors">
                <div>
                  <h3 className="text-[10px] font-bold text-[#888] mb-2 tracking-widest uppercase">OPERATOR_ASSISTANCE</h3>
                  <p className="text-[9px] text-[#555] leading-relaxed tracking-widest uppercase">
                    LEARN HOW ENVIRONMENTS WORK AND BEST PRACTICES FOR SECRET MANAGEMENT.
                  </p>
                </div>
                <button className="flex items-center justify-between mt-6 text-[9px] text-valora-cyan hover:text-[#fff] transition-colors uppercase tracking-widest font-bold">
                  VIEW_DOCUMENTATION
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
