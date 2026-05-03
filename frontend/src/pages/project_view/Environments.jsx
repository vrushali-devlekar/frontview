import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GitBranch, Eye, EyeOff, Shield, Download, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import StatusBadge from "../../components/ui/StatusBadge";
import { PageShell, PageHeader, Card, CardHeader, Badge, TableHead } from "../../components/layout/PageLayout";
import { getWorkspaceEnvironments } from "../../api/api";

export default function Environments() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(true);
  const [envData, setEnvData] = useState({ environments: [], envVars: [] });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getWorkspaceEnvironments();
        if (!ignore && data?.data) {
          setEnvData(data.data);
        }
      } catch (error) {
        if (!ignore) {
          setEnvData({ environments: [], envVars: [] });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredEnvironments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return envData.environments;
    return envData.environments.filter((env) =>
      env.name.toLowerCase().includes(query) || env.project.toLowerCase().includes(query)
    );
  }, [envData.environments, searchQuery]);

  const filteredSecrets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return envData.envVars;
    return envData.envVars.filter((env) =>
      env.key.toLowerCase().includes(query) || env.projectName.toLowerCase().includes(query)
    );
  }, [envData.envVars, searchQuery]);

  const exportCSV = () => {
    const headers = ["Environment", "Project", "Branch", "Variables", "Status"];
    const rows = filteredEnvironments.map((env) => [env.name, env.project, env.branch, env.variables, env.status]);
    const csvContent = `data:text/csv;charset=utf-8,${headers.join(",")}\n${rows.map((row) => row.join(",")).join("\n")}`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "velora_environments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Environments" subtitle="Real environment configuration across all your projects">
            <div className="flex items-center gap-3">
              <GlassButton variant="secondary" onClick={exportCSV}>
                <Download size={14} /> Export CSV
              </GlassButton>
              <GlassButton variant="primary" onClick={() => navigate("/projects/new")}>
                Create Project
              </GlassButton>
            </div>
          </PageHeader>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card noPad>
              <CardHeader icon={GitBranch} title="Environment Overview">
                <Badge>{filteredEnvironments.length}</Badge>
                <div className="relative w-full md:w-auto">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-8 pr-4 text-[12px] w-full md:w-56 bg-[#09090b] border border-white/[0.08] rounded-lg text-white placeholder:text-[#3f3f46] focus:outline-none focus:border-white/[0.16] transition-colors"
                  />
                </div>
              </CardHeader>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full">
                  <TableHead cols={["Environment", "Project", "Branch", "Variables", "Status"]} />
                  <tbody className="divide-y divide-white/[0.04]">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-7 py-8 text-center text-[#71717a] text-[13px]">
                          Loading environments...
                        </td>
                      </tr>
                    ) : filteredEnvironments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-7 py-8 text-center text-[#71717a] text-[13px]">
                          No environments found.
                        </td>
                      </tr>
                    ) : (
                      filteredEnvironments.map((env) => (
                        <tr
                          key={env.id}
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => navigate(`/settings?projectId=${env.id}`)}
                        >
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card noPad>
              <CardHeader icon={Shield} title="Secrets Vault">
                <span className="px-2.5 py-1 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[10.5px] font-semibold text-[#22c55e] tracking-wide">
                  AES-256
                </span>
              </CardHeader>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full">
                  <TableHead cols={["Key", "Project", "Branch", "Value"]} />
                  <tbody className="divide-y divide-white/[0.04]">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-7 py-8 text-center text-[#71717a] text-[13px]">
                          Loading secrets...
                        </td>
                      </tr>
                    ) : filteredSecrets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-7 py-8 text-center text-[#71717a] text-[13px]">
                          No environment variables saved yet.
                        </td>
                      </tr>
                    ) : (
                      filteredSecrets.map((env) => (
                        <tr key={env.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-7 py-5 text-[13px] font-mono text-[#3b82f6]">{env.key}</td>
                          <td className="px-7 py-5 text-[13px] text-white">
                            <button
                              onClick={() => navigate(`/settings?projectId=${env.projectId}`)}
                              className="inline-flex items-center gap-2 hover:text-[#22c55e] transition-colors"
                            >
                              <Folder size={12} className="text-[#71717a]" />
                              {env.projectName}
                            </button>
                          </td>
                          <td className="px-7 py-5 text-[12px] font-mono text-[#71717a]">{env.branch}</td>
                          <td className="px-7 py-5 text-right">
                            <button
                              onClick={() => setRevealed((prev) => ({ ...prev, [env.id]: !prev[env.id] }))}
                              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#71717a] hover:text-white transition-colors"
                            >
                              {revealed[env.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                              {revealed[env.id] ? env.masked : env.masked}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
