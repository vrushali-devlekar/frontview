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
    <header className="relative z-50 flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-white/[0.05] bg-[#050505]/40 px-4 backdrop-blur-2xl md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="md:hidden">
          <BrandLogo to="/dashboard" compact />
        </div>
        <div className="hidden min-w-0 items-center gap-2 md:flex">
          <BrandLogo to="/dashboard" compact />
          {pageLabel && (
            <>
              <span className="select-none text-[10px] text-[#3f3f46]">•</span>
              <span className="truncate select-none text-[13px] font-bold tracking-tight text-white/80">
                {pageLabel}
              </span>
            </>
          )}
        </div>
        <div className="min-w-0 md:hidden">
          <span className="truncate text-[13px] font-bold text-white/80">{pageLabel || "Velora"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <div
          ref={searchRef}
          className={`relative flex items-center overflow-visible rounded-lg transition-all duration-200 ${
            isSearchOpen ? "w-52 md:w-72" : "h-8 w-8"
          }`}
        >
          <div
            className={`flex items-center overflow-hidden rounded-lg transition-all duration-200 ${
              isSearchOpen
                ? "w-full border border-white/[0.08] bg-[#111113] ring-1 ring-[#22c55e]/20"
                : "h-8 w-8"
            }`}
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center transition-colors ${
                isSearchOpen
                  ? "pointer-events-none text-[#52525b]"
                  : "rounded-lg text-[#52525b] hover:bg-white/[0.05] hover:text-white"
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
              className={`bg-transparent pr-3 text-[12px] text-white placeholder:text-[#3f3f46] transition-all duration-200 focus:outline-none ${
                isSearchOpen ? "w-full opacity-100" : "pointer-events-none w-0 opacity-0"
              }`}
            />
            {searchLoading && isSearchOpen && <Loader2 size={12} className="mr-3 animate-spin text-[#52525b]" />}
          </div>

          {isSearchOpen && (searchResults.length > 0 || debouncedSearch.trim()) && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-xl border border-white/[0.08] bg-[#111113] shadow-2xl">
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
                      className="w-full px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-[12.5px] font-semibold text-white">{item.title}</span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wide text-[#52525b]">{item.type}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-[#71717a]">{item.subtitle}</p>
                    </button>
                  ))}
                </div>
              ) : (
                !searchLoading && <div className="px-3 py-4 text-[12px] text-[#71717a]">No matches found.</div>
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
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#52525b] transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <Bell size={14} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-[5px] w-[5px] rounded-full bg-[#22c55e] ring-2 ring-[#09090b]" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[min(92vw,360px)] overflow-hidden rounded-xl border border-white/[0.08] bg-[#111113] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
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
                      className="w-full border-b border-white/[0.04] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 text-[10px] ${typeStyles[item.type] || typeStyles.info}`}>●</span>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-white">{item.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#71717a]">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 hidden h-4 w-px bg-white/[0.08] md:block" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[12px] font-black text-black">
              {initials}
            </div>
            <span className="hidden max-w-28 truncate text-[13px] font-bold leading-none text-white/70 md:block">
              {user?.username || user?.name || "Operator"}
            </span>
            <ChevronDown
              size={12}
              className={`hidden text-[#3f3f46] transition-transform duration-300 md:block ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute right-0 top-[calc(100%+8px)] w-52 origin-top-right overflow-hidden rounded-xl border border-white/[0.10] bg-[#111113] shadow-2xl transition-all duration-150 ${
              isDropdownOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            <div className="border-b border-white/[0.06] px-4 py-3">
              <p className="truncate text-[12.5px] font-semibold text-white">{user?.username || user?.name || "Operator"}</p>
              <p className="truncate text-[11px] text-[#71717a]">{user?.email || "No email"}</p>
            </div>
            <div className="flex flex-col gap-0.5 px-1.5 py-1.5">
              <Link
                to="/account"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-[#a1a1aa] transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <User size={13} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-[#a1a1aa] transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <Settings size={13} /> Settings
              </Link>
              <Link
                to="/documentation"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-[#a1a1aa] transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <FileText size={13} /> Documentation
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-[#ef4444] transition-colors hover:bg-[#ef4444]/10"
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
