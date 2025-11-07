import React from 'react';

interface Props {
  value: number; // 0..100
  label?: string;
}

export const ProgressBar: React.FC<Props> = ({ value, label }) => {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm text-[var(--intuitive-names-secondary-text)]">
          <span>{label}</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
      )}
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-blue-500 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
};
