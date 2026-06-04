/**
 * src/lib/templates/index.ts
 *
 * Unified template registry — all 30 Elevé luxury hospitality templates.
 * This file is the single import point for LUXURY_TEMPLATES throughout the app.
 *
 * Import path: '@/lib/templates' resolves here via tsconfig path alias.
 * The LuxuryTemplate type is re-exported for convenience.
 */

import type { EventPlan } from '@/types'

// ─── LuxuryTemplate type ──────────────────────────────────────────────────────
// Defined here so it travels with the data, not separately.

export type { TemplateCategory } from '@/types/templates'

export interface LuxuryTemplate {
  // ── Identity ──────────────────────────────────────────────────────────────
  id:          string
  label:       string
  category:    import('@/types/templates').TemplateCategory
  description: string
  previewTags: string[]

  // ── EventFormData mapping ─────────────────────────────────────────────────
  // Seeds the generation prompt when plan is absent, or provides context when present
  formData: {
    eventType:   string
    budget:      string
    attendance:  string
    season:      string
    venue:       string
    alcohol:     string
    demographic: string
    notes:       string
  }

  // ── Operational metadata ──────────────────────────────────────────────────
  atmosphere:            string
  demographicFit:        string[]
  idealSeasons:          string[]
  budgetTier:            'entry' | 'mid' | 'premium' | 'ultra'
  budgetRange:           string
  attendanceRange:       string
  staffingComplexity:    'low' | 'medium' | 'high'
  operationalDifficulty: 'easy' | 'moderate' | 'complex'
  alcoholIncluded:       boolean
  vendorTypes:           string[]
  recommendedVenue:      string

  // ── Planning notes ────────────────────────────────────────────────────────
  setupNotes:              string[]
  staffingNotes:           string[]
  luxuryNotes:             string[]
  residentExperienceNotes: string[]

  // ── Content seeds ─────────────────────────────────────────────────────────
  flyerHeadline:      string
  residentEmailIntro: string
  suggestedUpgrades:  string[]

  // ── Full plan (optional) ──────────────────────────────────────────────────
  // Present → instant load. Absent → seeds Claude generation.
  plan?: EventPlan
}

// ─────────────────────────────────────────────────────────────────────────────
// WELLNESS TEMPLATES (4)
// ─────────────────────────────────────────────────────────────────────────────

const WELLNESS_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'sound-stillness-session',
    label: 'Sound & Stillness Session',
    category: 'wellness',
    description: 'A guided sound bath and breathwork experience for residents seeking restoration.',
    previewTags: ['Morning', 'Indoor', 'Non-Alcoholic', 'Spring'],
    formData: { eventType: 'Wellness & Yoga Morning', budget: '$1,000 – $2,500', attendance: '20 – 40 residents', season: 'Spring', venue: 'Indoor', alcohol: 'No alcohol', demographic: 'Young professionals (25–35)', notes: 'Sound bath practitioner with crystal bowls. Guided breathwork opening. Yoga mats, eye pillows, lavender-infused towels. Dim lighting essential. Close with herbal tea.' },
    atmosphere: 'Calm, restorative, sensory', demographicFit: ['Young professionals (25–35)', 'Mature residents (50+)'], idealSeasons: ['Spring', 'Fall / Autumn'],
    budgetTier: 'entry', budgetRange: '$1,200 – $2,200', attendanceRange: '15 – 35', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: false,
    vendorTypes: ['Sound bath practitioner', 'Wellness catering (tea, light bites)'], recommendedVenue: 'Amenity lounge, yoga room, or quiet common area',
    setupNotes: ['Darken the room — blackout curtains or dim all overhead lighting', 'Lay mats in a radial pattern around the practitioner', 'Set up crystal bowls, chimes, and props at a small table', 'Provide one rolled blanket and one eye pillow per mat', 'Station wellness refreshments at room perimeter for post-session', 'Post a quiet-entry sign outside the door 15 min before start'],
    staffingNotes: ['1 building team member for check-in and mat setup', '1 sound bath practitioner (external)', 'No additional staff during session — minimize presence'],
    luxuryNotes: ['Lightly mist the space with eucalyptus or lavender before guests arrive', 'Offer chilled cucumber water and hot herbal tea at close', 'Small take-home — a lavender sachet or wellness card — elevates recall'],
    residentExperienceNotes: ['Residents should feel the building curated this specifically for them', 'The silence itself is the amenity — protect it operationally', 'Start and end on time — wellness residents respect schedule precision'],
    flyerHeadline: 'An hour of sound. A week of clarity.', residentEmailIntro: 'We\'re setting aside an hour this season for something different — a guided sound bath and breathwork session designed to help you reset, right here in the building.',
    suggestedUpgrades: ['Add a certified breathwork facilitator as a separate opening segment', 'Partner with a local apothecary for a small take-home wellness kit', 'Offer a post-session one-on-one booking with the practitioner'],
  },
  {
    id: 'rooftop-yoga-at-dawn',
    label: 'Rooftop Yoga at Dawn',
    category: 'wellness',
    description: 'An early morning yoga practice on the rooftop terrace as the city wakes up.',
    previewTags: ['Morning', 'Outdoor', 'Non-Alcoholic', 'Summer'],
    formData: { eventType: 'Wellness & Yoga Morning', budget: '$1,000 – $2,500', attendance: '20 – 40 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'No alcohol', demographic: 'Young professionals (25–35)', notes: 'Sunrise rooftop yoga. All levels. Mats provided. Cold brew, juice, fruit after practice.' },
    atmosphere: 'Energising, grounded, atmospheric', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Spring', 'Summer'],
    budgetTier: 'entry', budgetRange: '$900 – $1,800', attendanceRange: '12 – 30', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: false,
    vendorTypes: ['Yoga instructor', 'Light catering (juice, cold brew, fruit)'], recommendedVenue: 'Rooftop terrace or pool deck',
    setupNotes: ['Confirm rooftop access 48 hours ahead', 'Lay mats facing east or toward the best view', 'Set up refreshment station at rooftop entry', 'Have a backup indoor room confirmed for weather', 'Start setup 45 minutes before session'],
    staffingNotes: ['1 yoga instructor (all-levels certified)', '1 building team member for access management and mat setup'],
    luxuryNotes: ['Cold-pressed juice in glass bottles reads premium', 'A single potted plant at the mat layout entry adds intention', 'The city view at dawn is the hero — don\'t over-decorate'],
    residentExperienceNotes: ['Early start (6:30–7:30 AM) serves working professionals perfectly', 'The rooftop exclusivity creates a "this building is different" feeling', 'Residents will photograph this — the view does the marketing'],
    flyerHeadline: 'Sunrise practice. Rooftop. Yours.', residentEmailIntro: 'This month, we\'re opening the rooftop early — just for you. Join us for an all-levels yoga practice as the city wakes up, followed by cold-pressed juice and coffee.',
    suggestedUpgrades: ['Partner with a local cold brew brand for sponsored refreshments', 'Offer a post-practice 15-minute guided meditation', 'Make it a monthly series — "First Sunday Rooftop Practice"'],
  },
  {
    id: 'early-morning-restore',
    label: 'Early Morning Restore',
    category: 'wellness',
    description: 'A slow-flow movement and guided stretch class designed for stress recovery.',
    previewTags: ['Morning', 'Indoor', 'Non-Alcoholic', 'Fall'],
    formData: { eventType: 'Wellness & Yoga Morning', budget: '$1,000 – $2,500', attendance: '20 – 40 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'No alcohol', demographic: 'Mature residents (50+)', notes: 'Slow-flow restorative movement. Low intensity, all abilities. Blankets and bolsters provided. End with herbal tea.' },
    atmosphere: 'Gentle, therapeutic, warm', demographicFit: ['Mature residents (50+)', 'Mixed demographic'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'entry', budgetRange: '$800 – $1,600', attendanceRange: '10 – 25', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: false,
    vendorTypes: ['Restorative yoga or movement instructor', 'Herbal tea and light catering'], recommendedVenue: 'Amenity lounge or multipurpose room — warm, carpeted preferred',
    setupNotes: ['Extra space between mats — this demographic needs room', 'Bolsters, blocks, and blankets at every mat, not on request', 'Room temperature warm: 72–74°F', 'Soft ambient lighting only', 'Tea station ready before class ends'],
    staffingNotes: ['1 restorative movement instructor experienced with older adults', '1 building team member to assist with mat setup'],
    luxuryNotes: ['Herbal tea in proper mugs, not paper cups', 'Blankets should be soft — cheap fleece signals the wrong tier', 'A handwritten note at each mat is a small premium touch'],
    residentExperienceNotes: ['This demographic responds to being cared for — not challenged', 'The gentleness of the format is the amenity', 'Follow-up with a survey — they notice and appreciate it'],
    flyerHeadline: 'Move gently. Leave restored.', residentEmailIntro: 'We\'re hosting a gentle morning movement class this month — designed for residents who want to move, stretch, and restore without intensity. All levels, all abilities. Blankets provided. Tea to follow.',
    suggestedUpgrades: ['Add a post-class 10-minute guided relaxation with warm eye pillows', 'Partner with a local herbal tea brand for a curated take-home selection', 'Offer a follow-up "Restore Series" across 4 weeks'],
  },
  {
    id: 'private-spa-morning',
    label: 'Private Spa Morning',
    category: 'wellness',
    description: 'A curated morning of wellness treatments brought directly into the building\'s amenity space.',
    previewTags: ['Morning', 'Indoor', 'Non-Alcoholic', 'Winter'],
    formData: { eventType: 'Wellness & Yoga Morning', budget: '$2,500 – $5,000', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'No alcohol', demographic: 'Mixed demographic', notes: 'Mobile spa pop-up. 3–4 treatment stations: massage, facials, hand treatments. Residents book 20-minute slots in advance. Herbal tea and infused water throughout.' },
    atmosphere: 'Therapeutic, indulgent, private', demographicFit: ['Mature residents (50+)', 'Mixed demographic', 'Young professionals (25–35)'], idealSeasons: ['Winter', 'Fall / Autumn'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,500', attendanceRange: '15 – 30', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: false,
    vendorTypes: ['Mobile spa vendor (licensed therapists)', 'Wellness catering (tea, infused water)'], recommendedVenue: 'Amenity lounge or multipurpose room — private, quiet, warm',
    setupNotes: ['Treatment stations partitioned for privacy', 'Appointment booking set up 1 week in advance — 20-minute slots', 'Therapists need 30 min setup before first appointment', 'Dim lighting and calm music from the moment the space opens', 'Confirm all therapists are licensed and insured'],
    staffingNotes: ['3–4 licensed therapists (one per treatment station)', '1 building staff for appointment management', 'Appointment confirmation sent 24 hours before each slot'],
    luxuryNotes: ['Licensed professionals only — non-negotiable', 'The appointment format creates the spa experience', 'A small take-home (sample moisturizer, tea bag) extends the feeling'],
    residentExperienceNotes: ['Spa access in a residential building is a genuine amenity differentiator', 'The appointment format respects residents\' time', 'Appeals strongly to residents who value self-care but lack time'],
    flyerHeadline: 'The spa is coming to you. Book your slot.', residentEmailIntro: 'This month we\'re bringing the spa to the building — massage, facials, and restorative treatments, right here in the amenity space. Appointments are 20 minutes each. Book your slot before they\'re gone.',
    suggestedUpgrades: ['Partner with a premium skincare brand for product use and take-home samples', 'Add a 30-minute guided meditation for residents waiting', 'Make it a quarterly event — "The [Building Name] Spa Morning"'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CULINARY TEMPLATES (6)
// ─────────────────────────────────────────────────────────────────────────────

const CULINARY_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'sommelier-social',
    label: 'Sommelier Social',
    category: 'culinary',
    description: 'A guided wine tasting led by a sommelier, paired with artisan boards and resident conversation.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],
    formData: { eventType: 'Wine & Cheese Evening', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Guided wine tasting with certified sommelier. 4–5 wines across two regions. Artisan cheese boards, charcuterie, seasonal accompaniments. Intimate round-table format.' },
    atmosphere: 'Sophisticated, conversational, unhurried', demographicFit: ['Young professionals (25–35)', 'Mature residents (50+)', 'Mixed demographic'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'mid', budgetRange: '$2,800 – $4,500', attendanceRange: '25 – 55', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Certified sommelier', 'Artisan charcuterie and cheese vendor', 'Wine supplier'], recommendedVenue: 'Private dining room, amenity lounge, or clubroom',
    setupNotes: ['Round or cluster table format — avoid theater rows', 'Stems at every seat before guests arrive', 'Tasting mats or cards at each place with the wine list printed', 'Boards as centerpieces — they work as décor', 'Still and sparkling water at every table'],
    staffingNotes: ['1 certified sommelier to lead', '1 building event staff for check-in', '1 server for board replenishment and water service'],
    luxuryNotes: ['Proper Riedel-style stems — not generic rental stemware', 'Printed tasting cards with wine notes', 'Boards should be generous — a sparse board reads cheap', 'Low candlelight transforms the room for under $20'],
    residentExperienceNotes: ['Residents leave feeling educated, not sold to', 'The conversation between residents is the real product', 'This event photographs beautifully'],
    flyerHeadline: 'Four wines. One evening. A lot to discover.', residentEmailIntro: 'We\'re inviting you to an evening with a certified sommelier — a guided tasting of four wines paired with artisan boards, right here in the building.',
    suggestedUpgrades: ['Add a fifth "mystery" wine revealed at the end', 'Source wines from a single acclaimed region', 'Partner with a local wine shop for a post-event purchase option'],
  },
  {
    id: 'chefs-counter-evening',
    label: 'Chef\'s Counter Evening',
    category: 'culinary',
    description: 'An intimate chef-led tasting dinner where residents gather around the kitchen counter.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],
    formData: { eventType: 'Cooking Class', budget: '$5,000 – $10,000', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mature residents (50+)', notes: 'Intimate chef\'s counter format. Up to 20 residents. 4–5 courses explaining technique and sourcing. Wine pairings included. Formal but relaxed.' },
    atmosphere: 'Intimate, theatrical, educational', demographicFit: ['Mature residents (50+)', 'Young professionals (25–35)'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'premium', budgetRange: '$5,500 – $9,000', attendanceRange: '12 – 22', staffingComplexity: 'high', operationalDifficulty: 'complex', alcoholIncluded: true,
    vendorTypes: ['Private chef (4+ years fine dining)', 'Wine pairing sommelier', 'Event rental (counter setup, linens, stems)'], recommendedVenue: 'Demonstration kitchen, clubroom with counter access',
    setupNotes: ['Counter or U-shaped seating is essential', 'Chef requires 2-hour kitchen setup window', 'Mise en place visible — part of the experience', 'Simple, elegant place settings', 'Confirm all equipment with chef in advance'],
    staffingNotes: ['1 private chef as host and preparer', '1 sommelier for wine pairing', '1 building event staff', 'A dishwasher or kitchen assistant behind the scenes'],
    luxuryNotes: ['The chef\'s narrative is the luxury', 'Printed menus with chef name and course descriptions', 'Between-course timing should breathe', 'One unexpected element per course creates lasting recall'],
    residentExperienceNotes: ['The exclusivity of 20 seats is the amenity — communicate this', 'Residents who attend once will request it annually', 'The format invites conversation naturally'],
    flyerHeadline: 'Twenty seats. One chef. An evening worth reserving.', residentEmailIntro: 'We\'re opening the kitchen this month for a very limited evening — a private chef\'s counter dinner for twenty residents. Four courses, wine pairings, and the kind of conversation that only happens around good food.',
    suggestedUpgrades: ['Feature a guest chef from a recognized local restaurant', 'Add a wine pairing card as a take-home keepsake', 'Offer a "chef\'s table" waiting list to build demand'],
  },
  {
    id: 'garden-harvest-table',
    label: 'Garden Harvest Table',
    category: 'culinary',
    description: 'A seasonal communal dining experience built around local farmers market sourcing.',
    previewTags: ['Evening', 'Indoor & Outdoor', 'Wine & Beer', 'Fall'],
    formData: { eventType: 'Brunch Gathering', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Fall / Autumn', venue: 'Indoor & Outdoor', alcohol: 'Wine & beer only', demographic: 'Mixed demographic', notes: 'Long communal table dinner with seasonal locally sourced produce. Natural linen, simple florals, candles. Wine and craft beer. Chef who can speak to sourcing.' },
    atmosphere: 'Warm, communal, harvest-seasonal', demographicFit: ['Mixed demographic', 'Young professionals (25–35)', 'Mixed ages, family-oriented'], idealSeasons: ['Fall / Autumn', 'Summer'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,500', attendanceRange: '30 – 60', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Farm-to-table caterer or private chef', 'Local wine and craft beer vendor', 'Floral / natural décor vendor'], recommendedVenue: 'Courtyard, terrace, or large amenity space',
    setupNotes: ['Long communal table format — non-negotiable', 'Natural linen runners, not tablecloths', 'Low seasonal floral arrangements', 'Pillar candles or votives down the table', 'Family-style service platters at intervals', 'Source 3+ ingredients from named local farms'],
    staffingNotes: ['1 caterer or chef who can narrate sourcing', '2 servers for 40–60 guests', '1 building staff for coordination'],
    luxuryNotes: ['The sourcing story is the luxury presentation — name the farms', 'Abundance reads premium: generous platters refilled without asking', 'Natural materials only (wood, linen, ceramic, glass)', 'A printed harvest menu card costs under $1 and signals care'],
    residentExperienceNotes: ['Communal seating forces conversation — residents meet neighbors', 'The seasonal tie-in makes it feel timely and intentional', 'Works for a broad demographic range'],
    flyerHeadline: 'One long table. One season. The whole building.', residentEmailIntro: 'This season, we\'re gathering around a long harvest table — a family-style dinner built entirely from locally sourced, seasonal ingredients. Good wine, good company.',
    suggestedUpgrades: ['Partner with a local farm for a named sourcing credit', 'Add a seasonal cocktail on arrival', 'Include a small take-home — seasonal jam or honey from the farm'],
  },
  {
    id: 'reserve-cellar-tasting',
    label: 'Reserve Cellar Tasting',
    category: 'culinary',
    description: 'A focused tasting of allocated and small-production wines with a guided collector\'s narrative.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],
    formData: { eventType: 'Wine & Cheese Evening', budget: '$5,000 – $10,000', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mature residents (50+)', notes: 'High-end wine tasting with allocated or library wines. Master sommelier or wine director. 5–6 wines, formal tasting notes, pairing bites. Seated, 20 residents max.' },
    atmosphere: 'Refined, collector-focused, quiet sophistication', demographicFit: ['Mature residents (50+)', 'Young professionals (25–35)'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'premium', budgetRange: '$5,000 – $8,500', attendanceRange: '12 – 22', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Master sommelier or wine director', 'Specialty wine importer', 'Artisan food pairing caterer'], recommendedVenue: 'Private dining room or intimate clubroom',
    setupNotes: ['Two stems per person minimum', 'Formal tasting notes at each seat before arrival', 'Decant reds 30–60 minutes before service', 'Source wines residents cannot find at retail', 'Room quiet during tasting notes — music stops'],
    staffingNotes: ['1 master sommelier or senior wine professional', '1 trained server for pour service', '1 building staff for coordination'],
    luxuryNotes: ['The wines themselves are the luxury — source genuinely allocated bottles', 'Printed tasting notes designed with care', 'Silence during commentary is a luxury — brief guests on format', 'Proper decanting communicates expertise'],
    residentExperienceNotes: ['Appeals strongly to residents who already know wine', 'The rarity of the bottles is a talking point beyond the evening', 'A "cellar notes" take-home card gives residents something to reference'],
    flyerHeadline: 'Wines you won\'t find. An evening you won\'t forget.', residentEmailIntro: 'We\'ve sourced something special — a private tasting of allocated and small-production wines led by a master sommelier. Six wines, formal tasting notes. Space is limited to twenty residents.',
    suggestedUpgrades: ['Source one truly rare bottle as the evening\'s centerpiece', 'Commission a custom printed tasting booklet', 'Add a blind tasting round for the final wine'],
  },
  {
    id: 'craft-cocktail-brunch',
    label: 'Craft Cocktail Brunch',
    category: 'culinary',
    description: 'A weekend brunch elevated with a craft cocktail bar, a chef\'s spread, and a relaxed social format.',
    previewTags: ['Morning', 'Indoor & Outdoor', 'Full Bar', 'Spring'],
    formData: { eventType: 'Brunch Gathering', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Spring', venue: 'Indoor & Outdoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Weekend brunch. Craft cocktail bar — Bloody Marys, spritzes, mimosas with premium juice. Chef spread: eggs station, smoked salmon, pastries, seasonal fruit. 11 AM – 2 PM.' },
    atmosphere: 'Relaxed, social, weekend-premium', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Spring', 'Summer'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,500', attendanceRange: '30 – 60', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Brunch caterer with live egg station', 'Craft cocktail bartender'], recommendedVenue: 'Amenity space with indoor-outdoor flow',
    setupNotes: ['Live egg station is the anchor — position as visible focal point', 'Craft cocktail bar at entrance — welcome guests with a drink', 'Buffet spread by category: savory, smoked, pastry, fruit', 'Tables for grazing, not assigned dining', 'Run the full 3-hour window'],
    staffingNotes: ['1 craft bartender', '1 chef for live egg station', '1–2 servers for buffet management', '1 building staff for coordination'],
    luxuryNotes: ['Premium juice for mimosas (fresh-pressed, not carton)', 'Smoked salmon signals premium over standard brunch', 'Linen napkins, not paper'],
    residentExperienceNotes: ['Weekend timing serves residents with long weekday hours', 'Social format encourages organic mingling', 'Most likely to become a recurring resident request'],
    flyerHeadline: 'Weekend. Brunch. Craft cocktails. Yours.', residentEmailIntro: 'We\'re doing brunch properly this month — a chef\'s spread, a craft cocktail bar, and a few hours to slow down with your neighbors. No reservations, no assigned seats. Just show up between 11 and 2.',
    suggestedUpgrades: ['Add bottomless mimosas with a 90-minute window', 'Partner with a local bakery for a featured pastry', 'Bring in a jazz duo for a 90-minute live set'],
  },
  {
    id: 'bourbon-and-provisions',
    label: 'Bourbon & Provisions',
    category: 'culinary',
    description: 'An intimate bourbon tasting paired with artisan provisions — charcuterie, aged cheese, and smoked goods.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],
    formData: { eventType: 'Bourbon & Cigar Evening', budget: '$2,500 – $5,000', attendance: '20 – 40 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mature residents (50+)', notes: 'Guided bourbon tasting — 4–5 expressions across mash bills and age statements. Artisan charcuterie, aged cheeses, smoked nuts, dark chocolate. Spirits specialist. Intimate seated format.' },
    atmosphere: 'Warm, unhurried, spirit-forward', demographicFit: ['Mature residents (50+)', 'Young professionals (25–35)'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'mid', budgetRange: '$2,200 – $4,000', attendanceRange: '16 – 30', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: true,
    vendorTypes: ['Spirits specialist or bourbon brand ambassador', 'Artisan charcuterie and cheese vendor'], recommendedVenue: 'Clubroom or lounge — warm lighting, comfortable seating essential',
    setupNotes: ['Glencairn or rocks glasses pre-set — not standard tumblers', 'Tasting pours pre-measured', 'Provisions boards as centerpieces — generous', 'Water and plain crackers for palate cleansing', 'Printed tasting notes at each seat', 'Warm amber lighting only'],
    staffingNotes: ['1 spirits specialist or brand ambassador to lead', '1 building staff for arrivals and provisions management'],
    luxuryNotes: ['Proper Glencairn glasses signal a serious tasting', 'The provisions pairing narrative elevates the specialist\'s role', 'Sourcing one allocated or hard-to-find expression creates a talking point'],
    residentExperienceNotes: ['Appeals to residents who collect or follow American whiskey', 'The provisions pairing creates education that outlasts the evening', 'Intimate headcount ensures genuine conversation'],
    flyerHeadline: 'Four bourbons. Serious provisions. One evening.', residentEmailIntro: 'We\'re gathering this month for a guided bourbon tasting paired with artisan charcuterie, aged cheese, and smoked provisions. A spirits specialist leads. Space limited to thirty residents.',
    suggestedUpgrades: ['Feature one allocated bourbon as a paid-upgrade final pour', 'Add a cigar option if outdoor space is available', 'Partner with a local distillery for a featured expression'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL / ROOFTOP TEMPLATES (5)
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'golden-hour-reception',
    label: 'Golden Hour Reception',
    category: 'social',
    description: 'An elegant rooftop cocktail reception timed to sunset, with passed appetisers and a full bar.',
    previewTags: ['Evening', 'Outdoor', 'Full Bar', 'Summer'],
    formData: { eventType: 'Cocktail Reception', budget: '$5,000 – $10,000', attendance: '50 – 100 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Rooftop reception starting 90 minutes before sunset. Passed canapés. Full craft cocktail bar with 2–3 signature drinks plus wine and beer. Ambient music. Smart casual dress.' },
    atmosphere: 'Celebratory, atmospheric, visually stunning', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Summer', 'Spring'],
    budgetTier: 'premium', budgetRange: '$5,500 – $9,000', attendanceRange: '40 – 90', staffingComplexity: 'high', operationalDifficulty: 'complex', alcoholIncluded: true,
    vendorTypes: ['Craft cocktail bar vendor', 'Passed canapé caterer', 'DJ or ambient music', 'Event rental (furniture, lighting)'], recommendedVenue: 'Rooftop terrace or pool deck with view',
    setupNotes: ['Check sunset time and schedule start 90 minutes before', 'String lighting installed the morning of', 'Bar setup requires 90-minute rooftop load-in', 'Lounge clusters, not rows', 'Weather contingency plan documented'],
    staffingNotes: ['2 bartenders minimum for 60+ guests', '2–3 servers for passed canapés', '1 building event lead', '1 door/check-in staff for first 45 minutes'],
    luxuryNotes: ['Signature cocktail names tied to the building create a sense of place', 'The golden hour itself is the luxury — don\'t let late setup compete with it', 'Ambient music at conversation volume'],
    residentExperienceNotes: ['The view at golden hour is a built-in Instagram moment', 'Residents feel proud of their building at events like this', 'This event converts hesitant residents into building advocates'],
    flyerHeadline: 'The rooftop. The skyline. The moment.', residentEmailIntro: 'We\'re opening the rooftop this month for golden hour — cocktails, canapés, and a view worth seeing. Join your neighbors for an evening that starts at sunset.',
    suggestedUpgrades: ['Create a signature cocktail named after the building', 'Hire a saxophonist or acoustic guitarist for the first hour', 'Commission a local photographer for 2 hours of candid coverage'],
  },
  {
    id: 'terrace-aperitivo-social',
    label: 'Terrace Aperitivo Social',
    category: 'social',
    description: 'A relaxed Italian-style aperitivo hour with spritz cocktails, antipasti, and resident conversation.',
    previewTags: ['Early Evening', 'Outdoor', 'Wine & Beer', 'Spring'],
    formData: { eventType: 'Cocktail Reception', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Spring', venue: 'Indoor & Outdoor', alcohol: 'Wine & beer only', demographic: 'Mixed demographic', notes: 'Italian aperitivo format. Aperol spritz, Campari soda, Prosecco, non-alcoholic option. Antipasti: olives, cured meats, giardiniera, bruschetta. Early evening 5:30–7:30 PM.' },
    atmosphere: 'Relaxed, convivial, European-inspired', demographicFit: ['Mixed demographic', 'Young professionals (25–35)', 'Mature residents (50+)'], idealSeasons: ['Spring', 'Summer'],
    budgetTier: 'mid', budgetRange: '$2,200 – $4,000', attendanceRange: '25 – 55', staffingComplexity: 'medium', operationalDifficulty: 'easy', alcoholIncluded: true,
    vendorTypes: ['Aperitivo bar vendor or caterer', 'Italian antipasti vendor or deli'], recommendedVenue: 'Terrace, courtyard, or outdoor amenity space',
    setupNotes: ['Casual furniture — bistro tables, some lounge pieces', 'Antipasti on large boards or platters', 'Bar staffed, not self-serve', 'Pre-batch spritzes for speed', 'White linens, citrus garnishes'],
    staffingNotes: ['1–2 bartenders', '1 server for antipasti replenishment', '1 building staff for coordination'],
    luxuryNotes: ['Quality Prosecco and properly made spritzes cost marginally more but read better', 'Oranges and grapefruit as garnishes signal effort', 'The European format creates sophistication without formality'],
    residentExperienceNotes: ['Works exceptionally well for mixed demographics', 'Early timing means residents don\'t commit their whole evening', 'Converts residents who "don\'t usually attend events" into regulars'],
    flyerHeadline: 'Aperitivo hour. Your terrace. This month.', residentEmailIntro: 'We\'re keeping it simple this month — spritz cocktails, antipasti, and good company on the terrace. Drop by when you\'re ready and stay as long as you like.',
    suggestedUpgrades: ['Feature a local Italian deli for antipasti sourcing', 'Make it recurring — "First Thursday Aperitivo"', 'Bring in a local gelato vendor for a dessert close'],
  },
  {
    id: 'midnight-cocktail-service',
    label: 'Midnight Cocktail Service',
    category: 'social',
    description: 'A late-night intimate cocktail experience for residents who prefer the quieter hours.',
    previewTags: ['Late Evening', 'Indoor', 'Full Bar', 'Winter'],
    formData: { eventType: 'Cocktail Reception', budget: '$2,500 – $5,000', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Late evening cocktail service 9 PM–midnight. 3–4 signature craft cocktails. Small bites — charcuterie, chocolate, savory pastry. Low lighting, curated playlist. Intimate headcount intentional.' },
    atmosphere: 'Moody, intimate, late-night sophisticated', demographicFit: ['Young professionals (25–35)'], idealSeasons: ['Winter', 'Fall / Autumn'],
    budgetTier: 'mid', budgetRange: '$2,000 – $3,800', attendanceRange: '15 – 35', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Craft cocktail bartender', 'Small bites caterer or deli'], recommendedVenue: 'Clubroom, lounge, or private bar area',
    setupNotes: ['Dim all overheads, use candles and accent lighting only', 'Curated playlist pre-set and tested before guests arrive', 'Bar should look like a proper bar — glassware and tools visible', 'Small bites on slate or wood boards', 'Room set before 8:30 PM'],
    staffingNotes: ['1 skilled craft bartender as the centerpiece', '1 staff for check-in, bites, and coordination'],
    luxuryNotes: ['The cocktail menu should have names — not "Signature Drink 1"', 'A printed cocktail card signals everything', 'Darkness and quiet are the luxury — protect both'],
    residentExperienceNotes: ['Late-night formats serve a resident segment daytime events miss', 'The intimacy creates a members-club feeling', 'Generates word-of-mouth from residents who tell friends about their building'],
    flyerHeadline: 'After hours. Your building. An evening worth staying up for.', residentEmailIntro: 'We\'re doing something a little different this month — a late-night cocktail service in the lounge, starting at 9. A craft bartender, four signature drinks, and a room that actually feels like somewhere. RSVP required.',
    suggestedUpgrades: ['Commission building-named cocktails from the bartender', 'Add a vinyl record player with curated selection', 'Partner with a local chocolatier for pairings'],
  },
  {
    id: 'rooftop-cinema-evening',
    label: 'Rooftop Cinema Evening',
    category: 'social',
    description: 'A curated film screening on the rooftop with craft cocktails and premium concessions.',
    previewTags: ['Evening', 'Outdoor', 'Full Bar', 'Summer'],
    formData: { eventType: 'Movie Night', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Rooftop film screening for adults. Craft cocktail bar. Curated film. Premium concessions: flavored popcorn, charcuterie boxes, sparkling water. Lounge seating. Start at dusk.' },
    atmosphere: 'Cinematic, social, rooftop-premium', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Summer', 'Spring'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,500', attendanceRange: '25 – 55', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Outdoor cinema rental', 'Craft cocktail bartender', 'Premium concessions caterer'], recommendedVenue: 'Rooftop terrace or elevated outdoor space',
    setupNotes: ['Screen orientation for minimal light interference at dusk', 'Cocktail bar away from screen so service doesn\'t interrupt', 'Lounge seating clusters — not rows', 'Blankets one per seat, soft quality', 'Concession boxes pre-packed and distributed at arrival'],
    staffingNotes: ['1 AV technician for projection and sound', '1 craft bartender (bar closes at film start)', '1 building staff for setup and arrivals'],
    luxuryNotes: ['Film curation signals that someone considered the audience', 'Pre-packed concession boxes eliminate service noise during film', 'Lounge seating with blankets creates boutique hotel feeling'],
    residentExperienceNotes: ['The rooftop setting makes this feel like a private screening', 'Film selection by resident poll creates engagement before the event', 'Social clusters in seating mean conversation before the film'],
    flyerHeadline: 'Rooftop. Film. Craft cocktails. Dusk.', residentEmailIntro: 'We\'re screening a film on the rooftop this month — craft cocktails before the film, premium concessions, and the city behind the screen. Lounge seating, blankets provided. Show up at dusk.',
    suggestedUpgrades: ['Partner with a local cinema for curation credibility', 'Create a signature cocktail themed to the film', 'Offer a post-film discussion for residents who want to linger'],
  },
  {
    id: 'the-rooftop-residency',
    label: 'The Rooftop Residency',
    category: 'social',
    description: 'A recurring rooftop social series — the building\'s signature warm-season gathering.',
    previewTags: ['Evening', 'Outdoor', 'Full Bar', 'Summer'],
    formData: { eventType: 'Rooftop Social', budget: '$2,500 – $5,000', attendance: '50 – 100 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Monthly rooftop social during warm months. Consistent format: craft bar, rotating food concept, ambient music. The "Residency" name signals a series, not a one-off.' },
    atmosphere: 'Signature, recurring, building-identity', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Spring', 'Summer'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,500', attendanceRange: '40 – 80', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Craft cocktail bartender', 'Rotating food vendor', 'Ambient music (DJ or live)'], recommendedVenue: 'Rooftop terrace — same space every edition',
    setupNotes: ['Consistent setup every edition — same layout, same bar position', 'Rotate food concept each edition', 'Edition number or theme printed on a card at the bar', 'Music arc: ambient on arrival, builds to social level by 8 PM'],
    staffingNotes: ['2 bartenders for consistent quality', '1–2 food vendor staff', '1 building event lead — same person each edition'],
    luxuryNotes: ['The series format is itself the luxury signal', 'Edition numbering creates collector psychology', 'A consistent signature cocktail becomes a building trademark'],
    residentExperienceNotes: ['Recurring events build community more than one-off events', 'Residents who miss an edition feel FOMO — the correct response to engineer', 'The "Residency" positioning makes this feel like a cultural institution'],
    flyerHeadline: 'The Rooftop Residency. Edition [N]. This Month.', residentEmailIntro: 'The Rooftop Residency is back for Edition [N] — this time featuring [food concept] and [music]. Same rooftop, same craft bar, something different every time. See you up there.',
    suggestedUpgrades: ['Create a printed "Residency Passport" card for each edition', 'Feature a different local food vendor each edition', 'At Edition 6 or 12, host a "Residency Anniversary" with elevated production'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// NETWORKING TEMPLATES (3)
// ─────────────────────────────────────────────────────────────────────────────

const NETWORKING_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'the-founders-collective',
    label: 'The Founders Collective',
    category: 'networking',
    description: 'A structured professional social for resident entrepreneurs, founders, and executives.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],
    formData: { eventType: 'Networking Mixer', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Professional networking for founders and executives. Structured conversation activations. Featured resident "60-second intro" format. Craft cocktails and elevated small bites. Curated, not mass-invite.' },
    atmosphere: 'Professional, energised, purposeful', demographicFit: ['Young professionals (25–35)', 'Mature residents (50+)'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,200', attendanceRange: '25 – 50', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Craft cocktail bartender', 'Elevated small bites caterer'], recommendedVenue: 'Clubroom, private lounge, or amenity space with standing room',
    setupNotes: ['Standing format with high-top tables', 'Slightly under-furnished so people circulate', 'Conversation starter card at each high-top', 'Name tags are acceptable in professional context', 'Bar open from arrival; small bites at 30 and 60 minutes'],
    staffingNotes: ['1 skilled bartender', '1–2 servers for passed small bites', '1 building staff as active host and MC', 'Host role matters — someone must actively facilitate'],
    luxuryNotes: ['The curation of who\'s in the room is the luxury — communicate selective invite', 'Conversation-starter cards prevent awkward silences', 'Quality cocktails signal this isn\'t a generic happy hour'],
    residentExperienceNotes: ['Residents leave with at least one meaningful connection', 'The "60-second intro" gives everyone a structured moment', 'Positions the building as a community of accomplished people'],
    flyerHeadline: 'The building\'s founders, in one room.', residentEmailIntro: 'We\'re bringing together the entrepreneurs, executives, and founders in the building for an evening of real conversation. Craft cocktails, elevated bites, and a format designed to actually make introductions happen.',
    suggestedUpgrades: ['Feature one resident as a 5-minute spotlight speaker', 'Create a private building Slack or LinkedIn group as follow-up', 'Bring in a professional photographer for headshots during the first 30 minutes'],
  },
  {
    id: 'industry-salon',
    label: 'Industry Salon',
    category: 'networking',
    description: 'A themed professional conversation evening built around a single industry or topic.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Winter'],
    formData: { eventType: 'Networking Mixer', budget: '$1,000 – $2,500', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Wine & beer only', demographic: 'Young professionals (25–35)', notes: 'Salon-style conversation evening. One featured resident or external speaker for 15 minutes, then open discussion. Wine and beer, light snacks. Intimate headcount by design.' },
    atmosphere: 'Intellectual, intimate, conversational', demographicFit: ['Young professionals (25–35)', 'Mature residents (50+)'], idealSeasons: ['Winter', 'Fall / Autumn'],
    budgetTier: 'entry', budgetRange: '$900 – $2,000', attendanceRange: '15 – 35', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: true,
    vendorTypes: ['Wine and beer vendor', 'Light snacks caterer or deli'], recommendedVenue: 'Intimate lounge or library room',
    setupNotes: ['Semicircle or living-room seating — not classroom rows', 'Small speaker setup for featured guest', 'Wine and beer self-serve station', 'Max 35 people — the salon format breaks above this', 'Pre-circulate the topic and speaker name in the invite'],
    staffingNotes: ['1 building staff as host and conversation facilitator', 'The featured speaker should be briefed on the 15-minute format'],
    luxuryNotes: ['The quality of the speaker and topic is the entire value proposition', 'A printed "evening agenda" card signals intentionality on a small budget', 'Good wine at a self-serve station reads better than bad wine from a bartender'],
    residentExperienceNotes: ['Residents leave having learned something — rarest outcome of a building event', 'The intellectual format attracts residents who skip social events', 'A follow-up email with "three things we discussed" extends the experience'],
    flyerHeadline: 'One topic. One evening. Actual conversation.', residentEmailIntro: 'This month we\'re hosting an Industry Salon — an intimate evening built around [topic]. One featured voice, open discussion, and a room full of residents who actually have something to say.',
    suggestedUpgrades: ['Record the speaker segment and share with absent residents', 'Create a themed reading list to accompany the topic', 'Make it a quarterly series with rotating topics'],
  },
  {
    id: 'open-exchange-forum',
    label: 'Open Exchange Forum',
    category: 'networking',
    description: 'An unstructured professional social where the building itself is the shared context.',
    previewTags: ['Early Evening', 'Indoor', 'Wine & Beer', 'Spring'],
    formData: { eventType: 'Networking Mixer', budget: '$1,000 – $2,500', attendance: '30 – 60 residents', season: 'Spring', venue: 'Indoor', alcohol: 'Wine & beer only', demographic: 'Mixed demographic', notes: 'Low-structure professional social for all resident professionals. No speaker, no agenda. Good wine, light food. Early evening for busy schedules.' },
    atmosphere: 'Relaxed, open, community-professional', demographicFit: ['Young professionals (25–35)', 'Mixed demographic', 'Mature residents (50+)'], idealSeasons: ['Spring', 'Fall / Autumn'],
    budgetTier: 'entry', budgetRange: '$1,000 – $2,000', attendanceRange: '25 – 55', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: true,
    vendorTypes: ['Wine and beer vendor', 'Light bites caterer'], recommendedVenue: 'Lobby lounge, clubroom, or open amenity space',
    setupNotes: ['Keep setup minimal and approachable', 'Wine and beer station with proper glassware', 'Light bites throughout the space', 'No podium, no microphone, no structured agenda', 'Early timing (5:30–7:30 PM) removes friction'],
    staffingNotes: ['1 building staff member as active host — this role makes or breaks the event', '1 staff for bites replenishment'],
    luxuryNotes: ['The host\'s active introduction-making is the luxury at this budget tier', 'Good glassware at self-serve elevates the format', 'A "who\'s in the room" card listing resident professional categories adds intrigue'],
    residentExperienceNotes: ['Early timing and low-pressure format converts non-attendees into first-timers', 'Residents who meet one useful contact will attend every future edition'],
    flyerHeadline: 'Good wine. Interesting neighbors. Early enough to still have dinner.', residentEmailIntro: 'No agenda, no speaker, no structured anything — just an easy evening with the professionals who happen to live in this building. Drop by after work, stay as long as you like.',
    suggestedUpgrades: ['Add a simple "resident directory" card listing names and industries', 'Partner with a local wine shop for curated selections', 'Make it a recurring quarterly touchpoint'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOP TEMPLATES (3)
// ─────────────────────────────────────────────────────────────────────────────

const WORKSHOP_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'modern-needle-atelier',
    label: 'Modern Needle Atelier',
    category: 'workshop',
    description: 'A guided embroidery and needlework session with modern patterns and a social atmosphere.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Winter'],
    formData: { eventType: 'Cooking Class', budget: '$1,000 – $2,500', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Wine & beer only', demographic: 'Young professionals (25–35)', notes: 'Guided embroidery workshop. Contemporary geometric patterns. Instructor leads two skill levels simultaneously. All materials provided. Wine and light snacks. Residents take work home.' },
    atmosphere: 'Creative, focused, social', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'entry', budgetRange: '$1,000 – $2,200', attendanceRange: '12 – 25', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: true,
    vendorTypes: ['Textile/embroidery instructor', 'Wine and beer vendor'], recommendedVenue: 'Amenity lounge or common area with flat table space',
    setupNotes: ['Each seat needs a flat work surface — tables not lounge seating', 'Pre-stage all materials: hoop, needle, thread selection, pattern card, scissors', 'Wine and snacks at a side station — not on work surfaces', 'Good overhead lighting essential'],
    staffingNotes: ['1 textile instructor with contemporary teaching style', '1 building staff to manage arrivals and assist instructor'],
    luxuryNotes: ['Modern geometric patterns specifically — not vintage florals', 'Quality thread in a curated color palette signals curation', 'A printed pattern card with the Elevé brand mark makes the take-home feel designed'],
    residentExperienceNotes: ['Residents leave with something handmade — the take-home extends the experience', 'The focused activity removes social pressure', 'This format photographs beautifully'],
    flyerHeadline: 'Something made by hand. Something worth keeping.', residentEmailIntro: 'We\'re hosting an embroidery evening this month — a guided session with a textile artist, modern patterns, and wine throughout. No experience needed. You\'ll take your work home when you leave.',
    suggestedUpgrades: ['Commission a custom Elevé-themed pattern', 'Partner with a local textile studio', 'Create a follow-up session for residents to finish or advance their work'],
  },
  {
    id: 'cocktail-craft-session',
    label: 'Cocktail Craft Session',
    category: 'workshop',
    description: 'A hands-on cocktail making class led by a craft bartender — technique, not just tasting.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Spring'],
    formData: { eventType: 'Cooking Class', budget: '$2,500 – $5,000', attendance: '20 – 40 residents', season: 'Spring', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Cocktail making workshop. Each resident makes 2 drinks using proper technique. Focus on 2–3 classic cocktails and one seasonal variation. All spirits, mixers, tools provided. Educational and fun.' },
    atmosphere: 'Active, social, skill-building', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Spring', 'Summer'],
    budgetTier: 'mid', budgetRange: '$2,200 – $4,000', attendanceRange: '16 – 30', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Craft bartender or mixologist', 'Spirits and mixer vendor'], recommendedVenue: 'Kitchen amenity, bar area, or open space with counter access',
    setupNotes: ['Each resident needs a dedicated station: shaker, strainer, jigger, mixing glass, garnish', 'Spirits pre-measured — this is a teaching session', 'Bartender needs 60 minutes of setup', 'Ice station must be sufficient', 'A demo counter visible to all for instruction segments'],
    staffingNotes: ['1 craft bartender as lead instructor — personality matters', '1 assistant to manage ice and cleanup between rounds', '1 building staff for check-in', 'Cap at 30 — above this the instructor loses the room'],
    luxuryNotes: ['Quality spirits (mid-shelf minimum)', 'Proper bar tools at each station', 'A printed take-home recipe card is the keepsake'],
    residentExperienceNotes: ['Residents leave knowing how to make a cocktail properly — lasting value', 'The hands-on format creates natural conversation', 'High repeat-request rates'],
    flyerHeadline: 'Learn to make it. Then drink it.', residentEmailIntro: 'We\'re bringing in a craft bartender this month for a proper cocktail making session — not just tasting, actually making. You\'ll learn the technique behind two classic cocktails and one seasonal variation.',
    suggestedUpgrades: ['Feature a spirit from a local distillery', 'Add a blind taste test to crown a "best cocktail"', 'Create a building cocktail recipe booklet after 3–4 sessions'],
  },
  {
    id: 'ceramic-studio-evening',
    label: 'Ceramic Studio Evening',
    category: 'workshop',
    description: 'A hand-building ceramics session where residents create a small piece to take home after firing.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Fall'],
    formData: { eventType: 'Cooking Class', budget: '$2,500 – $5,000', attendance: '20 – 40 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'Wine & beer only', demographic: 'Mixed demographic', notes: 'Hand-building ceramics workshop. No wheel. Each resident creates one small piece. Instructor fires pieces after session and returns within 2 weeks. Wine throughout.' },
    atmosphere: 'Creative, tactile, unhurried', demographicFit: ['Young professionals (25–35)', 'Mixed demographic', 'Mature residents (50+)'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'mid', budgetRange: '$2,000 – $3,800', attendanceRange: '12 – 24', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Ceramics instructor with kiln access', 'Wine and beer vendor'], recommendedVenue: 'Amenity room or common space — must allow for clay and table mess',
    setupNotes: ['Cover all tables with canvas drop cloths — clay is permanent on fabric', 'Each station: clay, bowl of water, wooden tools, sponge', 'Instructor needs 45 minutes of setup', 'Wine station separate from work area', 'Label each piece with resident name before firing'],
    staffingNotes: ['1 ceramics instructor experienced with group hand-building', '1 building staff for check-in and wine service', 'Instructor should circulate continuously'],
    luxuryNotes: ['The 2-week return of fired pieces extends the experience', 'A card with the piece — "Made at [Building Name], [Date]" — is a premium touch', 'The tactile nature creates a meditative quality residents respond to'],
    residentExperienceNotes: ['The take-home is the marketing — residents display pieces and tell the story', 'The 2-week return creates a second touchpoint', 'Cross-demographic appeal: works for 25-year-olds and 65-year-olds equally'],
    flyerHeadline: 'Make something with your hands. Pick it up in two weeks.', residentEmailIntro: 'We\'re setting up a ceramics studio in the building this month. A hand-building session led by a ceramics artist — you\'ll create a small piece, we\'ll have it fired, and you\'ll pick it up two weeks later. Wine throughout.',
    suggestedUpgrades: ['Partner with a local ceramics studio for instructor and kiln', 'Offer a glaze selection at a follow-up pickup event', 'Make it an annual event tied to a specific season'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY TEMPLATES (2)
// ─────────────────────────────────────────────────────────────────────────────

const FAMILY_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'garden-cinema-evening',
    label: 'Garden Cinema Evening',
    category: 'family',
    description: 'An outdoor film screening with premium concessions and a relaxed lawn setup.',
    previewTags: ['Evening', 'Outdoor', 'No Alcohol', 'Summer'],
    formData: { eventType: 'Movie Night', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'No alcohol', demographic: 'Mixed ages, family-oriented', notes: 'Outdoor cinema on the lawn. Premium concessions — not just popcorn. Blankets and lawn chairs provided. Film selected by resident poll. Start at dusk. Non-alcoholic only.' },
    atmosphere: 'Warm, communal, all-ages relaxed', demographicFit: ['Mixed ages, family-oriented', 'Mixed demographic'], idealSeasons: ['Summer', 'Spring'],
    budgetTier: 'mid', budgetRange: '$2,000 – $4,000', attendanceRange: '30 – 70', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: false,
    vendorTypes: ['Outdoor cinema rental (screen, projector, sound)', 'Premium concessions caterer'], recommendedVenue: 'Courtyard, lawn, pool deck, or flat outdoor space',
    setupNotes: ['Screen and projector setup requires 3+ hours', 'Seating zones: blanket area closest to screen, chairs further back', 'Concession: flavored popcorn, lemonade, sparkling water, chocolate', 'Start at dusk — 8:30–9 PM in summer', 'Test audio levels before residents arrive'],
    staffingNotes: ['1 AV vendor to manage projection and sound', '1–2 building staff for setup and concessions'],
    luxuryNotes: ['Premium concessions differentiate this from a generic movie night', 'Soft blankets available for lending', 'A printed film program card is a charming inexpensive touch'],
    residentExperienceNotes: ['The resident poll creates buy-in before the event', 'Families with children will remember this as a building highlight', 'The informal atmosphere brings out residents who never attend formal events'],
    flyerHeadline: 'Film under the sky. You pick the movie.', residentEmailIntro: 'We\'re setting up an outdoor cinema this month — a proper screen, premium concessions, and blankets on the lawn. Vote for the film below, then show up at dusk and settle in. All ages welcome.',
    suggestedUpgrades: ['Add a pre-film DJ set for the 30-minute arrival window', 'Partner with a local ice cream truck for a dessert close', 'Make it an annual summer series'],
  },
  {
    id: 'poolside-family-social',
    label: 'Poolside Family Social',
    category: 'family',
    description: 'A daytime poolside gathering with family-friendly activities, food, and music.',
    previewTags: ['Daytime', 'Outdoor', 'No Alcohol', 'Summer'],
    formData: { eventType: 'Pool Party', budget: '$2,500 – $5,000', attendance: '50 – 100 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'No alcohol', demographic: 'Mixed ages, family-oriented', notes: 'All-ages poolside social. Lawn games, casual food spread (tacos, sliders), premium non-alcoholic drinks. Music at ambient level. Lifeguard required if pool in active use.' },
    atmosphere: 'Festive, casual, summer energy', demographicFit: ['Mixed ages, family-oriented', 'Mixed demographic'], idealSeasons: ['Summer'],
    budgetTier: 'mid', budgetRange: '$2,500 – $4,500', attendanceRange: '40 – 80', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: false,
    vendorTypes: ['Food caterer (taco or slider bar)', 'Non-alcoholic beverage vendor', 'Certified lifeguard (if pool in use)'], recommendedVenue: 'Pool deck and surrounding lawn or patio',
    setupNotes: ['Confirm lifeguard certification before any pool use', 'Food station 15-foot minimum from pool edge', 'Lawn games on grass or hardscape areas', 'Shade structures essential for daytime summer event', 'Coolers with cold water throughout'],
    staffingNotes: ['1 certified lifeguard if pool in active use (non-negotiable)', '2 caterer staff for food service', '1–2 building staff for setup and guest relations'],
    luxuryNotes: ['Agua fresca and premium lemonade in glass dispensers', 'Real food (tacos, sliders) over cheap hot dogs', 'Shade and comfortable seating for non-swimming adults is always underestimated'],
    residentExperienceNotes: ['Family residents have the highest loyalty when buildings show care for their children', 'This event introduces neighbors with children to each other', 'Summer timing reminds people why they\'re glad to be home'],
    flyerHeadline: 'The pool is open. Bring everyone.', residentEmailIntro: 'We\'re hosting a poolside social this month — food, lawn games, and a proper summer afternoon for the whole building. All ages welcome.',
    suggestedUpgrades: ['Bring in a local taco or food truck vendor', 'Add a poolside DJ for a 2-hour midday set', 'Add a kids\' craft table run by an activity coordinator'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEASONAL TEMPLATES (4)
// ─────────────────────────────────────────────────────────────────────────────

const SEASONAL_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'grand-pool-opening',
    label: 'Grand Pool Opening',
    category: 'seasonal',
    description: 'The season\'s first rooftop pool activation — a proper debut with cocktails and music.',
    previewTags: ['Afternoon', 'Outdoor', 'Full Bar', 'Summer'],
    formData: { eventType: 'Pool Party', budget: '$5,000 – $10,000', attendance: '50 – 100 residents', season: 'Summer', venue: 'Indoor & Outdoor', alcohol: 'Full bar', demographic: 'Young professionals (25–35)', notes: 'Season opening event for the rooftop pool. Cocktail bar, DJ at ambient-to-social level, premium poolside catering. Resort casual. Champagne or sparkling wine toast at opening.' },
    atmosphere: 'Celebratory, resort-feeling, aspirational', demographicFit: ['Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Summer'],
    budgetTier: 'premium', budgetRange: '$5,500 – $9,000', attendanceRange: '50 – 90', staffingComplexity: 'high', operationalDifficulty: 'complex', alcoholIncluded: true,
    vendorTypes: ['Cocktail bar vendor', 'Poolside catering', 'DJ or music vendor', 'Event rental', 'Certified lifeguard'], recommendedVenue: 'Rooftop pool deck — full space activation',
    setupNotes: ['Lifeguard is non-negotiable', 'Bar setup requires rooftop load-in — confirm elevator access timing', 'Lounge chairs in clusters, not hotel rows', 'Opening toast at the start — pre-poured and distributed', 'DJ briefed on ambient-to-social volume arc'],
    staffingNotes: ['2 bartenders minimum for 60+ guests', '2 servers for passed bites', '1 certified lifeguard', '1 building event lead', '1 DJ'],
    luxuryNotes: ['The opening toast is a signature moment — don\'t skip it', 'Poolside furniture quality matters', 'Signature summer cocktail with a building-specific name'],
    residentExperienceNotes: ['Residents anticipate this event from winter — it\'s a calendar anchor', 'The debut framing makes it an occasion, not just a party', 'High Instagram moment: rooftop, pool, skyline, golden light'],
    flyerHeadline: 'The pool is officially open. Summer starts now.', residentEmailIntro: 'It\'s time. The rooftop pool is opening for the season and we\'re doing it properly — cocktails, music, and a champagne toast to mark the moment. Resort casual. All residents welcome.',
    suggestedUpgrades: ['Commission a signature summer cocktail named after the building', 'Hire a photographer for 2 hours', 'Add a frozen cocktail or frozen rosé station'],
  },
  {
    id: 'grand-winter-salon',
    label: 'Grand Winter Salon',
    category: 'seasonal',
    description: 'The building\'s signature end-of-year gathering — elegant, warm, and genuinely worth attending.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],
    formData: { eventType: 'Holiday Party', budget: '$10,000 – $25,000', attendance: '75 – 150 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mixed demographic', notes: 'Annual winter celebration. Elegant but not formal. Champagne on arrival. Passed canapés and proper food station. Live acoustic music or jazz. Rich seasonal decor. This is the event residents talk about in January.' },
    atmosphere: 'Warm, celebratory, sophisticated seasonal', demographicFit: ['Mixed demographic', 'Young professionals (25–35)', 'Mature residents (50+)', 'Mixed ages, family-oriented'], idealSeasons: ['Winter'],
    budgetTier: 'ultra', budgetRange: '$10,000 – $20,000', attendanceRange: '75 – 150', staffingComplexity: 'high', operationalDifficulty: 'complex', alcoholIncluded: true,
    vendorTypes: ['Full bar vendor with champagne service', 'Catering (passed canapés + food station)', 'Live music (jazz duo or acoustic trio)', 'Event décor and florals vendor', 'Event rental'], recommendedVenue: 'Full amenity floor, lobby, or largest common space',
    setupNotes: ['Full vendor load-in requires a half-day window', 'Champagne poured on trays for arrival', 'Real greenery, candlelight — no tinsel or cartoon Santas', 'Food station separate from bar to distribute guest flow', 'Live music positioned for atmosphere, not blocking conversation'],
    staffingNotes: ['3+ bartenders for 100+ guests', '3–4 servers for passed canapés', '1 coat check attendant', '1 building event director', 'Live music: jazz duo, acoustic trio, or string quartet'],
    luxuryNotes: ['Champagne on arrival sets the tone immediately — non-negotiable at this tier', 'Real floral and greenery décor: eucalyptus, magnolia, amaryllis, candlelight', 'Live jazz elevates every conversation happening around it'],
    residentExperienceNotes: ['This is the event that justifies the decision to live in this building', 'Residents who attend become the strongest advocates for the community', 'The annual nature creates anticipation — it becomes part of the building\'s identity'],
    flyerHeadline: 'The evening this building has been building toward all year.', residentEmailIntro: 'Every year we close the season with something worth dressing for. This year, we\'re opening the space for an evening of champagne, live music, and the company of everyone who makes this building what it is.',
    suggestedUpgrades: ['Commission a custom holiday cocktail named for the building', 'Hire a professional photographer for full-event coverage', 'Partner with a luxury local brand for a resident gift bag'],
  },
  {
    id: 'harvest-supper-series',
    label: 'Harvest Supper Series',
    category: 'seasonal',
    description: 'A multi-course autumn supper built around peak-season local ingredients and communal dining.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Fall'],
    formData: { eventType: 'Brunch Gathering', budget: '$5,000 – $10,000', attendance: '30 – 60 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'Wine & beer only', demographic: 'Mixed demographic', notes: 'Autumn harvest supper. Multi-course seated dinner with peak fall ingredients from named local farms. Natural wine and craft cider. Long communal table. Chef introduces each course. Warm, candlelit, unhurried.' },
    atmosphere: 'Harvest-warm, unhurried, ingredient-focused', demographicFit: ['Mixed demographic', 'Mature residents (50+)', 'Young professionals (25–35)'], idealSeasons: ['Fall / Autumn'],
    budgetTier: 'premium', budgetRange: '$5,000 – $8,500', attendanceRange: '30 – 55', staffingComplexity: 'high', operationalDifficulty: 'complex', alcoholIncluded: true,
    vendorTypes: ['Farm-to-table chef or caterer', 'Natural wine and cider vendor', 'Décor and floral vendor (seasonal)'], recommendedVenue: 'Large amenity space or dining room — long communal table format',
    setupNotes: ['Long communal table — single table if possible', 'Natural linen, beeswax candles, seasonal botanicals: no arrangements', 'Menu printed on kraft or natural paper stock', 'Chef introduces each course at the table', 'Farm credits on the menu: "Squash from [Farm Name], [County]"'],
    staffingNotes: ['1 chef with 1–2 kitchen assistants', '2 servers for 40–55 guests', '1 building event lead', 'Chef should be present and visible throughout'],
    luxuryNotes: ['The sourcing story is inseparable from the luxury', 'Natural wine and cider signals intentionality', 'Candlelight and natural materials are the entire aesthetic'],
    residentExperienceNotes: ['Positions the building as culturally aware and food-literate', 'Communal format forces conversations residents remember for months', 'Autumn timing creates a sense of occasion — the season is part of the luxury'],
    flyerHeadline: 'Peak season. Long table. One autumn evening.', residentEmailIntro: 'This month we\'re marking the season properly — a harvest supper at a long communal table, built entirely from peak fall ingredients sourced from named local farms. Natural wine, craft cider, and a chef who will tell you where every dish came from.',
    suggestedUpgrades: ['Invite the sourcing farmer to attend the first course', 'Add a natural wine merchant as a featured guest', 'Commission a custom harvest menu printed on seed paper'],
  },
  {
    id: 'new-year-champagne-social',
    label: 'New Year Champagne Social',
    category: 'seasonal',
    description: 'An elegant New Year\'s Eve pre-celebration for residents — champagne, canapés, and a midnight toast.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],
    formData: { eventType: 'Holiday Party', budget: '$5,000 – $10,000', attendance: '30 – 60 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mixed demographic', notes: 'New Year\'s Eve champagne social. Champagne on arrival. Passed canapés throughout. Midnight toast with featured Champagne. No DJ — acoustic or curated playlist only. Smart dress.' },
    atmosphere: 'Celebratory, elegant, occasion-defining', demographicFit: ['Mixed demographic', 'Mature residents (50+)', 'Young professionals (25–35)'], idealSeasons: ['Winter'],
    budgetTier: 'premium', budgetRange: '$5,000 – $9,000', attendanceRange: '30 – 60', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Champagne and full bar vendor', 'Canapé caterer', 'Acoustic musician or curated playlist vendor'], recommendedVenue: 'Clubroom, amenity lounge, or lobby space',
    setupNotes: ['Champagne poured on trays ready at entrance for arrival', 'Midnight toast Champagne pre-poured in coupes at 11:50 PM', 'Canapés passed continuously — no buffet format on New Year\'s Eve', 'Countdown clock visible from main social area', 'Smart dress code communicated clearly'],
    staffingNotes: ['2 bartenders for full bar service', '2–3 servers for continuous canapé passing', '1 building event lead', '1 acoustic musician for the first 2 hours'],
    luxuryNotes: ['The midnight toast is the entire event — everything before it is the anticipation', 'Pre-poured coupes at 11:50 PM signals choreography and care', 'Acoustic music over a DJ creates the warmth appropriate for this format'],
    residentExperienceNotes: ['Residents who spend New Year\'s Eve in the building will feel proud of their decision', 'The midnight moment is the memory — everything before enables it'],
    flyerHeadline: 'Ring in the new year right here. Champagne at midnight.', residentEmailIntro: 'We\'re hosting New Year\'s Eve in the building this year — an elegant champagne social to close out the year with your neighbors. Champagne on arrival, canapés throughout, and a proper midnight toast.',
    suggestedUpgrades: ['Feature a prestige Champagne for the midnight toast', 'Add a photo booth or photographer for the midnight countdown', 'Create a "New Year\'s Eve Menu" card as a keepsake'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY POP-UP TEMPLATES (3)
// ─────────────────────────────────────────────────────────────────────────────

const LUXURY_POPUP_TEMPLATES: LuxuryTemplate[] = [
  {
    id: 'the-champagne-residency',
    label: 'The Champagne Residency',
    category: 'luxury_popup',
    description: 'A one-night champagne and sparkling wine experience led by a Champagne specialist.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],
    formData: { eventType: 'Cocktail Reception', budget: '$5,000 – $10,000', attendance: '20 – 40 residents', season: 'Winter', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mature residents (50+)', notes: 'Champagne and sparkling wine tasting led by a specialist. 5–6 expressions including grower Champagnes. Paired with caviar service, blinis, and crème fraîche. Formal but warm. Maximum 24 residents.' },
    atmosphere: 'Celebratory, collector-grade, one-night-only', demographicFit: ['Mature residents (50+)', 'Young professionals (25–35)'], idealSeasons: ['Winter', 'Fall / Autumn'],
    budgetTier: 'premium', budgetRange: '$5,500 – $9,500', attendanceRange: '14 – 24', staffingComplexity: 'medium', operationalDifficulty: 'moderate', alcoholIncluded: true,
    vendorTypes: ['Champagne specialist or sommelier', 'Caviar and fine foods vendor', 'Fine wine importer'], recommendedVenue: 'Private dining room or intimate clubroom',
    setupNotes: ['Flute and coupe stems pre-set — two per person minimum', 'Champagne served at 47–50°F — confirm with specialist', 'Caviar service: mother-of-pearl spoons only', 'Printed tasting notes at each seat', 'Room silent during tasting commentary'],
    staffingNotes: ['1 Champagne specialist to lead', '1 trained server for pour and caviar replenishment', '1 building staff for arrivals'],
    luxuryNotes: ['Grower Champagnes residents cannot source locally are the draw', 'Caviar service elevates this beyond any wine tasting', 'The specialist\'s narrative is the content of the evening'],
    residentExperienceNotes: ['Residents leave with genuine knowledge about Champagne', 'The rarity of the bottles is a conversation topic beyond the evening'],
    flyerHeadline: 'Grower Champagnes. Caviar. Twenty-four seats.', residentEmailIntro: 'We\'ve arranged something genuinely special — an evening with a Champagne specialist featuring grower expressions you won\'t find at retail, paired with caviar service. Twenty-four seats. Formal tasting format. RSVP required.',
    suggestedUpgrades: ['Source one prestige cuvée (Krug, Salon) as the evening\'s centerpiece', 'Commission a custom printed tasting booklet', 'Offer residents the opportunity to order featured bottles after the event'],
  },
  {
    id: 'signature-chef-debut',
    label: 'Signature Chef Debut',
    category: 'luxury_popup',
    description: 'A one-night residency featuring a guest chef from a recognized local restaurant.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],
    formData: { eventType: 'Cooking Class', budget: '$10,000 – $25,000', attendance: '20 – 40 residents', season: 'Fall / Autumn', venue: 'Indoor', alcohol: 'Full bar', demographic: 'Mixed demographic', notes: 'Guest chef from a recognized local restaurant cooks a 5-course tasting menu exclusively for building residents. Chef introduces each course. Wine pairings by sommelier. 30 residents maximum.' },
    atmosphere: 'Restaurant-grade, exclusive, name-anchored', demographicFit: ['Mature residents (50+)', 'Young professionals (25–35)', 'Mixed demographic'], idealSeasons: ['Fall / Autumn', 'Winter'],
    budgetTier: 'ultra', budgetRange: '$10,000 – $18,000', attendanceRange: '20 – 30', staffingComplexity: 'high', operationalDifficulty: 'complex', alcoholIncluded: true,
    vendorTypes: ['Guest chef and kitchen team', 'Sommelier for wine pairings', 'Event rental (if kitchen unavailable)'], recommendedVenue: 'Full demonstration kitchen or catered amenity space',
    setupNotes: ['Chef requires site visit 48–72 hours before', 'Full kitchen equipment list reviewed in advance', 'Printed menus with chef name and course descriptions at each seat', 'Chef introduction at start of service — brief and genuine'],
    staffingNotes: ['1 guest chef plus their kitchen team (2–3 people)', '1 sommelier for wine pairing', '1–2 front-of-house servers', '1 building event lead'],
    luxuryNotes: ['The chef\'s name and restaurant recognition is the entire luxury signal', 'This format only works if the chef is genuinely notable', 'A keepsake menu card signed by the chef at close costs nothing and creates a lasting artifact'],
    residentExperienceNotes: ['Residents experience their building as a venue worthy of serious culinary talent', 'The dinner becomes a story: "we had [chef name] cook in our building"', 'Sets a standard that defines the building\'s programming identity for years'],
    flyerHeadline: '[Chef Name] is cooking in the building. Thirty seats only.', residentEmailIntro: 'We\'re bringing [Chef Name] of [Restaurant] into the building for one evening — a five-course tasting menu cooked exclusively for residents, with wine pairings throughout. Thirty seats. Reservations required.',
    suggestedUpgrades: ['Create an annual "Chef in Residence" series with a different chef each season', 'Add a pre-dinner kitchen preview for 5 residents — a true VIP tier', 'Commission a short video of the chef preparing a course'],
  },
  {
    id: 'resident-art-opening',
    label: 'Resident Art Opening',
    category: 'luxury_popup',
    description: 'A curated gallery opening featuring work by resident artists or a commissioned local artist.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Spring'],
    formData: { eventType: 'Cocktail Reception', budget: '$2,500 – $5,000', attendance: '30 – 60 residents', season: 'Spring', venue: 'Indoor', alcohol: 'Wine & beer only', demographic: 'Mixed demographic', notes: 'Gallery-style opening reception featuring a resident artist or commissioned local artist. Works displayed in lobby, hallways, or amenity space. Artist present for the opening. Wine and light bites. Works optionally available for purchase.' },
    atmosphere: 'Cultural, convivial, community-proud', demographicFit: ['Mixed demographic', 'Young professionals (25–35)', 'Mature residents (50+)'], idealSeasons: ['Spring', 'Fall / Autumn'],
    budgetTier: 'mid', budgetRange: '$2,000 – $4,000', attendanceRange: '30 – 60', staffingComplexity: 'low', operationalDifficulty: 'easy', alcoholIncluded: true,
    vendorTypes: ['Artist (resident or commissioned local)', 'Art hanging and installation vendor', 'Wine and beer vendor'], recommendedVenue: 'Lobby, hallways, amenity space — anywhere art can be properly hung and lit',
    setupNotes: ['Professional picture hanging with proper gallery hardware', 'Track lighting or spotlights on each piece where possible', 'Work labels: title, medium, dimensions, artist name — printed and framed', 'Artist present for the first 90 minutes minimum', 'Wine station positioned so guests flow through the art'],
    staffingNotes: ['The artist is the primary host', '1 building staff for wine management and coordination'],
    luxuryNotes: ['Gallery-quality installation is the entire difference between this and a craft fair', 'The artist\'s presence transforms it from a display into an event', 'Works remaining on display for 2–4 weeks after the opening extends the value'],
    residentExperienceNotes: ['Discovering a talented artist lives in the building creates genuine pride', 'The art remaining on display means every resident sees it, not just those who attended'],
    flyerHeadline: 'The gallery is the building. The artist lives here.', residentEmailIntro: 'This month we\'re opening a gallery — right here in the building. Works by [Artist Name], a resident whose work deserves a proper showing. Wine, conversation, and the artist present all evening.',
    suggestedUpgrades: ['Commission a site-specific piece for the lobby as a permanent installation', 'Partner with a local gallery to co-present the opening', 'Create a printed exhibition catalogue as a take-home'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const LUXURY_TEMPLATES: LuxuryTemplate[] = [
  ...WELLNESS_TEMPLATES,       // 4 templates
  ...CULINARY_TEMPLATES,       // 6 templates
  ...SOCIAL_TEMPLATES,         // 5 templates
  ...NETWORKING_TEMPLATES,     // 3 templates
  ...WORKSHOP_TEMPLATES,       // 3 templates
  ...FAMILY_TEMPLATES,         // 2 templates
  ...SEASONAL_TEMPLATES,       // 4 templates
  ...LUXURY_POPUP_TEMPLATES,   // 3 templates
]
// Total: 30 templates
