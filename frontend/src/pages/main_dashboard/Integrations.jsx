import React, { useState } from 'react';
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import CyberButton from "../../components/ui/CyberButton";
import { Database, MessageSquare, Zap, HardDrive, CheckCircle2 } from "lucide-react";

export default function Integrations() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState([]);

  const integrations = [
    {
        id: 'mongodb',
        name: 'MongoDB Atlas',
        description: 'Auto-provision a cloud database and inject MONGO_URI into your active projects.',
        icon: Database,
        color: 'text-[#47A248]',
        borderColor: 'border-[#47A248]',
        type: 'Database'
    },
    {
        id: 'redis',
        name: 'Upstash Redis',
        description: 'Serverless Redis caching. Injects REDIS_URL and REDIS_TOKEN directly.',
        icon: HardDrive,
        color: 'text-[#FF4438]',
        borderColor: 'border-[#FF4438]',
        type: 'Cache'
    },
    {
        id: 'slack',
        name: 'Slack Alerts',
        description: 'Send deployment success/failure notifications to your team channel.',
        icon: MessageSquare,
        color: 'text-[#E01E5A]',
        borderColor: 'border-[#E01E5A]',
        type: 'Communication'
    },
    {
        id: 'discord',
        name: 'Discord Webhooks',
        description: 'Stream live build logs and deployment status directly to Discord.',
        icon: Zap,
        color: 'text-[#5865F2]',
        borderColor: 'border-[#5865F2]',
        type: 'Communication'
    }
  ];

  const handleConnect = (id) => {
    setConnecting(id);
    // Mock connecting to 3rd party and provisioning
    setTimeout(() => {
        setConnecting(null);
        if (!connected.includes(id)) {
            setConnected([...connected, id]);
        }
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-sans select-none">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        <TopNav />

        <div className="flex-1 overflow-y-auto p-6 md:p-12" style={{ scrollbarWidth: 'none' }}>
            
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-pixel text-[#FFCC00] uppercase tracking-widest mb-2">APP_MARKETPLACE</h1>
                    <p className="text-[10px] text-[#888] font-mono tracking-widest uppercase">INTEGRATE EXTERNAL SERVICES DIRECTLY INTO YOUR WORKFLOW</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {integrations.map((app) => {
                        const isConnected = connected.includes(app.id);
                        const isConnecting = connecting === app.id;
                        
                        return (
                            <div key={app.id} className="bg-[#0a0a0a] border-2 border-[#222] hover:border-[#444] transition-colors p-6 flex flex-col relative group">
                                <div className="absolute top-4 right-4 text-[9px] font-mono tracking-widest uppercase text-[#555] border border-[#222] px-2 py-1">
                                    {app.type}
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 flex items-center justify-center border-2 bg-[#111] ${app.borderColor}`}>
                                        <app.icon className={`${app.color}`} size={24} />
                                    </div>
                                    <h3 className="font-pixel text-[14px] text-white tracking-widest">{app.name}</h3>
                                </div>
                                
                                <p className="font-mono text-[11px] text-[#888] leading-relaxed mb-6 flex-1">
                                    {app.description}
                                </p>
                                
                                <div className="border-t border-[#222] pt-4 mt-auto flex justify-between items-center">
                                    <span className="font-mono text-[9px] text-[#555] tracking-widest">AUTO_INJECT_ENV</span>
                                    
                                    {isConnected ? (
                                        <div className="flex items-center gap-2 text-[#00FFCC] font-mono text-[10px] tracking-widest border border-[#00FFCC]/30 bg-[#00FFCC]/10 px-3 py-2">
                                            <CheckCircle2 size={14} /> CONNECTED
                                        </div>
                                    ) : (
                                        <CyberButton 
                                            variant="outline" 
                                            onClick={() => handleConnect(app.id)}
                                            className="px-4 py-2"
                                            disabled={isConnecting}
                                        >
                                            {isConnecting ? 'PROVISIONING...' : 'CONNECT'}
                                        </CyberButton>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
