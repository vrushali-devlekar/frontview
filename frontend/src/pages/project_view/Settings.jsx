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
Trash2,
Octagon as Github
} from "lucide-react";   
import GlassButton from "../../components/ui/GlassButton";
import InputField from "../../components/ui/InputField";
import EnvTable from "../../components/project/EnvTable";
import { motion } from "framer-motion";
import { getProject, updateProject, deleteProject, getProjects, getWorkspaceOverview } from "../../api/api";
import { AlertBanner, Card, PageHeader } from "../../components/layout/PageLayout";

export default function Settings() {
    const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const projectId = searchParams.get("projectId") || "";

    const [activeTab, setActiveTab] = useState("GENERAL");
    const [project, setProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [workspaceStats, setWorkspaceStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteRemoteRepo, setDeleteRemoteRepo] = useState(false);

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
                    const [projectsResponse, overviewResponse] = await Promise.all([
                        getProjects(),
                        getWorkspaceOverview(),
                    ]);
                    setAllProjects(projectsResponse.data?.data || []);
                    setWorkspaceStats(overviewResponse.data?.data?.stats || null);
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
        setSaving(true);
        setError("");
        try {
            const { data } = await deleteProject(projectId, {
                deleteRemoteRepo,
                confirmationName: deleteConfirmation,
            });
            setSuccessMsg(data?.message || "Project deleted successfully.");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete project.");
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
            <div className="flex h-screen bg-[#050505] text-white font-sans items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#22c55e]" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
            <Dock navMode={navMode} toggleNavMode={toggleNavMode} />

            <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
                <TopNav />

                {/* Page header */}
                <div className="px-4 md:px-8 py-5 md:py-6 border-b border-white/[0.06] shrink-0">
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
                <div className="flex-1 overflow-y-auto max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row px-4 md:px-8 lg:px-0">

                    {/* Tab sidebar */}
                    <div className="w-full lg:w-64 shrink-0 py-4 lg:py-6 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-row lg:flex-col gap-2 lg:gap-0.5 overflow-x-auto lg:overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                        <p className="hidden lg:block text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2 px-3">Sections</p>
                        {currentTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex shrink-0 items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors text-left ${activeTab === tab.id
                                        ? "bg-white/[0.08] text-white"
                                        : "text-[#71717a] hover:text-white hover:bg-white/[0.04]"
                                    } ${tab.id === "DANGER" ? "text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/[0.06] mt-auto" : ""}`}
                            >
                                <tab.icon size={15} className={tab.id === "DANGER" && activeTab !== "DANGER" ? "text-[#ef4444]" : ""} />
                                {tab.label}
                            </button>
                        ))}
                        
                        {projectId && (
                            <button
                                onClick={() => navigate("/settings")}
                                className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-[12px] font-bold text-[#71717a] hover:text-white lg:mt-4 lg:border-t lg:border-white/[0.04] lg:pt-6"
                            >
                                <ChevronRight size={14} className="rotate-180" />
                                Back to Workspace
                            </button>
                        )}
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-y-auto py-6 lg:pl-8 min-w-0" style={{ scrollbarWidth: "none" }}>
                        <div className="max-w-[760px]">
                            {error && <AlertBanner type="error">{error}</AlertBanner>}
                            {successMsg && <AlertBanner type="success">{successMsg}</AlertBanner>}

                            {/* ── PROJECT SETTINGS ── */}
                            {projectId ? (
                                <>
                                    {activeTab === "GENERAL" && (
                                        <motion.div key="general" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Project Name</h2>
                                                    <p className="text-[13px] text-[#71717a]">Used to identify your project on the dashboard.</p>
                                                </div>
                                                <div className="px-6 py-5">
                                                    <InputField 
                                                        value={projectName} 
                                                        onChange={(e) => setProjectName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="px-6 py-3.5 bg-[#0d0d0f] border-t border-white/[0.06] flex justify-end">
                                                    <GlassButton 
                                                        variant="primary" 
                                                        className="h-8 px-4 text-xs"
                                                        onClick={() => handleUpdate({ name: projectName })}
                                                        disabled={saving}
                                                    >
                                                        {saving ? "Saving..." : "Save"}
                                                    </GlassButton>
                                                </div>
                                            </div>

                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                                                    <div>
                                                        <h2 className="text-[14px] font-semibold text-white mb-0.5 flex items-center gap-2">
                                                            <Globe size={14} className="text-[#71717a]" /> Domains
                                                        </h2>
                                                        <p className="text-[13px] text-[#71717a]">Manage custom domains for your project.</p>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-5">
                                                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0f] border border-white/[0.06] rounded-lg">
                                                        <div>
                                                            <span className="text-[13px] font-medium text-white block">
                                                                {project?.name?.toLowerCase().replace(/\s+/g, '-')}.velora.app
                                                            </span>
                                                            <span className="text-[12px] text-[#22c55e] flex items-center gap-1.5 mt-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Valid Configuration
                                                            </span>
                                                        </div>
                                                        <GlassButton variant="outline" className="h-8 px-3 text-xs" disabled>Edit</GlassButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "VARIABLES" && (
                                        <motion.div key="vars" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                            <EnvTable projectId={projectId} />
                                        </motion.div>
                                    )}

                                    {activeTab === "ADVANCED" && (
                                        <motion.div key="advanced" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Build & Development Settings</h2>
                                                    <p className="text-[13px] text-[#71717a]">Configure how your project is built and developed.</p>
                                                </div>
                                                <div className="px-6 py-5 flex flex-col gap-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField label="Framework Preset" value="Auto-detect" disabled />
                                                        <InputField 
                                                            label="Build Command" 
                                                            value={installCommand} 
                                                            onChange={(e) => setInstallCommand(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField label="Output Directory" defaultValue="dist" disabled />
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
                                                        onClick={() => handleUpdate({ installCommand, startCommand })}
                                                        disabled={saving}
                                                    >
                                                        {saving ? "Saving..." : "Save Settings"}
                                                    </GlassButton>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "DANGER" && (
                                        <motion.div key="danger" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                            <div className="bg-[#111113] border border-[#ef4444]/20 rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-[#ef4444]/10 bg-[#ef4444]/[0.02] flex items-start gap-3">
                                                    <AlertTriangle size={16} className="text-[#ef4444] mt-0.5 shrink-0" />
                                                    <div>
                                                        <h2 className="text-[14px] font-semibold text-[#ef4444] mb-0.5">Delete Project</h2>
                                                        <p className="text-[13px] text-[#71717a]">
                                                            Remove this project from Velora. You can also choose to delete the linked GitHub repository in the same action.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-5 flex flex-col gap-5">
                                                    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0f] p-4">
                                                        <p className="text-[12px] font-semibold text-white mb-1">Deletion summary</p>
                                                        <p className="text-[12px] text-[#71717a] leading-6">
                                                            This removes <span className="font-semibold text-white">{project?.name}</span> from your Velora dashboard, stops any active deployment, and hides the project from your workspace.
                                                        </p>
                                                        <p className="mt-3 text-[12px] text-[#71717a] leading-6">
                                                            Linked repository:
                                                            <span className="ml-2 font-mono text-[#d4d4d8]">{project?.repoName || "Not available"}</span>
                                                        </p>
                                                    </div>

                                                    <InputField
                                                        label={`Type "${project?.name}" to confirm`}
                                                        value={deleteConfirmation}
                                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                                        placeholder={project?.name || "Project name"}
                                                    />

                                                    <label className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0d0d0f] px-4 py-4 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={deleteRemoteRepo}
                                                            onChange={(e) => setDeleteRemoteRepo(e.target.checked)}
                                                            className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-[#ef4444] accent-[#ef4444]"
                                                        />
                                                        <div className="min-w-0">
                                                            <span className="flex items-center gap-2 text-[13px] font-medium text-white">
                                                                <Github size={14} className="text-[#71717a]" />
                                                                Also delete the linked GitHub repository
                                                            </span>
                                                            <p className="mt-1 text-[12px] text-[#71717a] leading-5">
                                                                Use this only if you want the actual repository removed from GitHub, not just disconnected from Velora.
                                                            </p>
                                                        </div>
                                                    </label>

                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-[12px] text-[#a1a1aa]">
                                                            {deleteRemoteRepo
                                                                ? "Project and linked GitHub repository will be deleted."
                                                                : "Only the Velora project will be deleted."}
                                                        </span>
                                                        <GlassButton 
                                                            variant="danger" 
                                                            className="h-10 px-4 text-[13px]"
                                                            onClick={handleDelete}
                                                            disabled={saving || deleteConfirmation.trim() !== project?.name}
                                                        >
                                                            <Trash2 size={14} />
                                                            {saving ? "Deleting..." : deleteRemoteRepo ? "Delete Project + Repo" : "Delete Project"}
                                                        </GlassButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                /* ── GLOBAL / WORKSPACE SETTINGS ── */
                                <motion.div key="global" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                                    
                                    {activeTab === "WORKSPACE" && (
                                        <>
                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Workspace Management</h2>
                                                    <p className="text-[13px] text-[#71717a]">Overview of all projects in your architectural workspace.</p>
                                                </div>
                                                <div className="px-2 py-2">
                                                    {allProjects.length === 0 ? (
                                                        <div className="py-10 text-center text-[#71717a] text-[13px]">No projects found.</div>
                                                    ) : (
                                                        allProjects.map((p) => (
                                                            <div 
                                                                key={p._id}
                                                                onClick={() => navigate(`/settings?projectId=${p._id}`)}
                                                                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                                                        <Folder size={14} className="text-[#a1a1aa]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-bold text-white group-hover:text-[#22c55e] transition-colors">{p.name}</p>
                                                                        <p className="text-[11px] text-[#52525b] font-mono">{p.repoName}</p>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight size={14} className="text-[#3f3f46] group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Workspace Usage</h2>
                                                    <p className="text-[13px] text-[#71717a]">Calculated from your current projects and deployment history.</p>
                                                </div>
                                                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {[
                                                        { label: "Projects", value: workspaceStats?.totalProjects || String(allProjects.length) },
                                                        { label: "Deployments", value: workspaceStats?.totalDeployments || "0" },
                                                        { label: "Success Rate", value: workspaceStats?.successRate || "0%" },
                                                    ].map((item) => (
                                                        <div key={item.label} className="rounded-xl border border-white/[0.06] bg-[#0d0d0f] px-4 py-4">
                                                            <p className="text-[11px] text-[#52525b] uppercase tracking-[0.1em] font-bold">{item.label}</p>
                                                            <p className="text-[20px] text-white font-bold mt-2">{item.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {(activeTab === "PROFILE" || activeTab === "SECURITY") && (
                                        <div className="py-10 text-center">
                                            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                                                <User size={20} className="text-[#3f3f46]" />
                                            </div>
                                            <p className="text-[14px] font-bold text-white mb-1">Redirecting to Account</p>
                                            <p className="text-[13px] text-[#71717a] mb-6">Profile and security settings are managed in your account page.</p>
                                            <GlassButton variant="primary" onClick={() => navigate("/account")}>
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
