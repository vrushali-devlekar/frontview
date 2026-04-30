import { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import {
  Search,
  Star,
  MoreVertical,
  GitBranch,
  Upload,
  Plus,
  Grid,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import heroBg from "../../assets/bg-top.png";

// ── Status badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Deployed: {
      dot: "bg-green-400",
      text: "text-green-400",
    },
    Failed: {
      dot: "bg-red-400",
      text: "text-red-400",
    },
    Running: {
      dot: "bg-yellow-400",
      text: "text-yellow-400",
    },
  };
  const s = map[status] ?? { dot: "bg-slate-400", text: "text-slate-400" };
  return (
    <span className={`flex items-center gap-1.5 text-[10px] ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// ── App icon placeholder (coloured initial) ──────────────────────────────────
const AppIcon = ({ name, color }) => (
  <div
    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${color}`}
  >
    {name.slice(0, 2).toUpperCase()}
  </div>
);

// ── Application row ──────────────────────────────────────────────────────────
const AppRow = ({ app, starred, onStar }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
    {/* left: star + icon + info */}
    <div className="flex items-center gap-3">
      <button
        onClick={onStar}
        className="text-slate-600 hover:text-yellow-400 transition-colors"
      >
        <Star
          size={13}
          className={starred ? "fill-yellow-400 text-yellow-400" : ""}
        />
      </button>

      <AppIcon name={app.name} color={app.color} />

      <div>
        <p className="text-[12px] font-medium text-slate-100 leading-none mb-1">
          {app.name}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          {/* <span className="flex items-center gap-1">
            <Github size={9} />
            {app.repo}
          </span> */}
          <span className="flex items-center gap-1">
            <GitBranch size={9} />
            {app.branch}
          </span>
        </div>
      </div>
    </div>

    {/* right: status + version + time + menu */}
    <div className="flex items-center gap-6">
      <div className="hidden sm:flex flex-col items-end gap-0.5">
        <StatusBadge status={app.status} />
        <span className="text-[9px] text-slate-500">{app.time}</span>
      </div>

      <div className="hidden md:flex flex-col items-end gap-0.5">
        <span className="text-[11px] text-slate-300 font-mono">
          {app.version}
        </span>
        <span className="text-[9px] text-slate-500">{app.buildTime}</span>
      </div>

      <button className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={14} />
      </button>
    </div>
  </div>
);

// ── Quick action item ────────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
    <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
      <Icon size={13} className="text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-slate-200">{label}</p>
      <p className="text-[9px] text-slate-500 truncate">{sub}</p>
    </div>
    <ChevronRight size={11} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
  </div>
);

// ── Main page ────────────────────────────────────────────────────────────────
export default function Applications() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [starredIds, setStarredIds] = useState(new Set([3]));

  const apps = [
    {
      id: 1,
      name: "User Auth Service",
      repo: "sheryians/auth-service",
      branch: "main",
      status: "Deployed",
      time: "2m ago",
      version: "v1.2.3",
      buildTime: "3m 24s",
      color: "bg-emerald-700",
    },
    {
      id: 2,
      name: "Frontend Web",
      repo: "sheryians/frontend-web",
      branch: "main",
      status: "Deployed",
      time: "15m ago",
      version: "v2.4.1",
      buildTime: "1m 45s",
      color: "bg-blue-600",
    },
    {
      id: 3,
      name: "Payment Service",
      repo: "sheryians/payment-service",
      branch: "develop",
      status: "Failed",
      time: "1h ago",
      version: "v1.0.5",
      buildTime: "2m 10s",
      color: "bg-orange-600",
    },
    {
      id: 4,
      name: "Data Ingest Service",
      repo: "sheryians/data-ingest",
      branch: "main",
      status: "Running",
      time: "1h 20m ago",
      version: "v0.9.1",
      buildTime: "5m 8s",
      color: "bg-teal-700",
    },
    {
      id: 5,
      name: "Notification Service",
      repo: "sheryians/notification-service",
      branch: "main",
      status: "Deployed",
      time: "2h ago",
      version: "v1.3.0",
      buildTime: "1m 12s",
      color: "bg-violet-700",
    },
  ];

  const toggleStar = (id) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = apps.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.repo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || a.status === statusFilter;
    const matchesTab =
      activeTab === "all" || (activeTab === "starred" && starredIds.has(a.id));
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f14] text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      {/* main area */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-[72px]" : "ml-[260px]"
          }`}
      >
        {/* ── HERO ── */}
        <div
          className="relative h-[140px] md:h-[160px] bg-cover bg-center px-6 py-5 flex flex-col justify-end border-b border-white/10 shrink-0"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          <div className="relative z-10">
            <h1 className="text-base md:text-lg font-semibold tracking-tight">
              Applications
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-400 mt-1">
              Manage your projects and connected repositories.
            </p>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">

          {/* ── LEFT: app list ── */}
          <div className="bg-[#11151c] border border-white/10 rounded-xl flex flex-col overflow-hidden">

            {/* toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
              {/* tabs */}
              <div className="flex items-center gap-1">
                {[
                  { id: "all", label: "All Applications" },
                  { id: "starred", label: "Starred" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] transition-colors ${activeTab === t.id
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-slate-300"
                      }`}
                  >
                    {t.id === "starred" && <Star size={9} />}
                    {t.label}
                  </button>
                ))}
              </div>

              {/* search + filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={11}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applications..."
                    className="bg-white/5 border border-white/10 rounded text-[10px] text-slate-300 placeholder-slate-600 pl-7 pr-3 py-1.5 w-44 outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded text-[10px] text-slate-300 px-2 py-1.5 outline-none cursor-pointer appearance-none pr-6"
                  style={{ backgroundImage: "none" }}
                >
                  {["All Status", "Deployed", "Failed", "Running"].map((s) => (
                    <option key={s} value={s} className="bg-[#11151c]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* rows */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/0">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-slate-600 text-[11px]">
                  No applications found.
                </div>
              ) : (
                filtered.map((app) => (
                  <AppRow
                    key={app.id}
                    app={app}
                    starred={starredIds.has(app.id)}
                    onStar={() => toggleStar(app.id)}
                  />
                ))
              )}
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <span className="text-[9px] text-slate-500">
                Showing 1 to {filtered.length} of {apps.length} applications
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <ChevronLeft size={11} />
                </button>
                {[1, 2].map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 rounded text-[10px] transition-colors ${currentPage === p
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: sidebar panels ── */}
          <div className="flex flex-col gap-4">

            {/* connect repo */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl p-4">
              {/* <div className="flex items-start justify-between mb-1">
                <h3 className="text-[12px] font-medium text-slate-200">
                  Connect Repository
                </h3>
                <Github size={16} className="text-slate-400" />
              </div> */}
              <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
                Connect your GitHub repository to create a new application.
              </p>

              {/* <button className="w-full flex items-center justify-center gap-2 bg-[#e8e3d0] hover:bg-[#f0ece0] text-black text-[11px] font-medium py-2 rounded-lg transition-colors mb-2">
                <Github size={13} />
                Connect GitHub
              </button> */}

              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[9px] text-slate-600">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] py-2 rounded-lg transition-colors">
                <Upload size={12} />
                Import Existing Project
              </button>
            </div>

            {/* quick actions */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl p-4">
              <h3 className="text-[12px] font-medium text-slate-200 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-0.5">
                <QuickAction
                  icon={Plus}
                  label="New Application"
                  sub="Create from scratch"
                />
                <QuickAction
                  icon={Grid}
                  label="Browse Templates"
                  sub="Use pre-configured templates"
                />
                <QuickAction
                  icon={Layers}
                  label="Manage Environments"
                  sub="Add or edit environments"
                />
                <QuickAction
                  icon={Zap}
                  label="View All Deployments"
                  sub="See deployment history"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}