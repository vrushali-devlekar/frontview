import React, { useEffect, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead, Badge, AlertBanner, EmptyState } from "../../components/layout/PageLayout";
import { Users, Mail, ShieldAlert, ShieldCheck, TerminalSquare, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { getWorkspaceMembers, inviteWorkspaceMember } from "../../api/api";

export default function Members() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("DEVELOPER");
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getWorkspaceMembers();
        if (!cancelled) {
          setMembers(response.data?.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage({ text: error.response?.data?.message || "Failed to load members", type: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setIsInviting(true);
      const response = await inviteWorkspaceMember({ email: inviteEmail, role: inviteRole });
      const invitedMember = response.data?.data;

      if (invitedMember) {
        setMembers((prev) => {
          const withoutDuplicate = prev.filter((member) => member.email !== invitedMember.email);
          return [invitedMember, ...withoutDuplicate];
        });
      }

      setMessage({ text: `Invitation sent to ${inviteEmail}`, type: "success" });
      setInviteEmail("");
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to send invite", type: "error" });
    } finally {
      setIsInviting(false);
      window.setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    }
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

  // sidebarAttr removed in favor of PageWrapper inline styles

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Members" subtitle="Manage organization access and developer roles" />

          <div className="space-y-5">
            {/* ── Invite card ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card>
                <CardHeader icon={UserPlus} title="Invite New Member" />
                <CardBody>
                  {message.text && <AlertBanner type={message.type}>{message.text}</AlertBanner>}
                  <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
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
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] text-[9px] pointer-events-none">▼</span>
                      </div>
                    </div>
                    <GlassButton type="submit" variant="primary" className="h-10 px-6 shrink-0" disabled={isInviting}>
                      {isInviting ? "Sending..." : "Send Invite"}
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
                {loading ? (
                  <div className="px-7 py-10 text-[13px] text-[#71717a]">Loading members...</div>
                ) : members.length === 0 ? (
                  <EmptyState icon={Users} title="No members yet" subtitle="Invite collaborators and they will appear here." />
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <TableHead cols={["Member", "Email", "Role", "Status"]} />
                    <tbody className="divide-y divide-white/[0.04]">
                      {members.map((member) => {
                        const roleConf = getRoleConfig(member.role);
                        const statusConf = getStatusConfig(member.status);
                        const RoleIcon = roleConf.icon;
                        return (
                          <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                                  {(member.name || member.email || "U").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[13px] font-semibold text-white leading-tight">{member.name || "Pending Invite"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-1.5 text-[13px] text-[#71717a]">
                                <Mail size={12} className="text-[#3f3f46] shrink-0" />
                                {member.email}
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}
              </Card>
            </motion.div>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
