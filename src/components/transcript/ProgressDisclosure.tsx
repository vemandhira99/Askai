import React from 'react';
import { OperationStep } from '../../types/bi';
import { Loader2 } from 'lucide-react';

interface ProgressDisclosureProps {
  progress?: OperationStep;
}

export const ProgressDisclosure: React.FC<ProgressDisclosureProps> = ({ progress }) => {
  if (!progress) return null;

  const isActive = progress.status === 'active' || progress.status === 'queued' || progress.status === 'retrying';
  const isFailed = progress.status === 'failed';

  return (
    <div className="mb-2.5 text-xs select-none">
      <div className="inline-flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
        {isActive ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-zinc-600" />
            <span className="text-zinc-600">{progress.label}...</span>
          </>
        ) : isFailed ? (
          <span className="text-rose-600 font-sans">Operation failed: {progress.label}</span>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
            <span>{progress.durationMs || 46}ms execution</span>
          </>
        )}
      </div>
    </div>
  );
};
