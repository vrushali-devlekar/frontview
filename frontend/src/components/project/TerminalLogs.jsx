<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, ShieldCheck, ArrowDown } from "lucide-react";
import { io as socketIO } from "socket.io-client";
import { getDeployment, SOCKET_ORIGIN } from "../../api/api";

function parseStoredLogLine(line) {
  const str = String(line);
  const errMatch = str.match(/\[ERROR\]/i);
  const warnMatch = str.match(/\[WARN\]/i);
  let type = "info";
  if (errMatch) type = "error";
  else if (warnMatch) type = "warn";
  const timeMatch = str.match(/^\[([^\]]+)\]/);
  const time = timeMatch ? timeMatch[1].slice(11, 19) || timeMatch[1] : new Date().toLocaleTimeString();
  return { type, time, message: str };
}

function normalizeSocketLine(payload) {
  const level = (payload.level || "info").toLowerCase();
  const type =
    level === "error" ? "error" : level === "warn" ? "warn" : "info";
  const ts = payload.timestamp ? new Date(payload.timestamp) : new Date();
  return {
    type,
    time: ts.toLocaleTimeString(),
    message: payload.message || "",
  };
}

let sharedSocket = null;

const getSharedSocket = () => {
  if (!sharedSocket) {
    sharedSocket = socketIO(SOCKET_ORIGIN, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });
  }
  return sharedSocket;
};

export default function TerminalLogs({
  deploymentId,
  onErrorDetect,
  onComplete,
  onStatusChange,
}) {
  const [logs, setLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [loadError, setLoadError] = useState("");
  const messagesEndRef = useRef(null);
  const logsRef = useRef([]);

<<<<<<< HEAD
=======
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
// import { io } from 'socket.io-client'; // User will install this

export default function TerminalLogs({ deploymentId, onErrorDetect, onComplete }) {
  const [logs, setLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
    logsRef.current = logs;
  }, [logs]);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const appendAndMaybeSignalError = useCallback(
    (entry) => {
      setLogs((prev) => {
        const next = [...prev, entry];
        const msg = entry.message || "";
        if (
          entry.type === "error" ||
          msg.includes("ERR!") ||
          msg.includes("error") ||
          /\[ERROR\]/i.test(msg)
        ) {
          onErrorDetect();
        }
        return next;
      });
    },
    [onErrorDetect]
  );

  useEffect(() => {
    if (!deploymentId) return undefined;

    let cancelled = false;

    const socket = getSharedSocket();
    
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join:deployment", deploymentId);

    const handleLogLine = (payload) => {
      appendAndMaybeSignalError(normalizeSocketLine(payload));
    };

    const handleLogComplete = () => {
      setIsStreaming(false);
      if (onComplete) onComplete();
    };

    socket.on("log:line", handleLogLine);
    socket.on("log:complete", handleLogComplete);

    const handleConnectError = () => {};
    socket.on("connect_error", handleConnectError);

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoadError("");
      setLogs([]);
      setIsStreaming(true);
      try {
        const { data } = await getDeployment(deploymentId);
        const doc = data?.data;
        const raw = doc?.logs;
        if (cancelled) return;
        if (Array.isArray(raw) && raw.length > 0) {
          setLogs(raw.map(parseStoredLogLine));
        }
        const st = doc?.status;
        if (st && onStatusChange) onStatusChange(String(st).toLowerCase());
        if (
          st &&
          ["failed", "stopped", "rolling_back"].includes(
            String(st).toLowerCase()
          )
        ) {
          setIsStreaming(false);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e.response?.data?.message || e.message || "Failed to load logs"
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      socket.emit("leave:deployment", deploymentId);
      socket.off("log:line", handleLogLine);
      socket.off("log:complete", handleLogComplete);
      socket.off("connect_error", handleConnectError);
    };
  }, [deploymentId, appendAndMaybeSignalError, onComplete, onStatusChange]);

  const getLogColor = (type) => {
    switch (type) {
      case "error": return "text-[#ef4444]";
      case "warn": return "text-[#eab308]";
      case "success": return "text-[#22c55e]";
      default: return "text-[#a1a1aa]";
    }
  };

  const getLogPrefix = (type) => {
    switch (type) {
      case "error": return "ERR";
      case "warn": return "WRN";
      case "success": return "OK ";
      default: return "LOG";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#09090b] rounded-xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111113] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <div className="w-3 h-3 rounded-full bg-[#eab308]" />
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          </div>
          <span className="text-[13px] font-medium text-[#71717a]">
            Build Logs
          </span>
        </div>
        <div className="flex items-center gap-3">
          {loadError && (
            <span className="text-[12px] text-[#ef4444] max-w-[200px] truncate">
              {loadError}
            </span>
          )}
          {isStreaming ? (
            <span className="flex items-center gap-1.5 text-[#3b82f6] text-[12px] font-medium">
              <RefreshCw size={12} className="animate-spin" /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#71717a] text-[12px] font-medium">
              <ShieldCheck size={12} /> Complete
            </span>
<<<<<<< HEAD
=======
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
          )}
        </div>
      </div>

<<<<<<< HEAD
      {/* Log Lines */}
      <div className="flex-1 overflow-y-auto px-2 py-4 min-h-0" style={{ scrollbarWidth: 'thin' }}>
=======
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="flex-1 overflow-y-auto font-mono text-[10px] tracking-widest leading-loose pr-4 custom-scrollbar min-h-0">
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
        {logs.map((log, index) => (
          <div
            key={`${index}-${log.time}`}
            className="flex gap-4 mb-1 py-0.5 px-2 rounded-md hover:bg-white/[0.02] transition-colors group font-mono"
          >
            {/* Line Number */}
            <span className="text-[12px] text-[#3f3f46] min-w-[32px] text-right select-none tabular-nums">
              {index + 1}
            </span>
<<<<<<< HEAD

            {/* Timestamp */}
            <span className="text-[12px] text-[#71717a] min-w-[70px] tabular-nums">
              {log.time}
            </span>
            
            {/* Type badge */}
            <span className={`text-[12px] min-w-[32px] font-medium ${getLogColor(log.type)}`}>
              {getLogPrefix(log.type)}
            </span>

            {/* Message */}
            <span className={`flex-1 text-[13px] leading-relaxed break-all ${getLogColor(log.type)} ${log.type === 'error' ? 'font-medium text-[#ef4444]' : 'text-[#d4d4d8]'}`}>
=======
            <span
              className={`flex-1 ${
                log.type === "error"
                  ? "text-red-500 font-bold"
                  : log.type === "warn"
                    ? "text-[#FFCC00]"
                    : log.type === "success"
                      ? "text-[#00FFCC]"
                      : "text-[#ccc]"
              }`}
            >
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
              {log.message}
            </span>
          </div>
        ))}
<<<<<<< HEAD

        {isStreaming && (
          <div className="flex gap-4 px-2 py-1 items-center">
            <span className="text-[12px] text-[#3f3f46] min-w-[32px] text-right">{logs.length + 1}</span>
            <span className="text-[12px] text-[#71717a] min-w-[70px]">--:--:--</span>
            <span className="text-[12px] min-w-[32px] text-[#3b82f6]">...</span>
            <span className="inline-block w-2 h-3.5 bg-[#3b82f6] animate-pulse rounded-sm"></span>
          </div>
        )}

=======
<<<<<<< HEAD
<<<<<<< HEAD

        {isStreaming && (
          <div className="flex gap-4 px-2 py-1">
            <span className="text-[#555] min-w-[70px] opacity-50">[--:--:--]</span>
            <span className="text-[#00FFCC] font-bold animate-pulse">_</span>
          </div>
        )}

=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        
        {isStreaming && (
          <div className="flex gap-4 px-2 py-1">
            <span className="text-[#555] min-w-[70px] opacity-50">[--:--:--]</span>
            <span className="text-valora-cyan font-bold animate-pulse">_</span>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
        <div ref={messagesEndRef} />
      </div>

      {/* Footer stats */}
      <div className="py-2 px-4 bg-[#111113] border-t border-white/[0.06] flex justify-between items-center shrink-0">
        <span className="text-[12px] text-[#71717a]">{logs.length} lines</span>
        <button onClick={scrollToBottom} className="text-[12px] text-[#71717a] hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowDown size={12} /> Scroll to bottom
        </button>
      </div>
    </div>
  );
}
