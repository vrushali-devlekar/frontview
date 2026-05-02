import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import TopNav from "../../components/layout/TopNav";
import {
  Search,
  Plus,
  Grid,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Folder,
  ExternalLink,
  Terminal,
  Clock,
  Settings,
} from "lucide-react";

import heroBg from "../../assets/new-top.png";
import { getProjects } from "../../api/api";
import CyberButton from "../../components/ui/CyberButton";

const StatusBadge = ({ status }) => {
  const styles = {
    RUNNING: "text-[#6EE7B7] border-[#6EE7B7]/30 bg-[#6EE7B7]/10",
    FAILED: "text-[#E55B5B] border-[#E55B5B]/30 bg-[#E55B5B]/10",
    SUCCESS: "text-[#6EE7B7] border-[#6EE7B7]/30 bg-[#6EE7B7]/10",
    BUILDING: "text-[#D4A84B] border-[#D4A84B]/30 bg-[#D4A84B]/10",
    QUEUED: "text-[#888] border-[#888]/30 bg-[#888]/10",
  };

  const normalized = (status || "QUEUED").toUpperCase();

  return (
    <span className={`text-[10px] px-2 py-0.5 border font-mono tracking-widest flex items-center gap-1.5 ${styles[normalized] || styles.BUILDING}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${normalized === 'RUNNING' || normalized === 'SUCCESS' ? 'bg-[#6EE7B7]' : normalized === 'FAILED' ? 'bg-[#E55B5B]' : 'bg-[#D4A84B] animate-pulse'}`}></span>
      {normalized}
    </span>
  );
};

export default function Overview() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await getProjects();
        if (cancelled) return;
        setProjects(Array.isArray(data?.data) ? data.data : []);
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.repoUrl?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide font-mono">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-[260px]"}`}>
        
        {/* HEADER SECTION */}
        <div className="relative min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-[#060606]/80 backdrop-blur-sm" />
          <TopNav />
          <div className="relative z-10 px-6 pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl text-[#D4A84B] font-bold tracking-widest font-pixel">FLEET_COMMAND</h1>
              <p className="text-xs text-[#888] mt-1 tracking-widest">APPLICATION FLEET OVERVIEW</p>
            </div>

            <CyberButton variant="primary" onClick={() => navigate("/projects/new")}>
                <Plus size={14} strokeWidth={3} className="mr-2" /> NEW_APP
            </CyberButton>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#222]">
            <h2 className="text-sm text-[#888] flex items-center gap-2 font-bold">
              <Layers size={14} /> ALL_PROJECTS ({filtered.length})
            </h2>
            
            <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input 
                    type="text"
                    placeholder="SEARCH_FLEET..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] text-xs py-2.5 pl-10 pr-4 focus:border-[#D4A84B] outline-none transition-colors"
                />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-[#0a0a0a] border-2 border-[#111] animate-pulse" />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[#222]">
                <p className="text-[#555] text-xs font-pixel uppercase">No Applications Found</p>
                <CyberButton variant="outline" className="mt-4" onClick={() => navigate("/projects/new")}>DEPLOY_YOUR_FIRST_APP</CyberButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((project) => (
                    <div key={project._id} className="bg-[#0c0c0c] border-2 border-[#1a1a1a] hover:border-[#D4A84B] transition-all group" style={{ boxShadow: "4px 4px 0px 0px rgba(212, 168, 75, 0.1)" }}>
                        <div className="p-5 border-b border-[#1a1a1a] flex justify-between items-start">
                            <div>
                                <h3 className="text-xs font-pixel text-[#D4A84B] mb-2 truncate max-w-[150px]">{project.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-[#666]">
                                    <Clock size={12} /> {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <StatusBadge status={project.lastDeploymentStatus || 'RUNNING'} />
                        </div>
                        
                        <div className="p-5 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#555]">BRANCH:</span>
                                <span className="text-white border border-[#222] px-2 py-0.5 rounded-sm">{project.branch || 'main'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#555]">SOURCE:</span>
                                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-[#6EE7B7] hover:underline flex items-center gap-1 font-medium">
                                    GITHUB <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-[#1a1a1a] bg-[#060606]/50">
                            <button 
                                onClick={() => navigate(`/deploy?projectId=${project._id}`)}
                                className="p-4 border-r border-[#1a1a1a] text-[#666] hover:text-[#6EE7B7] hover:bg-[#111] transition-colors flex justify-center"
                                title="TERMINAL"
                            >
                                <Terminal size={16} />
                            </button>
                            <button 
                                onClick={() => navigate(`/deploy?projectId=${project._id}`)}
                                className="p-4 border-r border-[#1a1a1a] text-[#666] hover:text-[#D4A84B] hover:bg-[#111] transition-colors flex justify-center"
                                title="DEPLOYMENTS"
                            >
                                <Layers size={16} />
                            </button>
                            <button 
                                onClick={() => navigate(`/settings?projectId=${project._id}`)}
                                className="p-4 text-[#666] hover:text-white hover:bg-[#111] transition-colors flex justify-center"
                                title="SETTINGS"
                            >
                                <Settings size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}