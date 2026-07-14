# CHANGELOG — Experience Elevé

**Release:** Experience Elevé — the guided product experience
**Scope:** 7 new files, 14 modified files. No files were deleted. No database schema changes. No new dependencies.

---

## What this release does

"Experience Elevé" replaces the old "Enter Demo" entry point with a fully interactive, guided product experience. One click from the landing page drops a prospective customer into the live product, pre-populated with a believable luxury multifamily community — **The Meridian**, a 312-unit high-rise in Austin, TX — and a 12-step concierge walkthrough that carries them through the complete loop: Dashboard → Planning → Template selection → AI-generated plan → Saving → Library → Editing → Vendor Hub → Property Intelligence → back to the Dashboard, where their saved event is visible in the library, the recent-events list, and a live activity feed.

Every interaction in the experience is real: plans generate, save, edit, and regenerate section-by-section; vendors can be added, edited, favorited, and removed; the property profile can be changed and immediately influences the next generated plan. All experience data lives in a namespaced `eleve_experience_*` localStorage layer — production Supabase data is never read or written while the experience is active, and exiting restores normal behavior untouched.

---

## New files

| File | Purpose |
|---|---|
| `src/experience/experienceStore.ts` | The isolated data layer: namespaced localStorage CRUD for events, vendors, the property profile, and the activity feed; the walkthrough signal bus; activation/deactivation/reseed lifecycle. |
| `src/experience/seedData.ts` | Realistic seed content: The Meridian property profile, 6 seeded events spanning the full workflow (in-progress, finalized, drafts, archived history), 10 vendors across categories with COI states (including one expired certificate the walkthrough references), and a starting activity feed. |
| `src/experience/localPlanEngine.ts` | The local plan composer. In experience mode, generation runs against this curated content engine (per-event-type concepts, group-based timelines, computed budgets/staffing/alcohol from the actual form inputs) so the walkthrough never depends on network access or API keys. Also powers section-level regeneration with genuinely different alternative content. |
| `src/experience/tourSteps.ts` | The 12-step walkthrough script. Every step explains *why* the capability matters to a property manager, not what a button does. Steps advance on real user actions (mode chosen, plan generated, event saved, event opened, event edited) or explicit CTAs. |
| `src/experience/ExperienceContext.tsx` | State machine: active flag, tour progression, signal listening, and the lifecycle actions (start / restart / reset data / exit / skip). Tour position persists across refreshes. |
| `src/experience/ExperienceGuide.tsx` | The floating concierge card (bottom-right desktop, bottom sheet mobile, above modals). Offers "Take me there" if the user wanders off-route and a per-step skip so the tour can never dead-end. Pure CSS hover/focus states. |
| `src/experience/ExperienceBar.tsx` | Persistent control bar under the navbar while the experience is active: **Restart Experience**, **Reset Experience Data** (inline two-tap confirmation), and **Exit**. |

## Modified files

| File | Change |
|---|---|
| `src/App.tsx` | Wrapped the app in `ExperienceProvider`; mounted `ExperienceGuide`. |
| `src/components/layout/Layout.tsx` | Mounted `ExperienceBar` beneath the navbar. |
| `src/pages/LandingPage.tsx` | All three "Enter Demo" CTAs are now **"Experience Elevé"** and launch the guided experience. Final-CTA supporting copy updated to describe the experience honestly. |
| `src/lib/api.ts` | `generateEventPlan` branches to the local plan engine when the experience is active (with a natural pause so the generation sequence plays); session cache bypassed in experience mode so "Regenerate" visibly produces a fresh take; generations are logged to the activity feed. |
| `src/lib/sectionRegeneration.ts` | `regenerateSection` branches to the local engine's section variants in experience mode. |
| `src/hooks/useSavedEvents.ts` | All operations (fetch/save/remove/status/field updates) branch through the experience store when active; refetches on experience data changes (reset/reseed). |
| `src/hooks/useVendors.ts` | Same branching for the vendor directory. |
| `src/services/propertyService.ts` | Profile fetch/upsert branch through the experience store when active. |
| `src/context/PropertyContext.tsx` | Reloads the profile whenever the experience activates, deactivates, or reseeds; profile now clears correctly when the active data source has none. |
| `src/pages/DashboardPage.tsx` | Legacy onboarding overlay and sample banner suppressed during the experience (the walkthrough replaces them). New **Recent activity** feed (experience mode). Recent-event rows now deep-link to and open the specific event (Master Plan P8). "Browse Templates" quick action opens the planner directly in template browsing (P8). |
| `src/pages/SavedEventsPage.tsx` | Supports `{ state: { openEventId } }` deep links — the referenced event opens on arrival. Removed the redundant native `window.confirm` on delete; the card's inline ConfirmDialog already gates it (Master Plan P11). Card opens emit walkthrough signals. |
| `src/pages/PlannerPage.tsx` | Reads a deep-linked mode from navigation state; mode selection and plan arrival emit walkthrough signals; suggested starting points now **pre-fill the wizard with the promised event type** instead of discarding the selection (Master Plan P7); **Regenerate now actually regenerates** — it routes through `retry()`, which clears the input hash that previously short-circuited identical requests; Supabase connection banner hidden during the experience (P12). |
| `src/components/events/PlannerEntry.tsx` | `onSelect` carries an optional prefill event type; suggested cards pass their event type through (Master Plan P7). |
| `src/components/events/EventPlanResult.tsx` | The save moment has a payoff: "Saved to Supabase" replaced with an on-brand "Saved to your library" confirmation plus a **View in Library** button that opens the saved event directly (Master Plan P3, P12). Save state resets when a new plan arrives. Fixed the `hidden xs:block` bug — no `xs` breakpoint exists in the Tailwind config, so the timeline's responsible-party column never rendered anywhere; now `hidden sm:block` (Master Plan P14). |

## Master Plan items addressed in passing

P3 (save dead-end), P7 (suggested cards discard selection), P8 (dashboard rows and quick actions don't deep-link), P11 (`window.confirm` on event delete), P12 (dev-speak: "Saved to Supabase", Supabase status banner in the experience), P14 (`xs:block` rendering bug), plus the previously undocumented dead **Regenerate** button on fresh results.

## Data isolation guarantees

- Experience data lives exclusively under `eleve_experience_*` localStorage keys.
- Activating the experience never reads production data; exiting never writes to it.
- **Reset Experience Data** wipes and reseeds only the experience namespace.
- **Exit** returns the app to Supabase-backed behavior with production data intact.

## Verification notes (please read)

Full static verification was performed: the pure-TypeScript experience module (`localPlanEngine`, `experienceStore`, `seedData`, `tourSteps` plus all app types) compiles cleanly under `tsc --strict` with `noUnusedLocals`/`noUnusedParameters`, and a whole-`src` compiler pass surfaced no errors in any new or modified file beyond artifacts of the check environment lacking installed `@types` packages. Every navigation path, signal, and walkthrough step was traced end-to-end against the actual component code, including restart, reset, exit, refresh-resume, and off-route recovery.

The update was authored in a sandbox without npm registry access, so `npm run build` and `npm run lint` could not be executed there. **Run the verification commands included with this package** (`npm install && npx tsc --noEmit && npm run build`) after installing — they are expected to pass, and I want that confirmed on a real toolchain rather than asserted.

## Known behavior notes

- On mobile, the guide card and the event-detail bottom sheet share the bottom edge; the guide sits on top by design so guidance stays visible. It can be dismissed per-step ("Skip this step") or entirely (×).
- The `/sample` onboarding route is untouched; it is naturally unreachable during the experience because the walkthrough replaces first-run onboarding.
- Exiting and re-entering the experience preserves experience data (including events the visitor saved) until **Reset Experience Data** is used.
