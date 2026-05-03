import React, { useState } from "react";
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
  const { user } = useAuth();
  const [alias, setAlias] = useState(
    user?.username || user?.name || "SHERYIANS_SDE",
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setMessage({ text: "Profile updated successfully.", type: "success" });
      setIsUpdating(false);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please enter both passwords.", type: "error" });
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setMessage({ text: "Password updated successfully.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setIsUpdating(false);
    }, 1000);
  };

  // sidebarAttr removed in favor of PageWrapper inline styles

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
          <PageHeader
            title="Account"
            subtitle="Manage your profile, security, and connected services"
          />

          {/* Alert */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ── Profile card ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-fit">
                <CardHeader icon={User} title="Profile" />
                <CardBody>
                  {/* Avatar row */}
                  <div className="flex items-center gap-5 mb-7 pb-6 border-b border-white/[0.06]">
                    <div className="w-16 h-16 rounded-2xl bg-[#111113] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden">
                      {user?.githubAccessToken ? (
                        <img
                          src={`https://avatars.githubusercontent.com/${user?.githubId || "github"}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://github.com/identicons/velora.png";
                          }}
                        />
                      ) : (
                        <User size={24} className="text-[#3f3f46]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white mb-1">
                        {user?.username || user?.name || "GitHub User"}
                      </p>
                      <div className="flex items-center gap-2 mb-1">
                        {user?.authProvider === "github" && (
                          <>
                            <GithubIcon size={12} className="text-[#3f3f46]" />
                            <span className="text-[11px] text-[#22c55e]">
                              GitHub Login
                            </span>
                          </>
                        )}
                        {user?.authProvider === "google" && (
                          <>
                            <svg
                              className="w-3 h-3 text-[#3f3f46]"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            <span className="text-[11px] text-[#22c55e]">
                              Google Login
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#52525b]">
                        <Mail size={12} className="text-[#3f3f46]" />
                        {user?.email?.includes("@users.noreply.github.com")
                          ? `${user?.username || user?.email?.split("+")[1]?.split("@")[0]} (GitHub)`
                          : user?.email || "user@example.com"}
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleUpdateProfile}
                    className="flex flex-col gap-5"
                  >
                    <InputField
                      label="Display Name"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                    />
                    <GlassButton
                      type="submit"
                      variant="primary"
                      className="w-full h-10"
                    >
                      {isUpdating ? "Saving…" : "Save Changes"}
                    </GlassButton>
                  </form>
                </CardBody>
              </Card>
            </motion.div>

            {/* ── Right column ── */}
            <div className="flex flex-col gap-5">
              {/* Connected accounts */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
              >
                <Card>
                  <CardHeader icon={Shield} title="Connected Accounts" />
                  <CardBody>
                    <div className="flex items-center justify-between p-4 bg-[#0d0d0f] border border-white/[0.07] rounded-xl">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <GithubIcon size={17} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white leading-tight">
                            GitHub
                          </p>
                          <p className="text-[11px] text-[#52525b] mt-0.5">
                            Required for repo imports
                          </p>
                        </div>
                      </div>
                      {user?.githubAccessToken ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />{" "}
                          Connected
                        </span>
                      ) : (
                        <GlassButton
                          variant="secondary"
                          className="h-8 px-4 text-xs"
                        >
                          Connect
                        </GlassButton>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Change password */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.14 }}
              >
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
                      />
                      <InputField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <GlassButton
                        type="submit"
                        variant="danger"
                        className="w-full h-10 border border-[#ef4444]/20"
                      >
                        {isUpdating ? "Updating…" : "Update Password"}
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
