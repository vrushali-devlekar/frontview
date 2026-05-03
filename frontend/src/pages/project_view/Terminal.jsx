<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Terminal, ArrowLeft, Square, Sparkles } from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import TerminalLogs from "../../components/project/TerminalLogs";
import AIModal from "../../components/project/AIModal";
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
    navigate(projectId ? `/deploy?projectId=${encodeURIComponent(projectId)}` : "/deploy");
  };

  // sidebarAttr removed in favor of PageWrapper inline styles

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />

      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />

        {/* Sub-header */}
        <div className="px-8 py-4 border-b border-white/[0.06] bg-[#09090b] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={goBack}
              className="p-1.5 rounded-lg text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-px h-5 bg-white/[0.08]" />
            <div>
              <h1 className="text-[14px] font-semibold text-white flex items-center gap-2">
                <Terminal size={14} className="text-[#71717a]" /> Build Logs
              </h1>
              {deploymentId && (
                <span className="text-[11px] font-mono text-[#52525b]">{deploymentId}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton
              variant="danger"
              disabled={isStopping || !deploymentId || ["stopped", "failed"].includes(deploymentStatus)}
              onClick={async () => {
                if (!deploymentId) return;
                if (["stopped", "failed"].includes(deploymentStatus)) return;
                setIsStopping(true);
                try { await stopDeploymentRequest(deploymentId); }
                finally { setIsStopping(false); }
              }}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Square size={12} />
              {isStopping ? "Stopping…" : ["stopped", "failed"].includes(deploymentStatus) ? "Stopped" : "Stop Build"}
            </GlassButton>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarWidth: "none" }}>
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
                <span className="text-[11px] text-[#52525b] font-mono ml-2">stdout</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <TerminalLogs
                  deploymentId={deploymentId}
                  onErrorDetect={() => setHasError(true)}
                  onStatusChange={setDeploymentStatus}
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

            <AIModal
              deploymentId={deploymentId}
              isOpen={isAIModalOpen}
              onClose={() => setIsAIModalOpen(false)}
            />
          </div>
        </div>
<<<<<<< HEAD
      </PageWrapper>
=======
      </div>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
import React, { useState } from 'react';
import { Terminal, Activity, ArrowLeft, ShieldCheck } from 'lucide-react';
import TerminalLogs from '../../components/project/TerminalLogs';
import AIModal from '../../components/project/AIModal';

const DeploymentLogsPage = ({ deploymentId = "dp-003a", onBack }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [errorLogsToAnalyze, setErrorLogsToAnalyze] = useState([]);
  const [hasError, setHasError] = useState(false);

  const handleErrorDetect = (logs) => {
    setHasError(true);
    setErrorLogsToAnalyze(logs);
  };

  // The stream simulation and web socket connection are now handled inside TerminalLogs

  return (
    <div className="relative p-6 md:p-8 min-h-screen font-sans text-[var(--color-velora-text)] z-0">
      
      {/* Background Banner */}
      <div 
        className="absolute top-0 left-0 right-0 h-[150px] md:h-[200px] -z-10 bg-no-repeat bg-cover bg-center pointer-events-none"
        style={{ 
          backgroundImage: `url(/hotel-bg.png)`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velora-bg)]" />
      </div>

      <div className="flex items-center gap-4 mt-[60px] md:mt-[100px] mb-6">
        <button onClick={onBack} className="p-2 border border-[#40403a] rounded-lg hover:bg-[#40403a] transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-lg md:text-xl tracking-widest uppercase drop-shadow-[0_0_8px_rgba(224,216,190,0.5)] flex items-center gap-3">
          <Terminal size={20} className="text-valora-cyan" />
          Logs: {deploymentId}
        </h2>
        {/* Connection status is now inside TerminalLogs */}
      </div>

      {/* Log Console Viewer */}
      <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-4 md:p-6 shadow-2xl relative overflow-hidden flex flex-col h-[600px]">
        <TerminalLogs 
          deploymentId={deploymentId} 
          onErrorDetect={handleErrorDetect} 
        />
      </div>

      {/* AI Analysis Button (Dynamic Popup) */}
      {hasError && (
        <div className="mt-6 flex justify-end animate-pulse">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="bg-valora-card px-6 py-3 rounded-xl border border-red-500 hover:bg-[#111] transition-all flex items-center gap-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)] shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Activity size={16} className="text-red-500" />
            <span className="font-mono text-sm tracking-widest text-red-500 font-bold">ASK AI TO FIX</span>
          </button>
        </div>
      )}

      {/* The AI Modal Engine */}
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        errorLogs={errorLogsToAnalyze} 
      />

<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
    </div>
  );
};

export default DeploymentLogsPage;