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
  ReasoningStep,
  TokenUsage,
  KeyInsight, 
  SqlQueryItem,
  DashboardViewMode,
  UserProfile,
  ChatSession
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
  WB_HIV_DATA,
  MOCK_CHATS,
  MOCK_SESSIONS_MAP
} from '../data/mockData';

export function getReasoningStepsForPrompt(textToSend: string): ReasoningStep[] {
  const lower = textToSend.toLowerCase();

  if (lower.includes('standup') || lower.includes('prep me') || lower.includes('meeting prep') || (lower.includes('meeting') && lower.includes('prep'))) {
    return [
      { id: 'rs-1', label: 'Planned the data checks across 9 visual slices', status: 'completed' },
      { id: 'rs-2', label: 'Understand available time coverage and confirm existence of required columns (year, genre, platform, na_sales, eu_sales, global_sales)', status: 'completed' },
      { id: 'rs-3', label: 'Inspect North America revenue concentration and compute regional share (49.2%)', status: 'completed' },
      { id: 'rs-4', label: 'Calculate top publisher market concentration across top 25 historical releases (Nintendo 72%)', status: 'completed' },
      { id: 'rs-5', label: 'Synthesized 2-part executive briefing: growth highlights and vulnerabilities', status: 'completed' },
      { id: 'rs-6', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('teams') || lower.includes('format for teams') || lower.includes('microsoft teams')) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Query global and regional totals across 16,598 catalog titles', status: 'completed' },
      { id: 'rs-3', label: 'Compute top genre contributions and regional concentration breakdown', status: 'completed' },
      { id: 'rs-4', label: 'Format executive key points into standardized bulleted communication structure', status: 'completed' },
      { id: 'rs-5', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('nintendo') && (lower.includes('dominance') || lower.includes('driver') || lower.includes('top 3') || lower.includes('lead'))) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Understand available time coverage and confirm existence of required columns (publisher, title, global_sales, platform) for analysis.', status: 'completed' },
      { id: 'rs-3', label: 'Identify which publishers contributed most to total historical volume across catalog', status: 'completed' },
      { id: 'rs-4', label: 'Chose a chart approach', status: 'completed' },
      { id: 'rs-5', label: 'Building bar chart of revenue by publisher', status: 'completed' },
      { id: 'rs-6', label: 'Created chart preview: Global Video Game Sales by Publisher', status: 'completed' },
      { id: 'rs-7', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('handheld') || (lower.includes('ds') && lower.includes('gba')) || lower.includes('home console')) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Understand available time coverage and classify consoles into Handheld (DS, GBA, 3DS, PSP) vs Home Consoles (PS2, PS3, Xbox 360, Wii)', status: 'completed' },
      { id: 'rs-3', label: 'Identify which platform form factors contributed most to total volume and hit title count', status: 'completed' },
      { id: 'rs-4', label: 'Chose a chart approach', status: 'completed' },
      { id: 'rs-5', label: 'Building bar chart of top consoles by hit game volume', status: 'completed' },
      { id: 'rs-6', label: 'Created chart preview: Top Consoles, by # of Hit Games', status: 'completed' },
      { id: 'rs-7', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('decline') || lower.includes('2008') || lower.includes('peak')) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Understand available time coverage and confirm existence of required columns (year, global_sales, na_sales) for analysis.', status: 'completed' },
      { id: 'rs-3', label: 'Identify inflection point at 2008 ($678.9M peak) and compute subsequent contraction values', status: 'completed' },
      { id: 'rs-4', label: 'Evaluate 3 macroeconomic and channel drivers: recession, 7th-gen cycle saturation, and smartphone/digital transition', status: 'completed' },
      { id: 'rs-5', label: 'Chose a chart approach', status: 'completed' },
      { id: 'rs-6', label: 'Created chart preview: Historical Sales Trend (1995-2016)', status: 'completed' },
      { id: 'rs-7', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('outside north america') || lower.includes('exposure') || lower.includes('outside na')) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Understand available time coverage and confirm existence of required columns (na_sales, eu_sales, jp_sales, other_sales, global_sales)', status: 'completed' },
      { id: 'rs-3', label: 'Identify which regions contributed most to change in revenue and compute delta and contribution values', status: 'completed' },
      { id: 'rs-4', label: 'Calculate North America concentration ratio (49.2%) vs international market diversification (50.8%)', status: 'completed' },
      { id: 'rs-5', label: 'Chose a chart approach', status: 'completed' },
      { id: 'rs-6', label: 'Created chart preview: Regional Sales Share', status: 'completed' },
      { id: 'rs-7', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('filter') || lower.includes('slice by')) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Validate semantic filter predicate against active dataset schema', status: 'completed' },
      { id: 'rs-3', label: 'Recompute dimensional aggregates and affected card values', status: 'completed' },
      { id: 'rs-4', label: 'Synchronized filter slices across all visual dashboard widgets', status: 'completed' },
      { id: 'rs-5', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  if (lower.includes('platform') || lower.includes('highest sales in north america') || lower.includes('na')) {
    return [
      { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
      { id: 'rs-2', label: 'Understand available time coverage and confirm existence of required columns (platform, na_sales, global_sales) for analysis.', status: 'completed' },
      { id: 'rs-3', label: 'Identify which console platforms contributed most to North American sales by computing totals and rank', status: 'completed' },
      { id: 'rs-4', label: 'Chose a chart approach', status: 'completed' },
      { id: 'rs-5', label: 'Building bar chart of NA sales by platform', status: 'completed' },
      { id: 'rs-6', label: 'Created chart preview: Top Platforms in North America', status: 'completed' },
      { id: 'rs-7', label: 'Completed data investigation', status: 'completed' },
    ];
  }

  // Default / Generic matching media_1789991062233.png
  return [
    { id: 'rs-1', label: 'Planned the data checks', status: 'completed' },
    { id: 'rs-2', label: 'Understand available time coverage and confirm existence of required columns (year, country, sales, product_line) for analysis.', status: 'completed' },
    { id: 'rs-3', label: 'Identify which dimensions contributed most to variance across catalog intervals by computing delta and contribution values.', status: 'completed' },
    { id: 'rs-4', label: 'Chose a chart approach', status: 'completed' },
    { id: 'rs-5', label: 'Building dimensional aggregation and verifying semantic Trino query', status: 'completed' },
    { id: 'rs-6', label: `Created chart preview: Analysis for ${textToSend.slice(0, 26)}`, status: 'completed' },
    { id: 'rs-7', label: 'Completed data investigation', status: 'completed' },
  ];
}

export function getTokenUsageForPrompt(textToSend: string, durationMs: number = 1320): TokenUsage {
  const lower = textToSend.toLowerCase();
  const latencySeconds = Math.max(0.8, +(durationMs / 1000).toFixed(2));

  if (lower.includes('standup') || lower.includes('prep me') || lower.includes('meeting prep') || (lower.includes('meeting') && lower.includes('prep'))) {
    return {
      promptTokens: 486,
      completionTokens: 942,
      totalTokens: 1428,
      latencySeconds,
      tokensPerSecond: Math.round(942 / latencySeconds),
      estimatedCostUsd: 0.0022,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.7,
    };
  }

  if (lower.includes('teams') || lower.includes('format for teams') || lower.includes('microsoft teams')) {
    return {
      promptTokens: 412,
      completionTokens: 786,
      totalTokens: 1198,
      latencySeconds,
      tokensPerSecond: Math.round(786 / latencySeconds),
      estimatedCostUsd: 0.0018,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.6,
    };
  }

  if (lower.includes('nintendo')) {
    return {
      promptTokens: 418,
      completionTokens: 764,
      totalTokens: 1182,
      latencySeconds,
      tokensPerSecond: Math.round(764 / latencySeconds),
      estimatedCostUsd: 0.0018,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.6,
    };
  }

  if (lower.includes('handheld') || lower.includes('ds') || lower.includes('gba') || lower.includes('home console')) {
    return {
      promptTokens: 440,
      completionTokens: 792,
      totalTokens: 1232,
      latencySeconds,
      tokensPerSecond: Math.round(792 / latencySeconds),
      estimatedCostUsd: 0.0019,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.6,
    };
  }

  if (lower.includes('decline') || lower.includes('2008') || lower.includes('peak')) {
    return {
      promptTokens: 432,
      completionTokens: 816,
      totalTokens: 1248,
      latencySeconds,
      tokensPerSecond: Math.round(816 / latencySeconds),
      estimatedCostUsd: 0.0019,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.6,
    };
  }

  if (lower.includes('outside north america') || lower.includes('exposure') || lower.includes('outside na')) {
    return {
      promptTokens: 426,
      completionTokens: 784,
      totalTokens: 1210,
      latencySeconds,
      tokensPerSecond: Math.round(784 / latencySeconds),
      estimatedCostUsd: 0.0018,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.6,
    };
  }

  if (lower.includes('filter') || lower.includes('slice by')) {
    return {
      promptTokens: 312,
      completionTokens: 328,
      totalTokens: 640,
      latencySeconds: Math.max(0.6, +(latencySeconds * 0.7).toFixed(2)),
      tokensPerSecond: Math.round(328 / Math.max(0.6, latencySeconds * 0.7)),
      estimatedCostUsd: 0.0009,
      modelName: 'Ask AI Semantic Engine',
      contextWindowPct: 0.3,
    };
  }

  // Generic / Default
  const promptEstimate = 380 + Math.round(Math.min(textToSend.length * 0.8, 120));
  const completionEstimate = 580 + Math.round(Math.min(textToSend.length * 1.2, 350));
  const total = promptEstimate + completionEstimate;
  return {
    promptTokens: promptEstimate,
    completionTokens: completionEstimate,
    totalTokens: total,
    latencySeconds,
    tokensPerSecond: Math.round(completionEstimate / latencySeconds),
    estimatedCostUsd: +(total * 0.0000015).toFixed(4),
    modelName: 'Ask AI Semantic Engine',
    contextWindowPct: 0.5,
  };
}

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
  const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isIconSettingsOpen, setIsIconSettingsOpen] = useState<boolean>(false);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState<boolean>(false);
  const savedSessionsMapRef = useRef<Record<string, { turns: MessageTurn[]; context: ContextFilter; artifact: ChartArtifact | null }>>({
    ...MOCK_SESSIONS_MAP
  });

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
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const openInCanvas = useCallback((chart?: ChartArtifact) => {
    if (chart) {
      setActiveArtifact(chart);
    }
    setIsCanvasOpen(true);
  }, []);

  // Session Management (New Chat, Load Session, Delete Session)
  const startNewChat = useCallback(() => {
    // 1. Snapshot current active session state if any
    if (activeChatId && turns.length > 0) {
      savedSessionsMapRef.current[activeChatId] = {
        turns: [...turns],
        context: { ...activeContext },
        artifact: activeArtifact ? { ...activeArtifact } : null,
      };
    }

    // 2. Clear running step timers if executing
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
    setIsExecuting(false);

    // 3. Create fresh new chat session
    const newChatId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newChatId,
      title: 'New Conversation',
      updatedAt: 'Just now',
      timeGroup: 'Today',
      datasetId: activeContext.dataset,
      turnCount: 0,
    };

    savedSessionsMapRef.current[newChatId] = {
      turns: [],
      context: INITIAL_CONTEXT,
      artifact: INITIAL_CHART,
    };

    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatId(newChatId);
    setTurns([]);
    setComposerText('');
    setActiveContext(INITIAL_CONTEXT);
    setActiveArtifact(INITIAL_CHART);
    setIsRecentChatsOpen(false);
  }, [activeChatId, turns, activeContext, activeArtifact]);

  const loadChatSession = useCallback((sessionId: string) => {
    // 1. Save current session state before switching (if it has turns)
    if (activeChatId && activeChatId !== sessionId && turns.length > 0) {
      savedSessionsMapRef.current[activeChatId] = {
        turns: [...turns],
        context: { ...activeContext },
        artifact: activeArtifact ? { ...activeArtifact } : null,
      };
    }

    // 2. Clear running step timers if executing
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
    setIsExecuting(false);

    // 3. Retrieve target session
    const target = savedSessionsMapRef.current[sessionId] || MOCK_SESSIONS_MAP[sessionId];
    if (target) {
      setActiveChatId(sessionId);
      setTurns(target.turns);
      setActiveContext(target.context);
      setActiveArtifact(target.artifact);
    } else {
      setActiveChatId(sessionId);
      setTurns([]);
    }
    setComposerText('');
    setIsRecentChatsOpen(false);
  }, [activeChatId, turns, activeContext, activeArtifact]);

  const deleteChatSession = useCallback((sessionId: string) => {
    setChatSessions(prev => {
      const remaining = prev.filter(s => s.id !== sessionId);
      delete savedSessionsMapRef.current[sessionId];

      if (activeChatId === sessionId) {
        if (remaining.length > 0) {
          const next = remaining[0];
          setTimeout(() => loadChatSession(next.id), 0);
        } else {
          setTimeout(() => startNewChat(), 0);
        }
      }
      return remaining;
    });
  }, [activeChatId, loadChatSession, startNewChat]);

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

    // Update active chat session title and turn count
    setChatSessions(prev => prev.map(s => {
      if (s.id !== activeChatId) return s;
      const cleanTitle = (s.title === 'New Conversation' || !s.title)
        ? (textToSend.length > 36 ? textToSend.slice(0, 36) + '...' : textToSend)
        : s.title;
      return {
        ...s,
        title: cleanTitle,
        updatedAt: 'Just now',
        turnCount: (s.turnCount || 0) + 1,
      };
    }));

    const lower = textToSend.toLowerCase();

    // Clear any previous running step timers
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];

    const rawSteps = getReasoningStepsForPrompt(textToSend);
    const initialAnimatedSteps: ReasoningStep[] = rawSteps.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'active' : 'pending') as ReasoningStep['status']
    }));

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
        operationProgress: {
          id: 'step-reasoning',
          label: 'Reasoning process',
          status: 'active',
          durationMs: 34.2,
        },
        reasoningSteps: initialAnimatedSteps,
        suggestions: [],
        sqlQueries: [],
      }
    };

    setTurns(prev => [...prev, placeholderTurn]);

    const stepIntervalMs = 220;
    for (let i = 1; i < rawSteps.length; i++) {
      const timer = setTimeout(() => {
        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId || !t.assistantData) return t;
          const updatedSteps = rawSteps.map((s, idx) => ({
            ...s,
            status: (idx < i ? 'completed' : idx === i ? 'active' : 'pending') as ReasoningStep['status']
          }));
          return {
            ...t,
            assistantData: {
              ...t.assistantData,
              reasoningSteps: updatedSteps,
            }
          };
        }));
      }, i * stepIntervalMs);
      stepTimersRef.current.push(timer);
    }

    const finalTimer = setTimeout(() => {
      const finalCompletedSteps: ReasoningStep[] = rawSteps.map(s => ({
        ...s,
        status: 'completed' as const
      }));

      const finalTokenUsage = getTokenUsageForPrompt(textToSend, rawSteps.length * stepIntervalMs);

      // Ensure completed reasoning steps and token usage telemetry are sealed in assistantData
      setTurns(prev => prev.map(t => {
        if (t.id !== asstTurnId || !t.assistantData) return t;
        return {
          ...t,
          assistantData: {
            ...t.assistantData,
            reasoningSteps: finalCompletedSteps,
            tokenUsage: finalTokenUsage,
          }
        };
      }));
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

      // SCENARIO: 3-Minute Leadership Standup & Meeting Prep
      if (lower.includes('standup') || lower.includes('prep me') || lower.includes('meeting prep') || (lower.includes('meeting') && lower.includes('prep'))) {
        const standupInsight: KeyInsight = {
          headline: "Leadership Standup: $8.92B historical baseline with 49.2% North America concentration risk.",
          narrative: "Synthesized 2 talking points across 9 active visual slices: Growth drivers and single-region concentration risk.",
          impact: 'positive',
          metrics: [
            { label: 'Verified Revenue', value: '$8,920.4M' },
            { label: 'NA Risk Exposure', value: '49.2% ($4.39B)' },
            { label: 'Publisher Lead', value: 'Nintendo (72% Share)' },
          ]
        };

        const standupSql: SqlQueryItem = {
          id: `sql-standup-${Date.now()}`,
          label: 'Standup Executive Slices: Revenue, Publishers & NA Exposure',
          sql: `-- 1. Total Catalog Revenue & Regional Split
SELECT 
    COUNT(DISTINCT name) AS verified_titles,
    ROUND(SUM(global_sales), 2) AS total_revenue_m,
    ROUND(SUM(na_sales) / SUM(global_sales) * 100, 1) AS na_concentration_pct
FROM video_game_sales;

-- 2. Top Publisher Share in Top 25 Hits
SELECT 
    publisher, 
    COUNT(*) AS top25_hits,
    ROUND(COUNT(*) * 100.0 / 25, 1) AS share_pct
FROM (
    SELECT publisher, global_sales 
    FROM video_game_sales 
    ORDER BY global_sales DESC 
    LIMIT 25
) top_games
GROUP BY 1 
ORDER BY 2 DESC;`,
          executionTimeMs: 34.2,
          rowsReturned: 4,
          dialect: 'Trino SQL / PostgreSQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              insight: standupInsight,
              analyticalSummary: `**🎙️ 3-Minute Leadership Standup Briefing:**\n\n🟢 **1. The Growth Highlight (What's Working):**\n• **$8,920.4M** in verified catalog sales across 16,598 titles (+14.2% YoY).\n• **Nintendo Dominance**: Captures **72%** (18 of 25) of the bestselling games in history, anchored by *Wii Sports* (82.7M) and *Super Mario Bros.* (40.2M).\n• **Top Genres**: Action ($1,751.2M) and Sports ($1,330.9M) represent **34.7% ($3.08B)** of total revenue.\n\n🔴 **2. The Vulnerability (What Leadership Will Ask):**\n• **Single-Region Exposure**: **49.2%** of lifetime revenue relies on North America ($4,392.9M). Any US/NA consumer discretionary slowdown impacts nearly half our portfolio.\n• **Post-Peak Channel Shift**: Boxed physical title releases plummeted 57% between 2008 and 2015 as dollars moved to digital stores not tracked in physical sell-through.`,
              sqlQueries: [standupSql],
              operationProgress: {
                id: 'op-standup',
                label: 'Synthesized 2-part meeting talking points',
                status: 'completed',
                durationMs: 34.2,
              },
              suggestions: [
                { id: 'sug-std-1', label: 'Format for Microsoft Teams', prompt: 'Format this summary for Microsoft Teams' },
                { id: 'sug-std-2', label: 'What are the top 3 drivers of Nintendo?', prompt: 'What are the top 3 drivers of Nintendo\'s dominance?' },
                { id: 'sug-std-3', label: 'What is our revenue exposure outside NA?', prompt: 'What is our revenue exposure outside North America?' },
              ]
            }
          };
        }));

        setIsExecuting(false);
        return;
      }

      // SCENARIO: Microsoft Teams Channel Format
      if (lower.includes('teams') || lower.includes('format for teams') || lower.includes('microsoft teams')) {
        const teamsSql: SqlQueryItem = {
          id: `sql-teams-${Date.now()}`,
          label: 'Executive Briefing Aggregation (Global & Regional Totals)',
          sql: `SELECT 
    ROUND(SUM(global_sales), 2) AS total_revenue_m,
    ROUND(SUM(na_sales), 2) AS na_sales_m,
    ROUND(SUM(eu_sales), 2) AS eu_sales_m,
    ROUND(SUM(jp_sales), 2) AS jp_sales_m,
    ROUND(SUM(other_sales), 2) AS other_sales_m
FROM video_game_sales;`,
          executionTimeMs: 28.5,
          rowsReturned: 1,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              analyticalSummary: `**📋 Formatted for Microsoft Teams Channel:**\n\n\`\`\`markdown\n**Executive Briefing: Video Game Sales Dashboard**\n• **Total Revenue**: $8,920.4M across 16,598 catalog titles (+14.2% YoY).\n• **Market Concentration**: Nintendo controls 72% of top 25 bestselling releases (18 of 25 titles).\n• **Top Segments**: Action ($1,751.2M) and Sports ($1,330.9M) drive 34.7% of volume ($3.08B).\n• **Regional Breakdown**: North America leads at 49.2% ($4,392.9M), Europe at 27.3% ($2,434.1M).\n⚠️ **Watch-out**: 49.2% single-market exposure in North America; physical boxed titles declined post-2008 peak.\n🔗 [Open Dashboard](http://localhost:5173/)\n\`\`\`\n\n*Click "Copy for Teams" in the header or copy the block above to paste into your Teams channel.*`,
              sqlQueries: [teamsSql],
              operationProgress: {
                id: 'op-teams-card',
                label: 'Formatted adaptive Teams card',
                status: 'completed',
                durationMs: 28.5,
              },
              suggestions: [
                { id: 'sug-tm-1', label: 'Prep me for my 10 AM standup', prompt: 'Prep me for my 10 AM leadership standup' },
                { id: 'sug-tm-2', label: 'What are top drivers of Nintendo?', prompt: 'What are the top 3 drivers of Nintendo\'s dominance?' },
              ]
            }
          };
        }));

        setIsExecuting(false);
        return;
      }

      // SCENARIO: Contextual "Explain This Chart"
      if (lower.includes('explain chart') || lower.includes('explain:')) {
        let chartTitle = 'Chart Analysis';
        let chartSummary = '';

        if (lower.includes('top 10 games') || lower.includes('games')) {
          chartTitle = 'Top 10 Games (by Global Sales)';
          chartSummary = `**Chart Breakdown: Top 10 Games (by Global Sales)**\n\n• **Core Finding**: *Wii Sports* holds the #1 position with **82.7M units**, followed by *Super Mario Bros.* (**40.2M units**). All 10 titles in this ranking crossed the 28M unit milestone.\n• **Business Takeaway**: Bundled hardware pack-ins (Wii Sports) created unbeatable distribution velocity. Every game in the top 10 is published by Nintendo.`;
        } else if (lower.includes('publishers') || lower.includes('top 25')) {
          chartTitle = 'Publishers of Top 25 Games';
          chartSummary = `**Chart Breakdown: Publishers of Top 25 Games**\n\n• **Core Finding**: Nintendo dominates **72%** (18 of 25 titles). Take-Two Interactive holds **16%** (4 titles via Grand Theft Auto), and Activision holds **12%** (3 titles via Call of Duty).\n• **Business Takeaway**: Extreme publisher concentration: three publishers control 100% of the top 25 historical mega-hits.`;
        } else if (lower.includes('consoles') || lower.includes('hit games') || lower.includes('treemap')) {
          chartTitle = 'Top 10 Consoles, by # of Hit Games';
          chartSummary = `**Chart Breakdown: Top 10 Consoles, by # of Hit Games**\n\n• **Core Finding**: Nintendo DS leads with **2,163 hit titles**, followed by Game Boy Advance (**822**) and GameCube (**556**).\n• **Business Takeaway**: Handheld consoles provided the highest volume of successful titles due to lower development budgets and massive device installation base.`;
        } else if (lower.includes('genre')) {
          chartTitle = 'Genre Sales Breakdown';
          chartSummary = `**Chart Breakdown: Genre Sales Breakdown**\n\n• **Core Finding**: Action ($1,751.2M) and Sports ($1,330.9M) represent **34.7%** of cumulative industry software revenue.\n• **Business Takeaway**: Consumer demand heavily favors evergreen sports licenses and high-engagement action franchises.`;
        } else if (lower.includes('trajectory') || lower.includes('annual sales')) {
          chartTitle = 'Annual Sales Trajectory (1980 - 2020)';
          chartSummary = `**Chart Breakdown: Annual Sales Trajectory**\n\n• **Core Finding**: Sales expanded rapidly from 1995 to reach an all-time physical peak in **2008 ($678.9M)**, followed by a gradual contraction to $158.4M by 2020.\n• **Business Takeaway**: The post-2008 decline reflects the digital revolution (mobile apps, digital downloads) rather than reduced gaming appetite.`;
        } else if (lower.includes('regional') || lower.includes('market share')) {
          chartTitle = 'Regional Sales Market Share';
          chartSummary = `**Chart Breakdown: Regional Sales Market Share**\n\n• **Core Finding**: North America accounts for **49.2% ($4,392.9M)** of total revenue, Europe **27.3% ($2,434.1M)**, Japan **14.5% ($1,291.0M)**, and Other **9.0% ($797.8M)**.\n• **Business Takeaway**: Single-region concentration in North America creates macroeconomic exposure; international growth in Europe and Asia is essential for resilience.`;
        } else if (lower.includes('platform') || lower.includes('na sales')) {
          chartTitle = 'Top Platforms (by NA Sales)';
          chartSummary = `**Chart Breakdown: Top Platforms (by NA Sales)**\n\n• **Core Finding**: Xbox 360 leads North America with **$601.0M**, edging out PlayStation 2 (**$582.9M**) and Wii (**$507.5M**).\n• **Business Takeaway**: Microsoft's Xbox 360 achieved market leadership in North America, while Sony maintained the broader global lead.`;
        } else if (lower.includes('volume') || lower.includes('title volume')) {
          chartTitle = 'Annual Title Volume';
          chartSummary = `**Chart Breakdown: Annual Title Volume**\n\n• **Core Finding**: Annual title volume peaked in **2008–2009 with 1,428 simultaneous catalog releases**.\n• **Business Takeaway**: Represents the zenith of physical packaged retail distribution before digital store front consolidation.`;
        } else {
          chartTitle = 'Global Sales by Decade';
          chartSummary = `**Chart Breakdown: Global Sales by Decade**\n\n• **Core Finding**: The **2000s represented 52% of all-time software sales ($4,640.2M)** across 9,198 titles, led by Action.\n• **Business Takeaway**: The 2000s was the golden era of console adoption across both living rooms and handhelds.`;
        }

        let chartSqlStr = '';
        if (lower.includes('top 10 games') || lower.includes('games')) {
          chartSqlStr = `SELECT name, platform, publisher, ROUND(global_sales, 2) AS global_sales_m\nFROM video_game_sales\nORDER BY global_sales DESC\nLIMIT 10;`;
        } else if (lower.includes('publishers') || lower.includes('top 25')) {
          chartSqlStr = `SELECT publisher, COUNT(*) AS hit_count, ROUND(SUM(global_sales), 2) AS total_sales_m\nFROM (\n    SELECT publisher, global_sales FROM video_game_sales ORDER BY global_sales DESC LIMIT 25\n) top25\nGROUP BY 1\nORDER BY 2 DESC;`;
        } else if (lower.includes('consoles') || lower.includes('hit games') || lower.includes('treemap')) {
          chartSqlStr = `SELECT platform, COUNT(*) AS hit_titles\nFROM video_game_sales\nWHERE global_sales >= 1.0\nGROUP BY 1\nORDER BY 2 DESC\nLIMIT 10;`;
        } else if (lower.includes('genre')) {
          chartSqlStr = `SELECT genre, ROUND(SUM(global_sales), 2) AS total_sales_m\nFROM video_game_sales\nGROUP BY 1\nORDER BY 2 DESC;`;
        } else if (lower.includes('trajectory') || lower.includes('annual sales')) {
          chartSqlStr = `SELECT year, ROUND(SUM(global_sales), 2) AS annual_sales_m\nFROM video_game_sales\nWHERE year IS NOT NULL\nGROUP BY 1\nORDER BY 1;`;
        } else if (lower.includes('regional') || lower.includes('market share')) {
          chartSqlStr = `SELECT \n    ROUND(SUM(na_sales), 2) AS na_sales_m,\n    ROUND(SUM(eu_sales), 2) AS eu_sales_m,\n    ROUND(SUM(jp_sales), 2) AS jp_sales_m,\n    ROUND(SUM(other_sales), 2) AS other_sales_m\nFROM video_game_sales;`;
        } else if (lower.includes('platform') || lower.includes('na sales')) {
          chartSqlStr = `SELECT platform, ROUND(SUM(na_sales), 2) AS na_sales_m\nFROM video_game_sales\nGROUP BY 1\nORDER BY 2 DESC LIMIT 5;`;
        } else if (lower.includes('volume') || lower.includes('title volume')) {
          chartSqlStr = `SELECT year, COUNT(*) AS releases\nFROM video_game_sales\nWHERE year IS NOT NULL\nGROUP BY 1\nORDER BY 1;`;
        } else {
          chartSqlStr = `SELECT FLOOR(year / 10) * 10 AS decade, ROUND(SUM(global_sales), 2) AS sales_m\nFROM video_game_sales\nWHERE year IS NOT NULL\nGROUP BY 1\nORDER BY 1;`;
        }

        const explainSql: SqlQueryItem = {
          id: `sql-explain-${Date.now()}`,
          label: `Chart Semantic Model Query: ${chartTitle}`,
          sql: chartSqlStr,
          executionTimeMs: 29.8,
          rowsReturned: 10,
          dialect: 'Trino SQL'
        };

        setTurns(prev => prev.map(t => {
          if (t.id !== asstTurnId) return t;
          return {
            ...t,
            assistantData: {
              ...t.assistantData!,
              analyticalSummary: chartSummary,
              sqlQueries: [explainSql],
              operationProgress: {
                id: 'op-explain-chart',
                label: `Analyzed ${chartTitle}`,
                status: 'completed',
                durationMs: 29.8,
              },
              suggestions: [
                { id: 'sug-ex-1', label: 'Prep me for my 10 AM standup', prompt: 'Prep me for my 10 AM leadership standup' },
                { id: 'sug-ex-2', label: 'Format for Microsoft Teams', prompt: 'Format this summary for Microsoft Teams' },
                { id: 'sug-ex-3', label: 'What is our revenue exposure outside NA?', prompt: 'What is our revenue exposure outside North America?' },
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

        const nintendoSql: SqlQueryItem = {
          id: `sql-nintendo-${Date.now()}`,
          label: 'Nintendo Market Share & Catalog Breakdown',
          sql: `SELECT 
    publisher,
    COUNT(*) AS total_titles,
    ROUND(SUM(global_sales), 2) AS catalog_sales_m,
    ROUND(AVG(global_sales), 2) AS avg_sales_per_title_m
FROM video_game_sales
WHERE publisher = 'Nintendo'
GROUP BY 1;`,
          executionTimeMs: 22.4,
          rowsReturned: 1,
          dialect: 'Trino SQL'
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
              sqlQueries: [nintendoSql],
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

        const handheldSql: SqlQueryItem = {
          id: `sql-handheld-${Date.now()}`,
          label: 'Hardware Category Distribution (Handheld vs Home Consoles)',
          sql: `SELECT 
    CASE 
        WHEN platform IN ('DS', 'GBA', '3DS', 'PSP', 'GB') THEN 'Handheld'
        ELSE 'Home Console'
    END AS device_category,
    COUNT(*) AS catalog_titles,
    ROUND(SUM(global_sales), 2) AS revenue_m,
    ROUND(SUM(global_sales) * 100.0 / (SELECT SUM(global_sales) FROM video_game_sales), 1) AS pct_share
FROM video_game_sales
GROUP BY 1
ORDER BY 3 DESC;`,
          executionTimeMs: 31.5,
          rowsReturned: 2,
          dialect: 'Trino SQL'
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
              sqlQueries: [handheldSql],
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

        const declineSql: SqlQueryItem = {
          id: `sql-decline-${Date.now()}`,
          label: 'Post-2008 Annual Volume & Sales Trend',
          sql: `SELECT 
    year, 
    ROUND(SUM(global_sales), 2) AS sales_m,
    COUNT(*) AS total_releases
FROM video_game_sales 
WHERE year BETWEEN 2005 AND 2016 
GROUP BY 1 
ORDER BY 1;`,
          executionTimeMs: 25.1,
          rowsReturned: 12,
          dialect: 'Trino SQL'
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
              sqlQueries: [declineSql],
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

        const exposureSql: SqlQueryItem = {
          id: `sql-exposure-${Date.now()}`,
          label: 'Regional Distribution & Non-NA Share Exposure',
          sql: `SELECT 
    ROUND(SUM(na_sales), 2) AS na_sales_m,
    ROUND(SUM(global_sales - na_sales), 2) AS international_sales_m,
    ROUND(SUM(global_sales - na_sales) * 100.0 / SUM(global_sales), 1) AS international_share_pct
FROM video_game_sales;`,
          executionTimeMs: 19.8,
          rowsReturned: 1,
          dialect: 'Trino SQL'
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
              sqlQueries: [exposureSql],
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
    }, rawSteps.length * stepIntervalMs);
    stepTimersRef.current.push(finalTimer);
  }, [composerText, isExecuting, turns, activeContext, activeArtifact, activeChatId]);

  // UNDO ACTION (Capability 6)
  const handleUndo = useCallback(() => {
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
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
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
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
    chatSessions,
    setChatSessions,
    activeChatId,
    setActiveChatId,
    isRecentChatsOpen,
    setIsRecentChatsOpen,
    startNewChat,
    loadChatSession,
    deleteChatSession,
    isCanvasOpen,
    setIsCanvasOpen,
    openInCanvas,
  };
}

