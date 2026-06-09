-- Phase 3: Packages & Settings Database Migration

-- 1. Create a table for global platform settings
CREATE TABLE IF NOT EXISTS sora_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize the default widget host URL
INSERT INTO sora_settings (key, value)
VALUES ('widgetHostUrl', '"http://localhost:3000"')
ON CONFLICT (key) DO NOTHING;

-- 2. Create the packages table
CREATE TABLE IF NOT EXISTS sora_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_inr INTEGER NOT NULL DEFAULT 0,
  assessment_limit INTEGER, -- NULL means unlimited
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but allow anyone to read packages
ALTER TABLE sora_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Packages are readable by everyone" ON sora_packages FOR SELECT USING (true);

-- 3. Seed the default packages (Starter, Growth, Enterprise)
INSERT INTO sora_packages (id, name, price_inr, assessment_limit, features)
VALUES 
  (
    'starter', 
    'Starter', 
    0, 
    100, 
    '["Up to 100 assessments / mo", "Basic PDF Reports", "Email Notifications"]'::jsonb
  ),
  (
    'growth', 
    'Growth', 
    4999, 
    500, 
    '["Up to 500 assessments / mo", "Widget Color Customization", "CSV Exports", "Priority Support"]'::jsonb
  ),
  (
    'enterprise', 
    'Enterprise', 
    9999, 
    NULL, 
    '["Unlimited assessments", "Full White-labeling", "Custom Webhooks", "Dedicated Account Manager"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  price_inr = EXCLUDED.price_inr,
  assessment_limit = EXCLUDED.assessment_limit,
  features = EXCLUDED.features;
