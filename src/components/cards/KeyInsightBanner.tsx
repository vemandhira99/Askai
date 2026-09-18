import React from 'react';
import { KeyInsight } from '../../types/bi';

interface KeyInsightBannerProps {
  insight?: KeyInsight;
  isPreparing?: boolean;
}

export const KeyInsightBanner: React.FC<KeyInsightBannerProps> = ({ 
  insight, 
  isPreparing = false 
}) => {
  if (isPreparing || !insight) {
    return (
      <div className="mt-3 p-3 rounded-r-lg border-l-2 border-zinc-300 bg-zinc-50 animate-pulse text-xs text-zinc-400">
        Preparing insight...
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-r-lg border-l-2 border-zinc-900 bg-zinc-50/80 text-zinc-800 text-xs">
      <div className="font-semibold text-zinc-900 leading-snug">
        {insight.headline}
      </div>
      <p className="text-zinc-600 mt-1 leading-relaxed">
        {insight.narrative}
      </p>

      {insight.metrics && insight.metrics.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-200/60 flex flex-wrap gap-4 text-[11px]">
          {insight.metrics.map((m, idx) => (
            <div key={idx} className="flex items-baseline gap-1">
              <span className="text-zinc-500">{m.label}:</span>
              <span className="text-zinc-900 font-semibold font-mono">{m.value}</span>
              {m.change && <span className="text-zinc-500 font-normal">({m.change})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
