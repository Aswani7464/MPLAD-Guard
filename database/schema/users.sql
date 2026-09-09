-- MPLAD-Guard
-- Users table schema

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Viewer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
