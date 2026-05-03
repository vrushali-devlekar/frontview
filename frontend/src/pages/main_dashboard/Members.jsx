import { useEffect, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, CardHeader, CardBody, TableHead, Badge, AlertBanner, EmptyState } from "../../components/layout/PageLayout";
import { Users, Mail, ShieldAlert, ShieldCheck, TerminalSquare, UserPlus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { getWorkspaceMembers, inviteWorkspaceMember } from "../../api/api";

export default function Members() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("DEVELOPER");
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await getWorkspaceMembers();
      setMembers(response.data?.data || []);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to load members.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMembers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;

    setIsInviting(true);
    setMessage({ text: "", type: "success" });
    try {
      const response = await inviteWorkspaceMember({ email, role: inviteRole });
      const invite = response.data?.data;
      setMembers((current) => {
        const next = current.filter((member) => String(member.id) !== String(invite?.id) && member.email !== invite?.email);
        return invite ? [...next, invite] : next;
      });
      setInviteEmail("");
      setMessage({ text: `Invitation sent to ${email}.`, type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to send invitation.", type: "error" });
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "OWNER": return { icon: ShieldAlert, color: "text-[#ef4444]", bg: "bg-[#ef4444]/10 border-[#ef4444]/20" };
      case "ADMIN": return { icon: ShieldCheck, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10 border-[#3b82f6]/20" };
      default: return { icon: TerminalSquare, color: "text-[#71717a]", bg: "bg-white/[0.04] border-white/[0.06]" };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE": return { dot: "bg-[#22c55e]", text: "text-[#22c55e]", bg: "bg-[#22c55e]/10", label: "Active" };
      case "PENDING": return { dot: "bg-[#eab308]", text: "text-[#eab308]", bg: "bg-[#eab308]/10", label: "Pending" };
      default: return { dot: "bg-[#3f3f46]", text: "text-[#71717a]", bg: "bg-white/[0.04]", label: String(status || "Inactive") };
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        navMode={navMode}
        toggleNavMode={toggleNavMode}
      />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Members" subtitle="Manage organization access and developer roles">
            <GlassButton variant="secondary" className="gap-2" onClick={fetchMembers} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} /> Refresh
            </GlassButton>
          </PageHeader>

          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader icon={UserPlus} title="Invite New Member" />
                <CardBody>
                  {message.text && <AlertBanner type={message.type}>{message.text}</AlertBanner>}
                  <form onSubmit={handleInvite} className="flex flex-col lg:flex-row gap-4 lg:items-end">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-green-200 uppercase tracking-[0.1em] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="developer@example.com"
                        className="w-full h-11 px-4 bg-transparent backdrop-blur-md border border-green-500 rounded-xl text-[13px] text-white placeholder:text-green-300 focus:outline-none focus:border-green-400 transition-colors"
                      />
                    </div>
                    <div className="w-full lg:w-44">
                      <label className="block text-[11px] font-semibold text-[#52525b] uppercase tracking-[0.1em] mb-2">
                        Role
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full h-11 px-4 bg-[#09090b] border border-white/[0.08] rounded-xl text-[13px] text-white focus:outline-none focus:border-white/[0.18] transition-colors"
                      >
                        <option value="DEVELOPER">Developer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <GlassButton type="submit" variant="primary" className="h-10 px-6 shrink-0 w-full lg:w-auto" disabled={isInviting}>
                      {isInviting ? "Sending..." : "Send Invite"}
                    </GlassButton>
                  </form>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card noPad>
                <CardHeader icon={Users} title="Team Members">
                  <Badge className="bg-white/10 backdrop-blur-md border border-white/20">
                    {members.length} users
                  </Badge>
                </CardHeader>
                {members.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <TableHead cols={["Member", "Email", "Role", "Status"]} />
                      <tbody className="divide-y divide-white/[0.04]">
                        {members.map((member) => {
                          const roleConf = getRoleConfig(member.role);
                          const statusConf = getStatusConfig(member.status);
                          const RoleIcon = roleConf.icon;
                          const memberName = member.name || member.email || "Member";
                          return (
                            <tr key={member.id || member.email} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-7 py-5">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                                    {memberName.charAt(0).toUpperCase()}
                                  </div>
                                  <p className="text-[13px] font-semibold text-white leading-tight truncate">{memberName}</p>
                                </div>
                              </td>
                              <td className="px-7 py-5">
                                <div className="flex items-center gap-1.5 text-[13px] text-[#71717a] min-w-0">
                                  <Mail size={12} className="text-[#3f3f46] shrink-0" />
                                  <span className="truncate">{member.email}</span>
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
                ) : (
                  <EmptyState icon={Users} title={isLoading ? "Loading members..." : "No members yet"} subtitle={isLoading ? "" : "Invited members will appear here."} />
                )}
              </Card>
            </motion.div>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
