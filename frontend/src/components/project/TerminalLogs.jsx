import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
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
=======
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

    const socket = socketIO(SOCKET_ORIGIN, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.emit("join:deployment", deploymentId);

    socket.on("log:line", (payload) => {
      appendAndMaybeSignalError(normalizeSocketLine(payload));
    });

    socket.on("log:complete", () => {
      setIsStreaming(false);
      if (onComplete) onComplete();
    });

    socket.on("connect_error", () => {
      /* keep UI alive; polling may retry */
    });

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
      socket.disconnect();
    };
  }, [deploymentId, appendAndMaybeSignalError, onComplete, onStatusChange]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between pb-4 border-b-2 border-[#222] mb-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 border-2 border-[#00FFCC]" />
          <div className="w-3 h-3 border-2 border-[#FFCC00]" />
          <div className="w-3 h-3 border-2 border-[#555]" />
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-mono text-[#888] tracking-widest uppercase">
            DEPLOY_PILOT_SECURE_SHELL
          </p>
          {loadError && (
            <span className="text-[9px] text-red-400 max-w-[200px] truncate normal-case">
              {loadError}
            </span>
          )}
          {isStreaming ? (
            <span className="flex items-center gap-2 text-[#FFCC00] text-[9px] font-bold tracking-widest px-2 py-1 border border-[#FFCC00] bg-[#FFCC00]/10 uppercase">
              <RefreshCw size={10} className="animate-spin" /> STREAMING
            </span>
          ) : (
            <span className="flex items-center gap-2 text-[#555] text-[9px] font-bold tracking-widest px-2 py-1 border border-[#555] bg-[#111] uppercase">
              <ShieldCheck size={10} /> IDLE
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-[10px] tracking-widest leading-loose pr-4 custom-scrollbar min-h-0">
        {logs.map((log, index) => (
          <div
            key={`${index}-${log.time}`}
            className="flex gap-4 mb-2 hover:bg-[#111] px-2 py-1 transition-colors group"
          >
            <span className="text-[#555] min-w-[70px] opacity-50 group-hover:opacity-100 transition-opacity">
              [{log.time}]
            </span>
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
              {log.message}
            </span>
          </div>
        ))}

        {isStreaming && (
          <div className="flex gap-4 px-2 py-1">
            <span className="text-[#555] min-w-[70px] opacity-50">[--:--:--]</span>
            <span className="text-[#00FFCC] font-bold animate-pulse">_</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
