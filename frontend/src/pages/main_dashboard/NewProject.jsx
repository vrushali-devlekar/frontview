import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import InputField from "../../components/ui/InputField";
import CyberButton from "../../components/ui/CyberButton";
import { 
  Rocket,
  FolderGit2,
  ChevronDown,
  ChevronUp,
  GitBranch,
} from "lucide-react";
import heroBg from "../../assets/new-top.png";
import { createProject, getGithubRepos } from "../../api/api";
import { parseGithubRepoInput } from "../../utils/githubRepo";

const GitHubIcon = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export default function NewProjectPage() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [repoInput, setRepoInput] = useState("");
  const [branch, setBranch] = useState("main");
  const [installCommand, setInstallCommand] = useState("npm install");
  const [startCommand, setStartCommand] = useState("npm start");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState("");
  const [repoSearch, setRepoSearch] = useState("");

  const fetchRepos = async () => {
    setReposLoading(true);
    setReposError("");
    try {
      const { data } = await getGithubRepos(repoSearch || undefined);
      setRepos(Array.isArray(data?.repos) ? data.repos : []);
    } catch (e) {
      setRepos([]);
      setReposError(
        e.response?.data?.message ||
          "Could not load GitHub repos (sign in with GitHub or paste URL)."
      );
    } finally {
      setReposLoading(false);
    }
  };

  const selectRepoFromGh = (repo) => {
    const cloneUrl = `https://github.com/${repo.owner}/${repo.name}.git`;
    setRepoInput(cloneUrl);
    setName((prev) => {
      if (prev.trim().length >= 3) return prev;
      const slug = `${repo.owner}-${repo.name}`.slice(0, 50);
      const simple = (repo.name || "app").slice(0, 50);
      return slug.length >= 3 ? slug : simple.padEnd(3, "x").slice(0, 50);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const parsed = parseGithubRepoInput(repoInput);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    if (!name.trim() || name.trim().length < 3) {
      setError("Project name must be at least 3 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await createProject({
        name: name.trim(),
        repoUrl: parsed.repoUrl,
        repoName: parsed.repoName,
        branch: branch.trim() || "main",
        installCommand: installCommand.trim() || "npm install",
        startCommand: startCommand.trim() || "npm start",
      });
      const id = data?.data?._id;
      if (id) {
        navigate(`/deploy?projectId=${encodeURIComponent(id)}`);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"
        }`}
      >
        <div
          className="relative min-h-[120px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end flex-wrap gap-4">
            <div>
              <h1
                className="text-lg md:text-xl text-[#FFCC00] font-bold tracking-widest"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                IMPORT_REPO
              </h1>
              <p className="text-[10px] text-[#888] mt-2 normal-case">
                GitHub HTTPS URL (<span className="text-[#00FFCC]">.git</span> optional). Sign in with GitHub to browse repos or paste any link you can clone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-[10px] text-[#888] hover:text-[#FFCC00] font-mono border border-[#333] px-4 py-2 bg-[#0a0a0a]"
            >
              ← DASHBOARD
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto flex justify-center"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="w-full max-w-xl">
            <div className="bg-[#0a0a0a] border-2 border-[#222] p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(255,204,0,0.05)]">
              {/* Optional GitHub catalog */}
              <div className="mb-8 pb-8 border-b border-[#222]">
                <div className="flex items-center gap-2 text-[11px] text-[#888] mb-4">
                  <GitHubIcon size={14} /> GITHUB_BROWSER
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <InputField
                    label="FILTER"
                    placeholder="search…"
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    className="!py-2"
                    containerClassName="flex-1 min-w-[160px]"
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => fetchRepos()}
                      disabled={reposLoading}
                      className="h-[42px] px-4 bg-[#FFCC00] text-black text-[10px] font-bold border-2 border-black shadow-[2px_2px_0_0_#885500] hover:bg-yellow-300 disabled:opacity-50 font-mono"
                    >
                      {reposLoading ? "LOADING..." : "LOAD_REPOS"}
                    </button>
                  </div>
                </div>
                {reposError && (
                  <p className="text-[10px] text-amber-500/90 mb-3 normal-case">
                    {reposError}
                  </p>
                )}
                {!reposError && repos.length === 0 && !reposLoading && (
                  <p className="text-[10px] text-[#555] normal-case">
                    Load repos after GitHub OAuth, or paste a URL below.
                  </p>
                )}
                {repos.length > 0 && (
                  <div className="max-h-[180px] overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                    {repos.map((r) => (
                      <button
                        type="button"
                        key={`${r.owner}/${r.name}`}
                        onClick={() => selectRepoFromGh(r)}
                        className="w-full text-left px-3 py-2 text-[11px] font-mono text-[#ccc] hover:bg-[#111] hover:text-[#00FFCC] border border-transparent hover:border-[#333] normal-case truncate"
                      >
                        {r.owner}/{r.name}
                        {r.isPrivate ? " · private" : ""}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <InputField
                  label="DISPLAY_NAME"
                  placeholder="Velora Frontend"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={3}
                  required
                  icon={Rocket}
                />

                <InputField
                  label="REPO_URL (GitHub HTTPS)"
                  placeholder="https://github.com/org/repo"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  required
                  icon={FolderGit2}
                />

                <InputField
                  label="BRANCH"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  icon={GitBranch}
                />

                <button
                  type="button"
                  className="flex items-center gap-2 text-[10px] text-[#555] hover:text-[#888] cursor-pointer mb-[-1rem]"
                  onClick={() => setShowAdvanced((v) => !v)}
                >
                  {showAdvanced ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  ADVANCED_INSTALL
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pt-2 border-t border-[#222]">
                    <InputField
                      label="INSTALL_COMMAND"
                      value={installCommand}
                      onChange={(e) => setInstallCommand(e.target.value)}
                    />
                    <InputField
                      label="START_COMMAND"
                      value={startCommand}
                      onChange={(e) => setStartCommand(e.target.value)}
                    />
                  </div>
                )}

                {error && (
                  <p
                    className="text-[11px] text-red-400 font-mono normal-case"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <CyberButton
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                  icon={Rocket}
                >
                  {loading ? "CREATING…" : "CREATE_AND_OPEN_DEPLOY"}
                </CyberButton>

                <p className="text-[9px] text-[#555] text-center font-mono normal-case">
                  For private repos,{" "}
                  <Link to="/login" className="text-[#00FFCC] hover:underline">
                    continue with GitHub
                  </Link>{" "}
                  so your account keeps a clone token.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
