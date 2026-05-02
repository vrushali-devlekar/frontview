import React, { useState } from 'react';
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import { useAuth } from "../../context/AuthContext";
import CyberButton from "../../components/ui/CyberButton";
import InputField from "../../components/ui/InputField";
import { Shield, Key, User, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import api from "../../api/api"; // For password updates if needed

const Github = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Account() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  
  const [alias, setAlias] = useState(user?.name || "SHERYIANS_SDE");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    // Mock update profile
    setTimeout(() => {
      setMessage({ text: "PROFILE_UPDATED_SUCCESSFULLY", type: "success" });
      setIsUpdating(false);
    }, 1000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
        setMessage({ text: "PLEASE_ENTER_BOTH_PASSWORDS", type: "error" });
        return;
    }
    setIsUpdating(true);
    try {
        // Mocking backend update for now as requested
        // await api.post('/auth/update-password', { currentPassword, newPassword });
        setTimeout(() => {
            setMessage({ text: "CREDENTIALS_UPDATED_SECURELY", type: "success" });
            setCurrentPassword("");
            setNewPassword("");
            setIsUpdating(false);
        }, 1000);
    } catch (err) {
        setMessage({ text: "AUTHENTICATION_FAILED", type: "error" });
        setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-sans select-none">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        <TopNav />

        <div className="flex-1 overflow-y-auto p-6 md:p-12" style={{ scrollbarWidth: 'none' }}>
            
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-pixel text-[#FFCC00] uppercase tracking-widest mb-2">OPERATOR_PROFILE</h1>
                    <p className="text-[10px] text-[#888] font-mono tracking-widest uppercase">IDENTITY & ACCESS MANAGEMENT DASHBOARD</p>
                </div>

                {message.text && (
                    <div className={`p-4 border font-mono text-[10px] tracking-widest uppercase flex items-center gap-2 ${message.type === 'success' ? 'bg-[#00FFCC]/10 border-[#00FFCC] text-[#00FFCC]' : 'bg-[#FF3333]/10 border-[#FF3333] text-[#FF3333]'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Identity Section */}
                    <div className="bg-[#0a0a0a] border-2 border-[#222] p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
                            <User size={18} className="text-[#00FFCC]" />
                            <h2 className="font-pixel text-[12px] text-white tracking-widest">OPERATOR_IDENTITY</h2>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-[#111] border-2 border-[#00FFCC] p-1 flex items-center justify-center shrink-0">
                                {user?.githubAccessToken ? (
                                    <img src={`https://avatars.githubusercontent.com/${user?.githubId || 'github'}`} alt="Avatar" className="w-full h-full object-cover grayscale mix-blend-luminosity" onError={(e) => {e.target.src = "https://github.com/identicons/sheryians.png"}} />
                                ) : (
                                    <User size={32} className="text-[#555]" />
                                )}
                            </div>
                            <div>
                                <p className="font-mono text-[10px] text-[#666] tracking-widest uppercase mb-1">REGISTERED_EMAIL</p>
                                <p className="font-mono text-sm text-[#ccc] flex items-center gap-2"><Mail size={12}/> {user?.email || "sysadmin@valora.io"}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                            <InputField 
                                label="OPERATOR_ALIAS (USERNAME)"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                            />
                            <CyberButton type="submit" variant="primary" className="w-full mt-2">
                                {isUpdating ? 'UPDATING...' : 'UPDATE_IDENTITY'}
                            </CyberButton>
                        </form>
                    </div>

                    {/* Security & Access Section */}
                    <div className="flex flex-col gap-8">
                        
                        {/* OAuth Links */}
                        <div className="bg-[#0a0a0a] border-2 border-[#222] p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
                                <Shield size={18} className="text-[#FFCC00]" />
                                <h2 className="font-pixel text-[12px] text-white tracking-widest">EXTERNAL_CONNECTIONS</h2>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#050505] border border-[#222]">
                                <div className="flex items-center gap-3">
                                    <Github size={20} className="text-white" />
                                    <div>
                                        <p className="font-mono text-[11px] text-white tracking-widest uppercase">GITHUB_OAUTH</p>
                                        <p className="font-mono text-[9px] text-[#666]">Required for repo imports</p>
                                    </div>
                                </div>
                                {user?.githubAccessToken ? (
                                    <span className="text-[9px] font-bold font-mono text-[#00FFCC] border border-[#00FFCC]/30 bg-[#00FFCC]/10 px-2 py-1 tracking-widest">CONNECTED</span>
                                ) : (
                                    <CyberButton variant="outline" className="text-[10px] py-1 px-3">CONNECT</CyberButton>
                                )}
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="bg-[#0a0a0a] border-2 border-[#222] p-6">
                            <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
                                <Key size={18} className="text-[#FF3333]" />
                                <h2 className="font-pixel text-[12px] text-white tracking-widest">SECURITY_CREDENTIALS</h2>
                            </div>

                            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                                <InputField 
                                    label="CURRENT_PASSWORD"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <InputField 
                                    label="NEW_PASSWORD"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <CyberButton type="submit" variant="outline" className="w-full mt-2 border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-white">
                                    {isUpdating ? 'ENCRYPTING...' : 'UPDATE_PASSWORD'}
                                </CyberButton>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
