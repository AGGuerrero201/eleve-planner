/**
 * Supabase Edge Function: generate-event-plan
 * Claude Sonnet 4 — Luxury Residential Lifestyle Manager persona
 *
 * Supports two modes:
 *   1. Full generation  — body: { formData }
 *   2. Section regen    — body: { formData, section, eventContext }
 *
 * Deploy:   supabase functions deploy generate-event-plan --no-verify-jwt
 * Secret:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventFormData {
  eventType: string
  budget: string
  attendance: string
  season: string
  venue: string
  alcohol: string
  demographic: string
  notes: string
}

type RegenerableSection =
  | 'catering' | 'entertainment' | 'setup_logistics' | 'timeline'
  | 'staffing' | 'vendor_ideas' | 'resident_email' | 'flyer_headline' | 'pro_tip'

const VALID_SECTIONS: RegenerableSection[] = [
  'catering', 'entertainment', 'setup_logistics', 'timeline',
  'staffing', 'vendor_ideas', 'resident_email', 'flyer_headline', 'pro_tip',
]

interface EventContext {
  title: string
  eventType: string
  budget: string
  attendance: string
  venue: string
  alcohol: string
  demographic: string
  season: string
}

interface GenerateEventRequest {
  formData: EventFormData
  section?: RegenerableSection
  eventContext?: EventContext
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── Retry ────────────────────────────────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, delayMs = 800): Promise<T> {
  let lastError: Error = new Error('Unknown error')
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      const isRetryable =
        lastError.message.includes('529') ||
        lastError.message.includes('503') ||
        lastError.message.includes('timeout')
      if (!isRetryable || attempt === maxAttempts) throw lastError
      await new Promise((r) => setTimeout(r, delayMs * attempt))
    }
  }
  throw lastError
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAttendanceMidpoint(attendance: string): number {
  const nums = attendance.match(/\d+/g)
  if (!nums) return 50
  if (nums.length === 1) return parseInt(nums[0])
  return Math.round((parseInt(nums[0]) + parseInt(nums[1])) / 2)
}

function parseBudgetMidpoint(budget: string): number {
  const nums = budget.replace(/,/g, '').match(/\d+/g)
  if (!nums) return 5000
  if (nums.length === 1) return parseInt(nums[0])
  return Math.round((parseInt(nums[0]) + parseInt(nums[1])) / 2)
}

function calcAlcohol(attendance: string, alcoholType: string, budgetStr: string) {
  if (alcoholType === 'No alcohol') return null
  const guests = parseAttendanceMidpoint(attendance)
  const budget = parseBudgetMidpoint(budgetStr)
  const durationHours = 2.5
  const servingsPerPerson = Math.round(durationHours * 1.2)
  const totalServings = Math.round(guests * servingsPerPerson * 1.15)
  const alcoholBudgetRatio = alcoholType === 'Full bar' ? 0.35 : 0.22
  const alcoholBudget = Math.round(budget * alcoholBudgetRatio)
  let bottleBreakdown = ''
  let wineBottles = 0
  let beerCases = 0
  let spiritBottles = 0
  if (alcoholType === 'Full bar') {
    wineBottles = Math.ceil((totalServings * 0.40) / 5)
    beerCases = Math.ceil((totalServings * 0.30) / 24)
    spiritBottles = Math.ceil((totalServings * 0.30) / 16)
    bottleBreakdown = `${wineBottles} bottles of wine + ${beerCases} cases of beer + ${spiritBottles} bottles of spirits`
  } else {
    wineBottles = Math.ceil((totalServings * 0.60) / 5)
    beerCases = Math.ceil((totalServings * 0.40) / 24)
    bottleBreakdown = `${wineBottles} bottles of wine + ${beerCases} cases of beer`
  }
  const costLow = Math.round(alcoholBudget * 0.85)
  const costHigh = Math.round(alcoholBudget * 1.15)
  return { servingsPerPerson, totalServings, bottleBreakdown, costRange: `$${costLow.toLocaleString()} – $${costHigh.toLocaleString()}` }
}

// ─── Shared Claude call ───────────────────────────────────────────────────────

async function callClaude(
  apiKey: string,
  systemText: string,
  userText: string,
  maxTokens: number
): Promise<{ rawText: string; model: string }> {
  return withRetry(async () => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: [
          {
            type: 'text',
            text: systemText,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: userText }],
          },
        ],
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Anthropic ${res.status}: ${errBody}`)
    }

    const data = await res.json() as {
      content: Array<{ type: string; text?: string }>
      model: string
    }

    const rawText = data.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('')
      .replace(/```json|```/g, '')
      .trim()

    return { rawText, model: data.model }
  }, 3, 800)
}

// ─── System prompt (cached — shared by both modes) ───────────────────────────

function buildSystemPrompt(): string {
  return `You are a seasoned luxury residential lifestyle manager with 20+ years running resident programming at Class A multifamily communities in New York, Miami, Los Angeles, Chicago, and Austin.

Your planning philosophy is built on these non-negotiable principles:

RESIDENT FLOW & COMFORT
- Design event spaces and timing so residents never feel crowded or rushed
- Plan entry staggering and clear circulation paths for all group sizes
- Every event should feel intimate regardless of headcount — use furniture groupings, stations, and zones to break up large spaces
- Always account for 15–20% no-shows from RSVP count when planning space

STAFFING
- Never understaff — use the pre-calculated baseline as your floor, not ceiling
- Dedicated greeter at the entrance for the first 45 minutes
- Management floats and engages; they do not work stations
- 30-minute staff briefing before doors open

ALCOHOL & BEVERAGE
- Always offer a premium non-alcoholic option alongside any bar service
- Last call 30 minutes before event end — not at close
- Never run out: surplus is always better than running dry

DEMOGRAPHIC SENSITIVITY
- Young professionals (25–35): value networking opportunities, Instagram-worthy moments, late start times (7PM+), craft beverages, music with energy
- Families: early timing (4–7PM), kid-friendly activations alongside adult programming, easy parking/stroller access, casual catering
- Mature residents (50+): daytime or early evening (5–7PM), seated arrangements, quieter music, classic food and wine, clear signage
- Mixed demographics: tiered programming zones so each group has a natural home

UPSCALE PRESENTATION
- Linens, florals, and lighting are non-negotiable for any event over $2,000
- Signage must be printed, not handwritten — ever
- Staff must be in uniform or business casual minimum
- Packaging and presentation of food matters as much as the food itself
- Music volume: background during arrival/dining, can lift during cocktail hour peak

AVOID
- Generic concepts unworthy of a luxury residence (pizza party, basic movie night)
- Overcrowding — cap RSVPs rather than pack a room
- Running out of food or alcohol
- Awkward phase transitions that leave residents standing without direction
- Ignoring season, local culture, or property aesthetic

You always respond with a single valid JSON object and nothing else — no markdown, no backticks, no commentary. Your output must be parseable by JSON.parse().`
}

// ─── Full generation prompt ───────────────────────────────────────────────────

function buildUserPrompt(data: EventFormData): string {
  const guestCount = parseAttendanceMidpoint(data.attendance)
  const budget = parseBudgetMidpoint(data.budget)
  const perPersonBudget = Math.round(budget / guestCount)
  const alcoholCalc = calcAlcohol(data.attendance, data.alcohol, data.budget)
  const eventLeads = Math.max(1, Math.ceil(guestCount / 35))
  const servers = Math.max(1, Math.ceil(guestCount / 30))
  const greeters = guestCount > 50 ? 2 : 1
  const bartenders = data.alcohol !== 'No alcohol' ? Math.max(1, Math.ceil(guestCount / 40)) : 0

  return `Plan a luxury residential event with these exact parameters:

EVENT TYPE: ${data.eventType}
TOTAL BUDGET: ${data.budget} (approx. $${perPersonBudget}/person)
EXPECTED ATTENDANCE: ${data.attendance} (plan space for ${Math.round(guestCount * 0.85)} after typical no-shows)
VENUE SETTING: ${data.venue}
ALCOHOL SERVICE: ${data.alcohol}
RESIDENT DEMOGRAPHIC: ${data.demographic}
SEASON: ${data.season}
PROPERTY MANAGER NOTES: ${data.notes || 'None provided'}

PRE-CALCULATED FIGURES (use these as your baseline, refine as needed):
- Staffing baseline: ${eventLeads} event lead(s), ${servers} server(s)${bartenders > 0 ? `, ${bartenders} bartender(s)` : ''}, ${greeters} greeter(s)
${alcoholCalc ? `- Alcohol baseline: ${alcoholCalc.servingsPerPerson} servings/person, ${alcoholCalc.totalServings} total servings, approx ${alcoholCalc.bottleBreakdown}` : '- No alcohol service'}
${alcoholCalc ? `- Alcohol budget estimate: ${alcoholCalc.costRange} (${data.alcohol === 'Full bar' ? '~35%' : '~22%'} of total budget)` : ''}

Return ONLY a valid JSON object with this exact structure. Every field is required:

{
  "title": "<string>",
  "tagline": "<string>",
  "overview": "<string>",
  "theme": "<string>",
  "timeline": [
    { "time": "<HH:MM AM/PM>", "activity": "<string>", "responsible": "<Staff|Vendor|Property Manager|Catering|Event Lead>" }
  ],
  "catering": ["<string>"],
  "entertainment": ["<string>"],
  "logistics": ["<string>"],
  "budgetBreakdown": ["<string>"],
  "vendorIdeas": [
    {
      "category": "<string>",
      "suggestions": ["<string>", "<string>"],
      "estimatedCost": "<$X,XXX – $X,XXX>"
    }
  ],
  "staffing": [
    { "role": "<string>", "count": "<number>", "notes": "<string>" }
  ],
  "alcoholEstimate": ${data.alcohol === 'No alcohol'
    ? 'null'
    : `{
    "servingsPerPerson": ${alcoholCalc?.servingsPerPerson ?? 3},
    "totalBottles": "Refined estimate based on your calculations",
    "recommendations": ["Specific wine or spirit recommendation with varietal", "Beer style recommendation", "Signature cocktail or mocktail suggestion"],
    "estimatedCost": "${alcoholCalc?.costRange ?? '$0'}"
  }`},
  "setupLogistics": [
    "Specific setup task with timing — e.g. '3:00 PM — Florist arrives, bar build begins'"
  ],
  "residentEmail": {
    "subject": "Compelling subject line that creates genuine excitement",
    "body": "Warm, upscale invitation email. 130-160 words. Specific details about the event, not filler. Mention 1-2 specific things residents will experience. Clear RSVP call to action. Use \\n\\n for paragraph breaks. Sign off from the management team."
  },
  "flyerHeadline": "Bold 5-7 word headline. Evocative and specific — makes residents stop scrolling.",
  "proTip": "One highly specific operational tip that a rookie planner would miss — something that directly prevents a common failure point for this exact event type and demographic."
}

RULES:
- title + flyerHeadline: specific to this event + demographic, never generic
- timeline: 6-8 items, setup through breakdown
- catering: presentation + service style, not just food names
- staffing: match pre-calculated baseline
- budgetBreakdown: must sum to exactly 100%
- alcoholEstimate: use pre-calculated figures as baseline
- residentEmail.body: include event name + 2 specific experiential details
- proTip: operational + specific — never "start planning early" level advice
- vendorIdeas: exactly 4 categories for this event type
- setupLogistics: timed entries only
- All string arrays: minimum 4 items`
}

// ─── Section regeneration prompt ─────────────────────────────────────────────

const SECTION_INSTRUCTIONS: Record<RegenerableSection, string> = {
  catering: `Return ONLY a JSON array of strings. Each string describes one catering item with presentation style — not just the food name. Minimum 4 items, maximum 6.
Example: ["Passed prosciutto crostini with whipped ricotta on slate boards", "Tuna tartare on wonton crisps with sesame drizzle"]`,

  entertainment: `Return ONLY a JSON array of strings. Each string describes one entertainment element with specific detail — genre, vibe, format. Minimum 3 items, maximum 5.
Example: ["Live acoustic jazz duo playing contemporary standards from 7–9 PM", "Polaroid photo station with branded backdrop"]`,

  setup_logistics: `Return ONLY a JSON array of strings. Each string is a specific setup task with a time — e.g. "3:00 PM — Florist arrives, bar build begins". Minimum 5 items, maximum 8. Must cover arrival through doors-open.`,

  timeline: `Return ONLY a JSON array of objects. Each object has exactly three keys: "time" (string, e.g. "7:00 PM"), "activity" (string, detailed description), "responsible" (string, one of: Staff / Vendor / Property Manager / Catering / Event Lead). Minimum 6 items, maximum 8. Must cover setup through close.
Example: [{"time":"6:30 PM","activity":"Staff briefing and final bar check","responsible":"Event Lead"}]`,

  staffing: `Return ONLY a JSON array of objects. Each object has exactly three keys: "role" (string), "count" (number), "notes" (string — what this person does and when). Use the pre-calculated staffing baseline as your starting point.
Example: [{"role":"Event Lead","count":1,"notes":"Oversees timeline, manages vendors, floats to engage residents"}]`,

  vendor_ideas: `Return ONLY a JSON array of exactly 4 objects. Each object has exactly three keys: "category" (string — vendor type), "suggestions" (array of 2 strings — specific vendor style options), "estimatedCost" (string — e.g. "$800 – $1,200").
Example: [{"category":"Catering","suggestions":["Local tapas caterer","Hotel banquet team"],"estimatedCost":"$1,500 – $2,500"}]`,

  resident_email: `Return ONLY a JSON object with exactly two keys: "subject" (string — engaging subject line) and "body" (string — warm, upscale 130-160 word invitation. Mention the specific event name and 2 concrete experiential details. Use \\n\\n for paragraph breaks. End with a sign-off from the management team.).
Example: {"subject":"You're invited: Rooftop Soirée this Saturday","body":"Dear Residents,\\n\\n..."}`,

  flyer_headline: `Return ONLY a JSON string (not an object, not an array — just a quoted string). It must be a bold, evocative 5-7 word flyer headline specific to this event. Makes residents stop scrolling.
Example: "Cocktails Above the City This Saturday"`,

  pro_tip: `Return ONLY a JSON string (not an object, not an array — just a quoted string). It must be one highly specific operational tip that a rookie planner would miss — something that prevents a common failure point for this exact event type and demographic. Never generic.
Example: "Station the greeter with a tray of pre-poured welcome drinks — residents who receive a drink within 30 seconds never feel awkward."`,
}

function buildSectionPrompt(
  section: RegenerableSection,
  ctx: EventContext,
  formData: EventFormData
): string {
  const guestCount = parseAttendanceMidpoint(formData.attendance)
  const budget = parseBudgetMidpoint(formData.budget)
  const perPersonBudget = Math.round(budget / guestCount)
  const alcoholCalc = calcAlcohol(formData.attendance, formData.alcohol, formData.budget)
  const eventLeads = Math.max(1, Math.ceil(guestCount / 35))
  const servers = Math.max(1, Math.ceil(guestCount / 30))
  const greeters = guestCount > 50 ? 2 : 1
  const bartenders = formData.alcohol !== 'No alcohol' ? Math.max(1, Math.ceil(guestCount / 40)) : 0

  return `EXISTING EVENT CONTEXT — do not change any of these details:
Event Name: ${ctx.title}
Event Type: ${ctx.eventType}
Budget: ${ctx.budget} (~$${perPersonBudget}/person)
Attendance: ${ctx.attendance} (expect ~${Math.round(guestCount * 0.85)} after no-shows)
Venue: ${ctx.venue}
Alcohol: ${ctx.alcohol}
Demographic: ${ctx.demographic}
Season: ${ctx.season}

PRE-CALCULATED FIGURES:
- Staffing baseline: ${eventLeads} event lead(s), ${servers} server(s)${bartenders > 0 ? `, ${bartenders} bartender(s)` : ''}, ${greeters} greeter(s)
${alcoholCalc ? `- Alcohol: ${alcoholCalc.servingsPerPerson} servings/person, ~${alcoholCalc.bottleBreakdown}, est. ${alcoholCalc.costRange}` : '- No alcohol service'}

TASK: Regenerate ONLY the "${section}" section for this event. Make it feel fresh and different from what might have been generated before — avoid repetitive phrasing.

${SECTION_INSTRUCTIONS[section]}`
}

// ─── Section regeneration handler ────────────────────────────────────────────

async function handleSectionRegeneration(
  section: RegenerableSection,
  ctx: EventContext,
  formData: EventFormData,
  apiKey: string
): Promise<Response> {
  const userPrompt = buildSectionPrompt(section, ctx, formData)

  try {
    const { rawText } = await callClaude(
      apiKey,
      buildSystemPrompt(),
      userPrompt,
      500   // section calls are small — cap well below full generation
    )

    let parsed: unknown
    try {
      parsed = JSON.parse(rawText)
    } catch {
      // Try to extract JSON from the text
      const objMatch = rawText.match(/\{[\s\S]*\}/)
      const arrMatch = rawText.match(/\[[\s\S]*\]/)
      const strMatch = rawText.match(/"[^"]*"/)

      const match = objMatch ?? arrMatch ?? strMatch
      if (!match) {
        console.error('[section-regen] Non-JSON response:', rawText.slice(0, 200))
        throw new Error('Claude returned non-JSON output for section: ' + section)
      }
      parsed = JSON.parse(match[0])
    }

    return new Response(
      JSON.stringify({ section, value: parsed }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const isOverloaded = message.includes('529') || message.includes('overloaded')
    console.error('[section-regen] Error:', message)

    return new Response(
      JSON.stringify({
        error: isOverloaded
          ? 'Claude is currently overloaded. Please try again.'
          : `Section regeneration failed: ${message}`,
        code: isOverloaded ? 'OVERLOADED' : 'GENERATION_ERROR',
        retryable: isOverloaded,
      }),
      {
        status: isOverloaded ? 529 : 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    )
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED', retryable: false }),
      { status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  let body: GenerateEventRequest
  try {
    body = await req.json() as GenerateEventRequest
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body', code: 'BAD_REQUEST', retryable: false }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  const { formData } = body

  if (!formData?.eventType || !formData?.budget || !formData?.attendance || !formData?.season) {
    return new Response(
      JSON.stringify({
        error: 'Missing required fields: eventType, budget, attendance, season',
        code: 'VALIDATION_ERROR',
        retryable: false,
      }),
      { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'ANTHROPIC_API_KEY secret is not set on the Edge Function',
        code: 'CONFIG_ERROR',
        retryable: false,
      }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  // ── Section regeneration branch ────────────────────────────────────────────
  // Triggered when `section` is present. Validates the section name to prevent
  // prompt injection, then delegates to the lightweight section handler.

  if (body.section !== undefined) {
    if (!VALID_SECTIONS.includes(body.section)) {
      return new Response(
        JSON.stringify({
          error: `Invalid section: "${body.section}". Must be one of: ${VALID_SECTIONS.join(', ')}`,
          code: 'VALIDATION_ERROR',
          retryable: false,
        }),
        { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.eventContext) {
      return new Response(
        JSON.stringify({
          error: 'eventContext is required for section regeneration',
          code: 'VALIDATION_ERROR',
          retryable: false,
        }),
        { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    return handleSectionRegeneration(body.section, body.eventContext, formData, apiKey)
  }

  // ── Full generation (unchanged) ────────────────────────────────────────────

  try {
    const { rawText, model } = await callClaude(
      apiKey,
      buildSystemPrompt(),
      buildUserPrompt(formData),
      3000
    )

    let parsed: unknown
    try {
      parsed = JSON.parse(rawText)
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('Claude returned non-JSON output')
      parsed = JSON.parse(match[0])
    }

    return new Response(
      JSON.stringify({
        plan: parsed,
        generatedAt: new Date().toISOString(),
        model,
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const isOverloaded = message.includes('529') || message.includes('overloaded')
    const isTimeout = message.includes('timeout') || message.includes('503')

    console.error('[generate-event-plan] Error:', message)

    return new Response(
      JSON.stringify({
        error: isOverloaded
          ? 'Claude is currently overloaded. Please try again in a moment.'
          : isTimeout
          ? 'The request timed out. Please try again.'
          : `Generation failed: ${message}`,
        code: isOverloaded ? 'OVERLOADED' : isTimeout ? 'TIMEOUT' : 'GENERATION_ERROR',
        retryable: isOverloaded || isTimeout,
      }),
      {
        status: isOverloaded ? 529 : isTimeout ? 503 : 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    )
  }
})