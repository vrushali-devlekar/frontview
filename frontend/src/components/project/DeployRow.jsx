import React, { useState } from 'react';
import { History, GitBranch, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import CyberButton from '../ui/CyberButton';
import StatusBadge from '../ui/StatusBadge';

export default function DeployRow({ deployment, onRollback }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const isSuccess = deployment.status === 'SUCCESS';
  
  const handleRollbackClick = () => {
    if (!isSuccess) return;
    setIsConfirming(true);
  };

  const confirmRollback = async () => {
    setIsConfirming(false);
    setIsRollingBack(true);

    try {
      // SDE Mechanism: Trigger rollback to this specific version
      // await fetch(`/api/deployments/rollback/${deployment.id}`, { method: 'POST' });
      
      // MOCK IMPLEMENTATION
      setTimeout(() => {
        setIsRollingBack(false);
        if (onRollback) onRollback(deployment.id);
        alert(`Rollback to ${deployment.version} initiated successfully!`);
      }, 1500);
    } catch (error) {
      console.error("Rollback failed", error);
      setIsRollingBack(false);
    }
  };

  return (
    <div className={`relative p-4 border-2 mb-4 bg-valora-card transition-all ${
      isSuccess ? 'border-[#333] hover:border-valora-cyan/50' : 'border-[#333] hover:border-red-500/50'
    }`}>
      {/* Corner Accents */}
      {isSuccess ? (
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-valora-cyan" />
      ) : (
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Info Column */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`p-2 border ${isSuccess ? 'border-valora-cyan/30 text-valora-cyan bg-valora-cyan/10' : 'border-red-500/30 text-red-500 bg-red-500/10'}`}>
            <History size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-[14px] font-pixel text-white uppercase tracking-widest truncate">
                {deployment.version}
              </h4>
              <StatusBadge status={deployment.status} type={isSuccess ? "success" : "danger"} />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#888] font-mono tracking-widest uppercase truncate">
              <span className="flex items-center gap-1"><GitBranch size={10} /> {deployment.branch}</span>
              <span className="hidden md:inline">•</span>
              <span className="truncate max-w-[200px]">{deployment.commitMessage}</span>
            </div>
          </div>
        </div>

        {/* Meta Column */}
        <div className="flex flex-col items-start md:items-end gap-1 font-mono shrink-0">
          <p className="text-[10px] text-[#ccc] tracking-widest">{deployment.timeAgo}</p>
          <p className="text-[9px] text-[#555] tracking-widest uppercase">By {deployment.author}</p>
        </div>

        {/* Action Column */}
        <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
          {isConfirming ? (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-valora-yellow font-pixel uppercase">CONFIRM?</span>
              <CyberButton variant="primary" onClick={confirmRollback} className="px-3 py-1 text-[10px]">YES</CyberButton>
              <CyberButton variant="neutral" onClick={() => setIsConfirming(false)} className="px-3 py-1 text-[10px]">NO</CyberButton>
            </div>
          ) : (
            <button 
              onClick={handleRollbackClick}
              disabled={!isSuccess || isRollingBack}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                !isSuccess 
                  ? 'border-[#333] text-[#555] cursor-not-allowed bg-[#111]' 
                  : 'border-valora-cyan text-valora-cyan hover:bg-valora-cyan/10 hover:shadow-[0_0_10px_rgba(0,255,204,0.2)]'
              }`}
            >
              {isRollingBack ? (
                <><RefreshCw size={12} className="animate-spin" /> REVERTING...</>
              ) : (
                <><History size={12} /> {isSuccess ? 'ROLLBACK' : 'UNAVAILABLE'}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
