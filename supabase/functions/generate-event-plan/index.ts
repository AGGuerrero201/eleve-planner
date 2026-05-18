/**
 * Supabase Edge Function: generate-event-plan
 * Claude Sonnet 4 — Luxury Residential Lifestyle Manager persona
 *
 * Deploy:   supabase functions deploy generate-event-plan --no-verify-jwt
 * Secret:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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

interface GenerateEventRequest {
  formData: EventFormData
}

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

// ─── Attendance parser ────────────────────────────────────────────────────────
// Extracts a midpoint number from strings like "50 – 100 residents"

function parseAttendanceMidpoint(attendance: string): number {
  const nums = attendance.match(/\d+/g)
  if (!nums) return 50
  if (nums.length === 1) return parseInt(nums[0])
  return Math.round((parseInt(nums[0]) + parseInt(nums[1])) / 2)
}

// ─── Budget parser ────────────────────────────────────────────────────────────

function parseBudgetMidpoint(budget: string): number {
  const nums = budget.replace(/,/g, '').match(/\d+/g)
  if (!nums) return 5000
  if (nums.length === 1) return parseInt(nums[0])
  return Math.round((parseInt(nums[0]) + parseInt(nums[1])) / 2)
}

// ─── Alcohol calculator ───────────────────────────────────────────────────────
// Industry standard: 1 drink per person per hour, typical event = 2.5–3 hrs
// Add 15% buffer. Wine: 5 glasses/bottle. Beer: 24 per case.

function calcAlcohol(attendance: string, alcoholType: string, budgetStr: string) {
  if (alcoholType === 'No alcohol') return null

  const guests = parseAttendanceMidpoint(attendance)
  const budget = parseBudgetMidpoint(budgetStr)
  const durationHours = 2.5
  const servingsPerPerson = Math.round(durationHours * 1.2) // ~3
  const totalServings = Math.round(guests * servingsPerPerson * 1.15) // 15% buffer

  // Alcohol budget is typically 30–40% of total for full bar events
  const alcoholBudgetRatio = alcoholType === 'Full bar' ? 0.35 : 0.22
  const alcoholBudget = Math.round(budget * alcoholBudgetRatio)

  let bottleBreakdown = ''
  let wineBottles = 0
  let beerCases = 0
  let spiritBottles = 0

  if (alcoholType === 'Full bar') {
    // Split: 40% wine, 30% beer, 30% spirits
    wineBottles = Math.ceil((totalServings * 0.40) / 5)
    beerCases = Math.ceil((totalServings * 0.30) / 24)
    spiritBottles = Math.ceil((totalServings * 0.30) / 16) // ~16 drinks per 750ml
    bottleBreakdown = `${wineBottles} bottles of wine + ${beerCases} cases of beer + ${spiritBottles} bottles of spirits`
  } else {
    // Wine & beer only — 60/40 split
    wineBottles = Math.ceil((totalServings * 0.60) / 5)
    beerCases = Math.ceil((totalServings * 0.40) / 24)
    bottleBreakdown = `${wineBottles} bottles of wine + ${beerCases} cases of beer`
  }

  const costLow = Math.round(alcoholBudget * 0.85)
  const costHigh = Math.round(alcoholBudget * 1.15)

  return { servingsPerPerson, totalServings, bottleBreakdown, costRange: `$${costLow.toLocaleString()} – $${costHigh.toLocaleString()}` }
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are a seasoned luxury residential lifestyle manager with 20+ years running resident programming at Class A multifamily communities in New York, Miami, Los Angeles, Chicago, and Austin.

Your planning philosophy is built on these non-negotiable principles:

RESIDENT FLOW & COMFORT
- Design event spaces and timing so residents never feel crowded or rushed
- Plan entry staggering and clear circulation paths for all group sizes
- Every event should feel intimate regardless of headcount — use furniture groupings, stations, and zones to break up large spaces
- Always account for 15–20% no-shows from RSVP count when planning space

STAFFING REALISM
- Never understaff. For every 30–40 guests: 1 event lead, 1 server/bartender
- Always include a dedicated greeter at the entrance for the first 45 minutes
- Management staff should float and engage, not work stations
- Build in a 30-minute staff briefing before doors open

ALCOHOL & BEVERAGE INTELLIGENCE  
- Industry standard: 1 drink per person per hour + 15% buffer
- Wine: 5 glasses per bottle. Beer: 24 per case. Spirits: ~16 drinks per 750ml bottle
- Always offer a premium non-alcoholic option — not just water
- Last call should be 30 minutes before event end, not at close
- Never run out: it is better to have 10–15% surplus than to run dry

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

WHAT TO ACTIVELY AVOID
- Generic ideas like "pizza party" or "movie night" for luxury communities
- Events that feel like they belong at an apartment complex, not a residence
- Overcrowding any space — better to cap RSVPs than pack a room
- Running out of food or alcohol
- Poor transitions between event phases that leave residents standing awkwardly
- Events that ignore the season, local culture, or property aesthetic

You always respond with a single valid JSON object and nothing else — no markdown, no backticks, no commentary. Your output must be parseable by JSON.parse().`
}

// ─── User prompt ──────────────────────────────────────────────────────────────

function buildUserPrompt(data: EventFormData): string {
  const guestCount = parseAttendanceMidpoint(data.attendance)
  const budget = parseBudgetMidpoint(data.budget)
  const perPersonBudget = Math.round(budget / guestCount)
  const alcoholCalc = calcAlcohol(data.attendance, data.alcohol, data.budget)

  // Pre-calculate staffing baseline so Claude refines rather than guesses
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
  "title": "Creative 4-7 word event name — luxury, specific, memorable. NOT generic.",
  "tagline": "Evocative 6-8 word tagline that feels aspirational",
  "overview": "3 sentences. Describe the atmosphere, resident experience, and what makes this event feel genuinely elevated — not like a standard apartment event.",
  "theme": "2 sentences. Specific visual aesthetic: color palette, materials, lighting style, table treatments.",
  "timeline": [
    { "time": "5:30 PM", "activity": "Detailed activity description", "responsible": "Who owns this: Staff / Vendor / Property Manager / Catering" }
  ],
  "catering": [
    "Specific dish or station description — include presentation style, not just the food name"
  ],
  "entertainment": [
    "Specific entertainment element with detail — genre, vibe, format"
  ],
  "logistics": [
    "Operational note with specific timing or instruction"
  ],
  "budgetBreakdown": [
    "Category: XX% (~$amount) — brief note on what this covers"
  ],
  "vendorIdeas": [
    {
      "category": "Vendor category name",
      "suggestions": ["Specific vendor type or style suggestion", "Alternative option"],
      "estimatedCost": "$X,XXX – $X,XXX"
    }
  ],
  "staffing": [
    { "role": "Specific role title", "count": 1, "notes": "What this person does and when" }
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

QUALITY RULES — violating any of these is a failure:
- title and flyerHeadline must be specific to this event type and demographic — no generic phrases
- timeline must have 6-8 items and cover setup through breakdown, not just the event itself
- catering must describe presentation and service style, not just list food
- staffing counts must match the pre-calculated baseline (adjust only with good reason)
- budgetBreakdown percentages must sum to exactly 100%
- alcoholEstimate must use the pre-calculated figures as the starting point
- residentEmail.body must mention the specific event name and at least 2 concrete experiential details
- proTip must be operational and specific — never generic advice like "start planning early"
- vendorIdeas must have exactly 4 categories relevant to this specific event type
- setupLogistics must have timed entries, not vague tasks
- All string arrays must have at least 4 items`
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

  try {
    const plan = await withRetry(async () => {
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 3000,
          system: buildSystemPrompt(),
          messages: [{ role: 'user', content: buildUserPrompt(formData) }],
        }),
      })

      if (!anthropicRes.ok) {
        const errBody = await anthropicRes.text()
        throw new Error(`Anthropic ${anthropicRes.status}: ${errBody}`)
      }

      const anthropicData = await anthropicRes.json() as {
        content: Array<{ type: string; text?: string }>
        model: string
      }

      const rawText = anthropicData.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text ?? '')
        .join('')
        .replace(/```json|```/g, '')
        .trim()

      let parsed: unknown
      try {
        parsed = JSON.parse(rawText)
      } catch {
        const match = rawText.match(/\{[\s\S]*\}/)
        if (!match) throw new Error('Claude returned non-JSON output')
        parsed = JSON.parse(match[0])
      }

      return { plan: parsed, model: anthropicData.model }
    }, 3, 800)

    return new Response(
      JSON.stringify({
        plan: plan.plan,
        generatedAt: new Date().toISOString(),
        model: plan.model,
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
