-- MPLAD-Guard
-- Verification table schema

CREATE TABLE IF NOT EXISTS verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Pending',
    verifier TEXT,
    evidence TEXT,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
