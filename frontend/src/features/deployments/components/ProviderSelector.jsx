const ProviderSelector = ({ provider, onChange, providers }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs tracking-widest text-[var(--color-velora-text-muted)]">
        Provider
      </span>
      <select
        value={provider}
        onChange={(event) => onChange(event.target.value)}
        className="bg-[var(--color-velora-bg)] border border-[#40403a] rounded-lg px-3 py-2 text-xs uppercase tracking-widest"
      >
        {providers.map((entry) => (
          <option key={entry} value={entry}>
            {entry}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProviderSelector;
