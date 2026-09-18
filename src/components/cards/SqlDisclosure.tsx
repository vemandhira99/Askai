import React, { useState } from 'react';
import { SqlQueryItem } from '../../types/bi';
import { ChevronDown, Copy, Check, ExternalLink } from 'lucide-react';

interface SqlDisclosureProps {
  queries: SqlQueryItem[];
}

export const SqlDisclosure: React.FC<SqlDisclosureProps> = ({ queries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!queries || queries.length === 0) return null;

  const currentQuery = queries[selectedIdx] || queries[0];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentQuery.sql);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-lg border border-zinc-200 overflow-hidden bg-white text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-zinc-600 bg-zinc-50 hover:bg-zinc-100/70 transition-colors"
      >
        <span className="font-mono text-zinc-700 font-medium">
          View generated SQL <span className="text-zinc-400">({currentQuery.rowsReturned} rows, {currentQuery.executionTimeMs}ms)</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-3 bg-zinc-950 text-zinc-200 border-t border-zinc-200 font-mono text-[11px]">
          {queries.length > 1 && (
            <div className="mb-2 pb-2 border-b border-zinc-800 flex items-center gap-2 text-zinc-400">
              <span className="font-sans">Query:</span>
              <select
                value={selectedIdx}
                onChange={(e) => setSelectedIdx(Number(e.target.value))}
                className="bg-zinc-900 text-zinc-200 rounded px-2 py-0.5 border border-zinc-800 focus:outline-none"
              >
                {queries.map((q, idx) => (
                  <option key={q.id} value={idx}>#{idx + 1} {q.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between mb-2 text-[10px] text-zinc-400">
            <span>{currentQuery.dialect || 'Trino SQL'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => alert(`Opening SQL Lab:\n\n${currentQuery.sql}`)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>SQL Lab</span>
              </button>
            </div>
          </div>

          <pre className="p-2.5 bg-zinc-900 rounded overflow-x-auto text-zinc-300 leading-relaxed">
            <code>{currentQuery.sql}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
