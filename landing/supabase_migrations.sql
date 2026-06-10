-- Migration to add report_settings and payment tracking

-- 1. Add report_settings to clinic_registry
ALTER TABLE clinic_registry
ADD COLUMN IF NOT EXISTS report_settings JSONB DEFAULT '{"allowPremium": true, "whiteLabel": false, "customLogoUrl": null, "forceReportType": "user_choice"}'::jsonb;

-- 2. Add report_type and payment fields to assessments
ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS report_type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
