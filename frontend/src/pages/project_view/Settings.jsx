import React, { useState } from 'react';
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import { 
  Settings as SettingsIcon, 
  Trash2, 
  Key, 
  User, 
  Globe, 
  Shield, 
  AlertTriangle,
  Database,
  Cpu
} from 'lucide-react';
import heroBg from "../../assets/new-top.png";
import CyberButton from "../../components/ui/CyberButton";
import InputField from "../../components/ui/InputField";
import EnvTable from '../../components/project/EnvTable';

export default function Settings() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState("GENERAL");

  const tabs = [
    { id: "GENERAL", label: "GENERAL", icon: SettingsIcon },
    { id: "VARIABLES", label: "ENV_VARS", icon: Key },
    { id: "ADVANCED", label: "ADVANCED", icon: Cpu },
    { id: "DANGER", label: "DANGER_ZONE", icon: AlertTriangle },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-mono uppercase select-none">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        
        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4">
            <h1 className="text-xl md:text-2xl text-[#FFCC00] font-bold tracking-widest font-pixel">SETTINGS</h1>
            <p className="text-[10px] text-[#888] mt-1 tracking-widest">CONFIGURE YOUR PROJECT INFRASTRUCTURE</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* TAB SIDEBAR */}
          <div className="w-full lg:w-64 border-r border-[#222] bg-[#0a0a0a] flex flex-col">
            <div className="p-4 text-[9px] text-[#444] border-b border-[#222] tracking-widest">CONFIGURATION_TABS</div>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-[10px] tracking-widest border-l-2 transition-all ${
                        activeTab === tab.id 
                        ? "bg-[#111] border-[#FFCC00] text-[#FFCC00]" 
                        : "border-transparent text-[#666] hover:text-white hover:bg-[#050505]"
                    }`}
                >
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10" style={{ scrollbarWidth: 'none' }}>
            
            <div className="max-w-3xl">
                {activeTab === "GENERAL" && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h2 className="text-sm font-pixel text-white mb-6 border-b border-[#222] pb-2">PROJECT_INFO</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="PROJECT_DISPLAY_NAME" defaultValue="VELORA_CORE_v1" />
                                <InputField label="PRODUCTION_BRANCH" defaultValue="main" />
                                <InputField label="ROOT_DIRECTORY" defaultValue="./" />
                                <InputField label="FRAMEWORK_PRESET" defaultValue="REACT_VITE" disabled />
                            </div>
                            <CyberButton variant="primary" className="mt-8">SAVE_CHANGES</CyberButton>
                        </section>

                        <section className="bg-[#0a0a0a] border border-[#222] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe size={16} className="text-[#00FFCC]" />
                                <h3 className="text-xs font-pixel text-[#00FFCC]">DOMAIN_MANAGEMENT</h3>
                            </div>
                            <p className="text-[10px] text-[#666] mb-6">CONFIGURE PUBLIC ACCESS URLS FOR THIS MODULE.</p>
                            <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[#222] font-mono text-[11px]">
                                <span className="text-[#444]">URL:</span>
                                <span className="text-[#00FFCC]">velora-core-v1.valora.app</span>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "VARIABLES" && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="flex justify-between items-center border-b border-[#222] pb-2">
                            <h2 className="text-sm font-pixel text-white">ENVIRONMENT_VAULT</h2>
                        </div>
                        <p className="text-[10px] text-[#666] tracking-widest">INJECT ENCRYPTED KEYS INTO YOUR BUILD RUNTIME.</p>
                        <div className="bg-[#0a0a0a] border border-[#222]">
                            <EnvTable />
                        </div>
                    </div>
                )}

                {activeTab === "ADVANCED" && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h2 className="text-sm font-pixel text-white mb-6 border-b border-[#222] pb-2">BUILD_SETTINGS</h2>
                            <div className="flex flex-col gap-4">
                                <InputField label="BUILD_COMMAND" defaultValue="npm run build" />
                                <InputField label="OUTPUT_DIRECTORY" defaultValue="dist" />
                                <InputField label="INSTALL_COMMAND" defaultValue="npm install" />
                            </div>
                            <CyberButton variant="outline" className="mt-6">OVERRIDE_DEFAULTS</CyberButton>
                        </section>

                        <section className="bg-[#0a0a0a] border border-[#222] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield size={16} className="text-[#FFCC00]" />
                                <h3 className="text-xs font-pixel text-[#FFCC00]">SECURE_HEADERS</h3>
                            </div>
                            <p className="text-[10px] text-[#666] mb-4">ENABLE AUTO-SECURITY HEADERS FOR SSL TERMINATION.</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-5 bg-[#00FFCC] rounded-full relative">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                                </div>
                                <span className="text-[10px] text-white">ENABLE_HSTS_PROTOCOL</span>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "DANGER" && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-sm font-pixel text-[#FF3333] mb-2 border-b border-[#FF3333]/30 pb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> RESTRICTED_ACTIONS
                        </h2>
                        
                        <div className="bg-[#FF3333]/5 border border-[#FF3333]/20 p-6 flex flex-col gap-4">
                            <div>
                                <h3 className="text-xs text-white mb-1">ARCHIVE_PROJECT</h3>
                                <p className="text-[9px] text-[#888]">THIS WILL STOP ALL RUNNING NODES BUT KEEP THE DATA.</p>
                            </div>
                            <CyberButton variant="outline" className="w-fit border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-white">ARCHIVE_MODULE</CyberButton>
                        </div>

                        <div className="bg-[#FF3333]/5 border border-[#FF3333]/20 p-6 flex flex-col gap-4">
                            <div>
                                <h3 className="text-xs text-white mb-1">DELETE_PROJECT</h3>
                                <p className="text-[9px] text-[#888]">PERMANENTLY REMOVE THIS PROJECT AND ALL ASSOCIATED DEPLOYMENTS.</p>
                            </div>
                            <CyberButton variant="primary" className="w-fit bg-[#FF3333] text-white border-none hover:bg-red-600">DELETE_PERMANENTLY</CyberButton>
                        </div>
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
