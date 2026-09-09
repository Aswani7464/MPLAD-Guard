-- MPLAD-Guard
-- Analytics table schema

CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC DEFAULT 0,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
