import { useSidebarStyle } from "../../hooks/useSidebarAttr";

/**
 * PageWrapper — wraps every page's main content area.
 * Applies the correct margin-left inline to push content beside the sidebar.
 * No CSS / index.css dependency.
 */
export default function PageWrapper({ navMode, isCollapsed, children }) {
  const sidebarStyle = useSidebarStyle(navMode, isCollapsed);

  return (
    <div
      style={sidebarStyle}
      className={`flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 transition-[margin] duration-200 pt-[env(safe-area-inset-top)]`}
    >
      {children}
    </div>
  );
}
