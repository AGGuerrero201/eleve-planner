# Resident Event AI

An AI-powered event planning tool for luxury residential property managers. Built with React, Vite, TypeScript, and TailwindCSS — powered by the Anthropic Claude API.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — fast dev server and build
- **TailwindCSS** — utility-first styling with custom design tokens
- **React Router v6** — client-side routing
- **Lucide React** — icon library
- **Anthropic Claude API** — AI event plan generation

## Project Structure

```
src/
├── components/
│   ├── events/
│   │   ├── EventCard.tsx          # Saved event card
│   │   ├── EventDetailModal.tsx   # Full event detail modal
│   │   ├── EventPlannerForm.tsx   # Main planner form
│   │   └── EventPlanResult.tsx    # AI result display
│   ├── layout/
│   │   ├── Layout.tsx             # App shell
│   │   └── Navbar.tsx             # Sticky nav
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingDots.tsx
│   │   ├── Modal.tsx
│   │   ├── SectionLabel.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   └── ToggleGroup.tsx
│   └── index.ts                   # Barrel exports
├── hooks/
│   ├── useEventPlanner.ts         # AI generation state
│   └── useSavedEvents.ts          # localStorage CRUD
├── lib/
│   ├── api.ts                     # Anthropic API client
│   ├── constants.ts               # Form options
│   └── utils.ts                   # cn, storage, helpers
├── pages/
│   ├── LandingPage.tsx
│   ├── PlannerPage.tsx
│   └── SavedEventsPage.tsx
├── types/
│   └── index.ts                   # Shared TypeScript types
├── App.tsx
├── index.css
└── main.tsx
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API key

The app calls the Anthropic API directly from the browser. In production, you should proxy API calls through your own backend to keep the key secret.

For local development, the API key is handled automatically if you're using the Claude.ai artifact environment. For standalone deployment, create a `.env.local` file:

```env
VITE_ANTHROPIC_API_KEY=your_key_here
```

Then update `src/lib/api.ts` to include:
```ts
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
},
```

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Features

- **Landing Page** — Hero, feature grid, CTA
- **Event Planner** — Full form with toggles, AI generation, regeneration
- **Saved Events** — Card grid with modal detail view, delete, persistent storage
- **Responsive** — Mobile-first layout across all screen sizes
- **Accessible** — Focus management, ARIA labels, keyboard navigation

## Design System

Custom luxury aesthetic with:
- **Cormorant Garamond** (serif display) + **DM Sans** (UI)
- **Charcoal** (#1C1C1E) + **Gold** (#B8955A) palette
- Minimal 1.5px grid gutters, no shadow defaults
- Consistent `rounded-sm` (2px) border radius throughout

---

## Supabase Integration

Events are persisted to Supabase Postgres. See **[supabase/SETUP.md](supabase/SETUP.md)** for the full step-by-step guide.

### Quick start

```bash
# 1. Copy env template
cp .env.example .env.local

# 2. Fill in your Supabase URL + anon key in .env.local

# 3. Run the SQL schema in Supabase Dashboard → SQL Editor
#    (contents of supabase/schema.sql)

# 4. Start the app
npm run dev
```

### New files added

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Postgres table + RLS policies |
| `supabase/SETUP.md` | Step-by-step setup instructions |
| `.env.example` | Environment variable template |
| `src/lib/supabase.ts` | Typed Supabase client singleton |
| `src/lib/eventService.ts` | All CRUD: `fetchEventPlans`, `createEventPlan`, `deleteEventPlan` |
| `src/types/database.ts` | TypeScript types mirroring the SQL schema |
| `src/components/ui/SupabaseStatus.tsx` | Connection warning banner |

### Modified files

| File | Change |
|------|--------|
| `src/hooks/useSavedEvents.ts` | Replaced localStorage with Supabase async CRUD |
| `src/components/events/EventPlanResult.tsx` | Async save with loading spinner + error state |
| `src/pages/PlannerPage.tsx` | Wired to async `save()` |
| `src/pages/SavedEventsPage.tsx` | Added loading skeleton, error state, refresh button, delete spinner |
| `src/components/layout/Layout.tsx` | Added `<SupabaseStatus>` banner |
| `src/lib/utils.ts` | Removed localStorage helpers; added `generateTempId`, `extractErrorMessage` |
| `src/types/index.ts` | Added `AsyncStatus`, `AsyncState<T>`, `SupabaseErrorShape` |
| `package.json` | Added `@supabase/supabase-js` |
