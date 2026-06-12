-- Migration to add report_settings and payment tracking

-- 1. Add report_settings to clinic_registry
ALTER TABLE clinic_registry
ADD COLUMN IF NOT EXISTS report_settings JSONB DEFAULT '{"allowPremium": true, "whiteLabel": false, "customLogoUrl": null, "forceReportType": "user_choice"}'::jsonb;

-- 2. Add report_type and payment fields to assessments
ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS report_type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- 3. Add password reset fields to clinic_registry
ALTER TABLE clinic_registry
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;

-- 4. SEO Settings table for dynamic meta tags
CREATE TABLE IF NOT EXISTS seo_settings (
  page_route TEXT PRIMARY KEY,
  meta_title TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for seo_settings
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to SEO settings
CREATE POLICY "Public can view seo_settings"
  ON seo_settings FOR SELECT
  USING (true);

-- Allow superadmin full access to SEO settings
-- Assuming superadmins have a specific role or email, but typically we might just allow authenticated users for this MVP if superadmin logic isn't strictly defined by RLS
CREATE POLICY "Authenticated can manage seo_settings"
  ON seo_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- 5. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author_name TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Public can view published blogs"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Allow authenticated users (superadmin) full access to all blogs
CREATE POLICY "Authenticated can manage blogs"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- 6. Storage Bucket for Blog Images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog_images', 'blog_images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies for blog_images
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog_images');

CREATE POLICY "Authenticated can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog_images' AND auth.role() = 'authenticated');

-- 7. Leads Table for capturing high-risk patients from the Widget/Assessment
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country_code TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  bmi NUMERIC,
  source TEXT DEFAULT 'web_widget',
  
  -- Medical constraints matching the API mapping
  prev_birth TEXT,
  cycle_reg TEXT,
  pcos TEXT,
  endometriosis TEXT,
  thyroid TEXT,
  diabetes TEXT,
  smoking TEXT,
  alcohol TEXT,
  try_duration TEXT,
  
  -- Labs
  lab_amh NUMERIC,
  lab_fsh NUMERIC,
  lab_afc INTEGER,
  
  -- Computed Triage Results
  triage_tier TEXT,
  urgency TEXT,
  flagged_markers JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (for the web widget to capture leads)
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Allow superadmins full access to view and manage leads
CREATE POLICY "Authenticated can manage leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

-- 8. Add PCOS Assessment specific fields to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS pcos_assessment_score INTEGER,
ADD COLUMN IF NOT EXISTS pcos_risk_level TEXT,
ADD COLUMN IF NOT EXISTS pcos_pattern TEXT,
ADD COLUMN IF NOT EXISTS pcos_responses JSONB,
ADD COLUMN IF NOT EXISTS pcos_report_version TEXT,
ADD COLUMN IF NOT EXISTS lead_priority TEXT;