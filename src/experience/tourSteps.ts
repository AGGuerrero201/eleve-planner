/**
 * experience/tourSteps.ts
 *
 * The guided walkthrough script for Experience Elevé.
 *
 * Each step explains WHY a capability matters to a property manager —
 * never just what a button does. Steps either advance on a real user
 * action (advanceOn signal) or via an explicit CTA that navigates the
 * user to the next surface. Every step can also be advanced manually,
 * so the walkthrough can never dead-end.
 */

import type { ExperienceSignal } from './experienceStore'

export interface TourStep {
  id:        string
  /** Route this step belongs to. The guide offers "Take me there" if the user wanders. */
  route:     string
  /** Caps eyebrow shown above the title. */
  eyebrow:   string
  title:     string
  body:      string
  /** Primary CTA — navigates (if `to` set) and advances the tour. */
  cta?:      { label: string; to?: string }
  /** If set, the step auto-advances when this signal fires. */
  advanceOn?: ExperienceSignal
  /** Shown instead of a CTA when the step is waiting on a user action. */
  hint?:     string
}

export const TOUR_STEPS: TourStep[] = [
  {
    id:      'welcome',
    route:   '/dashboard',
    eyebrow: 'Experience Elevé',
    title:   'Welcome to your event operation.',
    body:    'Most property teams spend four to six hours planning a single resident event: vendor emails, budget spreadsheets, invitation copy written at 10pm. Elevé compresses that to minutes. You\u2019re inside the real product right now, working with a fully planned community: The Meridian, a 312-unit luxury high-rise in Austin. Everything you see is live, and everything you touch will respond.',
    cta:     { label: 'Begin' },
  },
  {
    id:      'dashboard',
    route:   '/dashboard',
    eyebrow: 'The Dashboard',
    title:   'Your calendar, at a glance.',
    body:    'This is where a lifestyle director starts the morning: events in flight, vendor coverage, and the property profile that shapes every plan. Notice the statuses, a confirmed wine evening, an in-progress terrace reception, fresh drafts. Institutional memory usually lives in one person\u2019s inbox; here it lives where the whole team can see it. Let\u2019s plan a new event.',
    cta:     { label: 'Plan an event', to: '/planner' },
  },
  {
    id:        'planner-entry',
    route:     '/planner',
    eyebrow:   'Planning an Event',
    title:     'Two ways in, both fast.',
    body:      'Curated Templates are proven event formats that load complete plans instantly, the fastest route from idea to deliverable. Custom Event asks four quick questions and generates a plan tailored to your exact brief. For this walkthrough, choose Curated Templates to see how a concierge-grade plan launches in seconds.',
    advanceOn: 'planner_mode_selected',
    hint:      'Choose a planning path to continue',
  },
  {
    id:        'choose-template',
    route:     '/planner',
    eyebrow:   'Choosing a Template',
    title:     'Proven formats, ready to launch.',
    body:      'These collections encode what actually works in luxury multifamily: seasonal timing, resident fit, realistic budgets. That matters because a failed event costs more than money, it costs attendance at the next one. Open a collection and select any experience. Elevé will generate the complete plan live, tuned to The Meridian’s profile.',
    advanceOn: 'plan_ready',
    hint:      'Select an experience from a collection to continue',
  },
  {
    id:      'plan-ready',
    route:   '/planner',
    eyebrow: 'Your Event Plan',
    title:   'This is the four hours you just saved.',
    body:    'Scroll through what was produced: a minute-by-minute timeline, catering and entertainment direction, staffing counts, an alcohol estimate, a full budget breakdown, and a resident invitation email that\u2019s ready to send. Below the plan, Elevé has already matched vendors from your own directory, with insurance status included. This is a complete operating document, not a list of ideas.',
    cta:     { label: 'Continue' },
  },
  {
    id:        'save-event',
    route:     '/planner',
    eyebrow:   'Saving the Event',
    title:     'Build a library, not a pile of one-offs.',
    body:      'Every plan you save becomes reusable institutional knowledge, next summer\u2019s reception starts from this one instead of from zero. Saved plans also unlock inline editing and section-level refinement. Press Save Event at the bottom of the plan to add it to The Meridian\u2019s library.',
    advanceOn: 'event_saved',
    hint:      'Press “Save Event” beneath the plan to continue',
  },
  {
    id:      'library-intro',
    route:   '/saved',
    eyebrow: 'The Event Library',
    title:   'Every event, tracked from draft to delivered.',
    body:    'Your new plan is now part of a working library alongside the rest of the calendar. The status workflow, Draft, In Progress, Finalized, Archived, is how a team of one behaves like a team of five: anyone can see exactly where every event stands. Use View in Library on the plan, or open Saved Events and select the event you just saved.',
    advanceOn: 'event_opened',
    hint:      'Open the event you just saved to continue',
  },
  {
    id:        'edit-event',
    route:     '/saved',
    eyebrow:   'Editing an Event',
    title:     'Elevé drafts. You direct.',
    body:      'Inside the event, nearly every line is editable, click any text to refine it in place. Better still, each section has a Regenerate button: keep the timeline you love and ask for a fresh take on catering alone. That mix of control and speed is what makes the plan yours rather than a template. Try editing any field or regenerating a section.',
    advanceOn: 'event_edited',
    hint:      'Edit a field or regenerate a section, or continue when ready',
  },
  {
    id:      'vendors',
    route:   '/vendors',
    eyebrow: 'The Vendor Hub',
    title:   'Your vendor relationships, finally in one place.',
    body:    'Every caterer, bartender, and instructor The Meridian works with lives here, with price tiers, favorites, and the detail that protects you: COI insurance tracking. Notice Copper Kettle\u2019s expired certificate flagged in amber; catching that before an event is the difference between a great evening and a liability problem. These are the same vendors Elevé matched to your plan automatically.',
    cta:     { label: 'Visit the Vendor Hub', to: '/vendors' },
  },
  {
    id:      'property',
    route:   '/property',
    eyebrow: 'Property Intelligence',
    title:   'Why your plans don\u2019t feel generic.',
    body:    'This profile is the reason every plan fits your community: amenities, resident demographics, community personality, budget norms. Elevé reads it before generating anything, which is how a cocktail reception here becomes a rooftop golden-hour event for young professionals rather than a ballroom mixer for nobody in particular. Set it up once; every future plan benefits.',
    cta:     { label: 'See the property profile', to: '/property' },
  },
  {
    id:      'finale',
    route:   '/dashboard',
    eyebrow: 'Full Circle',
    title:   'Back where the day starts, with your event on the board.',
    body:    'Return to the dashboard and you\u2019ll find the event you just created in Recent Events and in the activity feed, counted in your library, standing beside the rest of the calendar. That\u2019s the whole loop: brief to resident-ready plan to tracked event, in minutes. Explore freely from here, everything is live, and you can restart or reset the experience any time from the bar above.',
    cta:     { label: 'Return to the dashboard', to: '/dashboard' },
  },
  {
    id:      'complete',
    route:   '/dashboard',
    eyebrow: 'Experience Complete',
    title:   'This is Elevé.',
    body:    'You planned, refined, and saved a resident event in a fraction of the usual time, with vendors matched, insurance checked, and the invitation already written. Keep exploring The Meridian, restart the walkthrough from the bar above, or reach out for a conversation about your own portfolio.',
    cta:     { label: 'Finish & explore freely' },
  },
]
