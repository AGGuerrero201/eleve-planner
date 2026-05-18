-- ============================================================
--  Migration 002 — Add rich plan fields to event_plans
--  Run this if you already have the v1 table from schema.sql
--  Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- New array columns
alter table public.event_plans
  add column if not exists setup_logistics text[]  not null default '{}',
  add column if not exists flyer_headline  text    not null default '';

-- New JSONB columns
alter table public.event_plans
  add column if not exists timeline         jsonb not null default '[]'::jsonb,
  add column if not exists vendor_ideas     jsonb not null default '[]'::jsonb,
  add column if not exists staffing         jsonb not null default '[]'::jsonb,
  add column if not exists alcohol_estimate jsonb,
  add column if not exists resident_email   jsonb not null default '{}'::jsonb;

-- Rename old timeline (text[]) → timeline_legacy to avoid conflict
-- (only needed if you had data in the old text[] timeline column)
-- alter table public.event_plans rename column timeline to timeline_legacy;

-- Update comments
comment on column public.event_plans.timeline         is 'TimelineItem[]: {time, activity, responsible}';
comment on column public.event_plans.vendor_ideas     is 'VendorIdea[]: {category, suggestions[], estimatedCost}';
comment on column public.event_plans.staffing         is 'StaffingRole[]: {role, count, notes}';
comment on column public.event_plans.alcohol_estimate is 'AlcoholEstimate | null';
comment on column public.event_plans.resident_email   is 'ResidentEmail: {subject, body}';
