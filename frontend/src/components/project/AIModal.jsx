import React, { useState, useEffect } from 'react';
import { Activity, X, Terminal, Cpu } from 'lucide-react';
import CyberButton from '../ui/CyberButton';
import ReactMarkdown from 'react-markdown'; 
import { analyzeDeploymentLogs } from '../../api/api';

export default function AIModal({ errorLogs, isOpen, onClose, deploymentId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset state when opened
    setIsLoading(true);
    setAiResponse('');

    const fetchAIAnalysis = async () => {
      try {
        if (deploymentId) {
          // REAL API CALL — POST /api/deployments/:id/analyze-logs
          const res = await analyzeDeploymentLogs(deploymentId, errorLogs);
          const data = res.data.data || res.data;
          // The backend returns { analysis, rootCause, suggestedFix } or a markdown string
          if (typeof data === 'string') {
            setAiResponse(data);
          } else {
            setAiResponse(
              `### ⚠️ Root Cause\n${data.rootCause || data.analysis || 'Unknown'}\n\n### 🛠️ Suggested Fix\n${data.suggestedFix || 'No suggestion available.'}`
            );
          }
        } else {
          // MOCK fallback when no deploymentId (for demo/testing)
          await new Promise(r => setTimeout(r, 2500));
          setAiResponse(`### ⚠️ Root Cause Analysis\nThe deployment failed because the Node.js application is missing a core module dependency. The log \`Module not found "crypto"\` indicates that a package is trying to use the built-in \`crypto\` module, but it's not polyfilled.\n\n### 🛠️ Recommended Fix\nInstall the polyfill:\n\`\`\`bash\nnpm install crypto-browserify\n\`\`\``);
        }
      } catch (error) {
        console.error('AI Analysis failed:', error);
        setAiResponse('### ❌ Connection Error\nFailed to communicate with Velora AI Node. The AI service may be offline or the deployment logs could not be found. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIAnalysis();
  }, [isOpen, errorLogs, deploymentId]);

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
            onClick={onClose}
            className="p-2 text-[#666] hover:text-white hover:bg-[#222] transition-colors border border-transparent hover:border-[#444]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-6">
              <div className="relative w-16 h-16">
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#222] bg-[#0a0a0a] shrink-0 flex justify-end gap-4">
          <CyberButton variant="neutral" onClick={onClose}>
            DISMISS
          </CyberButton>
          {!isLoading && (
            <CyberButton variant="primary" onClick={() => alert("Auto-fix triggered!")}>
              <Terminal size={14} className="mr-2" />
              APPLY_AUTO_FIX
            </CyberButton>
          )}
        </div>

      </div>
    </div>
  );
}
