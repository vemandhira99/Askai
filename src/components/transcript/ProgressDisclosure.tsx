import React, { useState } from 'react';
import { OperationStep, ReasoningStep } from '../../types/bi';
import { Loader2, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ProgressDisclosureProps {
  progress?: OperationStep;
  reasoningSteps?: ReasoningStep[];
  isExecuting?: boolean;
}

export const ProgressDisclosure: React.FC<ProgressDisclosureProps> = ({
  progress,
  reasoningSteps = [],
  isExecuting = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!progress && (!reasoningSteps || reasoningSteps.length === 0)) return null;

  const completedCount = reasoningSteps.filter(s => s.status === 'completed').length;
  const totalCount = reasoningSteps.length;

  return (
    <div className="mb-3.5 rounded-xl border border-slate-200/80 bg-[#f8f9fb] p-3.5 select-none transition-all shadow-2xs">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#3b4263] group-hover:text-[#1e295b] transition-colors">
            Reasoning process
          </span>
          {isExecuting ? (
            <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-medium">
              <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
              <span>Thinking... {totalCount > 0 ? `(${completedCount}/${totalCount})` : ''}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-normal">
              ({totalCount > 0 ? `${totalCount} steps completed` : `${progress?.durationMs || 34.2}ms`})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Checklist items matching media_1789991062233.png */}
      {isOpen && (
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-2">
          {reasoningSteps.length > 0 ? (
            reasoningSteps.map((step) => {
              const isDone = step.status === 'completed';
              const isActive = step.status === 'active';
              const isFailed = step.status === 'failed';

              return (
                <div key={step.id} className="flex items-start gap-2.5 text-xs">
                  {isDone ? (
                    <div className="w-4 h-4 rounded-full bg-[#1e295b] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                    </div>
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1e295b] flex items-center justify-center flex-shrink-0 mt-0.5 ring-2 ring-blue-300/60">
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-700" />
                    </div>
                  ) : isFailed ? (
                    <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold">✕</span>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-white flex items-center justify-center flex-shrink-0 mt-0.5" />
                  )}

                  <span className={`leading-snug ${
                    isDone 
                      ? 'text-slate-700' 
                      : isActive 
                        ? 'text-slate-900 font-semibold' 
                        : isFailed 
                          ? 'text-rose-700 font-medium' 
                          : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-[#1e295b] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
              </div>
              <span>{progress?.label || 'Completed data investigation'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
