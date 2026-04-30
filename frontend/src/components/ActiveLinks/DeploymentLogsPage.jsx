import React, { useState, useEffect } from 'react';
import { Terminal, Activity, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

const DeploymentLogsPage = ({ deploymentId = "dp-003a", onBack }) => {
  const [logs, setLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);

  // Mocking real-time logs
  useEffect(() => {
    if (!isStreaming) return;
    
    const mockLogStream = [
      { type: 'info', time: '10:00:01', message: 'Starting deployment pipeline dp-003a...' },
      { type: 'info', time: '10:00:03', message: 'Cloning repository from GitHub...' },
      { type: 'info', time: '10:00:05', message: 'Resolving dependencies...' },
      { type: 'info', time: '10:00:12', message: 'Building application...' },
      { type: 'warn', time: '10:00:15', message: 'Warning: Deprecated dependency "marked" found.' },
      { type: 'info', time: '10:00:22', message: 'Running unit tests...' },
      { type: 'info', time: '10:00:30', message: 'Tests passed (142/142).' },
      { type: 'info', time: '10:00:32', message: 'Creating Docker image...' },
      { type: 'info', time: '10:00:45', message: 'Pushing image to registry...' },
      { type: 'info', time: '10:00:55', message: 'Updating container orchestration...' },
      { type: 'success', time: '10:01:05', message: 'Deployment successful!' },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockLogStream.length) {
        setLogs(prev => [...prev, mockLogStream[currentIndex]]);
        currentIndex++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isStreaming]);

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
          <Terminal size={20} className="text-[var(--color-velora-accent-green)]" />
          Logs: {deploymentId}
        </h2>
        {isStreaming ? (
          <div className="flex items-center gap-2 ml-auto text-[var(--color-velora-accent-yellow)] border border-[var(--color-velora-accent-yellow)]/30 bg-[var(--color-velora-accent-yellow)]/10 px-3 py-1 rounded-full text-xs font-mono">
            <RefreshCw size={12} className="animate-spin" /> Streaming
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-auto text-[var(--color-velora-accent-green)] border border-[var(--color-velora-accent-green)]/30 bg-[var(--color-velora-accent-green)]/10 px-3 py-1 rounded-full text-xs font-mono">
            <ShieldCheck size={12} /> Completed
          </div>
        )}
      </div>

      {/* Log Console Viewer */}
      <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-4 md:p-6 shadow-2xl relative overflow-hidden flex flex-col h-[600px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#40403a] mb-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-velora-accent-red)]/50" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-velora-accent-yellow)]/50" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-velora-accent-green)]/50" />
          </div>
          <p className="text-xs font-mono text-[var(--color-velora-text-muted)] tracking-widest">DeployPilot Secure Shell</p>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Log Lines */}
        <div className="flex-1 overflow-y-auto font-mono text-[11px] md:text-xs tracking-wider leading-relaxed pr-2 custom-scrollbar">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-4 mb-2 hover:bg-[#40403a]/50 px-2 py-1 rounded transition-colors group">
              <span className="text-[var(--color-velora-text-muted)] min-w-[60px] opacity-50 group-hover:opacity-100 transition-opacity">
                {log.time}
              </span>
              <span className={`flex-1 ${
                log.type === 'error' ? 'text-[var(--color-velora-accent-red)]' : 
                log.type === 'warn' ? 'text-[var(--color-velora-accent-yellow)]' : 
                log.type === 'success' ? 'text-[var(--color-velora-accent-green)] text-shadow-glow' : 
                'text-[var(--color-velora-text)]'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
          {isStreaming && (
            <div className="flex gap-4 px-2 py-1">
              <span className="text-[var(--color-velora-text-muted)] min-w-[60px] opacity-50">--:--:--</span>
              <span className="text-[var(--color-velora-text-muted)] animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Button (Mock) */}
      {!isStreaming && (
        <div className="mt-6 flex justify-end">
          <button className="bg-[var(--color-velora-bg)] px-6 py-3 rounded-xl border border-[var(--color-velora-accent-green)]/50 hover:bg-[#40403a] hover:border-[var(--color-velora-accent-green)] transition-all flex items-center gap-3 drop-shadow-[0_0_8px_rgba(40,167,69,0.2)]">
            <Activity size={16} className="text-[var(--color-velora-accent-green)]" />
            <span className="font-mono text-sm tracking-widest">Run AI Log Analysis</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default DeploymentLogsPage;
