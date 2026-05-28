# SORA Superadmin Operations

The private admin console is available at `/superadmin`.

## Required environment variables

```text
SORA_SUPERADMIN_PASSWORD=use-a-long-random-password
SORA_SUPERADMIN_SESSION_SECRET=use-another-long-random-secret
SUPABASE_URL=https://crxwaihhwcqgxarikyyw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SORA_CLINIC_ID=clinic_id_for_the_main_landing_page
SORA_ALLOWED_WIDGET_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code, WordPress plugin settings, or public documentation. It belongs only in the server environment where the Next.js app runs.

Local development allows demo assessment requests without a clinic ID. Production requires a valid clinic ID unless `SORA_ALLOW_PUBLIC_DEMO_ASSESSMENT=true` is explicitly set.

## Supabase setup

1. Open your Supabase project: `https://crxwaihhwcqgxarikyyw.supabase.co`.
2. Go to SQL Editor.
3. Run the SQL in `supabase/clinic_registry.sql`.
4. Go to Project Settings > API.
5. Add the project URL and `service_role` key to your deployment environment.

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present, the app stores clinic data in Supabase Postgres. Without those variables, it falls back to `data/clinics.json` for local development only.

## Clinic lifecycle

1. Create a clinic from `/superadmin`.
2. Add the clinic's approved domains.
3. Keep verification as `pending` until you verify the doctor/clinic manually.
4. Click `Verify`.
5. Share the generated Clinic ID, WordPress plugin settings, or embed snippet.
6. Pause or block the clinic if subscription, compliance, or abuse checks fail.

## What the scoring API checks

- Clinic ID exists.
- Clinic status is `active` or `trial`.
- Clinic verification status is `verified`.
- Request origin matches the clinic's allowed domains.
- Submitted questionnaire payload passes server-side validation.

## Storage note

Production clinic records should live in Supabase Postgres. The JSON file fallback is only for local development.
