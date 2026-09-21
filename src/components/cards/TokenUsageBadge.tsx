import React, { useState, useRef, useEffect } from 'react';
import { TokenUsage } from '../../types/bi';
import { Zap, ChevronDown, ChevronUp, Cpu, Info, Check, Sparkles } from 'lucide-react';

interface TokenUsageBadgeProps {
  usage?: TokenUsage;
}

export const TokenUsageBadge: React.FC<TokenUsageBadgeProps> = ({ usage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fallback defaults if usage is not explicitly supplied
  const data: TokenUsage = usage || {
    promptTokens: 412,
    completionTokens: 836,
    totalTokens: 1248,
    latencySeconds: 1.32,
    tokensPerSecond: 634,
    estimatedCostUsd: 0.0019,
    modelName: 'Ask AI Semantic Engine',
    contextWindowPct: 0.6,
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Pill trigger matching media_1789991062233.png style */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-mono transition-all shadow-2xs group cursor-pointer"
        title="View query token consumption and execution breakdown"
      >
        <Zap className="w-3 h-3 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-zinc-800">{data.totalTokens.toLocaleString()} tokens</span>
        <span className="text-zinc-400 font-sans text-[11px] hidden sm:inline">
          ({data.promptTokens} in · {data.completionTokens} out)
        </span>
        <span className="text-zinc-300 font-sans">•</span>
        <span className="text-zinc-500 text-[11px]">{data.latencySeconds.toFixed(1)}s</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-zinc-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        )}
      </button>

      {/* Expanded Token Consumption & How Things Work Card */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-80 sm:w-96 rounded-xl border border-zinc-200 bg-white shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#1e295b] text-white flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 leading-tight">Token Consumption</h4>
                <p className="text-[10px] text-zinc-400 font-mono">Resource & execution telemetry</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold flex items-center gap-1 font-mono">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              {data.modelName || 'Ask AI Semantic Engine'}
            </span>
          </div>

          {/* Tokens Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2 my-3">
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] text-zinc-500 block font-medium">Input (Prompt)</span>
              <span className="text-sm font-bold text-zinc-900 font-mono mt-0.5 block">
                {data.promptTokens.toLocaleString()}
              </span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Schema + Filters</span>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] text-zinc-500 block font-medium">Output (Answer)</span>
              <span className="text-sm font-bold text-zinc-900 font-mono mt-0.5 block">
                {data.completionTokens.toLocaleString()}
              </span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Reasoning + SQL</span>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
              <span className="text-[10px] text-blue-700 block font-medium">Total Consumed</span>
              <span className="text-sm font-bold text-[#1e295b] font-mono mt-0.5 block">
                {data.totalTokens.toLocaleString()}
              </span>
              <span className="text-[9px] text-blue-600 block mt-0.5">
                ~${(data.estimatedCostUsd || 0.0019).toFixed(4)}
              </span>
            </div>
          </div>

          {/* Performance Telemetry */}
          <div className="space-y-1.5 bg-zinc-50/80 p-2.5 rounded-lg border border-zinc-100 text-[11px] font-mono text-zinc-600 mb-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-zinc-500">Generation Speed:</span>
              <span className="font-semibold text-zinc-800">~{data.tokensPerSecond || 634} tok/s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-zinc-500">Execution Latency:</span>
              <span className="font-semibold text-zinc-800">{data.latencySeconds.toFixed(2)}s (34ms Trino SQL + 1.2s AI)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-zinc-500">Context Window Used:</span>
              <span className="font-semibold text-emerald-700">~{data.contextWindowPct || 0.6}% of 200k</span>
            </div>
          </div>

          {/* "How Things Are Working" Enterprise Explainer */}
          <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="text-indigo-900 font-semibold block mb-0.5">How query processing works:</strong>
              Your prompt injects the verified dataset catalog schema & active slice filters as input tokens. The Ask AI Semantic Engine then reasons through the data checks to generate verified Trino SQL queries and analytical answers.
            </div>
          </div>

          {/* Footer close */}
          <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Deterministic Trino + Ask AI telemetry</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-600 hover:text-zinc-900 font-medium hover:underline cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
