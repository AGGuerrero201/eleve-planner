# Elevé — Product Copy & Messaging Refinement Changelog

Scope: copy and terminology only. No layout, workflow, or functionality changes.
No files were added or removed; only visible, user-facing text was edited.
Verified: TypeScript (`tsc --noEmit`) passes, production build (`vite build`) succeeds,
zero remaining non-comment instances of em dashes (—) or the word "AI" in user-facing text.

25 files changed.

---

## 1. AI-centric language removed

Every user-facing mention of "AI" was rewritten to describe the outcome instead of the
technology, per the house terminology:

| File | Before | After |
|---|---|---|
| `src/pages/LandingPage.tsx` | "AI-Generated Plans" (feature card title) | "Tailored Event Plans" |
| `src/pages/LandingPage.tsx` | "AI-powered platform" (hero subhead) | "intelligent platform" |
| `src/pages/LandingPage.tsx` | "AI generation" (eyebrow label) | "Intelligent planning" |
| `src/pages/LandingPage.tsx` | "AI-generated plan" (preview card badge) | "Tailored plan" |
| `src/pages/LandingPage.tsx` | "AI-powered planning" (comparison table row) | "Intelligent, guided planning" |
| `src/pages/LandingPage.tsx` | "Section-level AI regeneration" (pricing feature) | "Section-level regeneration" |
| `src/pages/DashboardPage.tsx` | "AI-generated plans are crafted to your brief…" (insight strip) | "Event plans are crafted to your brief…" |
| `src/pages/DashboardPage.tsx` | "Generate a complete event plan with AI" (quick action) | "Build a complete event plan from your brief" |
| `src/pages/PropertySettingsPage.tsx` | "refine AI-generated events" | "refine future event plans" |
| `src/pages/PropertySettingsPage.tsx` | "property-aware AI generation" | "property-aware planning" |
| `src/pages/PropertySettingsPage.tsx` | "helps the AI generate more specific event concepts" (placeholder) | "helps Elevé generate more specific event concepts" |
| `src/pages/SampleEventPage.tsx` | "Generated using Elevé's AI planning engine." | "Built with Elevé's planning engine." |
| `src/components/property/PropertyProfileCard.tsx` | "unlock AI-generated events tailored…" | "unlock event plans personalized…" |
| `src/components/property/PropertyProfileCard.tsx` | "AI generation active for this property" | "Personalized planning active for this property" |
| `src/components/events/PlannerEntry.tsx` | "no AI wait time required" | "no wait required" |
| `src/components/events/EventDetailModal.tsx` | "Regenerate [Section] with AI" (button tooltip) | "Regenerate [Section]" |
| `src/components/events/wizard/StepRoute.tsx` | "Premium AI Plan" / "AI-generated to your brief" (panel header) | "Tailored Event Plan" / "Built around your brief" |
| `src/components/events/wizard/StepRoute.tsx` | "AI" badge on non-instant template cards | "Custom" |
| `src/components/events/wizard/StepRoute.tsx` | "use Premium AI →" | "choose Tailored Event Plan →" |
| `src/lib/api.ts` | Activity log: `Generated "X" with AI planning` | `Generated "X"` |
| `src/experience/seedData.ts` | Seed activity log: `Generated "…" with AI planning` | `Generated "…"` |
| `src/experience/tourSteps.ts` | "the property profile that powers the AI" | "the property profile that shapes every plan" |
| `src/experience/tourSteps.ts` | "section-level AI refinement" | "section-level refinement" |
| `src/experience/tourSteps.ts` | "The AI drafts. You direct." (step title) | "Elevé drafts. You direct." |
| `index.html` | (unchanged, no AI mention was present) | — |

Internal code comments that mention "AI" (e.g. prompt-construction notes in
`src/lib/api.ts`, `src/context/PropertyContext.tsx`, `src/types/property.ts`) were
intentionally left untouched, as they are not visible to end users.

---

## 2. Em dashes (—) removed

Every em dash in user-facing copy was rewritten into a natural sentence rather than
mechanically swapped for a comma. Depending on context this meant: splitting into two
sentences, using a colon to introduce a list or definition, using a comma for a short
parenthetical, or restructuring with parentheses for asides. Internal code comments
were left untouched, as they are not visible to end users.

**Files with the heaviest rewrites** (event plan template content — flyer headlines,
resident email copy, setup notes, luxury presentation notes, staffing notes):
- `src/lib/templates.ts` (~260 instances rewritten)
- `src/lib/templates/index.ts` (~120 instances)
- `src/lib/templates/eleve-templates-11c.ts` (~95 instances)
- `src/lib/templates/eleve-templates-11d.ts` (~90 instances)
- `src/lib/templates/eleve-templates-11e.ts` (~85 instances)
- `src/lib/collections.ts` (6 instances)
- `src/experience/localPlanEngine.ts` (~55 instances — event overviews, timelines,
  budget line formatting, resident email subject lines and body copy)

**UI chrome and page copy:**
- `src/pages/LandingPage.tsx` — hero subhead, problem statement, platform preview
  heading, feature/vendor/workflow copy, pricing "Book a Demo" mail subject, final CTA
- `src/pages/DashboardPage.tsx` — insight strip, empty state, quick action description
- `src/pages/PropertySettingsPage.tsx` — luxury-level dropdown label
- `src/pages/SampleEventPage.tsx` — caption and Property Profile CTA copy
- `src/experience/tourSteps.ts` — full guided-walkthrough script (all 12 steps)
- `src/experience/seedData.ts` — demo event and vendor notes
- `src/components/events/EventDetailModal.tsx` — bullet marker character
- `src/components/events/EventPlanResult.tsx` — save-error message, 3 bullet markers
- `src/components/events/PlannerEntry.tsx` — planner note
- `src/components/events/wizard/StepRoute.tsx` — route-selection copy
- `src/components/onboarding/OnboardingOverlay.tsx` — hint text
- `src/components/onboarding/SampleEventBanner.tsx` — banner lead-in text
- `src/components/property/PropertyProfileCard.tsx` — setup prompt
- `src/components/ui/EditableList.tsx` — bullet marker character
- `src/components/mobile/MobileDashboard.tsx` — stat placeholder character (now an en
  dash, "–", consistent with the desktop `StatCard` treatment), two feature descriptions
- `src/services/propertyService.ts` — Supabase error message
- `src/types/property.ts` — two property-type dropdown labels
- `index.html` — meta description

Where an em dash was being used purely as a visual "no data yet" placeholder in stat
cards (`DashboardPage.tsx`, `MobileDashboard.tsx`), it was replaced with an en dash
("–") rather than punctuation, since it isn't part of a sentence.

---

## 3. Terminology standardized

- "Premium AI Plan" → **Tailored Event Plan** (consistent across the planner wizard and
  guided walkthrough)
- "AI-generated plan" / "Generated with AI" → **Tailored plan** / **Event Plan**
- Kept **Experience Elevé**, **Property Intelligence**, **Vendor Hub**, **Event Plan**,
  and **Event Planner** consistent everywhere they already appeared correctly; no
  competing names were introduced.

---

## 4. Copy quality pass

- Meta title upgraded from bare "Elevé" to "Elevé | Luxury Residential Event Planning"
  for clearer SEO/tab-title context; meta description tightened.
- Empty-state and error copy reviewed for brevity and tone (e.g. dashboard empty state:
  "No saved events yet — generate your first plan to get started." → "No saved events
  yet. Create your first plan to get started.").
- Guided walkthrough (`tourSteps.ts`) copy tightened throughout for rhythm now that em
  dashes are gone; no meaning or step logic changed.
- Confirmed no buzzword/cliché language ("seamless," "cutting-edge," "revolutionary,"
  etc.) is present in customer-facing copy.

---

## Explicitly out of scope (unchanged)

- Layout, component structure, workflows, routing, and all non-text logic.
- Internal code comments (`//`, `/* */`, JSDoc) — not visible to end users.
- `README.md`, developer-facing documentation, and the npm package name
  (`resident-event-ai`) — internal/developer artifacts, not part of the product UI.
- The Supabase edge function prompt-engineering code (`supabase/functions/generate-event-plan/index.ts`)
  — this is a server-side prompt for the underlying model, not rendered UI copy.
