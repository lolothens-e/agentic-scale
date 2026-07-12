CREATE EXTENSION IF NOT EXISTS "pgcrypto";
 
CREATE TYPE instrument_type AS ENUM ('Acciones', 'Criptoactivos', 'Instrumentos de crédito', 'Otros');
CREATE TYPE impact_type AS ENUM ('Positivo', 'Negativo', 'Neutral', 'Incierto');
CREATE TYPE briefing_status AS ENUM ('Pendiente', 'Revisada', 'Escalada', 'Descartada');
 
CREATE TABLE assets (
    symbol      VARCHAR(20) PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    type        instrument_type NOT NULL
);
 
CREATE TABLE news (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id         VARCHAR(150),
    source              VARCHAR(100) NOT NULL,
    headline            VARCHAR(500) NOT NULL,
    translated_headline VARCHAR(500),
    summary             TEXT,
    translated_summary  TEXT,
    published_at        TIMESTAMPTZ NOT NULL,
    ingested_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (external_id, source)
);
 
CREATE TABLE news_assets (
    news_id      UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    asset_symbol VARCHAR(20) NOT NULL REFERENCES assets(symbol),
    PRIMARY KEY (news_id, asset_symbol)
);
 
CREATE TABLE news_analysis (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id               UUID NOT NULL UNIQUE REFERENCES news(id) ON DELETE CASCADE,
    impact                impact_type NOT NULL,
    confidence            SMALLINT NOT NULL CHECK (confidence BETWEEN 1 AND 100),
    explanation           TEXT NOT NULL,
    evidence              TEXT NOT NULL,
    historical_comparison TEXT,
    associated_movement   TEXT,
    suggested_action      TEXT,
    analyzed_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
 
CREATE TABLE watchlists (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE
);
 
CREATE TABLE watchlist_assets (
    watchlist_id UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
    asset_symbol VARCHAR(20) NOT NULL REFERENCES assets(symbol),
    PRIMARY KEY (watchlist_id, asset_symbol)
);
 
CREATE TABLE briefings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id             UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    watchlist_id        UUID REFERENCES watchlists(id) ON DELETE SET NULL,
    watchlist_label     VARCHAR(150), -- respaldo si no hay watchlist_id (ej. "Análisis Especial (NVDA)")
    target_asset        VARCHAR(20) NOT NULL REFERENCES assets(symbol),
    associated_movement TEXT,
    suggested_action    TEXT,
    status              briefing_status NOT NULL DEFAULT 'Pendiente',
    justification       TEXT NOT NULL DEFAULT '',
    alert_created       BOOLEAN NOT NULL DEFAULT false,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
 
CREATE INDEX idx_news_published_at ON news (published_at DESC);
CREATE INDEX idx_briefings_status ON briefings (status);