/**
 * eleve-templates-11c.ts
 *
 * Prompt 11C — First 10 curated Elevé luxury hospitality templates.
 * Categories: Wellness (3), Culinary (4), Social/Rooftop (3)
 *
 * Integration: merge these into LUXURY_TEMPLATES in src/lib/templates.ts
 * All templates use the existing LuxuryTemplate schema.
 * Templates WITHOUT a `plan` field → seed Claude generation.
 * Templates WITH a `plan` field → instant load (add in 11D).
 *
 * All formData fields map directly to EventFormData in src/types/index.ts
 */

import type { LuxuryTemplate } from '@/lib/templates'

// ─────────────────────────────────────────────────────────────────────────────
// WELLNESS — 3 templates
// ─────────────────────────────────────────────────────────────────────────────

const WELLNESS_TEMPLATES: LuxuryTemplate[] = [

  // ── W-01 ──────────────────────────────────────────────────────────────────
  {
    id:          'sound-stillness-session',
    label:       'Sound & Stillness Session',
    category:    'wellness',
    description: 'A guided sound bath and breathwork experience for residents seeking restoration.',
    previewTags: ['Morning', 'Indoor', 'Non-Alcoholic', 'Spring / Summer'],

    formData: {
      eventType:   'Wellness & Yoga Morning',
      budget:      '$1,000 – $2,500',
      attendance:  '20 – 40 residents',
      season:      'Spring',
      venue:       'Indoor',
      alcohol:     'No alcohol',
      demographic: 'Young professionals (25–35)',
      notes:       'Sound bath practitioner with crystal bowls. Guided breathwork opening. Provide yoga mats, eye pillows, and lavender-infused towels. Dim lighting essential. Close with herbal tea and light wellness refreshments.',
    },

    // ── Operational metadata ─────────────────────────────────────────────
    atmosphere:            'Calm, restorative, sensory',
    demographicFit:        ['Young professionals (25–35)', 'Mature residents (50+)'],
    idealSeasons:          ['Spring', 'Fall / Autumn'],
    budgetTier:            'entry',
    budgetRange:           '$1,200 – $2,200',
    attendanceRange:       '15 – 35',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       false,
    vendorTypes:           ['Sound bath practitioner', 'Wellness catering (tea, light bites)'],
    recommendedVenue:      'Amenity lounge, yoga room, or quiet common area',

    // ── Planning notes ───────────────────────────────────────────────────
    setupNotes: [
      'Darken the room. Blackout curtains or dim all overhead lighting',
      'Lay mats in a radial pattern around the practitioner, not rows',
      'Set up a small table with crystal bowls, chimes, and props',
      'Provide one rolled blanket and one eye pillow per mat',
      'Station wellness refreshments at room perimeter for post-session',
      'Post a quiet-entry sign outside the door 15 min before start',
    ],
    staffingNotes: [
      '1 building team member to manage check-in and mat setup',
      '1 sound bath practitioner (external vendor)',
      'No additional staff required during session. Minimize presence',
    ],
    luxuryNotes: [
      'Lightly mist the space with eucalyptus or lavender before guests arrive',
      'Offer chilled cucumber water and hot herbal tea at close',
      'A small take-home, a single lavender sachet or wellness card, elevates recall',
      'Dim lighting and a clean, uncluttered space signal premium better than decor',
    ],
    residentExperienceNotes: [
      'Residents should feel the building curated this specifically for them, not sourced generically',
      'The silence and stillness itself is the amenity. Protect it operationally',
      'Start and end on time. Wellness residents respect schedule precision',
    ],

    // ── Content seeds ────────────────────────────────────────────────────
    flyerHeadline:      'An hour of sound. A week of clarity.',
    residentEmailIntro: 'We\'re setting aside an hour this [season] for something different: a guided sound bath and breathwork session designed to help you reset, right here in the building. No experience needed. Just show up and let go.',
    suggestedUpgrades: [
      'Add a certified breathwork facilitator as a separate opening segment',
      'Partner with a local apothecary for a small take-home wellness kit',
      'Offer a post-session one-on-one booking with the practitioner',
      'Add a guided journal prompt card at each mat',
    ],
  },

  // ── W-02 ──────────────────────────────────────────────────────────────────
  {
    id:          'rooftop-yoga-at-dawn',
    label:       'Rooftop Yoga at Dawn',
    category:    'wellness',
    description: 'An early morning yoga practice on the rooftop terrace as the city wakes up.',
    previewTags: ['Morning', 'Outdoor', 'Non-Alcoholic', 'Summer'],

    formData: {
      eventType:   'Wellness & Yoga Morning',
      budget:      '$1,000 – $2,500',
      attendance:  '20 – 40 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'No alcohol',
      demographic: 'Young professionals (25–35)',
      notes:       'Sunrise or early morning rooftop yoga. All levels. Provide mats. Cold brew, pressed juice, and light fruit available after practice. Keep the vibe calm and unpretentious.',
    },

    atmosphere:            'Energising, grounded, atmospheric',
    demographicFit:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Spring', 'Summer'],
    budgetTier:            'entry',
    budgetRange:           '$900 – $1,800',
    attendanceRange:       '12 – 30',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       false,
    vendorTypes:           ['Yoga instructor', 'Light catering (juice, cold brew, fruit)'],
    recommendedVenue:      'Rooftop terrace or pool deck, unobstructed open space',

    setupNotes: [
      'Confirm rooftop access and safety clearance 48 hours ahead',
      'Lay mats facing east or toward the best view. Orientation matters',
      'Set up refreshment station at the rooftop entry, not mid-practice space',
      'Have a backup indoor room confirmed in case of weather change',
      'Start setup 45 minutes before session: mats, props, and sound',
      'A portable bluetooth speaker with a pre-set ambient playlist is sufficient',
    ],
    staffingNotes: [
      '1 yoga instructor (external, all-levels certified)',
      '1 building team member for rooftop access management and mat setup',
      'Check-in can be casual. No formal table needed at this scale',
    ],
    luxuryNotes: [
      'Cold-pressed juice in glass bottles reads premium; avoid plastic cups',
      'A single potted plant or small floral arrangement at the mat layout entry adds intention',
      'The city view at dawn is the hero. Don\'t over-decorate and compete with it',
      'Rolled towels at each mat signal boutique hotel, not community center',
    ],
    residentExperienceNotes: [
      'Early start time (6:30–7:30 AM) serves working professionals perfectly',
      'The rooftop exclusivity creates a "this building is different" feeling',
      'Residents will photograph this. The view does the marketing',
    ],

    flyerHeadline:      'Sunrise practice. Rooftop. Yours.',
    residentEmailIntro: 'This [month], we\'re opening the rooftop early: just for you. Join us for an all-levels yoga practice as the city wakes up, followed by cold-pressed juice and coffee. No mat required. Just bring yourself.',
    suggestedUpgrades: [
      'Partner with a local cold brew or juice brand for sponsored refreshments',
      'Offer a post-practice 15-minute guided meditation for those who want to stay',
      'Make it a monthly series: "First Sunday Rooftop Practice"',
      'Add a small wellness product sample at each mat from a local brand',
    ],
  },

  // ── W-03 ──────────────────────────────────────────────────────────────────
  {
    id:          'early-morning-restore',
    label:       'Early Morning Restore',
    category:    'wellness',
    description: 'A slow-flow movement and guided stretch class designed for stress recovery.',
    previewTags: ['Morning', 'Indoor', 'Non-Alcoholic', 'Fall / Winter'],

    formData: {
      eventType:   'Wellness & Yoga Morning',
      budget:      '$1,000 – $2,500',
      attendance:  '20 – 40 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'No alcohol',
      demographic: 'Mature residents (50+)',
      notes:       'Slow-flow restorative movement class. Low intensity, all abilities. Focus on joint mobility and gentle stretching. End with herbal tea and light refreshments. Blankets and bolsters provided.',
    },

    atmosphere:            'Gentle, therapeutic, warm',
    demographicFit:        ['Mature residents (50+)', 'Mixed demographic'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'entry',
    budgetRange:           '$800 – $1,600',
    attendanceRange:       '10 – 25',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       false,
    vendorTypes:           ['Restorative yoga or movement instructor', 'Herbal tea and light catering'],
    recommendedVenue:      'Amenity lounge or multipurpose room: warm, carpeted preferred',

    setupNotes: [
      'Arrange mats with extra space between them. This demographic needs room',
      'Provide bolsters, blocks, and blankets at every mat, not on request',
      'Room temperature should be warm, 72–74°F, not gym-cool',
      'Soft ambient lighting only; avoid overhead fluorescents entirely',
      'Set up tea station with hot water ready before class ends',
    ],
    staffingNotes: [
      '1 restorative movement instructor. Specifically experienced with older adults',
      '1 building team member to assist with mat setup and guest arrival',
      'Slow pace and verbal cues matter more than physical demonstration at this demographic',
    ],
    luxuryNotes: [
      'Herbal tea served in proper mugs, not paper cups',
      'Blankets should be soft. A cheap fleece signals the wrong tier',
      'Warm lighting and a tidy, uncluttered room is the entire aesthetic',
      'A handwritten note at each mat ("We\'re glad you\'re here") is a small premium touch',
    ],
    residentExperienceNotes: [
      'This demographic responds to being cared for, not challenged',
      'The gentleness of the format is the amenity, not an apology for low intensity',
      'Follow-up with a "how did it feel?" note or survey. They notice and appreciate it',
    ],

    flyerHeadline:      'Move gently. Leave restored.',
    residentEmailIntro: 'We\'re hosting a gentle morning movement class this [month]: designed specifically for residents who want to move, stretch, and restore without intensity. All levels, all abilities. Blankets and props provided. Tea and light refreshments to follow.',
    suggestedUpgrades: [
      'Add a post-class 10-minute guided relaxation with warm eye pillows',
      'Partner with a local herbal tea brand for a curated take-home tea selection',
      'Offer a follow-up "Restore Series" across 4 weeks',
      'Bring in a physical therapist for a short Q&A on joint health after the session',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CULINARY — 4 templates
// ─────────────────────────────────────────────────────────────────────────────

const CULINARY_TEMPLATES: LuxuryTemplate[] = [

  // ── C-01 ──────────────────────────────────────────────────────────────────
  {
    id:          'sommelier-social',
    label:       'Sommelier Social',
    category:    'culinary',
    description: 'A guided wine tasting led by a sommelier, paired with artisan boards and resident conversation.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],

    formData: {
      eventType:   'Wine & Cheese Evening',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Guided wine tasting led by a certified sommelier. Feature 4–5 wines across two regions. Pair with artisan cheese boards, charcuterie, and seasonal accompaniments. Intimate round-table format preferred.',
    },

    atmosphere:            'Sophisticated, conversational, unhurried',
    demographicFit:        ['Young professionals (25–35)', 'Mature residents (50+)', 'Mixed demographic'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'mid',
    budgetRange:           '$2,800 – $4,500',
    attendanceRange:       '25 – 55',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Certified sommelier', 'Artisan charcuterie and cheese vendor', 'Wine supplier'],
    recommendedVenue:      'Private dining room, amenity lounge, or clubroom',

    setupNotes: [
      'Round or cluster table format creates conversation. Avoid theater rows',
      'Stem glasses at every seat before guests arrive, never poured ahead',
      'Set tasting mats or cards at each place with the wine list printed',
      'Arrange boards as centerpieces. They work as décor before they\'re food',
      'Have still and sparkling water at every table throughout',
      'Label wines by number only on the table. Let the sommelier reveal names',
    ],
    staffingNotes: [
      '1 certified sommelier to lead the tasting and field questions',
      '1 building event staff for check-in and flow management',
      '1 server or team member to manage board replenishment and water service',
      'Sommelier should circulate between tables, not stay at a podium',
    ],
    luxuryNotes: [
      'Proper Riedel or Zalto-style stems, not generic rental stemware',
      'Printed tasting cards with wine notes elevate the experience meaningfully',
      'Boards should be generous. A sparse board reads cheap regardless of ingredient quality',
      'Low candlelight or warm amber lighting transforms the room for under $20',
    ],
    residentExperienceNotes: [
      'Residents leave feeling educated, not sold to. The sommelier\'s tone matters',
      'The conversation between residents is the real product of this format',
      'This event photographs beautifully. Encourage candid shots, not posed ones',
    ],

    flyerHeadline:      'Four wines. One evening. A lot to discover.',
    residentEmailIntro: 'We\'re inviting you to an evening with a certified sommelier: a guided tasting of four wines paired with artisan boards, right here in the building. Whether you\'re a seasoned collector or simply enjoy a good glass, this one is for you.',
    suggestedUpgrades: [
      'Add a fifth "mystery" wine revealed at the end for a talking-point moment',
      'Source wines from a single acclaimed region for a focused narrative',
      'Partner with a local wine shop for a post-event purchase option',
      'Offer a take-home tasting card with sommelier notes and food pairing suggestions',
    ],
  },

  // ── C-02 ──────────────────────────────────────────────────────────────────
  {
    id:          'chefs-counter-evening',
    label:       'Chef\'s Counter Evening',
    category:    'culinary',
    description: 'An intimate chef-led tasting dinner where residents gather around the kitchen counter.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],

    formData: {
      eventType:   'Cooking Class',
      budget:      '$5,000 – $10,000',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mature residents (50+)',
      notes:       'Intimate chef\'s counter format. Seats up to 20 residents around a central preparation area. Chef prepares 4–5 courses explaining technique and sourcing. Wine pairings included. Formal but relaxed tone.',
    },

    atmosphere:            'Intimate, theatrical, educational',
    demographicFit:        ['Mature residents (50+)', 'Young professionals (25–35)'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'premium',
    budgetRange:           '$5,500 – $9,000',
    attendanceRange:       '12 – 22',
    staffingComplexity:    'high',
    operationalDifficulty: 'complex',
    alcoholIncluded:       true,
    vendorTypes:           ['Private chef (4+ years fine dining experience)', 'Wine pairing sommelier or curated wine vendor', 'Event rental (counter setup, linens, stems)'],
    recommendedVenue:      'Demonstration kitchen, clubroom with counter access, or catered amenity space',

    setupNotes: [
      'Counter or U-shaped seating is essential. This is not a dining room event',
      'Chef requires a minimum 2-hour kitchen setup window before guests arrive',
      'Mise en place should be visible and intentional. Part of the experience',
      'Place settings should be simple and elegant. Let the food be the visual',
      'Confirm all equipment, heat sources, and ventilation with chef in advance',
      'Brief the chef on resident names if possible. Personalization signals premium',
    ],
    staffingNotes: [
      '1 private chef as host and preparer',
      '1 sommelier or knowledgeable server for wine pairing service',
      '1 building event staff to manage arrivals and coordinate with chef',
      'A dishwasher or kitchen assistant is essential behind the scenes',
    ],
    luxuryNotes: [
      'The chef\'s narrative, the sourcing story and technique rationale, is the luxury, not the food alone',
      'Printed menus at each seat with chef name and course descriptions',
      'Between-course timing should breathe: don\'t rush, don\'t leave long gaps',
      'One unexpected element per course (smoked finish, tableside pour) creates lasting recall',
    ],
    residentExperienceNotes: [
      'The exclusivity of 20 seats is itself the amenity. Communicate this in the invite',
      'Residents who attend once will request it annually. Build the series',
      'The format invites conversation naturally, no icebreakers needed',
    ],

    flyerHeadline:      'Twenty seats. One chef. An evening worth reserving.',
    residentEmailIntro: 'We\'re opening the kitchen this [month] for a very limited evening: a private chef\'s counter dinner for twenty residents. Four courses, wine pairings, and the kind of conversation that only happens around good food. Reservations are required.',
    suggestedUpgrades: [
      'Feature a guest chef from a recognized local restaurant for a name-drop moment',
      'Add a wine pairing card designed by the sommelier as a take-home keepsake',
      'Offer a "chef\'s table" waiting list for residents who miss out. Builds demand',
      'Commission a custom menu design from a local print studio',
    ],
  },

  // ── C-03 ──────────────────────────────────────────────────────────────────
  {
    id:          'garden-harvest-table',
    label:       'Garden Harvest Table',
    category:    'culinary',
    description: 'A seasonal communal dining experience built around local farmers market sourcing.',
    previewTags: ['Evening', 'Indoor & Outdoor', 'Wine & Beer', 'Fall'],

    formData: {
      eventType:   'Brunch Gathering',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor & Outdoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed demographic',
      notes:       'Long communal table dinner featuring seasonal and locally sourced produce. Farm-to-table aesthetic. Natural linen, simple florals, candles. Wine and craft beer service. A chef or caterer who can speak to sourcing and preparation.',
    },

    atmosphere:            'Warm, communal, harvest-seasonal',
    demographicFit:        ['Mixed demographic', 'Young professionals (25–35)', 'Mixed ages, family-oriented'],
    idealSeasons:          ['Fall / Autumn', 'Summer'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,500',
    attendanceRange:       '30 – 60',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Farm-to-table caterer or private chef', 'Local wine and craft beer vendor', 'Floral / natural décor vendor'],
    recommendedVenue:      'Courtyard, terrace, or large amenity space, long table format',

    setupNotes: [
      'Long communal table format is non-negotiable. Round tables destroy the concept',
      'Natural linen runners, not tablecloths. Texture signals the harvest aesthetic',
      'Low seasonal floral arrangements (no tall centerpieces blocking sightlines)',
      'Pillar candles or votive clusters down the table length',
      'Family-style service platters at intervals, not individual plated',
      'Source at least 3 ingredients from a named local farm and list them on a small card',
    ],
    staffingNotes: [
      '1 caterer or chef who can narrate sourcing if asked. Authenticity matters',
      '2 servers for a table of 40–60. One per end for efficient family-style service',
      '1 building staff for check-in and overall event coordination',
    ],
    luxuryNotes: [
      'The sourcing story is the luxury presentation. Name the farms, name the season',
      'Abundance reads premium here: generous platters, refilled without asking',
      'Avoid paper or plastic: natural materials only (wood, linen, ceramic, glass)',
      'A small printed harvest menu card at each setting costs under $1 and signals care',
    ],
    residentExperienceNotes: [
      'Communal seating forces conversation in the best way. Residents meet neighbors they haven\'t met',
      'The seasonal tie-in makes it feel timely and intentional, not generic',
      'This event works for a broad demographic range. The format is naturally inclusive',
    ],

    flyerHeadline:      'One long table. One season. The whole building.',
    residentEmailIntro: 'This [season], we\'re gathering around a long harvest table: a family-style dinner built entirely from locally sourced, seasonal ingredients. Good wine, good company, and the kind of evening that reminds you why you love living here.',
    suggestedUpgrades: [
      'Partner with a local farm for a named sourcing credit and brief farmer introduction',
      'Add a seasonal cocktail on arrival (apple cider with bourbon, mulled wine, etc.)',
      'Include a small take-home: a seasonal jam, honey, or spice blend from the farm',
      'Commission a custom harvest menu card from a local print or stationery studio',
    ],
  },

  // ── C-04 ──────────────────────────────────────────────────────────────────
  {
    id:          'reserve-cellar-tasting',
    label:       'Reserve Cellar Tasting',
    category:    'culinary',
    description: 'A focused tasting of allocated and small-production wines with a guided collector\'s narrative.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],

    formData: {
      eventType:   'Wine & Cheese Evening',
      budget:      '$5,000 – $10,000',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mature residents (50+)',
      notes:       'High-end wine tasting featuring allocated, library, or small-production wines not available at retail. Led by a master sommelier or wine director. 5–6 wines, formal tasting notes, pairing bites. Seated, intimate format. 20 residents max.',
    },

    atmosphere:            'Refined, collector-focused, quiet sophistication',
    demographicFit:        ['Mature residents (50+)', 'Young professionals (25–35)'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'premium',
    budgetRange:           '$5,000 – $8,500',
    attendanceRange:       '12 – 22',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Master sommelier or wine director', 'Specialty wine importer or fine wine shop', 'Artisan food pairing caterer'],
    recommendedVenue:      'Private dining room or intimate clubroom, no background noise',

    setupNotes: [
      'Pre-set all stems: two per person minimum (one for whites, one for reds)',
      'Print formal tasting notes and place at each seat before arrival',
      'Decant reds 30–60 minutes before service. Confirm timing with sommelier',
      'Source wines that residents genuinely cannot find at their local retailer',
      'Keep the room quiet. Background music should stop during tasting notes',
      'Have a dump bucket and water at each place without making it feel clinical',
    ],
    staffingNotes: [
      '1 master sommelier or senior wine professional to lead',
      '1 trained server for pour service. Pacing and precision matter here',
      '1 building staff to manage arrivals and room coordination',
      'Staff should be briefed on the wines. Residents may ask detailed questions',
    ],
    luxuryNotes: [
      'The wines themselves are the luxury. Source genuinely allocated or rare bottles',
      'Printed tasting notes designed with care (not printed from a word doc) signal premium',
      'Silence during tasting commentary is a luxury. Brief guests on format at arrival',
      'Proper decanting and temperature service communicates expertise before a word is spoken',
    ],
    residentExperienceNotes: [
      'This format appeals strongly to residents who already know wine. Respect their knowledge',
      'The rarity of the bottles is a talking point that extends well beyond the evening',
      'A brief "cellar notes" take-home card gives residents something to reference and share',
    ],

    flyerHeadline:      'Wines you won\'t find. An evening you won\'t forget.',
    residentEmailIntro: 'We\'ve sourced something special for this [month]: a private tasting of allocated and small-production wines led by a master sommelier. Six wines, formal tasting notes, and the kind of conversation that only happens around bottles worth opening. Space is limited to twenty residents.',
    suggestedUpgrades: [
      'Source one truly rare bottle (library vintage, single-vineyard) as the evening\'s centerpiece',
      'Commission a custom printed tasting booklet rather than a single card',
      'Offer residents the opportunity to purchase any featured wine through the sommelier\'s contact',
      'Add a blind tasting round for the final wine to create a memorable moment',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL / ROOFTOP — 3 templates
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_TEMPLATES: LuxuryTemplate[] = [

  // ── S-01 ──────────────────────────────────────────────────────────────────
  {
    id:          'golden-hour-reception',
    label:       'Golden Hour Reception',
    category:    'social',
    description: 'An elegant rooftop cocktail reception timed to sunset, with passed appetisers and a full bar.',
    previewTags: ['Evening', 'Outdoor', 'Full Bar', 'Summer'],

    formData: {
      eventType:   'Cocktail Reception',
      budget:      '$5,000 – $10,000',
      attendance:  '50 – 100 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Rooftop cocktail reception starting 90 minutes before sunset. Passed canapés and appetisers. Full craft cocktail bar with 2–3 signature drinks plus wine and beer. Music at ambient level. Dress code: smart casual. Photography-friendly setup.',
    },

    atmosphere:            'Celebratory, atmospheric, visually stunning',
    demographicFit:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Summer', 'Spring'],
    budgetTier:            'premium',
    budgetRange:           '$5,500 – $9,000',
    attendanceRange:       '40 – 90',
    staffingComplexity:    'high',
    operationalDifficulty: 'complex',
    alcoholIncluded:       true,
    vendorTypes:           ['Craft cocktail bar vendor', 'Passed canapé caterer', 'DJ or ambient music (optional)', 'Event rental (furniture, lighting)'],
    recommendedVenue:      'Rooftop terrace or pool deck with view',

    setupNotes: [
      'Check sunset time for your date and schedule start 90 minutes before',
      'String lighting or market lights should be installed the morning of the event',
      'Bar setup requires a minimum 90-minute load-in. Confirm rooftop access',
      'Furniture: lounge clusters, not rows or banquet. This is a standing social',
      'Staff the perimeter with passed trays. Keep circulation active',
      'Have a weather contingency plan and communicate it to residents in advance',
    ],
    staffingNotes: [
      '2 bartenders minimum for 60+ guests. One per 30 is the rule',
      '2–3 servers for passed canapés, active circulation throughout',
      '1 building event lead for overall management and vendor coordination',
      '1 door/check-in staff for the first 45 minutes of arrivals',
    ],
    luxuryNotes: [
      'Signature cocktail names tied to the building or neighborhood create a sense of place',
      'The golden hour itself is the luxury. Don\'t let late setup compete with it',
      'Passed trays should move constantly. Stationary food stations stall circulation',
      'Ambient music at conversation volume: guests shouldn\'t raise their voice to be heard',
    ],
    residentExperienceNotes: [
      'The view at golden hour is a built-in Instagram moment. Lean into it',
      'Residents feel proud of their building at events like this. The rooftop is the amenity',
      'This event converts hesitant residents into building advocates',
    ],

    flyerHeadline:      'The rooftop. The skyline. The moment.',
    residentEmailIntro: 'We\'re opening the rooftop this [month] for golden hour: cocktails, canapés, and a view worth seeing. Join your neighbors for an evening that starts at sunset and ends whenever you\'re ready to leave.',
    suggestedUpgrades: [
      'Create a signature cocktail named after the building or neighborhood',
      'Hire a saxophonist or acoustic guitarist for the first hour instead of a DJ',
      'Commission a local photographer for a 2-hour candid shoot of the evening',
      'Add an espresso martini station as the sun sets for an elevated late-evening moment',
    ],
  },

  // ── S-02 ──────────────────────────────────────────────────────────────────
  {
    id:          'terrace-aperitivo-social',
    label:       'Terrace Aperitivo Social',
    category:    'social',
    description: 'A relaxed Italian-style aperitivo hour with spritz cocktails, antipasti, and resident conversation.',
    previewTags: ['Early Evening', 'Outdoor', 'Wine & Beer', 'Spring'],

    formData: {
      eventType:   'Cocktail Reception',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Spring',
      venue:       'Indoor & Outdoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed demographic',
      notes:       'Italian aperitivo format. Aperol spritz, Campari soda, Prosecco, and one non-alcoholic option. Small antipasti spread: olives, cured meats, giardiniera, bruschetta. Relaxed, early evening timing (5:30–7:30 PM). No formal structure.',
    },

    atmosphere:            'Relaxed, convivial, European-inspired',
    demographicFit:        ['Mixed demographic', 'Young professionals (25–35)', 'Mature residents (50+)'],
    idealSeasons:          ['Spring', 'Summer'],
    budgetTier:            'mid',
    budgetRange:           '$2,200 – $4,000',
    attendanceRange:       '25 – 55',
    staffingComplexity:    'medium',
    operationalDifficulty: 'easy',
    alcoholIncluded:       true,
    vendorTypes:           ['Aperitivo bar vendor or caterer', 'Italian antipasti vendor or deli'],
    recommendedVenue:      'Terrace, courtyard, or outdoor amenity space',

    setupNotes: [
      'Casual furniture arrangement: bistro tables, a few lounge pieces, standing-friendly',
      'Antipasti displayed on large boards or platters, not individual servings',
      'Bar should be staffed, not self-serve. Even at this scale it matters',
      'Pre-batch the spritzes for speed. This format rewards fast service',
      'Keep the aesthetic simple: white linens, a few citrus garnishes, nothing fussy',
      'Have the space set before first arrivals. Aperitivo energy depends on ambiance from the start',
    ],
    staffingNotes: [
      '1–2 bartenders depending on attendance',
      '1 server to manage antipasti replenishment and tray passing',
      '1 building staff for coordination and guest relations',
    ],
    luxuryNotes: [
      'The aperitivo format is inherently social. Your job is to set the tone, then step back',
      'Quality Prosecco and properly made spritzes cost marginally more but read significantly better',
      'Oranges and grapefruit as garnishes signal effort; pre-sliced limes do not',
      'The European format creates a sense of sophistication without requiring formality',
    ],
    residentExperienceNotes: [
      'This format works exceptionally well for mixed demographics. No one feels out of place',
      'Early timing (5:30 PM) means residents don\'t have to commit their whole evening',
      'The relaxed energy converts residents who "don\'t usually attend events" into regulars',
    ],

    flyerHeadline:      'Aperitivo hour. Your terrace. This [month].',
    residentEmailIntro: 'We\'re keeping it simple this [month]: spritz cocktails, antipasti, and good company on the terrace. Drop by when you\'re ready and stay as long as you like. No agenda. Just an easy evening with your neighbors.',
    suggestedUpgrades: [
      'Feature a local Italian deli or specialty vendor for antipasti sourcing and credit',
      'Add a non-alcoholic Aperol alternative for residents who don\'t drink',
      'Make it a recurring format: "First Thursday Aperitivo" has a natural rhythm',
      'Bring in a local gelato vendor for a dessert close at the end of the evening',
    ],
  },

  // ── S-03 ──────────────────────────────────────────────────────────────────
  {
    id:          'midnight-cocktail-service',
    label:       'Midnight Cocktail Service',
    category:    'social',
    description: 'A late-night intimate cocktail experience for residents who prefer the quieter hours.',
    previewTags: ['Late Evening', 'Indoor', 'Full Bar', 'Winter'],

    formData: {
      eventType:   'Cocktail Reception',
      budget:      '$2,500 – $5,000',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Late evening cocktail service in the clubroom or lounge. 9 PM – midnight. 3–4 signature craft cocktails developed by a bartender. Small bites: charcuterie, chocolate, savory pastry. Low lighting, curated playlist, no DJ. Intimate headcount intentional.',
    },

    atmosphere:            'Moody, intimate, late-night sophisticated',
    demographicFit:        ['Young professionals (25–35)'],
    idealSeasons:          ['Winter', 'Fall / Autumn'],
    budgetTier:            'mid',
    budgetRange:           '$2,000 – $3,800',
    attendanceRange:       '15 – 35',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Craft cocktail bartender', 'Small bites caterer or deli'],
    recommendedVenue:      'Clubroom, lounge, or private bar area, intimate scale required',

    setupNotes: [
      'Lighting is everything for this format. Dim all overheads, use candles and accent lighting only',
      'A curated playlist should be pre-set and tested before guests arrive',
      'The bar should feel like a proper bar: glassware, cocktail tools visible and intentional',
      'Small bites arranged on slate or wood boards, not chafing dishes',
      'The room should be set and lit before 8:30 PM. Ambiance starts before guests',
      'Keep the headcount invitation-only or RSVP-required to protect the intimate scale',
    ],
    staffingNotes: [
      '1 skilled craft bartender as the centerpiece of the experience',
      '1 staff member for check-in, bites management, and overall coordination',
      'No additional servers needed at this scale. The bartender leads the room',
    ],
    luxuryNotes: [
      'The craft cocktail menu should have names, not "Signature Drink 1"',
      'A printed cocktail card at the bar describing each drink costs almost nothing and signals everything',
      'Darkness and quiet are the luxury at this format. Protect both',
      'The bartender\'s technique is the show. The bar should be visible and central',
    ],
    residentExperienceNotes: [
      'Late-night formats serve a resident segment that daytime events miss entirely',
      'The intimacy creates a members-club feeling. Residents feel like insiders',
      'This event generates word-of-mouth from residents who tell friends about their building',
    ],

    flyerHeadline:      'After hours. Your building. An evening worth staying up for.',
    residentEmailIntro: 'We\'re doing something a little different this [month]: a late-night cocktail service in the lounge, starting at 9. A craft bartender, four signature drinks, and a room that actually feels like somewhere. RSVP required. Space is intentionally small.',
    suggestedUpgrades: [
      'Commission the bartender to develop 1–2 cocktails named specifically for the building',
      'Add a vinyl record player with a curated selection for a tactile music element',
      'Offer a mocktail menu with the same craft attention as the cocktail list',
      'Partner with a local chocolatier for a curated chocolate pairing with each drink',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT — merge into LUXURY_TEMPLATES in src/lib/templates.ts
// ─────────────────────────────────────────────────────────────────────────────

export const ELEVE_TEMPLATES_11C: LuxuryTemplate[] = [
  ...WELLNESS_TEMPLATES,
  ...CULINARY_TEMPLATES,
  ...SOCIAL_TEMPLATES,
]

export { WELLNESS_TEMPLATES, CULINARY_TEMPLATES, SOCIAL_TEMPLATES }
