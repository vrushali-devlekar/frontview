<<<<<<< HEAD
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Terminal, ArrowLeft, Square } from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import TerminalLogs from "../../components/project/TerminalLogs";
import AIModal from "../../components/project/AIModal";
import heroBg from "../../assets/new-top.png";
import { stopDeploymentRequest } from "../../api/api";

const DeploymentLogsPage = () => {
  const { deploymentId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState("");

  const handleErrorDetect = () => {
    setHasError(true);
  };

  const goBack = () => {
    if (projectId) {
      navigate(`/deploy?projectId=${encodeURIComponent(projectId)}`);
    } else {
      navigate("/deploy");
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
          <div className="relative z-10 px-6 pb-4 flex items-end gap-4">
            <button
              type="button"
              onClick={goBack}
              className="p-2 border border-[#333] bg-[#0a0a0a] hover:bg-[#111] transition-colors shrink-0"
              aria-label="Back to deployments"
            >
              <ArrowLeft size={16} />
            </button>
            <h1
              className="text-lg md:text-xl text-[#FFCC00] font-bold tracking-widest flex items-center gap-3"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              <Terminal size={18} className="text-[#00FFCC]" />
              LOGS
            </h1>
            <span className="text-[10px] text-[#888] font-mono normal-case truncate">
              {deploymentId}
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                disabled={
                  isStopping ||
                  !deploymentId ||
                  ["stopped", "failed"].includes(deploymentStatus)
                }
                onClick={async () => {
                  if (!deploymentId) return;
                  if (["stopped", "failed"].includes(deploymentStatus)) return;
                  setIsStopping(true);
                  try {
                    await stopDeploymentRequest(deploymentId);
                  } finally {
                    setIsStopping(false);
                  }
                }}
                className="bg-[#0a0a0a] px-4 py-2 border border-red-500/60 text-red-400 hover:bg-[#111] text-[10px] font-mono tracking-widest disabled:opacity-50"
                title="Stop deployment"
              >
                <Square size={12} className="inline-block mr-2" />
                {isStopping
                  ? "STOPPING..."
                  : ["stopped", "failed"].includes(deploymentStatus)
                    ? "STOPPED"
                    : "STOP"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="bg-[#0a0a0a] border-2 border-[#222] rounded-xl p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(255,204,0,0.05)] flex flex-col h-[min(640px,calc(100vh-220px))]">
            <TerminalLogs
              deploymentId={deploymentId}
              onErrorDetect={handleErrorDetect}
              onStatusChange={setDeploymentStatus}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className={`px-5 py-3 rounded-xl border hover:bg-[#111] transition-all flex items-center gap-2 text-[10px] font-bold tracking-widest ${
                hasError
                  ? "border-red-500 text-red-400 animate-pulse"
                  : "border-[#00FFCC]/40 text-[#00FFCC] bg-[#0a0a0a]"
              }`}
            >
              {hasError ? "ASK_AI_TO_FIX" : "AI_ANALYZE_LOGS"}
            </button>
          </div>

          <AIModal
            deploymentId={deploymentId}
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
          />
        </div>
      </div>
=======
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

>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
    </div>
  );
};

export default DeploymentLogsPage;
