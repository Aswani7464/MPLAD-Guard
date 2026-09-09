-- MPLAD-Guard
-- Risks table schema

CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    score NUMERIC DEFAULT 0,
    level TEXT DEFAULT 'Low',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
