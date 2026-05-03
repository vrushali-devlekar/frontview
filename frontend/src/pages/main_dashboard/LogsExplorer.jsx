import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card } from "../../components/layout/PageLayout";
import { 
  Search, 
  Terminal as TerminalIcon, 
  Cpu, 
  Box, 
  MessageSquare, 
  ChevronRight, 
  Activity,
  Maximize2,
  Trash2,
  Sparkles,
  Send,
  User,
  Bot,
  Rocket,
  ArrowLeft,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects, getDeploymentsByProject, getDeployment, aiChat, triggerDeployment, SOCKET_ORIGIN } from "../../api/api";
import io from "socket.io-client";

export default function LogsExplorer() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [buildLogs, setBuildLogs] = useState([]);
  const [runtimeLogs, setRuntimeLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hello! I am Velora AI. How can I help you debug your logs today?' }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const socketRef = useRef(null);
  const buildLogsEndRef = useRef(null);
  const runtimeLogsEndRef = useRef(null);

  useEffect(() => {
    fetchProjects();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    buildLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [buildLogs]);

  useEffect(() => {
    runtimeLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runtimeLogs]);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setLoading(true);
    try {
      const res = await getDeploymentsByProject(project._id);
      const deps = res.data.data || [];
      setDeployments(deps);
      if (deps.length > 0) {
        handleSelectDeployment(deps[0]);
      }
    } catch (err) {
      console.error("Failed to fetch deployments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDeployment = (deployment) => {
    setSelectedDeployment(deployment);
    setBuildLogs(deployment.buildLogs || []);
    setRuntimeLogs(deployment.runtimeLogs || []);
    
    // Connect to socket for live logs if running
    if (deployment.status === 'running' || deployment.status === 'building') {
      connectSocket(deployment._id);
    } else {
      if (socketRef.current) socketRef.current.disconnect();
    }
  };

  const connectSocket = (id) => {
    if (socketRef.current) socketRef.current.disconnect();
    
    const socket = io(SOCKET_ORIGIN);
    socketRef.current = socket;

    socket.emit('join:deployment', id);

    socket.on('log:line', (log) => {
      const line = `[${new Date(log.timestamp).toLocaleTimeString()}] [${log.level.toUpperCase()}] ${log.message}`;
      if (log.logType === 'runtime') {
        setRuntimeLogs(prev => [...prev, line]);
      } else {
        setBuildLogs(prev => [...prev, line]);
      }
    });

    socket.on('deployment:status', (data) => {
      setSelectedDeployment(prev => prev ? { ...prev, status: data.status, url: data.url || prev.url } : null);
      if (data.status === 'running') {
        setIsDeploying(false);
      }
    });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userText = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput("");
    
    // Add temporary bot message for streaming
    setChatMessages(prev => [...prev, { role: 'bot', text: "", isStreaming: true }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userText,
          context: [...buildLogs, ...runtimeLogs].slice(-50)
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                botText += data.text;
                setChatMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  if (updated[lastIndex] && updated[lastIndex].role === 'bot') {
                    updated[lastIndex] = { ...updated[lastIndex], text: botText };
                  }
                  return updated;
                });
              }
            } catch (e) { /* ignore parse errors */ }
          }
        }
      }
      
      // Clear streaming flag
      setChatMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]) {
          updated[lastIndex].isStreaming = false;
        }
        return updated;
      });
    } catch (err) {
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'bot', text: "Sorry, I encountered an error.", isStreaming: false };
        return updated;
      });
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader 
            title="Log Explorer" 
            subtitle="Deep-dive into build and runtime telemetry"
          >
            <div className="flex items-center gap-3">
              {!selectedProject && (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64 bg-[#09090b] border border-white/[0.08] rounded-xl pl-9 pr-4 text-[13px] focus:outline-none focus:border-white/[0.2] transition-colors"
                  />
                </div>
              )}
            </div>
          </PageHeader>

          {!selectedProject ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(project => (
                <button 
                  key={project._id}
                  onClick={() => handleSelectProject(project)}
                  className="flex flex-col p-6 bg-[#111113] border border-white/[0.06] rounded-[24px] hover:border-white/[0.15] transition-all group text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors">
                      <Box size={20} />
                    </div>
                    <ChevronRight size={16} className="text-[#3f3f46] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-bold text-[15px] mb-1">{project.name}</h3>
                  <p className="text-[12px] text-[#52525b] font-mono">{project.repoUrl.split('/').pop()}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-full gap-5">
              {/* Project Bar */}
              <div className="flex items-center justify-between p-4 bg-[#111113] border border-white/[0.06] rounded-2xl">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedProject(null)} className="text-[#52525b] hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#71717a]">
                      <Box size={14} />
                    </div>
                    <h3 className="font-bold text-[15px]">{selectedProject.name}</h3>
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <select 
                    className="bg-transparent text-[13px] font-medium text-[#71717a] focus:outline-none cursor-pointer"
                    value={selectedDeployment?._id}
                    onChange={(e) => handleSelectDeployment(deployments.find(d => d._id === e.target.value))}
                  >
                    {deployments.map(d => (
                      <option key={d._id} value={d._id} className="bg-[#111113]">Version {d.version} ({new Date(d.createdAt).toLocaleDateString()})</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedDeployment?.status} />
                  <GlassButton 
                    variant="primary" 
                    className="h-8 px-4 text-[11px] gap-2"
                    disabled={isDeploying || selectedDeployment?.status === 'building'}
                    onClick={async () => {
                      if (isDeploying || selectedDeployment?.status === 'building') return;
                      setIsDeploying(true);
                      setBuildLogs([]);
                      setRuntimeLogs([]);
                      try {
                        const res = await triggerDeployment(selectedProject._id);
                        if (res.data.success) {
                          const newId = res.data.deploymentId;
                          // Fresh fetch to get the full deployment object
                          const dRes = await getDeployment(newId);
                          if (dRes.data.success) {
                            handleSelectDeployment(dRes.data.data);
                            // Refresh list too
                            const listRes = await getDeploymentsByProject(selectedProject._id);
                            setDeployments(listRes.data.data || []);
                          }
                        }
                      } catch (err) { 
                        const msg = err.response?.data?.message || "Failed to trigger deployment";
                        alert(msg); 
                        setIsDeploying(false);
                      }
                    }}
                  >
                    <Rocket size={12} className={isDeploying ? "animate-bounce" : ""} /> {isDeploying ? "Deploying..." : "Deploy Again"}
                  </GlassButton>
                </div>
              </div>

              {/* Split Logs View */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 h-[calc(100vh-280px)] min-h-0">
                {/* Runtime Logs (Left) */}
                <Card noPad className="flex flex-col h-full border-white/[0.04] overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-[#3b82f6]" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#71717a]">Runtime Logs</span>
                    </div>
                    {selectedDeployment?.status === 'running' && selectedDeployment?.url && (
                      <a 
                        href={selectedDeployment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-[#22c55e] hover:underline flex items-center gap-1"
                      >
                        <Globe size={10} /> {selectedDeployment.url}
                      </a>
                    )}
                    <GlassButton variant="secondary" className="h-6 text-[10px] px-2" onClick={() => setRuntimeLogs([])}>Clear</GlassButton>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 font-mono text-[13px] space-y-1.5 bg-[#050505] scrollbar-hide">
                    {runtimeLogs.length > 0 ? runtimeLogs.map((log, i) => {
                      const lowerLog = log.toLowerCase();
                      const isWarning = lowerLog.includes('warning') || lowerLog.includes('[warn]');
                      const isError = lowerLog.includes('error') || lowerLog.includes('[err]');
                      const isSuccess = lowerLog.includes('success') || lowerLog.includes('live at') || lowerLog.includes('completed');
                      const isInfo = lowerLog.includes('[info]');
                      const isHttp = lowerLog.includes('[http]') || lowerLog.includes('get ') || lowerLog.includes('post ');
                      
                      let colorClass = 'text-[#a1a1aa]'; // Default
                      if (isError) colorClass = 'text-[#ef4444] font-bold';
                      else if (isWarning) colorClass = 'text-[#f59e0b] font-bold';
                      else if (isSuccess) colorClass = 'text-[#22c55e] font-bold';
                      else if (isHttp) colorClass = 'text-[#a855f7]'; // Purple for HTTP
                      else if (isInfo) colorClass = 'text-[#3b82f6]'; // Blue for Info

                      return (
                        <div key={i} className="whitespace-pre-wrap leading-relaxed flex gap-3">
                          <span className="text-[#3f3f46] select-none min-w-[30px]">[{i+1}]</span>
                          <span className={colorClass}>{log}</span>
                        </div>
                      );
                    }) : (
                      <div className="h-full flex items-center justify-center text-[#3f3f46] italic">No runtime logs available</div>
                    )}
                    <div ref={runtimeLogsEndRef} />
                  </div>
                </Card>

                {/* Build Logs (Right) */}
                <Card noPad className="flex flex-col h-full border-white/[0.04] overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <TerminalIcon size={14} className="text-[#eab308]" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#71717a]">Build Logs</span>
                    </div>
                    <GlassButton variant="secondary" className="h-6 text-[10px] px-2" onClick={() => setBuildLogs([])}>Clear</GlassButton>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 font-mono text-[13px] space-y-1.5 bg-[#050505] scrollbar-hide">
                    {buildLogs.length > 0 ? buildLogs.map((log, i) => {
                      const lowerLog = log.toLowerCase();
                      const isWarning = lowerLog.includes('warning') || lowerLog.includes('[warn]');
                      const isError = lowerLog.includes('error') || lowerLog.includes('[err]');
                      const isSuccess = lowerLog.includes('success') || lowerLog.includes('completed') || lowerLog.includes('ready');
                      const isInfo = lowerLog.includes('[info]');

                      let colorClass = 'text-[#a1a1aa]';
                      if (isError) colorClass = 'text-[#ef4444] font-bold';
                      else if (isWarning) colorClass = 'text-[#f59e0b] font-bold';
                      else if (isSuccess) colorClass = 'text-[#22c55e] font-bold';
                      else if (isInfo) colorClass = 'text-[#3b82f6]';

                      return (
                        <div key={i} className="whitespace-pre-wrap leading-relaxed flex gap-3">
                          <span className="text-[#3f3f46] select-none min-w-[30px]">[{i+1}]</span>
                          <span className={colorClass}>{log}</span>
                        </div>
                      );
                    }) : (
                      <div className="h-full flex items-center justify-center text-[#3f3f46] italic">No build logs available</div>
                    )}
                    <div ref={buildLogsEndRef} />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </PageShell>
      </PageWrapper>

      {/* AI Chat Widget */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-0 w-96 h-[500px] bg-[#111113] border border-white/[0.1] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Velora AI</h4>
                    <p className="text-[10px] text-[#22c55e] font-bold uppercase tracking-wider">Online</p>
                  </div>
                </div>
                <button onClick={() => setShowAIChat(false)} className="text-[#52525b] hover:text-white transition-colors">
                  <Maximize2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-white text-black font-medium' 
                        : 'bg-white/[0.03] border border-white/[0.06] text-white/90'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/[0.06] bg-white/[0.01]">
                <div className="relative">
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask Velora AI..."
                    className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-2xl pl-5 pr-12 text-[13px] focus:outline-none focus:border-white/[0.2] transition-colors"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
            showAIChat ? 'bg-white text-black' : 'bg-[#111113] border border-white/[0.1] text-white'
          }`}
        >
          {showAIChat ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    running: "bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]",
    building: "bg-[#eab308]/10 border-[#eab308]/20 text-[#eab308]",
    failed: "bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]",
    stopped: "bg-[#71717a]/10 border-[#71717a]/20 text-[#71717a]",
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[status?.toLowerCase()] || styles.stopped}`}>
      {status || 'Unknown'}
    </span>
  );
}

function X({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
