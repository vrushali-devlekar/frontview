import { useState } from "react";
import Sidebar from "../dashboard/Sidebar.jsx";
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

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusDot = ({ status }) => {
  const map = {
    Active: { dot: "bg-green-400", text: "text-green-400" },
    Inactive: { dot: "bg-yellow-400", text: "text-yellow-400" },
    Archived: { dot: "bg-slate-500", text: "text-slate-400" },
  };
  const s = map[status] ?? { dot: "bg-slate-400", text: "text-slate-400" };
  return (
    <span className={`flex items-center gap-1.5 text-[10px] ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// ── Env type tag ──────────────────────────────────────────────────────────────
const EnvTag = ({ label, color }) => (
  <span
    className={`text-[8px] px-1.5 py-[2px] rounded border font-medium tracking-wide ${color}`}
  >
    {label}
  </span>
);

const tagColors = {
  PROD: "bg-green-500/10 text-green-400 border-green-500/25",
  STAGING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
  DEV: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  PREVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/25",
};

// ── Env icon ──────────────────────────────────────────────────────────────────
const EnvIcon = ({ color }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
  >
    <Layers size={15} className="text-white/80" />
  </div>
);

// ── Table row ─────────────────────────────────────────────────────────────────
const EnvRow = ({ env }) => (
  <tr className="border-b border-white/5 hover:bg-white/[0.025] transition-colors group">
    {/* Name */}
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <EnvIcon color={env.iconColor} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-slate-100">
              {env.name}
            </span>
            <EnvTag label={env.tag} color={tagColors[env.tag]} />
          </div>
          <span className="text-[9px] text-slate-500">{env.slug}</span>
        </div>
      </div>
    </td>

    {/* Project */}
    <td className="px-4 py-3">
      <p className="text-[11px] text-slate-300">{env.project}</p>
      <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-0.5">
        <GitBranch size={8} />
        {env.branch}
      </div>
    </td>

    {/* Variables */}
    <td className="px-4 py-3">
      <p className="text-[12px] text-slate-200 font-medium">{env.variables}</p>
      <p className="text-[9px] text-slate-500">variables</p>
    </td>

    {/* Last Updated */}
    <td className="px-4 py-3">
      <p className="text-[11px] text-slate-300">{env.timeAgo}</p>
      <p className="text-[9px] text-slate-500">{env.date}</p>
    </td>

    {/* Updated By */}
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center text-black text-[8px] font-bold shrink-0">
          {env.updatedBy.slice(0, 2).toUpperCase()}
        </div>
        <span className="text-[10px] text-slate-300">{env.updatedBy}</span>
      </div>
    </td>

    {/* Status */}
    <td className="px-4 py-3">
      <StatusDot status={env.status} />
    </td>

    {/* Menu */}
    <td className="px-4 py-3">
      <button className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={14} />
      </button>
    </td>
  </tr>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Environments() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");

  const environments = [
    {
      id: 1,
      name: "Production",
      tag: "PROD",
      slug: "production",
      project: "User Auth Service",
      branch: "main",
      variables: 12,
      timeAgo: "2m ago",
      date: "Apr 26, 2026",
      updatedBy: "Sheryian",
      status: "Active",
      iconColor: "bg-emerald-700/60 border border-emerald-600/30",
    },
    {
      id: 2,
      name: "Staging",
      tag: "STAGING",
      slug: "staging",
      project: "User Auth Service",
      branch: "develop",
      variables: 8,
      timeAgo: "15m ago",
      date: "Apr 26, 2026",
      updatedBy: "Sheryian",
      status: "Active",
      iconColor: "bg-yellow-700/50 border border-yellow-600/30",
    },
    {
      id: 3,
      name: "Development",
      tag: "DEV",
      slug: "development",
      project: "Frontend Web",
      branch: "main",
      variables: 10,
      timeAgo: "1h ago",
      date: "Apr 26, 2026",
      updatedBy: "Sheryian",
      status: "Active",
      iconColor: "bg-blue-700/50 border border-blue-600/30",
    },
    {
      id: 4,
      name: "Preview",
      tag: "PREVIEW",
      slug: "preview",
      project: "Payment Service",
      branch: "feature/checkout",
      variables: 6,
      timeAgo: "3h ago",
      date: "Apr 26, 2026",
      updatedBy: "Sheryian",
      status: "Inactive",
      iconColor: "bg-purple-700/50 border border-purple-600/30",
    },
  ];

  const filtered = environments.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProject =
      projectFilter === "All Projects" || e.project === projectFilter;
    const matchTab =
      activeTab === "all" || (activeTab === "archived" && e.status === "Archived");
    return matchSearch && matchProject && matchTab;
  });

  const totalVars = environments.reduce((s, e) => s + e.variables, 0);
  const uniqueProjects = [...new Set(environments.map((e) => e.project))];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f14] text-white">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

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
              Environments
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-400 mt-1">
              Manage environment variables and configurations across all your
              projects.
            </p>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 xl:grid-cols-[1fr_268px] gap-4">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-4">

            {/* Env table card */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl flex flex-col overflow-hidden">

              {/* toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
                {/* tabs */}
                <div className="flex items-center gap-1">
                  {[
                    { id: "all", label: "All Environments" },
                    { id: "archived", label: "Archived" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-3 py-1.5 rounded text-[10px] transition-colors ${activeTab === t.id
                          ? "bg-white/10 text-white border-b border-white/20"
                          : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* search + project filter */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={11}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search environments..."
                      className="bg-white/5 border border-white/10 rounded text-[10px] text-slate-300 placeholder-slate-600 pl-7 pr-3 py-1.5 w-44 outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded text-[10px] text-slate-300 pl-3 pr-7 py-1.5 outline-none cursor-pointer appearance-none"
                    >
                      <option value="All Projects" className="bg-[#11151c]">
                        All Projects
                      </option>
                      {uniqueProjects.map((p) => (
                        <option key={p} value={p} className="bg-[#11151c]">
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={10}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {[
                        "Environment",
                        "Project",
                        "Variables",
                        "Last Updated",
                        "Updated By",
                        "Status",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-[9px] text-slate-500 font-medium tracking-wide uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-14 text-center text-slate-600 text-[11px]"
                        >
                          No environments found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((env) => <EnvRow key={env.id} env={env} />)
                    )}
                  </tbody>
                </table>
              </div>

              {/* footer count */}
              <div className="px-4 py-3 border-t border-white/10">
                <span className="text-[9px] text-slate-500">
                  Showing 1 to {filtered.length} of {environments.length}{" "}
                  environments
                </span>
              </div>
            </div>

            {/* ── BOTTOM INFO STRIP ── */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* lock icon + text */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-200">
                    Secure &amp; Encrypted
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed max-w-sm">
                    All environment variables are encrypted using AES-256 and
                    are never exposed in logs or responses.
                  </p>
                </div>
              </div>

              {/* divider */}
              <div className="hidden sm:block w-px h-10 bg-white/10" />

              {/* stat: total vars */}
              <div className="text-center px-4">
                <p className="text-[10px] text-slate-500 mb-0.5">
                  Environment Variables
                </p>
                <p className="text-2xl font-semibold text-white">{totalVars}</p>
                <p className="text-[9px] text-slate-500">Across all projects</p>
              </div>

              {/* divider */}
              <div className="hidden sm:block w-px h-10 bg-white/10" />

              {/* stat: projects */}
              <div className="text-center px-4">
                <p className="text-[10px] text-slate-500 mb-0.5">
                  Projects Using Environments
                </p>
                <p className="text-2xl font-semibold text-white">
                  {uniqueProjects.length}
                </p>
                <p className="text-[9px] text-slate-500">
                  Out of 5 total projects
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex flex-col gap-4">

            {/* About card */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[12px] font-medium text-slate-200">
                  About Environments
                </h3>
                <Layers size={15} className="text-slate-500" />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                Environments let you manage different sets of environment
                variables for your applications.
              </p>

              <ul className="space-y-2">
                {[
                  "Securely store and encrypt variables",
                  "Scope variables to specific projects",
                  "Switch environments during deployment",
                  "Use in build and runtime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={10} className="text-green-400 shrink-0" />
                    <span className="text-[10px] text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-5 w-full flex items-center justify-center gap-2 bg-[#e8e3d0] hover:bg-[#f0ece0] text-black text-[11px] font-medium py-2 rounded-lg transition-colors">
                <Plus size={12} />
                Create Environment
              </button>
            </div>

            {/* Need Help card */}
            <div className="bg-[#11151c] border border-white/10 rounded-xl p-4">
              <h3 className="text-[12px] font-medium text-slate-200 mb-2">
                Need Help?
              </h3>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                Learn how environments work and best practices.
              </p>
              <button className="flex items-center gap-2 text-[10px] text-slate-300 border border-white/10 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                View Documentation
                <ExternalLink size={10} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

