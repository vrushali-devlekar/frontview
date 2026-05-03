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
import {
  PageShell,
  PageHeader,
  Card,
  Badge,
  EmptyState,
  AlertBanner,
} from "../../components/layout/PageLayout";
import { motion } from "framer-motion";
import {
  listDeployments,
  triggerDeployment,
  getProject,
  getProjects,
} from "../../api/api";
import { mapBackendStatusToUi, formatTimeAgo } from "../../utils/deploymentUi";

export default function DeploymentsPage() {
  const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId") || "";

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [triggering, setTriggering] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await getProjects();
        if (cancelled) return;
        const rows = Array.isArray(data?.data) ? data.data : [];
        setProjects(rows);
        if (!projectId && rows[0]?._id) {
          navigate(`/deploy?projectId=${encodeURIComponent(rows[0]._id)}`, {
            replace: true,
          });
        }
      } catch {
        if (!cancelled) setProjects([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, navigate]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (!projectId) {
        if (!cancelled) {
          setDeployments([]);
          setProjectName("");
        }
        return;
      }
      if (!cancelled) {
        setLoading(true);
        setError("");
      }
      try {
        const [projRes, depRes] = await Promise.all([
          getProject(projectId),
          listDeployments(projectId),
        ]);
        if (cancelled) return;
        setProjectName(projRes.data?.data?.name || "PROJECT");
        setDeployments(depRes.data?.data || []);
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message ||
              e.message ||
              "Failed to load deployments",
          );
          setDeployments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, refreshKey]);

  const handleTriggerBuild = async () => {
    if (!projectId) return;
    setTriggering(true);
    setError("");
    try {
      const { data } = await triggerDeployment(projectId);
      const newId = data?.deploymentId != null ? String(data.deploymentId) : "";
      if (newId)
        navigate(
          `/deploy/logs/${newId}?projectId=${encodeURIComponent(projectId)}`,
        );
      else setRefreshKey((k) => k + 1);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.message ||
          "Failed to trigger deployment",
      );
    } finally {
      setTriggering(false);
    }
  };

  const pickFirstProject = async () => {
    try {
      const { data } = await getProjects();
      const first = data?.data?.[0];
      if (first?._id)
        navigate(`/deploy?projectId=${encodeURIComponent(first._id)}`, {
          replace: true,
        });
    } catch {
      /* ignore */
    }
  };

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
            title="Deployments"
            subtitle={`Deployment history for ${projectName}`}
          >
            <GlassButton
              variant="primary"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              onClick={handleTriggerBuild}
              disabled={!projectId || triggering}
            >
              <PlayCircle size={14} />{" "}
              {triggering ? "Triggering…" : "Trigger Deployment"}
            </GlassButton>
          </PageHeader>

          {!projectId && (
            <Card
              noPad
              className="bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90"
            >
              <EmptyState
                icon={Rocket}
                title="No project selected"
                subtitle="Open a project from the dashboard to view its deployment history."
              >
                <GlassButton
                  variant="secondary"
                  className="bg-green-600 backdrop-blur-md border border-green-500 hover:bg-green-700"
                  onClick={pickFirstProject}
                >
                  Load Latest Project
                </GlassButton>
              </EmptyState>
            </Card>
          )}

          {/* Error */}
          {projectId && error && (
            <AlertBanner type="error">{error}</AlertBanner>
          )}

          {/* Deployments list */}
          {projectId && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <History size={14} className="text-purple-300" />
                  <p className="text-[13px] font-semibold text-white">
                    Version History
                  </p>
                </div>
                <Badge className="bg-white/10 backdrop-blur-md border border-white/20">
                  {loading ? "…" : deployments.length} builds
                </Badge>
              </div>

              <Card
                noPad
                className="bg-black/80 backdrop-blur-xl border border-white/10 hover:bg-black/90"
              >
                {loading && (
                  <div className="py-20 flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                  </div>
                )}
                {!loading && deployments.length === 0 && (
                  <EmptyState
                    icon={Rocket}
                    title="No deployments yet"
                    subtitle="Trigger a build to start the pipeline."
                  />
                )}
                {!loading &&
                  deployments.map((dep, idx) => (
                    <div
                      key={dep._id}
                      className={
                        idx !== deployments.length - 1
                          ? "border-b border-white/[0.04]"
                          : ""
                      }
                    >
                      <DeployRow
                        projectId={projectId}
                        deployment={{
                          id: dep._id,
                          version: `v${dep.version}`,
                          versionNumber: dep.version,
                          status: mapBackendStatusToUi(dep.status),
                          liveUrl: dep.url || null,
                          branch: dep.branch || "main",
                          commitMessage:
                            dep.errorMessage || dep.commitHash || "—",
                          timeAgo: formatTimeAgo(
                            dep.createdAt || dep.updatedAt,
                          ),
                          author: dep.triggeredBy || "manual",
                        }}
                        onRollback={() => setRefreshKey((k) => k + 1)}
                      />
                    </div>
                  ))}
              </Card>
            </motion.div>
          )}
        </PageShell>
      </PageWrapper>
    </div>
  );
}
