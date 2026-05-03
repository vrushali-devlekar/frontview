import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card } from "../../components/layout/PageLayout";
import { Database, MessageSquare, Zap, HardDrive, CheckCircle2, ArrowRight, Settings2, Trash2, X, Plug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getIntegrations, connectIntegration, disconnectIntegration, getUserProjects } from "../../api/api";

export default function Integrations() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [activeIntegrations, setActiveIntegrations] = useState([]);
  const [modalConfig, setModalConfig] = useState(null); // { provider, name, inputLabel, type }
  const [configValue, setConfigValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const integrationOptions = [
    {
      id: "mongodb",
      name: "MongoDB Atlas",
      description: "Auto-provision a cloud database and inject MONGO_URI into your active projects.",
      icon: Database,
      accent: "#47A248",
      type: "Database",
      inputLabel: "Connection String (URI)",
      placeholder: "mongodb+srv://user:pass@cluster.mongodb.net/db",
      engineType: "database"
    },
    {
      id: "redis",
      name: "Upstash Redis",
      description: "Serverless Redis caching. Injects REDIS_URL directly into your build environment.",
      icon: HardDrive,
      accent: "#FF4438",
      type: "Cache",
      inputLabel: "Redis URI",
      placeholder: "redis://default:pass@endpoint.upstash.io:6379",
      engineType: "database"
    },
    {
      id: "slack",
      name: "Slack Alerts",
      description: "Send deployment success/failure notifications to your team channel.",
      icon: MessageSquare,
      accent: "#E01E5A",
      type: "Notifications",
      inputLabel: "Incoming Webhook URL",
      placeholder: "https://hooks.slack.com/services/...",
      engineType: "notification"
    },
    {
      id: "discord",
      name: "Discord Webhooks",
      description: "Stream live build logs and deployment status directly to Discord.",
      icon: Zap,
      accent: "#5865F2",
      type: "Notifications",
      inputLabel: "Discord Webhook URL",
      placeholder: "https://discord.com/api/webhooks/...",
      engineType: "notification"
    },
  ];

  useEffect(() => {
    if (projectId) {
      fetchIntegrations();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await getIntegrations(projectId);
      setActiveIntegrations(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch integrations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (option) => {
    // If already connected, pre-fill config if possible (optional)
    const existing = activeIntegrations.find(i => i.provider === option.id);
    if (existing) {
      // In a real app, you might want to show masked value or allow editing
      const config = Object.fromEntries(existing.config);
      setConfigValue(config.uri || config.webhookUrl || "");
    } else {
      setConfigValue("");
    }
    setModalConfig(option);
  };

  const handleSaveIntegration = async () => {
    if (!configValue) return showToast("Please enter a value", "error");
    
    setIsSubmitting(true);
    try {
      const config = {};
      if (modalConfig.engineType === 'database') config.uri = configValue;
      else config.webhookUrl = configValue;

      await connectIntegration(projectId, {
        provider: modalConfig.id,
        type: modalConfig.engineType,
        config
      });

      showToast(`${modalConfig.name} connected successfully!`);
      setModalConfig(null);
      fetchIntegrations();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to connect", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIntegration = async (integrationId) => {
    if (!window.confirm("Are you sure you want to disconnect this integration?")) return;
    
    try {
      await disconnectIntegration(projectId, integrationId);
      showToast("Integration disconnected");
      fetchIntegrations();
    } catch (err) {
      showToast("Failed to disconnect", "error");
    }
  };

  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (!projectId) {
      const fetchProjects = async () => {
        try {
          const res = await getUserProjects();
          setUserProjects(res.data.data || []);
        } catch (e) { console.error(e); }
      };
      fetchProjects();
    }
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
        <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
        <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
          <TopNav />
          <PageShell>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 pt-12">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
                <Plug className="text-[#52525b]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Select a Project First</h2>
              <p className="text-[#71717a] text-[15px] max-w-md leading-relaxed mb-10">
                Integrations are configured per project. Please select a project to manage its plugins and database connections.
              </p>
              
              <div className="w-full max-w-md grid grid-cols-1 gap-3">
                {userProjects.length > 0 ? userProjects.map(p => (
                  <button 
                    key={p._id}
                    onClick={() => window.location.href = `/integrations?projectId=${p._id}`}
                    className="flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors">
                        <HardDrive size={16} />
                      </div>
                      <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">{p.name}</span>
                    </div>
                    <ArrowRight size={16} className="text-[#3f3f46] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                )) : (
                  <div className="p-8 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl text-[#52525b] text-sm">
                    No projects found. Create one first.
                  </div>
                )}
              </div>

              <div className="mt-12">
                <GlassButton variant="secondary" onClick={() => window.location.href = '/dashboard'}>
                  Back to Dashboard
                </GlassButton>
              </div>
            </div>
          </PageShell>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader
            title="Integrations"
            subtitle={`Power up your deployment pipeline with third-party extensions`}
          >
            <GlassButton 
              variant="secondary" 
              className="h-8 px-3 text-[11px] font-bold"
              onClick={() => window.location.href = '/integrations'}
            >
              Change Project
            </GlassButton>
          </PageHeader>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-[200px] bg-white/[0.02] border border-white/[0.05] rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {integrationOptions.map((app, i) => {
                const active = activeIntegrations.find(integ => integ.provider === app.id);
                const isConnected = !!active;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                  >
                    <Card className="flex flex-col h-full group overflow-hidden">
                      {/* Card body */}
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `${app.accent}18`, border: `1px solid ${app.accent}30` }}
                            >
                              <app.icon size={20} style={{ color: app.accent }} />
                            </div>
                            <div>
                              <h3 className="text-[14px] font-bold text-white leading-tight">{app.name}</h3>
                              <span className="text-[10.5px] font-semibold text-[#52525b] uppercase tracking-[0.1em] mt-0.5 block">
                                {app.type}
                              </span>
                            </div>
                          </div>
                          {isConnected && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 uppercase tracking-wider">
                                <CheckCircle2 size={10} /> Connected
                              </span>
                              <button 
                                onClick={() => handleDeleteIntegration(active._id)}
                                className="p-1.5 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                                title="Disconnect"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        <p className="text-[13px] text-[#71717a] leading-relaxed">
                          {app.description}
                        </p>
                      </div>

                      {/* Card footer */}
                      <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.015]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.08em]">
                          <Zap size={10} className={isConnected ? "text-[#22c55e]" : ""} />
                          {app.engineType === 'database' ? "Auto-injects variables" : "Event-driven hooks"}
                        </div>
                        <GlassButton
                          variant={isConnected ? "secondary" : "primary"}
                          onClick={() => handleOpenModal(app)}
                          className="h-8 px-4 text-[12px] gap-1.5"
                        >
                          {isConnected ? (
                            <><Settings2 size={12} /> Configure</>
                          ) : (
                            <>Connect <ArrowRight size={12} /></>
                          )}
                        </GlassButton>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </PageShell>
      </PageWrapper>

      {/* Connection Modal */}
      <AnimatePresence>
        {modalConfig && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0a0a0b] border border-white/[0.08] rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20"
                style={{ background: modalConfig.accent }}
              />

              <button 
                onClick={() => setModalConfig(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/[0.05] text-[#52525b] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{ background: `${modalConfig.accent}20`, border: `1px solid ${modalConfig.accent}40` }}
                >
                  <modalConfig.icon size={28} style={{ color: modalConfig.accent }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Connect {modalConfig.name}</h2>
                  <p className="text-[13px] text-[#71717a] mt-0.5">Integration for your active deployment</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-[#3f3f46] uppercase tracking-[0.2em] mb-3">
                    {modalConfig.inputLabel}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={configValue}
                      onChange={(e) => setConfigValue(e.target.value)}
                      placeholder={modalConfig.placeholder}
                      className="w-full h-14 bg-[#050505] border border-white/[0.08] group-hover:border-white/[0.15] focus:border-white/[0.3] rounded-2xl px-5 text-sm transition-all focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-[#52525b] mt-3 leading-relaxed">
                    This value will be encrypted and {modalConfig.engineType === 'database' ? 'injected as an environment variable' : 'used to send deployment triggers'}.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setModalConfig(null)}
                    className="flex-1 h-12 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-white text-sm font-bold border border-white/[0.05] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveIntegration}
                    disabled={isSubmitting}
                    className="flex-1 h-12 rounded-2xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                  >
                    {isSubmitting ? "Connecting..." : "Save Configuration"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className={`px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 ${
              toast.type === "error" 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-white/10 border-white/20 text-white"
            }`}>
              {toast.type === "error" ? <X size={16} /> : <CheckCircle2 size={16} />}
              <span className="text-[13px] font-bold tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}