import React, { useState, useMemo } from 'react';
import { ChartArtifact, ChartType, KeyInsight, SqlQueryItem, ChartConfigState, ColorPalette } from '../../types/bi';
import { ChartRenderer } from '../cards/ChartRenderer';
import { KeyInsightBanner } from '../cards/KeyInsightBanner';
import { ChartConfigStudio } from './ChartConfigStudio';
import { 
  VGS_GENRE_DATA, 
  VGS_PLATFORM_NA_DATA, 
  VGS_TREND_DATA, 
  TOP_25_PUBLISHERS_DATA,
  WB_MORTALITY_DATA,
  WB_WATER_DATA,
  WB_HIV_DATA
} from '../../data/mockData';
import { 
  X, 
  Download, 
  Check, 
  Pin, 
  Copy, 
  Search,
  ArrowUpDown,
  Sliders,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface ArtifactPaneProps {
  artifact: ChartArtifact | null;
  insight?: KeyInsight;
  sqlQueries?: SqlQueryItem[];
  activeTab: 'preview' | 'table' | 'sql' | 'insight';
  onSelectTab: (tab: 'preview' | 'table' | 'sql' | 'insight') => void;
  onClose: () => void;
  onSelectChartType?: (type: ChartType) => void;
  onPinToDashboard?: (chart: ChartArtifact) => void;
}

export const ArtifactPane: React.FC<ArtifactPaneProps> = ({
  artifact,
  insight,
  sqlQueries = [],
  activeTab,
  onSelectTab,
  onClose,
  onSelectChartType,
  onPinToDashboard,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(true);

  const isHealth = artifact?.dataset === 'wb_health_population';

  // Live Chart Configuration State
  const [config, setConfig] = useState<ChartConfigState>({
    chartType: artifact?.type || 'bar',
    metric: isHealth ? 'AVG(mortality_rate_under5)' : 'SUM(global_sales)',
    metricLabel: isHealth ? 'Under-5 Mortality Rate' : 'Global Revenue',
    aggregation: isHealth ? 'AVG' : 'SUM',
    dimension: isHealth ? 'year' : 'genre',
    topN: 8,
    sortBy: 'value',
    sortDirection: 'desc',
    colorPalette: 'navy',
    showDataLabels: false,
    showGridlines: true,
    showLegend: true,
    activeFilters: isHealth 
      ? ['year >= 1990', 'country_code IS NOT NULL']
      : ['publisher IS NOT NULL', 'global_sales > 0'],
    customTitle: artifact?.title || 'Chart Configuration',
  });

  // Sync config when selected artifact changes
  React.useEffect(() => {
    if (artifact) {
      setConfig(prev => ({
        ...prev,
        chartType: artifact.type,
        customTitle: artifact.title,
      }));
    }
  }, [artifact?.id, artifact?.type, artifact?.title]);

  const handleConfigChange = (updated: Partial<ChartConfigState>) => {
    setConfig(prev => ({ ...prev, ...updated }));
    if (updated.chartType && onSelectChartType) {
      onSelectChartType(updated.chartType);
    }
  };

  const handleResetConfig = () => {
    if (!artifact) return;
    setConfig({
      chartType: artifact.type,
      metric: isHealth ? 'AVG(mortality_rate_under5)' : 'SUM(global_sales)',
      metricLabel: isHealth ? 'Under-5 Mortality Rate' : 'Global Revenue',
      aggregation: isHealth ? 'AVG' : 'SUM',
      dimension: isHealth ? 'year' : 'genre',
      topN: 8,
      sortBy: 'value',
      sortDirection: 'desc',
      colorPalette: 'navy',
      showDataLabels: false,
      showGridlines: true,
      showLegend: true,
      activeFilters: isHealth 
        ? ['year >= 1990', 'country_code IS NOT NULL']
        : ['publisher IS NOT NULL', 'global_sales > 0'],
      customTitle: artifact.title,
    });
  };

  // Derive base series based on selected dimension
  const baseRawData = useMemo(() => {
    if (isHealth) {
      if (config.metric.includes('safe_water')) return WB_WATER_DATA;
      if (config.metric.includes('hiv')) return WB_HIV_DATA;
      return WB_MORTALITY_DATA;
    }

    if (config.dimension === 'platform') return VGS_PLATFORM_NA_DATA;
    if (config.dimension === 'year') return VGS_TREND_DATA;
    if (config.dimension === 'publisher') {
      return TOP_25_PUBLISHERS_DATA.map(p => ({
        name: p.name,
        value: p.value * 95.4,
        count: p.value,
        naValue: p.value * 52.1,
        euValue: p.value * 28.3,
      }));
    }
    return VGS_GENRE_DATA;
  }, [config.dimension, config.metric, isHealth]);

  // Derive transformed display data based on metric, sort, topN
  const displayData = useMemo(() => {
    const list = baseRawData.map(d => {
      let val = d.value;
      if (config.metric.includes('na_sales') && (d as any).naValue !== undefined) val = (d as any).naValue;
      if (config.metric.includes('eu_sales') && (d as any).euValue !== undefined) val = (d as any).euValue;
      if (config.metric.includes('COUNT') && (d as any).count !== undefined) val = (d as any).count;
      if (config.metric.includes('AVG') && (d as any).count) val = +(d.value / (d as any).count).toFixed(2);
      return { ...d, value: val };
    });

    // Sorting
    list.sort((a, b) => {
      if (config.sortBy === 'name') {
        return config.sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return config.sortDirection === 'asc' ? a.value - b.value : b.value - a.value;
    });

    // Top N
    return list.slice(0, config.topN);
  }, [baseRawData, config.metric, config.sortBy, config.sortDirection, config.topN]);

  const currentUnit = isHealth 
    ? (config.metric.includes('mortality') ? '/ 1k' : '%')
    : (config.metric.includes('COUNT') ? 'Titles' : '$M');

  // Filtered & sorted table data
  const filteredTableData = useMemo(() => {
    return displayData.filter(d => 
      d.name.toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [displayData, tableSearch]);

  // Dynamically constructed Trino SQL
  const dynamicSql = useMemo(() => {
    if (!artifact) return '';
    const metricCol = isHealth 
      ? (config.metric.includes('mortality') ? 'mortality_rate_under5' : config.metric.includes('water') ? 'access_to_safe_water' : 'hiv_prevalence_female')
      : (config.metric.includes('na_sales') ? 'na_sales' : config.metric.includes('eu_sales') ? 'eu_sales' : 'global_sales');
    
    const alias = isHealth ? 'metric_value' : (config.metric.includes('COUNT') ? 'title_count' : 'total_sales_m');
    const aggExpr = config.metric.includes('COUNT') ? 'COUNT(*)' : `ROUND(${config.aggregation}(${metricCol}), 2)`;

    return `SELECT 
    ${config.dimension},
    ${aggExpr} AS ${alias}
FROM ${artifact.dataset}
WHERE ${config.activeFilters.join('\n  AND ')}
GROUP BY ${config.dimension}
ORDER BY ${config.sortBy === 'value' ? alias : config.dimension} ${config.sortDirection.toUpperCase()}
LIMIT ${config.topN};`;
  }, [artifact?.dataset, config, isHealth]);

  const handleExportCSV = () => {
    if (!artifact) return;
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      ['Category,Value,Unit', ...displayData.map(d => `"${d.name}",${d.value},${currentUnit}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(config.customTitle || artifact.title).toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    if (!artifact) return;
    setIsSaved(true);
    if (onPinToDashboard) {
      onPinToDashboard({
        ...artifact,
        title: config.customTitle || artifact.title,
        type: config.chartType,
        metric: config.metric,
        dimension: config.dimension,
        unit: currentUnit,
        data: displayData,
      });
    }
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(dynamicSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (!artifact) {
    return (
      <div className="w-full flex-1 border-l border-zinc-200 bg-white flex flex-col h-full items-center justify-center p-8 select-none">
        <div className="text-center text-zinc-400">
          <p className="text-sm font-medium">No chart selected for Canvas</p>
          <button 
            onClick={onClose}
            className="mt-3 px-3 py-1.5 text-xs bg-[#1e295b] text-white rounded-md hover:bg-[#161f46]"
          >
            Close Canvas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 border-l border-zinc-200 bg-white flex flex-col h-full overflow-hidden select-none">
      {/* 1. Canvas Main Header */}
      <div className="h-12 px-4 border-b border-zinc-200 flex items-center justify-between bg-white flex-shrink-0">
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
            <span className="font-semibold text-[#1e295b]">Akashic Canvas</span>
            <span>•</span>
            <span className="text-zinc-600 font-medium">{artifact.dataset}</span>
            <span>•</span>
            <span className="text-zinc-400">{config.dimension}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
            {config.customTitle || artifact.title}
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs font-medium">
          <button
            onClick={() => onSelectTab('preview')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => onSelectTab('table')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'table' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Data Table
          </button>
          <button
            onClick={() => onSelectTab('sql')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'sql' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Trino SQL
          </button>
          <button
            onClick={() => onSelectTab('insight')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'insight' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Insights
          </button>
        </div>

        {/* Actions & Studio Toggle */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setIsStudioOpen(!isStudioOpen)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isStudioOpen
                ? 'bg-[#1e295b] text-white border-[#1e295b] shadow-2xs'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
            title="Toggle Chart Configuration Studio"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Chart Configs</span>
          </button>

          <button
            onClick={handleSave}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              isSaved 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
            title="Pin chart to Dashboard"
          >
            {isSaved ? <Check className="w-3 h-3 text-emerald-600" /> : <Pin className="w-3 h-3 text-zinc-500" />}
            <span>{isSaved ? 'Pinned ✓' : 'Pin to Dashboard'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
            title="Close Canvas"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Canvas Body with Chart Viewport & Studio Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Center: Viewport Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#fbfcfd]">
          {/* TAB 1: CHART VIEWPORT */}
          {activeTab === 'preview' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Quick Info Summary Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-2xs">
                  <span className="text-[10px] text-zinc-400 font-medium uppercase font-mono">Measure</span>
                  <div className="text-sm font-bold text-zinc-900 mt-0.5">{config.metricLabel}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-2xs">
                  <span className="text-[10px] text-zinc-400 font-medium uppercase font-mono">Top Segment</span>
                  <div className="text-sm font-bold text-[#1e295b] mt-0.5">
                    {displayData[0]?.name || 'N/A'} ({displayData[0]?.value.toLocaleString()} {currentUnit})
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-2xs">
                  <span className="text-[10px] text-zinc-400 font-medium uppercase font-mono">Row Count</span>
                  <div className="text-sm font-bold text-zinc-900 mt-0.5 font-mono">
                    {displayData.length} active of {config.topN === 100 ? 'all' : config.topN}
                  </div>
                </div>
              </div>

              {/* Main Interactive Chart Box */}
              <div className="p-5 bg-white rounded-xl border border-zinc-200/80 shadow-xs">
                <ChartRenderer 
                  type={config.chartType} 
                  data={displayData} 
                  unit={currentUnit} 
                  height={320} 
                  colorPalette={config.colorPalette}
                  showDataLabels={config.showDataLabels}
                  showGridlines={config.showGridlines}
                  showLegend={config.showLegend}
                />
              </div>

              {/* Key Insight Block */}
              <KeyInsightBanner insight={insight} />

              {/* Footer Metadata Strip */}
              <div className="p-3 bg-white rounded-xl border border-zinc-200/80 text-xs text-zinc-500 flex flex-wrap items-center justify-between font-mono text-[11px] shadow-2xs">
                <div>Metric: <span className="text-zinc-900 font-semibold">{config.metric}</span></div>
                <div>Dimension: <span className="text-zinc-900 font-semibold">{config.dimension}</span></div>
                <div>Color Palette: <span className="capitalize text-zinc-900 font-semibold">{config.colorPalette}</span></div>
                <div>Sort: <span className="text-zinc-900 font-semibold">{config.sortBy} ({config.sortDirection.toUpperCase()})</span></div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE DATA TABLE */}
          {activeTab === 'table' && (
            <div className="space-y-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:outline-none focus:border-[#1e295b]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">{filteredTableData.length} records</span>
                  <button
                    onClick={handleExportCSV}
                    className="text-[#1e295b] font-semibold hover:underline text-xs cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 text-zinc-600 font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="px-3 py-2 w-10">#</th>
                      <th className="px-3 py-2 capitalize">{config.dimension}</th>
                      <th className="px-3 py-2 text-right">{config.metricLabel} ({currentUnit})</th>
                      <th className="px-3 py-2 text-right">Share (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                    {filteredTableData.map((item, idx) => {
                      const total = displayData.reduce((a, b) => a + b.value, 0);
                      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                      return (
                        <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                          <td className="px-3 py-2 text-zinc-400">{idx + 1}</td>
                          <td className="px-3 py-2 font-sans font-medium text-zinc-900">{item.name}</td>
                          <td className="px-3 py-2 text-right font-bold text-zinc-900">{item.value.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-zinc-500">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GENERATED TRINO SQL */}
          {activeTab === 'sql' && (
            <div className="space-y-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-mono text-zinc-700 font-semibold">Deterministic Trino SQL (Live Engine Sync)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedSql ? 'Copied ✓' : 'Copy SQL'}
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-zinc-950 text-zinc-200 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-zinc-800 shadow-md">
                <code>{dynamicSql}</code>
              </pre>
            </div>
          )}

          {/* TAB 4: KEY INSIGHTS */}
          {activeTab === 'insight' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <KeyInsightBanner insight={insight} />
              <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs text-zinc-700 space-y-2 text-xs">
                <span className="font-bold text-zinc-900 block text-xs">Analytical Drill-Down Options</span>
                <p className="leading-relaxed">1. Switch primary dimension to <strong>Publisher</strong> or <strong>Platform</strong> to test concentration vulnerability.</p>
                <p className="leading-relaxed">2. Toggle visual form to <strong>Treemap</strong> to inspect relative category share across all tiers.</p>
                <p className="leading-relaxed">3. Pin customized visualization directly to your executive dashboard.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Embedded Chart Configuration Studio */}
        {isStudioOpen && (
          <ChartConfigStudio
            config={config}
            dataset={artifact.dataset}
            onChange={handleConfigChange}
            onReset={handleResetConfig}
            onPinToDashboard={handleSave}
            onExportCsv={handleExportCSV}
          />
        )}
      </div>
    </div>
  );
};
