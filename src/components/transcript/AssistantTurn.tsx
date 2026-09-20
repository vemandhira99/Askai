import React, { useState } from 'react';
import { MessageTurn, ChartArtifact, ChartType } from '../../types/bi';
import { ChartRenderer } from '../cards/ChartRenderer';
import { QuickChartActions } from '../cards/QuickChartActions';
import { KeyInsightBanner } from '../cards/KeyInsightBanner';
import { SqlDisclosure } from '../cards/SqlDisclosure';
import { SuggestedActions } from '../composer/SuggestedActions';
import { ProgressDisclosure } from './ProgressDisclosure';
import { MarkdownMessage } from './MarkdownMessage';
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Undo2, 
  Check, 
  AlertCircle,
  ArrowUpRight,
  Pin
} from 'lucide-react';

interface AssistantTurnProps {
  turn: MessageTurn;
  isLatest: boolean;
  onExpandToCanvas: (chart: ChartArtifact) => void;
  onSelectSuggestion: (prompt: string) => void;
  onQuickChartType: (type: ChartType) => void;
  onUndo: () => void;
  onRetry: (turnId: string, mode: 'network' | 'analytical') => void;
  onPinChartToDashboard?: (chart: ChartArtifact) => void;
}

export const AssistantTurn: React.FC<AssistantTurnProps> = ({
  turn,
  isLatest,
  onExpandToCanvas,
  onSelectSuggestion,
  onQuickChartType,
  onUndo,
  onRetry,
  onPinChartToDashboard,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const data = turn.assistantData;
  if (!data) return null;

  const handleCopyAnswer = () => {
    const textToCopy = `${data.insight ? data.insight.headline + '\n' + data.insight.narrative : ''}\n${data.analyticalSummary || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="mb-8 w-full transition-all">
      {/* 0. Subtle reasoning execution status */}
      <ProgressDisclosure progress={data.operationProgress} />

      {/* Error state if failed */}
      {data.error && (
        <div className="mb-4 p-3.5 rounded-lg border border-rose-200 bg-rose-50/50 text-rose-800 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{data.error.message}</p>
              {data.analyticalSummary && <p className="mt-1 text-rose-700">{data.analyticalSummary}</p>}
            </div>
          </div>
        </div>
      )}

      {/* 1. Codex Artifact Card (Clean & Minimalist) */}
      {data.chart && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden mb-3">
          {/* Artifact Header Banner */}
          <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-mono text-zinc-400 block">{data.chart.dataset} • {data.chart.metric}</span>
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">{data.chart.title}</h3>
            </div>

            <div className="flex items-center gap-1.5">
              {onPinChartToDashboard && (
                <button
                  onClick={() => onPinChartToDashboard(data.chart!)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors shadow-2xs"
                  title="Pin this chart to your Superset dashboard on the left"
                >
                  <Pin className="w-3 h-3 text-[#1e295b]" />
                  <span>Pin to Dashboard</span>
                </button>
              )}

              <button
                onClick={() => onExpandToCanvas(data.chart!)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-2xs"
                title="Open full interactive artifact in Canvas"
              >
                <span>Canvas</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chart preview & quick chart bar */}
          <div className="p-4">
            <ChartRenderer type={data.chart.type} data={data.chart.data} unit={data.chart.unit} height={210} />
            <QuickChartActions currentType={data.chart.type} onSelectChartType={onQuickChartType} />
            <KeyInsightBanner insight={data.insight} isPreparing={!data.insight} />
          </div>
        </div>
      )}

      {/* 2. Key Insight Banner (if standalone insight without chart) */}
      {data.insight && !data.chart && (
        <div className="mb-3">
          <KeyInsightBanner insight={data.insight} />
        </div>
      )}

      {/* 3. Analytical Narrative (Rich Executive Rendering) */}
      {data.analyticalSummary && !data.error && (
        <MarkdownMessage content={data.analyticalSummary} />
      )}

      {/* 4. Suggested Follow-up Prompts */}
      <SuggestedActions
        suggestions={data.suggestions}
        onSelectSuggestion={onSelectSuggestion}
      />

      {/* 6. Subtle Turn Actions Bar */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyAnswer}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors shadow-2xs"
            title="Copy answer formatted for Slack or Email"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-500" />}
            <span className="text-[11px]">{isCopied ? 'Copied to Clipboard!' : 'Copy for Slack / Email'}</span>
          </button>

          <button
            onClick={() => setLiked(liked === true ? null : true)}
            className={`p-1 rounded hover:bg-zinc-100 transition-colors ${liked === true ? 'text-zinc-900 font-bold' : 'hover:text-zinc-700'}`}
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => setLiked(liked === false ? null : false)}
            className={`p-1 rounded hover:bg-zinc-100 transition-colors ${liked === false ? 'text-zinc-900 font-bold' : 'hover:text-zinc-700'}`}
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRetry(turn.id, 'analytical')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-zinc-600 hover:bg-zinc-100 text-[11px] transition-colors"
            title="Retry analytical query"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>

          {isLatest && (
            <button
              onClick={onUndo}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] transition-colors font-medium"
              title="Undo this turn and return prompt to composer"
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
