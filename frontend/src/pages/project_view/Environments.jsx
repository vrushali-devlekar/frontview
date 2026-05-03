import { useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}