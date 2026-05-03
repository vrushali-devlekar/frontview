import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, User, Settings, FileText, ChevronDown, Loader2, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../ui/BrandLogo";
import { useAuth } from "../../context/AuthContext";
import { getWorkspaceNotifications, logout as logoutRequest, searchWorkspace } from "../../api/api";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const routeLabels = {
  "/dashboard": "Overview",
  "/applications": "Applications",
  "/deploy": "Deployments",
  "/environments": "Environments",
  "/metrics": "Metrics",
  "/members": "Members",
  "/integrations": "Integrations",
  "/settings": "Settings",
  "/documentation": "Documentation",
  "/account": "Account",
  "/projects/new": "New Project",
};

const typeStyles = {
  success: "text-[#22c55e]",
  error: "text-[#ef4444]",
  warning: "text-[#eab308]",
  info: "text-[#60a5fa]",
};

const TopNav = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const pageLabel = routeLabels[location.pathname] ?? "";
  const initials = (user?.username || user?.name || "V").charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let ignore = false;

    const runSearch = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      try {
        const { data } = await searchWorkspace(debouncedSearch.trim());
        if (!ignore) {
          setSearchResults(data?.data || []);
        }
      } catch (error) {
        if (!ignore) {
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setSearchLoading(false);
        }
      }
    };

    void runSearch();
    return () => {
      ignore = true;
    };
  }, [debouncedSearch]);

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const { data } = await getWorkspaceNotifications();
      setNotifications(data?.data || []);
    } catch (error) {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // Ignore logout request failures; client token cleanup still proceeds.
    }
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0 relative z-50 w-full border-b border-white/[0.05] bg-[#050505]/40 backdrop-blur-2xl gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="md:hidden">
          <BrandLogo to="/dashboard" compact />
        </div>
        <div className="hidden md:flex items-center gap-2 min-w-0">
          <BrandLogo to="/dashboard" compact />
          {pageLabel && (
            <>
              <span className="text-[#3f3f46] text-[10px] select-none">•</span>
              <span className="text-[13px] font-bold text-white/80 select-none tracking-tight truncate">
                {pageLabel}
              </span>
            </>
          )}
        </div>
        <div className="md:hidden min-w-0">
          <span className="text-[13px] font-bold text-white/80 truncate">{pageLabel || "Velora"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <div
          ref={searchRef}
          className={`relative flex items-center rounded-lg overflow-visible transition-all duration-200 ${
            isSearchOpen ? "w-52 md:w-72" : "w-8 h-8"
          }`}
        >
          <div
            className={`flex items-center rounded-lg overflow-hidden transition-all duration-200 ${
              isSearchOpen
                ? "w-full bg-[#111113] border border-white/[0.08] ring-1 ring-[#22c55e]/20"
                : "w-8 h-8"
            }`}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center justify-center shrink-0 transition-colors w-8 h-8 ${
                isSearchOpen
                  ? "text-[#52525b] pointer-events-none"
                  : "text-[#52525b] hover:text-white hover:bg-white/[0.05] rounded-lg"
              }`}
            >
              <Search size={14} />
            </button>
            <input
              type="text"
              placeholder="Search workspace..."
              autoFocus={isSearchOpen}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-transparent text-[12px] text-white placeholder:text-[#3f3f46] pr-3 focus:outline-none transition-all duration-200 ${
                isSearchOpen ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
              }`}
            />
            {searchLoading && isSearchOpen && <Loader2 size={12} className="mr-3 animate-spin text-[#52525b]" />}
          </div>

          {isSearchOpen && (searchResults.length > 0 || debouncedSearch.trim()) && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
              {searchResults.length > 0 ? (
                <div className="max-h-72 overflow-y-auto py-1.5">
                  {searchResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchTerm("");
                        navigate(item.href);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[12.5px] font-semibold text-white truncate">{item.title}</span>
                        <span className="text-[10px] uppercase tracking-wide text-[#52525b] shrink-0">{item.type}</span>
                      </div>
                      <p className="text-[11px] text-[#71717a] truncate mt-0.5">{item.subtitle}</p>
                    </button>
                  ))}
                </div>
              ) : (
                !searchLoading && (
                  <div className="px-3 py-4 text-[12px] text-[#71717a]">No matches found.</div>
                )
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              const nextState = !isNotificationsOpen;
              setIsNotificationsOpen(nextState);
              if (nextState) {
                void loadNotifications();
              }
            }}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[#52525b] hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Bell size={14} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[5px] h-[5px] bg-[#22c55e] rounded-full ring-2 ring-[#09090b]" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[min(92vw,360px)] bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <p className="text-[13px] font-semibold text-white">Notifications</p>
                {notificationsLoading && <Loader2 size={12} className="animate-spin text-[#52525b]" />}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && !notificationsLoading ? (
                  <div className="px-4 py-5 text-[12px] text-[#71717a]">No recent notifications.</div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate(item.href || "/dashboard");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-[10px] ${typeStyles[item.type] || typeStyles.info}`}>●</span>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-white">{item.title}</p>
                          <p className="text-[11px] text-[#71717a] mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-white/[0.08] mx-1 hidden md:block" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[12px] font-black text-black">
              {initials}
            </div>
            <span className="hidden md:block text-[13px] font-bold text-white/70 leading-none max-w-28 truncate">
              {user?.username || user?.name || "Operator"}
            </span>
            <ChevronDown
              size={12}
              className={`hidden md:block text-[#3f3f46] transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute right-0 top-[calc(100%+8px)] w-52 bg-[#111113] border border-white/[0.10] rounded-xl shadow-elevation-3 overflow-hidden origin-top-right transition-all duration-150 ${
              isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-[12.5px] font-semibold text-white truncate">{user?.username || user?.name || "Operator"}</p>
              <p className="text-[11px] text-[#71717a] truncate">{user?.email || "No email"}</p>
            </div>
            <div className="py-1.5 flex flex-col gap-0.5 px-1.5">
              <Link
                to="/account"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white rounded-lg transition-colors"
              >
                <User size={13} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white rounded-lg transition-colors"
              >
                <Settings size={13} /> Settings
              </Link>
              <Link
                to="/documentation"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#a1a1aa] hover:bg-white/[0.05] hover:text-white rounded-lg transition-colors"
              >
                <FileText size={13} /> Documentation
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
