import { useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import {
  Search,
  MoreVertical,
  GitBranch,
  Layers,
  Plus,
  ExternalLink,
  Check,
  ChevronDown,
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import CyberButton from "../../components/ui/CyberButton";

const StatusBadge = ({ status }) => {
  const styles = {
    ACTIVE: "text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10",
    INACTIVE: "text-[#FFCC00] border-[#FFCC00]/30 bg-[#FFCC00]/10",
    ARCHIVED: "text-[#888] border-[#888]/30 bg-[#888]/10",
  };
  const normalized = status.toUpperCase();
  return (
    <span className={`text-[9px] px-2 py-0.5 border font-mono tracking-widest flex items-center gap-1 ${styles[normalized] || styles.INACTIVE}`}>
      <span className={`w-1 h-1 rounded-full ${normalized === 'ACTIVE' ? 'bg-[#00FFCC]' : normalized === 'INACTIVE' ? 'bg-[#FFCC00]' : 'bg-[#555]'}`}></span>
      {normalized}
    </span>
  );
};

export default function Environments() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");

  const environments = [
    { id: 1, name: "PRODUCTION_CLUSTER", tag: "PROD", project: "AUTH_SERVICE_CORE", branch: "main", variables: 12, status: "Active" },
    { id: 2, name: "STAGING_STAGING_v2", tag: "STAGING", project: "AUTH_SERVICE_CORE", branch: "develop", variables: 8, status: "Active" },
    { id: 3, name: "DEV_INSTANCE_1", tag: "DEV", project: "FRONTEND_DASHBOARD", branch: "main", variables: 10, status: "Active" },
    { id: 4, name: "PREVIEW_PR_144", tag: "PREVIEW", project: "PAYMENT_GATEWAY", branch: "feat/checkout", variables: 6, status: "Inactive" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-mono uppercase tracking-wide">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        
        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest font-pixel">ENV_VAULT</h1>
              <p className="text-[10px] text-[#888] mt-1 tracking-widest">SECURE INFRASTRUCTURE CONFIGURATIONS</p>
            </div>
            <CyberButton variant="primary">
                <Plus size={14} className="mr-2" /> NEW_ENVIRONMENT
            </CyberButton>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#222]">
            <h2 className="text-sm text-[#888] flex items-center gap-2 font-bold">
              <Layers size={14} /> ACTIVE_ENVIRONMENTS ({environments.length})
            </h2>
            
            <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input 
                    type="text"
                    placeholder="FILTER_ENVIRONMENTS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] text-[10px] py-2 pl-10 pr-4 focus:border-[#FFCC00] outline-none transition-colors"
                />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border-2 border-[#222]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[9px]">
                        <thead>
                            <tr className="bg-[#111] text-[#666] tracking-widest uppercase">
                                <th className="p-4 font-bold">ENV_NAME</th>
                                <th className="p-4 font-bold">ASSOCIATED_PROJECT</th>
                                <th className="p-4 font-bold">BRANCH</th>
                                <th className="p-4 font-bold">VARS_COUNT</th>
                                <th className="p-4 font-bold">STATUS</th>
                                <th className="p-4 font-bold">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {environments.map((env) => (
                                <tr key={env.id} className="border-b border-[#111] hover:bg-[#050505] group">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold mb-1">{env.name}</span>
                                            <span className="text-[8px] text-[#444]">{env.tag}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#888]">{env.project}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-valora-yellow">
                                            <GitBranch size={10} /> {env.branch}
                                        </div>
                                    </td>
                                    <td className="p-4 text-white font-bold">{env.variables}</td>
                                    <td className="p-4">
                                        <StatusBadge status={env.status} />
                                    </td>
                                    <td className="p-4">
                                        <button className="p-2 text-[#444] hover:text-[#FFCC00] transition-colors">
                                            <MoreVertical size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
          </div>

          {/* SECURITY FOOTER */}
          <div className="mt-8 p-6 bg-[#0a0a0a] border border-[#222] flex items-center gap-6">
              <div className="w-12 h-12 border-2 border-[#00FFCC] flex items-center justify-center shrink-0">
                  <Check size={20} className="text-[#00FFCC]" />
              </div>
              <div>
                  <h3 className="text-xs font-pixel text-[#00FFCC] mb-1">ENCRYPTED_VAULT_ENABLED</h3>
                  <p className="text-[9px] text-[#555] tracking-widest leading-relaxed">ALL ENVIRONMENT VARIABLES ARE AES-256 ENCRYPTED BEFORE STORAGE. ACCESS IS RESTRICTED TO AUTHORIZED OPERATORS ONLY.</p>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
