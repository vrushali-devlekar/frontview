import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Terminal, ArrowLeft, Square, Sparkles } from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import TerminalLogs from "../../components/project/TerminalLogs";
import AIAnalysisPanel from "../../components/project/AIAnalysisPanel";
import { stopDeploymentRequest } from "../../api/api";
import GlassButton from "../../components/ui/GlassButton";

const DeploymentLogsPage = () => {
  const { deploymentId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState("");

  const goBack = () => {
    navigate(
      projectId
        ? `/deploy?projectId=${encodeURIComponent(projectId)}`
        : "/deploy",
    );
  };

  const handleStop = async () => {
    if (!deploymentId) return;
    if (["stopped", "failed"].includes(String(deploymentStatus).toLowerCase())) return;

    setIsStopping(true);
    setDeploymentStatus("stopped");
    try {
      await stopDeploymentRequest(deploymentId);
    } finally {
      setIsStopping(false);
    }
  };

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

        {/* Sub-header */}
        <div className="px-8 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={goBack}
              className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-px h-5 bg-white/20" />
            <div>
              <h1 className="text-[14px] font-semibold text-white flex items-center gap-2">
                <Terminal size={14} className="text-[#71717a]" /> Build Logs
              </h1>
              {deploymentId && (
                <span className="text-[11px] font-mono text-[#52525b]">
                  {deploymentId}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton
              variant="danger"
              onClick={() => setIsAIModalOpen(true)}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Sparkles size={12} /> AI Debug
            </GlassButton>
            {deploymentStatus !== "COMPLETED" && (
              <GlassButton
                variant="danger"
                className="h-8 px-3 text-xs gap-2 bg-red-500/20 backdrop-blur-md border-red-500/30 hover:bg-red-500/30"
                onClick={handleStop}
                disabled={isStopping}
              >
                <Square size={12} /> {isStopping ? "Stopping..." : "Stop"}
              </GlassButton>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-8"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="max-w-[1200px] mx-auto flex flex-col h-full gap-4 min-h-0">
            {/* Terminal card */}
            <div className="bg-[#111113] border border-white/[0.06] rounded-xl shadow-elevation-1 flex-1 flex flex-col min-h-[400px] overflow-hidden">
              {/* Terminal header */}
              <div className="px-4 py-3 border-b border-white/[0.06] bg-[#0d0d0f] flex items-center gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/60" />
                </div>
                <span className="text-[11px] text-[#52525b] font-mono ml-2">
                  stdout
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <TerminalLogs
                  deploymentId={deploymentId}
                  onErrorDetect={() => setHasError(true)}
                  onStatusChange={setDeploymentStatus}
                  onOpenAnalysis={() => setIsAIModalOpen(true)}
                />
              </div>
            </div>

            {/* AI button */}
            <div className="flex justify-end shrink-0">
              <GlassButton
                variant={hasError ? "danger" : "outline"}
                onClick={() => setIsAIModalOpen(true)}
                className={`h-9 px-4 gap-2 ${hasError ? "animate-pulse" : ""}`}
              >
                <Sparkles size={14} />
                {hasError ? "Fix with AI" : "Analyze Logs"}
              </GlassButton>
            </div>

            <AIAnalysisPanel
              deploymentId={deploymentId}
              isOpen={isAIModalOpen}
              onClose={() => setIsAIModalOpen(false)}
            />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default DeploymentLogsPage;
