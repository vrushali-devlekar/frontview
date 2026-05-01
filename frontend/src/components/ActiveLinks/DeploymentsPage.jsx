import DeploymentLogsPage from './DeploymentLogsPage';
import {
  DeploymentActions,
  DeploymentTimelineCard,
  useDeploymentRuntime,
} from '../../features/deployments';

const DeploymentsPage = () => {
  const {
    deployments,
    selectedDeployment,
    selectedDeploymentId,
    projectId,
    isTriggering,
    isStopping,
    isLoadingStatus,
    error,
    setProjectId,
    setSelectedDeploymentId,
    startDeployment,
    refreshDeployment,
    stopActiveDeployment,
  } = useDeploymentRuntime();

  const handleStart = async () => {
    const deploymentId = await startDeployment();
    if (deploymentId) {
      await refreshDeployment(deploymentId);
    }
  };

  if (selectedDeploymentId) {
    return (
      <DeploymentLogsPage
        deploymentId={selectedDeploymentId}
        deployment={selectedDeployment?.raw}
        onBack={() => setSelectedDeploymentId(null)}
        onRefresh={() => refreshDeployment(selectedDeploymentId)}
        onStop={() => stopActiveDeployment(selectedDeploymentId)}
        isStopping={isStopping}
        isLoadingStatus={isLoadingStatus}
      />
    );
  }

  return (
    <div className="relative p-6 md:p-8 min-h-screen font-sans text-[var(--color-velora-text)] z-0">
      <div 
        className="absolute top-0 left-0 right-0 h-[150px] md:h-[200px] -z-10 bg-no-repeat bg-cover bg-center pointer-events-none"
        style={{ 
          backgroundImage: `url(/hotel-bg.png)`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velora-bg)]" />
      </div>

      <h2 className="text-lg md:text-xl mt-[60px] md:mt-[100px] mb-6 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(224,216,190,0.5)]">
        Recent Deployments Log
      </h2>

      <DeploymentActions
        projectId={projectId}
        onProjectIdChange={setProjectId}
        onStart={handleStart}
        onRefresh={() => refreshDeployment(selectedDeploymentId)}
        onStop={() => stopActiveDeployment(selectedDeploymentId)}
        disabled={!selectedDeploymentId}
        isTriggering={isTriggering}
        isLoadingStatus={isLoadingStatus}
        isStopping={isStopping}
      />

      {error && (
        <p className="text-sm mb-4 text-[var(--color-velora-accent-red)]">{error}</p>
      )}

      <div className="relative ml-4 border-l border-[#40403a] space-y-4 pb-4">
        {deployments.length === 0 && (
          <p className="text-sm text-[var(--color-velora-text-muted)] pl-8">
            No deployments yet. Trigger one using a valid project id.
          </p>
        )}

        {deployments.map((deploy) => (
          <DeploymentTimelineCard
            key={deploy.id}
            deployment={deploy}
            onOpenLogs={setSelectedDeploymentId}
          />
        ))}
      </div>
    </div>
  );
};

export default DeploymentsPage;