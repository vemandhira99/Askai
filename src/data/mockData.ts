import { MessageTurn, ContextFilter, ChartArtifact, KeyInsight, SuggestedAction, SqlQueryItem, ChatSession } from '../types/bi';

export const INITIAL_CONTEXT: ContextFilter = {
  dataset: 'video_game_sales',
  metric: 'SUM(global_sales)',
  dimension: 'genre',
  period: '1980 - 2020',
  filters: ['publisher IS NOT NULL', 'global_sales > 0'],
  grain: 'By Genre',
  aggregation: 'SUM ($ Millions)',
  comparisonBaseline: 'Historical catalog total',
  topN: 'Top 8 Genres',
  completeness: '99.4% verified records',
  sort: 'Descending by global_sales',
};

export const WB_CONTEXT: ContextFilter = {
  dataset: 'wb_health_population',
  metric: 'AVG(mortality_rate_under5)',
  dimension: 'year',
  period: '1990 - 2020',
  filters: ['country_code IS NOT NULL', 'year >= 1990'],
  grain: 'By Year / Region',
  aggregation: 'Rate per 1,000 live births',
  comparisonBaseline: 'Global unweighted mean',
  topN: 'All Verified Regions',
  completeness: '98.8% verified records',
  sort: 'Ascending by year',
};

// 1. VIDEO GAME SALES DATASETS
export const VGS_GENRE_DATA = [
  { name: 'Action', value: 1751.2, naValue: 877.8, euValue: 525.0, count: 3316 },
  { name: 'Sports', value: 1330.9, naValue: 686.3, euValue: 376.5, count: 2346 },
  { name: 'Shooter', value: 1037.4, naValue: 582.6, euValue: 313.3, count: 1310 },
  { name: 'Role-Playing', value: 927.4, naValue: 327.3, euValue: 188.6, count: 1488 },
  { name: 'Platform', value: 831.3, naValue: 447.1, euValue: 201.6, count: 886 },
  { name: 'Misc', value: 809.9, naValue: 407.3, euValue: 215.9, count: 1739 },
  { name: 'Racing', value: 732.0, naValue: 359.4, euValue: 238.4, count: 1249 },
  { name: 'Fighting', value: 448.9, naValue: 224.0, euValue: 101.3, count: 848 },
];

export const VGS_PLATFORM_NA_DATA = [
  { name: 'Xbox 360', value: 601.0, naValue: 601.0, euValue: 280.6, count: 1265 },
  { name: 'PlayStation 2', value: 582.9, naValue: 582.9, euValue: 339.3, count: 2161 },
  { name: 'Wii', value: 507.5, naValue: 507.5, euValue: 268.4, count: 1320 },
  { name: 'PlayStation 3', value: 392.3, naValue: 392.3, euValue: 343.7, count: 1335 },
  { name: 'Nintendo DS', value: 390.4, naValue: 390.4, euValue: 194.7, count: 2163 },
  { name: 'PlayStation', value: 336.5, naValue: 336.5, euValue: 213.6, count: 1196 },
  { name: 'Game Boy Advance', value: 187.5, naValue: 187.5, euValue: 75.3, count: 822 },
  { name: 'Xbox', value: 186.7, naValue: 186.7, euValue: 61.0, count: 824 },
];

export const VGS_TREND_DATA = [
  { name: '1995', value: 88.1, naValue: 34.0, euValue: 14.9, count: 219 },
  { name: '1998', value: 256.4, naValue: 128.4, euValue: 66.9, count: 379 },
  { name: '2001', value: 331.5, naValue: 173.9, euValue: 94.9, count: 482 },
  { name: '2004', value: 418.2, naValue: 218.8, euValue: 107.3, count: 762 },
  { name: '2007', value: 611.1, naValue: 311.2, euValue: 160.2, count: 1202 },
  { name: '2008', value: 678.9, naValue: 351.4, euValue: 184.4, count: 1428 },
  { name: '2011', value: 515.8, naValue: 241.0, euValue: 167.4, count: 1136 },
  { name: '2014', value: 337.0, naValue: 131.9, euValue: 125.6, count: 581 },
  { name: '2017', value: 255.4, naValue: 104.2, euValue: 95.8, count: 318 },
  { name: '2020', value: 158.4, naValue: 69.2, euValue: 53.6, count: 214 },
];

export const TOP_10_GAMES_DATA = [
  { rank: 1, name: 'Wii Sports', global_sales: 82.739997863 },
  { rank: 2, name: 'Super Mario Bros.', global_sales: 40.24000167 },
  { rank: 3, name: 'Mario Kart Wii', global_sales: 35.819999694 },
  { rank: 4, name: 'Wii Sports Resort', global_sales: 33.00000000 },
  { rank: 5, name: 'Pokemon Red / Blue', global_sales: 31.37000084 },
  { rank: 6, name: 'Tetris', global_sales: 30.26000023 },
  { rank: 7, name: 'New Super Mario Bros.', global_sales: 30.01000023 },
  { rank: 8, name: 'Wii Play', global_sales: 29.02000046 },
  { rank: 9, name: 'Duck Hunt', global_sales: 28.30999947 },
  { rank: 10, name: 'New Super Mario Bros. Wii', global_sales: 28.62000084 },
];

export const TOP_25_PUBLISHERS_DATA = [
  { name: 'Nintendo', value: 18, share: '72%' },
  { name: 'Take-Two Interactive', value: 4, share: '16%' },
  { name: 'Activision', value: 3, share: '12%' },
];

export const TOP_CONSOLES_HIT_DATA = [
  { name: 'DS', count: '2.16k', value: 2163, color: '#5ec3d2' },
  { name: 'GBA', count: '822', value: 822, color: '#9ddcb7' },
  { name: 'GC', count: '556', value: 556, color: '#4bb56e' },
  { name: '3DS', count: '509', value: 509, color: '#8ca3b8' },
  { name: '2600', count: '133', value: 133, color: '#4f555b' },
  { name: 'GB', count: '98', value: 98, color: '#f4b971' },
];

export const REGIONAL_SALES_SHARE_DATA = [
  { region: 'North America', sales: 4392.95, share: 49.2, color: '#3b82f6' },
  { region: 'Europe', sales: 2434.13, share: 27.3, color: '#10b981' },
  { region: 'Japan', sales: 1291.02, share: 14.5, color: '#f59e0b' },
  { region: 'Other Regions', sales: 797.75, share: 9.0, color: '#8b5cf6' },
];

export const ANNUAL_RELEASE_VOLUME_DATA = [
  { year: '2001', titles: 482, sales: 331.5 },
  { year: '2003', titles: 775, sales: 357.8 },
  { year: '2005', titles: 939, sales: 458.5 },
  { year: '2007', titles: 1202, sales: 611.1 },
  { year: '2008', titles: 1428, sales: 678.9 },
  { year: '2009', titles: 1426, sales: 667.3 },
  { year: '2011', titles: 1136, sales: 515.8 },
  { year: '2013', titles: 544, sales: 368.1 },
  { year: '2015', titles: 614, sales: 264.4 },
];

export const SALES_BY_DECADE_DATA = [
  { decade: '1980s', sales: 382.4, titles: 365, share: '4.3%', topGenre: 'Platform' },
  { decade: '1990s', sales: 1279.8, titles: 1769, share: '14.3%', topGenre: 'Sports' },
  { decade: '2000s', sales: 4640.2, titles: 9198, share: '52.0%', topGenre: 'Action' },
  { decade: '2010s', sales: 2618.0, titles: 5266, share: '29.4%', topGenre: 'Shooter' },
];

// 2. WORLD BANK HEALTH DATASETS
export const WB_MORTALITY_DATA = [
  { name: '1990', value: 93.2, naValue: 10.4, euValue: 16.2, count: 184 },
  { name: '1995', value: 87.1, naValue: 9.2, euValue: 14.1, count: 186 },
  { name: '2000', value: 75.8, naValue: 8.3, euValue: 11.5, count: 191 },
  { name: '2005', value: 62.4, naValue: 7.6, euValue: 9.3, count: 193 },
  { name: '2010', value: 51.1, naValue: 6.9, euValue: 7.7, count: 194 },
  { name: '2015', value: 43.0, naValue: 6.5, euValue: 6.4, count: 195 },
  { name: '2020', value: 37.7, naValue: 5.6, euValue: 5.1, count: 195 },
];

export const WB_WATER_DATA = [
  { name: 'North America', value: 99.8, naValue: 99.8, euValue: 99.8, count: 3 },
  { name: 'Europe & Central Asia', value: 98.4, naValue: 98.4, euValue: 98.4, count: 58 },
  { name: 'Latin America & Carib', value: 92.1, naValue: 92.1, euValue: 92.1, count: 42 },
  { name: 'East Asia & Pacific', value: 89.5, naValue: 89.5, euValue: 89.5, count: 37 },
  { name: 'Middle East & N. Africa', value: 87.2, naValue: 87.2, euValue: 87.2, count: 21 },
  { name: 'South Asia', value: 74.6, naValue: 74.6, euValue: 74.6, count: 8 },
  { name: 'Sub-Saharan Africa', value: 58.3, naValue: 58.3, euValue: 58.3, count: 48 },
];

export const WB_HIV_DATA = [
  { name: 'Sub-Saharan Africa', value: 4.7, naValue: 5.2, euValue: 4.2, count: 48 },
  { name: 'Latin America & Carib', value: 0.4, naValue: 0.5, euValue: 0.3, count: 42 },
  { name: 'North America', value: 0.3, naValue: 0.3, euValue: 0.3, count: 3 },
  { name: 'South Asia', value: 0.2, naValue: 0.2, euValue: 0.2, count: 8 },
  { name: 'Europe & Central Asia', value: 0.2, naValue: 0.2, euValue: 0.2, count: 58 },
  { name: 'East Asia & Pacific', value: 0.1, naValue: 0.1, euValue: 0.1, count: 37 },
];

export const INITIAL_CHART: ChartArtifact = {
  id: 'chart-vgs-genre-1',
  title: 'Global Video Game Sales by Genre',
  type: 'bar',
  metric: 'Global Sales ($M)',
  dimension: 'Genre',
  dataset: 'video_game_sales',
  period: '1980 - 2020',
  unit: '$M',
  availableTypes: ['bar', 'line', 'donut', 'area'],
  data: VGS_GENRE_DATA,
};

export const INITIAL_INSIGHT: KeyInsight = {
  headline: 'Action and Sports represent 35% of all-time global industry revenues.',
  narrative: 'Action games lead historically with $1,751.2M in cumulative revenue (+31.6% ahead of Sports). Shooter titles demonstrate the highest North American concentration (56.1% of total volume).',
  impact: 'positive',
  metrics: [
    { label: 'Top Genre', value: 'Action ($1.75B)', change: '+31.6% vs #2' },
    { label: 'Shooter NA Skew', value: '56.1%', change: 'Highest regional share' },
    { label: 'Catalog Volume', value: '16,598 titles' },
  ],
};

export const INITIAL_SQL: SqlQueryItem[] = [
  {
    id: 'q-vgs-1',
    label: 'Primary Aggregation (Genre Breakdown)',
    sql: `SELECT 
    genre,
    ROUND(SUM(global_sales), 2) AS total_global_sales_m,
    ROUND(SUM(na_sales), 2) AS total_na_sales_m,
    COUNT(*) AS title_count
FROM video_game_sales
WHERE publisher IS NOT NULL 
  AND global_sales > 0
GROUP BY genre
ORDER BY total_global_sales_m DESC
LIMIT 8;`,
    executionTimeMs: 46.8,
    rowsReturned: 8,
    dialect: 'Trino SQL',
  }
];

export const INITIAL_SUGGESTIONS: SuggestedAction[] = [
  {
    id: 'sug-1',
    label: 'Which platform has highest sales in NA?',
    prompt: 'Which platform has the highest sales in North America?',
    category: 'exploration',
  },
  {
    id: 'sug-2',
    label: 'Show historical sales trajectory',
    prompt: 'How have global sales trends changed over the years?',
    category: 'pivot',
  },
  {
    id: 'sug-3',
    label: 'Filter where publisher = NULLXYZ',
    prompt: 'Filter where publisher = NULLXYZ',
    category: 'recovery',
  },
];

export const INITIAL_TURNS: MessageTurn[] = [];

export const MOCK_CHATS: ChatSession[] = [
  { id: 'chat-1', title: 'Global Sales by Genre', updatedAt: 'Active now', timeGroup: 'Today', datasetId: 'video_game_sales', turnCount: 2 },
  { id: 'chat-2', title: 'Publisher NULLXYZ Analysis', updatedAt: '1 d ago', timeGroup: 'Yesterday', datasetId: 'video_game_sales', turnCount: 2 },
  { id: 'chat-3', title: 'World Bank Child Mortality Trends', updatedAt: '6 d ago', timeGroup: 'Previous 7 Days', datasetId: 'wb_health_population', turnCount: 2 },
  { id: 'chat-4', title: 'Access to Safe Drinking Water', updatedAt: '8 d ago', timeGroup: 'Previous 7 Days', datasetId: 'wb_health_population', turnCount: 2 },
];

export interface MockSessionData {
  session: ChatSession;
  turns: MessageTurn[];
  context: ContextFilter;
  artifact: ChartArtifact;
}

export const MOCK_SESSIONS_MAP: Record<string, MockSessionData> = {
  'chat-1': {
    session: MOCK_CHATS[0],
    context: INITIAL_CONTEXT,
    artifact: INITIAL_CHART,
    turns: [
      {
        id: 'c1-turn-1-user',
        sender: 'user',
        timestamp: '10 mins ago',
        content: 'What are the total global sales by genre?',
      },
      {
        id: 'c1-turn-1-asst',
        sender: 'assistant',
        timestamp: '10 mins ago',
        assistantData: {
          id: 'asst-c1-1',
          chart: INITIAL_CHART,
          insight: INITIAL_INSIGHT,
          analyticalSummary: 'Action and Sports represent 35% of all-time global industry revenues ($3,082.1M). Shooter games demonstrate the highest North American concentration (56.1% of genre volume).',
          context: INITIAL_CONTEXT,
          sqlQueries: INITIAL_SQL,
          suggestions: INITIAL_SUGGESTIONS,
          tokenUsage: {
            promptTokens: 420,
            completionTokens: 295,
            totalTokens: 715,
            latencySeconds: 1.4,
            tokensPerSecond: 211,
            estimatedCostUsd: 0.0011,
            modelName: 'Ask AI Semantic Engine',
            contextWindowPct: 0.5,
          },
          operationProgress: {
            id: 'op-c1-1',
            label: 'Computed genre aggregations across 16,598 records',
            status: 'completed',
            durationMs: 46.8,
          },
          reasoningSteps: [
            { id: 'rs-c1-1', label: 'Inspected schema and verified active columns', status: 'completed' },
            { id: 'rs-c1-2', label: 'Computed sum of global_sales and na_sales grouped by genre', status: 'completed' },
            { id: 'rs-c1-3', label: 'Constructed bar chart visualization', status: 'completed' },
          ],
        }
      }
    ]
  },
  'chat-2': {
    session: MOCK_CHATS[1],
    context: {
      ...INITIAL_CONTEXT,
      filters: ["publisher = 'NULLXYZ'"],
    },
    artifact: {
      id: 'chart-vgs-nullxyz',
      title: 'Publisher NULLXYZ — 0 Matches',
      type: 'bar',
      metric: 'Global Sales ($M)',
      dimension: 'Publisher',
      dataset: 'video_game_sales',
      period: '1980 - 2020',
      unit: '$M',
      availableTypes: ['bar'],
      data: [],
    },
    turns: [
      {
        id: 'c2-turn-1-user',
        sender: 'user',
        timestamp: 'Yesterday',
        content: 'Filter where publisher = NULLXYZ',
      },
      {
        id: 'c2-turn-1-asst',
        sender: 'assistant',
        timestamp: 'Yesterday',
        assistantData: {
          id: 'asst-c2-1',
          chart: {
            id: 'chart-vgs-nullxyz',
            title: 'Publisher NULLXYZ — 0 Matches',
            type: 'bar',
            metric: 'Global Sales ($M)',
            dimension: 'Publisher',
            dataset: 'video_game_sales',
            period: '1980 - 2020',
            unit: '$M',
            availableTypes: ['bar'],
            data: [],
          },
          insight: {
            headline: 'Publisher NULLXYZ does not exist in the 16,598 catalog records.',
            narrative: 'The exact filter `publisher = \'NULLXYZ\'` returned 0 rows. Verified top publishers include Nintendo ($1,786.6M), Electronic Arts ($1,110.3M), and Activision ($727.7M).',
            impact: 'warning',
            metrics: [
              { label: 'Matches Found', value: '0 rows' },
              { label: 'Active Catalog', value: '16,598 titles' },
              { label: 'Filter Status', value: 'Zero Records' },
            ],
          },
          analyticalSummary: 'Queried `video_game_sales` with filter `publisher = \'NULLXYZ\'`. 0 matching records were found. Provided schema recovery options to explore verified publishers.',
          context: {
            ...INITIAL_CONTEXT,
            filters: ["publisher = 'NULLXYZ'"],
          },
          sqlQueries: [
            {
              id: 'q-nullxyz',
              label: 'Zero-Result Schema Check',
              sql: `SELECT \n    publisher,\n    COUNT(*) AS title_count,\n    ROUND(SUM(global_sales), 2) AS total_sales_m\nFROM video_game_sales\nWHERE publisher = 'NULLXYZ'\nGROUP BY publisher;`,
              executionTimeMs: 14.2,
              rowsReturned: 0,
              dialect: 'Trino SQL',
            }
          ],
          suggestions: [
            { id: 's-null-1', label: 'Show top 5 publishers instead', prompt: 'Show top 5 publishers by sales' },
            { id: 's-null-2', label: 'Clear publisher filter', prompt: 'Clear publisher filter and show all games' },
          ],
          tokenUsage: {
            promptTokens: 280,
            completionTokens: 190,
            totalTokens: 470,
            latencySeconds: 0.9,
            tokensPerSecond: 211,
            estimatedCostUsd: 0.0007,
            modelName: 'Ask AI Semantic Engine',
            contextWindowPct: 0.3,
          },
          operationProgress: {
            id: 'op-c2-1',
            label: 'Executed search with 0 rows returned',
            status: 'completed',
            durationMs: 14.2,
          },
          reasoningSteps: [
            { id: 'rs-c2-1', label: 'Evaluated filter predicate publisher = NULLXYZ', status: 'completed' },
            { id: 'rs-c2-2', label: 'Executed query against catalog table video_game_sales', status: 'completed' },
            { id: 'rs-c2-3', label: 'Generated recovery actions and verified alternatives', status: 'completed' },
          ],
        }
      }
    ]
  },
  'chat-3': {
    session: MOCK_CHATS[2],
    context: WB_CONTEXT,
    artifact: {
      id: 'chart-wb-mortality',
      title: 'Global Child Mortality Rate (1990 - 2020)',
      type: 'line',
      metric: 'Mortality per 1,000 live births',
      dimension: 'Year',
      dataset: 'wb_health_population',
      period: '1990 - 2020',
      unit: '/ 1,000',
      availableTypes: ['line', 'bar', 'area'],
      data: WB_MORTALITY_DATA,
    },
    turns: [
      {
        id: 'c3-turn-1-user',
        sender: 'user',
        timestamp: '6 d ago',
        content: 'What is the trend in child mortality by region since 1990?',
      },
      {
        id: 'c3-turn-1-asst',
        sender: 'assistant',
        timestamp: '6 d ago',
        assistantData: {
          id: 'asst-c3-1',
          chart: {
            id: 'chart-wb-mortality',
            title: 'Global Child Mortality Rate (1990 - 2020)',
            type: 'line',
            metric: 'Mortality per 1,000 live births',
            dimension: 'Year',
            dataset: 'wb_health_population',
            period: '1990 - 2020',
            unit: '/ 1,000',
            availableTypes: ['line', 'bar', 'area'],
            data: WB_MORTALITY_DATA,
          },
          insight: {
            headline: 'Global under-5 mortality decreased by 59.5% over the 30-year observation period.',
            narrative: 'Significant acceleration in child survival occurred following 2000, with Sub-Saharan Africa and South Asia showing the steepest declines in absolute terms.',
            impact: 'positive',
            metrics: [
              { label: '1990 Baseline', value: '93.2 / 1k' },
              { label: '2020 Rate', value: '37.7 / 1k', change: '-59.5% reduction' },
              { label: 'Countries Covered', value: '195 verified' },
            ],
          },
          analyticalSummary: 'Under-5 child mortality rate fell from 93.2 per 1,000 live births in 1990 down to 37.7 in 2020 globally—a 59.5% reduction over three decades.',
          context: WB_CONTEXT,
          sqlQueries: [
            {
              id: 'q-wb-mort',
              label: 'World Bank Child Mortality Trend',
              sql: `SELECT \n    year,\n    ROUND(AVG(mortality_rate_under5), 1) AS avg_mortality\nFROM wb_health_population\nWHERE year >= 1990\nGROUP BY year\nORDER BY year ASC;`,
              executionTimeMs: 52.4,
              rowsReturned: 7,
              dialect: 'Trino SQL',
            }
          ],
          suggestions: [
            { id: 'w1', label: 'Access to safe water by region', prompt: 'How does access to safe water vary by region?' },
            { id: 'w2', label: 'Compare female HIV prevalence', prompt: 'Compare HIV rates in females across regions' },
          ],
          tokenUsage: {
            promptTokens: 510,
            completionTokens: 340,
            totalTokens: 850,
            latencySeconds: 1.6,
            tokensPerSecond: 212,
            estimatedCostUsd: 0.0013,
            modelName: 'Ask AI Semantic Engine',
            contextWindowPct: 0.6,
          },
          operationProgress: {
            id: 'op-c3-1',
            label: 'Processed 38,204 rows from World Bank catalog',
            status: 'completed',
            durationMs: 52.4,
          },
          reasoningSteps: [
            { id: 'rs-c3-1', label: 'Switched catalog to wb_health_population', status: 'completed' },
            { id: 'rs-c3-2', label: 'Aggregated mortality_rate_under5 across 195 countries', status: 'completed' },
            { id: 'rs-c3-3', label: 'Formulated historical trajectory line chart', status: 'completed' },
          ],
        }
      }
    ]
  },
  'chat-4': {
    session: MOCK_CHATS[3],
    context: {
      ...WB_CONTEXT,
      metric: 'AVG(access_to_safe_water)',
      dimension: 'region',
      grain: 'By Region',
    },
    artifact: {
      id: 'chart-wb-water',
      title: 'Population with Access to Safe Water (%)',
      type: 'bar',
      metric: 'Access to Safe Water (%)',
      dimension: 'Region',
      dataset: 'wb_health_population',
      period: '2015 - 2020',
      unit: '%',
      availableTypes: ['bar', 'donut'],
      data: WB_WATER_DATA,
    },
    turns: [
      {
        id: 'c4-turn-1-user',
        sender: 'user',
        timestamp: '8 d ago',
        content: 'How does access to safe drinking water compare across regions?',
      },
      {
        id: 'c4-turn-1-asst',
        sender: 'assistant',
        timestamp: '8 d ago',
        assistantData: {
          id: 'asst-c4-1',
          chart: {
            id: 'chart-wb-water',
            title: 'Population with Access to Safe Water (%)',
            type: 'bar',
            metric: 'Access to Safe Water (%)',
            dimension: 'Region',
            dataset: 'wb_health_population',
            period: '2015 - 2020',
            unit: '%',
            availableTypes: ['bar', 'donut'],
            data: WB_WATER_DATA,
          },
          insight: {
            headline: 'Sub-Saharan Africa faces a 41.5 percentage point gap in safe water access relative to North America.',
            narrative: 'While North America (99.8%) and Europe (98.4%) exceed 98% coverage, Sub-Saharan Africa remains at 58.3%, indicating significant infrastructure investment disparity.',
            impact: 'neutral',
            metrics: [
              { label: 'North America', value: '99.8%' },
              { label: 'Sub-Saharan Africa', value: '58.3%' },
              { label: 'Regional Spread', value: '41.5% gap' },
            ],
          },
          analyticalSummary: 'Access to safely managed drinking water reaches 99.8% in North America and 98.4% in Europe & Central Asia, compared to 58.3% in Sub-Saharan Africa and 74.6% in South Asia.',
          context: {
            ...WB_CONTEXT,
            metric: 'AVG(access_to_safe_water)',
            dimension: 'region',
            grain: 'By Region',
          },
          sqlQueries: [
            {
              id: 'q-wb-water',
              label: 'Regional Safe Water Distribution',
              sql: `SELECT \n    region,\n    ROUND(AVG(access_to_safe_water), 1) AS pct_safe_water\nFROM wb_health_population\nGROUP BY region\nORDER BY pct_safe_water DESC;`,
              executionTimeMs: 48.1,
              rowsReturned: 7,
              dialect: 'Trino SQL',
            }
          ],
          suggestions: [
            { id: 'sw1', label: 'Trend mortality rates over time', prompt: 'What is the trend in child mortality over the years?' },
          ],
          tokenUsage: {
            promptTokens: 480,
            completionTokens: 310,
            totalTokens: 790,
            latencySeconds: 1.5,
            tokensPerSecond: 207,
            estimatedCostUsd: 0.0012,
            modelName: 'Ask AI Semantic Engine',
            contextWindowPct: 0.5,
          },
          operationProgress: {
            id: 'op-c4-1',
            label: 'Calculated regional access metrics across 217 territories',
            status: 'completed',
            durationMs: 48.1,
          },
          reasoningSteps: [
            { id: 'rs-c4-1', label: 'Query access_to_safe_water grouped by regional cluster', status: 'completed' },
            { id: 'rs-c4-2', label: 'Ranked regions by descending percentage', status: 'completed' },
          ],
        }
      }
    ]
  }
};

export const AVAILABLE_DATASETS = [
  {
    id: 'video_game_sales',
    name: 'video_game_sales',
    records: '16,598 rows',
    columns: 11,
    description: 'Video game titles, publishers, platforms, and regional sales (1980-2020).',
    metrics: ['SUM(global_sales)', 'SUM(na_sales)', 'SUM(eu_sales)', 'COUNT(*)'],
  },
  {
    id: 'wb_health_population',
    name: 'wb_health_population',
    records: '38,204 rows',
    columns: 328,
    description: 'World Bank global health, mortality, and population indicators.',
    metrics: ['AVG(mortality_rate_under5)', 'AVG(access_to_safe_water)', 'AVG(hiv_prevalence_female)'],
  },
];
