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
  Zap
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
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createProject({
        name: name.trim(),
        repoUrl: repoInput.trim(),
        branch: branch.trim() || "main",
        installCommand: installCommand.trim(),
        startCommand: startCommand.trim(),
      });
      
      const id = data?.data?._id;
      if (id) {
        const pairs = envVars
          .map((p) => ({ key: p.key.trim(), value: p.value }))
          .filter((p) => p.key && p.value);
        await Promise.all(
          pairs.map((p) => addEnvVar(id, p.key, p.value).catch(() => null))
        );
        navigate(`/deploy?projectId=${encodeURIComponent(id)}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Deployment failed to initiate");
    } finally {
      setLoading(false);
    }
  };

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
                  <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? "bg-white" : "bg-white/10"}`} />
                  <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? "bg-white" : "bg-white/10"}`} />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  {/* Import Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Repository List */}
                    <div className="lg:col-span-3 bg-[#111113] border border-white/[0.06] rounded-[32px] overflow-hidden flex flex-col h-[500px] shadow-2xl">
                      <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                          <GitHubIcon size={20} />
                          <span className="font-bold text-[15px]">GitHub Repositories</span>
                        </div>
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                          <input 
                            type="text"
                            placeholder="Filter..."
                            value={repoSearch}
                            onChange={(e) => setRepoSearch(e.target.value)}
                            className="bg-[#050505] border border-white/[0.08] rounded-full h-8 pl-9 pr-4 text-xs focus:outline-none focus:border-white/20 transition-all w-40"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                        {reposLoading ? (
                          [1,2,3,4,5].map(i => <div key={i} className="h-14 bg-white/[0.02] animate-pulse rounded-2xl" />)
                        ) : repos.length > 0 ? (
                          repos.filter(r => r.name.toLowerCase().includes(repoSearch.toLowerCase())).map(repo => (
                            <button
                              key={repo.id}
                              onClick={() => handleImport(repo)}
                              className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                {repo.isPrivate ? <Lock size={14} className="text-[#52525b]" /> : <Globe size={14} className="text-[#52525b]" />}
                                <span className="text-[13.5px] font-medium text-white/80 group-hover:text-white">{repo.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-[#3f3f46] font-mono">{repo.defaultBranch}</span>
                                <ArrowRight size={14} className="text-[#3f3f46] group-hover:text-white transition-all transform group-hover:translate-x-1" />
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <GitHubIcon size={40} className="text-[#1a1a1a] mb-4" />
                            <p className="text-[13px] text-[#52525b] max-w-[200px]">No repositories found. Connect your GitHub account.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custom URL Import */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full -mr-16 -mt-16 border border-white/[0.05]" />
                        <h3 className="text-lg font-bold mb-2">Import Third-Party</h3>
                        <p className="text-[13px] text-[#71717a] mb-8 leading-relaxed">Paste a public Git URL to deploy any open-source project instantly.</p>
                        
                        <div className="space-y-4">
                          <InputField 
                            label="Git Repository URL"
                            placeholder="https://github.com/user/repo"
                            value={repoInput}
                            onChange={(e) => setRepoInput(e.target.value)}
                            icon={FolderGit2}
                          />
                          <GlassButton 
                            variant="primary" 
                            className="w-full h-12" 
                            onClick={handleCustomImport}
                            disabled={!repoInput}
                          >
                            Continue <ArrowRight size={16} className="ml-2" />
                          </GlassButton>
                        </div>
                      </div>

                      <div className="bg-white/[0.02] border border-white/[0.04] rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
                            <CheckCircle2 size={16} />
                          </div>
                          <span className="font-bold text-[13px]">Vibe Coded Architecture</span>
                        </div>
                        <p className="text-[12px] text-[#52525b] leading-relaxed">
                          Our engine automatically detects framework settings, environment requirements, and build pipelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20"
                >
                  {/* Configuration Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl">
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Rocket size={18} />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{name || "Untitled Project"}</h3>
                            <p className="text-[11px] text-[#52525b] font-mono truncate max-w-[200px]">{repoInput}</p>
                          </div>
                        </div>
                        <button onClick={() => setStep(1)} className="text-[12px] font-bold text-[#71717a] hover:text-white transition-colors">Change Repo</button>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField 
                            label="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                            placeholder="my-awesome-app"
                          />
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#3f3f46] uppercase tracking-[0.2em] ml-1">Framework Preset</label>
                            <div className="relative group">
                              <select 
                                value={framework}
                                onChange={(e) => {
                                  const fw = Frameworks.find(f => f.id === e.target.value);
                                  setFramework(e.target.value);
                                  setInstallCommand(fw.install);
                                  setStartCommand(fw.start);
                                }}
                                className="w-full h-12 bg-[#050505] border border-white/[0.08] rounded-2xl px-5 text-sm appearance-none focus:outline-none focus:border-white/20 transition-all cursor-pointer"
                              >
                                {Frameworks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                              </select>
                              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>

                        {/* Advanced Settings */}
                        <div>
                          <button 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-[12px] font-bold text-[#71717a] hover:text-white transition-colors mb-4"
                          >
                            <Settings2 size={14} /> Build and Output Settings {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          
                          <AnimatePresence>
                            {showAdvanced && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-4 overflow-hidden"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                  <InputField label="Install Command" value={installCommand} onChange={(e) => setInstallCommand(e.target.value)} />
                                  <InputField label="Start Command" value={startCommand} onChange={(e) => setStartCommand(e.target.value)} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Environment Variables */}
                        <div className="pt-8 border-t border-white/[0.06]">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#3f3f46]">Environment Variables</h4>
                            <GlassButton variant="secondary" className="h-8 text-xs px-3 gap-1.5" onClick={() => setEnvVars([...envVars, { key: "", value: "" }])}>
                              <Plus size={12} /> Add New
                            </GlassButton>
                          </div>
                          
                          <div className="space-y-3">
                            {envVars.map((env, i) => (
                              <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <input 
                                  placeholder="VARIABLE_NAME"
                                  value={env.key}
                                  onChange={(e) => {
                                    const next = [...envVars];
                                    next[i].key = e.target.value;
                                    setEnvVars(next);
                                  }}
                                  className="flex-1 h-11 bg-[#050505] border border-white/[0.08] rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-white/20 transition-all"
                                />
                                <input 
                                  type="password"
                                  placeholder="value"
                                  value={env.value}
                                  onChange={(e) => {
                                    const next = [...envVars];
                                    next[i].value = e.target.value;
                                    setEnvVars(next);
                                  }}
                                  className="flex-1 h-11 bg-[#050505] border border-white/[0.08] rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-white/20 transition-all"
                                />
                                <button 
                                  onClick={() => setEnvVars(envVars.filter((_, idx) => idx !== i))}
                                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[13px] font-medium">{error}</div>}

                        <div className="pt-8">
                          <GlassButton 
                            variant="primary" 
                            className="w-full h-14 text-[15px]" 
                            onClick={handleSubmit}
                            disabled={loading || !name}
                          >
                            {loading ? "Initializing Deployment..." : "Deploy Application"} <ArrowRight size={18} className="ml-2" />
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-[32px] p-8">
                      <h4 className="text-[12px] font-black text-[#3f3f46] uppercase tracking-[0.2em] mb-6">Build Insights</h4>
                      <ul className="space-y-6">
                        <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <GitBranch size={14} className="text-[#71717a]" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold mb-1">Production Branch</p>
                            <p className="text-[12px] text-[#52525b]">Deployments will be automatically triggered on push to <code className="text-white bg-white/5 px-1 rounded">{branch}</code>.</p>
                          </div>
                        </li>
                        <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <Zap size={14} className="text-[#22c55e]" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold mb-1">Instant Deployment</p>
                            <p className="text-[12px] text-[#52525b]">Velora uses ephemeral build workers to ensure your app is live in seconds.</p>
                          </div>
                        </li>
                      </ul>
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
