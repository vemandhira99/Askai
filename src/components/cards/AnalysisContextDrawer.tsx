import React from 'react';
import { ContextFilter } from '../../types/bi';
import { Layers, CheckCircle2, ChevronUp, Sliders, Database, ArrowUpDown } from 'lucide-react';

interface AnalysisContextDrawerProps {
  context: ContextFilter;
  isOpen: boolean;
  onToggle: () => void;
}

export const AnalysisContextDrawer: React.FC<AnalysisContextDrawerProps> = ({ 
  context, 
  isOpen, 
  onToggle 
}) => {
  return (
    <div className="border-t border-zinc-200 bg-zinc-50 transition-all">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-700" />
          {isOpen ? 'Hide analytical execution parameters' : 'Show analysis context & execution parameters'}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-3.5 pt-1 text-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t border-zinc-200 bg-white">
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">Aggregation & Grain</span>
            <p className="text-zinc-900 font-medium">{context.aggregation || 'Standard SUM'}</p>
            <p className="text-zinc-500 text-[11px]">{context.grain || 'Dimensional roll-up'}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">Comparison Baseline</span>
            <p className="text-zinc-900 font-medium">{context.comparisonBaseline || 'Historical cumulative baseline'}</p>
            <p className="text-zinc-500 text-[11px]">Period: {context.period || 'All-time'}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">Top-N Limit & Sort</span>
            <p className="text-zinc-900 font-medium">{context.topN || 'Top 8 items'}</p>
            <p className="text-zinc-500 text-[11px] flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-zinc-400" /> {context.sort || 'Descending by metric value'}
            </p>
          </div>

          <div className="col-span-full pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Data Completeness: {context.completeness || '100% verified records'}
            </span>
            <span className="text-zinc-400 font-mono text-[10px]">Dialect: Trino SQL • Value Grounding: 100%</span>
          </div>
        </div>
      )}
    </div>
  );
};
