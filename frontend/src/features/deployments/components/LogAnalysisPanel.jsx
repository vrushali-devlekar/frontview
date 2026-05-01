import { Activity } from 'lucide-react';
import ProviderSelector from './ProviderSelector';

const LogAnalysisPanel = ({
  provider,
  providers,
  onProviderChange,
  onAnalyze,
  isAnalyzing,
  analysis,
  error,
  disabled,
}) => {
  return (
    <div className="mt-6 bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <ProviderSelector provider={provider} onChange={onProviderChange} providers={providers} />
        <button
          onClick={onAnalyze}
          disabled={disabled || isAnalyzing}
          className="bg-[var(--color-velora-bg)] px-5 py-2 rounded-lg border border-[var(--color-velora-accent-green)]/50 hover:bg-[#40403a] hover:border-[var(--color-velora-accent-green)] transition-all inline-flex items-center gap-2 text-sm"
        >
          <Activity size={14} className="text-[var(--color-velora-accent-green)]" />
          {isAnalyzing ? 'Analyzing...' : 'Run AI Log Analysis'}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-[var(--color-velora-accent-red)]">{error}</p>}

      {analysis && (
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="text-sm uppercase tracking-widest text-[var(--color-velora-text-muted)]">Root Cause</h4>
            <p className="mt-2 text-sm">{analysis.rootCause || analysis.rawOutput || '-'}</p>
          </div>

          {Array.isArray(analysis.stepByStepFix) && analysis.stepByStepFix.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-widest text-[var(--color-velora-text-muted)]">Step By Step Fix</h4>
              <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                {analysis.stepByStepFix.map((step, idx) => (
                  <li key={`${step}-${idx}`}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(analysis.securityFlags) && analysis.securityFlags.length > 0 && (
            <div>
              <h4 className="text-sm uppercase tracking-widest text-[var(--color-velora-text-muted)]">Security Flags</h4>
              <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                {analysis.securityFlags.map((flag, idx) => (
                  <li key={`${flag}-${idx}`}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.rawOutput && (
            <div>
              <h4 className="text-sm uppercase tracking-widest text-[var(--color-velora-text-muted)]">Raw Output</h4>
              <pre className="mt-2 text-xs bg-[var(--color-velora-bg)] border border-[#40403a] rounded-lg p-3 overflow-auto whitespace-pre-wrap">
                {analysis.rawOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogAnalysisPanel;
