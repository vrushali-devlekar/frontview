import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import InputField from "../../components/ui/InputField";
import GlassButton from "../../components/ui/GlassButton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  FolderGit2, 
  ChevronDown, 
  ChevronUp, 
  GitBranch, 
  Search, 
  Settings2, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Trash2,
  Plus,
  Zap,
  AlertCircle
} from "lucide-react";
import { addEnvVar, createProject, getGithubRepos } from "../../api/api";
import { parseGithubRepoInput } from "../../utils/githubRepo";
// Removed react-hot-toast import as it's missing in package.json

const GitHubIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Frameworks = [
  { id: "react", name: "React", icon: Globe, install: "npm install", start: "npm start" },
  { id: "nextjs", name: "Next.js", icon: Rocket, install: "npm install", start: "npm run dev" },
  { id: "vite", name: "Vite", icon: Zap, install: "npm install", start: "npm run dev" },
  { id: "nodejs", name: "Node.js", icon: Cpu, install: "npm install", start: "node index.js" },
  { id: "other", name: "Other", icon: Settings2, install: "npm install", start: "npm start" },
];

export default function NewProjectPage() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();

  // Stepper State: 1 = Import, 2 = Configure
  const [step, setStep] = useState(1);
  
  // Form State
  const [name, setName] = useState("");
  const [repoInput, setRepoInput] = useState("");
  const [repoName, setRepoName] = useState("");
  const [branch, setBranch] = useState("main");
  const [installCommand, setInstallCommand] = useState("npm install");
  const [startCommand, setStartCommand] = useState("npm start");
  const [framework, setFramework] = useState("react");
  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);

  // UI State
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [repoSearch, setRepoSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFrameworkList, setShowFrameworkList] = useState(false);

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setReposLoading(true);
    try {
      const { data } = await getGithubRepos(repoSearch || undefined);
      setRepos(Array.isArray(data?.repos) ? data.repos : []);
    } catch (e) {
      setRepos([]);
    } finally {
      setReposLoading(false);
    }
  };

  const handleImport = (repo) => {
    const cloneUrl = `https://github.com/${repo.owner}/${repo.name}.git`;
    setRepoInput(cloneUrl);
    setRepoName(repo.name);
    setBranch((repo.defaultBranch || "main").trim());
    setName(repo.name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase());
    setStep(2);
  };

  const handleCustomImport = () => {
    const parsed = parseGithubRepoInput(repoInput);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError("");
    setRepoName(parsed.repoName);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !repoInput || !repoName) {
      setError("Project configuration is incomplete. Please select a repository.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await createProject({
        name: name.trim(),
        repoUrl: repoInput.trim(),
        repoName: repoName.trim(),
        branch: branch.trim() || "main",
        installCommand: installCommand.trim(),
        startCommand: startCommand.trim(),
        framework: framework
      });
      const id = data?.data?._id;
      if (id) {
        const pairs = envVars
          .map((p) => ({ key: p.key.trim(), value: p.value }))
          .filter((p) => p.key && p.value);
        await Promise.all(
          pairs.map((p) => addEnvVar(id, p.key, p.value).catch(() => null))
        );
        navigate(`/deployment-progress/${id}`);
      } else {
        setError("Failed to create project. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Deployment failed to initiate");
    } finally {
      setLoading(false);
    }
  };

  const selectedFramework = Frameworks.find(f => f.id === framework) || Frameworks[0];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto scrollbar-hide">
          
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Create New Project</h1>
                <p className="text-[14px] text-[#71717a]">
                  {step === 1 ? "Connect your repository to the Velora Engine" : "Configure your project deployment settings"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span key="step-dot-1" className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-[#22c55e]" : "bg-white/10"}`} />
                  <span key="step-dot-2" className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-[#22c55e]" : "bg-white/10"}`} />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Repository List */}
                    <div className="lg:col-span-3 bg-[#111113] border border-white/[0.06] rounded-[32px] overflow-hidden flex flex-col h-[520px] shadow-2xl relative">
                      <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <GitHubIcon size={18} />
                          </div>
                          <span className="font-bold text-[15px]">GitHub Repositories</span>
                        </div>
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                          <input 
                            type="text"
                            placeholder="Search..."
                            value={repoSearch}
                            onChange={(e) => setRepoSearch(e.target.value)}
                            className="bg-[#050505] border border-white/[0.08] rounded-full h-9 pl-9 pr-4 text-xs focus:outline-none focus:border-white/20 transition-all w-48"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                        {reposLoading ? (
                          [1,2,3,4,5,6].map(i => (
                            <div key={`skeleton-${i}`} className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.02] bg-white/[0.01] animate-pulse">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-white/5 rounded" />
                                <div className="w-32 h-3 bg-white/5 rounded" />
                              </div>
                              <div className="w-12 h-3 bg-white/5 rounded" />
                            </div>
                          ))
                        ) : repos.length > 0 ? (
                          repos.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase())).map((repo, idx) => (
                            <button
                              key={repo._id || repo.id || `repo-${idx}`}
                              onClick={() => handleImport(repo)}
                              className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                {repo.isPrivate ? <Lock size={14} className="text-[#52525b]" /> : <Globe size={14} className="text-[#52525b]" />}
                                <span className="text-[13.5px] font-semibold text-white/70 group-hover:text-white">{repo.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-[#3f3f46] font-black uppercase tracking-widest">{repo.defaultBranch}</span>
                                <div className="w-7 h-7 rounded-lg bg-white/0 group-hover:bg-white/5 flex items-center justify-center transition-all">
                                  <ArrowRight size={14} className="text-[#3f3f46] group-hover:text-white" />
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                            <GitHubIcon size={48} className="mb-4" />
                            <p className="text-[13px] font-medium max-w-[200px]">No projects found. Try checking your GitHub permissions.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custom URL Import */}
                    <div className="lg:col-span-2">
                      <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl relative overflow-hidden h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/[0.02] rounded-full -mr-16 -mt-16 blur-3xl" />
                        
                        <div className="mb-auto">
                          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <Plus size={18} className="text-[#22c55e]" />
                            Import External
                          </h3>
                          <p className="text-[13px] text-[#71717a] mb-8 leading-relaxed">Paste a Git repository URL to deploy from any public provider like Bitbucket or GitLab.</p>
                          
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.2em] ml-1">Repository URL</label>
                              <div className="relative">
                                <FolderGit2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b]" />
                                <input 
                                  placeholder="https://github.com/user/repo"
                                  value={repoInput}
                                  onChange={(e) => setRepoInput(e.target.value)}
                                  className="w-full h-12 bg-[#050505] border border-white/[0.08] rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-[#22c55e]/40 transition-all font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <GlassButton 
                            variant="primary" 
                            className="w-full h-12 rounded-[18px]" 
                            onClick={handleCustomImport}
                            disabled={!repoInput}
                          >
                            Continue Deployment <ArrowRight size={16} className="ml-2" />
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="max-w-3xl mx-auto pb-20"
                >
                  <div className="space-y-6">
                    <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-10 shadow-2xl">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e]">
                            <Rocket size={22} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white leading-tight">{name || "Configuring Project"}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <GitBranch size={12} className="text-[#52525b]" />
                              <span className="text-[11px] text-[#52525b] font-mono">{branch}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-[#71717a] hover:text-white transition-all">Change Repo</button>
                      </div>

                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.2em] ml-1">Project Name</label>
                            <input 
                              value={name}
                              onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                              placeholder="project-name"
                              className="w-full h-12 bg-[#050505] border border-white/[0.08] rounded-2xl px-5 text-sm focus:outline-none focus:border-[#22c55e]/40 transition-all font-semibold"
                            />
                          </div>

                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.2em] ml-1">Framework Preset</label>
                            <button 
                              onClick={() => setShowFrameworkList(!showFrameworkList)}
                              className="w-full h-12 bg-[#050505] border border-white/[0.08] rounded-2xl px-5 flex items-center justify-between group hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <selectedFramework.icon size={16} className="text-[#a1a1aa]" />
                                <span className="text-sm font-semibold">{selectedFramework.name}</span>
                              </div>
                              <ChevronDown size={14} className={`text-[#52525b] transition-transform ${showFrameworkList ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {showFrameworkList && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowFrameworkList(false)} />
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                                  >
                                    {Frameworks.map((fw, idx) => (
                                      <button
                                        key={`fw-${fw.id}-${idx}`}
                                        onClick={() => {
                                          setFramework(fw.id);
                                          setInstallCommand(fw.install);
                                          setStartCommand(fw.start);
                                          setShowFrameworkList(false);
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${framework === fw.id ? 'bg-[#22c55e] text-black' : 'hover:bg-white/5 text-[#a1a1aa] hover:text-white'}`}
                                      >
                                        <fw.icon size={14} />
                                        <span className="text-[13px] font-bold">{fw.name}</span>
                                      </button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Build Settings Accordion */}
                        <div className="bg-[#050505]/50 border border-white/[0.04] rounded-3xl p-6">
                          <button 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f46] hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Settings2 size={14} />
                              Build and Output Settings
                            </div>
                            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          
                          <AnimatePresence>
                            {showAdvanced && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-4 border-t border-white/[0.03]">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#3f3f46] uppercase tracking-widest ml-1">Install Command</label>
                                    <input 
                                      value={installCommand}
                                      onChange={(e) => setInstallCommand(e.target.value)}
                                      className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-[#22c55e]/30 transition-all"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#3f3f46] uppercase tracking-widest ml-1">Start Command</label>
                                    <input 
                                      value={startCommand}
                                      onChange={(e) => setStartCommand(e.target.value)}
                                      className="w-full h-11 bg-[#09090b] border border-white/[0.06] rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-[#22c55e]/30 transition-all"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Environment Variables */}
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f46]">Environment Variables</h4>
                            <button 
                              onClick={() => setEnvVars([...envVars, { key: "", value: "" }])}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                              <Plus size={12} /> Add Variable
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {envVars.map((env, i) => (
                              <div key={`env-${i}`} className="flex gap-3">
                                <input 
                                  placeholder="VARIABLE_NAME"
                                  value={env.key}
                                  onChange={(e) => {
                                    const next = [...envVars];
                                    next[i].key = e.target.value;
                                    setEnvVars(next);
                                  }}
                                  className="flex-1 h-12 bg-[#050505] border border-white/[0.08] rounded-2xl px-5 text-xs font-mono focus:outline-none focus:border-white/20 transition-all"
                                />
                                <input 
                                  type="password"
                                  placeholder="••••••••"
                                  value={env.value}
                                  onChange={(e) => {
                                    const next = [...envVars];
                                    next[i].value = e.target.value;
                                    setEnvVars(next);
                                  }}
                                  className="flex-1 h-12 bg-[#050505] border border-white/[0.08] rounded-2xl px-5 text-xs font-mono focus:outline-none focus:border-white/20 transition-all"
                                />
                                <button 
                                  onClick={() => setEnvVars(envVars.filter((_, idx) => idx !== i))}
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/5 border border-red-500/10 text-red-500/40 hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] flex items-center gap-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                              <AlertCircle size={16} />
                            </div>
                            <p className="text-[13px] font-medium text-red-500">{error}</p>
                          </motion.div>
                        )}

                        <div className="pt-6">
                          <button 
                            className="w-full h-16 rounded-[24px] bg-[#22c55e] text-black font-black text-[16px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(34,197,94,0.15)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                            onClick={handleSubmit}
                            disabled={loading || !name}
                          >
                            {loading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Launching Engine...
                              </>
                            ) : (
                              <>
                                Deploy Application <ArrowRight size={20} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
