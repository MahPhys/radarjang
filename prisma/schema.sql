-- PostgreSQL Schema for Radar-e-Jang (Vercel Postgres / Neon / Supabase / Railway)

-- 1. News Table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  category VARCHAR(32) NOT NULL CHECK (category IN ('military', 'diplomatic', 'economic', 'intelligence')),
  priority VARCHAR(16) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status VARCHAR(16) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  published_at VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_priority ON news(priority);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- 2. Strategic Analyses Table
CREATE TABLE IF NOT EXISTS analyses (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(32) NOT NULL CHECK (category IN ('military', 'diplomatic', 'economic', 'intelligence')),
  severity VARCHAR(16) NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'medium', 'low')),
  historical_precedent TEXT,
  counter_analysis TEXT,
  model_used VARCHAR(64) DEFAULT 'xAI Grok 4.3 (Consensus Engine)',
  confidence_score INTEGER DEFAULT 90,
  read_time VARCHAR(32) DEFAULT '۵ دقیقه',
  views_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(16) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  published_at VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analyses_category ON analyses(category);
CREATE INDEX IF NOT EXISTS idx_analyses_severity ON analyses(severity);
CREATE INDEX IF NOT EXISTS idx_analyses_slug ON analyses(slug);

-- 3. Crisis Predictions & Scenarios Table
CREATE TABLE IF NOT EXISTS predictions (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  timeframe VARCHAR(16) NOT NULL CHECK (timeframe IN ('short', 'mid', 'long')),
  timeframe_label VARCHAR(64) NOT NULL,
  probability INTEGER NOT NULL CHECK (probability >= 0 AND probability <= 100),
  primary_scenario TEXT NOT NULL,
  alternative_scenario TEXT,
  risk_level VARCHAR(16) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  trigger_events TEXT[] DEFAULT '{}',
  status VARCHAR(16) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_predictions_timeframe ON predictions(timeframe);
CREATE INDEX IF NOT EXISTS idx_predictions_risk ON predictions(risk_level);

-- 4. Dynamic Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'default_settings',
  site_name VARCHAR(128) NOT NULL DEFAULT 'رادار جنگ',
  site_title VARCHAR(255) NOT NULL DEFAULT 'دیدبان و مرجع تحلیل ژئوپلیتیک و منازعات ایران و آمریکا',
  hero_title VARCHAR(255) NOT NULL DEFAULT 'رصد تحولات راهبردی، توازن قوا و منازعات ایران و آمریکا',
  hero_subtitle TEXT NOT NULL,
  accent_color VARCHAR(16) NOT NULL DEFAULT '#B91C1C',
  logo_text VARCHAR(64) NOT NULL DEFAULT 'رادار جنگ',
  announcement_text TEXT DEFAULT '',
  announcement_active BOOLEAN DEFAULT false,
  contact_email VARCHAR(128) DEFAULT 'contact@radarejang.ir',
  telegram_channel VARCHAR(64) DEFAULT '@radarejang',
  footer_text TEXT NOT NULL,
  font_family VARCHAR(64) DEFAULT 'Vazirmatn',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LLM API Usage Logs Table
CREATE TABLE IF NOT EXISTS api_usage (
  id VARCHAR(64) PRIMARY KEY,
  provider VARCHAR(32) NOT NULL CHECK (provider IN ('xai', 'groq', 'google', 'openai')),
  model VARCHAR(64) NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost NUMERIC(10, 5) NOT NULL DEFAULT 0.0,
  endpoint VARCHAR(128) NOT NULL DEFAULT '/api/analyze',
  status VARCHAR(16) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_usage_provider ON api_usage(provider);
CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at DESC);

-- 6. Media & Files Table (Replaces R2)
CREATE TABLE IF NOT EXISTS media_files (
  id VARCHAR(64) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  mime_type VARCHAR(64) NOT NULL,
  url TEXT NOT NULL,
  provider VARCHAR(32) DEFAULT 'local',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
