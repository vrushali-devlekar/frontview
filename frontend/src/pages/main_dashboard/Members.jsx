import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead, Badge, AlertBanner } from "../../components/layout/PageLayout";
import { Users, Mail, ShieldAlert, ShieldCheck, TerminalSquare, UserPlus, Trash2, ArrowRight, HardDrive, Plug } from "lucide-react";
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
      <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
        <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
        <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
          <TopNav />
          <PageShell>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 pt-12">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
                <Users className="text-[#52525b]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Select a Project First</h2>
              <p className="text-[#71717a] text-[15px] max-w-md leading-relaxed mb-10">
                Team members are managed per project. Please select a project to manage its collaborators.
              </p>
              
              <div className="w-full max-w-md grid grid-cols-1 gap-3">
                {userProjects.length > 0 ? userProjects.map(p => (
                  <button 
                    key={p._id}
                    onClick={() => window.location.href = `/members?projectId=${p._id}`}
                    className="flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors">
                        <HardDrive size={16} />
                      </div>
                      <span className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">{p.name}</span>
                    </div>
                    <ArrowRight size={16} className="text-[#3f3f46] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                )) : (
                  <div className="p-8 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl text-[#52525b] text-sm">
                    No projects found. Create one first.
                  </div>
                )}
              </div>
            </div>
          </PageShell>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader 
            title="Members" 
            subtitle="Manage organization access and developer roles"
          >
            <GlassButton 
              variant="secondary" 
              className="h-8 px-3 text-[11px] font-bold"
              onClick={() => window.location.href = '/members'}
            >
              Change Project
            </GlassButton>
          </PageHeader>

          <div className="space-y-5">
            {/* ── Invite card ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader icon={UserPlus} title="Invite New Member" />
                <CardBody>
                  <AnimatePresence>
                    {message && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                        <AlertBanner type={message.type}>{message.text}</AlertBanner>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.1em] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="developer@example.com"
                        className="w-full h-11 px-4 bg-[#09090b] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder:text-[#3f3f46] focus:outline-none focus:border-white/[0.18] transition-colors"
                      />
                    </div>
                    <div className="w-full md:w-44">
                      <label className="block text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.1em] mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          className="w-full h-11 px-4 pr-8 bg-[#09090b] border border-white/[0.08] rounded-xl text-[13px] text-white appearance-none focus:outline-none focus:border-white/[0.18] transition-colors"
                        >
                          <option value="DEVELOPER">Developer</option>
                          <option value="ADMIN">Admin</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] text-[9px] pointer-events-none">▼</span>
                      </div>
                    </div>
                    <GlassButton type="submit" variant="primary" className="h-11 px-6 shrink-0 w-full md:w-auto">
                      Send Invite
                    </GlassButton>
                  </form>
                </CardBody>
              </Card>
            </motion.div>

            {/* ── Members table ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card noPad>
                <CardHeader icon={Users} title="Team Members">
                  <Badge>{members.length} users</Badge>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <TableHead cols={["Member", "Email", "Role", "Status", "Actions"]} />
                    <tbody className="divide-y divide-white/[0.04]">
                      {loading ? (
                        [1, 2].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan="5" className="px-7 py-5 h-20 bg-white/[0.01]" />
                          </tr>
                        ))
                      ) : members.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-7 py-10 text-center text-[#52525b] text-sm">No members found</td>
                        </tr>
                      ) : members.map((member) => {
                        const roleConf = getRoleConfig(member.role);
                        const statusConf = getStatusConfig(member.status);
                        const RoleIcon = roleConf.icon;
                        const memberName = member.userId?.username || "Invite Pending";
                        const memberEmail = member.email;

                        return (
                          <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-3">
                                {member.userId?.avatarUrl ? (
                                  <img src={member.userId.avatarUrl} className="w-9 h-9 rounded-full object-cover border border-white/[0.07]" alt="" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                                    {memberName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-[13px] font-semibold text-white leading-tight">{memberName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-1.5 text-[13px] text-[#71717a]">
                                <Mail size={12} className="text-[#3f3f46] shrink-0" />
                                {memberEmail}
                              </div>
                            </td>
                            <td className="px-7 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${roleConf.bg} ${roleConf.color}`}>
                                <RoleIcon size={11} /> {member.role}
                              </span>
                            </td>
                            <td className="px-7 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${statusConf.bg} ${statusConf.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConf.dot}`} />
                                {statusConf.label}
                              </span>
                            </td>
                            <td className="px-7 py-5">
                              <button 
                                onClick={() => handleRemove(member._id)}
                                disabled={member.role === 'OWNER'}
                                className="p-2 rounded-lg text-[#3f3f46] hover:text-[#ef4444] hover:bg-red-500/10 transition-all disabled:opacity-0"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}