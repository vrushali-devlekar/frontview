import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import {
  Settings as SettingsIcon,
  Key,
  Globe,
  Shield,
  AlertTriangle,
  Cpu,
  Loader2,
  LayoutGrid,
  User,
  ChevronRight,
  Folder,
} from "lucide-react";
import GlassButton from "../../components/ui/GlassButton";
import InputField from "../../components/ui/InputField";
import EnvTable from "../../components/project/EnvTable";
import { motion } from "framer-motion";
import {
  getProject,
  updateProject,
  deleteProject,
  getProjects,
} from "../../api/api";
import {
  AlertBanner,
  Card,
  PageHeader,
} from "../../components/layout/PageLayout";

export default function Settings() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId") || "";

  const [activeTab, setActiveTab] = useState("GENERAL");
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [projectName, setProjectName] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [startCommand, setStartCommand] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (projectId) {
          const { data } = await getProject(projectId);
          setProject(data.data);
          setProjectName(data.data.name);
          setInstallCommand(data.data.installCommand || "npm install");
          setStartCommand(data.data.startCommand || "npm start");
          setActiveTab("GENERAL");
        } else {
          const { data } = await getProjects();
          setAllProjects(data.data || []);
          setActiveTab("WORKSPACE");
        }
      } catch (err) {
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleUpdate = async (fields) => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const { data } = await updateProject(projectId, fields);
      setProject(data.data);
      setSuccessMsg("Settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This cannot be undone.",
      )
    )
      return;

    setSaving(true);
    try {
      await deleteProject(projectId);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to delete project.");
      setSaving(false);
    }
  };

  const projectTabs = [
    { id: "GENERAL", label: "General", icon: SettingsIcon },
    { id: "VARIABLES", label: "Environment Variables", icon: Key },
    { id: "ADVANCED", label: "Advanced", icon: Cpu },
    { id: "DANGER", label: "Danger Zone", icon: AlertTriangle },
  ];

  const globalTabs = [
    { id: "WORKSPACE", label: "Workspace", icon: LayoutGrid },
    { id: "PROFILE", label: "Profile", icon: User },
    { id: "SECURITY", label: "Security", icon: Shield },
  ];

  const currentTabs = projectId ? projectTabs : globalTabs;

  if (loading) {
    return (
      <div className="flex h-screen bg-black text-white font-sans items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#22c55e]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        navMode={navMode}
        toggleNavMode={toggleNavMode}
      />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />

      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />

        {/* Page header */}
        <div className="px-8 py-6 border-b border-white/[0.06] shrink-0">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {projectId ? "Project Settings" : "Workspace Settings"}
              </h1>
              {projectId && (
                <>
                  <span className="text-[#3f3f46]">/</span>
                  <span className="text-[14px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-md border border-[#22c55e]/20">
                    {project?.name}
                  </span>
                </>
              )}
            </div>
            <p className="text-[13px] text-[#71717a]">
              {projectId
                ? "Manage your project configuration and infrastructure"
                : "Manage your personal workspace and account preferences"}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden max-w-[1200px] mx-auto w-full flex">
          {/* Tab sidebar */}
          <div
            className="w-64 shrink-0 py-6 pr-6 border-r border-white/[0.06] flex flex-col gap-0.5 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <p className="text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2 px-3">
              Sections
            </p>
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-white/[0.08] text-white"
                    : "text-[#71717a] hover:text-white hover:bg-white/[0.04]"
                } ${tab.id === "DANGER" ? "text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/[0.06] mt-auto" : ""}`}
              >
                <tab.icon
                  size={15}
                  className={
                    tab.id === "DANGER" && activeTab !== "DANGER"
                      ? "text-[#ef4444]"
                      : ""
                  }
                />
                {tab.label}
              </button>
            ))}

            {projectId && (
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-bold text-[#71717a] hover:text-white mt-4 border-t border-white/[0.04] pt-6"
              >
                <ChevronRight size={14} className="rotate-180" />
                Back to Workspace
              </button>
            )}
          </div>

          {/* Tab content */}
          <div
            className="flex-1 overflow-y-auto py-6 pl-8"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="max-w-[680px]">
              {error && <AlertBanner type="error">{error}</AlertBanner>}
              {successMsg && (
                <AlertBanner type="success">{successMsg}</AlertBanner>
              )}

              {/* ── PROJECT SETTINGS ── */}
              {projectId ? (
                <>
                  {activeTab === "GENERAL" && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/10">
                          <h2 className="text-[14px] font-semibold text-white mb-0.5">
                            Project Name
                          </h2>
                          <p className="text-[13px] text-purple-200">
                            Used to identify your project on the dashboard.
                          </p>
                        </div>
                        <div className="px-6 py-5">
                          <InputField
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                          />
                        </div>
                        <div className="px-6 py-3.5 bg-white/5 border-t border-white/10 flex justify-end">
                          <GlassButton
                            variant="primary"
                            className="h-8 px-4 text-xs bg-green-600 backdrop-blur-md border border-green-500 hover:bg-green-700"
                            onClick={() => handleUpdate({ name: projectName })}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save"}
                          </GlassButton>
                        </div>
                      </div>

                      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                          <div>
                            <h2 className="text-[14px] font-semibold text-white mb-0.5 flex items-center gap-2">
                              <Globe size={14} className="text-green-300" />{" "}
                              Domains
                            </h2>
                            <p className="text-[13px] text-green-200">
                              Manage custom domains for your project.
                            </p>
                          </div>
                        </div>
                        <div className="px-6 py-5">
                          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                            <div>
                              <span className="text-[13px] font-medium text-white block">
                                {project?.name
                                  ?.toLowerCase()
                                  .replace(/\s+/g, "-")}
                                .velora.app
                              </span>
                              <span className="text-[12px] text-emerald-400 flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                                Valid Configuration
                              </span>
                            </div>
                            <GlassButton
                              variant="outline"
                              className="h-8 px-3 text-xs bg-white/10 backdrop-blur-md border-white/20"
                              disabled
                            >
                              Edit
                            </GlassButton>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "VARIABLES" && (
                    <motion.div
                      key="vars"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <EnvTable projectId={projectId} />
                    </motion.div>
                  )}

                  {activeTab === "ADVANCED" && (
                    <motion.div
                      key="advanced"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                        <div className="px-6 py-5 border-b border-white/[0.06]">
                          <h2 className="text-[14px] font-semibold text-white mb-0.5">
                            Build & Development Settings
                          </h2>
                          <p className="text-[13px] text-[#71717a]">
                            Configure how your project is built and developed.
                          </p>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Framework Preset"
                              value="Auto-detect"
                              disabled
                            />
                            <InputField
                              label="Build Command"
                              value={installCommand}
                              onChange={(e) =>
                                setInstallCommand(e.target.value)
                              }
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Output Directory"
                              defaultValue="dist"
                              disabled
                            />
                            <InputField
                              label="Start Command"
                              value={startCommand}
                              onChange={(e) => setStartCommand(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="px-6 py-3.5 bg-[#0d0d0f] border-t border-white/[0.06] flex justify-end">
                          <GlassButton
                            variant="primary"
                            className="h-8 px-4 text-xs"
                            onClick={() =>
                              handleUpdate({ installCommand, startCommand })
                            }
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save Settings"}
                          </GlassButton>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "DANGER" && (
                    <motion.div
                      key="danger"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="bg-[#111113] border border-[#ef4444]/20 rounded-xl overflow-hidden shadow-elevation-1">
                        <div className="px-6 py-5 border-b border-[#ef4444]/10 bg-[#ef4444]/[0.02] flex items-start gap-3">
                          <AlertTriangle
                            size={16}
                            className="text-[#ef4444] mt-0.5 shrink-0"
                          />
                          <div>
                            <h2 className="text-[14px] font-semibold text-[#ef4444] mb-0.5">
                              Delete Project
                            </h2>
                            <p className="text-[13px] text-[#71717a]">
                              Permanently remove your project and all its
                              deployments. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <div className="px-6 py-5 flex items-center justify-between">
                          <span className="text-[13px] text-white">
                            Delete{" "}
                            <span className="font-semibold font-mono">
                              {project?.name}
                            </span>
                          </span>
                          <GlassButton
                            variant="danger"
                            className="h-9 px-4 text-[13px]"
                            onClick={handleDelete}
                            disabled={saving}
                          >
                            {saving ? "Deleting..." : "Delete Project"}
                          </GlassButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* ── GLOBAL / WORKSPACE SETTINGS ── */
                <motion.div
                  key="global"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6"
                >
                  {activeTab === "WORKSPACE" && (
                    <>
                      <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                        <div className="px-6 py-5 border-b border-white/[0.06]">
                          <h2 className="text-[14px] font-semibold text-white mb-0.5">
                            Workspace Management
                          </h2>
                          <p className="text-[13px] text-[#71717a]">
                            Overview of all projects in your architectural
                            workspace.
                          </p>
                        </div>
                        <div className="px-2 py-2">
                          {allProjects.length === 0 ? (
                            <div className="py-10 text-center text-[#71717a] text-[13px]">
                              No projects found.
                            </div>
                          ) : (
                            allProjects.map((p) => (
                              <div
                                key={p._id}
                                onClick={() =>
                                  navigate(`/settings?projectId=${p._id}`)
                                }
                                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                    <Folder
                                      size={14}
                                      className="text-[#a1a1aa]"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-bold text-white group-hover:text-[#22c55e] transition-colors">
                                      {p.name}
                                    </p>
                                    <p className="text-[11px] text-[#52525b] font-mono">
                                      {p.repoName}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight
                                  size={14}
                                  className="text-[#3f3f46] group-hover:translate-x-1 transition-transform"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                        <div className="px-6 py-5 border-b border-white/[0.06]">
                          <h2 className="text-[14px] font-semibold text-white mb-0.5">
                            Platform Usage
                          </h2>
                          <p className="text-[13px] text-[#71717a]">
                            Monitor your workspace resource allocation.
                          </p>
                        </div>
                        <div className="px-6 py-5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[12px] text-[#a1a1aa]">
                              Build Minutes
                            </span>
                            <span className="text-[12px] font-bold text-white">
                              124 / 500 min
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-[#22c55e] w-[25%]" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(activeTab === "PROFILE" || activeTab === "SECURITY") && (
                    <div className="py-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <User size={20} className="text-[#3f3f46]" />
                      </div>
                      <p className="text-[14px] font-bold text-white mb-1">
                        Redirecting to Account
                      </p>
                      <p className="text-[13px] text-[#71717a] mb-6">
                        Profile and security settings are managed in your
                        account page.
                      </p>
                      <GlassButton
                        variant="primary"
                        onClick={() => navigate("/account")}
                      >
                        Go to Account
                      </GlassButton>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
