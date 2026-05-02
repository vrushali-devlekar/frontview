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

    </div>
  );
};

export default DeploymentLogsPage;
