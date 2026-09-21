import React, { useState } from 'react';
import { SqlQueryItem } from '../../types/bi';
import { Code2, ChevronDown, Copy, Check, X } from 'lucide-react';

interface SqlDisclosureProps {
  queries?: SqlQueryItem[];
}

const DEFAULT_FALLBACK_QUERY: SqlQueryItem = {
  id: 'sql-default-certified',
  label: 'Certified Superset Semantic Model Query',
  sql: `-- Certified Superset Semantic Model Query (video_game_sales)
SELECT 
    name, 
    platform, 
    publisher, 
    ROUND(SUM(global_sales), 2) AS total_sales_m,
    ROUND(SUM(na_sales), 2) AS na_sales_m,
    ROUND(SUM(eu_sales), 2) AS eu_sales_m
FROM video_game_sales
WHERE global_sales > 0
GROUP BY 1, 2, 3
ORDER BY 4 DESC
LIMIT 25;`,
  executionTimeMs: 24.6,
  rowsReturned: 25,
  dialect: 'Trino SQL / PostgreSQL'
};

export const SqlDisclosure: React.FC<SqlDisclosureProps> = ({ queries = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const activeQueries = queries && queries.length > 0 ? queries : [DEFAULT_FALLBACK_QUERY];
  const currentQuery = activeQueries[selectedIdx] || activeQueries[0];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentQuery.sql);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="mt-2 mb-3 text-xs select-none">
      {/* 1. Small, neat toggle button matching user specifications */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all shadow-2xs ${
            isOpen
              ? 'bg-[#1e295b] text-white border-[#1e295b]'
              : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
          }`}
          title="Dropdown for SQL query if required, else discard"
        >
          <Code2 className={`w-3.5 h-3.5 ${isOpen ? 'text-blue-200' : 'text-zinc-500'}`} />
          <span>View SQL Query (Dropdown if required)</span>
          <span className={`text-[10px] font-mono ${isOpen ? 'text-zinc-300' : 'text-zinc-400'}`}>
            ({currentQuery.executionTimeMs}ms)
          </span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-zinc-400'}`} />
        </button>

        <span className="text-[10px] text-zinc-400 hidden sm:inline">
          • Inspect query logic if required, else discard
        </span>
      </div>

      {/* 2. Expanded neat SQL Dropdown Card */}
      {isOpen && (
        <div className="mt-2 rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-xs animate-in fade-in duration-150">
          {/* Header */}
          <div className="px-3.5 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-[#1e295b] text-white flex items-center justify-center font-mono text-[9px] font-bold flex-shrink-0">
                SQL
              </div>
              <div className="truncate">
                <span className="font-semibold text-zinc-800 text-[11px] block truncate">
                  {currentQuery.label || 'Certified Superset Semantic Model Query'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[9px] font-mono bg-zinc-200/70 text-zinc-700 px-1.5 py-0.5 rounded hidden sm:inline">
                {currentQuery.dialect || 'Trino SQL'}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[10px] font-medium transition-colors shadow-2xs"
                title="Copy SQL to clipboard"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                <span>{isCopied ? 'Copied' : 'Copy SQL'}</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-200/60 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 text-[10px] font-medium transition-colors"
                title="Discard and close SQL view"
              >
                <X className="w-3 h-3" />
                <span>Discard</span>
              </button>
            </div>
          </div>

          {/* Multiple Queries selector if > 1 */}
          {activeQueries.length > 1 && (
            <div className="px-3.5 py-1.5 bg-zinc-100/70 border-b border-zinc-200 flex items-center gap-2 text-[10px] text-zinc-600">
              <span className="font-semibold">Sub-query:</span>
              <select
                value={selectedIdx}
                onChange={(e) => setSelectedIdx(Number(e.target.value))}
                className="bg-white text-zinc-800 rounded px-2 py-0.5 border border-zinc-300 text-[10px] focus:outline-none"
              >
                {activeQueries.map((q, idx) => (
                  <option key={q.id || idx} value={idx}>#{idx + 1} {q.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* SQL Code Box */}
          <div className="p-3 bg-zinc-950 font-mono text-[11px] leading-relaxed overflow-x-auto text-zinc-100 border-b border-zinc-800">
            <pre className="selection:bg-blue-600">
              <code>{currentQuery.sql}</code>
            </pre>
          </div>

          {/* Metadata Footer with Discard link */}
          <div className="px-3.5 py-1.5 bg-zinc-50 flex items-center justify-between text-[10px] text-zinc-500">
            <div className="flex items-center gap-2 flex-wrap">
              <span>✓ Rows: <strong className="text-zinc-700">{currentQuery.rowsReturned}</strong></span>
              <span>•</span>
              <span>⏱️ Latency: <strong className="text-zinc-700">{currentQuery.executionTimeMs}ms</strong></span>
              <span>•</span>
              <span className="hidden sm:inline">Semantic Model: <code className="text-zinc-700 font-mono">video_game_sales</code></span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-900 font-medium hover:underline flex items-center gap-1 text-[10px]"
            >
              <span>Discard / Close</span>
              <span>✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
