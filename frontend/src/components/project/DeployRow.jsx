<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, GitBranch, ExternalLink } from "lucide-react";
import CyberButton from "../ui/CyberButton";
import StatusBadge from "../ui/StatusBadge";
import { rollbackProject } from "../../api/api";

export default function DeployRow({ deployment, projectId, onRollback }) {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackError, setRollbackError] = useState("");

  const isSuccess = deployment.status === "SUCCESS";

  const handleRollbackClick = () => {
    if (!isSuccess) return;
    setRollbackError("");
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
    setIsConfirming(true);
  };

  const confirmRollback = async () => {
    setIsConfirming(false);
    setIsRollingBack(true);
<<<<<<< HEAD
<<<<<<< HEAD
    setRollbackError("");

    try {
      await rollbackProject(projectId, deployment.versionNumber);
      if (onRollback) onRollback(deployment.id);
    } catch (error) {
      console.error("Rollback failed", error);
      setRollbackError(
        error.response?.data?.message || error.message || "Rollback failed"
      );
    } finally {
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4

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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
      setIsRollingBack(false);
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const goToLogs = () => {
    const q = projectId
      ? `?projectId=${encodeURIComponent(projectId)}`
      : "";
    navigate(`/deploy/logs/${deployment.id}${q}`);
  };

  const badgeType =
    deployment.status === "SUCCESS"
      ? "success"
      : deployment.status === "FAILED"
        ? "error"
        : deployment.status === "BUILDING" || deployment.status === "ROLLING_BACK"
          ? "warning"
          : "neutral";

  return (
    <div
      className={`relative p-4 border-2 mb-4 bg-[#0f0f0f] transition-all ${
        isSuccess
          ? "border-[#333] hover:border-[#00FFCC]/50"
          : "border-[#333] hover:border-red-500/50"
      }`}
    >
      {isSuccess ? (
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FFCC]" />
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
  return (
    <div className={`relative p-4 border-2 mb-4 bg-valora-card transition-all ${
      isSuccess ? 'border-[#333] hover:border-valora-cyan/50' : 'border-[#333] hover:border-red-500/50'
    }`}>
      {/* Corner Accents */}
      {isSuccess ? (
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-valora-cyan" />
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
      ) : (
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`p-2 border ${
              isSuccess
                ? "border-[#00FFCC]/30 text-[#00FFCC] bg-[#00FFCC]/10"
                : "border-red-500/30 text-red-500 bg-red-500/10"
            }`}
          >
            <History size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h4
                className="text-[14px] text-white uppercase tracking-widest truncate font-mono"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "10px" }}
              >
                {deployment.version}
              </h4>
              <StatusBadge status={deployment.status} type={badgeType} />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#888] font-mono tracking-widest uppercase truncate">
              <span className="flex items-center gap-1">
                <GitBranch size={10} /> {deployment.branch}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="truncate max-w-[200px]">
                {deployment.commitMessage}
              </span>
            </div>
            {deployment.liveUrl ? (
              <a
                href={deployment.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-[10px] font-mono tracking-widest text-[#FFCC00] hover:text-[#00FFCC] normal-case"
              >
                <ExternalLink size={12} /> LIVE: {deployment.liveUrl}
              </a>
            ) : null}
            {rollbackError && (
              <p className="text-[9px] text-red-400 mt-2 normal-case">
                {rollbackError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 font-mono shrink-0">
          <p className="text-[10px] text-[#ccc] tracking-widest">
            {deployment.timeAgo}
          </p>
          <p className="text-[9px] text-[#555] tracking-widest uppercase">
            By {deployment.author}
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={goToLogs}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#333] text-[10px] font-bold tracking-widest uppercase text-[#00FFCC] hover:bg-[#00FFCC]/10 transition-all"
          >
            VIEW_LOGS
          </button>
          {isConfirming ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] text-[#FFCC00] font-mono uppercase">
                CONFIRM?
              </span>
              <CyberButton
                variant="primary"
                onClick={confirmRollback}
                className="px-3 py-1 text-[10px]"
              >
                YES
              </CyberButton>
              <CyberButton
                variant="neutral"
                onClick={() => setIsConfirming(false)}
                className="px-3 py-1 text-[10px]"
              >
                NO
              </CyberButton>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRollbackClick}
              disabled={!isSuccess || isRollingBack}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                !isSuccess
                  ? "border-[#333] text-[#555] cursor-not-allowed bg-[#111]"
                  : "border-[#00FFCC] text-[#00FFCC] hover:bg-[#00FFCC]/10 hover:shadow-[0_0_10px_rgba(0,255,204,0.2)]"
              }`}
            >
              {isRollingBack ? "REVERTING..." : isSuccess ? "ROLLBACK" : "UNAVAILABLE"}
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        
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
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
