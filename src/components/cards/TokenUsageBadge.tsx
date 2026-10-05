import React from 'react';
import { TokenUsage } from '../../types/bi';
import { Zap } from 'lucide-react';

interface TokenUsageBadgeProps {
  usage?: TokenUsage;
}

export const TokenUsageBadge: React.FC<TokenUsageBadgeProps> = ({ usage }) => {
  // Fallback defaults if usage is not explicitly supplied
  const data: TokenUsage = usage || {
    promptTokens: 412,
    completionTokens: 836,
    totalTokens: 1248,
    latencySeconds: 2.8,
    tokensPerSecond: 634,
    estimatedCostUsd: 0.0019,
    modelName: 'Ask AI Semantic Engine',
    contextWindowPct: 0.6,
  };

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs font-mono shadow-2xs select-none"
      title={`${data.totalTokens.toLocaleString()} tokens consumed (${data.promptTokens} in · ${data.completionTokens} out) in ${data.latencySeconds.toFixed(1)}s`}
    >
      <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
      <span className="font-semibold text-zinc-800">{data.totalTokens.toLocaleString()} tokens</span>
      <span className="text-zinc-400 font-sans text-[11px] hidden sm:inline">
        ({data.promptTokens} in · {data.completionTokens} out)
      </span>
      <span className="text-zinc-300 font-sans">•</span>
      <span className="text-zinc-500 text-[11px]">{data.latencySeconds.toFixed(1)}s</span>
    </div>
  );
};
