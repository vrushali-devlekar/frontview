import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Terminal as TerminalIcon,
  ChevronRight,
  Sparkles,
  Send,
  AlertCircle,
  ArrowLeft,
  Activity,
  Zap,
  Globe
} from "lucide-react";
import { getProjectById, getDeploymentsByProject, getDeployment, SOCKET_ORIGIN, triggerDeployment } from "../../api/api";
import io from "socket.io-client";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import { useSidebar } from "../../hooks/useSidebar";
import GlassButton from "../../components/ui/GlassButton";

const STAGES = [
  { id: 'initializing', label: 'Initializing', description: 'Preparing build environment' },
  { id: 'cloning', label: 'Cloning Repository', description: 'Fetching source code from GitHub' },
  { id: 'building', label: 'Building Image', description: 'Optimizing assets and compiling' },
  { id: 'deploying', label: 'Pushing to Edge', description: 'Global distribution in progress' },
  { id: 'live', label: 'Go Live', description: 'Application is accessible' }
];

export default function DeploymentProgress() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  
  const [project, setProject] = useState(null);
  const [deployment, setDeployment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); // 0 to 4
  const [status, setStatus] = useState('building'); // building, success, failed
  const [failureReason, setFailureReason] = useState("");
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hello! I am Velora AI. I can help you analyze these logs if something goes wrong.' }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    fetchProjectData();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const fetchProjectData = async () => {
    try {
      const pRes = await getProjectById(projectId);
      setProject(pRes.data.data);
      
      const dRes = await getDeploymentsByProject(projectId);
      const latest = dRes.data.data[0];
      if (latest) {
        setDeployment(latest);
        setStatus(latest.status);
        setLogs(latest.buildLogs || []);
        setFailureReason(latest.errorMessage || "");
        
        // Map status to stage
        if (latest.status === 'successful') setCurrentStage(4);
        else if (latest.status === 'failed') setCurrentStage(currentStage); // Keep current
        
        if (['building', 'pending', 'queued', 'running'].includes(latest.status)) {
          connectSocket(latest._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch project data", err);
    }
  };

  const connectSocket = (id) => {
    if (socketRef.current) socketRef.current.disconnect();
    const socket = io(SOCKET_ORIGIN);
    socketRef.current = socket;

    socket.emit('join:deployment', id);

    socket.on('log:line', (log) => {
      const line = `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.message}`;
      setLogs(prev => [...prev, line]);
      
      const msg = log.message.toLowerCase();
      // Heuristic stage detection from logs
      if (msg.includes('cloning') || msg.includes('repository cloned')) setCurrentStage(1);
      if (msg.includes('building') || msg.includes('npm install') || msg.includes('analyzing')) setCurrentStage(2);
      if (msg.includes('starting app') || msg.includes('start command') || msg.includes('pushing')) setCurrentStage(3);
      if (msg.includes('deployment live') || msg.includes('live at')) setCurrentStage(4);
    });

    socket.on('deployment:status', (data) => {
      console.log("📡 Deployment Status Update:", data);
      const s = data.status?.toLowerCase();
      if (s === 'successful' || s === 'running') {
        setCurrentStage(4);
        setStatus('successful');
      } else if (s === 'failed') {
        setStatus('failed');
        if (id) {
          getDeployment(id)
            .then((res) => {
              setFailureReason(res?.data?.data?.errorMessage || "");
            })
            .catch(() => {});
        }
      } else if (s === 'building') {
        setCurrentStage(2);
        setStatus('building');
      }
    });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userText = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput("");
    setIsTyping(true);
    
    // Placeholder message for streaming
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
          context: logs.slice(-50)
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
                  const last = updated[updated.length - 1];
                  if (last && last.isStreaming) {
                    updated[updated.length - 1] = { role: 'bot', text: botText, isStreaming: true };
                  }
                  return updated;
                });
              }
            } catch (e) { /* partial JSON skip */ }
          }
        }
      }
      
      // Finalize streaming
      setChatMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.isStreaming) {
          updated[updated.length - 1].isStreaming = false;
        }
        return updated;
      });

    } catch (err) {
      setChatMessages(prev => [...prev.slice(0, -1), { role: 'bot', text: "I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/[0.04]">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-11 h-11 rounded-xl bg-[#1e1e20] border border-white/[0.04] flex items-center justify-center hover:bg-[#161618] transition-all shadow-elevation-1 group"
                >
                  <ArrowLeft size={18} className="text-[#3f3f46] group-hover:text-white group-hover:-translate-x-1 transition-all" />
                </button>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#0d0d0f] border border-white/[0.04] text-[8px] font-black text-[#52525b] uppercase tracking-[0.3em]">NODE_SEQUENCE</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  </div>
                  <h1 className="text-[22px] font-black tracking-tighter uppercase text-[#e4e4e7] leading-none">{project?.name || "INITIALIZING_NODE"}</h1>
                  <div className="flex items-center gap-4 mt-3 text-[#52525b]">
                    <span className="text-[10px] font-mono uppercase tracking-tight opacity-50">{project?.repoUrl || "SOURCE_PENDING"}</span>
                    <div className="w-1 h-1 rounded-full bg-[#1e1e20]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#22c55e]">AUTHORITY_NOMINAL</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {(status === 'successful' || status === 'failed') && (
                  <GlassButton 
                    variant="secondary" 
                    className="h-11 px-8 gap-3 text-[9px] font-black uppercase tracking-[0.25em] shadow-elevation-1 border-white/5"
                    disabled={isDeploying || status === 'building'}
                    onClick={async () => {
                      if (isDeploying || status === 'building') return;
                      setIsDeploying(true);
                      setLogs([]);
                      try {
                        const res = await triggerDeployment(project._id);
                        if (res.data.success) {
                          const dRes = await getDeploymentsByProject(project._id);
                          const newDep = dRes.data.data?.[0];
                          if (newDep) {
                            setStatus(newDep.status?.toLowerCase() === 'running' ? 'successful' : newDep.status?.toLowerCase());
                            connectSocket(newDep._id);
                          }
                        }
                      } catch (err) { 
                        const msg = err.response?.data?.message || "Failed to trigger deployment";
                        alert(msg); 
                        setIsDeploying(false);
                      }
                    }}
                  >
                    <Rocket size={14} className={isDeploying ? "animate-pulse" : ""} /> {isDeploying ? "DEPLOYING..." : "DEPLOY_NODE"}
                  </GlassButton>
                )}
                {status === 'successful' && (
                  <GlassButton 
                    variant="primary" 
                    className="h-11 px-8 gap-3 text-[9px] font-black uppercase tracking-[0.25em] shadow-elevation-2"
                    onClick={() => window.open(deployment?.url || '#', '_blank')}
                  >
                    <Globe size={14} /> ACCESS_INSTANCE
                  </GlassButton>
                )}
                <div className={`h-11 px-6 rounded-xl border flex items-center font-black text-[9px] uppercase tracking-[0.3em] shadow-elevation-1 ${
                  status === 'successful' ? 'bg-[#22c55e]/5 border-[#22c55e]/10 text-[#22c55e]' :
                  status === 'failed' ? 'bg-[#ef4444]/5 border-[#ef4444]/10 text-[#ef4444]' :
                  'bg-[#1e1e20] border-white/[0.04] text-[#52525b]'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
                    status === 'successful' ? 'bg-[#22c55e]' :
                    status === 'failed' ? 'bg-[#ef4444]' :
                    'bg-[#52525b] animate-pulse'
                  }`} />
                  {status === 'successful' ? 'NOMINAL' : status === 'failed' ? 'FAULT' : 'SYNCING'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Progress Sidebar */}
              <div className="space-y-10">
                <div className="bg-[#1e1e20] border border-white/[0.04] rounded-[32px] p-8 shadow-elevation-1 relative overflow-hidden">
                  <div className="flex items-center gap-5 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-[#0d0d0f] border border-white/[0.06] flex items-center justify-center text-[#3f3f46]">
                      <Activity size={18} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3f3f46]">Sequence Log</h3>
                  </div>
                  
                  <div className="relative pl-1">
                    {/* Background Line */}
                    <div className="absolute left-[21px] top-3 bottom-3 w-[1px] bg-white/[0.04]" />
                    
                    {/* Animated Filling Line */}
                    <motion.div 
                      className="absolute left-[21px] top-3 w-[1px] bg-[#22c55e] origin-top z-[1]"
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${(currentStage / (STAGES.length - 1)) * 100}%` 
                      }}
                      transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                    
                    <div className="relative space-y-16">
                      {STAGES.map((stage, idx) => {
                        const isCompleted = idx < currentStage || (status === 'successful' && idx === 4);
                        const isActive = idx === currentStage && status !== 'successful' && status !== 'failed';
                        const isFailed = status === 'failed' && idx === currentStage;

                        return (
                          <div key={stage.id} className="flex gap-10 relative group">
                            {/* Node Icon */}
                            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 transition-all z-10 relative shadow-elevation-1 ${
                                isCompleted ? 'bg-[#22c55e] border-[#22c55e] text-black shadow-[0_0_30px_rgba(34,197,94,0.15)]' :
                                isActive ? 'bg-[#0d0d0f] border-[#22c55e] text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]' :
                                isFailed ? 'bg-[#ef4444] border-[#ef4444] text-white' :
                                'bg-[#0d0d0f] border-white/[0.04] text-[#1e1e20]'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={18} strokeWidth={3} />
                              ) : isActive ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : isFailed ? (
                                <AlertCircle size={18} />
                              ) : (
                                <Circle size={18} />
                              )}
                            </div>

                            {/* Node Text */}
                            <div className="pt-1.5">
                              <h4 className={`text-[12px] font-black uppercase tracking-tighter mb-1.5 transition-colors ${
                                isCompleted || isActive ? 'text-[#e4e4e7]' : 'text-[#3f3f46]'
                              }`}>
                                {stage.label}
                              </h4>
                              <p className={`text-[8px] font-black uppercase tracking-[0.25em] transition-colors ${
                                isActive ? 'text-[#52525b]' : 'text-[#1e1e20]'
                              }`}>
                                {stage.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {status === 'failed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ef4444]/5 border border-[#ef4444]/10 rounded-[40px] p-10 shadow-elevation-1"
                  >
                    <div className="flex items-center gap-5 mb-6 text-[#ef4444]">
                      <AlertCircle size={22} />
                      <span className="font-black text-[14px] uppercase tracking-widest">Deployment Failed</span>
                    </div>
                    <p className="text-[11px] text-[#ef4444]/75 mb-10 leading-relaxed font-mono break-words">
                      {failureReason || "Build or startup failed. Open logs or AI analysis for exact steps to fix."}
                    </p>
                    <button 
                      onClick={() => setShowAIChat(true)}
                      className="w-full h-14 rounded-2xl bg-[#ef4444] text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#ef4444]/90 transition-all flex items-center justify-center gap-4 shadow-elevation-2"
                    >
                      <Sparkles size={18} /> DEPLOY_ANALYST
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Logs View */}
              <div className="lg:col-span-2 flex flex-col min-h-0">
                <div className="bg-[#1e1e20] border border-white/[0.04] rounded-[40px] overflow-hidden flex flex-col h-[600px] shadow-elevation-2">
                  <div className="px-8 py-6 border-b border-white/[0.04] flex items-center justify-between bg-[#161618]">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#0d0d0f] border border-white/[0.06] flex items-center justify-center text-[#52525b] shadow-elevation-1">
                        <TerminalIcon size={20} />
                      </div>
                      <div>
                        <span className="font-black text-[13px] uppercase tracking-[0.4em] text-white">Stream_Log</span>
                        <span className="text-[9px] text-[#3f3f46] font-black uppercase tracking-[0.25em] mt-1 block">ASSET_NOMINAL_TELEMETRY</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-[#0d0d0f] border border-white/[0.04]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      <span className="text-[9px] font-black text-[#52525b] uppercase tracking-[0.3em]">LIVE_SYNC</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-12 font-mono text-[13px] leading-loose space-y-3 scrollbar-hide bg-[#0d0d0f]/60 shadow-inner">
                    {logs.length > 0 ? logs.map((log, i) => {
                      const lowerLog = log.toLowerCase();
                      const isWarning = lowerLog.includes('warning') || lowerLog.includes('[warn]');
                      const isError = lowerLog.includes('error') || lowerLog.includes('[err]');
                      const isSuccess = lowerLog.includes('success') || lowerLog.includes('completed') || lowerLog.includes('live at');
                      const isHttp = lowerLog.includes('[http]') || lowerLog.includes('get ') || lowerLog.includes('post ');

                      let colorClass = 'text-[#3f3f46]';
                      if (isError) colorClass = 'text-[#ef4444]';
                      else if (isWarning) colorClass = 'text-[#f59e0b]';
                      else if (isSuccess) colorClass = 'text-[#22c55e]';
                      else if (isHttp) colorClass = 'text-[#a855f7]';

                      return (
                        <div key={i} className="flex gap-10 group">
                          <span className="text-[#1e1e20] select-none min-w-[40px] group-hover:text-[#3f3f46] transition-colors">{String(i + 1).padStart(4, '0')}</span>
                          <span className={`whitespace-pre-wrap ${colorClass} transition-colors uppercase tracking-tight font-black`}>{log}</span>
                        </div>
                      );
                    }) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                        <Activity size={72} className="mb-10" />
                        <p className="font-black text-[16px] uppercase tracking-[0.5em]">AWAITING_INIT_PACKET...</p>
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* AI Chat Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90]">
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] h-[70vh] max-h-[620px] bg-[#1e1e20] border border-white/[0.08] rounded-[24px] shadow-elevation-2 overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 border-b border-white/[0.04] bg-[#161618] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-elevation-2">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-white uppercase tracking-tight">Velora Analyst</h4>
                    <p className="text-[9px] text-[#22c55e] font-black uppercase tracking-[0.2em] mt-1">Log AI</p>
                  </div>
                </div>
                <button onClick={() => setShowAIChat(false)} className="w-10 h-10 rounded-xl bg-[#0d0d0f] border border-white/5 flex items-center justify-center text-[#3f3f46] hover:text-white transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0d0d0f]/20">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] p-4 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap break-words relative font-semibold tracking-tight shadow-elevation-1 ${
                      msg.role === 'user' 
                        ? 'bg-white text-black' 
                        : 'bg-[#161618] border border-white/[0.04] text-[#d4d4d8] shadow-inner'
                    }`}>
                      {msg.text}
                      {msg.isStreaming && <span className="inline-block w-1 h-4 bg-[#22c55e] ml-1 animate-pulse align-middle" />}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#161618] border border-white/[0.04] p-4 rounded-2xl flex items-center gap-3 shadow-inner">
                      <div className="flex gap-2">
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 bg-[#22c55e] rounded-full" />
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-[#22c55e] rounded-full" />
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-[#22c55e] rounded-full" />
                      </div>
                      <span className="text-[10px] text-[#3f3f46] font-black uppercase tracking-[0.2em]">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/[0.04] bg-[#161618]">
                <div className="relative">
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask AI about this failure..."
                    className="w-full h-12 bg-[#0d0d0f] border border-white/[0.04] rounded-xl pl-4 pr-14 text-[12px] text-white focus:outline-none focus:border-white/10 transition-all shadow-inner placeholder:text-[#52525b]"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping || !userInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-elevation-1"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-elevation-2 transition-all hover:scale-105 active:scale-95 z-[101] ${
            showAIChat ? 'bg-white text-black' : 'bg-[#1e1e20] border border-white/[0.08] text-white'
          }`}
        >
          {showAIChat ? <ArrowLeft size={22} /> : <Sparkles size={22} />}
        </button>
      </div>
    </div>
  );
}
