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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
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
      case "error": return "text-[#E55B5B]";
      case "warn": return "text-[#D4A84B]";
      case "success": return "text-[#6EE7B7]";
      default: return "text-[#c8c8c8]";
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
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Terminal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a] mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E55B5B]/60" />
            <div className="w-3 h-3 rounded-full bg-[#D4A84B]/60" />
            <div className="w-3 h-3 rounded-full bg-[#6EE7B7]/60" />
          </div>
          <span className="text-xs text-[#555]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Terminal — Build Logs
          </span>
        </div>
        <div className="flex items-center gap-3">
          {loadError && (
            <span className="text-xs text-[#E55B5B] max-w-[200px] truncate">
              {loadError}
            </span>
          )}
          {isStreaming ? (
            <span className="flex items-center gap-2 text-[#6EE7B7] text-xs font-medium px-3 py-1 rounded-full border border-[#6EE7B7]/20 bg-[#6EE7B7]/5">
              <RefreshCw size={11} className="animate-spin" /> Live
            </span>
          ) : (
            <span className="flex items-center gap-2 text-[#555] text-xs font-medium px-3 py-1 rounded-full border border-[#222] bg-[#111]">
              <ShieldCheck size={11} /> Complete
            </span>
          )}
        </div>
      </div>

      {/* Log Lines */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-0 bg-[#080808] rounded-lg border border-[#1a1a1a] p-4" style={{ scrollbarWidth: 'thin' }}>
        {logs.map((log, index) => (
          <div
            key={`${index}-${log.time}`}
            className="flex gap-3 mb-1.5 py-1 px-2 rounded hover:bg-[#0f0f0f] transition-colors group font-mono"
          >
            {/* Line Number */}
            <span className="text-[11px] text-[#333] min-w-[28px] text-right select-none tabular-nums">
              {index + 1}
            </span>

            {/* Timestamp */}
            <span className="text-[12px] text-[#444] min-w-[70px] opacity-60 group-hover:opacity-100 transition-opacity tabular-nums">
              {log.time}
            </span>
            
            {/* Type badge */}
            <span className={`text-[10px] min-w-[28px] font-bold tracking-wider ${getLogColor(log.type)} opacity-70`}>
              {getLogPrefix(log.type)}
            </span>

            {/* Message */}
            <span className={`flex-1 text-[13px] leading-relaxed ${getLogColor(log.type)} ${log.type === 'error' ? 'font-semibold' : ''}`}>
              {log.message}
            </span>
          </div>
        ))}

        {isStreaming && (
          <div className="flex gap-3 px-2 py-1">
            <span className="text-[11px] text-[#333] min-w-[28px] text-right">{logs.length + 1}</span>
            <span className="text-[12px] text-[#444] min-w-[70px]">--:--:--</span>
            <span className="text-[10px] min-w-[28px] text-[#6EE7B7]">...</span>
            <span className="inline-block w-2 h-4 bg-[#6EE7B7] ai-cursor-blink rounded-sm"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer stats */}
      <div className="pt-2 mt-2 border-t border-[#1a1a1a] flex justify-between items-center shrink-0">
        <span className="text-[11px] text-[#444]">{logs.length} lines</span>
        <button onClick={scrollToBottom} className="text-[11px] text-[#555] hover:text-white flex items-center gap-1 transition-colors">
          <ArrowDown size={10} /> Scroll to bottom
        </button>
      </div>
    </div>
  );
}
