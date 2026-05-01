import { Terminal } from 'lucide-react';
import DeploymentStatusBadge from './DeploymentStatusBadge';

const DeploymentTimelineCard = ({ deployment, onOpenLogs }) => {
  return (
    <div className="relative pl-8">
      <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 bg-[var(--color-velora-bg)] border-[var(--color-velora-accent-green)]/50" />
      <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <p className="text-[10px] text-[var(--color-velora-text-muted)] mb-2">
              Deployment
            </p>
            <h3 className="text-lg md:text-xl tracking-widest font-mono">{deployment.id}</h3>
            <p className="text-[10px] mt-1 text-[var(--color-velora-text-muted)]">{deployment.timestamp}</p>
          </div>

          <DeploymentStatusBadge status={deployment.status} />
        </div>

        <div className="mt-5 pt-4 border-t border-[#40403a] flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex gap-6">
            <p className="text-[var(--color-velora-text-muted)]">Branch: <span className="text-[var(--color-velora-text)]">{deployment.branch}</span></p>
            <p className="text-[var(--color-velora-text-muted)]">Commit: <span className="text-[var(--color-velora-text)]">{deployment.commit}</span></p>
            <p className="text-[var(--color-velora-text-muted)]">Duration: <span className="text-[var(--color-velora-text)]">{deployment.duration}</span></p>
          </div>

          <button
            onClick={() => onOpenLogs(deployment.id)}
            className="bg-[var(--color-velora-bg)] px-4 py-2 rounded-lg border border-[#40403a] flex items-center gap-2 hover:bg-[#40403a] transition-colors"
          >
            <Terminal size={13} />
            <span className="font-mono text-[10px]">&gt;_ Logs</span>
          </button>
        </div>

        {deployment.error && (
          <p className="mt-4 text-xs text-[var(--color-velora-accent-red)]">{deployment.error}</p>
        )}
      </div>
    </div>
  );
};

export default DeploymentTimelineCard;
