export type Severity = 'critical' | 'medium' | 'low';
export type Category = 'military' | 'diplomatic' | 'economic' | 'intelligence' | 'all';
export type ModelName = 'Claude-3.5 Sonnet' | 'GPT-4o' | 'Gemini 1.5 Pro' | 'DeepSeek-V3' | 'Grok-2';

export interface NewsItem {
  id: string;
  channel: string;
  messageId: number;
  date: string;
  category: 'military' | 'diplomatic' | 'economic' | 'intelligence';
  priority: 'high' | 'medium' | 'low';
  title: string;
  summary: string;
  content: string;
}

export interface AnalysisRecord {
  id: string;
  title: string;
  category: 'military' | 'diplomatic' | 'economic' | 'intelligence';
  severity: Severity;
  channel: string;
  timestamp: string;
  timeAgo: string;
  summary: string;
  historicalPrecedent: string;
  counterAnalysis: string;
  model: ModelName;
  confidence: number;
  tokensUsed: number;
  tags: string[];
  newsSourcesCount: number;
}

export interface PredictionScenario {
  id: string;
  topic: string;
  timeframe: '۲۴ ساعت' | '۷ روز' | '۳۰ روز';
  primaryOutcome: string;
  alternativeOutcome: string;
  probability: number;
  indicators: string[];
  generatedAt: string;
}

export interface SystemMetrics {
  status: 'operational' | 'degraded' | 'maintenance';
  uptime: string;
  totalNews: number;
  chromaVectors: number;
  activeAdmins: number;
  todayTokens: number;
  tokenBudget: number;
  gptCost: number;
  claudeCost: number;
  geminiCost: number;
  lastFetch: string;
  channelName: string;
  activeRateLimit: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'EXEC' | 'AGENT';
  message: string;
}
