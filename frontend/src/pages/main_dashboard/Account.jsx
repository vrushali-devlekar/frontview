import { useEffect, useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import PageWrapper from "../../components/layout/PageWrapper";
import { useAuth } from "../../context/AuthContext";
import GlassButton from "../../components/ui/GlassButton";
import InputField from "../../components/ui/InputField";
import {
  PageShell,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  AlertBanner,
} from "../../components/layout/PageLayout";
import {
  Shield,
  Key,
  User,
  Mail,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { githubAuthUrl, updateCurrentUser, updatePassword } from "../../api/api";

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Account() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const fetchDisplayName = async () => {
      await setDisplayName(user?.username || user?.name || "");
    };
    fetchDisplayName();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const username = displayName.trim();
    if (!username) {
      setMessage({ text: "Display name is required.", type: "error" });
      return;
    }

    setIsSavingProfile(true);
    setMessage({ text: "", type: "" });
    try {
      await updateCurrentUser({ username });
      await refreshUser();
      setMessage({ text: "Profile updated successfully.", type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Profile update failed.", type: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    setIsSavingPassword(true);
    setMessage({ text: "", type: "" });
    try {
      await updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage({ text: "Password updated successfully.", type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Password update failed.", type: "error" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const avatar = user?.avatarUrl || user?.avatar;
  const name = user?.username || user?.name || "Your account";
  const email = user?.email || "No email available";

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
          <PageHeader title="Account" subtitle="Manage your real profile, security, and connected services" />

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertBanner type={message.type}>
                {message.type === "success" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertTriangle size={15} />
                )}
                {message.text}
              </AlertBanner>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="h-fit">
                <CardHeader icon={User} title="Profile" />
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-7 pb-6 border-b border-white/[0.06]">
                    <div className="w-16 h-16 rounded-2xl bg-[#111113] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-[#3f3f46]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-white mb-1 truncate">{name}</p>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#71717a] min-w-0">
                        <Mail size={12} className="text-[#3f3f46] shrink-0" />
                        <span className="truncate">{email}</span>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleUpdateProfile}
                    className="flex flex-col gap-5"
                  >
                    <InputField
                      label="Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoComplete="name"
                    />
                    <InputField
                      label="Email"
                      value={email}
                      readOnly
                      className="text-[#71717a]"
                    />
                    <GlassButton type="submit" variant="primary" className="w-full h-10" disabled={isSavingProfile}>
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </GlassButton>
                  </form>
                </CardBody>
              </Card>
            </motion.div>

            <div className="flex flex-col gap-5">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
                <Card>
                  <CardHeader icon={Shield} title="Connected Accounts" />
                  <CardBody>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#0d0d0f] border border-white/[0.07] rounded-xl">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <GithubIcon size={17} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white leading-tight">GitHub</p>
                          <p className="text-[11px] text-[#52525b] mt-0.5 truncate">Required for repo imports</p>
                        </div>
                      </div>
                      {user?.githubConnected ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Connected
                        </span>
                      ) : (
                        <GlassButton variant="secondary" className="h-8 px-4 text-xs w-full sm:w-auto" onClick={() => {
                          sessionStorage.setItem("postAuthRedirect", "/account");
                          window.location.href = githubAuthUrl;
                        }}>
                          Connect
                        </GlassButton>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.14 }}>
                <Card className="border-[#ef4444]/10">
                  <CardHeader icon={Key} title="Change Password" />
                  <CardBody>
                    <form
                      onSubmit={handlePasswordChange}
                      className="flex flex-col gap-5"
                    >
                      <InputField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                      <InputField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                      />
                      <GlassButton type="submit" variant="danger" className="w-full h-10 border border-[#ef4444]/20" disabled={isSavingPassword}>
                        {isSavingPassword ? "Updating..." : "Update Password"}
                      </GlassButton>
                    </form>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </PageShell>
      </PageWrapper>
    </div>
  );
}
