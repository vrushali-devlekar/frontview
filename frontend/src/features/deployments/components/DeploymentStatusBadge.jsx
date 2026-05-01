import { AlertTriangle, CheckCircle2, Loader2, RotateCcw, XCircle } from 'lucide-react';

const statusConfig = {
  SUCCESS: {
    icon: CheckCircle2,
    textClass: 'text-[var(--color-velora-accent-green)]',
    borderClass: 'border-[var(--color-velora-accent-green)]/30',
  },
  FAILED: {
    icon: XCircle,
    textClass: 'text-[var(--color-velora-accent-red)]',
    borderClass: 'border-[var(--color-velora-accent-red)]/30',
  },
  STOPPED: {
    icon: AlertTriangle,
    textClass: 'text-[var(--color-velora-accent-yellow)]',
    borderClass: 'border-[var(--color-velora-accent-yellow)]/30',
  },
  QUEUED: {
    icon: Loader2,
    textClass: 'text-[var(--color-velora-accent-yellow)]',
    borderClass: 'border-[var(--color-velora-accent-yellow)]/30',
  },
  BUILDING: {
    icon: RotateCcw,
    textClass: 'text-[var(--color-velora-accent-yellow)]',
    borderClass: 'border-[var(--color-velora-accent-yellow)]/30',
  },
};

const DeploymentStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || 'QUEUED').toUpperCase();
  const config = statusConfig[normalizedStatus] || statusConfig.QUEUED;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs tracking-widest ${config.borderClass} ${config.textClass}`}
    >
      <Icon size={12} className={normalizedStatus === 'QUEUED' ? 'animate-spin' : ''} />
      <span>{normalizedStatus}</span>
    </div>
  );
};

export default DeploymentStatusBadge;
