export type Severity = 'critical' | 'medium' | 'low';
export type Category = 'military' | 'diplomatic' | 'economic' | 'intelligence' | 'all';
export type Timeframe = 'short' | 'mid' | 'long'; // short: 1-4 weeks, mid: 1-6 months, long: 6-24 months
export type Status = 'published' | 'draft';
export type LLMProvider = 'groq' | 'google' | 'openai' | 'xai';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  category: 'military' | 'diplomatic' | 'economic' | 'intelligence';
  priority: 'high' | 'medium' | 'low';
  status: Status;
  published_at: string;
  created_at: string;
}

export interface AnalysisItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'military' | 'diplomatic' | 'economic' | 'intelligence';
  severity: Severity;
  historical_precedent: string;
  counter_analysis: string;
  model_used: string;
  confidence_score: number;
  read_time: string;
  views_count: number;
  tags: string[];
  status: Status;
  published_at: string;
  created_at: string;
  linked_news_ids?: string[];
}

export interface PredictionItem {
  id: string;
  title: string;
  timeframe: Timeframe;
  timeframe_label: string; // e.g. 'کوتاه‌مدت (۱ تا ۴ هفته)'
  probability: number; // 0 to 100
  primary_scenario: string;
  alternative_scenario: string;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  trigger_events: string[];
  status: Status;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  site_title: string;
  hero_title: string;
  hero_subtitle: string;
  accent_color: string; // '#B91C1C'
  logo_text: string;
  announcement_text: string;
  announcement_active: boolean;
  contact_email: string;
  telegram_channel: string;
  footer_text: string;
  font_family: string;
  updated_at: string;
}

export interface ApiUsageLog {
  id: string;
  provider: LLMProvider;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost: number;
  endpoint: string;
  status: 'success' | 'failed';
  created_at: string;
}

export interface MediaFileItem {
  id: string;
  filename: string;
  size: number; // bytes
  mime_type: string;
  url: string;
  provider?: 'local' | 'cloudinary' | 'external';
  uploaded_at: string;
}

export type R2FileItem = MediaFileItem;

export interface AdminStats {
  total_news: number;
  total_analyses: number;
  total_predictions: number;
  total_api_tokens: number;
  total_cost_usd: number;
  media_storage_bytes: number;
  r2_storage_bytes?: number;
}
