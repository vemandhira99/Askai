import React, { useState } from 'react';
import { useChatEngine } from './state/useChatEngine';
import { HeaderToolbar } from './components/layout/HeaderToolbar';
import { ContextFilterBar } from './components/layout/ContextFilterBar';
import { SidebarChats } from './components/layout/SidebarChats';
import { TranscriptView } from './components/transcript/TranscriptView';
import { ArtifactPane } from './components/artifact/ArtifactPane';
import { BusinessGlossaryModal } from './components/modals/BusinessGlossaryModal';
import { IconToggleModal } from './components/modals/IconToggleModal';
import { TeamsPreviewModal } from './components/modals/TeamsPreviewModal';
import { 
  TOP_10_GAMES_DATA, 
  TOP_25_PUBLISHERS_DATA, 
  TOP_CONSOLES_HIT_DATA,
  VGS_GENRE_DATA,
  VGS_PLATFORM_NA_DATA,
  VGS_TREND_DATA,
  REGIONAL_SALES_SHARE_DATA,
  ANNUAL_RELEASE_VOLUME_DATA,
  SALES_BY_DECADE_DATA
} from './data/mockData';
import { 
  Star,
  RotateCw,
  MoreVertical,
  ChevronDown,
  Plus,
  Settings,
  Pencil,
  X,
  Maximize2,
  Send,
  ExternalLink,
  Lightbulb
} from 'lucide-react';

export default function App() {
  const engine = useChatEngine();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends'>('overview');
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'na' | 'nintendo' | '2000s'>('all');
  const [isTeamsModalOpen, setIsTeamsModalOpen] = useState(false);
  const [focusedChart, setFocusedChart] = useState<string | null>(null);

  const explainChart = (chartKey: string, promptText: string) => {
    setIsAiOpen(true);
    engine.setWorkspaceMode('docked');
    setFocusedChart(chartKey);
    engine.sendPrompt(promptText);
  };

  const isFullscreen = engine.workspaceMode === 'fullscreen';

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f1f5f9] text-zinc-900 font-sans flex flex-col antialiased select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: AKASHIC BRANDING & USER (Matching media_1789727091879.png) */}
      {/* ========================================================================= */}
      {!isFullscreen && (
        <nav className="h-11 bg-white border-b border-zinc-200 px-4 flex items-center justify-between z-30 flex-shrink-0 text-xs">
          {/* Left: Akashic Logo & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-zinc-900">
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#1e295b] to-[#3b82f6] flex items-center justify-center text-white shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <span className="text-[13px] tracking-wider font-extrabold text-zinc-900">
                AKASH<span className="text-purple-600">İ</span>C
              </span>
            </div>

            <span className="text-zinc-300">/</span>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
              <span className="hover:text-zinc-900 cursor-pointer transition-colors">Home</span>
              <span className="text-zinc-400">&gt;</span>
              <span className="text-zinc-900 font-semibold cursor-pointer">Akashic Business Intelligence</span>
            </div>
          </div>

          {/* Right: User Profile Chip */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100 cursor-pointer transition-colors">
              <span className="text-xs font-medium text-zinc-700">Veman C</span>
              <div className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                VC
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>
          </div>
        </nav>
      )}

      {/* ========================================================================= */}
      {/* 2. SUBNAV BAR: DARK NAVY STRIP (Matching media_1789727091879.png)         */}
      {/* ========================================================================= */}
      {!isFullscreen && (
        <div className="h-10 bg-[#1e295b] px-4 flex items-center justify-between text-white text-xs z-20 flex-shrink-0">
          <div className="flex items-center gap-6 font-medium">
            <button className="text-white font-semibold flex items-center gap-1 border-b-2 border-white py-2 transition-colors">
              Dashboards
            </button>
            <button className="text-zinc-300 hover:text-white py-2 transition-colors">
              Charts
            </button>
            <button className="text-zinc-300 hover:text-white py-2 transition-colors">
              Datasets
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1 bg-[#2b3975] hover:bg-[#35458c] text-white px-2.5 py-1 rounded text-xs font-medium transition-colors border border-white/10 shadow-2xs">
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button className="text-zinc-300 hover:text-white p-1 rounded transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DASHBOARD CONTROL BAR: ONLY ONE ASK AI BUTTON & [...]                  */}
      {/* ========================================================================= */}
      {!isFullscreen && (
        <div className="h-12 bg-white border-b border-zinc-200 px-4 flex items-center justify-between z-10 flex-shrink-0 text-xs">
          {/* Left: Title dropdown, Star, Refresh, Author, Last Modified */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-sm cursor-pointer hover:text-blue-900 transition-colors">
              <span>Video Game ...</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            <button className="text-zinc-400 hover:text-amber-500 transition-colors" title="Favorite dashboard">
              <Star className="w-4 h-4" />
            </button>

            <button className="text-zinc-400 hover:text-zinc-700 transition-colors" title="Refresh dashboard data">
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <span className="text-zinc-300">|</span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[11px] font-medium">
              <span>👤</span>
              <span>Not available</span>
            </span>

            <span className="inline-flex items-center gap-1 text-zinc-400 text-[11px]">
              <Pencil className="w-3 h-3 text-zinc-400" />
              <span>10 days ago</span>
            </span>
          </div>

          {/* Right: ONLY ONE ASK AI BUTTON AND [...] (Exactly as in media_1789727091879.png) */}
          <div className="flex items-center gap-2">
            {/* The ONE and ONLY Ask AI Button */}
            <button
              onClick={() => {
                engine.setWorkspaceMode('docked');
                setIsAiOpen(!isAiOpen);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-all ${
                isAiOpen
                  ? 'bg-[#1e295b] text-white ring-2 ring-[#1e295b]/30'
                  : 'bg-[#1e295b] hover:bg-[#161f46] text-white'
              }`}
              title="Ask AI"
            >
              Ask AI
            </button>

            {/* Options button */}
            <button 
              className="px-2.5 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold text-xs"
              title="Actions"
            >
              ···
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN WORKSPACE: 70:30 SPLIT ON DEMAND                                  */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ========================================================================= */}
        {/* HOST DASHBOARD VIEW (70% width when Ask AI is open; 100% when closed)     */}
        {/* ========================================================================= */}
        {!isFullscreen && (
          <div className={`${
            isAiOpen ? 'w-[70%] max-w-[70%]' : 'w-full'
          } flex flex-col h-full overflow-y-auto bg-[#f8fafc] transition-all duration-200 border-r border-zinc-200/80`}>
            
            {/* Superset Subheader Tabs: Overview & Explore Trends */}
            <div className="bg-white px-5 pt-3 pb-2 border-b border-zinc-200 flex items-center gap-2 text-xs flex-shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-[#1e295b] text-white shadow-2xs'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-3.5 py-1 rounded-md font-semibold inline-flex items-center gap-1.5 transition-all ${
                  activeTab === 'trends'
                    ? 'bg-[#1e295b] text-white shadow-2xs'
                    : 'bg-[#ede9fe] text-[#4338ca] hover:bg-[#e0e7ff]'
                }`}
              >
                <span>📊</span>
                <span>Explore Trends</span>
              </button>
            </div>

            {/* Dashboard Content Area (Full 9 Charts in 3x3 Grid!) */}
            <div className="p-5 space-y-6">
              
              {/* Dashboard Title & Description (Matching media_1789727091879.png) */}
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <span>🎮</span>
                  <span>Video Game Sales</span>
                </h1>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  This dashboard visualizes sales & platform data on video games that sold more than 100k copies. The data was last updated in early 2017.
                  <a href="#dataset" className="text-blue-600 hover:underline font-medium ml-1 inline-flex items-center gap-0.5">
                    <span>Original dataset</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
              </div>

              {/* Active Slice Filter Pill Banner */}
              {dashboardFilter !== 'all' && (
                <div className="flex items-center justify-between bg-[#1e295b]/5 border border-[#1e295b]/20 rounded-lg px-3.5 py-2 text-xs shadow-2xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1e295b] animate-pulse"></span>
                    <span className="text-zinc-600">Active Dashboard Slice:</span>
                    <span className="font-bold text-[#1e295b]">
                      {dashboardFilter === 'nintendo' && '🎮 Nintendo First-Party Titles (72% Top 25 Dominance · $1,786.5M)'}
                      {dashboardFilter === 'na' && '🌍 North America Market Scope (49.2% Global Share · $4,392.9M)'}
                      {dashboardFilter === '2000s' && '📅 2000s Peak Golden Era (52.0% Historical Sales · $4,640.2M)'}
                    </span>
                  </div>
                  <button
                    onClick={() => setDashboardFilter('all')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-semibold border border-zinc-200 shadow-2xs transition-colors"
                    title="Reset to All Data"
                  >
                    <span>Reset Slices</span>
                    <X className="w-3 h-3 text-zinc-400" />
                  </button>
                </div>
              )}

              {/* =============================================================== */}
              {/* 9 PRODUCTION SUPERSET CHARTS (3x3 Responsive Grid)              */}
              {/* =============================================================== */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                {/* ------------------------------------------------------------- */}
                {/* 1. TABLE: Top 10 Games (by Global Sales)                      */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'table'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === 'nintendo'
                    ? 'border-purple-400 ring-2 ring-purple-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-zinc-900 tracking-tight">
                        Top 10 Games (by Global Sales)
                      </h3>
                      {dashboardFilter === 'nintendo' && (
                        <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          Nintendo Focus
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('table', 'Explain chart: Top 10 Games (by Global Sales)')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0">
                        <tr>
                          <th className="py-2 px-3 font-semibold text-[10px] text-zinc-500 uppercase tracking-wider w-16">
                            Rank ▾
                          </th>
                          <th className="py-2 px-3 font-semibold text-[10px] text-zinc-500 uppercase tracking-wider">
                            Name ▾
                          </th>
                          <th className="py-2 px-3 font-semibold text-[10px] text-zinc-500 uppercase tracking-wider text-right">
                            Global_sa... ▾
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {TOP_10_GAMES_DATA.map((game) => (
                          <tr key={game.rank} className={`hover:bg-zinc-50/80 transition-colors ${
                            dashboardFilter === 'nintendo' ? 'bg-purple-50/25' : ''
                          }`}>
                            <td className="py-2 px-3 text-zinc-500 font-mono text-xs">
                              {game.rank}
                            </td>
                            <td className="py-2 px-3 text-zinc-800 font-medium truncate max-w-[150px]" title={game.name}>
                              {game.name}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-zinc-700 text-xs">
                              {game.global_sales.toFixed(8)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 2. DONUT: Publishers of Top 25 Games                          */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'publishers'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === 'nintendo'
                    ? 'border-purple-400 ring-2 ring-purple-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-zinc-900 tracking-tight">
                        Publishers of Top 25 Games
                      </h3>
                      {dashboardFilter === 'nintendo' && (
                        <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          72% Share
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('publishers', 'Explain chart: Publishers of Top 25 Games')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center p-3 relative">
                    <svg viewBox="0 0 200 200" className="w-44 h-44 transform -rotate-90">
                      {/* Nintendo (72%) */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="68" 
                        fill="transparent" 
                        stroke="#c084fc" 
                        strokeWidth={dashboardFilter === 'nintendo' ? "30" : "26"} 
                        strokeDasharray="427.2" 
                        strokeDashoffset={427.2 * (1 - 0.72)} 
                      />
                      {/* Take-Two (16%) */}
                      <circle cx="100" cy="100" r="68" fill="transparent" stroke="#5eead4" strokeWidth="26" strokeDasharray="427.2" strokeDashoffset={427.2 * (1 - 0.16)} transform="rotate(259.2 100 100)" />
                      {/* Activision (12%) */}
                      <circle cx="100" cy="100" r="68" fill="transparent" stroke="#cbd5e1" strokeWidth="26" strokeDasharray="427.2" strokeDashoffset={427.2 * (1 - 0.12)} transform="rotate(316.8 100 100)" />
                    </svg>

                    <div className="w-full space-y-1.5 pt-3 border-t border-zinc-100 px-3">
                      <div className={`flex items-center justify-between text-[11px] p-1 rounded transition-colors ${
                        dashboardFilter === 'nintendo' ? 'bg-purple-50 font-bold text-purple-900' : ''
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]"></span>
                          <span className="text-zinc-800 font-medium">Nintendo</span>
                        </div>
                        <span className="font-mono text-zinc-600 font-semibold">18 (72%)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] p-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5eead4]"></span>
                          <span className="text-zinc-800 font-medium">Take-Two Interactive</span>
                        </div>
                        <span className="font-mono text-zinc-600 font-semibold">4 (16%)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] p-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]"></span>
                          <span className="text-zinc-800 font-medium">Activision</span>
                        </div>
                        <span className="font-mono text-zinc-600 font-semibold">3 (12%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 3. TREEMAP: Top 10 Consoles, by # of Hit Games                 */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'consoles'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === 'nintendo'
                    ? 'border-purple-400 ring-2 ring-purple-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-zinc-900 tracking-tight">
                        Top 10 Consoles, by # of Hit Games
                      </h3>
                      {dashboardFilter === 'nintendo' && (
                        <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          DS & GBA Lead
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('consoles', 'Explain chart: Top 10 Consoles, by # of Hit Games')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-3 flex flex-col">
                    <div className="flex-1 flex gap-1.5">
                      <div className="w-[52%] bg-[#5ec3d2] rounded-md p-3 text-zinc-900 flex flex-col justify-between shadow-2xs" title="DS: 2.16k">
                        <span className="text-sm font-extrabold tracking-tight">DS: 2.16k</span>
                      </div>

                      <div className="w-[48%] flex flex-col gap-1.5">
                        <div className="h-[52%] flex gap-1.5">
                          <div className="w-[58%] bg-[#9ddcb7] rounded-md p-2 text-zinc-900 shadow-2xs" title="GBA: 822">
                            <span className="text-xs font-bold">GBA: 822</span>
                          </div>
                          <div className="w-[42%] bg-[#4bb56e] rounded-md p-2 text-white shadow-2xs" title="GC: 556">
                            <span className="text-xs font-bold">GC: 556</span>
                          </div>
                        </div>

                        <div className="h-[48%] flex gap-1.5">
                          <div className="w-[48%] bg-[#e2e8f0] rounded-md p-2 text-zinc-800 shadow-2xs" title="3DS: 509">
                            <span className="text-xs font-bold">3DS: 509</span>
                          </div>
                          <div className="w-[28%] bg-[#4f555b] rounded-md p-1.5 text-white shadow-2xs" title="2600: 133">
                            <span className="text-[11px] font-bold">2600: 133</span>
                          </div>
                          <div className="w-[24%] bg-[#f4b971] rounded-md p-1.5 text-zinc-900 shadow-2xs" title="GB: 98">
                            <span className="text-[11px] font-bold">GB: 98</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 4. HORIZONTAL BARS: Genre Sales Breakdown                     */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'genres'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Genre Sales Breakdown</h3>
                      <span className="text-[10px] text-zinc-400 font-mono">SUM(global_sales) in $ Millions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('genres', 'Explain chart: Genre Sales Breakdown')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-3.5 flex flex-col justify-around text-xs">
                    {VGS_GENRE_DATA.slice(0, 6).map((genre) => (
                      <div key={genre.name} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-zinc-800">{genre.name}</span>
                          <span className="font-mono text-zinc-600 font-semibold">${genre.value.toFixed(1)}M</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#1e295b] rounded-full transition-all duration-300"
                            style={{ width: `${(genre.value / 1751.2) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 5. AREA TREND: Annual Sales Trajectory (1980 - 2020)          */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'trends'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === '2000s'
                    ? 'border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Annual Sales Trajectory</h3>
                        <span className="text-[10px] text-zinc-400 font-mono">2008 Historical Peak ($678.9M)</span>
                      </div>
                      {dashboardFilter === '2000s' && (
                        <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                          Peak Era
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('trends', 'Explain chart: Annual Sales Trajectory')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <svg viewBox="0 0 400 140" className="w-full h-44 overflow-visible pt-2">
                      <defs>
                        <linearGradient id="areaGradDash" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1e295b" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="#1e295b" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <polygon points="0,120 40,105 80,85 120,70 160,45 200,20 240,55 280,85 320,100 360,112 400,125 400,140 0,140" fill="url(#areaGradDash)" />
                      <polyline fill="none" stroke="#1e295b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="0,120 40,105 80,85 120,70 160,45 200,20 240,55 280,85 320,100 360,112 400,125" />
                      <circle cx="200" cy="20" r="4.5" fill="#1e295b" stroke="#ffffff" strokeWidth="2"/>
                      <text x="200" y="10" textAnchor="middle" fill="#1e295b" fontSize="10" fontWeight="bold">2008: $678.9M</text>
                    </svg>

                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono border-t border-zinc-100 pt-2">
                      <span>1995</span>
                      <span>2000</span>
                      <span>2005</span>
                      <span>2008</span>
                      <span>2015</span>
                      <span>2020</span>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 6. DONUT: Regional Sales Market Share                          */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'regions'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === 'na'
                    ? 'border-blue-400 ring-2 ring-blue-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Regional Sales Market Share</h3>
                        <span className="text-[10px] text-zinc-400 font-mono">Global aggregate $8,920.4M</span>
                      </div>
                      {dashboardFilter === 'na' && (
                        <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          49.2% NA Share
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('regions', 'Explain chart: Regional Sales Market Share')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center p-3 relative">
                    <svg viewBox="0 0 200 200" className="w-44 h-44 transform -rotate-90">
                      {/* NA: 49.2% */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="68" 
                        fill="transparent" 
                        stroke="#3b82f6" 
                        strokeWidth={dashboardFilter === 'na' ? "30" : "26"} 
                        strokeDasharray="427.2" 
                        strokeDashoffset={427.2 * (1 - 0.492)} 
                      />
                      {/* EU: 27.3% */}
                      <circle cx="100" cy="100" r="68" fill="transparent" stroke="#10b981" strokeWidth="26" strokeDasharray="427.2" strokeDashoffset={427.2 * (1 - 0.273)} transform="rotate(177.1 100 100)" />
                      {/* JP: 14.5% */}
                      <circle cx="100" cy="100" r="68" fill="transparent" stroke="#f59e0b" strokeWidth="26" strokeDasharray="427.2" strokeDashoffset={427.2 * (1 - 0.145)} transform="rotate(275.4 100 100)" />
                      {/* Other: 9.0% */}
                      <circle cx="100" cy="100" r="68" fill="transparent" stroke="#8b5cf6" strokeWidth="26" strokeDasharray="427.2" strokeDashoffset={427.2 * (1 - 0.09)} transform="rotate(327.6 100 100)" />
                    </svg>

                    <div className="w-full space-y-1 pt-3 border-t border-zinc-100 px-3">
                      {REGIONAL_SALES_SHARE_DATA.map((reg) => (
                        <div 
                          key={reg.region} 
                          className={`flex items-center justify-between text-[11px] p-1 rounded transition-colors ${
                            dashboardFilter === 'na' && reg.region === 'North America' ? 'bg-blue-50 font-bold text-blue-900' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.color }}></span>
                            <span className="text-zinc-800 font-medium">{reg.region}</span>
                          </div>
                          <span className="font-mono text-zinc-600 font-semibold">${reg.sales.toFixed(1)}M ({reg.share}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 7. BAR: Top 10 Platforms (by NA Sales)                        */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'platforms'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === 'na'
                    ? 'border-blue-400 ring-2 ring-blue-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Top Platforms (by NA Sales)</h3>
                        <span className="text-[10px] text-zinc-400 font-mono">Volume in North America ($M)</span>
                      </div>
                      {dashboardFilter === 'na' && (
                        <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          NA Ranked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('platforms', 'Explain chart: Top Platforms (by NA Sales)')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-3.5 flex flex-col justify-around text-xs">
                    {VGS_PLATFORM_NA_DATA.slice(0, 6).map((plat) => (
                      <div key={plat.name} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-zinc-800">{plat.name}</span>
                          <span className="font-mono text-zinc-600 font-semibold">${plat.naValue.toFixed(1)}M</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                            style={{ width: `${(plat.naValue / 601.0) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 8. COMPOSITE: Annual Title Releases vs Peak Revenue           */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'releases'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === '2000s'
                    ? 'border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Annual Title Volume</h3>
                        <span className="text-[10px] text-zinc-400 font-mono">Catalog releases per peak year</span>
                      </div>
                      {dashboardFilter === '2000s' && (
                        <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                          2008-2009 High
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('releases', 'Explain chart: Annual Title Volume')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-3.5 flex flex-col justify-between">
                    <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
                      {ANNUAL_RELEASE_VOLUME_DATA.map((item) => (
                        <div key={item.year} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                          <span className="text-[9px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.titles}
                          </span>
                          <div 
                            className={`w-full rounded-t transition-all ${
                              dashboardFilter === '2000s' && (item.year === '2007' || item.year === '2008' || item.year === '2009')
                                ? 'bg-indigo-600'
                                : 'bg-[#1e295b] hover:bg-blue-600'
                            }`}
                            style={{ height: `${(item.titles / 1428) * 100}%` }}
                          />
                          <span className="text-[10px] font-mono text-zinc-500 mt-1">{item.year}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 rounded bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 text-center font-medium">
                      2008-2009 saw historical high with 1,428+ simultaneous title releases
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 9. CARDS: Global Sales by Decade                              */}
                {/* ------------------------------------------------------------- */}
                <div className={`bg-white rounded-lg border shadow-2xs overflow-hidden flex flex-col h-[420px] transition-all duration-200 ${
                  focusedChart === 'decades'
                    ? 'ring-2 ring-[#1e295b] border-[#1e295b] shadow-md'
                    : dashboardFilter === '2000s'
                    ? 'border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm'
                    : 'border-zinc-200'
                }`}>
                  <div className="px-3.5 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Global Sales by Decade</h3>
                        <span className="text-[10px] text-zinc-400 font-mono">Four-decade macro growth</span>
                      </div>
                      {dashboardFilter === '2000s' && (
                        <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                          52% All-Time Share
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => explainChart('decades', 'Explain chart: Global Sales by Decade')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 text-[10px] font-medium border border-zinc-200 transition-colors"
                        title="Explain this chart in 2 bullet points"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Explain</span>
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-zinc-600" title="Options">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-3.5 flex flex-col justify-between text-xs space-y-2">
                    {SALES_BY_DECADE_DATA.map((item) => (
                      <div 
                        key={item.decade} 
                        className={`p-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 ${
                          dashboardFilter === '2000s' && item.decade === '2000s'
                            ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/40 shadow-xs'
                            : 'bg-zinc-50/80 border-zinc-150'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                            <span>{item.decade}</span>
                            <span className="px-1.5 py-0.2 rounded bg-white text-zinc-600 text-[10px] border border-zinc-200">
                              {item.share}
                            </span>
                            {dashboardFilter === '2000s' && item.decade === '2000s' && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-200 text-indigo-900 text-[9px] font-bold">
                                Selected Slicing
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            {item.titles.toLocaleString()} titles • Lead: {item.topGenre}
                          </span>
                        </div>
                        <div className="text-right font-mono font-bold text-zinc-900 text-sm">
                          ${item.sales}M
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. ASK AI COPILOT: 30% WIDTH CLEAN DOCKED SIDEBAR                         */}
        {/* ========================================================================= */}
        {isAiOpen && (
          <div className={`${
            isFullscreen
              ? 'fixed inset-0 z-50 bg-white flex flex-col'
              : 'w-[30%] min-w-[380px] h-full bg-white border-l border-zinc-200 flex flex-col shadow-xl z-20 transition-all duration-200'
          }`}>
            
            {/* Clean, Uncluttered Header */}
            <div className="h-12 px-4 border-b border-zinc-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#1e295b] text-white flex items-center justify-center text-[10px] font-bold">
                  Ai
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#1e295b] leading-tight">Ask Akashic BI</h2>
                  <p className="text-[10px] text-zinc-500 leading-tight">Video Game Sales Copilot</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-zinc-500">
                <button 
                  onClick={() => {
                    engine.setWorkspaceMode(isFullscreen ? 'docked' : 'fullscreen');
                  }}
                  className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                  title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => engine.setTurns([])}
                  className="p-1.5 rounded hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                  title="New Chat"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    setIsAiOpen(false);
                    if (isFullscreen) engine.setWorkspaceMode('docked');
                  }}
                  className="p-1.5 rounded hover:bg-rose-50 hover:text-rose-600 transition-colors ml-0.5"
                  title="Close Ask AI"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Single-line compact context strip */}
            <div className="px-4 py-1.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-[11px] text-zinc-600 flex-shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-zinc-400 font-medium">Scope:</span>
                <span className="font-semibold text-zinc-800">video_game_sales</span>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-500">9 active charts</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">16,598 records</span>
            </div>

            {/* Pure Single-Column Chat Transcript (Takes Full 30% Width!) */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              <TranscriptView
                turns={engine.turns}
                datasetName={engine.activeContext.dataset}
                userProfile={engine.userProfile}
                dashboardViewMode={engine.dashboardViewMode}
                onAutoGenerateStarter={engine.autoGenerateStarterDashboard}
                onPinChartToDashboard={engine.pinChartToDashboard}
                onSelectPrompt={(p) => engine.sendPrompt(p)}
                onExpandToCanvas={(chart) => {
                  engine.setActiveArtifact(chart);
                  engine.setWorkspaceMode('fullscreen');
                }}
                onSelectSuggestion={(prompt) => {
                  engine.setComposerText(prompt);
                }}
                onQuickChartType={(type) => {
                  if (engine.turns.length > 0) {
                    const lastTurn = engine.turns[engine.turns.length - 1];
                    engine.handleQuickChart(lastTurn.id, type);
                  }
                }}
                onUndo={engine.handleUndo}
                onRetry={(turnId, mode) => engine.handleRetry(turnId, mode)}
                onApplyQuickFilter={(filter) => setDashboardFilter(filter)}
                activeDashboardFilter={dashboardFilter}
                onOpenTeamsModal={() => setIsTeamsModalOpen(true)}
              />

              {/* Composer Input Area */}
              <div className="p-3 border-t border-zinc-200 bg-white flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    engine.sendPrompt();
                  }}
                  className="relative"
                >
                  <textarea
                    value={engine.composerText}
                    onChange={(e) => engine.setComposerText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        engine.sendPrompt();
                      }
                    }}
                    rows={2}
                    placeholder="Ask anything about these 9 charts..."
                    className="w-full p-2.5 pr-10 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e295b] resize-none"
                  />
                  <button
                    type="submit"
                    disabled={engine.isExecuting || !engine.composerText.trim()}
                    className="absolute right-2 bottom-2.5 p-1.5 rounded-md bg-[#1e295b] text-white hover:bg-[#161f46] disabled:opacity-40 transition-colors shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="mt-1 text-[10px] text-zinc-400 text-right">
                  Press <kbd className="font-mono bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200">Enter ↵</kbd> to ask
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Microsoft Teams Preview Modal */}
      <TeamsPreviewModal
        isOpen={isTeamsModalOpen}
        onClose={() => setIsTeamsModalOpen(false)}
        dashboardTitle="Video Game Sales Dashboard"
      />

      {/* Business Glossary Modal */}
      <BusinessGlossaryModal
        isOpen={engine.isGlossaryOpen}
        onClose={() => engine.setIsGlossaryOpen(false)}
        datasetName={engine.activeContext.dataset}
      />

      {/* Customize Toolbar Icons Modal */}
      <IconToggleModal
        isOpen={engine.isIconSettingsOpen}
        onClose={() => engine.setIsIconSettingsOpen(false)}
        settings={engine.iconSettings}
        onToggle={engine.toggleIcon}
      />
    </div>
  );
}
