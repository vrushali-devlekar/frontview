import { useEffect } from 'react';
import { ArrowLeft, RefreshCw, ShieldCheck, Terminal } from 'lucide-react';
import {
  LiveLogsConsole,
  LogAnalysisPanel,
  PROVIDERS,
  useDeploymentLogs,
  useLogAnalysis,
} from '../../features/deployments';

const DeploymentLogsPage = ({
  deploymentId,
  deployment,
  onBack,
  onRefresh,
  onStop,
  isLoadingStatus,
  isStopping,
}) => {
  const deployedUrl = deployment?.url || (deployment?.port ? `http://localhost:${deployment.port}` : null);
  const { logs, streamError, isStreaming } = useDeploymentLogs(deploymentId, deployment?.logs || [], {
    onComplete: () => {
      onRefresh?.();
    },
  });
  const {
    provider,
    analysis,
    isAnalyzing,
    error: analysisError,
    setProvider,
    runAnalysis,
    resetAnalysis,
  } = useLogAnalysis();

  useEffect(() => {
    resetAnalysis();
  }, [deploymentId, resetAnalysis]);

  useEffect(() => {
    if (!deploymentId) return () => {};
    if (deployedUrl) return () => {};

    const status = String(deployment?.status || '').toLowerCase();
    if (status === 'failed' || status === 'stopped') return () => {};

    const interval = setInterval(() => {
      onRefresh?.();
    }, 2000);

    return () => clearInterval(interval);
  }, [deployedUrl, deployment?.status, deploymentId, onRefresh]);

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

      <div className="flex items-center gap-4 mt-[60px] md:mt-[100px] mb-6">
        <button onClick={onBack} className="p-2 border border-[#40403a] rounded-lg hover:bg-[#40403a] transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-lg md:text-xl tracking-widest uppercase drop-shadow-[0_0_8px_rgba(224,216,190,0.5)] flex items-center gap-3">
          <Terminal size={20} className="text-[var(--color-velora-accent-green)]" />
          Logs: {deploymentId}
        </h2>
        <button
          onClick={onRefresh}
          className="ml-auto p-2 border border-[#40403a] rounded-lg hover:bg-[#40403a] transition-colors"
          title="Refresh deployment status"
        >
          <RefreshCw size={14} className={isLoadingStatus ? 'animate-spin' : ''} />
        </button>
        {isStreaming || isStopping ? (
          <div className="flex items-center gap-2 ml-auto text-[var(--color-velora-accent-yellow)] border border-[var(--color-velora-accent-yellow)]/30 bg-[var(--color-velora-accent-yellow)]/10 px-3 py-1 rounded-full text-xs font-mono">
            <RefreshCw size={12} className="animate-spin" /> Streaming
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-auto text-[var(--color-velora-accent-green)] border border-[var(--color-velora-accent-green)]/30 bg-[var(--color-velora-accent-green)]/10 px-3 py-1 rounded-full text-xs font-mono">
            <ShieldCheck size={12} /> Completed
          </div>
        )}
      </div>

      {deployedUrl && (
        <div className="mb-6 bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-5">
          <p className="text-xs tracking-widest text-[var(--color-velora-text-muted)] uppercase">
            App is live
          </p>
          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <a
              href={deployedUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm tracking-wider underline underline-offset-4 text-[var(--color-velora-accent-green)]"
            >
              {deployedUrl}
            </a>
            <p className="text-xs text-[var(--color-velora-text-muted)]">
              Open this link to view your deployed app.
            </p>
          </div>
        </div>
      )}

      {streamError && (
        <p className="text-sm mb-4 text-[var(--color-velora-accent-red)]">{streamError}</p>
      )}

      <LiveLogsConsole logs={logs} isStreaming={isStreaming || isStopping} />

      <LogAnalysisPanel
        provider={provider}
        providers={PROVIDERS}
        onProviderChange={setProvider}
        onAnalyze={() => runAnalysis(deploymentId)}
        isAnalyzing={isAnalyzing}
        analysis={analysis}
        error={analysisError}
        disabled={logs.length === 0}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={onStop}
          className="text-xs border border-[var(--color-velora-accent-red)]/40 px-4 py-2 rounded-lg hover:border-[var(--color-velora-accent-red)] transition-colors"
        >
          {isStopping ? 'Stopping...' : 'Stop Deployment'}
        </button>
      </div>

    </div>
  );
};

export default DeploymentLogsPage;
