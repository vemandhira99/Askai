import { useState, useRef, useCallback } from 'react';
import { 
  MessageTurn, 
  ContextFilter, 
  ChartArtifact, 
  WorkspaceMode, 
  CanvasViewMode, 
  IconVisibilitySettings, 
  AuditRecord, 
  ChartType, 
  OperationStep, 
  KeyInsight, 
  SqlQueryItem,
  DashboardViewMode,
  UserProfile
} from '../types/bi';
import { 
  INITIAL_TURNS, 
  INITIAL_CONTEXT, 
  WB_CONTEXT,
  INITIAL_CHART, 
  INITIAL_INSIGHT, 
  INITIAL_SQL, 
  INITIAL_SUGGESTIONS,
  VGS_GENRE_DATA,
  VGS_PLATFORM_NA_DATA,
  VGS_TREND_DATA,
  TOP_25_PUBLISHERS_DATA,
  TOP_CONSOLES_HIT_DATA,
  REGIONAL_SALES_SHARE_DATA,
  SALES_BY_DECADE_DATA,
  WB_MORTALITY_DATA,
  WB_WATER_DATA,
  WB_HIV_DATA
} from '../data/mockData';

export function useChatEngine() {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('docked');
  const [canvasViewMode, setCanvasViewMode] = useState<CanvasViewMode>('split');
  const [dashboardViewMode, setDashboardViewMode] = useState<DashboardViewMode>('populated');
  const [pinnedCharts, setPinnedCharts] = useState<ChartArtifact[]>([]);
  const [pinToast, setPinToast] = useState<string | null>(null);
  const [turns, setTurns] = useState<MessageTurn[]>(INITIAL_TURNS);
  const [activeContext, setActiveContext] = useState<ContextFilter>(INITIAL_CONTEXT);
  const [composerText, setComposerText] = useState<string>('');
  const [stashedDraft, setStashedDraft] = useState<string | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<ChartArtifact | null>(INITIAL_CHART);
  const [activeArtifactTab, setActiveArtifactTab] = useState<'preview' | 'table' | 'sql' | 'insight'>('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isIconSettingsOpen, setIsIconSettingsOpen] = useState<boolean>(false);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([]);

  const userProfile: UserProfile = {
    name: 'Veman',
    role: 'Lead Data Analyst',
    email: 'veman.chippa@akashic.bi',
    avatar: 'V',
  };

  // Icon visibility toggles (Capability 7)
  const [iconSettings, setIconSettings] = useState<IconVisibilitySettings>({
    shareLink: true,
    glossary: true,
    history: true,
    download: true,
    newChat: true,
    fullscreen: true,
    dockToggle: false,
    sqlLab: true,
  });

  const stateSnapshotsRef = useRef<{ turns: MessageTurn[]; context: ContextFilter; artifact: ChartArtifact | null }[]>([
    { turns: INITIAL_TURNS, context: INITIAL_CONTEXT, artifact: INITIAL_CHART }
  ]);

  const toggleIcon = useCallback((key: keyof IconVisibilitySettings) => {
    setIconSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const removeFilter = useCallback((filterToRemove: string) => {
    setActiveContext(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f !== filterToRemove)
    }));
  }, []);

  const pinChartToDashboard = useCallback((chart: ChartArtifact) => {
    setPinnedCharts(prev => {
      if (prev.some(c => c.id === chart.id)) return prev;
      return [...prev, chart];
    });
    setPinToast(`📌 Pinned "${chart.title}" to Superset Dashboard!`);
    setTimeout(() => setPinToast(null), 3500);
  }, []);

  const pinWidgetContext = useCallback((widgetName: string) => {
    setWorkspaceMode('docked');
    setComposerText(`@chart: "${widgetName}" - What are the primary factors driving this metric?`);
  }, []);

  const autoGenerateStarterDashboard = useCallback(() => {
    setDashboardViewMode('populated');
    setPinToast('🚀 Executive Starter Dashboard generated on the left!');
    setTimeout(() => setPinToast(null), 3500);
  }, []);

  // Send Prompt (Capabilities 1, 2, 3, 4, 5, 9)
  const sendPrompt = useCallback(async (customText?: string) => {
    const textToSend = (customText || composerText).trim();
    if (!textToSend || isExecuting) return;

    // Snapshot state before adding turn
    stateSnapshotsRef.current.push({
      turns: [...turns],
      context: { ...activeContext },
      artifact: activeArtifact ? { ...activeArtifact } : null,
    });

    const userTurnId = `turn-${Date.now()}-user`;
    const asstTurnId = `turn-${Date.now()}-assistant`;
    const idempotencyKey = `idemp-${Date.now()}`;

    const newUserTurn: MessageTurn = {
      id: userTurnId,
      sender: 'user',
      timestamp: 'Just now',
      content: textToSend,
      idempotencyKey,
    };

    setTurns(prev => [...prev, newUserTurn]);
    setComposerText('');
    setStashedDraft(null);
    setIsExecuting(true);

    const lower = textToSend.toLowerCase();

    // Fast reasoning progress
    const isSimple = lower.includes('filter') || textToSend.length < 30;
    const initialProgress: OperationStep = isSimple 
      ? { id: 'step-1', label: 'Applying filter slice', status: 'completed', durationMs: 19 }
      : { id: 'step-1', label: 'Executing Trino query plan', status: 'active', durationMs: 46 };

    const placeholderTurn: MessageTurn = {
      id: asstTurnId,
      sender: 'assistant',
      timestamp: 'Just now',
      idempotencyKey: `run-${idempotencyKey}`,
      assistantData: {
        id: `asst-${asstTurnId}`,
        context: {
          ...activeContext,
          filters: [...activeContext.filters],
        },
        operationProgress: initialProgress,
        suggestions: [],
        sqlQueries: [],
      }
    };

    setTurns(prev => [...prev, placeholderTurn]);

    setTimeout(() => {
      // SCENARIO 0: Auto-Generate Starter Dashboard from AI
      if (lower.includes('starter dashboard') || lower.includes('auto-generate') || lower.includes('build starter')) {
        setDashboardViewMode('populated');
        setPinToast('🚀 Executive Starter Dashboard generated on the left!');
        setTimeout(() => setPinToast(null), 3500);

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              analyticalSummary: "🚀 Successfully auto-generated Executive Starter Dashboard! Populated 3 KPI cards ($8,920.4M Total Sales, 16,598 Verified Records, Action Top Segment) and 2 visual tiles (Genre Breakdown, Historical Trend) on your Superset dashboard on the left.",
              sqlQueries: INITIAL_SQL,
              operationProgress: {
                id: 'step-starter',
                label: 'Superset dashboard synthesized in 38.5ms',
                status: 'completed',
                durationMs: 38.5
              },
              suggestions: [
                { id: 'sug-st-1', label: 'Filter to Action genre', prompt: 'Filter to Action genre' },
                { id: 'sug-st-2', label: 'Which platform has highest NA sales?', prompt: 'Which platform has the highest sales in North America?' },
                { id: 'sug-st-3', label: 'Explain sales peak in 2008', prompt: 'Why did sales peak in 2008?' }
              ]
            }
          };
        }));
        setIsExecuting(false);
        return;
      }

      // SCENARIO 0.5: Natural Language Superset Filter Control
      if (lower.includes('filter') || lower.includes('slice by')) {
        let filterTag = '';
        let filterSummary = '';
        let filterSqlWhere = '';

        if (lower.includes('action')) {
          filterTag = "genre = 'Action'";
          filterSummary = "Filtered dashboard to Action genre. Historical sales for Action total $1,751.2M across 3,316 titles.";
          filterSqlWhere = "genre = 'Action'";
        } else if (lower.includes('north america') || lower.includes('na')) {
          filterTag = "region = 'North America'";
          filterSummary = "Filtered dashboard to North America scope ($4,392.9M historical total).";
          filterSqlWhere = "na_sales > 0";
        } else if (lower.includes('nintendo')) {
          filterTag = "publisher = 'Nintendo'";
          filterSummary = "Filtered dashboard to Nintendo publisher catalog ($1,786.5M historical volume).";
          filterSqlWhere = "publisher = 'Nintendo'";
        } else if (lower.includes('clear') || lower.includes('reset')) {
          setActiveContext(prev => ({
            ...prev,
            filters: ['publisher IS NOT NULL', 'global_sales > 0']
          }));
          filterSummary = "Cleared all custom filters. Dashboard reset to baseline scope.";
        } else {
          filterTag = `filter: ${textToSend.slice(0, 24)}`;
          filterSummary = `Applied filter: ${textToSend}. Dashboard slices refreshed.`;
        }

        if (filterTag) {
          setActiveContext(prev => ({
            ...prev,
            filters: Array.from(new Set([...prev.filters, filterTag]))
          }));
        }

        const filterSql: SqlQueryItem = {
          id: `sql-flt-${Date.now()}`,
          label: 'Dynamic Superset Native Filter Execution',
          sql: `SELECT genre, platform, ROUND(SUM(global_sales), 2) AS total_m\nFROM ${activeContext.dataset}\nWHERE ${filterSqlWhere || 'global_sales > 0'}\nGROUP BY 1, 2\nORDER BY 3 DESC\nLIMIT 10;`,
          executionTimeMs: 44.2,
          rowsReturned: 10,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              analyticalSummary: `⚡ ${filterSummary}\n\nAll KPI cards and visual tiles on the left have been dynamically updated to match this filter scope.`,
              sqlQueries: [filterSql],
              operationProgress: {
                id: 'step-flt',
                label: 'Applied native filter in 44.2ms',
                status: 'completed',
                durationMs: 44.2
              },
              suggestions: [
                { id: 'sug-flt-1', label: 'Show top 5 titles in this filter', prompt: 'Show top 5 titles in this filtered view' },
                { id: 'sug-flt-2', label: 'Clear all filters', prompt: 'Clear all filters' },
              ]
            }
          };
        }));
        setIsExecuting(false);
        return;
      }

      // QUESTION 1: Drivers of Nintendo's dominance
      if (lower.includes('nintendo') && (lower.includes('dominance') || lower.includes('driver') || lower.includes('top 3') || lower.includes('drivers'))) {
        const nintendoChart: ChartArtifact = {
          id: `chart-nintendo-${Date.now()}`,
          title: 'Publishers of Top 25 Bestselling Games',
          type: 'donut',
          metric: 'Hit Game Count',
          dimension: 'Publisher',
          dataset: 'video_game_sales',
          period: '1980 - 2020',
          unit: 'Titles',
          availableTypes: ['donut', 'bar', 'line'],
          data: TOP_25_PUBLISHERS_DATA,
        };

        const nintendoInsight: KeyInsight = {
          headline: "Nintendo controls 72% of the top 25 bestselling games of all time (18 of 25 titles).",
          narrative: "Nintendo's vertical hardware-software synergy created an insurmountable moat, generating $1,786.5M in catalog sales.",
          impact: 'positive',
          metrics: [
            { label: 'Top 25 Share', value: '72% (18 titles)', change: 'Leader' },
            { label: 'Bestseller', value: 'Wii Sports (82.7M)' },
            { label: 'Catalog Revenue', value: '$1,786.5M' },
          ]
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: nintendoChart,
              insight: nintendoInsight,
              analyticalSummary: `**Top 3 Drivers of Nintendo's Market Dominance:**\n\n1. **Hardware Pack-in Flywheels**: *Wii Sports* (82.7M units) and *Mario Kart Wii* (35.8M) were bundled directly with hardware purchases, guaranteeing instant adoption.\n2. **Generational IP Monopolies**: Proprietary franchises (*Mario*, *Pokémon*, *Zelda*) drive repeat purchases across multiple console generations without licensing royalty overhead.\n3. **Handheld Proliferation**: Handheld platforms (*Game Boy*, *Nintendo DS*) captured over 3,400 catalog titles with virtually zero direct competition, driving high software margins.`,
              operationProgress: {
                id: 'op-nintendo',
                label: 'Synthesized 9-chart executive breakdown',
                status: 'completed',
                durationMs: 38.2,
              },
              suggestions: [
                { id: 'sug-nin-1', label: 'Compare handheld vs home consoles', prompt: 'Compare handheld consoles (DS / GBA) vs home consoles' },
                { id: 'sug-nin-2', label: 'Why did sales decline after 2008?', prompt: 'Why did sales decline after the 2008 peak?' },
                { id: 'sug-nin-3', label: 'What is our revenue exposure outside NA?', prompt: 'What is our revenue exposure outside North America?' },
              ]
            }
          };
        }));

        setActiveArtifact(nintendoChart);
        setIsExecuting(false);
        return;
      }

      // QUESTION 2: Handheld consoles (DS / GBA) vs home consoles
      if (lower.includes('handheld') || (lower.includes('ds') && lower.includes('gba')) || lower.includes('home console')) {
        const handheldChart: ChartArtifact = {
          id: `chart-handheld-${Date.now()}`,
          title: 'Top Consoles, by # of Hit Games',
          type: 'bar',
          metric: 'Hit Game Count',
          dimension: 'Platform',
          dataset: 'video_game_sales',
          period: '1980 - 2020',
          unit: 'Titles',
          availableTypes: ['bar', 'donut', 'line'],
          data: TOP_CONSOLES_HIT_DATA.map(c => ({ name: c.name, value: c.value, count: c.value, color: c.color })),
        };

        const handheldInsight: KeyInsight = {
          headline: "Nintendo DS achieved the highest hit title volume in history (2,163 titles), surpassing even PS2 (2,161).",
          narrative: "While home consoles commanded higher average selling prices ($5,124.6M total), handhelds captured 35% of total catalog releases at lower risk.",
          impact: 'positive',
          metrics: [
            { label: 'DS Hit Volume', value: '2,163 titles', change: 'All-time #1' },
            { label: 'GBA Hit Volume', value: '822 titles' },
            { label: 'Handheld Total Rev', value: '$1,712.4M' },
          ]
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: handheldChart,
              insight: handheldInsight,
              analyticalSummary: `**Handheld vs. Home Console Strategic Comparison:**\n\n• **Handheld Consoles (DS, GBA, 3DS, PSP)**: Generated **$1,712.4M (19.2%)** across 4,892 catalog titles. Lower production budgets allowed rapid iteration and continuous margin stability during transition periods.\n• **Home Consoles (PS2, Xbox 360, PS3, Wii)**: Generated **$5,124.6M (57.4%)** across 8,410 titles. Home consoles captured the largest single-title blockbusters but carried higher development risk.\n• **Strategic Takeaway**: Handhelds acted as an essential hedge, sustaining publisher revenues when home console hardware cycles peaked.`,
              operationProgress: {
                id: 'op-handheld',
                label: 'Segmented handheld vs home console catalog',
                status: 'completed',
                durationMs: 41.5,
              },
              suggestions: [
                { id: 'sug-hh-1', label: "What are Nintendo's dominance drivers?", prompt: "What are the top 3 drivers of Nintendo's dominance?" },
                { id: 'sug-hh-2', label: 'Why did sales decline after 2008?', prompt: 'Why did sales decline after the 2008 peak?' },
                { id: 'sug-hh-3', label: 'Focus on North American sales', prompt: 'Which platform has the highest sales in North America?' },
              ]
            }
          };
        }));

        setActiveArtifact(handheldChart);
        setIsExecuting(false);
        return;
      }

      // QUESTION 3: Why did sales decline after 2008 peak?
      if ((lower.includes('decline') && lower.includes('2008')) || lower.includes('after the 2008 peak') || (lower.includes('why') && lower.includes('2008'))) {
        const declineChart: ChartArtifact = {
          id: `chart-decline-${Date.now()}`,
          title: 'Annual Title Volume & Revenue Trend (2001 - 2015)',
          type: 'line',
          metric: 'Global Sales ($M)',
          dimension: 'Year',
          dataset: 'video_game_sales',
          period: '2001 - 2015',
          unit: '$M',
          availableTypes: ['line', 'area', 'bar'],
          data: VGS_TREND_DATA,
        };

        const declineInsight: KeyInsight = {
          headline: "Packaged software revenue contracted 62.4% from $678.9M (2008) to $264.4M (2015).",
          narrative: "This contraction reflects retail channel disruption rather than reduced gaming engagement: spending migrated to untracked digital & mobile ecosystems.",
          impact: 'warning',
          metrics: [
            { label: '2008 Peak Revenue', value: '$678.9M', change: '1,428 titles' },
            { label: '2015 Post-Peak', value: '$264.4M', change: '-62.4%' },
            { label: 'Catalog Contraction', value: '57% fewer boxed releases' },
          ]
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: declineChart,
              insight: declineInsight,
              analyticalSummary: `**3 Structural Reasons for the Post-2008 Contraction:**\n\n1. **Macroeconomic Recession (2008–2009)**: Discretionary household entertainment spending contracted following the global financial crisis, pulling annual boxed sales from $678.9M down to $515.8M by 2011.\n2. **Late-Cycle 7th-Gen Saturation**: The Wii, PS3, and Xbox 360 installed bases matured, leading to catalog discounting and title volume consolidation.\n3. **Digital & Mobile Channel Disruption**: The explosive rise of smartphones (Apple App Store 2008) and digital store fronts (Steam, PSN, Xbox Live) shifted consumer dollars into digital microtransactions not captured in physical retail tracking.`,
              operationProgress: {
                id: 'op-decline',
                label: 'Aggregated macro trend post-2008',
                status: 'completed',
                durationMs: 36.8,
              },
              suggestions: [
                { id: 'sug-dec-1', label: 'View global sales by decade', prompt: 'How do sales compare across decades?' },
                { id: 'sug-dec-2', label: 'What is our revenue exposure outside NA?', prompt: 'What is our revenue exposure outside North America?' },
                { id: 'sug-dec-3', label: "Drivers of Nintendo's dominance", prompt: "What are the top 3 drivers of Nintendo's dominance?" },
              ]
            }
          };
        }));

        setActiveArtifact(declineChart);
        setIsExecuting(false);
        return;
      }

      // QUESTION 4: Revenue exposure outside North America
      if (lower.includes('outside north america') || (lower.includes('exposure') && lower.includes('revenue')) || (lower.includes('outside') && lower.includes('na'))) {
        const exposureChart: ChartArtifact = {
          id: `chart-exposure-${Date.now()}`,
          title: 'Regional Sales Market Share Breakdown',
          type: 'donut',
          metric: 'Regional Revenue ($M)',
          dimension: 'Region',
          dataset: 'video_game_sales',
          period: '1980 - 2020',
          unit: '$M',
          availableTypes: ['donut', 'bar', 'line'],
          data: REGIONAL_SALES_SHARE_DATA.map(r => ({ name: r.region, value: r.sales, count: Math.round(r.share) })),
        };

        const exposureInsight: KeyInsight = {
          headline: "International markets represent 50.8% ($4,527.5M) of lifetime revenue, led by Europe at $2,434.1M.",
          narrative: "North America drives 49.2% ($4,392.9M). High single-region concentration presents vulnerability to NA consumer sentiment.",
          impact: 'neutral',
          metrics: [
            { label: 'NA Revenue', value: '$4,392.9M (49.2%)' },
            { label: 'Europe Revenue', value: '$2,434.1M (27.3%)' },
            { label: 'Japan Revenue', value: '$1,291.0M (14.5%)' },
          ]
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: exposureChart,
              insight: exposureInsight,
              analyticalSummary: `**International Market Exposure ($4,527.5M non-NA Revenue / 50.8%):**\n\n• **Europe ($2,434.1M / 27.3%)**: Largest international market, heavily indexed to PlayStation hardware and Sports/Racing franchises.\n• **Japan ($1,291.0M / 14.5%)**: Highly idiosyncratic market driven almost entirely by Handhelds (DS, 3DS) and RPGs (Pokémon, Final Fantasy), with near-zero adoption of western shooters.\n• **Other Regions ($797.8M / 9.0%)**: High growth potential but fragmented distribution across Latin America and Asia-Pacific.\n• **Executive Takeaway**: Single-region concentration in North America (49.2%) is a portfolio risk; expanding localization in Europe and Japan provides crucial downside protection.`,
              operationProgress: {
                id: 'op-exposure',
                label: 'Calculated 4-region market share',
                status: 'completed',
                durationMs: 39.4,
              },
              suggestions: [
                { id: 'sug-exp-1', label: 'Which platform has highest NA sales?', prompt: 'Which platform has the highest sales in North America?' },
                { id: 'sug-exp-2', label: "Drivers of Nintendo's dominance", prompt: "What are the top 3 drivers of Nintendo's dominance?" },
                { id: 'sug-exp-3', label: 'Why did sales decline after 2008?', prompt: 'Why did sales decline after the 2008 peak?' },
              ]
            }
          };
        }));

        setActiveArtifact(exposureChart);
        setIsExecuting(false);
        return;
      }

      // SCENARIO A: Filter where publisher = NULLXYZ (From User Screenshot Image 2!)
      if (lower.includes('nullxyz') || (lower.includes('publisher') && lower.includes('null'))) {
        const nullxyzSql: SqlQueryItem = {
          id: `sql-nullxyz-${Date.now()}`,
          label: 'Data & Query Transparency',
          sql: `SELECT name, platform, year, genre, global_sales, publisher
FROM video_game_sales
WHERE (publisher = 'NULLXYZ' OR publisher IS NULL)
  AND global_sales > 0 
  AND global_sales IS NOT NULL
ORDER BY global_sales DESC
LIMIT 58;`,
          executionTimeMs: 50.9,
          rowsReturned: 58,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              analyticalSummary: "The dataset does not contain any games where the publisher is 'NULLXYZ'. However, 58 games have a null publisher value and meet the conditions of global_sales > 0 and global_sales IS NOT NULL.",
              sqlQueries: [nullxyzSql],
              operationProgress: {
                id: 'step-done',
                label: 'Returned 58 rows in 50.9ms',
                status: 'completed',
                durationMs: 50.9,
              },
              suggestions: [
                { id: 'sug-n1', label: 'Inspect 58 null publisher titles', prompt: 'List top 10 titles where publisher is null' },
                { id: 'sug-n2', label: 'Group null publisher games by genre', prompt: 'What genres do games with null publishers belong to?' },
                { id: 'sug-n3', label: 'Revert to all publishers', prompt: 'What is the total global sales by genre?' },
              ],
            }
          };
        }));
        setIsExecuting(false);
        return;
      }

      // SCENARIO B: Nonexistent Metric Error (From User Screenshot Image 2!)
      if (lower.includes('nonexistent') || lower.includes('invalid metric') || lower.includes('unknown_column')) {
        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              analyticalSummary: "The requested metric does not exist in the dataset. Could you please specify which metric you'd like to use for the chart?",
              error: {
                message: "The requested metric does not exist in the dataset. Could you please specify which metric you'd like to use for the chart?",
                recoveryAction: {
                  id: 'rec-1',
                  label: 'Use SUM(global_sales)',
                  prompt: 'What is the total global sales by genre?',
                  category: 'recovery'
                }
              },
              operationProgress: {
                id: 'step-err',
                label: 'Catalog metric resolution failed',
                status: 'failed',
                durationMs: 24,
              },
              suggestions: [
                { id: 'rec-1', label: 'Use SUM(global_sales)', prompt: 'What is the total global sales by genre?' },
                { id: 'rec-2', label: 'Use SUM(na_sales)', prompt: 'Which platform has the highest sales in North America?' },
                { id: 'rec-3', label: 'View all columns', prompt: 'List all available columns in video_game_sales' },
              ],
              sqlQueries: [],
            }
          };
        }));
        setIsExecuting(false);
        return;
      }

      // SCENARIO C: Platform Sales in North America (Starter Pill 2)
      if (lower.includes('north america') || (lower.includes('highest') && lower.includes('platform')) || lower.includes('na sales')) {
        const platformChart: ChartArtifact = {
          id: `chart-platform-${Date.now()}`,
          title: 'Platform Sales in North America (Top Platforms)',
          type: 'bar',
          metric: 'North America Revenue ($M)',
          dimension: 'Platform',
          dataset: 'video_game_sales',
          period: '1980 - 2020',
          unit: '$M',
          availableTypes: ['bar', 'line', 'donut', 'area'],
          data: VGS_PLATFORM_NA_DATA,
        };

        const platformInsight: KeyInsight = {
          headline: 'Xbox 360 leads North American lifetime revenue ($601.0M), closely followed by PS2 ($582.9M).',
          narrative: 'Xbox 360 and PlayStation 2 collectively generated $1,183.9M in North America, representing 27.3% of all regional historical software revenue. Nintendo Wii takes 3rd place with $507.5M.',
          impact: 'positive',
          metrics: [
            { label: 'Rank 1 Platform', value: 'Xbox 360 ($601.0M)', change: '+3.1% vs PS2' },
            { label: 'Rank 2 Platform', value: 'PS2 ($582.9M)' },
            { label: 'Top 5 Cumulative', value: '$2,474.1M' },
          ]
        };

        const platformSql: SqlQueryItem = {
          id: `sql-plat-${Date.now()}`,
          label: 'North America Platform Slicing',
          sql: `SELECT 
    platform,
    ROUND(SUM(na_sales), 2) AS total_na_sales_m,
    ROUND(SUM(global_sales), 2) AS total_global_sales_m,
    COUNT(*) AS title_count
FROM video_game_sales
WHERE na_sales > 0
GROUP BY platform
ORDER BY total_na_sales_m DESC
LIMIT 8;`,
          executionTimeMs: 44.1,
          rowsReturned: 8,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: platformChart,
              insight: platformInsight,
              analyticalSummary: 'Analyzed North American software revenues across 31 historical gaming platforms. Xbox 360 holds the #1 position.',
              sqlQueries: [platformSql],
              operationProgress: {
                id: 'op-plat',
                label: 'Aggregated 16,598 records by platform for NA region',
                status: 'completed',
                durationMs: 44.1,
              },
              suggestions: [
                { id: 'sug-p1', label: 'Compare NA vs Europe for Xbox 360', prompt: 'Compare North America vs Europe sales for Xbox 360 and PS3' },
                { id: 'sug-p2', label: 'Filter to Nintendo platforms only', prompt: 'Filter platform sales to Wii, DS, and Game Boy Advance' },
                { id: 'sug-p3', label: 'How have sales changed over years?', prompt: 'How have global sales trends changed over the years?' },
              ]
            }
          };
        }));

        setActiveArtifact(platformChart);
        setIsExecuting(false);
        return;
      }

      // SCENARIO D: Historical Trend (Starter Pill 3)
      if (lower.includes('trend') || lower.includes('years') || lower.includes('over time') || lower.includes('history')) {
        const isWb = activeContext.dataset === 'wb_health_population' || lower.includes('mortality') || lower.includes('child');
        
        const trendChart: ChartArtifact = isWb ? {
          id: `chart-wb-mortality-${Date.now()}`,
          title: 'Global Under-5 Child Mortality Rate (1990 - 2020)',
          type: 'line',
          metric: 'Mortality per 1,000 live births',
          dimension: 'Year',
          dataset: 'wb_health_population',
          period: '1990 - 2020',
          unit: 'per 1k',
          availableTypes: ['line', 'area', 'bar', 'donut'],
          data: WB_MORTALITY_DATA,
        } : {
          id: `chart-trend-${Date.now()}`,
          title: 'Global Video Game Sales Trajectory (1995 - 2020)',
          type: 'line',
          metric: 'Annual Revenue ($M)',
          dimension: 'Year',
          dataset: 'video_game_sales',
          period: '1995 - 2020',
          unit: '$M',
          availableTypes: ['line', 'area', 'bar', 'donut'],
          data: VGS_TREND_DATA,
        };

        const trendInsight: KeyInsight = isWb ? {
          headline: 'Global under-5 child mortality fell 59.5% from 93.2 to 37.7 deaths per 1,000 live births.',
          narrative: 'Progress accelerated after 2000 following targeted neonatal interventions, with global mortality dropping by more than half over the 30-year observation window.',
          impact: 'positive',
          metrics: [
            { label: '30-Yr Reduction', value: '-59.5%', change: '1990 to 2020' },
            { label: '2020 Rate', value: '37.7 per 1,000' },
            { label: 'Countries Tracked', value: '195 nations' },
          ]
        } : {
          headline: 'Physical gaming revenue crested in 2008 at $678.9M before transition to digital distribution.',
          narrative: 'A steep 7.7x expansion between 1995 ($88.1M) and 2008 was accelerated by 7th-gen consoles (PS3, X360, Wii). Packaged retail softened after 2012 as digital delivery expanded.',
          impact: 'neutral',
          metrics: [
            { label: 'Peak Year', value: '2008 ($678.9M)' },
            { label: '10-Yr Expansion', value: '+164.7% (1998-2008)' },
            { label: 'Total Volume', value: '16,598 titles' },
          ]
        };

        const trendSql: SqlQueryItem = {
          id: `sql-trend-${Date.now()}`,
          label: isWb ? 'Child Mortality Trajectory' : 'Annual Sales Trend Aggregation',
          sql: isWb ? `SELECT 
    year,
    ROUND(AVG(mortality_rate_under5), 1) AS avg_mortality_rate
FROM wb_health_population
WHERE year >= 1990
GROUP BY year
ORDER BY year ASC;` : `SELECT 
    year,
    ROUND(SUM(global_sales), 2) AS total_annual_sales_m,
    ROUND(SUM(na_sales), 2) AS na_annual_sales_m
FROM video_game_sales
WHERE year >= 1995 AND year <= 2020
GROUP BY year
ORDER BY year ASC;`,
          executionTimeMs: 41.3,
          rowsReturned: isWb ? 7 : 10,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: trendChart,
              insight: trendInsight,
              analyticalSummary: isWb 
                ? 'Queried global child mortality indicators from 1990 to 2020 across 195 verified nations.'
                : 'Computed longitudinal annual revenue across 25 calendar years. Identified peak inflection at 2008.',
              sqlQueries: [trendSql],
              operationProgress: {
                id: 'op-trend',
                label: `Aggregated time series trajectory (${trendChart.period})`,
                status: 'completed',
                durationMs: 41.3,
              },
              suggestions: [
                { id: 'sug-t1', label: 'View as Area chart', prompt: 'Convert this trajectory into an Area chart' },
                { id: 'sug-t2', label: 'Drill down into 2008 peak', prompt: 'What were the top 10 bestselling games in 2008?' },
                { id: 'sug-t3', label: 'Compare by platform in peak year', prompt: 'Which platforms generated the most revenue in 2008?' },
              ]
            }
          };
        }));

        setActiveArtifact(trendChart);
        setIsExecuting(false);
        return;
      }

      // SCENARIO E: World Bank Safe Water Access
      if (lower.includes('water') || lower.includes('safe water')) {
        const waterChart: ChartArtifact = {
          id: `chart-wb-water-${Date.now()}`,
          title: 'Access to Safely Managed Drinking Water by Region (%)',
          type: 'bar',
          metric: 'Safe Water Coverage (%)',
          dimension: 'Region',
          dataset: 'wb_health_population',
          period: 'Latest Year (2020)',
          unit: '%',
          availableTypes: ['bar', 'line', 'donut', 'area'],
          data: WB_WATER_DATA,
        };

        const waterInsight: KeyInsight = {
          headline: 'North America (99.8%) and Europe (98.4%) achieve near-universal access, while Sub-Saharan Africa lags at 58.3%.',
          narrative: 'A 41.5 percentage point coverage gap exists between developed regions and Sub-Saharan Africa. Rural South Asia (74.6%) also exhibits substantial infrastructure deficits.',
          impact: 'warning',
          metrics: [
            { label: 'Highest Access', value: 'North America (99.8%)' },
            { label: 'Lowest Access', value: 'Sub-Saharan Africa (58.3%)' },
            { label: 'Coverage Gap', value: '41.5% Gap' },
          ]
        };

        const waterSql: SqlQueryItem = {
          id: `sql-water-${Date.now()}`,
          label: 'Regional Water Access Distribution',
          sql: `SELECT 
    region,
    ROUND(AVG(access_to_safe_water), 1) AS pct_safe_water_access
FROM wb_health_population
WHERE access_to_safe_water IS NOT NULL
GROUP BY region
ORDER BY pct_safe_water_access DESC;`,
          executionTimeMs: 36.4,
          rowsReturned: 7,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: waterChart,
              insight: waterInsight,
              analyticalSummary: 'Evaluated safe drinking water access percentages across 7 geographic regions. Disparities remain sharp between developed and developing zones.',
              sqlQueries: [waterSql],
              operationProgress: {
                id: 'op-water',
                label: 'Calculated regional drinking water means',
                status: 'completed',
                durationMs: 36.4,
              },
              suggestions: [
                { id: 'sug-w1', label: 'Compare with child mortality', prompt: 'What is the trend in child mortality over the years?' },
                { id: 'sug-w2', label: 'Examine Sub-Saharan African countries', prompt: 'List bottom 10 countries by water access in Sub-Saharan Africa' },
              ]
            }
          };
        }));

        setActiveArtifact(waterChart);
        setIsExecuting(false);
        return;
      }

      // SCENARIO F: World Bank HIV Rates
      if (lower.includes('hiv') || lower.includes('female')) {
        const hivChart: ChartArtifact = {
          id: `chart-wb-hiv-${Date.now()}`,
          title: 'Female HIV Prevalence Rate Across Regions (% of females ages 15-49)',
          type: 'donut',
          metric: 'Prevalence Rate (%)',
          dimension: 'Region',
          dataset: 'wb_health_population',
          period: 'Latest Year (2020)',
          unit: '%',
          availableTypes: ['donut', 'bar', 'line', 'area'],
          data: WB_HIV_DATA,
        };

        const hivInsight: KeyInsight = {
          headline: 'Sub-Saharan Africa bears the highest burden with 4.7% female HIV prevalence, over 10x other regions.',
          narrative: 'Prevalence rates in Sub-Saharan Africa (4.7%) vastly exceed Latin America (0.4%), North America (0.3%), and Europe (0.2%), highlighting urgent healthcare support needs.',
          impact: 'critical',
          metrics: [
            { label: 'Highest Region', value: 'Sub-Saharan Africa (4.7%)' },
            { label: 'Global Median', value: '0.3%' },
            { label: 'Disparity Ratio', value: '11.8x' },
          ]
        };

        const hivSql: SqlQueryItem = {
          id: `sql-hiv-${Date.now()}`,
          label: 'Female HIV Regional Prevalence',
          sql: `SELECT 
    region,
    ROUND(AVG(hiv_prevalence_female), 2) AS avg_female_hiv_rate
FROM wb_health_population
WHERE hiv_prevalence_female IS NOT NULL
GROUP BY region
ORDER BY avg_female_hiv_rate DESC;`,
          executionTimeMs: 38.0,
          rowsReturned: 6,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              chart: hivChart,
              insight: hivInsight,
              analyticalSummary: 'Calculated female HIV prevalence rates across 6 regional macro-territories.',
              sqlQueries: [hivSql],
              operationProgress: {
                id: 'op-hiv',
                label: 'Aggregated regional HIV prevalence',
                status: 'completed',
                durationMs: 38.0,
              },
              suggestions: [
                { id: 'sug-h1', label: 'View as Bar chart', prompt: 'Convert HIV comparison to a Bar chart' },
                { id: 'sug-h2', label: 'Trend mortality rates over time', prompt: 'What is the trend in child mortality over the years?' },
              ]
            }
          };
        }));

        setActiveArtifact(hivChart);
        setIsExecuting(false);
        return;
      }

      // DEFAULT / FALLBACK ANALYTICAL QUERY
      const defaultChart: ChartArtifact = {
        id: `chart-${Date.now()}`,
        title: `Analysis: ${textToSend.slice(0, 42)}`,
        type: 'bar',
        metric: activeContext.metric,
        dimension: activeContext.dimension,
        dataset: activeContext.dataset,
        period: activeContext.period,
        unit: activeContext.dataset === 'video_game_sales' ? '$M' : 'rate',
        availableTypes: ['bar', 'line', 'donut', 'area'],
        data: activeContext.dataset === 'video_game_sales' ? VGS_GENRE_DATA : WB_MORTALITY_DATA,
      };

      const defaultInsight: KeyInsight = {
        headline: `Analysis completed across ${activeContext.dataset} with 100% filter validity.`,
        narrative: `Aggregated data matching criteria '${textToSend}'. Dimensions ranked by cumulative magnitude with verified schema consistency.`,
        impact: 'positive',
        metrics: [
          { label: 'Scope', value: activeContext.dataset },
          { label: 'Filter Status', value: `${activeContext.filters.length} active` },
          { label: 'Execution', value: '38.2ms' },
        ]
      };

      const defaultSql: SqlQueryItem = {
        id: `sql-${Date.now()}`,
        label: 'Optimized Dialect Query',
        sql: `SELECT 
    ${activeContext.dimension},
    ROUND(${activeContext.metric}, 2) AS metric_value
FROM ${activeContext.dataset}
WHERE ${activeContext.filters.join(' AND ')}
GROUP BY ${activeContext.dimension}
ORDER BY metric_value DESC
LIMIT 8;`,
        executionTimeMs: 38.2,
        rowsReturned: 8,
        dialect: 'Trino SQL'
      };

      setTurns(prev => prev.map(t => {
        if (t.id !== asstTurnId) return t;
        return {
          ...t,
          assistantData: {
            ...t.assistantData!,
            chart: defaultChart,
            insight: defaultInsight,
            analyticalSummary: `Successfully executed analysis for "${textToSend}". Visualized dimensional aggregates below.`,
            sqlQueries: [defaultSql],
            operationProgress: {
              id: 'op-def',
              label: `Executed query and rendered visual`,
              status: 'completed',
              durationMs: 38.2,
            },
            suggestions: [
              { id: 'sug-d1', label: 'Which platform has highest sales in NA?', prompt: 'Which platform has the highest sales in North America?' },
              { id: 'sug-d2', label: 'How have sales changed over years?', prompt: 'How have global sales trends changed over the years?' },
              { id: 'sug-d3', label: 'Filter where publisher = NULLXYZ', prompt: 'Filter where publisher = NULLXYZ' },
            ]
          }
        };
      }));

      setActiveArtifact(defaultChart);
      setIsExecuting(false);
    }, 400);
  }, [composerText, isExecuting, turns, activeContext, activeArtifact]);

  // UNDO ACTION (Capability 6)
  const handleUndo = useCallback(() => {
    if (turns.length === 0 || isExecuting) return;

    const lastAssistantIdx = [...turns].reverse().findIndex(t => t.sender === 'assistant');
    if (lastAssistantIdx === -1) return;

    const actualIdx = turns.length - 1 - lastAssistantIdx;
    const userTurnBefore = actualIdx > 0 ? turns[actualIdx - 1] : null;
    const userPromptToRestore = userTurnBefore && userTurnBefore.sender === 'user' ? userTurnBefore.content || '' : '';

    if (composerText.trim().length > 0) {
      setStashedDraft(composerText);
    }

    if (userPromptToRestore) {
      setComposerText(userPromptToRestore);
    }

    const lastSnapshot = stateSnapshotsRef.current.pop();
    if (lastSnapshot) {
      setTurns(lastSnapshot.turns);
      setActiveContext(lastSnapshot.context);
      setActiveArtifact(lastSnapshot.artifact);
    } else {
      setTurns(prev => prev.slice(0, Math.max(0, actualIdx - 1)));
    }

    const auditEntry: AuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      action: 'undo',
      details: `Reverted turn "${userPromptToRestore.slice(0, 30)}..." and restored prior context state.`,
      restoredPrompt: userPromptToRestore,
    };
    setAuditLog(prev => [auditEntry, ...prev]);
  }, [turns, isExecuting, composerText]);

  // RETRY ACTION (Capability 6)
  const handleRetry = useCallback((turnId: string, mode: 'network' | 'analytical') => {
    if (isExecuting) return;

    setTurns(prev => prev.map(t => {
      if (t.id !== turnId || !t.assistantData) return t;
      return {
        ...t,
        assistantData: {
          ...t.assistantData,
          operationProgress: {
            id: 'retry-step',
            label: mode === 'network' ? 'Reconnecting to stream...' : 'Re-running analytical plan...',
            status: 'active',
            durationMs: 25,
          }
        }
      };
    }));

    setTimeout(() => {
      setTurns(prev => prev.map(t => {
        if (t.id !== turnId || !t.assistantData) return t;
        return {
          ...t,
          assistantData: {
            ...t.assistantData,
            error: undefined,
            operationProgress: {
              id: 'retry-done',
              label: 'Execution verified',
              status: 'completed',
              durationMs: 38,
            }
          }
        };
      }));
    }, 400);
  }, [isExecuting]);

  // QUICK CHART ACTION (Capability 2)
  const handleQuickChart = useCallback((turnId: string, chartType: ChartType) => {
    setTurns(prev => prev.map(turn => {
      if (turn.id !== turnId || !turn.assistantData || !turn.assistantData.chart) return turn;
      const updatedChart: ChartArtifact = {
        ...turn.assistantData.chart,
        type: chartType,
      };
      if (activeArtifact && activeArtifact.id === turn.assistantData.chart.id) {
        setActiveArtifact(updatedChart);
      }
      return {
        ...turn,
        assistantData: {
          ...turn.assistantData,
          chart: updatedChart,
        }
      };
    }));
  }, [activeArtifact]);

  // Switch Dataset
  const switchDataset = useCallback((datasetId: string) => {
    const isHealth = datasetId === 'wb_health_population';

    const newContext: ContextFilter = {
      dataset: datasetId,
      filters: isHealth ? ['year >= 2010', 'indicator = "SH.DYN.MORT"'] : ['publisher IS NOT NULL', 'global_sales > 0'],
      metric: isHealth ? 'Mortality Rate (per 1,000)' : 'SUM(global_sales)',
      dimension: isHealth ? 'Region' : 'Genre',
      period: isHealth ? '2010 - 2022' : '1980 - 2020',
      grain: isHealth ? 'By Geographic Region' : 'By Genre',
      aggregation: isHealth ? 'Average Rate' : 'SUM ($M)',
      comparisonBaseline: isHealth ? 'Global Baseline' : 'Historical Catalog',
      topN: isHealth ? 'All Regions' : 'Top 8 Genres',
      completeness: '100% verified',
      sort: 'Descending',
    };

    const newChart: ChartArtifact = {
      id: `chart-${datasetId}`,
      title: isHealth ? 'Child Mortality Rate by Geographic Region' : 'Global Video Game Sales by Genre',
      type: 'bar',
      metric: isHealth ? 'Mortality Rate (per 1,000)' : 'Global Sales ($M)',
      dimension: isHealth ? 'Region' : 'Genre',
      dataset: datasetId,
      period: isHealth ? '2010 - 2022' : '1980 - 2020',
      unit: isHealth ? 'per 1k' : '$M',
      availableTypes: ['bar', 'line', 'donut', 'area'],
      data: isHealth ? WB_WATER_DATA : VGS_GENRE_DATA,
    };

    const newInsight: KeyInsight = {
      headline: isHealth 
        ? 'Sub-Saharan Africa and South Asia exhibit the highest child mortality rates.'
        : 'Action and Sports represent 35% of all-time global industry revenues.',
      narrative: isHealth
        ? 'Sub-Saharan Africa averages 76.5 deaths per 1,000 live births, compared to 5.6 in North America (a 13.6x disparity).'
        : 'Action games lead historically with $1,751.2M in cumulative revenue (+31.6% ahead of Sports).',
      impact: 'warning',
      metrics: isHealth ? [
        { label: 'Highest Region', value: '76.5 / 1k' },
        { label: 'Lowest Region', value: '5.6 / 1k' },
        { label: 'Regional Gap', value: '13.6x' },
      ] : [
        { label: 'Top Genre', value: 'Action ($1.75B)', change: '+31.6% vs #2' },
        { label: 'Shooter NA Skew', value: '56.1%', change: 'Highest regional share' },
      ]
    };

    const newSql: SqlQueryItem[] = [
      {
        id: `q-${datasetId}`,
        label: `${isHealth ? 'Regional Mortality' : 'Genre Sales'} Query`,
        sql: isHealth ? `SELECT 
    region,
    ROUND(AVG(mortality_rate_under5), 1) AS avg_child_mortality_per_1000
FROM wb_health_population
WHERE year >= 2010
GROUP BY region
ORDER BY avg_child_mortality_per_1000 DESC;` : `SELECT 
    genre,
    ROUND(SUM(global_sales), 2) AS total_global_sales_m
FROM video_game_sales
WHERE publisher IS NOT NULL
GROUP BY genre
ORDER BY total_global_sales_m DESC
LIMIT 8;`,
        executionTimeMs: 42.1,
        rowsReturned: isHealth ? 7 : 8,
        dialect: 'Trino SQL',
      }
    ];

    setActiveContext(newContext);
    setActiveArtifact(newChart);

    // Update conversation with clean switch
    setTurns([
      {
        id: `switch-turn-user`,
        sender: 'user',
        timestamp: 'Just now',
        content: isHealth ? 'What is the trend in child mortality by region?' : 'What is the total global sales by genre?',
      },
      {
        id: `switch-turn-asst`,
        sender: 'assistant',
        timestamp: 'Just now',
        assistantData: {
          id: `asst-switch`,
          chart: newChart,
          insight: newInsight,
          analyticalSummary: isHealth 
            ? 'Loaded World Bank indicators across 217 countries. Aggregated regional averages for child mortality.'
            : 'Aggregated 16,598 verified titles across 12 genre groupings.',
          context: newContext,
          suggestions: isHealth ? [
            { id: 'h1', label: 'Access to safe water by region', prompt: 'How does access to safe water vary by region?' },
            { id: 'h2', label: 'HIV rates in females', prompt: 'Compare HIV rates in females across regions' },
          ] : [
            { id: 'v1', label: 'Show NA vs EU breakdown', prompt: 'Compare North America sales vs Europe sales' },
            { id: 'v2', label: 'Filter top 5 publishers', prompt: 'Filter this genre analysis to top 5 publishers' },
          ],
          sqlQueries: newSql,
          operationProgress: {
            id: 'op-switch',
            label: `Switched catalog to ${datasetId}`,
            status: 'completed',
            durationMs: 38,
          }
        }
      }
    ]);
  }, []);

  return {
    workspaceMode,
    setWorkspaceMode,
    canvasViewMode,
    setCanvasViewMode,
    turns,
    setTurns,
    activeContext,
    setActiveContext,
    composerText,
    setComposerText,
    stashedDraft,
    setStashedDraft,
    activeArtifact,
    setActiveArtifact,
    activeArtifactTab,
    setActiveArtifactTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isGlossaryOpen,
    setIsGlossaryOpen,
    isIconSettingsOpen,
    setIsIconSettingsOpen,
    isContextDrawerOpen,
    setIsContextDrawerOpen,
    isExecuting,
    auditLog,
    iconSettings,
    toggleIcon,
    sendPrompt,
    handleUndo,
    handleRetry,
    handleQuickChart,
    switchDataset,
    removeFilter,
    dashboardViewMode,
    setDashboardViewMode,
    userProfile,
    pinnedCharts,
    pinChartToDashboard,
    pinToast,
    pinWidgetContext,
    autoGenerateStarterDashboard,
  };
}

