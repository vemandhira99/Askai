import React, { useState } from 'react';
import { 
  ChartConfigState, 
  ChartType, 
  ColorPalette 
} from '../../types/bi';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart, 
  LayoutGrid, 
  Table as TableIcon,
  Sliders, 
  Palette, 
  Database, 
  Filter, 
  ArrowUpDown, 
  Check, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Pin, 
  Download,
  Eye,
  Type
} from 'lucide-react';

interface ChartConfigStudioProps {
  config: ChartConfigState;
  dataset: string;
  onChange: (updated: Partial<ChartConfigState>) => void;
  onReset: () => void;
  onPinToDashboard?: () => void;
  onExportCsv?: () => void;
}

export const ChartConfigStudio: React.FC<ChartConfigStudioProps> = ({
  config,
  dataset,
  onChange,
  onReset,
  onPinToDashboard,
  onExportCsv,
}) => {
  const [newFilterText, setNewFilterText] = useState('');

  const isHealth = dataset === 'wb_health_population';

  const chartTypes: { type: ChartType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'bar', label: 'Bar', icon: BarChart3 },
    { type: 'line', label: 'Line', icon: LineChart },
    { type: 'area', label: 'Area', icon: AreaChart },
    { type: 'donut', label: 'Donut', icon: PieChart },
    { type: 'treemap', label: 'Treemap', icon: LayoutGrid },
    { type: 'table', label: 'Table', icon: TableIcon },
  ];

  const metricOptions = isHealth ? [
    { value: 'AVG(mortality_rate_under5)', label: 'Under-5 Mortality Rate', unit: 'Rate / 1k' },
    { value: 'AVG(access_to_safe_water)', label: 'Access to Safe Water', unit: '%' },
    { value: 'AVG(hiv_prevalence_female)', label: 'Female HIV Prevalence', unit: '%' },
  ] : [
    { value: 'SUM(global_sales)', label: 'Global Revenue', unit: '$M' },
    { value: 'SUM(na_sales)', label: 'North America Revenue', unit: '$M' },
    { value: 'SUM(eu_sales)', label: 'Europe Revenue', unit: '$M' },
    { value: 'COUNT(*)', label: 'Catalog Title Volume', unit: 'Titles' },
    { value: 'AVG(global_sales)', label: 'Average Revenue / Title', unit: '$M' },
  ];

  const dimensionOptions = isHealth ? [
    { value: 'year', label: 'Year (1990 - 2020)' },
    { value: 'region', label: 'Global Region' },
  ] : [
    { value: 'genre', label: 'Genre Category' },
    { value: 'platform', label: 'Console / Platform' },
    { value: 'year', label: 'Release Year' },
    { value: 'publisher', label: 'Game Publisher' },
  ];

  const palettes: { id: ColorPalette; label: string; hex: string }[] = [
    { id: 'navy', label: 'Akashic Navy', hex: '#1e295b' },
    { id: 'emerald', label: 'Emerald Growth', hex: '#059669' },
    { id: 'purple', label: 'Electric Purple', hex: '#7c3aed' },
    { id: 'amber', label: 'Sunset Amber', hex: '#d97706' },
    { id: 'slate', label: 'Slate Monochrome', hex: '#334155' },
  ];

  const handleAddFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilterText.trim()) return;
    onChange({ activeFilters: [...config.activeFilters, newFilterText.trim()] });
    setNewFilterText('');
  };

  const handleRemoveFilter = (idx: number) => {
    onChange({ activeFilters: config.activeFilters.filter((_, i) => i !== idx) });
  };

  return (
    <div className="w-80 h-full border-l border-zinc-200 bg-white flex flex-col text-xs select-none shadow-sm flex-shrink-0">
      {/* 1. Header */}
      <div className="h-12 px-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1e295b] text-white flex items-center justify-center shadow-2xs font-bold">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 leading-tight">Chart Studio</h3>
            <p className="text-[10px] text-zinc-400 font-mono">Interactive Parameters</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="p-1.5 rounded hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          title="Reset configs to defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Scrollable Configuration Sections */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        
        {/* Section A: Visual Form (Chart Type) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <LayoutGrid className="w-3 h-3 text-zinc-400" />
            <span>Visual Form</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {chartTypes.map(({ type, label, icon: Icon }) => {
              const isSelected = config.chartType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ chartType: type })}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e295b] text-white border-[#1e295b] shadow-2xs font-bold'
                      : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px]">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section B: Metric & Aggregation */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <label className="font-semibold text-zinc-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <Database className="w-3 h-3 text-zinc-400" />
            <span>Metric & Aggregation</span>
          </label>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-500">Measure Column</label>
            <select
              value={config.metric}
              onChange={(e) => {
                const opt = metricOptions.find(m => m.value === e.target.value);
                onChange({ 
                  metric: e.target.value,
                  metricLabel: opt ? opt.label : e.target.value
                });
              }}
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none focus:border-[#1e295b] cursor-pointer"
            >
              {metricOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label} ({m.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-500">Aggregation Function</label>
            <div className="grid grid-cols-5 gap-1">
              {(['SUM', 'AVG', 'COUNT', 'MAX', 'MIN'] as const).map((agg) => (
                <button
                  key={agg}
                  type="button"
                  onClick={() => onChange({ aggregation: agg })}
                  className={`py-1 rounded text-[10px] font-mono font-semibold transition-all border cursor-pointer ${
                    config.aggregation === agg
                      ? 'bg-[#1e295b] text-white border-[#1e295b]'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                  }`}
                >
                  {agg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section C: Dimension & Top N Limit */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <label className="font-semibold text-zinc-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-zinc-400" />
            <span>Dimension & Grain</span>
          </label>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-500">Primary Grouping (X-Axis)</label>
            <select
              value={config.dimension}
              onChange={(e) => onChange({ dimension: e.target.value })}
              className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-[#1e295b] cursor-pointer"
            >
              {dimensionOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-500">Row Limit (Top N)</label>
            <div className="grid grid-cols-5 gap-1">
              {[5, 8, 10, 25, 100].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange({ topN: n })}
                  className={`py-1 rounded text-[10px] font-mono font-semibold transition-all border cursor-pointer ${
                    config.topN === n
                      ? 'bg-[#1e295b] text-white border-[#1e295b]'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                  }`}
                >
                  {n === 100 ? 'All' : `Top ${n}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section D: Sorting & Order */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <label className="font-semibold text-zinc-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <span>Sorting & Order</span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ sortBy: 'value' })}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                config.sortBy === 'value'
                  ? 'bg-blue-50/80 border-blue-300 font-bold text-[#1e295b]'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              By Metric Value
            </button>
            <button
              type="button"
              onClick={() => onChange({ sortBy: 'name' })}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                config.sortBy === 'name'
                  ? 'bg-blue-50/80 border-blue-300 font-bold text-[#1e295b]'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              By Name (A-Z)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ sortDirection: 'desc' })}
              className={`py-1 px-2 rounded text-[11px] border transition-all cursor-pointer ${
                config.sortDirection === 'desc'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border-zinc-200'
              }`}
            >
              Highest First (↓)
            </button>
            <button
              type="button"
              onClick={() => onChange({ sortDirection: 'asc' })}
              className={`py-1 px-2 rounded text-[11px] border transition-all cursor-pointer ${
                config.sortDirection === 'asc'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border-zinc-200'
              }`}
            >
              Lowest First (↑)
            </button>
          </div>
        </div>

        {/* Section E: Visual Palette & Styling */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <label className="font-semibold text-zinc-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-zinc-400" />
            <span>Palette & Appearance</span>
          </label>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-500">Color Theme</label>
            <div className="grid grid-cols-5 gap-1.5">
              {palettes.map((p) => {
                const isSelected = config.colorPalette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange({ colorPalette: p.id })}
                    style={{ backgroundColor: p.hex }}
                    className={`h-7 rounded-md transition-transform flex items-center justify-center cursor-pointer shadow-2xs ${
                      isSelected ? 'ring-2 ring-offset-1 ring-zinc-900 scale-105' : 'hover:opacity-90'
                    }`}
                    title={p.label}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200/80 cursor-pointer">
              <span className="text-[11px] font-medium text-zinc-700">Data Values on Chart</span>
              <input
                type="checkbox"
                checked={config.showDataLabels}
                onChange={(e) => onChange({ showDataLabels: e.target.checked })}
                className="rounded text-[#1e295b] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200/80 cursor-pointer">
              <span className="text-[11px] font-medium text-zinc-700">Show Gridlines</span>
              <input
                type="checkbox"
                checked={config.showGridlines}
                onChange={(e) => onChange({ showGridlines: e.target.checked })}
                className="rounded text-[#1e295b] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200/80 cursor-pointer">
              <span className="text-[11px] font-medium text-zinc-700">Show Legend</span>
              <input
                type="checkbox"
                checked={config.showLegend}
                onChange={(e) => onChange({ showLegend: e.target.checked })}
                className="rounded text-[#1e295b] focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section F: Title & Annotations */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <label className="font-semibold text-zinc-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
            <Type className="w-3 h-3 text-zinc-400" />
            <span>Chart Title</span>
          </label>

          <input
            type="text"
            value={config.customTitle || ''}
            placeholder="Enter custom chart title..."
            onChange={(e) => onChange({ customTitle: e.target.value })}
            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-[#1e295b]"
          />
        </div>

      </div>

      {/* 3. Action Bar Footer */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-50/80 space-y-2 flex-shrink-0">
        {onPinToDashboard && (
          <button
            type="button"
            onClick={onPinToDashboard}
            className="w-full py-2 px-3 rounded-lg bg-[#1e295b] hover:bg-[#161f46] text-white font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Pin Configured Chart to Dashboard</span>
          </button>
        )}

        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="w-full py-1.5 px-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Configured CSV</span>
          </button>
        )}
      </div>
    </div>
  );
};
