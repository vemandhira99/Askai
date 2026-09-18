import React, { useState } from 'react';
import { ChartArtifact, KeyInsight, ContextFilter, ChartType } from '../../types/bi';
import { ChartRenderer } from './ChartRenderer';
import { KeyInsightBanner } from './KeyInsightBanner';
import { AnalysisContextDrawer } from './AnalysisContextDrawer';
import { QuickChartActions } from './QuickChartActions';
import { 
  Maximize2, 
  Table, 
  Compass, 
  Bookmark, 
  Filter, 
  Calendar, 
  BarChart2, 
  Tag, 
  Check 
} from 'lucide-react';

interface ChartCardProps {
  chart: ChartArtifact;
  insight?: KeyInsight;
  context: ContextFilter;
  onExpandToCanvas?: (chart: ChartArtifact) => void;
  onSelectChartType?: (type: ChartType) => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  chart,
  insight,
  context,
  onExpandToCanvas,
  onSelectChartType,
}) => {
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullFilters, setShowFullFilters] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const visibleFilters = showFullFilters ? context.filters : context.filters.slice(0, 2);
  const hiddenCount = context.filters.length - 2;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* Top Card Header */}
      <div className="px-4 pt-3.5 pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            {chart.title}
          </h3>
          {/* Compact Context Line: dataset, metric, dimension, period, active filters */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              <Tag className="w-3 h-3" /> {chart.dataset}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Metric: {chart.metric}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Dim: {chart.dimension}</span>
            {chart.period && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Calendar className="w-3 h-3 text-slate-400" /> {chart.period}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Toolbar: Expand to canvas, View data, Explore, Save */}
        <div className="flex items-center gap-1 self-end sm:self-center">
          {onExpandToCanvas && (
            <button
              onClick={() => onExpandToCanvas(chart)}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
              title="Expand to Artifact Pane (Canvas mode)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onExpandToCanvas && onExpandToCanvas(chart)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="View underlying data table"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert(`Exploring chart in deep-dive mode for ${chart.title}`)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Explore dimensions in Superset Explore"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className={`p-1.5 rounded transition-colors ${
              isSaved ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            title="Save chart to dashboard"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Filters Bar */}
      <div className="px-4 py-1.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="font-semibold text-slate-500 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" /> Filters:
        </span>
        {context.filters.length === 0 ? (
          <span className="italic text-slate-400">No active filters (Full dataset)</span>
        ) : (
          <>
            {visibleFilters.map((f, i) => (
              <span key={i} className="bg-white border border-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded-full text-[10px]">
                {f}
              </span>
            ))}
            {hiddenCount > 0 && !showFullFilters && (
              <button
                onClick={() => setShowFullFilters(true)}
                className="text-indigo-600 font-medium hover:underline text-[10px]"
              >
                +{hiddenCount} more
              </button>
            )}
            {showFullFilters && hiddenCount > 0 && (
              <button
                onClick={() => setShowFullFilters(false)}
                className="text-slate-500 hover:underline text-[10px]"
              >
                (less)
              </button>
            )}
          </>
        )}
      </div>

      {/* Main Chart Body */}
      <div className="p-4">
        <ChartRenderer type={chart.type} data={chart.data} unit={chart.unit} />
        
        {/* Quick Chart transformation bar */}
        {onSelectChartType && (
          <QuickChartActions 
            currentType={chart.type} 
            onSelectChartType={onSelectChartType} 
          />
        )}

        {/* 2. Key insight immediately below each chart */}
        <KeyInsightBanner insight={insight} isPreparing={!insight} />
      </div>

      {/* Analysis Context Drawer (Expandable) */}
      <AnalysisContextDrawer
        context={context}
        isOpen={isAnalysisDrawerOpen}
        onToggle={() => setIsAnalysisDrawerOpen(!isAnalysisDrawerOpen)}
      />
    </div>
  );
};
