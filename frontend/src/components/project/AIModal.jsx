<<<<<<< HEAD
<<<<<<< HEAD
import { useMemo, useState, useEffect } from "react";
import { Activity, X, Terminal, Cpu, MessageSquare, Expand } from "lucide-react";
import CyberButton from "../ui/CyberButton";
import { analyzeDeploymentLogs } from "../../api/api";

function normalizeAnalysis(data) {
  if (!data || typeof data !== "object") return null;
  return {
    rootCause: data.rootCause || "",
    stepByStepFix: Array.isArray(data.stepByStepFix) ? data.stepByStepFix : [],
    securityFlags: Array.isArray(data.securityFlags) ? data.securityFlags : [],
    rawOutput: typeof data.rawOutput === "string" ? data.rawOutput : "",
  };
}

export default function AIModal({ deploymentId, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("gemini");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setAnalysis(null);
      setError("");
      setIsChatExpanded(false);
      setChatMessages([]);
      setChatInput("");
      setChatLoading(false);
      if (!deploymentId) {
        setError("Missing deployment id.");
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await analyzeDeploymentLogs(deploymentId, { provider });
        if (cancelled) return;
        const payload = data?.data;
        const normalized = normalizeAnalysis(payload);
        setAnalysis(normalized);
        setChatMessages([
          {
            id: "initial",
            role: "assistant",
            kind: "analysis",
            data: normalized,
          },
        ]);
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message ||
              e.message ||
              "Failed to analyze logs."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isOpen, deploymentId, provider]);

  const canChat = useMemo(() => Boolean(deploymentId), [deploymentId]);

  if (!isOpen) return null;

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || !deploymentId || chatLoading) return;
    setChatInput("");
    setChatLoading(true);
    setChatMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-u`, role: "user", kind: "text", text },
    ]);
    try {
      const { data } = await analyzeDeploymentLogs(deploymentId, {
        provider,
        question: text,
      });
      const normalized = normalizeAnalysis(data?.data);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-a`,
          role: "assistant",
          kind: "analysis",
          data: normalized,
        },
      ]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-e`,
          role: "assistant",
          kind: "text",
          text:
            e.response?.data?.message ||
            e.message ||
            "Failed to send message.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const AnalysisBlock = ({ data }) => {
    if (!data) return <p className="text-[#666] normal-case">No data.</p>;
    return (
      <div className="space-y-4 normal-case">
        <div className="border border-[#222] bg-[#050505] p-4">
          <p className="text-[10px] font-mono tracking-widest text-[#00FFCC] uppercase mb-2">
            Root_cause
          </p>
          <p className="text-[12px] text-[#ddd] leading-relaxed">
            {data.rootCause || "—"}
          </p>
        </div>
        <div className="border border-[#222] bg-[#050505] p-4">
          <p className="text-[10px] font-mono tracking-widest text-[#FFCC00] uppercase mb-2">
            Step_by_step_fix
          </p>
          {data.stepByStepFix?.length ? (
            <ol className="list-decimal pl-4 space-y-2 text-[12px] text-[#ddd] leading-relaxed">
              {data.stepByStepFix.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : (
            <p className="text-[12px] text-[#777]">—</p>
          )}
        </div>
        <div className="border border-[#222] bg-[#050505] p-4">
          <p className="text-[10px] font-mono tracking-widest text-red-400 uppercase mb-2">
            Security_flags
          </p>
          {data.securityFlags?.length ? (
            <ul className="list-disc pl-4 space-y-2 text-[12px] text-[#ddd] leading-relaxed">
              {data.securityFlags.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px] text-[#777]">—</p>
          )}
        </div>
        {data.rawOutput ? (
          <details className="border border-[#222] bg-[#050505] p-4">
            <summary className="cursor-pointer text-[10px] font-mono tracking-widest text-[#888] uppercase">
              Raw_output
            </summary>
            <pre className="mt-3 whitespace-pre-wrap text-[11px] text-[#bbb] leading-relaxed">
              {data.rawOutput}
            </pre>
          </details>
        ) : null}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`relative w-full bg-[#0f0f0f] border-2 border-[#2c2c2b] flex flex-col max-h-[85vh] shadow-[0_0_30px_rgba(0,255,204,0.1)] ${
          isChatExpanded ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00FFCC]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00FFCC]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00FFCC]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00FFCC]" />

        <div className="flex items-center justify-between p-4 border-b-2 border-[#222] shrink-0 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 border border-[#00FFCC] bg-[#00FFCC]/10 text-[#00FFCC]">
              <Cpu size={16} />
            </div>
            <h2
              className="text-[14px] font-mono text-[#00FFCC] uppercase tracking-widest"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "10px" }}
            >
              VELORA_AI_ANALYSIS
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="bg-[#050505] border border-[#333] text-[#ccc] text-[10px] font-mono px-2 py-1 outline-none"
              title="AI model provider"
            >
              <option value="gemini" className="bg-[#050505]">
                gemini (default)
              </option>
              <option value="cohere" className="bg-[#050505]">
                cohere
              </option>
              <option value="mistral" className="bg-[#050505]">
                mistral
              </option>
            </select>
            <button
              type="button"
              disabled={!canChat}
              onClick={() => setIsChatExpanded((v) => !v)}
              className="px-3 py-2 text-[10px] font-mono tracking-widest border border-[#333] text-[#ccc] hover:bg-[#111] disabled:opacity-50"
              title="Expand chat"
            >
              <Expand size={14} className="inline-block mr-2" />
              {isChatExpanded ? "COLLAPSE" : "CHAT"}
            </button>
          <button
            type="button"
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
import React, { useState, useEffect } from 'react';
import { Activity, X, Terminal, Cpu } from 'lucide-react';
import CyberButton from '../ui/CyberButton';
import ReactMarkdown from 'react-markdown'; 

export default function AIModal({ errorLogs, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset state when opened
    setIsLoading(true);
    setAiResponse('');

    const fetchAIAnalysis = async () => {
      try {
        // SDE Mechanism: Send logs to Langchain AI route
        // const response = await fetch('/api/ai/analyze', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ logs: errorLogs })
        // });
        // const data = await response.json();
        // setAiResponse(data.markdownResponse);

        // MOCK IMPLEMENTATION
        setTimeout(() => {
          setAiResponse(`
### ⚠️ Root Cause Analysis
The deployment failed because the Node.js application is missing a core module dependency. The log \`Module not found "crypto"\` indicates that a package is trying to use the built-in \`crypto\` module, but it's not polyfilled or available in this environment.

### 🛠️ Recommended Fix
You need to install the \`crypto-browserify\` fallback or update your build configuration.

1. Install the polyfill:
\`\`\`bash
npm install crypto-browserify
\`\`\`

2. Update your Vite/Webpack config to define the fallback:
\`\`\`javascript
resolve: {
  alias: {
    crypto: 'crypto-browserify',
  }
}
\`\`\`
          `);
          setIsLoading(false);
        }, 3000);
      } catch (error) {
        setAiResponse('Failed to communicate with Velora AI Node. Please try again.');
        setIsLoading(false);
      }
    };

    fetchAIAnalysis();
  }, [isOpen, errorLogs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-valora-card border-2 border-valora-border flex flex-col max-h-[85vh] shadow-[0_0_30px_rgba(0,255,204,0.1)]">
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-valora-cyan"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-valora-cyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-valora-cyan"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-valora-cyan"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[#222] shrink-0 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 border border-valora-cyan bg-valora-cyan/10 text-valora-cyan">
              <Cpu size={16} />
            </div>
            <h2 className="text-[14px] font-pixel text-valora-cyan uppercase tracking-widest">
              VELORA_AI_ANALYSIS
            </h2>
          </div>
          <button 
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
            onClick={onClose}
            className="p-2 text-[#666] hover:text-white hover:bg-[#222] transition-colors border border-transparent hover:border-[#444]"
          >
            <X size={16} />
          </button>
<<<<<<< HEAD
<<<<<<< HEAD
          </div>
        </div>

=======
        </div>

        {/* Body */}
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
        </div>

        {/* Body */}
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-6">
              <div className="relative w-16 h-16">
<<<<<<< HEAD
<<<<<<< HEAD
                <div className="absolute inset-0 border-2 border-t-[#00FFCC] border-r-transparent border-b-[#00FFCC] border-l-transparent rounded-full animate-spin" />
                <div className="absolute inset-2 border-2 border-t-transparent border-r-[#FFCC00] border-b-transparent border-l-[#FFCC00] rounded-full animate-spin" style={{ animationDuration: "2s" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={16} className="text-[#00FFCC] animate-pulse" />
                </div>
              </div>
              <p className="text-[#00FFCC] font-mono text-[10px] uppercase tracking-[0.2em] animate-pulse">
                AI IS ANALYZING LOGS...
              </p>
            </div>
          ) : error ? (
            <p className="text-red-400 normal-case">{error}</p>
          ) : !isChatExpanded ? (
            <AnalysisBlock data={analysis} />
          ) : (
            <div className="flex flex-col gap-4 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] border px-4 py-3 ${
                        m.role === "user"
                          ? "bg-[#111] border-[#333] text-[#ddd]"
                          : "bg-[#050505] border-[#222] text-[#ddd]"
                      }`}
                    >
                      {m.kind === "text" ? (
                        <p className="text-[12px] leading-relaxed normal-case">
                          {m.text}
                        </p>
                      ) : (
                        <AnalysisBlock data={m.data} />
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] border px-4 py-3 bg-[#050505] border-[#222] text-[#888]">
                      <span className="text-[11px] tracking-widest uppercase">
                        AI_TYPING...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#222] pt-4 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-[#888] font-mono tracking-widest uppercase mb-2">
                    Ask_followup
                  </label>
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    rows={2}
                    placeholder="Ask about the error, fixes, versions, security…"
                    className="w-full bg-[#050505] border border-[#333] text-[#ddd] text-[12px] font-mono p-3 outline-none focus:border-[#00FFCC] placeholder:text-[#444]"
                  />
                </div>
                <button
                  type="button"
                  disabled={!chatInput.trim() || chatLoading}
                  onClick={sendChat}
                  className="h-[42px] px-4 bg-[#00FFCC] text-black text-[10px] font-bold border-2 border-black shadow-[2px_2px_0_0_#007777] hover:bg-[#33ffcc] disabled:opacity-50 font-mono"
                >
                  <MessageSquare size={14} className="inline-block mr-2" />
                  SEND
                </button>
              </div>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                <div className="absolute inset-0 border-2 border-t-valora-cyan border-r-transparent border-b-valora-cyan border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-2 border-t-transparent border-r-valora-yellow border-b-transparent border-l-valora-yellow rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={16} className="text-valora-cyan animate-pulse" />
                </div>
              </div>
              <p className="text-valora-cyan font-pixel text-[10px] uppercase tracking-[0.2em] animate-pulse">
                AI IS ANALYZING LOGS...
              </p>
            </div>
          ) : (
            <div className="text-[#ccc] prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#333] max-w-none">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
            </div>
          )}
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
=======
        {/* Footer */}
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
        {/* Footer */}
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        <div className="p-4 border-t-2 border-[#222] bg-[#0a0a0a] shrink-0 flex justify-end gap-4">
          <CyberButton variant="neutral" onClick={onClose}>
            DISMISS
          </CyberButton>
<<<<<<< HEAD
<<<<<<< HEAD
          {!isLoading && !error && (
            <CyberButton
              variant="primary"
              onClick={() => onClose()}
            >
              <Terminal size={14} className="mr-2" />
              SATISFIED_CLOSE
            </CyberButton>
          )}
        </div>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
          {!isLoading && (
            <CyberButton variant="primary" onClick={() => alert("Auto-fix triggered!")}>
              <Terminal size={14} className="mr-2" />
              APPLY_AUTO_FIX
            </CyberButton>
          )}
        </div>

<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
      </div>
    </div>
  );
}
