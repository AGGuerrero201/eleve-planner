/**
 * eleve-templates-11d.ts
 *
 * Prompt 11D — Templates 11–20 for the Elevé luxury hospitality template library.
 * Categories: Networking (3), Workshop (3), Family (2), Seasonal (2)
 *
 * Integration: merge ELEVE_TEMPLATES_11D into LUXURY_TEMPLATES in src/lib/templates.ts
 */

import type { LuxuryTemplate } from '@/lib/templates'

// ─────────────────────────────────────────────────────────────────────────────
// NETWORKING — 3 templates
// ─────────────────────────────────────────────────────────────────────────────

const NETWORKING_TEMPLATES: LuxuryTemplate[] = [

  // ── N-01 ──────────────────────────────────────────────────────────────────
  {
    id:          'the-founders-collective',
    label:       'The Founders Collective',
    category:    'networking',
    description: 'A structured professional social for resident entrepreneurs, founders, and executives.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],

    formData: {
      eventType:   'Networking Mixer',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Professional networking event for founders, executives, and entrepreneurs in the building. Structured conversation activations — not just standing around. Featured resident "60-second intro" format. Craft cocktails and elevated small bites. Intentionally curated, not mass-invite.',
    },

    atmosphere:            'Professional, energised, purposeful',
    demographic:        ['Young professionals (25–35)', 'Mature residents (50+)'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,200',
    attendanceRange:       '25 – 50',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Craft cocktail bartender', 'Elevated small bites caterer'],
    recommendedVenue:      'Clubroom, private lounge, or amenity space with standing room',

    setupNotes: [
      'Standing format with high-top tables — no seated dinner layout',
      'Keep the room slightly under-furnished so people circulate naturally',
      'A brief welcome from building management sets professional tone at arrival',
      'Prepare a simple "conversation starter" card at each high-top — one question per table',
      'Name tags are acceptable here — professional context makes them non-awkward',
      'Bar open from arrival; small bites circulated at 30 and 60 minutes in',
    ],
    staffingNotes: [
      '1 skilled bartender for the cocktail station',
      '1–2 servers for passed small bites',
      '1 building staff as host and MC for the 60-second intro format',
      'The host role matters here — someone needs to actively facilitate, not just manage logistics',
    ],
    luxuryNotes: [
      'The curation of who\'s in the room is the luxury — communicate selective invite in marketing',
      'Conversation-starter cards with smart, professional prompts cost nothing and prevent awkward silences',
      'Quality cocktails and elevated bites signal that this isn\'t a generic networking happy hour',
      'End on time — professional residents respect a defined close',
    ],
    residentExperienceNotes: [
      'Residents leave with at least one meaningful connection — that\'s the metric',
      'The "60-second intro" format gives everyone a structured moment without being cringe',
      'This event positions the building as a community of accomplished people',
    ],

    flyerHeadline:      'The building\'s founders, in one room.',
    residentEmailIntro: 'We\'re bringing together the entrepreneurs, executives, and founders in the building for an evening of real conversation. Craft cocktails, elevated bites, and a format designed to actually make introductions happen. RSVP required — space is intentionally curated.',
    suggestedUpgrades: [
      'Feature one resident as a 5-minute spotlight speaker on their current work',
      'Partner with a local co-working space or accelerator for co-branding',
      'Create a private building Slack or LinkedIn group as a post-event follow-up',
      'Bring in a professional photographer for headshots during the first 30 minutes',
    ],
  },

  // ── N-02 ──────────────────────────────────────────────────────────────────
  {
    id:          'industry-salon',
    label:       'Industry Salon',
    category:    'networking',
    description: 'A themed professional conversation evening built around a single industry or topic.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Winter'],

    formData: {
      eventType:   'Networking Mixer',
      budget:      '$1,000 – $2,500',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Young professionals (25–35)',
      notes:       'Salon-style conversation evening. Choose a theme — tech, finance, creative industries, real estate — based on resident profile. One featured resident or external guest speaker for 15 minutes, then open discussion. Wine and beer, light snacks. Intimate headcount by design.',
    },

    atmosphere:            'Intellectual, intimate, conversational',
    demographic:        ['Young professionals (25–35)', 'Mature residents (50+)'],
    idealSeasons:          ['Winter', 'Fall / Autumn'],
    budgetTier:            'entry',
    budgetRange:           '$900 – $2,000',
    attendanceRange:       '15 – 35',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       true,
    vendorTypes:           ['Wine and beer vendor', 'Light snacks caterer or deli'],
    recommendedVenue:      'Intimate lounge or library room — conversational scale only',

    setupNotes: [
      'Semicircle or living-room seating arrangement — not classroom rows',
      'A small speaker setup for the featured guest (mic if needed for 30+ people)',
      'Wine and beer self-serve station — this format doesn\'t need a bartender',
      'Light snacks arranged before arrival and replenished at the break',
      'Keep the room to 35 people maximum — the salon format breaks above this',
      'Pre-circulate the evening\'s theme and speaker name in the invite',
    ],
    staffingNotes: [
      '1 building staff as host and conversation facilitator',
      'No additional servers needed — self-serve beverage format is appropriate here',
      'The featured speaker (resident or external) should be briefed on the 15-minute format',
    ],
    luxuryNotes: [
      'The quality of the speaker and topic is the entire value proposition',
      'A printed single-page "evening agenda" card signals intentionality on a small budget',
      'Good wine at a self-serve station still reads better than bad wine from a bartender',
      'The salon format itself — the word, the concept — signals premium without spending premium',
    ],
    residentExperienceNotes: [
      'Residents leave having learned something — the rarest outcome of a building event',
      'The intellectual format attracts residents who normally skip social events',
      'A follow-up email with "three things we discussed" extends the experience beyond the room',
    ],

    flyerHeadline:      'One topic. One evening. Actual conversation.',
    residentEmailIntro: 'This [month] we\'re hosting an Industry Salon — an intimate evening built around [topic]. One featured voice, open discussion, and a room full of residents who actually have something to say. Wine and light bites throughout. Space is limited to keep the conversation real.',
    suggestedUpgrades: [
      'Record the speaker segment (with permission) and share with residents who couldn\'t attend',
      'Create a themed reading list or resource card to accompany the evening\'s topic',
      'Make it a quarterly series with rotating topics and a recurring name',
      'Partner with a relevant local organization or publication for co-branding',
    ],
  },

  // ── N-03 ──────────────────────────────────────────────────────────────────
  {
    id:          'open-exchange-forum',
    label:       'Open Exchange Forum',
    category:    'networking',
    description: 'An unstructured professional social where the building itself is the shared context.',
    previewTags: ['Early Evening', 'Indoor', 'Wine & Beer', 'Spring'],

    formData: {
      eventType:   'Networking Mixer',
      budget:      '$1,000 – $2,500',
      attendance:  '30 – 60 residents',
      season:      'Spring',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed demographic',
      notes:       'Low-structure professional social for all resident professionals. No speaker, no agenda — just good wine, light food, and a room full of interesting people who happen to live in the same building. Early evening timing makes it accessible for busy schedules.',
    },

    atmosphere:            'Relaxed, open, community-professional',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic', 'Mature residents (50+)'],
    idealSeasons:          ['Spring', 'Fall / Autumn'],
    budgetTier:            'entry',
    budgetRange:           '$1,000 – $2,000',
    attendanceRange:       '25 – 55',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       true,
    vendorTypes:           ['Wine and beer vendor', 'Light bites caterer'],
    recommendedVenue:      'Lobby lounge, clubroom, or open amenity space',

    setupNotes: [
      'Keep setup minimal and approachable — this is not a formal event',
      'Wine and beer station with proper glassware, not plastic cups',
      'Light bites on boards throughout the space, not a single buffet table',
      'No podium, no microphone, no structured agenda',
      'Early timing (5:30–7:30 PM) removes the "commit to my whole evening" friction',
      'Building management should circulate and make introductions actively',
    ],
    staffingNotes: [
      '1 building staff member as active host — this role makes or breaks the event',
      '1 staff to manage bites replenishment and general tidiness',
      'No bartender needed — self-serve wine and beer is fine at this format',
    ],
    luxuryNotes: [
      'The host\'s active introduction-making is the luxury at this budget tier',
      'Good glassware at a self-serve station elevates the format without adding cost',
      'A simple "who\'s in the room" card listing resident professional categories adds intrigue',
    ],
    residentExperienceNotes: [
      'The early timing and low-pressure format converts non-attendees into first-timers',
      'Residents who meet one useful contact will attend every future edition',
      'Building management making genuine introductions is more valuable than any speaker',
    ],

    flyerHeadline:      'Good wine. Interesting neighbors. Early enough to still have dinner.',
    residentEmailIntro: 'No agenda, no speaker, no structured anything — just an easy evening with the professionals who happen to live in this building. Drop by after work, stay as long as you like. Wine and light bites throughout.',
    suggestedUpgrades: [
      'Add a simple "resident directory" card listing names and industries for the evening',
      'Partner with a local wine shop for curated selections and subtle co-branding',
      'Make it a recurring quarterly touchpoint with a consistent name',
      'Add one conversation-starter prompt on each high-top table',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOP — 3 templates
// ─────────────────────────────────────────────────────────────────────────────

const WORKSHOP_TEMPLATES: LuxuryTemplate[] = [

  // ── WK-01 ─────────────────────────────────────────────────────────────────
  {
    id:          'modern-needle-atelier',
    label:       'Modern Needle Atelier',
    category:    'workshop',
    description: 'A guided embroidery and needlework session with modern patterns and a social atmosphere.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Winter'],

    formData: {
      eventType:   'Cooking Class',
      budget:      '$1,000 – $2,500',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Young professionals (25–35)',
      notes:       'Guided embroidery workshop with a contemporary aesthetic — modern geometric patterns, not grandmotherly florals. Instructor leads two skill levels simultaneously. All materials provided. Wine and light snacks throughout. Residents take their work home.',
    },

    atmosphere:            'Creative, focused, social',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'entry',
    budgetRange:           '$1,000 – $2,200',
    attendanceRange:       '12 – 25',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       true,
    vendorTypes:           ['Textile/embroidery instructor', 'Wine and beer vendor'],
    recommendedVenue:      'Amenity lounge or common area with flat table space',

    setupNotes: [
      'Each seat needs a flat work surface — tables, not lounge seating',
      'Pre-stage all materials: hoop, needle, thread selection, pattern card, scissors',
      'Instructor needs 30 minutes of setup time before residents arrive',
      'Wine and snacks at a side station — not on work surfaces',
      'Good overhead lighting is essential — dim ambiance does not work for needlework',
      'Provide small take-home bags for residents to transport unfinished work',
    ],
    staffingNotes: [
      '1 textile instructor with contemporary teaching style',
      '1 building staff to manage arrivals, replenish snacks, and assist the instructor',
      'Instructor should offer a beginner and an intermediate pattern simultaneously',
    ],
    luxuryNotes: [
      'Modern geometric or abstract patterns specifically — not vintage florals',
      'Quality thread in a curated color palette (not a craft store variety pack) signals curation',
      'A printed pattern card with the Elevé brand mark makes the take-home feel designed',
      'The social conversation that emerges during focused craft work is the real amenity',
    ],
    residentExperienceNotes: [
      'Residents leave with something handmade — the take-home extends the experience',
      'The focused activity removes social pressure — ideal for residents who find pure mixers uncomfortable',
      'This format photographs beautifully — materials, hands, work in progress',
    ],

    flyerHeadline:      'Something made by hand. Something worth keeping.',
    residentEmailIntro: 'We\'re hosting an embroidery evening this [month] — a guided session with a textile artist, modern patterns, and wine throughout. No experience needed. You\'ll take your work home when you leave. Space is limited so we can keep the room relaxed and focused.',
    suggestedUpgrades: [
      'Commission a custom Elevé-themed pattern as one of the options',
      'Partner with a local textile studio for instructor and materials sourcing',
      'Add a "show and tell" 5 minutes at the close where residents share their progress',
      'Create a follow-up session for residents who want to finish or advance their work',
    ],
  },

  // ── WK-02 ─────────────────────────────────────────────────────────────────
  {
    id:          'cocktail-craft-session',
    label:       'Cocktail Craft Session',
    category:    'workshop',
    description: 'A hands-on cocktail making class led by a craft bartender — technique, not just tasting.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Spring'],

    formData: {
      eventType:   'Cooking Class',
      budget:      '$2,500 – $5,000',
      attendance:  '20 – 40 residents',
      season:      'Spring',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Cocktail making workshop led by a craft bartender. Each resident makes 2 drinks using proper technique — shaking, stirring, straining. Focus on 2–3 classic cocktails and one seasonal variation. All spirits, mixers, and tools provided. Keep it educational and fun, not gimmicky.',
    },

    atmosphere:            'Active, social, skill-building',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Spring', 'Summer'],
    budgetTier:            'mid',
    budgetRange:           '$2,200 – $4,000',
    attendanceRange:       '16 – 30',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Craft bartender or mixologist', 'Spirits and mixer vendor'],
    recommendedVenue:      'Kitchen amenity, bar area, or open space with counter access',

    setupNotes: [
      'Each resident needs a dedicated station: shaker, strainer, jigger, mixing glass, garnish',
      'Spirits pre-measured and laid out — this is a teaching session, not free-pour',
      'Bartender needs 60 minutes of setup before guests arrive',
      'Ice station must be sufficient — underestimate and the whole class stalls',
      'A demo counter visible to all residents for instruction segments',
      'Have a printed cocktail recipe card at each station to take home',
    ],
    staffingNotes: [
      '1 craft bartender as lead instructor — personality matters as much as skill',
      '1 assistant to manage ice, replenishment, and cleanup between rounds',
      '1 building staff for check-in and overall coordination',
      'Cap attendance at 30 — above this the instructor loses the room',
    ],
    luxuryNotes: [
      'Quality spirits (mid-shelf minimum) — residents notice and appreciate this',
      'Proper bar tools at each station, not dollar-store shakers',
      'A printed take-home recipe card with the cocktail names and ratios is the keepsake',
      'The bartender\'s narrative — history of the drink, technique rationale — elevates it from party to education',
    ],
    residentExperienceNotes: [
      'Residents leave knowing how to make at least one cocktail properly — lasting value',
      'The hands-on format creates natural conversation and friendly competition',
      'This event has high repeat-request rates — residents ask for it again',
    ],

    flyerHeadline:      'Learn to make it. Then drink it.',
    residentEmailIntro: 'We\'re bringing in a craft bartender this [month] for a proper cocktail making session — not just tasting, actually making. You\'ll learn the technique behind two classic cocktails and one seasonal variation, then drink everything you make. Recipe cards to take home.',
    suggestedUpgrades: [
      'Feature a spirit from a local distillery with a brand representative present',
      'Add a blind taste test round at the end to crown a "best cocktail" from the group',
      'Create a building cocktail recipe booklet after 3–4 sessions',
      'Offer a follow-up advanced session for residents who want to go deeper',
    ],
  },

  // ── WK-03 ─────────────────────────────────────────────────────────────────
  {
    id:          'ceramic-studio-evening',
    label:       'Ceramic Studio Evening',
    category:    'workshop',
    description: 'A hand-building ceramics session where residents create a small piece to take home after firing.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Fall'],

    formData: {
      eventType:   'Cooking Class',
      budget:      '$2,500 – $5,000',
      attendance:  '20 – 40 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed demographic',
      notes:       'Hand-building ceramics workshop. No wheel — hand-building only for a manageable format. Each resident creates one small piece (pinch pot, small bowl, or tile). Instructor fires pieces after the session and returns them to residents within 2 weeks. Wine throughout.',
    },

    atmosphere:            'Creative, tactile, unhurried',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic', 'Mature residents (50+)'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'mid',
    budgetRange:           '$2,000 – $3,800',
    attendanceRange:       '12 – 24',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Ceramics instructor with kiln access', 'Wine and beer vendor'],
    recommendedVenue:      'Amenity room or common space — must allow for clay and table mess',

    setupNotes: [
      'Cover all tables with canvas drop cloths or heavy paper — clay is permanent on fabric',
      'Each station: a fist-sized ball of clay, small bowl of water, wooden tools, sponge',
      'Instructor needs 45 minutes of setup before residents arrive',
      'Wine station separate from work area — clay and wine glasses don\'t mix well',
      'Have wipes and a washing station accessible throughout',
      'Label each piece with resident name on a small tag before firing',
    ],
    staffingNotes: [
      '1 ceramics instructor experienced with group hand-building formats',
      '1 building staff for check-in, wine service, and general support',
      'Instructor should circulate continuously — this format requires active teaching',
    ],
    luxuryNotes: [
      'The 2-week return of fired pieces extends the experience beyond the evening itself',
      'A small card with the piece — "Made at [Building Name], [Date]" — is a premium touch',
      'Good clay and proper tools: residents who\'ve done ceramics before will notice cheap materials',
      'The tactile nature of clay creates a meditative, unhurried quality that residents respond to',
    ],
    residentExperienceNotes: [
      'The take-home is the marketing — residents display their pieces and tell the story',
      'The 2-week return creates a second touchpoint and prolongs the positive feeling',
      'Cross-demographic appeal: this works for 25-year-olds and 65-year-olds equally',
    ],

    flyerHeadline:      'Make something with your hands. Pick it up in two weeks.',
    residentEmailIntro: 'We\'re setting up a ceramics studio in the building this [month]. A hand-building session led by a ceramics artist — you\'ll create a small piece, we\'ll have it fired, and you\'ll pick it up two weeks later. Wine throughout. No experience needed, just your hands.',
    suggestedUpgrades: [
      'Partner with a local ceramics studio for instructor sourcing and kiln access',
      'Offer a glaze selection at a follow-up pickup event — adds a second social moment',
      'Create a building ceramics display wall or shelf for residents to showcase their work',
      'Make it an annual event tied to a specific season for calendar anticipation',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY — 2 templates
// ─────────────────────────────────────────────────────────────────────────────

const FAMILY_TEMPLATES: LuxuryTemplate[] = [

  // ── F-01 ──────────────────────────────────────────────────────────────────
  {
    id:          'garden-cinema-evening',
    label:       'Garden Cinema Evening',
    category:    'family',
    description: 'An outdoor film screening with premium concessions and a relaxed lawn setup.',
    previewTags: ['Evening', 'Outdoor', 'No Alcohol', 'Summer'],

    formData: {
      eventType:   'Movie Night',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'No alcohol',
      demographic: 'Mixed ages, family-oriented',
      notes:       'Outdoor cinema evening on the lawn, courtyard, or pool deck. Premium concessions — not just popcorn. Blankets and lawn chairs provided. Family film selected in advance by resident poll. Start at dusk. Non-alcoholic only to ensure all-ages comfort.',
    },

    atmosphere:            'Warm, communal, all-ages relaxed',
    demographic:        ['Mixed ages, family-oriented', 'Mixed demographic'],
    idealSeasons:          ['Summer', 'Spring'],
    budgetTier:            'mid',
    budgetRange:           '$2,000 – $4,000',
    attendanceRange:       '30 – 70',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       false,
    vendorTypes:           ['Outdoor cinema rental (screen, projector, sound)', 'Premium concessions caterer'],
    recommendedVenue:      'Courtyard, lawn, pool deck, or any flat outdoor space',

    setupNotes: [
      'Screen and projector setup requires 3+ hours — confirm vendor load-in window',
      'Seating zones: blanket area (families/kids) closest to screen, chairs further back',
      'Concession station: popcorn (flavored, not just butter), lemonade, sparkling water, chocolate',
      'Start time should be at dusk — 8:30–9 PM in summer — not before it\'s properly dark',
      'Test audio levels before residents arrive — sound balance is always underestimated',
      'Have bug spray available at the concession station in summer months',
    ],
    staffingNotes: [
      '1 AV vendor to manage projection and sound throughout the screening',
      '1–2 building staff for setup, check-in, and concession management',
      'Staff should be visible during setup and arrival, minimal presence during the film',
    ],
    luxuryNotes: [
      'Premium concessions (flavored popcorn, good chocolate, real lemonade) differentiate this from a generic movie night',
      'Soft blankets available for lending — not cheap fleeces, something residents want to use',
      'A printed film program card is a charming, inexpensive premium touch',
      'The lawn setup itself, done well, is a genuine amenity moment for the building',
    ],
    residentExperienceNotes: [
      'The resident poll for film selection creates buy-in before the event even happens',
      'Families with children will remember this as a building highlight — loyalty driver',
      'The informal, relaxed atmosphere brings out residents who never attend formal events',
    ],

    flyerHeadline:      'Film under the sky. You pick the movie.',
    residentEmailIntro: 'We\'re setting up an outdoor cinema this [month] — a proper screen, premium concessions, and blankets on the lawn. Vote for the film below, then show up at dusk and settle in. All ages welcome. No ticket required.',
    suggestedUpgrades: [
      'Add a pre-film DJ set for the 30-minute arrival window',
      'Partner with a local ice cream truck or gelato vendor for a dessert close',
      'Make it an annual summer series — "The [Building Name] Cinema Club"',
      'Offer a brief trivia round related to the film before it starts',
    ],
  },

  // ── F-02 ──────────────────────────────────────────────────────────────────
  {
    id:          'poolside-family-social',
    label:       'Poolside Family Social',
    category:    'family',
    description: 'A daytime poolside gathering with family-friendly activities, food, and music.',
    previewTags: ['Daytime', 'Outdoor', 'No Alcohol', 'Summer'],

    formData: {
      eventType:   'Pool Party',
      budget:      '$2,500 – $5,000',
      attendance:  '50 – 100 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'No alcohol',
      demographic: 'Mixed ages, family-oriented',
      notes:       'All-ages poolside social. Daytime timing for families. Lawn games, a casual food spread (tacos, sliders, cold sides), premium non-alcoholic drinks (lemonade, agua fresca, sparkling water). Music at ambient level. Lifeguard required if pool is in active use.',
    },

    atmosphere:            'Festive, casual, summer energy',
    demographic:        ['Mixed ages, family-oriented', 'Mixed demographic'],
    idealSeasons:          ['Summer'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,500',
    attendanceRange:       '40 – 80',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       false,
    vendorTypes:           ['Food caterer (taco or slider bar format)', 'Non-alcoholic beverage vendor', 'Certified lifeguard (if pool in use)'],
    recommendedVenue:      'Pool deck and surrounding lawn or patio area',

    setupNotes: [
      'Confirm lifeguard certification and pool insurance compliance before any pool use',
      'Food station away from pool edge — 15-foot minimum clearance',
      'Lawn games (cornhole, bocce) set up on grass or hardscape areas',
      'Shade structures are essential for a daytime summer event — plan for them',
      'Coolers with cold water available throughout — hydration at a summer event is safety',
      'Music at conversation volume — children\'s events shouldn\'t require shouting',
    ],
    staffingNotes: [
      '1 certified lifeguard if pool is in active use (non-negotiable)',
      '2 caterer staff for food service',
      '1–2 building staff for setup, flow management, and guest relations',
      'Building management visible and welcoming throughout — this demographic notices',
    ],
    luxuryNotes: [
      'Agua fresca and premium lemonade in glass dispensers read significantly better than canned drinks',
      'Real food (tacos, sliders) over cheap hot dogs — the catering choice signals intent',
      'Shade and comfortable seating for adults who aren\'t swimming is always underestimated',
      'A small kids\' activity station (sidewalk chalk, bubbles) shows genuine consideration for families',
    ],
    residentExperienceNotes: [
      'Family residents have the highest loyalty when buildings demonstrate care for their children',
      'This event introduces neighbors with children to each other — a natural community builder',
      'Summer timing means lower resident presence — this event reminds people why they\'re glad to be home',
    ],

    flyerHeadline:      'The pool is open. Bring everyone.',
    residentEmailIntro: 'We\'re hosting a poolside social this [month] — food, lawn games, and a proper summer afternoon for the whole building. All ages welcome. We\'ll have the pool open, shade available, and plenty to eat and drink. Just show up.',
    suggestedUpgrades: [
      'Bring in a local taco or food truck vendor for a branded food moment',
      'Add a poolside DJ for a 2-hour midday set',
      'Partner with a local sunscreen or outdoor brand for a sample station',
      'Add a kids\' craft table run by a part-time activity coordinator',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEASONAL — 2 templates
// ─────────────────────────────────────────────────────────────────────────────

const SEASONAL_TEMPLATES: LuxuryTemplate[] = [

  // ── SE-01 ─────────────────────────────────────────────────────────────────
  {
    id:          'grand-pool-opening',
    label:       'Grand Pool Opening',
    category:    'seasonal',
    description: 'The season\'s first rooftop pool activation — a proper debut with cocktails and music.',
    previewTags: ['Afternoon', 'Outdoor', 'Full Bar', 'Summer'],

    formData: {
      eventType:   'Pool Party',
      budget:      '$5,000 – $10,000',
      attendance:  '50 – 100 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Season opening event for the rooftop pool. Cocktail bar, DJ at ambient-to-social level, premium poolside catering. Dress code: resort casual. This is a proper debut event, not a casual afternoon. Champagne or sparkling wine toast at opening.',
    },

    atmosphere:            'Celebratory, resort-feeling, aspirational',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Summer'],
    budgetTier:            'premium',
    budgetRange:           '$5,500 – $9,000',
    attendanceRange:       '50 – 90',
    staffingComplexity:    'high',
    operationalDifficulty: 'complex',
    alcoholIncluded:       true,
    vendorTypes:           ['Cocktail bar vendor', 'Poolside catering', 'DJ or music vendor', 'Event rental (furniture, lighting)', 'Certified lifeguard'],
    recommendedVenue:      'Rooftop pool deck — full space activation',

    setupNotes: [
      'Lifeguard is non-negotiable for any event with an active pool',
      'Bar setup on the deck requires rooftop load-in — confirm elevator and access timing',
      'Poolside furniture arrangement: lounge chairs in clusters, not hotel rows',
      'Opening toast moment at the start — champagne or sparkling rosé, pre-poured and distributed',
      'DJ briefed on ambient-to-social volume arc — builds through the afternoon',
      'Dress code communicated clearly in invite — "resort casual" sets the tone',
    ],
    staffingNotes: [
      '2 bartenders minimum for 60+ guests',
      '2 servers for passed bites and poolside service',
      '1 certified lifeguard for the duration',
      '1 building event lead for overall management',
      '1 DJ or music vendor',
    ],
    luxuryNotes: [
      'The opening toast is a signature moment — don\'t skip it, don\'t rush it',
      'Poolside furniture quality matters: beach towels laid on cheap chairs signal the wrong tier',
      'Signature summer cocktail with a building-specific name creates a talking point',
      'The "first time of the season" framing creates natural excitement — leverage it in copy',
    ],
    residentExperienceNotes: [
      'Residents anticipate this event from winter — it\'s a calendar anchor for the building',
      'The debut framing makes it feel like an occasion, not just a party',
      'High Instagram moment: rooftop, pool, skyline, golden light — lean into it',
    ],

    flyerHeadline:      'The pool is officially open. Summer starts now.',
    residentEmailIntro: 'It\'s time. The rooftop pool is opening for the season and we\'re doing it properly — cocktails, music, and a champagne toast to mark the moment. Resort casual. All residents welcome. This one\'s worth showing up for.',
    suggestedUpgrades: [
      'Commission a signature summer cocktail named after the building or neighborhood',
      'Partner with a local sunglasses or lifestyle brand for a resident gifting moment',
      'Hire a photographer for 2 hours of candid coverage — the content value is significant',
      'Add a frozen cocktail or frozen rosé station as a premium seasonal detail',
    ],
  },

  // ── SE-02 ─────────────────────────────────────────────────────────────────
  {
    id:          'grand-winter-salon',
    label:       'Grand Winter Salon',
    category:    'seasonal',
    description: 'The building\'s signature end-of-year gathering — elegant, warm, and genuinely worth attending.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],

    formData: {
      eventType:   'Holiday Party',
      budget:      '$10,000 – $25,000',
      attendance:  '75 – 150 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mixed demographic',
      notes:       'The building\'s annual winter celebration. Elegant but not formal. Full bar with champagne on arrival. Passed canapés and a proper food station. Live acoustic music or jazz. Rich seasonal decor — warm, not gimmicky. This is the event residents talk about in January.',
    },

    atmosphere:            'Warm, celebratory, sophisticated seasonal',
    demographic:        ['Mixed demographic', 'Young professionals (25–35)', 'Mature residents (50+)', 'Mixed ages, family-oriented'],
    idealSeasons:          ['Winter'],
    budgetTier:            'ultra',
    budgetRange:           '$10,000 – $20,000',
    attendanceRange:       '75 – 150',
    staffingComplexity:    'high',
    operationalDifficulty: 'complex',
    alcoholIncluded:       true,
    vendorTypes:           ['Full bar vendor with champagne service', 'Catering (passed canapés + food station)', 'Live music (jazz duo or acoustic trio)', 'Event décor and florals vendor', 'Event rental'],
    recommendedVenue:      'Full amenity floor, lobby, or largest common space in the building',

    setupNotes: [
      'Full vendor load-in requires a half-day window — plan accordingly',
      'Champagne poured and ready on trays for arrival — not at the bar',
      'Décor: warm winter palette, real greenery, candlelight — no tinsel, no cartoon Santas',
      'Food station in a separate zone from the bar to distribute guest flow',
      'Live music positioned where it adds atmosphere, not so loud it blocks conversation',
      'Have a designated coat check or area — winter guests arrive in layers',
    ],
    staffingNotes: [
      '3+ bartenders for 100+ guests',
      '3–4 servers for passed canapés and food station management',
      '1 coat check attendant',
      '1 building event director for overall management',
      'Live music: jazz duo, acoustic trio, or string quartet',
    ],
    luxuryNotes: [
      'Champagne on arrival is non-negotiable at this tier — it sets the tone immediately',
      'Real floral and greenery décor: eucalyptus, magnolia, amaryllis, candlelight',
      'The music choice defines the room — live jazz elevates every conversation happening around it',
      'Guests should feel the building went to genuine effort — that feeling is worth every dollar at this budget',
    ],
    residentExperienceNotes: [
      'This is the event that justifies the decision to live in this building',
      'Residents who attend become the strongest advocates for the community',
      'The annual nature creates anticipation — it becomes part of the building\'s identity',
    ],

    flyerHeadline:      'The evening this building has been building toward all year.',
    residentEmailIntro: 'Every year we close the season with something worth dressing for. This [year], we\'re opening the [space] for an evening of champagne, live music, and the company of everyone who makes this building what it is. Formal attire welcome. Casual equally so. Just come.',
    suggestedUpgrades: [
      'Commission a custom holiday cocktail named for the building and served exclusively that evening',
      'Hire a professional photographer for full-event coverage and a resident photo gallery afterward',
      'Add a champagne tower or coupe service moment as a visual centerpiece',
      'Partner with a luxury local brand (chocolatier, florist, wine shop) for a resident gift bag',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const ELEVE_TEMPLATES_11D: LuxuryTemplate[] = [
  ...NETWORKING_TEMPLATES,
  ...WORKSHOP_TEMPLATES,
  ...FAMILY_TEMPLATES,
  ...SEASONAL_TEMPLATES,
]

export { NETWORKING_TEMPLATES, WORKSHOP_TEMPLATES, FAMILY_TEMPLATES, SEASONAL_TEMPLATES }
