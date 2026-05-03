import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Grid3X3,
  Zap,
  Layers,
  BarChart2,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Users,
  FileText,
  PanelLeft,
  Plug,
  Monitor,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import p1 from "../../assets/p1.jpeg";
import p2 from "../../assets/p2.jpeg";
import p3 from "../../assets/pf3.jpeg";
import p4 from "../../assets/pf4.jpeg";
import p5 from "../../assets/p5.jpeg";

const MenuItem = ({ icon: Icon, label, to, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300
        ${
          isActive
            ? "bg-white text-black font-bold shadow-lg"
            : "text-[#71717a] hover:text-white hover:bg-white/[0.03] hover:translate-x-1"
        }
        ${isCollapsed ? "justify-center px-0 w-[44px] h-[44px] mx-auto" : ""}
      `}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} strokeWidth={isActive ? 2.2 : 1.5} />
          {!isCollapsed && (
            <span className="text-[13.5px] tracking-tight">{label}</span>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isCollapsed, toggleSidebar, navMode, toggleNavMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const profileImages = [p1, p2, p3, p4, p5];
  const [selectedProfileImage, setSelectedProfileImage] = useState(() => {
    const saved = localStorage.getItem("selectedProfileImage");
    return saved ? parseInt(saved) : 0;
  });

  const handleProfileImageSelect = (index) => {
    setSelectedProfileImage(index);
    localStorage.setItem("selectedProfileImage", index.toString());
    setProfileDropdownOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    // Prioritize GitHub username, then display name, then email username
    return (
      user?.username ||
      user?.name ||
      user?.email?.split("@")[0] ||
      "GitHub User"
    );
  };

  const getUserEmail = () => {
    const email = user?.email || "user@example.com";
    // If it's a GitHub noreply email, show a cleaner format
    if (email.includes("@users.noreply.github.com")) {
      const username =
        user?.name || email.split("+")[1]?.split("@")[0] || "GitHub User";
      return `${username} (GitHub)`;
    }
    return email;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (navMode === "dock") return null;

  const topItems = [
    { icon: LayoutDashboard, label: "Overview", to: "/dashboard" },
    { icon: Grid3X3, label: "Applications", to: "/applications" },
    { icon: Zap, label: "Deployments", to: "/deploy" },
    { icon: Layers, label: "Environments", to: "/environments" },
    { icon: BarChart2, label: "Metrics", to: "/metrics" },
  ];

  const bottomItems = [
    { icon: Users, label: "Members", to: "/members" },
    { icon: Plug, label: "Integrations", to: "/integrations" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 92 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-50 bg-gradient-to-b from-slate-950/80 to-slate-950/60 backdrop-blur-3xl border-r border-white/5 flex flex-col"
    >
      {/* Brand Header */}
      <div
        className={`h-20 flex items-center px-6 ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-[15px] shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            V
          </div>
          {!isCollapsed && (
            <span className="text-[16px] font-bold tracking-tight text-white/90">
              Velora
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-8 scrollbar-hide">
        <div>
          {!isCollapsed && (
            <h3 className="px-4 text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.25em] mb-4">
              Workspace
            </h3>
          )}
          <div className="space-y-1">
            {topItems.map((item) => (
              <MenuItem key={item.to} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="px-4 text-[10px] font-black text-[#3f3f46] uppercase tracking-[0.25em] mb-4">
              Account
            </h3>
          )}
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <MenuItem key={item.to} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-white/[0.05]">
        <button
          onClick={toggleNavMode}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-[#71717a] hover:text-white hover:bg-white/[0.03]
            ${isCollapsed ? "justify-center px-0 w-[48px] h-[48px] mx-auto" : ""}
          `}
          title="Switch to Dock"
        >
          <Monitor size={18} strokeWidth={1.5} />
          {!isCollapsed && (
            <span className="text-[13px] font-medium">Switch to Dock</span>
          )}
        </button>

        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-[#71717a] hover:text-white hover:bg-white/[0.03]
            ${isCollapsed ? "justify-center px-0 w-[48px] h-[48px] mx-auto" : ""}
          `}
        >
          <PanelLeft
            size={18}
            strokeWidth={1.5}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
          {!isCollapsed && (
            <span className="text-[13px] font-medium">Collapse Sidebar</span>
          )}
        </button>

        {/* Profile Card */}
        <div className="relative pt-2" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full flex items-center gap-3 bg-white/3 border border-white/5 hover:bg-white/6 transition-all rounded-2xl
              ${isCollapsed ? "justify-center p-0 w-12 h-12 mx-auto" : "p-2.5"}
            `}
          >
            <div
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[12px] font-bold text-white shrink-0 relative shadow-lg cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
            >
              {profileImages[selectedProfileImage] ? (
                <img
                  src={profileImages[selectedProfileImage]}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  {getUserInitials()}
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-bold text-white truncate">
                  {getDisplayName()}
                </p>
                <p className="text-[11px] text-[#52525b] truncate">
                  {getUserEmail()}
                </p>
              </div>
            )}
          </button>

          {/* Profile Image Selection Dropdown */}
          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute bottom-full mb-3 z-50 bg-[#111113] border border-white/8 rounded-2xl shadow-2xl overflow-hidden
                  ${isCollapsed ? "left-14 w-64" : "left-0 right-0 w-64"}`}
                ref={profileDropdownRef}
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Image size={14} className="text-[#71717a]" />
                    <p className="text-[12px] font-medium text-white">
                      Choose Profile Picture
                    </p>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {profileImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleProfileImageSelect(index)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                          selectedProfileImage === index
                            ? "border-[#22c55e] shadow-lg shadow-[#22c55e]/20"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Profile ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Options Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute bottom-full mb-3 z-50 bg-[#111113] border border-white/8 rounded-2xl shadow-2xl overflow-hidden
                  ${isCollapsed ? "left-14 w-48" : "left-0 right-0"}`}
              >
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/account");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#a1a1aa] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
