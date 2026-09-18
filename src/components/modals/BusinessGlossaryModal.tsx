import React, { useState } from 'react';
import { X, Check, ArrowRight, RefreshCw, Edit3 } from 'lucide-react';

interface BusinessGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetName: string;
}

export const BusinessGlossaryModal: React.FC<BusinessGlossaryModalProps> = ({
  isOpen,
  onClose,
  datasetName,
}) => {
  const [instructions, setInstructions] = useState(
    'Revenue always means SUM(global_sales) on video_game_sales. Fiscal year starts in July.'
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1800);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const isWb = datasetName === 'wb_health_population';

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-xl overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">Business Glossary & Semantics</h3>
            <p className="text-[11px] text-zinc-500">Configure AI business rules and catalog grounding</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Banner from Image 4 */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-700 text-white flex items-center justify-between shadow-xs">
            <div>
              <p className="font-semibold text-xs">Business glossary & rules</p>
              <p className="text-[11px] text-zinc-300">Define what terms mean and name segments without SQL - opens the AI Semantics manager.</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ml-3">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Section 1: This Dashboard - Instructions for the AI (From Image 4) */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 block">This Dashboard</span>
                <h4 className="text-xs font-bold text-zinc-900">INSTRUCTIONS FOR THE AI</h4>
              </div>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium text-xs shadow-2xs transition-colors"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-500">
              Business context the AI must respect on this dashboard - terminology, preferred metrics, rules. Applied to every question.
            </p>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder='e.g. "Revenue always means SUM(sales_amount) on v_internet_sales. Fiscal year starts in July."'
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-400 leading-relaxed"
            />
          </div>

          {/* Section 2: Dataset Semantics (From Image 4) */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 block">Dataset</span>
                <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono">{datasetName}</h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-[11px] font-medium"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh values</span>
                </button>
                <button
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-[11px] font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit semantics</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {isWb 
                ? 'Semantic coverage: 0 of 328 columns and 0 of 6 metrics described - 0 calculated columns. Adding descriptions in the dataset editor directly improves AI accuracy.'
                : 'Semantic coverage: 11 of 11 columns and 4 metrics described - 0 calculated columns. Adding descriptions in the dataset editor directly improves AI accuracy.'}
            </p>

            <div className="text-[11px] text-zinc-600 font-medium">
              Value grounding: <span className="text-zinc-900 font-semibold">{isWb ? '328 of 328 columns' : '11 of 11 columns'}</span> have knowledge status.
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Saved metrics</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-800 px-2 py-0.5 rounded-md">
                  COUNT (*)
                </span>
                <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-800 px-2 py-0.5 rounded-md">
                  COUNT(*)
                </span>
                <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-800 px-2 py-0.5 rounded-md">
                  {isWb ? 'AVG(mortality_rate_under5)' : 'SUM(global_sales)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium text-xs shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
