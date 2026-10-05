import React, { useRef, useEffect, useState } from 'react';
import { MessageTurn, ChartArtifact, ChartType, UserProfile, DashboardViewMode } from '../../types/bi';
import { UserTurn } from './UserTurn';
import { AssistantTurn } from './AssistantTurn';
import { ArrowDown, Sparkles, BarChart2, TrendingUp, Globe, AlertCircle, LayoutTemplate, Copy, Check, ChevronRight, Database, Code2 } from 'lucide-react';

interface TranscriptViewProps {
  turns: MessageTurn[];
  onSelectPrompt: (prompt: string) => void;
  onExpandToCanvas: (chart: ChartArtifact) => void;
  onSelectSuggestion: (prompt: string) => void;
  onQuickChartType: (turnId: string, type: ChartType) => void;
  onUndo: () => void;
  onRetry: (turnId: string, mode: 'network' | 'analytical') => void;
  datasetName: string;
  userProfile?: UserProfile;
  dashboardViewMode?: DashboardViewMode;
  onAutoGenerateStarter?: () => void;
  onPinChartToDashboard?: (chart: ChartArtifact) => void;
  onApplyQuickFilter?: (filter: 'all' | 'na' | 'nintendo' | '2000s') => void;
  activeDashboardFilter?: string;
  aiRole?: 'business' | 'data_analyst';
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  turns,
  onSelectPrompt,
  onExpandToCanvas,
  onSelectSuggestion,
  onQuickChartType,
  onUndo,
  onRetry,
  datasetName,
  userProfile = { name: 'Veman', role: 'Lead Analyst', email: 'veman@akashic.bi', avatar: 'V' },
  dashboardViewMode = 'populated',
  onAutoGenerateStarter,
  onPinChartToDashboard,
  onApplyQuickFilter,
  activeDashboardFilter = 'all',
  aiRole = 'business',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [copiedTeams, setCopiedTeams] = useState(false);
  const [isMeetingPrepActive, setIsMeetingPrepActive] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [turns]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setShowScrollBottom(false);
    }
  };

  const starterPills = datasetName === 'wb_health_population' ? [
    'What is the trend in child mortality over the years?',
    'How does access to safe water vary by region?',
    'Compare HIV rates in females across regions',
  ] : [
    'What is the total global sales by genre?',
    'Which platform has the highest sales in North America?',
    'How have global sales trends changed over the years?',
  ];

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth relative"
    >
      <div className="max-w-2xl mx-auto w-full">
        {turns.length === 0 ? (
          aiRole === 'data_analyst' ? (
            /* ========================================================================= */
            /* DATA ANALYST (DA) STARTER WORKSPACE: SCHEMA, METRICS & SQL STUDIO         */
            /* ========================================================================= */
            <div className="py-2 space-y-4 animate-in fade-in duration-200">
              {/* DA Header */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 font-mono">
                  DA
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">
                      Data Analyst Copilot
                    </h2>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-blue-100 text-blue-800 border border-blue-200">
                      DA Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight font-mono">
                    Model: <span className="font-semibold text-zinc-700">{datasetName}</span> • 16,598 rows • Trino SQL
                  </p>
                </div>
              </div>

              {/* Schema & Semantic Model Card */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden text-xs">
                <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-wide font-mono">
                      Semantic Model Schema ({datasetName})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-200/70 px-1.5 py-0.5 rounded">
                    Trino Dialect
                  </span>
                </div>

                <div className="p-3.5 space-y-3">
                  {/* Dimensions */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 font-mono">
                      Dimensions (Categorical Columns)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['name (VARCHAR)', 'platform (VARCHAR)', 'year (INT)', 'genre (VARCHAR)', 'publisher (VARCHAR)'].map((col) => (
                        <span key={col} className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px]">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 font-mono">
                      Calculated Metrics & Measures
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['SUM(global_sales)', 'SUM(na_sales)', 'SUM(eu_sales)', 'SUM(jp_sales)', 'SUM(other_sales)', 'COUNT(name)'].map((metric) => (
                        <span key={metric} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[10px] font-medium">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Slices */}
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 flex items-center justify-between">
                    <span>9 Certified Superset visual slices mapped to this semantic model</span>
                    <span className="font-mono text-zinc-500 text-[10px]">Certified</span>
                  </div>
                </div>

                {/* Footer with Canvas studio shortcut */}
                <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">Authoring & Chart Studio</span>
                  <button
                    onClick={() => {
                      if (onExpandToCanvas) {
                        onExpandToCanvas({
                          id: 'chart-canvas-studio',
                          type: 'bar',
                          title: 'Global Sales by Genre',
                          dataset: 'video_game_sales',
                          metric: 'SUM(global_sales)',
                          dimension: 'genre',
                          unit: '$M',
                          availableTypes: ['bar', 'line', 'donut', 'table'],
                          data: [
                            { name: 'Action', value: 1751.18 },
                            { name: 'Sports', value: 1330.93 },
                            { name: 'Shooter', value: 1037.37 },
                            { name: 'Role-Playing', value: 927.37 },
                            { name: 'Platform', value: 831.37 },
                          ]
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Open in Canvas Studio</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>

              {/* Data Analyst Prompts */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-zinc-500 block font-mono">
                  Recommended Data Analyst Queries:
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onSelectPrompt("Show me global sales by genre with Trino SQL")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span className="font-mono text-zinc-900">Show me global sales by genre (Trino SQL)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Filter where publisher is null or missing and inspect anomaly")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span className="font-mono text-zinc-900">Filter where publisher = NULLXYZ and inspect missing values</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Compare regional sales distributions across EU vs NA in Trino SQL")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span className="font-mono text-zinc-900">Compare regional sales distributions (EU vs NA)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("What are the top 10 titles by NA to Global ratio?")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span className="font-mono text-zinc-900">Compute NA_sales / Global_sales ratio by title</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : dashboardViewMode === 'populated' ? (
            /* ========================================================================= */
            /* END USER (EU) STARTER WORKSPACE: SIMPLE EXECUTIVE BRIEFING                */
            /* ========================================================================= */
            <div className="py-2 space-y-4 animate-in fade-in duration-200">
              {/* 1. Simple Friendly Greeting */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e295b] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                  {userProfile.avatar}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight flex items-center gap-1.5">
                    <span>Hii Veman</span>
                    <span className="text-base">👋</span>
                  </h2>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                    How can I help you explore this dashboard today?
                  </p>
                </div>
              </div>

              {/* 2. Simple Dashboard Highlights Card (Concise & Easy to Read) */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-wide">
                      Dashboard Highlights
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">9 Live Charts</span>
                </div>

                <div className="p-3.5 space-y-2.5 text-xs text-zinc-700 leading-relaxed">
                  <p className="font-medium text-zinc-900">
                    Tracking <strong className="font-bold text-zinc-950">$8,920.4M</strong> in sales across 16,598 catalog titles.
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 pt-0.5 text-zinc-600">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span><strong className="text-zinc-800 font-medium">Top Genres:</strong> Action ($1,751M) and Sports ($1,331M) account for 35% of total sales.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span><strong className="text-zinc-800 font-medium">Top Region:</strong> North America leads with 49.2% of global volume ($4,393M).</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                      <span><strong className="text-zinc-800 font-medium">Publisher:</strong> Nintendo holds 72% (18 of 25) of bestselling releases.</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Copy Summary down side */}
                <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Verified across 9 live visual slices</span>
                  </div>
                  <button
                    onClick={() => {
                      const summaryText = `Dashboard Highlights: Video Game Sales
• Total Revenue: $8,920.4M across 16,598 catalog titles (+14.2% YoY).
• Top Segments: Action ($1,751M) and Sports ($1,331M) drive 35% of volume.
• Top Region: North America leads with 49.2% market share ($4,393M).
• Key Leader: Nintendo controls 72% of top 25 bestselling releases.`;
                      navigator.clipboard.writeText(summaryText);
                      setCopiedTeams(true);
                      setTimeout(() => setCopiedTeams(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-semibold border border-zinc-200 transition-colors shadow-2xs cursor-pointer"
                    title="Copy highlights to clipboard"
                  >
                    {copiedTeams ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3. Simple Suggested Questions */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-zinc-500 block">
                  Quick questions to explore:
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onSelectPrompt("What are the top 3 drivers of Nintendo's dominance?")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-[#1e295b] hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
                  >
                    <span>What are the top 3 drivers of Nintendo's dominance?</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Compare handheld consoles (DS / GBA) vs home consoles")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-[#1e295b] hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
                  >
                    <span>Compare handheld consoles (DS / GBA) vs home consoles</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Why did sales decline after the 2008 peak?")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-[#1e295b] hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
                  >
                    <span>Why did sales decline after the 2008 peak?</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Give me a 3-bullet standup summary")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-[#1e295b] hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-zinc-900">
                      <span>🎙️</span>
                      <span>Give me a 3-bullet standup summary</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY DASHBOARD: SUPERSET DASHBOARD BUILDER COPILOT */
            <div className="py-4 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e295b] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                  {userProfile.avatar}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">
                    Welcome, {userProfile.name} 👋
                  </h2>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Superset Dashboard Builder Copilot
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-6 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#1e295b] flex items-center justify-center mx-auto text-xl font-bold">
                  <LayoutTemplate className="w-6 h-6 text-[#1e295b]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Build Your Superset Dashboard</h3>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 leading-relaxed">
                    This dashboard currently has no charts. Choose a certified Superset dataset and let the AI compose your visual layout in one click.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      if (onAutoGenerateStarter) onAutoGenerateStarter();
                      else onSelectPrompt('Auto-generate Starter Dashboard');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1e295b] hover:bg-[#151d42] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-generate Starter Dashboard (3 KPIs + 2 Charts)</span>
                  </button>
                  
                  <button
                    onClick={() => onSelectPrompt('Create top 5 publishers by revenue bar chart')}
                    className="w-full py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium text-left flex items-center justify-between"
                  >
                    <span>📊 Top 5 Publishers by Revenue</span>
                    <span className="text-zinc-400">↗</span>
                  </button>

                  <button
                    onClick={() => onSelectPrompt('Build historical sales trend line chart')}
                    className="w-full py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium text-left flex items-center justify-between"
                  >
                    <span>📈 Historical Sales Trend (1995 - 2020)</span>
                    <span className="text-zinc-400">↗</span>
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4 pt-3 pb-6">
            {turns.map((turn, idx) => {
              const isLatest = idx === turns.length - 1;
              if (turn.sender === 'user') {
                return <UserTurn key={turn.id} turn={turn} />;
              }
              return (
                <AssistantTurn
                  key={turn.id}
                  turn={turn}
                  isLatest={isLatest}
                  onExpandToCanvas={onExpandToCanvas}
                  onSelectSuggestion={onSelectSuggestion}
                  onQuickChartType={(type) => onQuickChartType(turn.id, type)}
                  onUndo={onUndo}
                  onRetry={onRetry}
                  onPinChartToDashboard={onPinChartToDashboard}
                  aiRole={aiRole}
                />
              );
            })}
          </div>
        )}
      </div>

      {showScrollBottom && turns.length > 0 && (
        <div className="sticky bottom-2 flex justify-center z-20 pointer-events-none">
          <button
            onClick={scrollToBottom}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 bg-[#1e295b] text-white rounded-full text-[11px] font-semibold shadow-md hover:bg-[#151d42] transition-all"
          >
            <span>Scroll to latest</span>
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
