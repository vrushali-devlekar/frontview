import React, { useState } from 'react';
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import CyberButton from "../../components/ui/CyberButton";
import InputField from "../../components/ui/InputField";
import { Users, Mail, ShieldAlert, ShieldCheck, TerminalSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Members() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("DEVELOPER");
  const [message, setMessage] = useState("");

  const [members, setMembers] = useState([
    { id: 1, name: user?.name || "SHERYIANS_SDE", email: user?.email || "sysadmin@valora.io", role: "OWNER", status: "ACTIVE" },
    { id: 2, name: "ALEX_M", email: "alex.m@valora.io", role: "ADMIN", status: "ACTIVE" },
    { id: 3, name: "SAM_K", email: "sam.k@valora.io", role: "DEVELOPER", status: "OFFLINE" },
    { id: 4, name: "JORDAN_L", email: "jordan.l@valora.io", role: "DEVELOPER", status: "ACTIVE" }
  ]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    // Mock Invite
    setMessage(`INVITATION_SENT_TO: ${inviteEmail}`);
    setMembers([...members, {
        id: Date.now(),
        name: "PENDING_INVITE",
        email: inviteEmail,
        role: inviteRole,
        status: "PENDING"
    }]);
    setInviteEmail("");
    
    setTimeout(() => setMessage(""), 3000);
  };

  const getRoleIcon = (role) => {
    switch (role) {
        case 'OWNER': return <ShieldAlert size={14} className="text-[#FFCC00]" />;
        case 'ADMIN': return <ShieldCheck size={14} className="text-[#00FFCC]" />;
        default: return <TerminalSquare size={14} className="text-[#888]" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-sans select-none">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        <TopNav />

        <div className="flex-1 overflow-y-auto p-6 md:p-12" style={{ scrollbarWidth: 'none' }}>
            
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-pixel text-[#FFCC00] uppercase tracking-widest mb-2">ENTERPRISE_ROSTER</h1>
                    <p className="text-[10px] text-[#888] font-mono tracking-widest uppercase">MANAGE ORGANIZATION ACCESS AND DEVELOPER ROLES</p>
                </div>

                {/* Invite Section */}
                <div className="bg-[#0a0a0a] border-2 border-[#222] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail size={18} className="text-[#00FFCC]" />
                        <h2 className="font-pixel text-[12px] text-white tracking-widest">INVITE_NEW_OPERATOR</h2>
                    </div>

                    <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <InputField 
                                label="OPERATOR_EMAIL"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="developer@example.com"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-[10px] text-[#888] font-mono tracking-widest mb-2">ASSIGN_ROLE</label>
                            <select 
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] text-white font-mono text-[11px] p-3 focus:outline-none focus:border-[#FFCC00] uppercase"
                            >
                                <option value="DEVELOPER">DEVELOPER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <CyberButton type="submit" variant="primary" className="w-full md:w-auto mt-4 md:mt-0 px-6">
                            SEND_INVITE
                        </CyberButton>
                    </form>

                    {message && (
                        <div className="mt-4 p-3 bg-[#00FFCC]/10 border border-[#00FFCC] text-[#00FFCC] font-mono text-[10px] tracking-widest uppercase">
                            {message}
                        </div>
                    )}
                </div>

                {/* Team Roster Table */}
                <div className="bg-[#0a0a0a] border-2 border-[#222]">
                    <div className="flex items-center gap-3 p-6 border-b border-[#222]">
                        <Users size={18} className="text-[#FFCC00]" />
                        <h2 className="font-pixel text-[12px] text-white tracking-widest">ACTIVE_PERSONNEL ({members.length})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#222] bg-[#111]">
                                    <th className="p-4 font-mono text-[10px] text-[#888] tracking-widest uppercase">OPERATOR_ID</th>
                                    <th className="p-4 font-mono text-[10px] text-[#888] tracking-widest uppercase">EMAIL_ADDRESS</th>
                                    <th className="p-4 font-mono text-[10px] text-[#888] tracking-widest uppercase">ASSIGNED_ROLE</th>
                                    <th className="p-4 font-mono text-[10px] text-[#888] tracking-widest uppercase">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index) => (
                                    <tr key={member.id} className="border-b border-[#222]/50 hover:bg-[#111] transition-colors">
                                        <td className="p-4 font-mono text-[11px] text-white flex items-center gap-3">
                                            <div className="w-6 h-6 bg-[#222] border border-[#444] flex items-center justify-center text-[9px] text-[#888]">
                                                {index + 1}
                                            </div>
                                            {member.name}
                                        </td>
                                        <td className="p-4 font-mono text-[10px] text-[#aaa]">{member.email}</td>
                                        <td className="p-4 font-mono text-[10px] text-white">
                                            <div className="flex items-center gap-2 bg-[#050505] border border-[#333] px-2 py-1 w-max">
                                                {getRoleIcon(member.role)} {member.role}
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-[10px]">
                                            <span className={`px-2 py-1 border flex w-max items-center gap-2 ${
                                                member.status === 'ACTIVE' ? 'text-[#00FFCC] border-[#00FFCC]/30 bg-[#00FFCC]/10' :
                                                member.status === 'PENDING' ? 'text-[#FFCC00] border-[#FFCC00]/30 bg-[#FFCC00]/10' :
                                                'text-[#888] border-[#888]/30 bg-[#888]/10'
                                            }`}>
                                                {member.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-[#00FFCC]" />}
                                                {member.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}
