import React, { useState, useMemo } from 'react';
import { ChartArtifact, ChartType, KeyInsight, SqlQueryItem } from '../../types/bi';
import { ChartRenderer } from '../cards/ChartRenderer';
import { QuickChartActions } from '../cards/QuickChartActions';
import { KeyInsightBanner } from '../cards/KeyInsightBanner';
import { 
  X, 
  Download, 
  Check, 
  Bookmark, 
  Copy, 
  ExternalLink,
  Search,
  ArrowUpDown
} from 'lucide-react';

interface ArtifactPaneProps {
  artifact: ChartArtifact | null;
  insight?: KeyInsight;
  sqlQueries?: SqlQueryItem[];
  activeTab: 'preview' | 'table' | 'sql' | 'insight';
  onSelectTab: (tab: 'preview' | 'table' | 'sql' | 'insight') => void;
  onClose: () => void;
  onSelectChartType: (type: ChartType) => void;
  onSelectMetric?: (metricKey: 'global' | 'na' | 'eu' | 'count') => void;
}

export const ArtifactPane: React.FC<ArtifactPaneProps> = ({
  artifact,
  insight,
  sqlQueries = [],
  activeTab,
  onSelectTab,
  onClose,
  onSelectChartType,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'global' | 'na' | 'eu' | 'count'>('global');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'value'>('value');
  const [sortAsc, setSortAsc] = useState(false);

  if (!artifact) return null;

  // Derive data according to selected metric
  const displayData = useMemo(() => {
    return artifact.data.map(d => {
      let val = d.value;
      if (selectedMetric === 'na' && (d as any).naValue !== undefined) val = (d as any).naValue;
      if (selectedMetric === 'eu' && (d as any).euValue !== undefined) val = (d as any).euValue;
      if (selectedMetric === 'count' && (d as any).count !== undefined) val = (d as any).count;
      return { ...d, value: val };
    });
  }, [artifact.data, selectedMetric]);

  const currentUnit = selectedMetric === 'count' ? 'Titles' : '$M';
  const metricLabel = selectedMetric === 'global' ? 'Global Sales ($M)' :
    selectedMetric === 'na' ? 'North America Sales ($M)' :
    selectedMetric === 'eu' ? 'Europe Sales ($M)' : 'Catalog Title Count';

  // Filtered & sorted table data
  const filteredTableData = useMemo(() => {
    let list = displayData.filter(d => 
      d.name.toLowerCase().includes(tableSearch.toLowerCase())
    );
    list.sort((a, b) => {
      if (sortField === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortAsc ? a.value - b.value : b.value - a.value;
    });
    return list;
  }, [displayData, tableSearch, sortField, sortAsc]);

  const currentSql = sqlQueries[0]?.sql || `SELECT 
    genre, 
    ROUND(SUM(global_sales), 2) AS total_global_sales_m 
FROM ${artifact.dataset} 
WHERE publisher IS NOT NULL 
GROUP BY genre 
ORDER BY total_global_sales_m DESC 
LIMIT 8;`;

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      ['Category,Value,Unit', ...displayData.map(d => `"${d.name}",${d.value},${currentUnit}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${artifact.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(currentSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const toggleSort = (field: 'name' | 'value') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="w-full flex-1 border-l border-zinc-200 bg-white flex flex-col h-full overflow-hidden select-none">
      {/* 1. Canvas Header */}
      <div className="h-12 px-4 border-b border-zinc-200 flex items-center justify-between bg-white flex-shrink-0">
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
            <span>Canvas</span>
            <span>•</span>
            <span className="text-zinc-600 font-medium">{artifact.dataset}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">{artifact.title}</h2>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs font-medium">
          <button
            onClick={() => onSelectTab('preview')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'preview' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Chart
          </button>
          <button
            onClick={() => onSelectTab('table')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'table' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Data
          </button>
          <button
            onClick={() => onSelectTab('sql')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'sql' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            SQL
          </button>
          <button
            onClick={() => onSelectTab('insight')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'insight' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Insight
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleSave}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              isSaved ? 'bg-zinc-100 border-zinc-300 text-zinc-900 font-semibold' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {isSaved ? 'Saved ✓' : 'Save'}
          </button>

          <button
            onClick={handleExportCSV}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
            title="Close Canvas"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Canvas Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* TAB 1: CHART & METRIC SLICING */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Interactive Metric & Chart Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
              <QuickChartActions currentType={artifact.type} onSelectChartType={onSelectChartType} />

              {/* Metric Selector Pill */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[11px] text-zinc-400 font-medium mr-1">Metric:</span>
                <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-[11px]">
                  <button
                    onClick={() => setSelectedMetric('global')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      selectedMetric === 'global' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setSelectedMetric('na')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      selectedMetric === 'na' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    NA
                  </button>
                  <button
                    onClick={() => setSelectedMetric('eu')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      selectedMetric === 'eu' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    EU
                  </button>
                  <button
                    onClick={() => setSelectedMetric('count')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      selectedMetric === 'count' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Titles
                  </button>
                </div>
              </div>
            </div>

            {/* Main Interactive Chart */}
            <div className="p-4 bg-zinc-50/60 rounded-xl border border-zinc-200/80">
              <ChartRenderer type={artifact.type} data={displayData} unit={currentUnit} height={310} />
            </div>

            {/* Key Insight Block */}
            <KeyInsightBanner insight={insight} />

            {/* Metadata Footer */}
            <div className="pt-3 border-t border-zinc-100 text-xs text-zinc-400 flex flex-wrap items-center justify-between font-mono text-[11px]">
              <div>Active Metric: <span className="text-zinc-800 font-medium">{metricLabel}</span></div>
              <div>Dimension: <span className="text-zinc-800 font-medium">{artifact.dimension}</span></div>
              <div>Granularity: <span className="text-zinc-800 font-medium">Category Roll-up</span></div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE DATA TABLE */}
        {activeTab === 'table' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 bg-white border border-zinc-200 rounded-md text-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-mono text-[11px]">{filteredTableData.length} records</span>
                <button
                  onClick={handleExportCSV}
                  className="text-zinc-900 font-semibold hover:underline text-xs"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 text-zinc-600 font-medium border-b border-zinc-200">
                  <tr>
                    <th className="px-3 py-2 w-10">#</th>
                    <th 
                      onClick={() => toggleSort('name')}
                      className="px-3 py-2 cursor-pointer hover:text-zinc-900"
                    >
                      <span className="inline-flex items-center gap-1">
                        <span>{artifact.dimension}</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                      </span>
                    </th>
                    <th 
                      onClick={() => toggleSort('value')}
                      className="px-3 py-2 text-right cursor-pointer hover:text-zinc-900"
                    >
                      <span className="inline-flex items-center gap-1 justify-end w-full">
                        <span>{metricLabel}</span>
                        <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                      </span>
                    </th>
                    <th className="px-3 py-2 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                  {filteredTableData.map((item, idx) => {
                    const total = displayData.reduce((a, b) => a + b.value, 0);
                    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                    return (
                      <tr key={idx} className="hover:bg-zinc-50/70">
                        <td className="px-3 py-1.5 text-zinc-400">{idx + 1}</td>
                        <td className="px-3 py-1.5 font-sans text-zinc-800">{item.name}</td>
                        <td className="px-3 py-1.5 text-right font-semibold text-zinc-900">{item.value.toLocaleString()} {currentUnit}</td>
                        <td className="px-3 py-1.5 text-right text-zinc-500">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GENERATED SQL */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500">Trino SQL Engine (46.8ms latency)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium transition-colors"
                >
                  {copiedSql ? 'Copied ✓' : 'Copy SQL'}
                </button>
                <button
                  onClick={() => alert(`Opening SQL Lab:\n\n${currentSql}`)}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-medium transition-colors"
                >
                  SQL Lab ↗
                </button>
              </div>
            </div>

            <pre className="p-3.5 bg-zinc-950 text-zinc-200 font-mono text-xs rounded-lg overflow-x-auto leading-relaxed border border-zinc-800">
              <code>{currentSql}</code>
            </pre>
          </div>
        )}

        {/* TAB 4: KEY INSIGHTS */}
        {activeTab === 'insight' && (
          <div className="space-y-3 text-xs">
            <KeyInsightBanner insight={insight} />
            <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-600 space-y-2">
              <span className="font-semibold text-zinc-800 block text-xs">Recommended Next Steps</span>
              <p className="leading-relaxed">1. Filter to top 5 publishers (Nintendo, EA, Activision, Sony, Ubisoft) to isolate franchise revenue concentration.</p>
              <p className="leading-relaxed">2. Break down North America vs Europe historical growth rates across Shooter and Role-Playing genres.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
