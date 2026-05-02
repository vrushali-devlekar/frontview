import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
// import { io } from 'socket.io-client'; // User will install this

export default function TerminalLogs({ deploymentId, onErrorDetect, onComplete }) {
  const [logs, setLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    // SDE Mechanism: Connect to socket
    // const socket = io('http://localhost:5000'); 
    
    // socket.emit('join-room', deploymentId);
    
    // socket.on('new-log', (log) => {
    //   setLogs(prev => [...prev, log]);
    //   
    //   // Error Detection Trigger
    //   if (log.type === 'error' || log.message.includes('ERR!') || log.message.includes('Crash')) {
    //     onErrorDetect(); // Trigger AI Modal
    //   }
    // });
    
    // socket.on('deployment-complete', () => {
    //   setIsStreaming(false);
    //   if (onComplete) onComplete();
    // });

    // ==========================================
    // MOCK IMPLEMENTATION FOR UI DEMONSTRATION
    // Remove this block when backend WebSockets are ready
    // ==========================================
    let currentIndex = 0;
    const mockLogStream = [
      { type: 'info', time: new Date().toLocaleTimeString(), message: `Starting deployment pipeline ${deploymentId}...` },
      { type: 'info', time: new Date().toLocaleTimeString(), message: 'Cloning repository from GitHub...' },
      { type: 'info', time: new Date().toLocaleTimeString(), message: 'Resolving dependencies...' },
      { type: 'info', time: new Date().toLocaleTimeString(), message: 'Building application...' },
      { type: 'warn', time: new Date().toLocaleTimeString(), message: 'Warning: Deprecated dependency "marked" found.' },
      { type: 'error', time: new Date().toLocaleTimeString(), message: 'ERR! Build failed: Module not found "crypto"' }, // Error line to trigger AI
    ];

    const interval = setInterval(() => {
      if (currentIndex < mockLogStream.length) {
        const newLog = mockLogStream[currentIndex];
        setLogs(prev => [...prev, newLog]);
        
        // Error Detection Logic
        if (newLog.type === 'error' || newLog.message.includes('ERR!') || newLog.message.includes('Crash')) {
          // Send the last few logs to the parent for AI analysis
          onErrorDetect([...logs, newLog].slice(-20)); 
          setIsStreaming(false);
          clearInterval(interval);
        }
        
        currentIndex++;
      } else {
        setIsStreaming(false);
        if (onComplete) onComplete();
        clearInterval(interval);
      }
    }, 800);

    return () => {
      // socket.disconnect(); // Memory leak prevention
      clearInterval(interval);
    };
  }, [deploymentId, onErrorDetect, onComplete]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#222] mb-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 border-2 border-valora-cyan" />
          <div className="w-3 h-3 border-2 border-valora-yellow" />
          <div className="w-3 h-3 border-2 border-[#555]" />
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-pixel text-[#888] tracking-widest uppercase">DEPLOY_PILOT_SECURE_SHELL</p>
          {isStreaming ? (
            <span className="flex items-center gap-2 text-valora-yellow text-[9px] font-bold tracking-widest px-2 py-1 border border-valora-yellow bg-valora-yellow/10 uppercase">
              <RefreshCw size={10} className="animate-spin" /> STREAMING
            </span>
          ) : (
             <span className="flex items-center gap-2 text-[#555] text-[9px] font-bold tracking-widest px-2 py-1 border border-[#555] bg-[#111] uppercase">
               <ShieldCheck size={10} /> DISCONNECTED
             </span>
          )}
        </div>
      </div>

      {/* Log Lines Container */}
      <div className="flex-1 overflow-y-auto font-mono text-[10px] tracking-widest leading-loose pr-4 custom-scrollbar">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-4 mb-2 hover:bg-[#111] px-2 py-1 transition-colors group">
            <span className="text-[#555] min-w-[70px] opacity-50 group-hover:opacity-100 transition-opacity">
              [{log.time}]
            </span>
            <span className={`flex-1 ${
              log.type === 'error' ? 'text-red-500 font-bold' : 
              log.type === 'warn' ? 'text-valora-yellow' : 
              log.type === 'success' ? 'text-valora-cyan' : 
              'text-[#ccc]'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex gap-4 px-2 py-1">
            <span className="text-[#555] min-w-[70px] opacity-50">[--:--:--]</span>
            <span className="text-valora-cyan font-bold animate-pulse">_</span>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
