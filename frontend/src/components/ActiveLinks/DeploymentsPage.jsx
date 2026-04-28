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
    <div className="p-8 bg-[#0a0a0a] min-h-screen font-mono text-[var(--color-velora-text)]">
      <h2 className="text-xl mb-8 tracking-widest uppercase">Recent Deployments Log</h2>

      <div className="relative ml-4 border-l border-gray-800 space-y-8 pb-10">
        {deployments.map((deploy) => (
          <div key={deploy.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 bg-[#0a0a0a] 
              ${deploy.status === 'SUCCESS' ? 'border-green-500' : 
                deploy.status === 'FAILED' ? 'border-red-500' : 'border-orange-500'}`} 
            />

            {/* Deploy Card */}
            <div className={`bg-[#111] border rounded-xl p-6 transition-all duration-300
              ${deploy.status === 'SUCCESS' ? 'border-green-900/30 hover:border-green-500/50' : 
                deploy.status === 'FAILED' ? 'border-red-900/30 hover:border-red-500/50' : 
                'border-orange-900/30 hover:border-orange-500/50'}`}>
              
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <h3 className="text-3xl font-bold tracking-tighter">DEPLOYS</h3>
                </div>

                <div className="flex gap-8">
                  <div className="text-center">
                    <p className={`text-[10px] font-bold ${deploy.status === 'SUCCESS' ? 'text-green-500' : deploy.status === 'FAILED' ? 'text-red-500' : 'text-orange-500'}`}>
                      {deploy.status}
                    </p>
                    <div className="flex items-center gap-1 mt-1 justify-center">
                      {deploy.status === 'SUCCESS' ? <CheckCircle2 size={14} className="text-green-500" /> : 
                       deploy.status === 'FAILED' ? <XCircle size={14} className="text-red-500" /> : 
                       <RotateCcw size={14} className="text-orange-500" />}
                      <span className="text-xs">Check</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">{deploy.id}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{deploy.timestamp}</p>
                  </div>

                  <div className="text-right">
                    <h4 className="text-xl font-bold text-gray-300 uppercase">Commit {deploy.commit}</h4>
                  </div>
                </div>
              </div>

              {/* Expandable Details Area */}
              <div className="mt-6 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                {deploy.status === 'SUCCESS' ? (
                  <div className="flex gap-8 text-[10px]">
                    <div>
                      <span className="text-gray-500 flex items-center gap-1"><ChevronDown size={12}/> Branch</span>
                      <p className="mt-1">{deploy.branch}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration</span>
                      <p className="mt-1">{deploy.duration}</p>
                    </div>
                    <button className="bg-gray-800/50 px-3 py-1 rounded border border-gray-700 flex items-center gap-2 hover:bg-gray-700">
                      <Terminal size={12} /> Logs
                    </button>
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-500">{deploy.error || deploy.note}</p>
                )}

                <div className="flex gap-2">
                  <button className="text-[10px] flex items-center gap-1 border border-gray-800 px-3 py-1.5 rounded hover:bg-gray-800">
                    <RotateCcw size={12} /> Rollback
                  </button>
                  <button className="text-[10px] flex items-center gap-1 border border-gray-800 px-3 py-1.5 rounded hover:bg-gray-800">
                    <ExternalLink size={12} /> Promote
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