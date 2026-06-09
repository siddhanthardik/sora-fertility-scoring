-- Phase 2: Supabase Schema Update

-- 1. Add required fields to the existing clinic_registry table
ALTER TABLE public.clinic_registry
ADD COLUMN IF NOT EXISTS password_hash text,
ADD COLUMN IF NOT EXISTS widget_token text UNIQUE,
ADD COLUMN IF NOT EXISTS feature_toggles jsonb DEFAULT '{"whiteLabeling": false, "customWebhooks": false, "csvExport": false}'::jsonb,
ADD COLUMN IF NOT EXISTS widget_config jsonb DEFAULT '{"primaryColor": "#000000", "buttonText": "Start Assessment"}'::jsonb;

-- 2. Create the assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id text REFERENCES public.clinic_registry(clinic_id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text,
  age integer NOT NULL,
  bmi numeric,
  payload jsonb NOT NULL,
  fertistat_score integer NOT NULL,
  risk_band text NOT NULL,
  flagged_factors jsonb DEFAULT '[]'::jsonb,
  pdf_url text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'consultation_booked', 'archived')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assessments_clinic_id_idx ON public.assessments(clinic_id);
CREATE INDEX IF NOT EXISTS assessments_created_at_idx ON public.assessments(created_at DESC);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 3. Create Storage Buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;
