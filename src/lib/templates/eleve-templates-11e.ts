/**
 * eleve-templates-11e.ts
 *
 * Prompt 11E — Templates 21–30 for the Elevé luxury hospitality template library.
 * Categories: Luxury Pop-up (3), Culinary (2), Social (2), Wellness (1), Seasonal (2)
 *
 * Integration: merge ELEVE_TEMPLATES_11E into LUXURY_TEMPLATES in src/lib/templates.ts
 */

import type { LuxuryTemplate } from '@/lib/templates'

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY POP-UP — 3 templates
// ─────────────────────────────────────────────────────────────────────────────

const LUXURY_POPUP_TEMPLATES: LuxuryTemplate[] = [

  // ── LP-01 ─────────────────────────────────────────────────────────────────
  {
    id:          'the-champagne-residency',
    label:       'The Champagne Residency',
    category:    'luxury_popup',
    description: 'A one-night champagne and sparkling wine experience led by a Champagne specialist.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],

    formData: {
      eventType:   'Cocktail Reception',
      budget:      '$5,000 – $10,000',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mature residents (50+)',
      notes:       'Champagne and sparkling wine tasting led by a specialist. 5–6 expressions including grower Champagnes not found at retail. Paired with caviar service, blinis, and crème fraîche. Formal but warm in tone. Seated, intimate, maximum 24 residents.',
    },

    atmosphere:            'Celebratory, collector-grade, one-night-only',
    demographic:        ['Mature residents (50+)', 'Young professionals (25–35)'],
    idealSeasons:          ['Winter', 'Fall / Autumn'],
    budgetTier:            'premium',
    budgetRange:           '$5,500 – $9,500',
    attendanceRange:       '14 – 24',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Champagne specialist or sommelier', 'Caviar and fine foods vendor', 'Fine wine importer'],
    recommendedVenue:      'Private dining room or intimate clubroom, no background noise',

    setupNotes: [
      'Flute and coupe stems pre-set. Two per person minimum',
      'Champagne served at precise temperature, 47–50°F, confirm with specialist',
      'Caviar service: mother-of-pearl spoons only, never metal',
      'Blinis and crème fraîche pre-staged and replenished between pours',
      'Printed tasting notes at each seat with producer, region, and vintage',
      'Room should be silent during tasting commentary. Brief guests on format at arrival',
    ],
    staffingNotes: [
      '1 Champagne specialist to lead the tasting narrative',
      '1 trained server for pour service and caviar replenishment',
      '1 building staff for arrivals and coordination',
      'Staff should be briefed on the producers featured. Residents will ask questions',
    ],
    luxuryNotes: [
      'Grower Champagnes (récoltant-manipulant) that residents cannot source locally are the draw',
      'Caviar service, even a small, quality domestic option, elevates this beyond any wine tasting',
      'The specialist\'s narrative about each house or grower is the content of the evening',
      'Silence and attention during commentary is a luxury. Protect it with clear framing at arrival',
    ],
    residentExperienceNotes: [
      'Residents leave with genuine knowledge about Champagne they didn\'t have before',
      'The rarity of the bottles is a conversation topic that extends well beyond the evening',
      'This format appeals strongly to residents who have traveled in wine regions',
    ],

    flyerHeadline:      'Grower Champagnes. Caviar. Twenty-four seats.',
    residentEmailIntro: 'We\'ve arranged something genuinely special for this [month]: an evening with a Champagne specialist featuring grower expressions you won\'t find at retail, paired with caviar service. Twenty-four seats. Formal tasting format. RSVP required.',
    suggestedUpgrades: [
      'Source one prestige cuvée (Krug, Salon, Jacques Selosse) as the evening\'s centerpiece pour',
      'Commission a custom printed tasting booklet rather than a single card',
      'Offer residents the opportunity to order featured bottles through the specialist after the event',
      'Add a paired cheese course as an alternative to caviar for different palates',
    ],
  },

  // ── LP-02 ─────────────────────────────────────────────────────────────────
  {
    id:          'signature-chef-debut',
    label:       'Signature Chef Debut',
    category:    'luxury_popup',
    description: 'A one-night residency featuring a guest chef from a recognized local restaurant.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],

    formData: {
      eventType:   'Cooking Class',
      budget:      '$10,000 – $25,000',
      attendance:  '20 – 40 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mixed demographic',
      notes:       'Guest chef from a recognized local restaurant cooks a 5-course tasting menu exclusively for building residents. Chef introduces each course. Wine pairings by sommelier. The chef\'s name and restaurant are the draw. Source accordingly. 30 residents maximum.',
    },

    atmosphere:            'Restaurant-grade, exclusive, name-anchored',
    demographic:        ['Mature residents (50+)', 'Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'ultra',
    budgetRange:           '$10,000 – $18,000',
    attendanceRange:       '20 – 30',
    staffingComplexity:    'high',
    operationalDifficulty: 'complex',
    alcoholIncluded:       true,
    vendorTypes:           ['Guest chef and kitchen team', 'Sommelier for wine pairings', 'Event rental (if full kitchen not available)'],
    recommendedVenue:      'Full demonstration kitchen or catered amenity space with kitchen access',

    setupNotes: [
      'Chef requires a site visit and kitchen walkthrough 48–72 hours before the event',
      'Full kitchen equipment list from chef reviewed and confirmed in advance',
      'Place settings designed to match the chef\'s restaurant aesthetic where possible',
      'Printed menus with chef name, restaurant, and course descriptions at each seat',
      'Wine pairings briefed to sommelier by chef. They should collaborate in advance',
      'Chef introduction at the start of service sets the tone. Keep it brief and genuine',
    ],
    staffingNotes: [
      '1 guest chef plus their own kitchen team (typically 2–3 people)',
      '1 sommelier for wine pairing service',
      '1–2 front-of-house servers',
      '1 building event lead for overall coordination',
      'Do not mix building staff into kitchen operations. The chef\'s team owns that space',
    ],
    luxuryNotes: [
      'The chef\'s name and restaurant recognition is the entire luxury signal. Source carefully',
      'This format only works if the chef is genuinely notable. A catering company cannot substitute',
      'The exclusivity of 30 seats is what makes this worth the investment. Communicate it in every touchpoint',
      'A keepsake menu card signed by the chef at close costs nothing and creates a lasting artifact',
    ],
    residentExperienceNotes: [
      'Residents experience their building as a venue worthy of serious culinary talent',
      'The dinner becomes a story residents tell: "we had [chef name] cook in our building"',
      'This event sets a standard that defines the building\'s programming identity for years',
    ],

    flyerHeadline:      '[Chef Name] is cooking in the building. Thirty seats only.',
    residentEmailIntro: 'We\'re bringing [Chef Name] of [Restaurant] into the building for one evening: a five-course tasting menu cooked exclusively for residents, with wine pairings throughout. This is the real thing. Thirty seats. Reservations required.',
    suggestedUpgrades: [
      'Commission a short video of the chef preparing a course for social and building communications',
      'Offer residents a post-dinner reservation at the chef\'s restaurant at a preferred rate',
      'Create an annual "Chef in Residence" series with a different chef each season',
      'Add a pre-dinner kitchen preview for 5 residents. A true VIP tier within the event',
    ],
  },

  // ── LP-03 ─────────────────────────────────────────────────────────────────
  {
    id:          'resident-art-opening',
    label:       'Resident Art Opening',
    category:    'luxury_popup',
    description: 'A curated gallery opening featuring work by resident artists or a commissioned local artist.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Spring'],

    formData: {
      eventType:   'Cocktail Reception',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Spring',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed demographic',
      notes:       'Gallery-style opening reception featuring work by a resident artist or commissioned local artist. Works displayed in lobby, hallways, or amenity space. Artist present for the opening. Wine and light bites. Optional: works available for purchase with commission benefiting the artist.',
    },

    atmosphere:            'Cultural, convivial, community-proud',
    demographic:        ['Mixed demographic', 'Young professionals (25–35)', 'Mature residents (50+)'],
    idealSeasons:          ['Spring', 'Fall / Autumn'],
    budgetTier:            'mid',
    budgetRange:           '$2,000 – $4,000',
    attendanceRange:       '30 – 60',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       true,
    vendorTypes:           ['Artist (resident or commissioned local)', 'Art hanging and installation vendor', 'Wine and beer vendor'],
    recommendedVenue:      'Lobby, hallways, amenity space. Anywhere art can be properly hung and lit',

    setupNotes: [
      'Professional picture hanging with proper gallery hardware, not command strips',
      'Track lighting or spotlights on each piece where possible. Lighting is everything in art display',
      'Work labels: title, medium, dimensions, artist name: printed and framed, not handwritten',
      'Artist present for the first 90 minutes minimum. Their presence is the event',
      'Wine station positioned so guests flow through the art, not around it',
      'If works are for sale, have a simple price list and purchase process prepared in advance',
    ],
    staffingNotes: [
      'The artist is the primary host. Brief them on the format and expected questions',
      '1 building staff for wine management and general coordination',
      'No additional servers needed at this scale. Self-serve wine is appropriate',
    ],
    luxuryNotes: [
      'Gallery-quality installation (proper hanging, lighting, labels) is the entire difference between this and a craft fair',
      'The artist\'s presence transforms it from a display into an event',
      'Works remaining on display for 2–4 weeks after the opening extends the value significantly',
      'A simple printed exhibition card with artist bio signals curatorial intent',
    ],
    residentExperienceNotes: [
      'Discovering a talented artist lives in the building creates genuine pride and connection',
      'The art remaining on display means every resident sees it, not just those who attended',
      'This format reveals the building\'s community in a way no social event can',
    ],

    flyerHeadline:      'The gallery is the building. The artist lives here.',
    residentEmailIntro: 'This [month] we\'re opening a gallery. Right here in the building. Works by [Artist Name], a resident whose work deserves a proper showing. Wine, conversation, and the artist present all evening. Come see what\'s been made in your building.',
    suggestedUpgrades: [
      'Commission a site-specific piece for the lobby that becomes a permanent building installation',
      'Partner with a local gallery to co-present the opening for added cultural credibility',
      'Create a printed exhibition catalogue as a take-home for attendees',
      'Offer a follow-up artist talk or studio visit for interested residents',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CULINARY — 2 additional templates
// ─────────────────────────────────────────────────────────────────────────────

const CULINARY_ADDITIONAL: LuxuryTemplate[] = [

  // ── CA-01 ─────────────────────────────────────────────────────────────────
  {
    id:          'craft-cocktail-brunch',
    label:       'Craft Cocktail Brunch',
    category:    'culinary',
    description: 'A weekend brunch elevated with a craft cocktail bar, a chef\'s spread, and a relaxed social format.',
    previewTags: ['Morning', 'Indoor & Outdoor', 'Full Bar', 'Spring'],

    formData: {
      eventType:   'Brunch Gathering',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Spring',
      venue:       'Indoor & Outdoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Weekend brunch with a craft cocktail bar: Bloody Marys, spritzes, mimosas with premium juice. Chef-prepared spread: eggs station, smoked salmon, pastries, seasonal fruit. Relaxed, social format. 11 AM – 2 PM timing. No assigned seating.',
    },

    atmosphere:            'Relaxed, social, weekend-premium',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Spring', 'Summer'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,500',
    attendanceRange:       '30 – 60',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Brunch caterer with live egg station', 'Craft cocktail bartender'],
    recommendedVenue:      'Amenity space with indoor-outdoor flow. Terrace or courtyard adjacent',

    setupNotes: [
      'Live egg station is the anchor. Position it as a visible focal point',
      'Craft cocktail bar at the entrance so guests are welcomed with a drink in hand',
      'Buffet spread arranged by category: savory, smoked, pastry, fruit, not all mixed',
      'Tables for grazing, not assigned dining. This is a social, not a seated brunch',
      'Music at ambient weekend volume: relaxed, not brunch-playlist cliché',
      'Run the full 3-hour window: late arrivals at 1 PM should still feel welcomed',
    ],
    staffingNotes: [
      '1 craft bartender for cocktail service',
      '1 chef for the live egg station',
      '1–2 servers for buffet management and replenishment',
      '1 building staff for check-in and overall coordination',
    ],
    luxuryNotes: [
      'Premium juice for mimosas (fresh-pressed, not carton) is a detail residents notice immediately',
      'The Bloody Mary bar should have proper garnish depth, not just celery',
      'Smoked salmon on the spread signals premium over standard brunch catering',
      'Linen napkins, not paper. The weekend deserves it',
    ],
    residentExperienceNotes: [
      'Weekend timing serves residents who work long weekday hours, high attendance potential',
      'The social format (no assigned seating) encourages organic mingling',
      'This is the format most likely to become a recurring resident request',
    ],

    flyerHeadline:      'Weekend. Brunch. Craft cocktails. Yours.',
    residentEmailIntro: 'We\'re doing brunch properly this [month]: a chef\'s spread, a craft cocktail bar, and a few hours to slow down with your neighbors. No reservations, no assigned seats. Just show up between 11 and 2.',
    suggestedUpgrades: [
      'Add a bottomless mimosa option with a 90-minute window',
      'Partner with a local bakery for a featured pastry or bread as a named item',
      'Bring in a jazz duo for a 90-minute live set during peak hours',
      'Add a fresh juice bar alongside the cocktail station for a non-alcoholic premium option',
    ],
  },

  // ── CA-02 ─────────────────────────────────────────────────────────────────
  {
    id:          'bourbon-and-provisions',
    label:       'Bourbon & Provisions',
    category:    'culinary',
    description: 'An intimate bourbon tasting paired with artisan provisions: charcuterie, aged cheese, and smoked goods.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Fall'],

    formData: {
      eventType:   'Bourbon & Cigar Evening',
      budget:      '$2,500 – $5,000',
      attendance:  '20 – 40 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mature residents (50+)',
      notes:       'Guided bourbon tasting: 4–5 expressions across different mash bills and age statements. Paired with artisan charcuterie, aged cheeses, smoked nuts, and dark chocolate. Led by a spirits specialist or knowledgeable brand ambassador. Intimate, seated format. No cigars unless outdoor space permits.',
    },

    atmosphere:            'Masculine-leaning, warm, unhurried',
    demographic:        ['Mature residents (50+)', 'Young professionals (25–35)'],
    idealSeasons:          ['Fall / Autumn', 'Winter'],
    budgetTier:            'mid',
    budgetRange:           '$2,200 – $4,000',
    attendanceRange:       '16 – 30',
    staffingComplexity:    'low',
    operationalDifficulty: 'easy',
    alcoholIncluded:       true,
    vendorTypes:           ['Spirits specialist or bourbon brand ambassador', 'Artisan charcuterie and cheese vendor'],
    recommendedVenue:      'Clubroom or lounge: warm lighting, comfortable seating essential',

    setupNotes: [
      'Pre-set Glencairn or rocks glasses at each seat, not standard tumblers',
      'Tasting pours pre-measured by the specialist before service',
      'Provisions boards as centerpieces: generous, not sparse',
      'Water and plain crackers available for palate cleansing between pours',
      'Printed tasting notes with mash bill, age statement, and distillery at each seat',
      'Warm amber lighting only. This format demands atmosphere',
    ],
    staffingNotes: [
      '1 spirits specialist or knowledgeable brand ambassador to lead',
      '1 building staff for arrivals and provisions management',
      'No additional servers needed at this intimate scale',
    ],
    luxuryNotes: [
      'Proper Glencairn glasses signal that this is a serious tasting, not cocktail hour',
      'The provisions pairing narrative, why this cheese with this bourbon, elevates the specialist\'s role',
      'Sourcing one allocated or hard-to-find expression as the final pour creates a talking point',
      'Dark chocolate as the final pairing is both correct and memorable',
    ],
    residentExperienceNotes: [
      'This format appeals strongly to residents who collect or follow American whiskey',
      'The provisions pairing creates a food-and-drink education moment that outlasts the evening',
      'Intimate headcount (under 30) ensures genuine conversation and unhurried pacing',
    ],

    flyerHeadline:      'Four bourbons. Serious provisions. One evening.',
    residentEmailIntro: 'We\'re gathering this [month] for a guided bourbon tasting paired with artisan charcuterie, aged cheese, and smoked provisions. A spirits specialist leads. Proper glasses, proper pours, no rush. Space is limited to thirty residents.',
    suggestedUpgrades: [
      'Feature one allocated bourbon (Pappy, BTAC, or similar) as a paid-upgrade final pour',
      'Add a cigar option if an outdoor space is available and compliant',
      'Partner with a local distillery for a featured expression and distiller presence',
      'Create a printed "bourbon card" residents can use to continue their own exploration',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL — 2 additional templates
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_ADDITIONAL: LuxuryTemplate[] = [

  // ── SA-01 ─────────────────────────────────────────────────────────────────
  {
    id:          'rooftop-cinema-evening',
    label:       'Rooftop Cinema Evening',
    category:    'social',
    description: 'A curated film screening on the rooftop with craft cocktails and premium concessions.',
    previewTags: ['Evening', 'Outdoor', 'Full Bar', 'Summer'],

    formData: {
      eventType:   'Movie Night',
      budget:      '$2,500 – $5,000',
      attendance:  '30 – 60 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Rooftop film screening for adults. Craft cocktail bar, not just beer. Curated film selected for the audience (not a family film). Premium concessions: flavored popcorn, charcuterie boxes, sparkling water. Blankets and lounge seating. Start at dusk.',
    },

    atmosphere:            'Cinematic, social, rooftop-premium',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Summer', 'Spring'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,500',
    attendanceRange:       '25 – 55',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Outdoor cinema rental (screen, projector, sound)', 'Craft cocktail bartender', 'Premium concessions caterer'],
    recommendedVenue:      'Rooftop terrace or elevated outdoor space with clear sightlines',

    setupNotes: [
      'Screen orientation confirmed for minimal light interference at dusk',
      'Cocktail bar set up away from screen so service doesn\'t interrupt the film',
      'Lounge seating clusters, not rows of chairs, so it feels social, not theater',
      'Blankets available: one per seat, soft quality',
      'Concession boxes pre-packed and distributed at arrival rather than during the film',
      'Audio test critical. Rooftop acoustics vary significantly by building',
    ],
    staffingNotes: [
      '1 AV technician for projection and sound management throughout',
      '1 craft bartender for pre-film service (bar closes at film start)',
      '1 building staff for setup and arrivals',
      'Bar should close or go self-serve once the film begins to minimize noise',
    ],
    luxuryNotes: [
      'Film curation matters. A thoughtful choice signals that someone considered the audience',
      'Pre-packed concession boxes eliminate service noise during the film',
      'The cocktail bar being premium (not just beer) separates this from a generic movie night',
      'Lounge seating with blankets creates a boutique hotel rooftop feeling',
    ],
    residentExperienceNotes: [
      'The rooftop setting makes this feel like a private screening, not a building event',
      'Film selection by resident poll creates engagement before the event happens',
      'Social clusters in the seating mean conversation before the film, not just during',
    ],

    flyerHeadline:      'Rooftop. Film. Craft cocktails. Dusk.',
    residentEmailIntro: 'We\'re screening [Film Title] on the rooftop this [month]: craft cocktails before the film, premium concessions, and the city behind the screen. Lounge seating, blankets provided. Show up at dusk.',
    suggestedUpgrades: [
      'Add a short film or director\'s cut extra feature before the main film',
      'Partner with a local cinema or film festival for co-branding and curation credibility',
      'Create a signature cocktail themed to the film being screened',
      'Offer a post-film discussion for residents who want to linger and talk',
    ],
  },

  // ── SA-02 ─────────────────────────────────────────────────────────────────
  {
    id:          'the-rooftop-residency',
    label:       'The Rooftop Residency',
    category:    'social',
    description: 'A recurring rooftop social series. The building\'s signature warm-season gathering.',
    previewTags: ['Evening', 'Outdoor', 'Full Bar', 'Summer'],

    formData: {
      eventType:   'Rooftop Social',
      budget:      '$2,500 – $5,000',
      attendance:  '50 – 100 residents',
      season:      'Summer',
      venue:       'Indoor & Outdoor',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Monthly or bi-monthly rooftop social during warm months. The building\'s signature recurring event. Consistent format: craft bar, rotating food concept (different caterer or theme each edition), ambient music. The "Residency" name signals a series, not a one-off.',
    },

    atmosphere:            'Signature, recurring, building-identity',
    demographic:        ['Young professionals (25–35)', 'Mixed demographic'],
    idealSeasons:          ['Spring', 'Summer'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,500',
    attendanceRange:       '40 – 80',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Craft cocktail bartender', 'Rotating food vendor (different each edition)', 'Ambient music (DJ or live)'],
    recommendedVenue:      'Rooftop terrace. Same space every edition for brand consistency',

    setupNotes: [
      'Consistent setup format edition to edition: same furniture layout, same bar position',
      'Rotate the food concept each edition to give regulars a reason to return',
      'A consistent name, visual identity, and start time builds calendar anticipation',
      'Edition number or theme printed on a small card at the bar: "Edition 3, Summer"',
      'Music arc: ambient on arrival, builds to social level by 8 PM',
      'Weather contingency plan documented and communicated in advance each edition',
    ],
    staffingNotes: [
      '2 bartenders for consistent service quality',
      '1–2 food vendor staff depending on concept',
      '1 building event lead. The same person each edition builds familiarity',
      '1 DJ or ambient music provider. Consistent presence builds identity',
    ],
    luxuryNotes: [
      'The series format is itself the luxury signal. It implies permanence and curation',
      'Edition numbering creates collector psychology. Residents want to not miss one',
      'A consistent signature cocktail across all editions becomes a building trademark',
      'The rotating food concept keeps the format fresh without changing its identity',
    ],
    residentExperienceNotes: [
      'Recurring events build community more effectively than one-off events ever can',
      'Residents who miss an edition feel FOMO. That\'s the correct response to engineer',
      'The "Residency" positioning makes this feel like a cultural institution, not programming',
    ],

    flyerHeadline:      'The Rooftop Residency. Edition [N]. This [Month].',
    residentEmailIntro: 'The Rooftop Residency is back for Edition [N]: this time featuring [food concept] and [music]. Same rooftop, same craft bar, something different every time. See you up there.',
    suggestedUpgrades: [
      'Create a printed "Residency Passport" card that residents collect a stamp for each edition',
      'Feature a different local food vendor or restaurant pop-up each edition for discovery value',
      'Commission a consistent visual identity (poster design) for each edition',
      'At Edition 6 or 12, host a "Residency Anniversary" edition with elevated production',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// WELLNESS — 1 additional template
// ─────────────────────────────────────────────────────────────────────────────

const WELLNESS_ADDITIONAL: LuxuryTemplate[] = [

  // ── WA-01 ─────────────────────────────────────────────────────────────────
  {
    id:          'private-spa-morning',
    label:       'Private Spa Morning',
    category:    'wellness',
    description: 'A curated morning of wellness treatments brought directly into the building\'s amenity space.',
    previewTags: ['Morning', 'Indoor', 'Non-Alcoholic', 'Winter'],

    formData: {
      eventType:   'Wellness & Yoga Morning',
      budget:      '$2,500 – $5,000',
      attendance:  '20 – 40 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'No alcohol',
      demographic: 'Mixed demographic',
      notes:       'Mobile spa pop-up in the amenity space. 3–4 treatment stations: massage (chair or table), facials, hand treatments, scalp massage. Residents book 20-minute slots in advance. Herbal tea, infused water, light wellness refreshments. Calm music, dim lighting. A genuine spa morning, not a beauty demo.',
    },

    atmosphere:            'Therapeutic, indulgent, private',
    demographic:        ['Mature residents (50+)', 'Mixed demographic', 'Young professionals (25–35)'],
    idealSeasons:          ['Winter', 'Fall / Autumn'],
    budgetTier:            'mid',
    budgetRange:           '$2,500 – $4,500',
    attendanceRange:       '15 – 30',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       false,
    vendorTypes:           ['Mobile spa vendor (licensed therapists)', 'Wellness catering (tea, infused water, light bites)'],
    recommendedVenue:      'Amenity lounge or multipurpose room: private, quiet, warm',

    setupNotes: [
      'Treatment stations partitioned or spaced for privacy, screens if needed',
      'Appointment booking system set up 1 week in advance. 20-minute slots per treatment',
      'Therapists need 30 minutes of setup time per station before first appointment',
      'Warming herbal teas and infused water available in the waiting area throughout',
      'Dim lighting and calm music from the moment the space opens',
      'Confirm all therapists are licensed and insured before the event',
    ],
    staffingNotes: [
      '3–4 licensed therapists (one per treatment station)',
      '1 building staff for appointment management and guest flow',
      'No additional servers. Self-serve wellness refreshments are appropriate',
      'Appointment confirmation sent to residents 24 hours before their slot',
    ],
    luxuryNotes: [
      'Licensed professionals only. This is a non-negotiable at any tier',
      'The appointment format creates the spa experience. Walk-in would undermine it',
      'Quality product use by therapists (not dollar-store massage oil) is noticed',
      'A small take-home, a sample moisturizer, a tea bag, a wellness card, extends the feeling',
    ],
    residentExperienceNotes: [
      'The rarity of spa access in a residential building is a genuine amenity differentiator',
      'The appointment format respects residents\' time and signals organization',
      'This event appeals strongly to residents who value self-care but lack time to seek it out',
    ],

    flyerHeadline:      'The spa is coming to you. Book your slot.',
    residentEmailIntro: 'This [month] we\'re bringing the spa to the building: massage, facials, and restorative treatments, right here in the amenity space. Appointments are 20 minutes each and spaces are limited. Book your slot below before they\'re gone.',
    suggestedUpgrades: [
      'Partner with a premium skincare brand for product use and a small take-home sample',
      'Add a 30-minute guided meditation session for residents waiting for their appointment',
      'Offer a couples slot (two stations side by side) for resident pairs',
      'Make it a quarterly event, "The [Building Name] Spa Morning," for recurring anticipation',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SEASONAL — 2 additional templates
// ─────────────────────────────────────────────────────────────────────────────

const SEASONAL_ADDITIONAL: LuxuryTemplate[] = [

  // ── SEA-01 ────────────────────────────────────────────────────────────────
  {
    id:          'harvest-supper-series',
    label:       'Harvest Supper Series',
    category:    'seasonal',
    description: 'A multi-course autumn supper built around peak-season local ingredients and communal dining.',
    previewTags: ['Evening', 'Indoor', 'Wine & Beer', 'Fall'],

    formData: {
      eventType:   'Brunch Gathering',
      budget:      '$5,000 – $10,000',
      attendance:  '30 – 60 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed demographic',
      notes:       'Autumn harvest supper: a multi-course seated dinner featuring peak fall ingredients. Farm sourcing named and credited. Natural wine and craft cider pairings. Long communal table format. Chef introduces each course. Warm, candlelit, unhurried. This is the fall equivalent of the Grand Winter Salon.',
    },

    atmosphere:            'Harvest-warm, unhurried, ingredient-focused',
    demographic:        ['Mixed demographic', 'Mature residents (50+)', 'Young professionals (25–35)'],
    idealSeasons:          ['Fall / Autumn'],
    budgetTier:            'premium',
    budgetRange:           '$5,000 – $8,500',
    attendanceRange:       '30 – 55',
    staffingComplexity:    'high',
    operationalDifficulty: 'complex',
    alcoholIncluded:       true,
    vendorTypes:           ['Farm-to-table chef or caterer', 'Natural wine and cider vendor', 'Décor and floral vendor (seasonal)'],
    recommendedVenue:      'Large amenity space or dining room. Long communal table format',

    setupNotes: [
      'Long communal table: single table if possible, two parallel tables if not',
      'Natural linen, beeswax candles, and seasonal botanicals: no floristry, no arrangements',
      'Menu printed on kraft or natural paper stock. The aesthetic extends to every touchpoint',
      'Chef introduces each course at the table: no PA system, just a moment of quiet',
      'Farm credits on the menu: "Squash from [Farm Name], [County]"',
      'Natural wine and craft cider, not standard commercial wine at this format',
    ],
    staffingNotes: [
      '1 chef with 1–2 kitchen assistants',
      '2 servers for a table of 40–55 guests',
      '1 building event lead for overall management',
      'Chef should be present and visible throughout. They are the host of this evening',
    ],
    luxuryNotes: [
      'The sourcing story is inseparable from the luxury. Name every farm, every ingredient origin',
      'Natural wine and cider signals intentionality that standard wine service cannot',
      'Candlelight and natural materials are the entire aesthetic. Don\'t compete with additional décor',
      'The chef\'s course introductions are the content of the evening, not interruptions to it',
    ],
    residentExperienceNotes: [
      'This event positions the building as culturally aware and food-literate',
      'The communal format forces the kind of conversations residents remember for months',
      'Autumn timing creates a sense of occasion. The season itself is part of the luxury',
    ],

    flyerHeadline:      'Peak season. Long table. One autumn evening.',
    residentEmailIntro: 'This [month] we\'re marking the season properly: a harvest supper at a long communal table, built entirely from peak fall ingredients sourced from named local farms. Natural wine, craft cider, and a chef who will tell you where every dish came from. Reservations required.',
    suggestedUpgrades: [
      'Invite the sourcing farmer to attend the first course and speak briefly about the season',
      'Add a natural wine merchant as a featured guest to introduce each pairing',
      'Commission a custom harvest menu printed on seed paper that residents can plant afterward',
      'Create an annual harvest supper series, "The [Building Name] Harvest Table," as a calendar institution',
    ],
  },

  // ── SEA-02 ────────────────────────────────────────────────────────────────
  {
    id:          'new-year-champagne-social',
    label:       'New Year Champagne Social',
    category:    'seasonal',
    description: 'An elegant New Year\'s Eve pre-celebration for residents: champagne, canapés, and a midnight toast.',
    previewTags: ['Evening', 'Indoor', 'Full Bar', 'Winter'],

    formData: {
      eventType:   'Holiday Party',
      budget:      '$5,000 – $10,000',
      attendance:  '30 – 60 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mixed demographic',
      notes:       'New Year\'s Eve champagne social: an elegant pre-midnight gathering in the building. Champagne on arrival. Passed canapés throughout. A midnight toast with a featured Champagne or sparkling wine. No DJ, acoustic or curated playlist only. Ends at midnight or shortly after. Smart dress.',
    },

    atmosphere:            'Celebratory, elegant, occasion-defining',
    demographic:        ['Mixed demographic', 'Mature residents (50+)', 'Young professionals (25–35)'],
    idealSeasons:          ['Winter'],
    budgetTier:            'premium',
    budgetRange:           '$5,000 – $9,000',
    attendanceRange:       '30 – 60',
    staffingComplexity:    'medium',
    operationalDifficulty: 'moderate',
    alcoholIncluded:       true,
    vendorTypes:           ['Champagne and full bar vendor', 'Canapé caterer', 'Acoustic musician or curated playlist vendor'],
    recommendedVenue:      'Clubroom, amenity lounge, or lobby space, warm and intimate',

    setupNotes: [
      'Champagne poured on trays and ready at the entrance for arrival',
      'Midnight toast Champagne pre-poured in coupes and distributed at 11:50 PM',
      'Canapés passed continuously. Do not switch to a buffet format on New Year\'s Eve',
      'Countdown clock visible from the main social area',
      'Acoustic musician for the first 2 hours, curated playlist for the final hour',
      'Smart dress code communicated clearly. Residents want to dress up for this',
    ],
    staffingNotes: [
      '2 bartenders for full bar service',
      '2–3 servers for continuous canapé passing',
      '1 building event lead for overall management',
      '1 acoustic musician for the first 2 hours',
      'Staff should be well-presented. This is the year\'s most visible event',
    ],
    luxuryNotes: [
      'The midnight toast is the entire event. Everything before it is the anticipation',
      'Pre-poured coupes for the toast distributed at 11:50 PM signals choreography and care',
      'Acoustic music over a DJ creates the warmth and intimacy appropriate for this format',
      'The quality of the midnight Champagne matters. Source something genuinely worth toasting with',
    ],
    residentExperienceNotes: [
      'Residents who spend New Year\'s Eve in the building will feel proud of their decision',
      'This is the event most likely to be mentioned when residents recommend their building to others',
      'The midnight moment is the memory. Everything before it enables that moment',
    ],

    flyerHeadline:      'Ring in the new year right here. Champagne at midnight.',
    residentEmailIntro: 'We\'re hosting New Year\'s Eve in the building this year: an elegant champagne social to close out [Year] with your neighbors. Champagne on arrival, canapés throughout, and a proper midnight toast. Smart dress. No plans needed, just come downstairs.',
    suggestedUpgrades: [
      'Feature a prestige Champagne for the midnight toast as a named, memorable moment',
      'Add a photo booth or photographer for the midnight countdown moment',
      'Create a custom "New Year\'s Eve Menu" card as a keepsake for each resident',
      'Offer a late-night small bites station that opens at midnight for residents who want to linger',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const ELEVE_TEMPLATES_11E: LuxuryTemplate[] = [
  ...LUXURY_POPUP_TEMPLATES,
  ...CULINARY_ADDITIONAL,
  ...SOCIAL_ADDITIONAL,
  ...WELLNESS_ADDITIONAL,
  ...SEASONAL_ADDITIONAL,
]

export {
  LUXURY_POPUP_TEMPLATES,
  CULINARY_ADDITIONAL,
  SOCIAL_ADDITIONAL,
  WELLNESS_ADDITIONAL,
  SEASONAL_ADDITIONAL,
}
