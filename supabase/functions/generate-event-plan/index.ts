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
 *
 * KEY FIXES vs previous version:
 *   - max_tokens raised from 3000 → 5000 (was cutting off mid-JSON)
 *   - repairJson() applied before every JSON.parse() — closes truncated objects
 *   - System prompt explicitly forbids markdown fences and trailing commas
 *   - Property context (Phase 3) injected into system prompt when provided
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EventFormData {
  eventType:   string
  budget:      string
  attendance:  string
  season:      string
  venue:       string
  alcohol:     string
  demographic: string
  notes:       string
}

type RegenerableSection =
  | 'catering' | 'entertainment' | 'setup_logistics' | 'timeline'
  | 'staffing' | 'vendor_ideas' | 'resident_email' | 'flyer_headline' | 'pro_tip'

const VALID_SECTIONS: RegenerableSection[] = [
  'catering', 'entertainment', 'setup_logistics', 'timeline',
  'staffing', 'vendor_ideas', 'resident_email', 'flyer_headline', 'pro_tip',
]

interface EventContext {
  title:       string
  eventType:   string
  budget:      string
  attendance:  string
  venue:       string
  alcohol:     string
  demographic: string
  season:      string
}

interface GenerateEventRequest {
  formData:        EventFormData
  section?:        RegenerableSection
  eventContext?:   EventContext
  propertyContext?: string   // Phase 3: optional property intelligence block
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── JSON repair ──────────────────────────────────────────────────────────────
// Applied to every Claude response before JSON.parse().
// Handles: markdown fences, trailing commas, truncated/unclosed structures.

function repairJson(raw: string): string {
  let s = raw.trim()

  // Strip markdown code fences
  s = s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  // Remove trailing commas before } or ]
  // Run twice to handle nested cases like ,  ,}
  s = s.replace(/,(\s*[}\]])/g, '$1')
  s = s.replace(/,(\s*[}\]])/g, '$1')

  // If there's no opening brace at all, bail — nothing to repair
  if (!s.startsWith('{') && !s.startsWith('[') && !s.startsWith('"')) return s

  // Walk the string counting unmatched braces/brackets so we can close them
  let braces   = 0
  let brackets = 0
  let inString = false
  let escape   = false

  for (const ch of s) {
    if (escape)               { escape = false; continue }
    if (ch === '\\' && inString) { escape = true;  continue }
    if (ch === '"')           { inString = !inString; continue }
    if (inString)             continue
    if (ch === '{')  braces++
    if (ch === '}')  braces--
    if (ch === '[')  brackets++
    if (ch === ']')  brackets--
  }

  // Close any unclosed string first
  if (inString) s += '"'
  // Close unclosed arrays then objects (order matters)
  while (brackets > 0) { s += ']'; brackets-- }
  while (braces   > 0) { s += '}'; braces--   }

  // One more trailing-comma pass after structural repairs
  s = s.replace(/,(\s*[}\]])/g, '$1')

  return s
}

function parseJsonRobust(raw: string): unknown {
  // Attempt 1: direct parse on cleaned text
  const cleaned = repairJson(raw)
  try {
    return JSON.parse(cleaned)
  } catch { /* fall through */ }

  // Attempt 2: extract outermost { } block and repair
  const objMatch = raw.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try { return JSON.parse(repairJson(objMatch[0])) } catch { /* fall through */ }
  }

  // Attempt 3: extract outermost [ ] block
  const arrMatch = raw.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try { return JSON.parse(repairJson(arrMatch[0])) } catch { /* fall through */ }
  }

  // Attempt 4: extract bare string literal
  const strMatch = raw.match(/"(?:[^"\\]|\\.)*"/)
  if (strMatch) {
    try { return JSON.parse(strMatch[0]) } catch { /* fall through */ }
  }

  throw new Error(`Could not parse Claude response as JSON. First 300 chars: ${raw.slice(0, 300)}`)
}

// ─── Retry ────────────────────────────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 800
): Promise<T> {
  let lastError: Error = new Error('Unknown error')
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      const isRetryable =
        lastError.message.includes('529') ||
        lastError.message.includes('503') ||
        lastError.message.includes('timeout') ||
        lastError.message.includes('overloaded')
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
  const guests          = parseAttendanceMidpoint(attendance)
  const budget          = parseBudgetMidpoint(budgetStr)
  const durationHours   = 2.5
  const servingsPerPerson = Math.round(durationHours * 1.2)
  const totalServings   = Math.round(guests * servingsPerPerson * 1.15)
  const alcoholBudgetRatio = alcoholType === 'Full bar' ? 0.35 : 0.22
  const alcoholBudget   = Math.round(budget * alcoholBudgetRatio)

  let bottleBreakdown: string
  if (alcoholType === 'Full bar') {
    const wine    = Math.ceil((totalServings * 0.40) / 5)
    const beer    = Math.ceil((totalServings * 0.30) / 24)
    const spirits = Math.ceil((totalServings * 0.30) / 16)
    bottleBreakdown = `${wine} bottles wine + ${beer} cases beer + ${spirits} bottles spirits`
  } else {
    const wine = Math.ceil((totalServings * 0.60) / 5)
    const beer = Math.ceil((totalServings * 0.40) / 24)
    bottleBreakdown = `${wine} bottles wine + ${beer} cases beer`
  }

  const costLow  = Math.round(alcoholBudget * 0.85)
  const costHigh = Math.round(alcoholBudget * 1.15)
  return {
    servingsPerPerson,
    totalServings,
    bottleBreakdown,
    costRange: `$${costLow.toLocaleString()} – $${costHigh.toLocaleString()}`,
  }
}

// ─── Claude call ──────────────────────────────────────────────────────────────

async function callClaude(
  apiKey:    string,
  systemText: string,
  userText:  string,
  maxTokens: number
): Promise<{ rawText: string; model: string }> {
  return withRetry(async () => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta':    'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-5',
        max_tokens: maxTokens,
        system: [
          {
            type:          'text',
            text:          systemText,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role:    'user',
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
      model:   string
    }

    const rawText = data.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text ?? '')
      .join('')
      .trim()

    return { rawText, model: data.model }
  }, 3, 800)
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(propertyContext?: string): string {
  const propertyBlock = propertyContext
    ? `\n\n${propertyContext}\n`
    : ''

  return `You are a seasoned luxury residential lifestyle manager with 20+ years running resident programming at Class A multifamily communities in New York, Miami, Los Angeles, Chicago, and Austin.
${propertyBlock}
Your planning philosophy is built on these non-negotiable principles:

RESIDENT FLOW & COMFORT
- Design event spaces and timing so residents never feel crowded or rushed
- Every event should feel intimate regardless of headcount
- Always account for 15–20% no-shows from RSVP count when planning space

STAFFING
- Never understaff — use the pre-calculated baseline as your floor, not ceiling
- Dedicated greeter at the entrance for the first 45 minutes
- 30-minute staff briefing before doors open

ALCOHOL & BEVERAGE
- Always offer a premium non-alcoholic option alongside any bar service
- Last call 30 minutes before event end
- Never run out: surplus is always better than running dry

DEMOGRAPHIC SENSITIVITY
- Young professionals (25–35): networking, Instagram-worthy moments, late start (7PM+), craft beverages
- Families: early timing (4–7PM), kid-friendly activations, casual catering
- Mature residents (50+): daytime or early evening, seated arrangements, quieter music, classic food and wine
- Mixed demographics: tiered programming zones so each group has a natural home

UPSCALE PRESENTATION
- Linens, florals, and lighting are non-negotiable for any event over $2,000
- Signage must be printed, not handwritten
- Staff in uniform or business casual minimum

CRITICAL OUTPUT RULES — NEVER VIOLATE:
- Respond with ONLY a single valid JSON object
- Do NOT wrap in markdown code fences
- Do NOT include backticks, triple backticks, or \`\`\`json
- Do NOT add any text before or after the JSON
- Do NOT use trailing commas — JSON does not allow them
- Every string must be properly closed with a matching quote
- Every array must be closed with ]
- Every object must be closed with }
- The response must be parseable by JSON.parse() with zero modification`
}

// ─── Full generation prompt ───────────────────────────────────────────────────

function buildUserPrompt(data: EventFormData): string {
  const guestCount      = parseAttendanceMidpoint(data.attendance)
  const budget          = parseBudgetMidpoint(data.budget)
  const perPersonBudget = Math.round(budget / guestCount)
  const alcoholCalc     = calcAlcohol(data.attendance, data.alcohol, data.budget)
  const eventLeads      = Math.max(1, Math.ceil(guestCount / 35))
  const servers         = Math.max(1, Math.ceil(guestCount / 30))
  const greeters        = guestCount > 50 ? 2 : 1
  const bartenders      = data.alcohol !== 'No alcohol' ? Math.max(1, Math.ceil(guestCount / 40)) : 0

  return `Plan a luxury residential event with these parameters:

EVENT TYPE: ${data.eventType}
BUDGET: ${data.budget} (~$${perPersonBudget}/person)
ATTENDANCE: ${data.attendance} (plan for ${Math.round(guestCount * 0.85)} after no-shows)
VENUE: ${data.venue}
ALCOHOL: ${data.alcohol}
DEMOGRAPHIC: ${data.demographic}
SEASON: ${data.season}
NOTES: ${data.notes || 'None'}

STAFFING BASELINE: ${eventLeads} event lead(s), ${servers} server(s)${bartenders > 0 ? `, ${bartenders} bartender(s)` : ''}, ${greeters} greeter(s)
${alcoholCalc ? `ALCOHOL BASELINE: ${alcoholCalc.servingsPerPerson} servings/person, ${alcoholCalc.totalServings} total, approx ${alcoholCalc.bottleBreakdown}, est. ${alcoholCalc.costRange}` : 'NO ALCOHOL SERVICE'}

Return a single JSON object — no markdown, no backticks, no trailing commas:

{
  "title": "Specific event name — never generic",
  "tagline": "Evocative one-line descriptor",
  "overview": "2-3 sentence event concept",
  "theme": "Ambiance, aesthetic, and vibe — 2-3 sentences",
  "flyerHeadline": "Bold 5-7 word headline",
  "timeline": [
    {"time": "HH:MM AM/PM", "activity": "Detailed description", "responsible": "Staff|Vendor|Property Manager|Catering|Event Lead"}
  ],
  "catering": ["Item with presentation style — min 4 items"],
  "entertainment": ["Element with specific detail — min 3 items"],
  "logistics": ["Logistic item — min 4 items"],
  "setupLogistics": ["Timed setup task e.g. '3:00 PM — Bar build begins' — min 5 items"],
  "budgetBreakdown": ["Category: amount — min 5 items, must sum to 100%"],
  "vendorIdeas": [
    {"category": "Vendor type", "suggestions": ["Option 1", "Option 2"], "estimatedCost": "$X,XXX – $X,XXX"}
  ],
  "staffing": [
    {"role": "Role name", "count": 1, "notes": "What they do and when"}
  ],
  "alcoholEstimate": ${data.alcohol === 'No alcohol'
    ? 'null'
    : `{"servingsPerPerson": ${alcoholCalc?.servingsPerPerson ?? 3}, "totalBottles": "${alcoholCalc?.bottleBreakdown ?? ''}", "recommendations": ["Wine recommendation", "Beer recommendation", "Cocktail or mocktail"], "estimatedCost": "${alcoholCalc?.costRange ?? ''}"}`
  },
  "residentEmail": {
    "subject": "Subject line that creates genuine excitement",
    "body": "130-160 word warm upscale invitation. Include event name and 2 specific experiential details. Use \\n\\n for paragraph breaks. Sign off from management team."
  },
  "proTip": "One highly specific operational tip a rookie would miss — prevents a common failure for this exact event type"
}

Rules:
- timeline: exactly 6-8 items from setup through breakdown
- vendorIdeas: exactly 4 categories
- All arrays: minimum items as specified above
- staffing count must be a number not a string
- No trailing commas anywhere in the JSON`
}

// ─── Section regeneration ─────────────────────────────────────────────────────

const SECTION_INSTRUCTIONS: Record<RegenerableSection, string> = {
  catering:        `Return ONLY a JSON array of strings. Each string describes one catering item with presentation style. Minimum 4 items. No markdown, no backticks.`,
  entertainment:   `Return ONLY a JSON array of strings. Each string describes one entertainment element with specific detail. Minimum 3 items. No markdown, no backticks.`,
  setup_logistics: `Return ONLY a JSON array of strings. Each string is a timed setup task e.g. "3:00 PM — Florist arrives". Minimum 5 items. No markdown, no backticks.`,
  timeline:        `Return ONLY a JSON array of objects. Each object has exactly: "time" (string), "activity" (string), "responsible" (string). Minimum 6 items. No markdown, no backticks.`,
  staffing:        `Return ONLY a JSON array of objects. Each object has exactly: "role" (string), "count" (number not string), "notes" (string). No markdown, no backticks.`,
  vendor_ideas:    `Return ONLY a JSON array of exactly 4 objects. Each object has: "category" (string), "suggestions" (array of 2 strings), "estimatedCost" (string). No markdown, no backticks.`,
  resident_email:  `Return ONLY a JSON object with exactly: "subject" (string) and "body" (string, 130-160 words, use \\n\\n for paragraph breaks). No markdown, no backticks.`,
  flyer_headline:  `Return ONLY a JSON string — a bold 5-7 word headline. Just the quoted string, nothing else. No markdown, no backticks.`,
  pro_tip:         `Return ONLY a JSON string — one specific operational tip. Just the quoted string, nothing else. No markdown, no backticks.`,
}

function buildSectionPrompt(
  section:  RegenerableSection,
  ctx:      EventContext,
  formData: EventFormData
): string {
  const guestCount      = parseAttendanceMidpoint(formData.attendance)
  const budget          = parseBudgetMidpoint(formData.budget)
  const perPersonBudget = Math.round(budget / guestCount)
  const alcoholCalc     = calcAlcohol(formData.attendance, formData.alcohol, formData.budget)
  const eventLeads      = Math.max(1, Math.ceil(guestCount / 35))
  const servers         = Math.max(1, Math.ceil(guestCount / 30))
  const greeters        = guestCount > 50 ? 2 : 1
  const bartenders      = formData.alcohol !== 'No alcohol' ? Math.max(1, Math.ceil(guestCount / 40)) : 0

  return `EVENT: ${ctx.title} | ${ctx.eventType} | ${ctx.season}
BUDGET: ${ctx.budget} (~$${perPersonBudget}/person) | ATTENDANCE: ${ctx.attendance} (~${Math.round(guestCount * 0.85)} after no-shows)
VENUE: ${ctx.venue} | ALCOHOL: ${ctx.alcohol} | DEMOGRAPHIC: ${ctx.demographic}
STAFFING BASELINE: ${eventLeads} lead(s), ${servers} server(s)${bartenders > 0 ? `, ${bartenders} bartender(s)` : ''}, ${greeters} greeter(s)
${alcoholCalc ? `ALCOHOL: ${alcoholCalc.servingsPerPerson} servings/person, ~${alcoholCalc.bottleBreakdown}, est. ${alcoholCalc.costRange}` : 'NO ALCOHOL'}

Regenerate ONLY the "${section}" section. Make it fresh — avoid repeating what was likely generated before.

${SECTION_INSTRUCTIONS[section]}`
}

async function handleSectionRegeneration(
  section:  RegenerableSection,
  ctx:      EventContext,
  formData: EventFormData,
  apiKey:   string,
  propertyContext?: string
): Promise<Response> {
  try {
    const { rawText } = await callClaude(
      apiKey,
      buildSystemPrompt(propertyContext),
      buildSectionPrompt(section, ctx, formData),
      600   // sections are small — generous headroom above 500
    )

    const parsed = parseJsonRobust(rawText)

    return new Response(
      JSON.stringify({ section, value: parsed }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message     = err instanceof Error ? err.message : String(err)
    const isOverloaded = message.includes('529') || message.includes('overloaded')
    console.error('[section-regen] Error:', message)

    return new Response(
      JSON.stringify({
        error:     isOverloaded ? 'Claude is currently overloaded. Please try again.' : `Section regeneration failed: ${message}`,
        code:      isOverloaded ? 'OVERLOADED' : 'GENERATION_ERROR',
        retryable: isOverloaded,
      }),
      { status: isOverloaded ? 529 : 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
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

  const { formData, propertyContext } = body

  if (!formData?.eventType || !formData?.budget || !formData?.attendance || !formData?.season) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: eventType, budget, attendance, season', code: 'VALIDATION_ERROR', retryable: false }),
      { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY secret is not set', code: 'CONFIG_ERROR', retryable: false }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  // ── Section regeneration ───────────────────────────────────────────────────
  if (body.section !== undefined) {
    if (!VALID_SECTIONS.includes(body.section)) {
      return new Response(
        JSON.stringify({ error: `Invalid section: "${body.section}"`, code: 'VALIDATION_ERROR', retryable: false }),
        { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }
    if (!body.eventContext) {
      return new Response(
        JSON.stringify({ error: 'eventContext is required for section regeneration', code: 'VALIDATION_ERROR', retryable: false }),
        { status: 422, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }
    return handleSectionRegeneration(body.section, body.eventContext, formData, apiKey, propertyContext)
  }

  // ── Full generation ────────────────────────────────────────────────────────
  try {
    const { rawText, model } = await callClaude(
      apiKey,
      buildSystemPrompt(propertyContext),
      buildUserPrompt(formData),
      5000   // raised from 3000 — prevents mid-JSON truncation
    )

    const parsed = parseJsonRobust(rawText)

    return new Response(
      JSON.stringify({ plan: parsed, generatedAt: new Date().toISOString(), model }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message      = err instanceof Error ? err.message : String(err)
    const isOverloaded = message.includes('529') || message.includes('overloaded')
    const isTimeout    = message.includes('timeout') || message.includes('503')

    console.error('[generate-event-plan] Error:', message)

    return new Response(
      JSON.stringify({
        error:     isOverloaded ? 'Claude is currently overloaded. Please try again in a moment.'
                 : isTimeout   ? 'The request timed out. Please try again.'
                 :               `Generation failed: ${message}`,
        code:      isOverloaded ? 'OVERLOADED' : isTimeout ? 'TIMEOUT' : 'GENERATION_ERROR',
        retryable: isOverloaded || isTimeout,
      }),
      { status: isOverloaded ? 529 : isTimeout ? 503 : 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }
})
