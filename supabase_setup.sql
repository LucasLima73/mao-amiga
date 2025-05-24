-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  language TEXT NOT NULL,
  search_term TEXT NOT NULL,
  categories TEXT[],
  keywords TEXT[],
  published_at TEXT,
  relevance_score NUMERIC,
  snippet TEXT,
  source TEXT,
  uuid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url, language)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_articles_language_search ON news_articles(language, search_term);
