import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead, Badge, AlertBanner } from "../../components/layout/PageLayout";
import { Users, Mail, ShieldAlert, ShieldCheck, TerminalSquare, UserPlus, Trash2, ArrowRight, HardDrive, Plug, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectTeam, inviteMember, removeMember, getUserProjects } from "../../api/api";

export default function Members() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("projectId");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("DEVELOPER");
  const [message, setMessage] = useState(null); // { text, type }
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    } else {
      fetchUserProjects();
    }
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getProjectTeam(projectId);
      setMembers(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const res = await getUserProjects();
      setUserProjects(res.data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    try {
      await inviteMember(projectId, { email: inviteEmail, role: inviteRole });
      setMessage({ text: `Invitation sent to ${inviteEmail}`, type: "success" });
      setInviteEmail("");
      fetchMembers();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to send invite", type: "error" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await removeMember(projectId, memberId);
      setMessage({ text: "Member removed", type: "success" });
      fetchMembers();
    } catch (err) {
      setMessage({ text: "Failed to remove member", type: "error" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "OWNER": return { icon: ShieldAlert,    color: "text-[#ef4444]", bg: "bg-[#ef4444]/10 border-[#ef4444]/20" };
      case "ADMIN": return { icon: ShieldCheck,    color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10 border-[#3b82f6]/20" };
      default:      return { icon: TerminalSquare, color: "text-[#71717a]", bg: "bg-white/[0.04] border-white/[0.06]" };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE":  return { dot: "bg-[#22c55e]", text: "text-[#22c55e]", bg: "bg-[#22c55e]/10", label: "Active" };
      case "PENDING": return { dot: "bg-[#eab308]", text: "text-[#eab308]", bg: "bg-[#eab308]/10", label: "Pending" };
      default:        return { dot: "bg-[#3f3f46]", text: "text-[#71717a]", bg: "bg-white/[0.04]",  label: "Offline" };
    }
  };

  if (!projectId) {
    return (
      <div className="flex h-screen bg-[var(--bg-main)] text-white overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
        <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
        <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
          <TopNav />
          <div className="flex-1 p-8 lg:p-16 overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl mx-auto pt-20">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[32px] bg-[#1e1e20] border border-white/[0.04] flex items-center justify-center mb-10 shadow-elevation-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />
                  <Users className="text-[#3f3f46] group-hover:text-white transition-colors" size={32} />
                </div>
                <h2 className="text-[32px] font-black text-[#e4e4e7] mb-3 uppercase tracking-tighter leading-none">Personnel Directory</h2>
                <p className="text-[#52525b] text-[10px] font-black uppercase tracking-[0.4em] max-w-lg mb-16">
                  Collaboration is localized per project node. Select a target instance to manage personnel access and authority levels.
                </p>
                
                <div className="w-full max-w-xl grid gap-5">
                  {userProjects.length > 0 ? userProjects.map(p => (
                    <button 
                      key={p._id}
                      onClick={() => window.location.href = `/members?projectId=${p._id}`}
                      className="w-full flex items-center justify-between p-8 bg-[#1e1e20] hover:bg-white/[0.01] border border-white/[0.04] rounded-[32px] transition-all group shadow-elevation-1"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[24px] bg-[#0d0d0f] border border-white/[0.04] flex items-center justify-center text-[#3f3f46] group-hover:text-white transition-colors shadow-elevation-1">
                          <HardDrive size={24} />
                        </div>
                        <div className="text-left">
                          <span className="text-[18px] font-black text-white uppercase tracking-tighter block group-hover:text-[#22c55e] transition-colors">{p.name}</span>
                          <span className="text-[10px] text-[#3f3f46] font-black uppercase tracking-[0.2em] mt-1.5 block">ACTIVE_AUTHORITY_INSTANCE</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#0d0d0f] border border-white/[0.04] flex items-center justify-center text-[#3f3f46] group-hover:text-white group-hover:translate-x-1 transition-all">
                         <ArrowRight size={22} />
                      </div>
                    </button>
                  )) : (
                    <div className="p-20 bg-[#1e1e20] border border-dashed border-white/[0.08] rounded-[48px] text-[#3f3f46] text-[12px] font-black uppercase tracking-[0.3em]">
                      No active nodes detected in the local registry.
                    </div>
                  )}
                </div>

                <div className="mt-20">
                  <GlassButton variant="secondary" onClick={() => window.location.href = '/dashboard'} className="h-14 px-10 text-[11px] font-black uppercase tracking-[0.25em] border-white/5">
                    BACK_TO_COMMAND_CENTER
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/[0.04]">
              <div>
                <h1 className="text-[22px] font-black tracking-tighter text-[#e4e4e7] mb-2 uppercase leading-none">Personnel Registry</h1>
              </div>
              <GlassButton 
                variant="secondary" 
                className="h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em] border-white/5"
                onClick={() => window.location.href = '/members'}
              >
                SWITCH_NODE_TARGET
              </GlassButton>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {/* ── Invite card ── */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="bg-[#1e1e20] border border-white/[0.04] rounded-[32px] shadow-elevation-1 overflow-hidden">
                  <div className="px-8 py-6 border-b border-white/[0.04] flex items-center gap-5 bg-[#161618]">
                    <div className="w-8 h-8 rounded-lg bg-[#0d0d0f] border border-white/[0.06] flex items-center justify-center text-[#22c55e] shadow-elevation-1">
                      <UserPlus size={16} />
                    </div>
                    <h2 className="text-[10px] font-black text-[#52525b] uppercase tracking-[0.3em]">Authorize New Operator</h2>
                  </div>
                  <div className="p-8">
                    <AnimatePresence>
                      {message && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-10">
                          <div className={`px-8 py-5 rounded-2xl border backdrop-blur-3xl flex items-center gap-5 ${
                            message.type === "error" 
                              ? "bg-[#ef4444]/5 border-[#ef4444]/10 text-[#ef4444]" 
                              : "bg-[#22c55e]/5 border-[#22c55e]/10 text-[#22c55e]"
                          }`}>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{message.text}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-8 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-[9px] font-black text-[#3f3f46] uppercase tracking-[0.35em] mb-3">
                          Operator Identity Address
                        </label>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="operator@velora.io"
                          className="w-full h-12 px-5 bg-[#0d0d0f] border border-white/[0.04] focus:border-white/10 rounded-xl text-[11px] font-mono text-white placeholder:text-[#2d2d33] transition-all focus:outline-none shadow-inner"
                        />
                      </div>
                      <div className="w-full md:w-56">
                        <label className="block text-[9px] font-black text-[#3f3f46] uppercase tracking-[0.35em] mb-3">
                          Authority Level
                        </label>
                        <div className="relative group">
                          <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="w-full h-12 px-5 pr-10 bg-[#0d0d0f] border border-white/[0.04] focus:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white appearance-none focus:outline-none transition-all cursor-pointer shadow-inner"
                          >
                            <option value="DEVELOPER" className="bg-[#111113]">Developer</option>
                            <option value="ADMIN" className="bg-[#111113]">Administrator</option>
                            <option value="VIEWER" className="bg-[#111113]">Auditor</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3f3f46] pointer-events-none" />
                        </div>
                      </div>
                      <GlassButton type="submit" variant="primary" className="h-12 px-8 shrink-0 w-full md:w-auto text-[9px] font-black uppercase tracking-[0.25em] shadow-elevation-2">
                        Dispatch_Authorization
                      </GlassButton>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* ── Members table ── */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="bg-[#1e1e20] border border-white/[0.04] rounded-[40px] shadow-elevation-1 overflow-hidden">
                  <div className="px-8 py-6 border-b border-white/[0.04] flex items-center justify-between bg-[#161618]">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-xl bg-[#0d0d0f] border border-white/[0.06] flex items-center justify-center text-[#52525b] shadow-elevation-1">
                        <Users size={18} />
                      </div>
                      <h2 className="text-[10px] font-black text-[#52525b] uppercase tracking-[0.3em]">Personnel Registry</h2>
                    </div>
                    <span className="px-4 py-1.5 rounded-xl bg-[#0d0d0f] border border-white/[0.04] text-[9px] font-black text-[#3f3f46] uppercase tracking-[0.2em] shadow-inner">{members.length} Units_Active</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#0d0d0f]/20">
                          {["OPERATOR", "REGISTRY_ADDRESS", "AUTHORITY_LEVEL", "INSTANCE_STATUS", "TERMINATION"].map(h => (
                            <th key={h} className="px-10 py-6 text-left text-[9px] font-black text-[#3f3f46] uppercase tracking-[0.35em] border-b border-white/[0.02]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {loading ? (
                          [1, 2].map(i => (
                            <tr key={i} className="animate-pulse">
                              <td colSpan="5" className="px-10 py-8 h-28 bg-white/[0.01]" />
                            </tr>
                          ))
                        ) : members.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-10 py-20 text-center text-[#3f3f46] text-[11px] font-black uppercase tracking-[0.4em]">Awaiting personnel synchronization...</td>
                          </tr>
                        ) : members.map((member) => {
                          const roleConf = getRoleConfig(member.role);
                          const statusConf = getStatusConfig(member.status);
                          const RoleIcon = roleConf.icon;
                          const memberName = member.userId?.username || "PENDING_INVITE";
                          const memberEmail = member.email;

                          return (
                            <tr key={member._id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-5">
                                  {member.userId?.avatarUrl ? (
                                    <img src={member.userId.avatarUrl} className="w-12 h-12 rounded-xl object-cover border border-white/[0.06] shadow-elevation-1" alt="" />
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-[#0d0d0f] border border-white/[0.06] flex items-center justify-center text-[11px] font-black text-[#1e1e20] group-hover:text-white shrink-0 shadow-elevation-1 transition-colors">
                                      {memberName.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[14px] font-black text-[#e4e4e7] uppercase tracking-tighter leading-tight group-hover:text-[#22c55e] transition-colors">{memberName}</p>
                                    <p className="text-[8px] text-[#3f3f46] font-black uppercase tracking-[0.2em] mt-1.5">ID_NODE_ACTIVE</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-3 text-[11px] font-mono text-[#52525b] group-hover:text-white transition-colors">
                                  <Mail size={13} className="text-[#1e1e20] group-hover:text-[#3f3f46] transition-colors" />
                                  {memberEmail}
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <span className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl text-[9px] font-black border uppercase tracking-widest shadow-elevation-1 ${roleConf.bg} ${roleConf.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                  <RoleIcon size={14} /> {member.role}
                                </span>
                              </td>
                              <td className="px-10 py-8">
                                <span className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-elevation-1 ${statusConf.bg} ${statusConf.text} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConf.dot}`} />
                                  {statusConf.label}
                                </span>
                              </td>
                              <td className="px-10 py-8">
                                <button 
                                  onClick={() => handleRemove(member._id)}
                                  disabled={member.role === 'OWNER'}
                                  className="w-12 h-12 rounded-2xl bg-[#0d0d0f] border border-white/[0.04] flex items-center justify-center text-[#1e1e20] hover:text-[#ef4444] transition-all disabled:opacity-0 shadow-elevation-1 group-hover:text-[#3f3f46]"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}