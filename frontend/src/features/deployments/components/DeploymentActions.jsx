import { Play, RefreshCw, Square } from 'lucide-react';

const DeploymentActions = ({
  projectId,
  onProjectIdChange,
  onStart,
  onRefresh,
  onStop,
  disabled,
  isTriggering,
  isLoadingStatus,
  isStopping,
}) => {
  return (
    <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-4 md:p-5 mb-6">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={projectId}
          onChange={(event) => onProjectIdChange(event.target.value)}
          placeholder="Enter Project ID"
          className="flex-1 bg-[var(--color-velora-bg)] border border-[#40403a] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--color-velora-accent-green)]/60"
        />

        <button
          onClick={onStart}
          disabled={isTriggering}
          className="px-4 py-2 rounded-lg border border-[var(--color-velora-accent-green)]/40 hover:border-[var(--color-velora-accent-green)] transition-colors inline-flex items-center justify-center gap-2 text-sm"
        >
          <Play size={14} />
          {isTriggering ? 'Starting...' : 'Start Deploy'}
        </button>

        <button
          onClick={onRefresh}
          disabled={disabled || isLoadingStatus}
          className="px-4 py-2 rounded-lg border border-[#40403a] hover:bg-[#40403a] transition-colors inline-flex items-center justify-center gap-2 text-sm"
        >
          <RefreshCw size={14} className={isLoadingStatus ? 'animate-spin' : ''} />
          Refresh
        </button>

        <button
          onClick={onStop}
          disabled={disabled || isStopping}
          className="px-4 py-2 rounded-lg border border-[var(--color-velora-accent-red)]/40 hover:border-[var(--color-velora-accent-red)] transition-colors inline-flex items-center justify-center gap-2 text-sm"
        >
          <Square size={14} />
          {isStopping ? 'Stopping...' : 'Stop'}
        </button>
      </div>
    </div>
  );
};

export default DeploymentActions;
