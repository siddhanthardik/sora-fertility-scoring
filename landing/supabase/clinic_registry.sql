create table if not exists public.clinic_registry (
  clinic_id text primary key,
  name text not null,
  owner_name text default '',
  owner_email text not null,
  notification_email text default '',
  allowed_domains jsonb not null default '[]'::jsonb,
  status text not null default 'trial',
  verification_status text not null default 'pending',
  plan text not null default 'starter',
  usage jsonb not null default jsonb_build_object(
    'totalAssessments', 0,
    'totalReports', 0,
    'lastAssessmentAt', null
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinic_registry_status_check check (status in ('active', 'trial', 'paused', 'blocked')),
  constraint clinic_registry_verification_status_check check (verification_status in ('pending', 'verified', 'rejected')),
  constraint clinic_registry_allowed_domains_array_check check (jsonb_typeof(allowed_domains) = 'array'),
  constraint clinic_registry_usage_object_check check (jsonb_typeof(usage) = 'object')
);

create index if not exists clinic_registry_status_idx on public.clinic_registry (status);
create index if not exists clinic_registry_verification_status_idx on public.clinic_registry (verification_status);
create index if not exists clinic_registry_created_at_idx on public.clinic_registry (created_at desc);

alter table public.clinic_registry enable row level security;

create or replace function public.set_clinic_registry_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_clinic_registry_updated_at on public.clinic_registry;
create trigger set_clinic_registry_updated_at
before update on public.clinic_registry
for each row
execute function public.set_clinic_registry_updated_at();

create or replace function public.increment_clinic_assessment(clinic_id_input text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.clinic_registry
  set
    usage = jsonb_set(
      jsonb_set(
        coalesce(usage, '{}'::jsonb),
        '{totalAssessments}',
        to_jsonb(coalesce((usage->>'totalAssessments')::int, 0) + 1),
        true
      ),
      '{lastAssessmentAt}',
      to_jsonb(now()::text),
      true
    ),
    updated_at = now()
  where clinic_id = clinic_id_input;
end;
$$;
