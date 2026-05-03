import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import { Rocket, History, PlayCircle } from "lucide-react";
import DeployRow from "../../components/project/DeployRow";
import GlassButton from "../../components/ui/GlassButton";
import { PageShell, PageHeader, Card, Badge, EmptyState, AlertBanner } from "../../components/layout/PageLayout";
import { motion } from "framer-motion";
import { listDeployments, triggerDeployment, getProject, getProjects } from "../../api/api";
import { mapBackendStatusToUi, formatTimeAgo } from "../../utils/deploymentUi";

export default function DeploymentsPage() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [refreshKey]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
      <Dock navMode={navMode} toggleNavMode={toggleNavMode} />
      <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
        <TopNav />
        <PageShell>
          <PageHeader 
            title="Deployments" 
            subtitle="Real-time overview of all workspace projects"
          >
            <GlassButton variant="primary" onClick={() => navigate('/projects/new')}>
              <Plus size={14} /> New Project
            </GlassButton>
          </PageHeader>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white/[0.02] border border-white/[0.05] rounded-[32px]" />)}
            </div>
          ) : projects.length === 0 ? (
            <Card noPad>
              <EmptyState icon={Rocket} title="No projects found" subtitle="Connect a repository to see your deployments here.">
                <GlassButton variant="secondary" onClick={() => navigate('/projects/new')}>Create First Project</GlassButton>
              </EmptyState>
            </Card>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {projects.map((project, idx) => (
                <ProjectPreviewCard key={project._id} project={project} index={idx} onRefresh={() => setRefreshKey(k => k + 1)} />
              ))}
            </motion.div>
          )}
        </PageShell>
      </PageWrapper>
    </div>
  );
}

function ProjectPreviewCard({ project, index, onRefresh }) {
  const navigate = useNavigate();
  const dep = project.latestDeployment;
  const status = dep?.status || 'idle';
  
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'running': return '#22c55e';
      case 'failed': return '#ef4444';
      case 'building': return '#eab308';
      default: return '#52525b';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col bg-[#111113] border border-white/[0.06] rounded-[32px] overflow-hidden hover:border-white/[0.15] transition-all hover:shadow-2xl"
    >
      {/* Preview Area */}
      <div className="h-40 relative bg-[#050505] overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, ${getStatusColor()} 1px, transparent 0)`,
          backgroundSize: '16px 16px'
        }} />

        <div className="absolute inset-0 flex items-center justify-center">
          {status === 'building' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-[#eab308] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={24} className="text-[#eab308]" />
                </div>
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#eab308] animate-pulse">Building Infrastructure...</p>
            </div>
          ) : status === 'failed' ? (
            <div className="flex flex-col items-center gap-2 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <AlertCircle size={24} />
              </div>
              <p className="text-[13px] font-bold text-red-500">Deploy Unsuccessful</p>
              <p className="text-[11px] text-[#71717a] font-mono truncate max-w-full">{dep.errorMessage || 'Unknown Error'}</p>
            </div>
          ) : status === 'running' && dep.url ? (
            <div className="w-full h-full relative group/preview transition-all duration-700">
              {/* Iframe Preview (Scaled down for thumbnail) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden bg-white">
                <iframe 
                  key={dep._id} // Force unique reload for each deployment
                  src={`${dep.url}?t=${new Date(dep.createdAt).getTime()}`} // Cache busting and uniqueness
                  className="w-[1200px] h-[800px] border-0 origin-top-left"
                  style={{ 
                    transform: 'scale(0.267)', // Scaled to fit 320px width approx
                    opacity: 0.9
                  }}
                  title={`Preview for ${project.name}`}
                />
                {/* Overlay to prevent interaction and add glass effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </div>

              {/* Central Badge Overlay (Only shown on hover) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.05] border border-white/10 flex items-center justify-center relative shadow-2xl">
                  <Globe size={28} className="text-white" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#22c55e] border-4 border-[#050505] shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-white drop-shadow-lg">v{dep.version} • {dep.branch}</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[24px] m-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center mb-2">
                <Box size={24} className="text-[#1a1a1a]" />
              </div>
              <p className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.2em]">
                {status === 'running' ? "Preview Blocked" : "No Preview Available"}
              </p>
              {status === 'idle' && (
                <p className="text-[9px] text-[#3f3f46] mt-1 font-mono uppercase">Ready to Deploy</p>
              )}
            </div>
          )}
        </div>

        {/* Status Overlay */}
        <div className="absolute top-4 left-4">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
            status === 'running' ? 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]' :
            status === 'building' ? 'bg-[#eab308]/10 border-[#eab308]/20 text-[#eab308]' :
            status === 'failed' ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]' :
            'bg-white/5 border-white/10 text-[#71717a]'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-white group-hover:text-white/90 transition-colors">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <GitBranch size={12} className="text-[#3f3f46]" />
              <p className="text-[12px] text-[#71717a] font-medium">{project.branch || 'main'}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/deploy?projectId=${project._id}`)}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#52525b] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="h-px bg-white/[0.04]" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#52525b]" />
            <p className="text-[11px] text-[#52525b] font-medium">Updated {dep ? formatTimeAgo(dep.createdAt) : 'Never'}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {status === 'running' && dep.url && (
              <a 
                href={dep.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-xl bg-white text-black text-[11px] font-bold flex items-center gap-1.5 hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Visit <Globe size={10} />
              </a>
            )}
            <button 
              onClick={() => navigate(`/logs?projectId=${project._id}`)}
              className="h-8 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold text-white hover:bg-white/[0.06] transition-all"
            >
              Logs
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { 
  Plus, 
  GitBranch, 
  Globe, 
  ArrowUpRight, 
  Activity, 
  AlertCircle, 
  Check, 
  Box 
} from "lucide-react";
