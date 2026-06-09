-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 3: Property Intelligence System
-- Migration: property_profiles table
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.property_profiles (
  id                   uuid primary key default gen_random_uuid(),
  -- No auth yet; using a stable client-generated user key stored in localStorage.
  -- Replace with: user_id uuid references auth.users not null
  -- once Supabase Auth is enabled.
  user_key             text not null,

  -- Required fields
  property_name        text not null,
  property_type        text not null,
  city                 text not null,
  state                text not null,

  -- Optional enrichment fields
  unit_count           integer,
  resident_demographic text,
  community_personality text[],    -- e.g. ['social','wellness']
  luxury_level         integer check (luxury_level between 1 and 5),
  indoor_spaces        text[],
  outdoor_spaces       text[],
  amenities            text[],     -- from defined enum list
  typical_attendance   text,       -- 'small' | 'medium' | 'large' | 'varies'
  preferred_budget     text,       -- 'budget' | 'moderate' | 'premium' | 'ultra'
  property_description text,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Index for fast lookup by user_key (replaces auth.uid() lookup pattern)
create index if not exists property_profiles_user_key_idx
  on public.property_profiles (user_key);

-- Auto-update updated_at on any row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists property_profiles_updated_at on public.property_profiles;
create trigger property_profiles_updated_at
  before update on public.property_profiles
  for each row execute function public.handle_updated_at();

-- RLS: enable but allow all for now (no auth layer yet)
-- Replace the permissive policy with user-scoped ones once auth is added.
alter table public.property_profiles enable row level security;

drop policy if exists "allow_all_property_profiles" on public.property_profiles;
create policy "allow_all_property_profiles"
  on public.property_profiles
  for all
  using (true)
  with check (true);

-- ─── Future: add property_id FK to event_plans ───────────────────────────────
-- Run this separately once you want per-property event history:
--
-- alter table public.event_plans
--   add column if not exists property_id uuid references public.property_profiles(id);
--
-- create index if not exists event_plans_property_id_idx
--   on public.event_plans (property_id);
