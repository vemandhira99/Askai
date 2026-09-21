export type WorkspaceMode = 'modal' | 'docked' | 'fullscreen';
export type CanvasViewMode = 'split' | 'chat-only' | 'canvas-only';

export type OperationStatus = 'idle' | 'queued' | 'active' | 'completed' | 'retrying' | 'failed' | 'cancelled';

export interface OperationStep {
  id: string;
  label: string;
  status: OperationStatus;
  detail?: string;
  durationMs?: number;
}

export type ChartType = 'bar' | 'line' | 'donut' | 'area' | 'treemap' | 'table';

export type ColorPalette = 'navy' | 'emerald' | 'purple' | 'amber' | 'slate';

export interface ChartConfigState {
  chartType: ChartType;
  metric: string;
  metricLabel: string;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  dimension: string;
  topN: number;
  sortBy: 'value' | 'name';
  sortDirection: 'desc' | 'asc';
  colorPalette: ColorPalette;
  showDataLabels: boolean;
  showGridlines: boolean;
  showLegend: boolean;
  activeFilters: string[];
  customTitle?: string;
  customSubtitle?: string;
}

export interface ChartSeries {
  name: string;
  value: number;
  color?: string;
  secondaryValue?: number;
  naValue?: number;
  euValue?: number;
  count?: number;
}

export interface ChartArtifact {
  id: string;
  title: string;
  type: ChartType;
  metric: string;
  dimension: string;
  dataset: string;
  period?: string;
  unit?: string;
  data: ChartSeries[];
  availableTypes: ChartType[];
}

export interface KeyInsight {
  headline: string;
  narrative: string;
  impact: 'positive' | 'neutral' | 'warning' | 'critical';
  metrics?: { label: string; value: string; change?: string }[];
  isPreparing?: boolean;
}

export interface ContextFilter {
  dataset: string;
  metric: string;
  dimension: string;
  period: string;
  filters: string[];
  grain?: string;
  aggregation?: string;
  comparisonBaseline?: string;
  topN?: string;
  completeness?: string;
  sort?: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  prompt: string;
  category?: 'exploration' | 'comparison' | 'recovery' | 'pivot';
}

export interface SqlQueryItem {
  id: string;
  label: string;
  sql: string;
  executionTimeMs: number;
  rowsReturned: number;
  dialect?: string;
}

export interface AssistantTurnData {
  id: string;
  chart?: ChartArtifact;
  insight?: KeyInsight;
  analyticalSummary?: string;
  dataTable?: {
    columns: string[];
    rows: (string | number)[][];
  };
  context: ContextFilter;
  suggestions: SuggestedAction[];
  sqlQueries: SqlQueryItem[];
  operationProgress?: OperationStep;
  reasoningSteps?: ReasoningStep[];
  tokenUsage?: TokenUsage;
  error?: {
    message: string;
    recoveryAction?: SuggestedAction;
  };
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencySeconds: number;
  tokensPerSecond?: number;
  estimatedCostUsd?: number;
  modelName?: string;
  contextWindowPct?: number;
}

export interface ReasoningStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface MessageTurn {
  id: string;
  timestamp: string;
  sender: 'user' | 'assistant';
  content?: string;
  assistantData?: AssistantTurnData;
  idempotencyKey?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  timeGroup: 'Today' | 'Yesterday' | 'Previous 7 Days';
  datasetId?: string;
  turnCount?: number;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: 'undo' | 'retry_network' | 'retry_analytical' | 'quick_chart' | 'edit_instructions';
  details: string;
  restoredPrompt?: string;
}

export interface IconVisibilitySettings {
  shareLink: boolean;
  glossary: boolean;
  history: boolean;
  download: boolean;
  newChat: boolean;
  fullscreen: boolean;
  dockToggle: boolean;
  sqlLab: boolean;
}

export type DashboardViewMode = 'populated' | 'empty';

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface DashboardCard {
  id: string;
  title: string;
  type: 'kpi' | 'bar' | 'line' | 'donut';
  dataset: string;
  metricLabel?: string;
  metricValue?: string;
  subtext?: string;
  chartData?: any[];
}
