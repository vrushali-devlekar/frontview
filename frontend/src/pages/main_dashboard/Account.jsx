import React, { useState } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import TopNav from "../../components/layout/TopNav";
import PageWrapper from "../../components/layout/PageWrapper";
import { useAuth } from "../../context/AuthContext";
import GlassButton from "../../components/ui/GlassButton";
import InputField from "../../components/ui/InputField";
import { PageShell, PageHeader, Card, CardHeader, CardBody, AlertBanner } from "../../components/layout/PageLayout";
import { Shield, Key, User, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AVATAR_ASSET_MAP, DEFAULT_AVATAR_SRC, resolveAvatarSrc } from "../../utils/avatars";

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Account() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const { user, avatar, updateAvatar } = useAuth();
  const [alias, setAlias] = useState(user?.name || "SHERYIANS_SDE");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const availableAvatars = ["pf1.jpeg", "pf2.jpeg", "pf3.jpeg", "pf4.jpeg", "pf5.jpeg"];
  const avatarSrc = resolveAvatarSrc(avatar || user?.avatar || user?.avatarUrl);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => { setMessage({ text: "Profile updated successfully.", type: "success" }); setIsUpdating(false); }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) { setMessage({ text: "Please enter both passwords.", type: "error" }); return; }
    setIsUpdating(true);
    setTimeout(() => {
      setMessage({ text: "Password updated successfully.", type: "success" });
      setCurrentPassword(""); setNewPassword(""); setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader title="Account" subtitle="Manage your profile, security, and connected services" />

          {/* Alert */}
          {message.text && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <AlertBanner type={message.type}>
                {message.type === "success" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                {message.text}
              </AlertBanner>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── Profile card ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="h-fit overflow-visible">
                <CardHeader icon={User} title="Profile" />
                <CardBody>
                  {/* Avatar row */}
                  <div className="flex items-center gap-5 mb-7 pb-6 border-b border-white/[0.06] relative">
                    <div 
                      className="w-16 h-16 rounded-2xl bg-[#111113] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:ring-2 ring-white/20 transition-all group relative"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    >
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_AVATAR_SRC;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-bold">CHANGE</span>
                      </div>
                    </div>
                    
                    {/* Avatar Picker Modal */}
                    {showAvatarPicker && (
                      <div className="absolute top-20 left-0 bg-[#111113] border border-white/[0.1] rounded-xl p-3 shadow-2xl z-50 flex gap-2">
                        {availableAvatars.map((av) => (
                          <div 
                            key={av} 
                            className={`w-12 h-12 rounded-lg cursor-pointer overflow-hidden border-2 transition-all ${avatar === av ? 'border-[#22c55e]' : 'border-transparent hover:border-white/20'}`}
                            onClick={() => { updateAvatar(av); setShowAvatarPicker(false); }}
                          >
                            <img src={AVATAR_ASSET_MAP[av]} alt={av} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div>
                      <p className="text-[14px] font-bold text-white mb-1">{user?.name || "Operator"}</p>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#52525b]">
                        <Mail size={12} className="text-[#3f3f46]" />
                        {user?.email || "sysadmin@velora.io"}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                    <InputField
                      label="Display Name"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                    />
                    <GlassButton type="submit" variant="primary" className="w-full h-10">
                      {isUpdating ? "Saving…" : "Save Changes"}
                    </GlassButton>
                  </form>
                </CardBody>
              </Card>
            </motion.div>

            {/* ── Right column ── */}
            <div className="flex flex-col gap-5">

              {/* Connected accounts */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 }}>
                <Card>
                  <CardHeader icon={Shield} title="Connected Accounts" />
                  <CardBody>
                    <div className="flex items-center justify-between p-4 bg-[#0d0d0f] border border-white/[0.07] rounded-xl">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <GithubIcon size={17} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white leading-tight">GitHub</p>
                          <p className="text-[11px] text-[#52525b] mt-0.5">Required for repo imports</p>
                        </div>
                      </div>
                      {user?.githubAccessToken ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Connected
                        </span>
                      ) : (
                        <GlassButton variant="secondary" className="h-8 px-4 text-xs">Connect</GlassButton>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Change password */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.14 }}>
                <Card className="border-[#ef4444]/10">
                  <CardHeader icon={Key} title="Change Password" />
                  <CardBody>
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
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
                      <GlassButton type="submit" variant="danger" className="w-full h-10 border border-[#ef4444]/20">
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
