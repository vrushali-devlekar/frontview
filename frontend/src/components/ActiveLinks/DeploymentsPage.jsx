import React from 'react';
import { CheckCircle2, XCircle, RotateCcw, ExternalLink, Terminal, ChevronDown } from 'lucide-react';

const DeploymentsPage = () => {
  const deployments = [
    {
      id: 'dp-003a',
      status: 'SUCCESS',
      timestamp: '3m ago',
      commit: '1f23b',
      branch: 'main',
      duration: '1m 20s',
      author: 'Henrich Vegh'
    },
    {
      id: 'dp-003b',
      status: 'FAILED',
      timestamp: '15m ago',
      commit: '89abc',
      error: 'Error in Test stage'
    },
    {
      id: 'dp-003c',
      status: 'ROLLED BACK',
      timestamp: '1h ago',
      commit: '4de0f',
      note: 'Triggered by Admin'
    }
  ];

  return (
    <div className="relative p-6 md:p-8 min-h-screen font-sans text-[var(--color-velora-text)] z-0">
      
      {/* Background Banner */}
      <div 
        className="absolute top-0 left-0 right-0 h-[150px] md:h-[200px] -z-10 bg-no-repeat bg-cover bg-center pointer-events-none"
        style={{ 
          backgroundImage: `url(/hotel-bg.png)`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velora-bg)]" />
      </div>

      <h2 className="text-lg md:text-xl mt-[60px] md:mt-[100px] mb-6 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(224,216,190,0.5)]">Recent Deployments Log</h2>

      <div className="relative ml-4 border-l border-[#40403a] space-y-4 pb-4">
        {deployments.map((deploy) => (
          <div key={deploy.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 bg-[var(--color-velora-bg)] 
              ${deploy.status === 'SUCCESS' ? 'border-[var(--color-velora-accent-green)]' : 
                deploy.status === 'FAILED' ? 'border-[var(--color-velora-accent-red)]' : 'border-[var(--color-velora-accent-yellow)]'}`} 
            />

            {/* Deploy Card */}
            <div className={`bg-[var(--color-velora-sidebar)] border rounded-xl p-6 transition-all duration-300
              ${deploy.status === 'SUCCESS' ? 'border-[var(--color-velora-accent-green)]/30 hover:border-[var(--color-velora-accent-green)]/70' : 
                deploy.status === 'FAILED' ? 'border-[var(--color-velora-accent-red)]/30 hover:border-[var(--color-velora-accent-red)]/70' : 
                'border-[var(--color-velora-accent-yellow)]/30 hover:border-[var(--color-velora-accent-yellow)]/70'}`}>
              
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-[10px] text-[var(--color-velora-text-muted)] mb-3">Status</p>
                  <h3 className="text-xl md:text-2xl tracking-widest drop-shadow-[0_0_4px_rgba(224,216,190,0.4)]">DEPLOYS</h3>
                </div>

                <div className="flex gap-8 md:gap-16 items-center">
                  <div className="text-center">
                    <p className={`text-[10px] tracking-widest ${deploy.status === 'SUCCESS' ? 'text-[var(--color-velora-accent-green)]' : deploy.status === 'FAILED' ? 'text-[var(--color-velora-accent-red)]' : 'text-[var(--color-velora-accent-yellow)]'}`}>
                      {deploy.status}
                    </p>
                    <div className="flex items-center gap-1 mt-2 justify-center">
                      {deploy.status === 'SUCCESS' ? <CheckCircle2 size={12} className="text-[var(--color-velora-accent-green)]" /> : 
                       deploy.status === 'FAILED' ? <XCircle size={12} className="text-[var(--color-velora-accent-red)]" /> : 
                       <RotateCcw size={12} className="text-[var(--color-velora-accent-yellow)]" />}
                      <span className="text-[8px] text-[var(--color-velora-text-muted)]">Check</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-[var(--color-velora-text-muted)]">{deploy.id}</p>
                    <p className="text-[8px] text-[var(--color-velora-text-muted)] mt-1 opacity-70">{deploy.timestamp}</p>
                  </div>

                  <div className="text-right">
                    <h4 className="text-sm md:text-base tracking-widest uppercase">Commit {deploy.commit}</h4>
                  </div>
                </div>
              </div>

              {/* Expandable Details Area */}
              <div className="mt-6 pt-4 border-t border-[#40403a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {deploy.status === 'SUCCESS' ? (
                  <div className="flex gap-8 text-[10px]">
                    <div>
                      <span className="text-[var(--color-velora-text-muted)] flex items-center gap-1"><ChevronDown size={12}/> Branch</span>
                      <p className="mt-2 tracking-widest font-mono">{deploy.branch}</p>
                    </div>
                    <div>
                      <span className="text-[var(--color-velora-text-muted)]">Duration</span>
                      <p className="mt-2 tracking-widest font-mono">{deploy.duration}</p>
                    </div>
                    <button className="bg-[var(--color-velora-bg)] px-4 py-2 rounded-lg border border-[#40403a] flex items-center gap-2 hover:bg-[#40403a] transition-colors self-end md:self-auto">
                      <span className="font-mono text-[10px]">&gt;_ Logs</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] italic text-[var(--color-velora-text-muted)] font-mono">{deploy.error || deploy.note}</p>
                )}

                <div className="flex gap-4 w-full md:w-auto justify-end">
                  <button className="text-[8px] flex items-center gap-2 border border-[#40403a] px-4 py-2 rounded-lg hover:bg-[#40403a] transition-colors">
                    <RotateCcw size={10} /> Rollback
                  </button>
                  <button className="text-[8px] flex items-center gap-2 border border-[#40403a] px-4 py-2 rounded-lg hover:bg-[#40403a] transition-colors">
                    <ExternalLink size={10} /> Promote
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentsPage;