# Supabase Integration Guide

Step-by-step instructions for connecting Resident Event AI to Supabase.

---

## 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Choose an organisation, give the project a name (e.g. `resident-event-ai`), set a strong database password, and pick a region close to your users.
4. Wait ~2 minutes for the project to spin up.

---

## 2 — Run the SQL Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase/schema.sql` from this repo and paste the entire contents into the editor.
4. Click **Run** (or press `Cmd/Ctrl + Enter`).
5. You should see `Success. No rows returned.`

Verify the table was created:

```sql
select * from public.event_plans limit 5;
```

---

## 3 — Get Your API Keys

1. In the Supabase dashboard, go to **Settings → API**.
2. Copy:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **Project API Keys → anon / public** — a long JWT string

> **Security note:** The `anon` key is safe to expose in a browser — it is limited by Row-Level Security (RLS). Never expose the `service_role` key on the client.

---

## 4 — Configure Environment Variables

Create `.env.local` in the project root (it is git-ignored):

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Restart the dev server after editing env vars:

```bash
npm run dev
```

---

## 5 — Verify the Connection

When you open the app, a yellow warning banner appears if the Supabase connection fails. If the banner does not appear, the connection is healthy.

You can also run a manual check in the browser console:

```js
// Open browser DevTools → Console and paste:
import('/src/lib/supabase.js').then(m => m.checkSupabaseConnection().then(console.log))
// Expected output: true
```

Or navigate to **Saved Events** — it should show an empty state (not an error).

---

## 6 — Project Structure (Supabase files)

```
supabase/
└── schema.sql               # Full table definition + RLS policies

src/
├── lib/
│   ├── supabase.ts          # Typed Supabase client singleton
│   └── eventService.ts      # All CRUD: fetch, create, delete
├── hooks/
│   └── useSavedEvents.ts    # React hook wrapping eventService
├── types/
│   ├── database.ts          # Generated DB types (mirror of schema)
│   └── index.ts             # App types (AsyncStatus, AsyncState, etc.)
└── components/
    └── ui/
        └── SupabaseStatus.tsx  # Connection banner + pill indicator
```

---

## 7 — Row-Level Security

The schema ships with permissive **anon** policies so the app works without authentication. The table structure is:

| Column             | Type        | Notes                                    |
|--------------------|-------------|------------------------------------------|
| `id`               | `uuid`      | Primary key, auto-generated              |
| `created_at`       | `timestamptz` | Auto-set to `now()`                   |
| `title`            | `text`      |                                          |
| `tagline`          | `text`      |                                          |
| `overview`         | `text`      |                                          |
| `theme`            | `text`      |                                          |
| `timeline`         | `text[]`    | Postgres array                           |
| `catering`         | `text[]`    |                                          |
| `entertainment`    | `text[]`    |                                          |
| `logistics`        | `text[]`    |                                          |
| `budget_breakdown` | `text[]`    |                                          |
| `pro_tip`          | `text`      |                                          |
| `meta`             | `jsonb`     | Stores `EventFormData` (form inputs)     |

---

## 8 — Adding Authentication (optional, future)

When you add Supabase Auth, update the schema to scope events per user:

```sql
alter table public.event_plans
  add column user_id uuid references auth.users(id) on delete cascade;

-- Drop anon policies
drop policy if exists "anon_select" on public.event_plans;
drop policy if exists "anon_insert" on public.event_plans;
drop policy if exists "anon_delete" on public.event_plans;

-- Add per-user policies
create policy "user_select" on public.event_plans
  for select to authenticated using (auth.uid() = user_id);

create policy "user_insert" on public.event_plans
  for insert to authenticated with check (auth.uid() = user_id);

create policy "user_delete" on public.event_plans
  for delete to authenticated using (auth.uid() = user_id);
```

Then update `eventService.ts` to include `user_id: supabase.auth.getUser()...id` in insert payloads.

---

## 9 — Regenerating TypeScript Types

When you change the schema, regenerate `src/types/database.ts`:

```bash
# Install the Supabase CLI if you haven't already
npm install -g supabase

# Login
supabase login

# Generate types from your live project
npx supabase gen types typescript \
  --project-id your-project-ref \
  > src/types/database.ts
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Yellow connection banner appears | Check `.env.local` keys are correct and the dev server was restarted |
| `relation "event_plans" does not exist` | Run `supabase/schema.sql` in the SQL Editor |
| `new row violates row-level security policy` | Confirm the anon INSERT policy exists in the SQL Editor |
| Events load but save fails | Check browser Network tab for the Supabase API response body |
| TypeScript errors in `database.ts` | Regenerate types (step 9) after schema changes |
