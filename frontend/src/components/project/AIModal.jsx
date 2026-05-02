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
