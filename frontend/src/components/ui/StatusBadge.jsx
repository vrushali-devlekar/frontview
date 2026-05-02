import React from 'react';

export default function StatusBadge({ status = "ONLINE", type = "success" }) {
  const types = {
    success: { dot: "bg-valora-cyan ring-valora-cyan/30", text: "text-valora-cyan" },
    error: { dot: "bg-valora-red ring-valora-red/30", text: "text-valora-red" },
    warning: { dot: "bg-valora-yellow ring-valora-yellow/30", text: "text-valora-yellow" },
    neutral: { dot: "bg-gray-400 ring-gray-400/30", text: "text-gray-400" },
  };

  const style = types[type] || types.neutral;

  return (
    <div className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
      <span className={`w-2 h-2 rounded-full animate-pulse ring-4 ${style.dot}`}></span>
      <span className={style.text}>{status}</span>
    </div>
  );
}
