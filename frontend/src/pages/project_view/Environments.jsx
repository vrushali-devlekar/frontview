import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import { Search, Plus, GitBranch, Key, Download, Trash2, FolderKanban } from "lucide-react";
import GlassButton from "../../components/ui/GlassButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { PageShell, PageHeader, Card, CardHeader, Badge, TableHead, AlertBanner, EmptyState } from "../../components/layout/PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { addEnvVar, deleteEnvVar, getProjects, getWorkspaceEnvironments } from "../../api/api";

export default function Environments() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [workspaceData, setWorkspaceData] = useState({ environments: [], envVars: [] });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingKey, setDeletingKey] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [form, setForm] = useState({ projectId: "", key: "", value: "" });

  useEffect(() => {
    if (!message.text) return undefined;

    const timeoutId = window.setTimeout(() => {
      setMessage({ text: "", type: "success" });
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const loadData = async () => {
    const [workspaceRes, projectsRes] = await Promise.all([
      getWorkspaceEnvironments(),
      getProjects(),
    ]);

    setWorkspaceData({
      environments: workspaceRes.data?.data?.environments || [],
      envVars: workspaceRes.data?.data?.envVars || [],
    });
    setProjects(projectsRes.data?.data || []);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [workspaceRes, projectsRes] = await Promise.all([
          getWorkspaceEnvironments(),
          getProjects(),
        ]);

        if (cancelled) return;

        const allProjects = projectsRes.data?.data || [];
        setWorkspaceData({
          environments: workspaceRes.data?.data?.environments || [],
          envVars: workspaceRes.data?.data?.envVars || [],
        });
        setProjects(allProjects);
        setForm((prev) => ({
          ...prev,
          projectId: prev.projectId || allProjects[0]?._id || "",
        }));
      } catch (error) {
        if (!cancelled) {
          setMessage({ text: error.response?.data?.message || "Failed to load environments", type: "error" });
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

  const filteredEnvironments = useMemo(() => {
    return workspaceData.environments.filter((env) => {
      const q = searchQuery.toLowerCase();
      return (
        env.name.toLowerCase().includes(q) ||
        env.project.toLowerCase().includes(q) ||
        env.branch.toLowerCase().includes(q)
      );
    });
  }, [workspaceData.environments, searchQuery]);

  const filteredEnvVars = useMemo(() => {
    return workspaceData.envVars.filter((env) => {
      const q = searchQuery.toLowerCase();
      return (
        env.key.toLowerCase().includes(q) ||
        env.projectName.toLowerCase().includes(q) ||
        env.branch.toLowerCase().includes(q)
      );
    });
  }, [workspaceData.envVars, searchQuery]);

  const exportCSV = () => {
    const headers = ["Project", "Branch", "Variables", "Status"];
    const rows = filteredEnvironments.map((env) => [env.project, env.branch, env.variables, env.status]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "velora_environments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateVariable = async () => {
    if (!form.projectId || !form.key.trim() || !form.value.trim()) {
      setMessage({ text: "Project, key, and value are required", type: "warning" });
      return;
    }

    try {
      setSaving(true);
      await addEnvVar(form.projectId, form.key.trim(), form.value);
      await loadData();
      setShowAddModal(false);
      setForm((prev) => ({ ...prev, key: "", value: "" }));
      setMessage({ text: "Environment variable saved", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to save variable", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVariable = async (projectId, key) => {
    try {
      setDeletingKey(`${projectId}:${key}`);
      await deleteEnvVar(projectId, key);
      await loadData();
      setMessage({ text: `Deleted ${key}`, type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to delete variable", type: "error" });
    } finally {
      setDeletingKey("");
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Environments" subtitle="Live project environment data from the workspace database">
            <div className="flex items-center gap-3">
              <GlassButton variant="secondary" onClick={exportCSV}>
                <Download size={14} /> Export CSV
              </GlassButton>
              <GlassButton variant="primary" onClick={() => setShowAddModal(true)}>
                <Plus size={14} /> Add Variable
              </GlassButton>
            </div>
          </PageHeader>

          {message.text && <AlertBanner type={message.type}>{message.text}</AlertBanner>}

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card noPad>
              <CardHeader icon={GitBranch} title="Project Environments">
                <Badge>{filteredEnvironments.length}</Badge>
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-4 text-[12px] w-48 bg-[#09090b] border border-white/[0.08] rounded-lg text-white placeholder:text-[#3f3f46] focus:outline-none focus:border-white/[0.16] transition-colors"
                  />
                </div>
              </CardHeader>
              {loading ? (
                <div className="px-7 py-10 text-[13px] text-[#71717a]">Loading environments...</div>
              ) : filteredEnvironments.length === 0 ? (
                <EmptyState icon={FolderKanban} title="No environments yet" subtitle="Projects with saved variables and deployments will appear here." />
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full">
                    <TableHead cols={["Name", "Project", "Branch", "Variables", "Status"]} />
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredEnvironments.map((env) => (
                        <tr key={env.id} className="hover:bg-white/[0.02] transition-colors">
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
                          <td className="px-7 py-5 text-[13px] text-[#71717a]">{env.variables}</td>
                          <td className="px-7 py-5">
                            <StatusBadge status={env.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card noPad>
              <CardHeader icon={Key} title="Secrets Vault">
                <span className="px-2.5 py-1 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[10.5px] font-semibold text-[#22c55e] tracking-wide">
                  AES-256
                </span>
              </CardHeader>
              {loading ? (
                <div className="px-7 py-10 text-[13px] text-[#71717a]">Loading secrets...</div>
              ) : filteredEnvVars.length === 0 ? (
                <EmptyState icon={Key} title="No variables stored" subtitle="Add a variable and it will be encrypted and listed here." />
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full">
                    <TableHead cols={["Key", "Project", "Branch", "Stored Value", ""]} />
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredEnvVars.map((env) => (
                        <tr key={env.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-7 py-5 text-[13px] font-mono text-[#3b82f6]">{env.key}</td>
                          <td className="px-7 py-5 text-[13px] text-white">{env.projectName}</td>
                          <td className="px-7 py-5 text-[12px] font-mono text-[#71717a]">{env.branch}</td>
                          <td className="px-7 py-5 text-[13px] font-mono text-[#52525b]">{env.masked}</td>
                          <td className="px-7 py-5 text-right">
                            <button
                              onClick={() => handleDeleteVariable(env.projectId, env.key)}
                              disabled={deletingKey === `${env.projectId}:${env.key}`}
                              className="p-1.5 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#ef4444]/[0.07] transition-all disabled:opacity-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="px-7 py-5 border-t border-white/[0.05] flex items-center gap-2.5 bg-[#09090b]/40">
                <Key size={12} className="text-[#22c55e] shrink-0" />
                <p className="text-[12px] text-[#3f3f46]">
                  Values are intentionally masked in the UI. The backend stores encrypted payloads only.
                </p>
              </div>
            </Card>
          </motion.div>
        </PageShell>
      </PageWrapper>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111113] border border-white/[0.08] rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2">Add Environment Variable</h2>
              <p className="text-[13px] text-[#71717a] mb-6">Create or update a real project secret in the database.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2">Project</label>
                  <select
                    value={form.projectId}
                    onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
                    className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-sm focus:outline-none focus:border-white/[0.2] transition-colors"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2">Variable Key</label>
                  <input
                    type="text"
                    value={form.key}
                    onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value.toUpperCase() }))}
                    placeholder="e.g. API_TOKEN"
                    className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-sm focus:outline-none focus:border-white/[0.2] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2">Variable Value</label>
                  <input
                    type="text"
                    value={form.value}
                    onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="Paste secret value"
                    className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-sm focus:outline-none focus:border-white/[0.2] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <GlassButton className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</GlassButton>
                <GlassButton variant="primary" className="flex-1" onClick={handleCreateVariable} disabled={saving}>
                  {saving ? "Saving..." : "Save Variable"}
                </GlassButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
