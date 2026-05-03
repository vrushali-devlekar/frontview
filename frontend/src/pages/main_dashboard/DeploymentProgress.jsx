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
        
        // Map status to stage
        if (latest.status === 'successful') setCurrentStage(4);
        else if (latest.status === 'failed') setCurrentStage(currentStage); // Keep current
        
        if (latest.status === 'building' || latest.status === 'pending') {
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
      
      // Heuristic stage detection from logs (can be improved by backend events)
      if (log.message.toLowerCase().includes('cloning')) setCurrentStage(1);
      if (log.message.toLowerCase().includes('building') || log.message.toLowerCase().includes('npm install')) setCurrentStage(2);
      if (log.message.toLowerCase().includes('deploying') || log.message.toLowerCase().includes('pushing')) setCurrentStage(3);
    });

    socket.on('deployment:status', (data) => {
      if (data.status === 'successful') {
        setCurrentStage(4);
        setStatus('successful');
      } else if (data.status === 'failed') {
        setStatus('failed');
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
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{project?.name || "Initializing..."}</h1>
                  <div className="flex items-center gap-3 mt-1 text-[#52525b]">
                    <span className="text-[12px] font-mono">{project?.repoUrl}</span>
                    <ChevronRight size={12} />
                    <span className="text-[12px] font-black uppercase tracking-widest text-[#22c55e]">Production</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {(status === 'successful' || status === 'failed') && (
                  <GlassButton 
                    variant="secondary" 
                    className="h-10 px-6 gap-2"
                    disabled={isDeploying || status === 'building'}
                    onClick={async () => {
                      if (isDeploying || status === 'building') return;
                      setIsDeploying(true);
                      setLogs([]);
                      try {
                        const res = await triggerDeployment(project._id);
                        if (res.data.success) {
                          // Fresh fetch to get latest deployment
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
                    <Rocket size={16} className={isDeploying ? "animate-bounce" : ""} /> {isDeploying ? "Deploying..." : "Deploy Again"}
                  </GlassButton>
                )}
                {status === 'successful' && (
                  <GlassButton 
                    variant="primary" 
                    className="h-10 px-6 gap-2"
                    onClick={() => window.open(project?.liveUrl || '#', '_blank')}
                  >
                    <Globe size={16} /> Visit App
                  </GlassButton>
                )}
                <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-[0.2em] ${
                  status === 'successful' ? 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]' :
                  status === 'failed' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  'bg-white/5 border-white/10 text-white animate-pulse'
                }`}>
                  {status === 'successful' ? 'Deployed' : status === 'failed' ? 'Failed' : 'Building'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Progress Sidebar */}
              <div className="space-y-6">
                <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/[0.02] rounded-full -mr-16 -mt-16 blur-3xl" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f46] mb-8">Deployment Progress</h3>
                  
                  <div className="relative space-y-10">
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/[0.05]" />
                    
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStage || (status === 'successful' && idx === 4);
                      const isActive = idx === currentStage && status !== 'successful' && status !== 'failed';
                      const isFailed = status === 'failed' && idx === currentStage;

                      return (
                        <div key={stage.id} className="flex gap-6 relative group">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all z-10 ${
                            isCompleted ? 'bg-[#22c55e] border-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                            isActive ? 'bg-white/10 border-white/20 text-white animate-pulse' :
                            isFailed ? 'bg-red-500 border-red-500 text-white' :
                            'bg-[#050505] border-white/5 text-[#3f3f46]'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={16} /> : 
                             isActive ? <Loader2 size={16} className="animate-spin" /> :
                             isFailed ? <AlertCircle size={16} /> :
                             <Circle size={16} />}
                          </div>
                          <div className="pt-1">
                            <h4 className={`text-[14px] font-bold mb-1 ${isCompleted || isActive ? 'text-white' : 'text-[#3f3f46]'}`}>
                              {stage.label}
                            </h4>
                            <p className="text-[11px] text-[#52525b] leading-relaxed">{stage.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {status === 'failed' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-[24px] p-6"
                  >
                    <div className="flex items-center gap-3 mb-3 text-red-500">
                      <AlertCircle size={18} />
                      <span className="font-bold text-[14px]">Deployment Failed</span>
                    </div>
                    <p className="text-[12px] text-red-500/70 mb-5 leading-relaxed">The build process encountered an error. Use Velora AI to analyze the logs and find a solution.</p>
                    <button 
                      onClick={() => setShowAIChat(true)}
                      className="w-full h-11 rounded-xl bg-red-500 text-white font-bold text-[12px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} /> Analyze with AI
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Logs View */}
              <div className="lg:col-span-2 space-y-6 flex flex-col min-h-0">
                <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] overflow-hidden flex flex-col h-[600px] shadow-2xl">
                  <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#71717a]">
                        <TerminalIcon size={16} />
                      </div>
                      <span className="font-bold text-[13px] uppercase tracking-widest">Build Logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                      <span className="text-[10px] font-black text-[#52525b] uppercase tracking-widest">Streaming</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 font-mono text-[13px] leading-relaxed space-y-1.5 scrollbar-hide bg-black/40">
                    {logs.length > 0 ? logs.map((log, i) => {
                      const lowerLog = log.toLowerCase();
                      const isWarning = lowerLog.includes('warning') || lowerLog.includes('[warn]');
                      const isError = lowerLog.includes('error') || lowerLog.includes('[err]');
                      const isSuccess = lowerLog.includes('success') || lowerLog.includes('completed') || lowerLog.includes('live at');
                      const isInfo = lowerLog.includes('[info]');
                      const isHttp = lowerLog.includes('[http]') || lowerLog.includes('get ') || lowerLog.includes('post ');

                      let colorClass = 'text-[#a1a1aa]';
                      if (isError) colorClass = 'text-[#ef4444] font-bold';
                      else if (isWarning) colorClass = 'text-[#f59e0b] font-bold';
                      else if (isSuccess) colorClass = 'text-[#22c55e] font-bold';
                      else if (isHttp) colorClass = 'text-[#a855f7]';
                      else if (isInfo) colorClass = 'text-[#3b82f6]';

                      return (
                        <div key={i} className="flex gap-4 group">
                          <span className="text-[#3f3f46] select-none min-w-[30px] group-hover:text-white transition-colors">{i + 1}</span>
                          <span className={`whitespace-pre-wrap ${colorClass} transition-colors`}>{log}</span>
                        </div>
                      );
                    }) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                        <Activity size={40} className="mb-4" />
                        <p className="font-bold text-[14px]">Waiting for logs...</p>
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
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-0 w-96 h-[500px] bg-[#18181b] border border-white/[0.1] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#22c55e] text-black flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold">Velora AI</h4>
                    <p className="text-[10px] text-[#22c55e] font-bold uppercase tracking-wider">Analyzing Logs</p>
                  </div>
                </div>
                <button onClick={() => setShowAIChat(false)} className="text-[#52525b] hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-black/20">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-white text-black font-semibold' 
                        : 'bg-white/5 border border-white/10 text-white/90'
                    }`}>
                      {msg.text || (msg.isStreaming && <Loader2 size={14} className="animate-spin" />)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/[0.06] bg-black/40">
                <div className="relative">
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about the build..."
                    className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-2xl pl-5 pr-12 text-[13px] focus:outline-none focus:border-[#22c55e]/40 transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping || !userInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
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
            showAIChat ? 'bg-white text-black' : 'bg-[#22c55e] text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
          }`}
        >
          {showAIChat ? <ArrowLeft size={24} /> : <Sparkles size={24} />}
        </button>
      </div>
    </div>
  );
}
