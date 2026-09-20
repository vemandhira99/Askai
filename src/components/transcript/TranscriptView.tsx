import React, { useRef, useEffect, useState } from 'react';
import { MessageTurn, ChartArtifact, ChartType, UserProfile, DashboardViewMode } from '../../types/bi';
import { UserTurn } from './UserTurn';
import { AssistantTurn } from './AssistantTurn';
import { ArrowDown, Sparkles, BarChart2, TrendingUp, Globe, AlertCircle, LayoutTemplate, Copy, Check, ChevronRight } from 'lucide-react';

interface TranscriptViewProps {
  turns: MessageTurn[];
  onSelectPrompt: (prompt: string) => void;
  onExpandToCanvas: (chart: ChartArtifact) => void;
  onSelectSuggestion: (prompt: string) => void;
  onQuickChartType: (type: ChartType) => void;
  onUndo: () => void;
  onRetry: (turnId: string, mode: 'network' | 'analytical') => void;
  datasetName: string;
  userProfile?: UserProfile;
  dashboardViewMode?: DashboardViewMode;
  onAutoGenerateStarter?: () => void;
  onPinChartToDashboard?: (chart: ChartArtifact) => void;
  onApplyQuickFilter?: (filter: 'all' | 'na' | 'nintendo' | '2000s') => void;
  activeDashboardFilter?: string;
  onOpenTeamsModal?: () => void;
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
  onOpenTeamsModal,
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
          dashboardViewMode === 'populated' ? (
            /* POPULATED DASHBOARD: PERSONALIZED GREETING & EXECUTIVE BRIEFING CARD */
            <div className="py-2 space-y-4 animate-in fade-in duration-200">
              {/* 1. Personalized Greeting with User Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e295b] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                  {userProfile.avatar}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight flex items-center gap-1.5">
                    <span>Good morning, {userProfile.name}</span>
                    <span className="text-base">👋</span>
                  </h2>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Superset Executive Briefing for <span className="font-semibold text-zinc-700">{datasetName === 'wb_health_population' ? 'Global Health & Mortality' : 'Video Game Sales'}</span>
                  </p>
                </div>
              </div>

              {/* 2. Executive Summary & Visible Charts Digest Card */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                {/* Header with Teams / Slack / Meeting Prep Actions */}
                <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-wide">
                      Executive Briefing · 9 Charts
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Copy for MS Teams */}
                    <button
                      onClick={() => {
                        const teamsText = `**Executive Briefing: Video Game Sales Dashboard**
• **Total Revenue**: $8,920.4M across 16,598 catalog titles (+14.2% YoY).
• **Market Concentration**: Nintendo controls 72% of top 25 bestselling releases (18 of 25 titles).
• **Top Segments**: Action ($1,751.2M) and Sports ($1,330.9M) drive 34.7% of volume ($3.08B).
• **Regional Breakdown**: North America leads at 49.2% ($4,392.9M), Europe at 27.3% ($2,434.1M).
⚠️ **Watch-out**: 49.2% single-market exposure in North America; physical boxed titles declined post-2008 peak.`;
                        navigator.clipboard.writeText(teamsText);
                        setCopiedTeams(true);
                        setTimeout(() => setCopiedTeams(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-zinc-100 text-zinc-700 text-[10px] font-semibold border border-zinc-200 transition-colors shadow-2xs"
                      title="Copy formatted summary for Microsoft Teams"
                    >
                      {copiedTeams ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#464eb8] font-bold">T</span>
                          <span>Copy for Teams</span>
                        </>
                      )}
                    </button>

                    {/* Preview Teams Card */}
                    {onOpenTeamsModal && (
                      <button
                        onClick={onOpenTeamsModal}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#464eb8]/10 hover:bg-[#464eb8]/20 text-[#464eb8] text-[10px] font-semibold transition-colors"
                        title="Preview how this update appears in Microsoft Teams"
                      >
                        <span>Preview</span>
                      </button>
                    )}

                    {/* Toggle Meeting Prep Mode */}
                    <button
                      onClick={() => setIsMeetingPrepActive(!isMeetingPrepActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold border transition-all ${
                        isMeetingPrepActive
                          ? 'bg-[#1e295b] text-white border-[#1e295b] shadow-2xs'
                          : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 shadow-2xs'
                      }`}
                      title="Toggle 3-part meeting talking points"
                    >
                      <span>🎙️</span>
                      <span>Meeting Prep</span>
                    </button>
                  </div>
                </div>

                {isMeetingPrepActive ? (
                  /* MEETING TALKING POINTS: STANDUP & LEADERSHIP READY */
                  <div className="p-4 space-y-3 bg-amber-50/25 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                      <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🎙️</span>
                        <span>Meeting Talking Points (3-Part Executive Briefing)</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Standup Ready</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* 1. The Highlight */}
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                        <span className="text-base">🟢</span>
                        <div>
                          <strong className="text-emerald-950 font-bold text-xs">The Growth Highlight:</strong>
                          <p className="text-emerald-900 text-[11px] mt-0.5 leading-relaxed">
                            Total catalog revenue stands at <strong>$8,920.4M</strong>. Nintendo controls <strong>72%</strong> of top 25 bestselling releases, while Action and Sports drive <strong>34.7% ($3.08B)</strong> of all genre volume.
                          </p>
                        </div>
                      </div>

                      {/* 2. The Risk */}
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                        <span className="text-base">🔴</span>
                        <div>
                          <strong className="text-rose-950 font-bold text-xs">The Risk / Watch-Out:</strong>
                          <p className="text-rose-900 text-[11px] mt-0.5 leading-relaxed">
                            <strong>49.2%</strong> of all revenue ($4,392.9M) depends on North America. Post-2008 physical boxed sales contracted 62% as consumer dollars shifted toward uncaptured digital stores.
                          </p>
                        </div>
                      </div>

                      {/* 3. The Discussion Topic */}
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                        <span className="text-base">🔵</span>
                        <div>
                          <strong className="text-blue-950 font-bold text-xs">Strategic Meeting Question:</strong>
                          <p className="text-blue-900 text-[11px] mt-0.5 leading-relaxed">
                            Should publisher marketing budgets expand in Europe ($2.43B / 27.3%) and handheld RPG localization in Japan to hedge North American single-market concentration?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* DEFAULT EXECUTIVE SUMMARY */
                  <div className="p-4 space-y-3.5">
                    {/* High-level Takeaway */}
                    <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                      Across 9 dashboard visual slices and 16,598 catalog titles, <strong className="text-zinc-900 font-semibold">$8,920.4M</strong> in historical revenue is tracked. <strong className="text-zinc-900 font-semibold">Action & Sports</strong> account for 34.7% of all genre sales ($3.08B combined), while <strong className="text-zinc-900 font-semibold">North America</strong> accounts for nearly half (49.2%) of the global market.
                    </p>

                    {/* Visible Charts Digest Accordion */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Visible Charts Digest
                      </span>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-start gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                          <span className="text-sm">🏆</span>
                          <div>
                            <span className="font-semibold text-zinc-900">Top 10 Games & Publishers:</span>{' '}
                            <span className="text-zinc-600">Wii Sports (82.7M) and Super Mario Bros. (40.2M) lead. Nintendo accounts for 72% of the top 25 bestselling releases.</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                          <span className="text-sm">🎮</span>
                          <div>
                            <span className="font-semibold text-zinc-900">Platforms & Consoles:</span>{' '}
                            <span className="text-zinc-600">Nintendo DS leads hit title volume (2,163), while Xbox 360 leads North American revenues ($601.0M).</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                          <span className="text-sm">📈</span>
                          <div>
                            <span className="font-semibold text-zinc-900">Trajectory & Decades:</span>{' '}
                            <span className="text-zinc-600">Revenues peaked in 2008 ($678.9M across 1,428 titles). The 2000s represented 52% of all-time industry revenue ($4.64B).</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Concentration Takeaway */}
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700 flex items-start gap-2">
                      <span className="text-zinc-500 font-bold mt-0.5">•</span>
                      <div>
                        <span className="font-semibold text-zinc-900">Macro Concentration:</span>{' '}
                        <span>Top 3 publishers and top 2 regions (NA + Europe) generate over 76.5% of cumulative sales.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. One-Click Smart Business Slicing Chips */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-600">Smart Dashboard Slices:</span>
                  {activeDashboardFilter && activeDashboardFilter !== 'all' && (
                    <span className="text-[10px] text-emerald-600 font-medium">● Sliced</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onApplyQuickFilter?.('nintendo')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                      activeDashboardFilter === 'nintendo'
                        ? 'bg-[#1e295b] text-white border-[#1e295b] shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    🎮 Focus: Nintendo
                  </button>
                  <button
                    onClick={() => onApplyQuickFilter?.('na')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                      activeDashboardFilter === 'na'
                        ? 'bg-[#1e295b] text-white border-[#1e295b] shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    🌍 Focus: North America
                  </button>
                  <button
                    onClick={() => onApplyQuickFilter?.('2000s')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                      activeDashboardFilter === '2000s'
                        ? 'bg-[#1e295b] text-white border-[#1e295b] shadow-xs'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    📅 Focus: 2000s Boom
                  </button>
                  {activeDashboardFilter && activeDashboardFilter !== 'all' && (
                    <button
                      onClick={() => onApplyQuickFilter?.('all')}
                      className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
                    >
                      Reset ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Decision-Centric Suggested Questions */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-zinc-500 block">
                  Questions for executive review:
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onSelectPrompt("Prep me for my 10 AM leadership standup")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-[#1e295b] hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-zinc-900">
                      <span>🎙️</span>
                      <span>Prep me for my 10 AM leadership standup</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("What are the top 3 drivers of Nintendo's dominance?")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span>What are the top 3 drivers of Nintendo's dominance?</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Compare handheld consoles (DS / GBA) vs home consoles")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span>Compare handheld consoles (DS / GBA) vs home consoles</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("Why did sales decline after the 2008 peak?")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span>Why did sales decline after the 2008 peak?</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors flex-shrink-0 ml-2" />
                  </button>
                  <button
                    onClick={() => onSelectPrompt("What is our revenue exposure outside North America?")}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-medium transition-all text-left shadow-2xs hover:shadow-xs flex items-center justify-between group"
                  >
                    <span>What is our revenue exposure outside North America?</span>
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
                  onQuickChartType={onQuickChartType}
                  onUndo={onUndo}
                  onRetry={onRetry}
                  onPinChartToDashboard={onPinChartToDashboard}
                />
              );
            })}
          </div>
        )}
      </div>

      {showScrollBottom && (
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
