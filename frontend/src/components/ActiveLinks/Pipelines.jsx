import React from "react";
import { CheckCircle, PlayCircle, Lock, Rocket, Settings, XCircle, Star } from "lucide-react";

const stages = [
  { id: 1, name: "SOURCE", status: "passed", icon: "check", time: "3m ago" },
  { id: 2, name: "BUILD", status: "in-progress", icon: "play", time: "2m 45s", pulse: true },
  { id: 3, name: "TEST", status: "pending", icon: "lock", time: "-" },
  { id: 4, name: "DEPLOY", status: "pending", icon: "lock", time: "-" },
];

const pipelinesList = [
  { id: 1, name: "User Auth Service", updated: "3m ago", status: "passed", icon: "rocket", active: true },
  { id: 2, name: "Payment Service", updated: "15m ago", status: "passed", icon: "rocket" },
  { id: 3, name: "Data Ingest Service", updated: "1h ago", status: "in-progress", icon: "rocket" },
  { id: 4, name: "Notification Service", updated: "2h ago", status: "failed", icon: "settings" },
  { id: 5, name: "Frontend Web", updated: "3h ago", status: "passed", icon: "rocket" },
];

const HexNode = ({ status, icon }) => {
  const bgColor =
    status === "passed"
      ? "rgba(74, 222, 128, 0.12)"
      : status === "in-progress"
        ? "rgba(234, 179, 8, 0.12)"
        : "rgba(64, 64, 58, 0.3)";

  const strokeColor =
    status === "passed"
      ? "var(--color-velora-accent-green)"
      : status === "in-progress"
        ? "var(--color-velora-accent-yellow)"
        : "#40403a";

  const iconColor =
    status === "passed"
      ? "var(--color-velora-accent-green)"
      : status === "in-progress"
        ? "var(--color-velora-accent-yellow)"
        : "var(--color-velora-text-muted)";

  return (
    <div className="relative flex items-center justify-center w-[60px] h-[60px] md:w-[76px] md:h-[76px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-lg">
        {/* Solid background to hide lines underneath */}
        <polygon
          points="27.5,11 72.5,11 95,50 72.5,89 27.5,89 5,50"
          fill="var(--color-velora-bg)" 
        />
        {/* Tint and stroke */}
        <polygon
          points="27.5,11 72.5,11 95,50 72.5,89 27.5,89 5,50"
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth="2.5"
        />
      </svg>
      <div className="relative z-10" style={{ color: iconColor }}>
        {icon === "check" && <CheckCircle size={22} strokeWidth={2.5} />}
        {icon === "play" && <PlayCircle size={22} strokeWidth={2.5} />}
        {icon === "lock" && <Lock size={20} strokeWidth={2} />}
      </div>
    </div>
  );
};

const Pipelines = () => {
  return (
    <div className="relative p-5 md:p-8 font-sans text-[var(--color-velora-text)] z-0 flex flex-col h-full w-full overflow-hidden">
      {/* Background Image - scaled beautifully */}
      <div
        className="absolute inset-0 -z-10 bg-no-repeat bg-cover bg-top pointer-events-none opacity-40"
        style={{
          backgroundImage: `url(/hotel-bg.png)`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%)'
        }}
      />

      <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full">
        {/* Page Header */}
        <div className="flex-none mb-6">
          <h1 className="text-lg md:text-xl text-[var(--color-velora-text)] mb-3 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(224,216,190,0.5)]">PIPELINES</h1>
          <p className="text-[8px] md:text-[10px] text-[var(--color-velora-text-muted)] uppercase tracking-tight">Build, test and deploy your code</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0 pb-4">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl flex flex-col p-5 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] tracking-tight text-[var(--color-velora-text)] uppercase">PIPELINES</h3>
              <button className="text-[8px] text-[var(--color-velora-text)] bg-transparent border border-[#40403a] px-3 py-1.5 rounded hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors flex items-center gap-1 uppercase">
                + New Pipeline
              </button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
              {pipelinesList.map((p) => (
                <div key={p.id} className={`p-3.5 rounded-xl border ${p.active ? 'border-[#E0D8BE] bg-[var(--color-velora-text)]/10' : 'border-transparent hover:bg-[var(--color-velora-text)]/5'} flex items-center justify-between cursor-pointer transition-all`}>
                  <div className="flex items-center gap-4">
                    <div className="text-[var(--color-velora-text-muted)]">
                      {p.icon === 'rocket' ? <Rocket size={16} strokeWidth={1.5} /> : <Settings size={16} strokeWidth={1.5} />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[8px] text-[var(--color-velora-text)] uppercase">{p.name}</span>
                      <span className="text-[6px] text-[var(--color-velora-text-muted)] uppercase">Updated {p.updated}</span>
                    </div>
                  </div>
                  <div>
                    {p.status === 'passed' && <CheckCircle size={14} className="text-[var(--color-velora-accent-green)]" strokeWidth={2} />}
                    {p.status === 'in-progress' && <PlayCircle size={14} className="text-[var(--color-velora-accent-yellow)]" strokeWidth={2} />}
                    {p.status === 'failed' && <XCircle size={14} className="text-[var(--color-velora-accent-red)]" strokeWidth={2} />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-5 flex justify-center border-t border-[#40403a]">
              <button className="text-[8px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] transition-colors uppercase flex items-center gap-2">
                View all pipelines &rarr;
              </button>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col gap-6 min-h-0 w-full overflow-y-auto lg:overflow-hidden">
            
            {/* Top Graph Section */}
            <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-6 md:p-8 shadow-lg flex-none">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                 <div>
                   <div className="flex items-center gap-3 mb-4">
                     <h2 className="text-xs md:text-[14px] text-[var(--color-velora-text)] uppercase tracking-tight">USER AUTH SERVICE</h2>
                     <Star className="w-4 h-4 text-[var(--color-velora-text-muted)]" />
                   </div>
                   <div className="flex flex-wrap items-center gap-4 text-[7px] md:text-[8px] text-[var(--color-velora-text-muted)] uppercase tracking-tight">
                     <span>Branch: <span className="text-[var(--color-velora-text)] bg-[#40403a]/50 px-2 py-1 rounded ml-1">main</span></span>
                     <span className="w-px h-3 bg-[#40403a]"></span>
                     <span>Last run: <span className="text-[var(--color-velora-text)]">3m ago</span></span>
                     <span className="w-px h-3 bg-[#40403a]"></span>
                     <span>Trigger: <span className="text-[var(--color-velora-text)]">Push by henrich.vegh</span></span>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <button className="text-[8px] text-[var(--color-velora-text)] bg-transparent border border-[#40403a] px-4 py-2 rounded hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors flex items-center gap-2 uppercase">
                     <PlayCircle className="w-3 h-3" /> Run Pipeline
                   </button>
                   <button className="text-[8px] text-[var(--color-velora-text)] bg-transparent border border-[#40403a] px-3 py-2 rounded hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors flex items-center justify-center">
                     <span className="leading-none">...</span>
                   </button>
                 </div>
              </div>

              {/* Pipeline Visualization */}
              <div className="relative w-full max-w-3xl mx-auto py-4">
                <div className="flex justify-between relative z-10 w-full">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center w-1/4 relative group">
                      
                      {/* Label */}
                      <span className="text-[7px] md:text-[8px] text-[var(--color-velora-text-muted)] mb-6 uppercase tracking-tight">
                        {stage.name}
                      </span>
                      
                      {/* Hex Node Wrapper */}
                      <div className="relative w-full flex justify-center">
                        {/* Connector Line behind nodes */}
                        {index < stages.length - 1 && (
                          <div className="absolute top-1/2 left-[50%] w-full h-[2px] -z-10 -translate-y-1/2">
                            {/* Color line based on current node status */}
                            <div className={`w-full h-full ${
                               stage.status === 'passed' 
                                 ? 'bg-[var(--color-velora-accent-green)]' 
                                 : stage.status === 'in-progress'
                                   ? 'bg-[var(--color-velora-accent-yellow)]'
                                   : 'bg-[#40403a]'
                             }`} />
                          </div>
                        )}
                        
                        <HexNode status={stage.status} icon={stage.icon} />
                      </div>
                      
                      {/* Status label & Time */}
                      <div className="mt-6 flex flex-col items-center gap-2">
                        <span
                          className={`text-[7px] md:text-[8px] uppercase tracking-tight ${
                            stage.status === "passed"
                              ? "text-[var(--color-velora-accent-green)]"
                              : stage.status === "in-progress"
                                ? "text-[var(--color-velora-accent-yellow)]"
                                : "text-[var(--color-velora-text-muted)]"
                          }`}
                        >
                          {stage.status === "passed" ? "Passed" : stage.status === "in-progress" ? "In Progress" : "Pending"}
                        </span>
                        <span className="text-[6px] md:text-[7px] text-[var(--color-velora-text-muted)] flex items-center gap-1 h-3 uppercase">
                          {stage.time}
                          {stage.pulse && <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-[var(--color-velora-accent-yellow)] animate-ping ml-1" style={{ animationDuration: '1.5s' }} />}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logs Section */}
            <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-5 md:p-6 shadow-lg flex-1 flex flex-col min-h-[200px]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#40403a]/50">
                 <h3 className="text-[10px] text-[var(--color-velora-text)] tracking-tight uppercase">LATEST RUN LOGS</h3>
                 <button className="text-[8px] text-[var(--color-velora-text-muted)] hover:text-[var(--color-velora-text)] transition-colors uppercase flex items-center gap-2">
                   View full logs &rarr;
                 </button>
              </div>
              
              <div className="space-y-3 text-[7px] md:text-[8px] overflow-y-auto flex-1 text-[var(--color-velora-text)] uppercase leading-relaxed tracking-tight">
                <div className="mb-4 flex items-center gap-2 text-[var(--color-velora-text-muted)]">
                  <span className="text-[var(--color-velora-text)]">&gt;_</span> Run started by henrich.vegh
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="text-[var(--color-velora-text-muted)] w-16 shrink-0">12:34:21</span>
                  <span className="text-[var(--color-velora-accent-green)] shrink-0">✓</span>
                  <span className="opacity-90">Checkout code</span>
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="text-[var(--color-velora-text-muted)] w-16 shrink-0">12:34:23</span>
                  <span className="text-[var(--color-velora-accent-green)] shrink-0">✓</span>
                  <span className="opacity-90">Setup Node.js 20.x</span>
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="text-[var(--color-velora-text-muted)] w-16 shrink-0">12:34:25</span>
                  <span className="text-[var(--color-velora-accent-green)] shrink-0">✓</span>
                  <span className="opacity-90">Install dependencies</span>
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="text-[var(--color-velora-text-muted)] w-16 shrink-0">12:34:45</span>
                  <span className="text-[var(--color-velora-accent-green)] shrink-0">✓</span>
                  <span className="opacity-90">Build artifact v1.2.3 generated</span>
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="text-[var(--color-velora-text-muted)] w-16 shrink-0">12:34:52</span>
                  <span className="text-[var(--color-velora-accent-yellow)] shrink-0">◇</span>
                  <span className="opacity-90">Running unit tests (154/154 passed)</span>
                </div>
                
                <div className="flex gap-4 items-start text-[var(--color-velora-accent-yellow)]">
                  <span className="text-[var(--color-velora-text-muted)] w-16 shrink-0">12:35:10</span>
                  <span className="shrink-0 animate-pulse">...</span>
                  <span>Integration tests: Running</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipelines;
