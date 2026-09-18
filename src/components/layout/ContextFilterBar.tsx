import React, { useState } from 'react';
import { ContextFilter } from '../../types/bi';
import { AVAILABLE_DATASETS } from '../../data/mockData';
import { Database, X, Check, Filter } from 'lucide-react';

interface ContextFilterBarProps {
  context: ContextFilter;
  onSwitchDataset: (datasetId: string) => void;
  onToggleContextDrawer: () => void;
  isContextDrawerOpen: boolean;
  onRemoveFilter?: (filterName: string) => void;
}

export const ContextFilterBar: React.FC<ContextFilterBarProps> = ({
  context,
  onSwitchDataset,
  onToggleContextDrawer,
  isContextDrawerOpen,
  onRemoveFilter,
}) => {
  const [showDatasetModal, setShowDatasetModal] = useState(false);

  return (
    <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between text-xs text-zinc-600 select-none flex-shrink-0 gap-y-1.5">
      {/* Left: Context: Current dashboard + Dataset chip + Edit datasets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-zinc-500 font-medium">Context:</span>
        <span className="text-zinc-800 font-medium">Current dashboard</span>

        {/* Dataset badge with remove / switch */}
        <div className="inline-flex items-center gap-1.5 bg-zinc-200/80 hover:bg-zinc-200 text-zinc-800 font-mono text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors">
          <span>{context.dataset}</span>
          <button
            onClick={() => setShowDatasetModal(true)}
            className="text-zinc-500 hover:text-zinc-900 rounded p-0.5"
            title="Switch dataset"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Edit datasets button (From Image 1 & 4) */}
        <button
          onClick={() => setShowDatasetModal(true)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 px-2 py-0.5 rounded hover:bg-zinc-100 transition-colors"
          title="Open dataset manager"
        >
          <Database className="w-3 h-3 text-zinc-500" />
          <span>Edit datasets</span>
        </button>

        {/* Active Filter Chips with Remove Action */}
        {context.filters.map((flt, idx) => (
          <span
            key={idx}
            className="hidden sm:inline-flex items-center gap-1 bg-white border border-zinc-200 text-zinc-700 font-mono text-[10px] px-1.5 py-0.5 rounded"
          >
            <span className="truncate max-w-[130px]">{flt}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter(flt)}
                className="text-zinc-400 hover:text-zinc-700 ml-0.5"
                title="Remove filter"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Right: Parameter Drawer Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleContextDrawer}
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
            isContextDrawerOpen 
              ? 'bg-zinc-200 text-zinc-900 font-semibold' 
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>{isContextDrawerOpen ? 'Hide Parameters' : 'Parameters'}</span>
        </button>
      </div>

      {/* Dataset Picker Modal */}
      {showDatasetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-900">Select Active Dataset</h3>
                <p className="text-[11px] text-zinc-500">Choose catalog for Ask AI queries</p>
              </div>
              <button
                onClick={() => setShowDatasetModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
              {AVAILABLE_DATASETS.map((ds) => {
                const isSelected = ds.id === context.dataset;
                return (
                  <button
                    key={ds.id}
                    onClick={() => {
                      onSwitchDataset(ds.id);
                      setShowDatasetModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      isSelected 
                        ? 'border-zinc-900 bg-zinc-50 shadow-2xs' 
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-semibold text-zinc-900">
                      <span>@{ds.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-zinc-900" />}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">{ds.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                      <span>{ds.records}</span>
                      <span>•</span>
                      <span>{ds.columns} columns</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setShowDatasetModal(false)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
