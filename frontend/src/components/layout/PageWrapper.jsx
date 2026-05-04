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
      style={{
        ...sidebarStyle,
        transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10"
    >
      {children}
    </div>
  );
}
