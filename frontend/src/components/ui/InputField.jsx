import React from 'react';

export default function InputField({
  label,
  icon: Icon,
  error,
  className = '',
  containerClassName = '',
  focusColor = 'valora-yellow',
  ...props
}) {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-[10px] text-[#888] font-mono tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[#555]`}>
            <Icon size={14} />
          </span>
        )}
        <input
          className={`
            w-full bg-[#050505] border border-valora-border 
            text-[#ccc] text-xs font-mono p-3 
            ${Icon ? 'pl-10' : 'pl-3'}
            focus:outline-none focus:border-${focusColor} transition-colors
            placeholder:text-[#444]
            ${error ? 'border-valora-red focus:border-valora-red bg-valora-red/5' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[9px] text-valora-red font-mono mt-1">
          [!] {error}
        </p>
      )}
    </div>
  );
}
