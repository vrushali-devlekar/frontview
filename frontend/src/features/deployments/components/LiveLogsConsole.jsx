import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const getLogClass = (level) => {
  if (level === 'error') return 'text-[var(--color-velora-accent-red)]';
  if (level === 'warn') return 'text-[var(--color-velora-accent-yellow)]';
  if (level === 'success') return 'text-[var(--color-velora-accent-green)]';
  return 'text-[var(--color-velora-text)]';
};

const LiveLogsConsole = ({ logs, isStreaming }) => {
  const scrollRef = useRef(null);
  const [typingLogId, setTypingLogId] = useState(null);
  const [typingProgress, setTypingProgress] = useState(0);

  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;

  useEffect(() => {
    if (!lastLog) return;

    // Start typewriter effect for newly appended log lines
    setTypingLogId(lastLog.id);
    setTypingProgress(0);

    const fullText = String(lastLog.message || '');
    if (!fullText) return;

    let current = 0;
    let raf = 0;

    const tick = () => {
      // Roughly ~60 chars/sec (1 second to fully render 60 chars)
      const step = Math.max(1, Math.ceil(fullText.length / 60));
      current = Math.min(fullText.length, current + step);
      setTypingProgress(current);
      if (current < fullText.length) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lastLog?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length, typingProgress]);

  const renderedLogs = useMemo(() => {
    return logs.map((log) => {
      if (log.id !== typingLogId) return log;
      const message = String(log.message || '').slice(0, typingProgress);
      return { ...log, message };
    });
  }, [logs, typingLogId, typingProgress]);

  return (
    <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-4 md:p-6 shadow-2xl relative overflow-hidden flex flex-col h-[500px]">
      <div className="flex items-center justify-between pb-4 border-b border-[#40403a] mb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-velora-accent-red)]/50" />
          <div className="w-3 h-3 rounded-full bg-[var(--color-velora-accent-yellow)]/50" />
          <div className="w-3 h-3 rounded-full bg-[var(--color-velora-accent-green)]/50" />
        </div>
        <p className="text-xs font-mono text-[var(--color-velora-text-muted)] tracking-widest">DeployPilot Secure Shell</p>
        {isStreaming ? (
          <div className="flex items-center gap-2 text-[var(--color-velora-accent-yellow)] text-xs font-mono">
            <RefreshCw size={12} className="animate-spin" />
            Streaming
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[var(--color-velora-accent-green)] text-xs font-mono">
            <ShieldCheck size={12} />
            Idle
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-[11px] md:text-xs tracking-wider leading-relaxed pr-2 custom-scrollbar">
        {logs.length === 0 && (
          <div className="text-[var(--color-velora-text-muted)] text-sm">
            No logs yet. Trigger deployment and open it to stream output.
          </div>
        )}

        {renderedLogs.map((log) => (
          <div key={log.id} className="flex gap-4 mb-2 hover:bg-[#40403a]/50 px-2 py-1 rounded transition-colors group">
            <span className="text-[var(--color-velora-text-muted)] min-w-[70px] opacity-60 group-hover:opacity-100 transition-opacity">
              {log.time}
            </span>
            <span className={`flex-1 ${getLogClass(log.level)}`}>{log.message}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default LiveLogsConsole;
