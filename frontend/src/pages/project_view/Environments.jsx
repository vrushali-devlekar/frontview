import { useState } from "react";
<<<<<<< HEAD
import { useSidebar } from "../../hooks/useSidebar";
=======
>>>>>>> 1b78a6f (fix: restore frontend changes)
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
<<<<<<< HEAD
import { Search, Plus, GitBranch, MoreHorizontal, Shield, Eye, EyeOff, Trash2, Key, Download } from "lucide-react";
import GlassButton from "../../components/ui/GlassButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { PageShell, PageHeader, Card, CardHeader, Badge, TableHead } from "../../components/layout/PageLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function Environments() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [revealed, setRevealed] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [envs, setEnvs] = useState([
    { id: 1, name: "Production",   tag: "prod",    project: "auth-service",        branch: "main",           variables: 12, status: "ACTIVE" },
    { id: 2, name: "Staging",      tag: "staging", project: "auth-service",        branch: "develop",        variables: 8,  status: "ACTIVE" },
    { id: 3, name: "Development",  tag: "dev",     project: "frontend-dashboard",  branch: "main",           variables: 10, status: "ACTIVE" },
    { id: 4, name: "Preview PR#144", tag: "preview", project: "payment-gateway",   branch: "feat/checkout",  variables: 6,  status: "INACTIVE" },
  ]);

  const envVars = [
    { id: 1, key: "DATABASE_URL",   value: "postgresql://user:pass@db.velora.internal:5432/main" },
    { id: 2, key: "JWT_SECRET",     value: "velora_super_secret_key_2026" },
    { id: 3, key: "STRIPE_API_KEY", value: "sk_test_51Nx...velora" },
  ];

  const filtered = envs.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["Name", "Project", "Branch", "Status"];
    const rows = filtered.map(e => [e.name, e.project, e.branch, e.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "velora_environments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Environments" subtitle="Manage environment configurations across all projects">
            <div className="flex items-center gap-3">
              <GlassButton variant="secondary" onClick={exportCSV}>
                <Download size={14} /> Export CSV
              </GlassButton>
              <GlassButton variant="primary" onClick={() => setShowAddModal(true)}>
                <Plus size={14} /> New Environment
              </GlassButton>
            </div>
          </PageHeader>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* ── Environments table ── */}
            <Card noPad>
              <CardHeader icon={GitBranch} title="Environments">
                <Badge>{filtered.length}</Badge>
                {/* Search */}
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-4 text-[12px] w-48 bg-[#09090b] border border-white/[0.08] rounded-lg text-white placeholder:text-[#3f3f46] focus:outline-none focus:border-white/[0.16] transition-colors"
                  />
                </div>
              </CardHeader>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full">
                  <TableHead cols={["Name", "Project", "Branch", "Variables", "Status", ""]} />
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map((env) => (
                      <tr key={env.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-white/[0.04] border border-white/[0.07] text-[#71717a] uppercase tracking-wider">
                              {env.tag}
                            </span>
                            <span className="text-[13px] font-semibold text-white">{env.name}</span>
                          </div>
                        </td>
                        <td className="px-7 py-5 text-[13px] text-[#71717a]">{env.project}</td>
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-1.5 text-[12px] text-[#71717a] font-mono">
                            <GitBranch size={11} className="text-[#3f3f46] shrink-0" /> {env.branch}
                          </div>
                        </td>
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-1.5 text-[13px] text-[#71717a]">
                            <Key size={11} className="text-[#3f3f46] shrink-0" /> {env.variables}
                          </div>
                        </td>
                        <td className="px-7 py-5">
                          <StatusBadge status={env.status} />
                        </td>
                        <td className="px-7 py-5 text-right">
                          <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-white/[0.07] transition-all">
                            <MoreHorizontal size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── Secrets Vault ── */}
            <Card noPad>
              <CardHeader icon={Shield} title="Secrets Vault">
                <span className="px-2.5 py-1 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[10.5px] font-semibold text-[#22c55e] tracking-wide">
                  AES-256
                </span>
                <GlassButton variant="secondary" className="h-8 text-xs px-3 gap-1.5">
                  <Plus size={12} /> Add Secret
                </GlassButton>
              </CardHeader>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full">
                  <TableHead cols={["Key", "Value", ""]} />
                  <tbody className="divide-y divide-white/[0.04]">
                    {envVars.map((env) => (
                      <tr key={env.id} className="hover:bg-white/[0.02] group transition-colors">
                        <td className="px-7 py-5 text-[13px] font-mono text-[#3b82f6]">{env.key}</td>
                        <td className="px-7 py-5 text-[13px] font-mono text-[#52525b]">
                          {revealed[env.id] ? env.value : "••••••••••••••••"}
                        </td>
                        <td className="px-7 py-5 text-right">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <button
                              onClick={() => setRevealed((r) => ({ ...r, [env.id]: !r[env.id] }))}
                              className="p-1.5 rounded-lg text-[#52525b] hover:text-white hover:bg-white/[0.07] transition-all"
                            >
                              {revealed[env.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button className="p-1.5 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#ef4444]/[0.07] transition-all">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-7 py-5 border-t border-white/[0.05] flex items-center gap-2.5 bg-[#09090b]/40">
                <Shield size={12} className="text-[#22c55e] shrink-0" />
                <p className="text-[12px] text-[#3f3f46]">
                  All values are encrypted at rest. Access is restricted to authorized operators.
                </p>
              </div>
            </Card>
          </motion.div>
        </PageShell>
      </PageWrapper>

      {/* Modal Placeholder */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111113] border border-white/[0.08] rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2">Create Environment</h2>
              <p className="text-[13px] text-[#71717a] mb-6">Initialize a new stage for your project deployments.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2">Environment Name</label>
                  <input type="text" placeholder="e.g. Staging" className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-sm focus:outline-none focus:border-white/[0.2] transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2">Git Branch</label>
                  <input type="text" placeholder="e.g. main" className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-sm focus:outline-none focus:border-white/[0.2] transition-colors" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <GlassButton className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</GlassButton>
                <GlassButton variant="primary" className="flex-1" onClick={() => setShowAddModal(false)}>Create</GlassButton>
=======
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

const StatusDot = ({ status }) => {
  const map = {
    Active: { dot: "bg-green-400", text: "text-green-400" },
    Inactive: { dot: "bg-yellow-400", text: "text-yellow-400" },
    Archived: { dot: "bg-slate-500", text: "text-slate-400" },
  };
  const s = map[status] ?? { dot: "bg-slate-400", text: "text-slate-400" };
  return (
    <span className={`flex items-center gap-1.5 text-[9px] ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const EnvTag = ({ label, color }) => (
  <span className={`text-[7px] px-1.5 py-[2px] rounded border font-medium tracking-wide ${color}`}>
    {label}
  </span>
);

const tagColors = {
  PROD: "bg-green-500/10 text-green-400 border-green-500/25",
  STAGING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
  DEV: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  PREVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/25",
};

const EnvIcon = ({ color }) => (
  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
    <Layers size={12} className="text-white/80" />
  </div>
);

const EnvRow = ({ env }) => (
  <tr className="border-b border-white/5 hover:bg-white/[0.025] transition-colors group">
    <td className="px-3 py-2">
      <div className="flex items-center gap-2">
        <EnvIcon color={env.iconColor} />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-100">{env.name}</span>
            <EnvTag label={env.tag} color={tagColors[env.tag]} />
          </div>
          <span className="text-[8px] text-slate-500">{env.slug}</span>
        </div>
      </div>
    </td>
    <td className="px-3 py-2">
      <p className="text-[9px] text-slate-300 truncate max-w-[100px]">{env.project}</p>
      <div className="flex items-center gap-1 text-[8px] text-slate-500 mt-0.5">
        <GitBranch size={7} /> {env.branch}
      </div>
    </td>
    <td className="px-3 py-2">
      <p className="text-[10px] text-slate-200 font-medium">{env.variables}</p>
      <p className="text-[8px] text-slate-500">variables</p>
    </td>
    <td className="px-3 py-2">
      <p className="text-[9px] text-slate-300">{env.timeAgo}</p>
      <p className="text-[8px] text-slate-500">{env.date}</p>
    </td>
    <td className="px-3 py-2">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center text-black text-[7px] font-bold shrink-0">
          {env.updatedBy.slice(0, 2).toUpperCase()}
        </div>
        <span className="text-[9px] text-slate-300">{env.updatedBy}</span>
      </div>
    </td>
    <td className="px-3 py-2">
      <StatusDot status={env.status} />
    </td>
    <td className="px-3 py-2">
      <button className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={12} />
      </button>
    </td>
  </tr>
);

export default function Environments() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");

  const environments = [
    { id: 1, name: "Production", tag: "PROD", slug: "production", project: "User Auth Service", branch: "main", variables: 12, timeAgo: "2m ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Active", iconColor: "bg-emerald-700/60 border border-emerald-600/30" },
    { id: 2, name: "Staging", tag: "STAGING", slug: "staging", project: "User Auth Service", branch: "develop", variables: 8, timeAgo: "15m ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Active", iconColor: "bg-yellow-700/50 border border-yellow-600/30" },
    { id: 3, name: "Development", tag: "DEV", slug: "development", project: "Frontend Web", branch: "main", variables: 10, timeAgo: "1h ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Active", iconColor: "bg-blue-700/50 border border-blue-600/30" },
    { id: 4, name: "Preview", tag: "PREVIEW", slug: "preview", project: "Payment Service", branch: "feature/checkout", variables: 6, timeAgo: "3h ago", date: "Apr 26, 2026", updatedBy: "Sheryian", status: "Inactive", iconColor: "bg-purple-700/50 border border-purple-600/30" },
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
    <div className="flex h-screen overflow-hidden bg-[#0b0f14] text-white" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[60px]" : "ml-0 md:ml-[240px]"}`}>

        {/* HERO */}
        <div className="relative shrink-0 min-h-[120px] md:min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-white/10" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          <TopNav />
          <div className="relative z-10 px-4 pb-3">
            <h1 className="text-xl md:text-2xl leading-relaxed" style={{ fontFamily: "'Press Start 2P', cursive" }}>Environments</h1>
            <p className="text-[7px] md:text-[9px] text-slate-300 mt-2 leading-loose" style={{ fontFamily: "'Press Start 2P', cursive", textTransform: 'lowercase' }}>
              Manage environment variables and configurations across all your projects.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-2 md:p-3 overflow-y-auto bg-[#0b0f14]" style={{ scrollbarWidth: 'none' }}>
          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-2">

            {/* LEFT */}
            <div className="flex flex-col gap-2 min-h-0 overflow-hidden">
              <div className="bg-[#11151c] border border-white/10 rounded-xl flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-1">
                    {[{ id: "all", label: "All Environments" }, { id: "archived", label: "Archived" }].map((t) => (
                      <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-3 py-1.5 rounded text-xs transition-colors ${activeTab === t.id ? "bg-white/10 text-white border-b border-white/20" : "text-slate-500 hover:text-slate-300"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 placeholder-slate-600 pl-6 pr-2 py-1 w-36 outline-none focus:border-white/20 transition-colors" />
                    </div>
                    <div className="relative">
                      <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 pl-2 pr-6 py-1 outline-none cursor-pointer appearance-none">
                        <option value="All Projects" className="bg-[#11151c]">All Projects</option>
                        {uniqueProjects.map((p) => <option key={p} value={p} className="bg-[#11151c]">{p}</option>)}
                      </select>
                      <ChevronDown size={8} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#11151c] z-10">
                      <tr className="border-b border-white/10">
                        {["Environment", "Project", "Variables", "Last Updated", "Updated By", "Status", ""].map((h) => (
                          <th key={h} className="px-3 py-1.5 text-left text-[8px] text-slate-500 font-medium tracking-wide uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="py-10 text-center text-slate-600 text-[10px]">No environments found.</td></tr>
                      ) : (
                        filtered.map((env) => <EnvRow key={env.id} env={env} />)
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-3 py-2 border-t border-white/10 shrink-0">
                  <span className="text-[8px] text-slate-500">Showing 1 to {filtered.length} of {environments.length} environments</span>
                </div>
              </div>

              {/* BOTTOM INFO STRIP */}
              <div className="bg-[#11151c] border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-200">Secure &amp; Encrypted</p>
                    <p className="text-[8px] text-slate-500 mt-0.5 max-w-xs">All environment variables are encrypted using AES-256.</p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10" />
                <div className="text-center px-3">
                  <p className="text-[8px] text-slate-500 mb-0.5">Variables</p>
                  <p className="text-xl font-semibold text-white leading-none">{totalVars}</p>
                  <p className="text-[7px] text-slate-500">Across all projects</p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10" />
                <div className="text-center px-3">
                  <p className="text-[8px] text-slate-500 mb-0.5">Projects Using</p>
                  <p className="text-xl font-semibold text-white leading-none">{uniqueProjects.length}</p>
                  <p className="text-[7px] text-slate-500">Out of 5 total</p>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-[#11151c] border border-white/10 rounded-xl p-3 shrink-0">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-xl font-medium text-slate-200">About Environments</h3>
                  <Layers size={12} className="text-slate-500" />
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed mb-3">
                  Manage different sets of environment variables for your applications.
                </p>
                <ul className="space-y-1.5">
                  {["Securely store and encrypt variables", "Scope variables to specific projects", "Switch environments during deployment", "Use in build and runtime"].map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Check size={9} className="text-green-400 shrink-0" />
                      <span className="text-[9px] text-slate-400">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-3 w-full flex items-center justify-center gap-1.5 bg-[#e8e3d0] hover:bg-[#f0ece0] text-black text-sm font-medium py-2 rounded-lg transition-colors">
                  <Plus size={14} /> Create Environment
                </button>
              </div>

              <div className="bg-[#11151c] border border-white/10 rounded-xl p-3 shrink-0 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-medium text-slate-200 mb-1.5">Need Help?</h3>
                  <p className="text-[9px] text-slate-500 leading-relaxed mb-3">
                    Learn how environments work and best practices.
                  </p>
                </div>
                <button className="flex items-center justify-center gap-1.5 text-xs text-slate-300 border border-white/10 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  View Documentation
                  <ExternalLink size={12} className="text-slate-500" />
                </button>
>>>>>>> 1b78a6f (fix: restore frontend changes)
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}