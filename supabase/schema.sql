-- ============================================================
--  Resident Event AI — Supabase Schema v2
--  Run this in: Supabase Dashboard → SQL Editor
--
--  If upgrading from v1, run the migration below instead:
--  supabase/migrations/002_add_rich_plan_fields.sql
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── Table: event_plans ──────────────────────────────────────────────────────

create table if not exists public.event_plans (
  -- Identity
  id                uuid        primary key default uuid_generate_v4(),
  created_at        timestamptz not null    default now(),

  -- Core AI fields
  title             text        not null,
  tagline           text        not null,
  overview          text        not null,
  theme             text        not null,
  pro_tip           text        not null,

  -- Array fields
  catering          text[]      not null default '{}',
  entertainment     text[]      not null default '{}',
  logistics         text[]      not null default '{}',
  budget_breakdown  text[]      not null default '{}',
  setup_logistics   text[]      not null default '{}',

  -- Rich structured fields (JSONB — flexible schema)
  timeline          jsonb       not null default '[]'::jsonb,
  vendor_ideas      jsonb       not null default '[]'::jsonb,
  staffing          jsonb       not null default '[]'::jsonb,
  alcohol_estimate  jsonb,               -- null when alcohol = 'No alcohol'
  resident_email    jsonb       not null default '{}'::jsonb,

  -- Flyer
  flyer_headline    text        not null default '',

  -- Form metadata
  meta              jsonb       not null default '{}'::jsonb
);

comment on table  public.event_plans is 'AI-generated resident event plans (v2 — rich fields)';
comment on column public.event_plans.timeline         is 'TimelineItem[]: {time, activity, responsible}';
comment on column public.event_plans.vendor_ideas     is 'VendorIdea[]: {category, suggestions[], estimatedCost}';
comment on column public.event_plans.staffing         is 'StaffingRole[]: {role, count, notes}';
comment on column public.event_plans.alcohol_estimate is 'AlcoholEstimate | null';
comment on column public.event_plans.resident_email   is 'ResidentEmail: {subject, body}';
comment on column public.event_plans.meta             is 'EventFormData: all form inputs';

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists event_plans_created_at_idx
  on public.event_plans (created_at desc);

-- ─── Row-Level Security ───────────────────────────────────────────────────────

alter table public.event_plans enable row level security;

drop policy if exists "anon_select" on public.event_plans;
drop policy if exists "anon_insert" on public.event_plans;
drop policy if exists "anon_delete" on public.event_plans;

create policy "anon_select"
  on public.event_plans for select to anon using (true);

create policy "anon_insert"
  on public.event_plans for insert to anon with check (true);

create policy "anon_delete"
  on public.event_plans for delete to anon using (true);
