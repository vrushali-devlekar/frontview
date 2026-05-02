import { useMemo, useState, useEffect, useRef } from "react";
import { X, Cpu, MessageSquare, Expand, Send, BrainCircuit } from "lucide-react";

export default function AIModal({ deploymentId, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("cohere");

  const [streamedAnalysis, setStreamedAnalysis] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedAnalysis, chatMessages]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const runStreamingAnalysis = async () => {
      setIsLoading(true);
      setError("");
      setStreamedAnalysis("");
      setChatMessages([]);
      setIsChatExpanded(false);

      if (!deploymentId) {
        setError("No deployment selected.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/deployments/${deploymentId}/analyze/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ provider })
        });

        if (!response.ok) throw new Error("Connection failed.");

        setIsLoading(false);
        setIsTyping(true);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (let line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6);
                if (dataStr === '[DONE]') {
                  setIsTyping(false);
                  break;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text && !cancelled) {
                    for (let char of parsed.text) {
                      if (cancelled) break;
                      setStreamedAnalysis((prev) => prev + char);
                      await new Promise(r => setTimeout(r, 15));
                    }
                  }
                } catch (e) { /* partial chunk */ }
              }
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to analyze.");
          setIsLoading(false);
        }
      } finally {
        if (!cancelled) setIsTyping(false);
      }
    };

    runStreamingAnalysis();
    return () => { cancelled = true; };
  }, [isOpen, deploymentId, provider]);

  const canChat = useMemo(() => Boolean(deploymentId), [deploymentId]);

  if (!isOpen) return null;

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || !deploymentId || isTyping) return;

    setChatInput("");
    setIsTyping(true);

    const userMsgId = `${Date.now()}-u`;
    setChatMessages((prev) => [...prev, { id: userMsgId, role: "user", text }]);

    const astMsgId = `${Date.now()}-a`;
    setChatMessages((prev) => [...prev, { id: astMsgId, role: "assistant", text: "" }]);

    try {
      const response = await fetch(`http://localhost:5000/api/deployments/${deploymentId}/analyze/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ provider, question: text })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (let line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              if (dataStr === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  for (let char of parsed.text) {
                    setChatMessages((prev) => prev.map(msg =>
                      msg.id === astMsgId ? { ...msg, text: msg.text + char } : msg
                    ));
                    await new Promise(r => setTimeout(r, 10));
                  }
                }
              } catch (e) { }
            }
          }
        }
      }
    } catch (e) {
      setChatMessages((prev) => [...prev, { id: `${Date.now()}-e`, role: "assistant", text: "Connection lost. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} aria-hidden />

      <div className={`ai-modal-enter relative w-full bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden ${isChatExpanded ? "max-w-4xl" : "max-w-2xl"}`}>

        {/* Header - Clean & Professional */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] shrink-0 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6EE7B7]/20 to-[#6EE7B7]/5 flex items-center justify-center border border-[#6EE7B7]/20">
              <BrainCircuit size={24} className="text-[#6EE7B7]" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white tracking-widest uppercase font-pixel">
                VELORA_AI
              </h2>
              <p className="text-[10px] text-[#666] mt-1 font-mono tracking-widest uppercase">INTELLIGENT DIAGNOSTICS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canChat}
              onClick={() => setIsChatExpanded((v) => !v)}
              className="p-2 rounded-lg border border-[#222] text-[#888] hover:text-white hover:bg-[#111] disabled:opacity-40 transition-all"
            >
              <Expand size={14} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-[#111] transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 font-mono text-[14px]" style={{ scrollbarWidth: 'thin' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-52 gap-5">
              {/* Professional loading dots */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6EE7B7] ai-dot-1"></div>
                <div className="w-3 h-3 rounded-full bg-[#6EE7B7] ai-dot-2"></div>
                <div className="w-3 h-3 rounded-full bg-[#6EE7B7] ai-dot-3"></div>
              </div>
              <p className="text-[#888] text-sm tracking-wide">
                Analyzing deployment logs...
              </p>
              <p className="text-[#444] text-xs">
                This usually takes 5–10 seconds
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E55B5B]/10 flex items-center justify-center">
                <X size={20} className="text-[#E55B5B]" />
              </div>
              <p className="text-[#E55B5B] text-sm">{error}</p>
              <button onClick={() => setError("")} className="text-xs text-[#888] hover:text-white underline">Try again</button>
            </div>
          ) : !isChatExpanded ? (
            <div className="space-y-4">
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a1a1a]">
                  <Cpu size={14} className="text-[#6EE7B7]" />
                  <span className="text-xs text-[#6EE7B7] font-bold tracking-widest uppercase">ANALYSIS RESULT</span>
                </div>
                <div className="text-[15px] leading-[1.8] text-[#ccc] whitespace-pre-wrap font-mono">
                  {streamedAnalysis}
                  {isTyping && <span className="inline-block w-2 h-5 bg-[#6EE7B7] ai-cursor-blink ml-1 align-middle rounded-sm"></span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 min-h-0 h-full">
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2" style={{ scrollbarWidth: 'thin' }}>
                {/* Initial Analysis */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-[#080808] border border-[#1a1a1a] rounded-xl px-5 py-4 text-[15px] leading-[1.8] text-[#ccc] whitespace-pre-wrap font-mono">
                    {streamedAnalysis}
                  </div>
                </div>

                {chatMessages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-5 py-4 text-[15px] leading-[1.8] whitespace-pre-wrap font-mono ${m.role === "user"
                        ? "bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 text-[#ccc]"
                        : "bg-[#080808] border border-[#1a1a1a] text-[#ccc]"
                      }`}>
                      {m.text}
                      {(isTyping && m.id === chatMessages[chatMessages.length - 1].id && m.role === "assistant") && (
                        <span className="inline-block w-2 h-5 bg-[#6EE7B7] ai-cursor-blink ml-1 align-middle rounded-sm"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1a1a1a] pt-4 flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    rows={2}
                    placeholder="ASK A FOLLOW-UP QUESTION..."
                    className="w-full bg-[#080808] border border-[#1a1a1a] text-[#ccc] text-sm font-mono rounded-lg p-4 outline-none focus:border-[#6EE7B7]/40 placeholder:text-[#444] resize-none transition-colors uppercase"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  />
                </div>
                <button
                  type="button"
                  disabled={!chatInput.trim() || isTyping}
                  onClick={sendChat}
                  className="h-[44px] px-5 bg-[#6EE7B7] text-[#060606] text-xs font-bold font-mono tracking-widest rounded-lg hover:bg-[#86efac] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 uppercase"
                >
                  <Send size={14} />
                  SEND
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1a1a1a] bg-[#0a0a0a] shrink-0 flex justify-between items-center">
          <p className="text-[10px] text-[#444] font-mono uppercase tracking-widest">AI RESPONSES MAY BE INACCURATE. VERIFY LOGS.</p>
          <div className="flex gap-2">
            {!isLoading && !error && !isChatExpanded && (
              <button
                onClick={() => setIsChatExpanded(true)}
                className="px-4 py-2 text-xs rounded-lg border border-[#222] text-[#888] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2 font-mono uppercase tracking-widest font-bold"
              >
                <MessageSquare size={12} /> ASK_FOLLOWUP
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-lg bg-[#111] border border-[#222] text-[#888] hover:text-white transition-all font-mono uppercase tracking-widest font-bold"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}