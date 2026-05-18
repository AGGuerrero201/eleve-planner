/**
 * templates.ts
 * Eight pre-written luxury event plans. Each satisfies EventPlan exactly —
 * the same shape Claude returns — so they flow through every existing
 * component untouched. No Claude call required.
 */

import type { EventFormData, EventPlan } from '@/types'

// ─── Template wrapper type ────────────────────────────────────────────────────

export interface LuxuryTemplate {
  id: string
  label: string
  description: string
  category: 'social' | 'wellness' | 'seasonal' | 'family' | 'professional'
  previewTags: string[]
  formData: EventFormData
  plan: EventPlan
}

// ─── Templates ────────────────────────────────────────────────────────────────

export const LUXURY_TEMPLATES: LuxuryTemplate[] = [

  // ── 1. Rooftop Soirée ─────────────────────────────────────────────────────
  {
    id: 'rooftop-soiree',
    label: 'Rooftop Soirée',
    description: 'An elevated summer cocktail evening under the open sky.',
    category: 'social',
    previewTags: ['Outdoor', 'Full Bar', 'Summer'],
    formData: {
      eventType: 'Rooftop Social',
      budget: '$5,000 – $10,000',
      attendance: '50 – 100 residents',
      season: 'Summer',
      venue: 'Outdoor',
      alcohol: 'Full bar',
      demographic: 'Young professionals (25–35)',
      notes: '',
    },
    plan: {
      title: 'Golden Hour Rooftop Soirée',
      tagline: 'Where the city meets the sky',
      flyerHeadline: 'Drinks Above the Skyline This Summer',
      overview:
        'An intimate open-air cocktail evening on the rooftop terrace, timed to begin at golden hour and carry into the night. Residents mingle across lounge zones framed by string lights, potted citrus trees, and a full craft cocktail bar. The atmosphere is relaxed but undeniably elevated — the kind of evening residents talk about all summer.',
      theme:
        'Warm amber and ivory tones throughout. Rattan lounge furniture, linen throw pillows, lantern clusters, and potted greenery break the rooftop into intimate conversation zones. String lights overhead transition from sunset gold to soft white as evening falls.',
      timeline: [
        { time: '6:30 PM', activity: 'Staff briefing & final bar setup check', responsible: 'Event Lead' },
        { time: '7:00 PM', activity: 'Doors open — greeter welcomes residents, welcome drink handed at entry', responsible: 'Staff' },
        { time: '7:00 PM', activity: 'Passed appetisers begin — two servers circulating continuously', responsible: 'Catering' },
        { time: '7:45 PM', activity: 'Golden hour peak — music lifts slightly, Instagram moment lighting optimal', responsible: 'Property Manager' },
        { time: '8:30 PM', activity: 'Stationary grazing board revealed at central table', responsible: 'Catering' },
        { time: '9:30 PM', activity: 'Last call announced — 30 minutes before close', responsible: 'Event Lead' },
        { time: '10:00 PM', activity: 'Event closes, breakdown begins', responsible: 'Staff' },
      ],
      catering: [
        'Passed prosciutto crostini with whipped ricotta and fig jam on slate boards',
        'Mini lobster rolls in toasted brioche, served chilled with lemon aioli',
        'Caprese skewers with burrata, heirloom tomato, and basil oil drizzle',
        'Central grazing board with aged cheeses, charcuterie, olives, and seasonal fruit',
        'Passed dark chocolate bark with sea salt and candied orange — dessert close',
      ],
      entertainment: [
        'Live acoustic duo (jazz/bossa nova) playing from 7–9 PM, transitioning to curated playlist',
        'Polaroid photo station with branded backdrop and instant prints for residents to keep',
        'Skyline trivia card at each table — light conversation starter, no host required',
      ],
      logistics: [
        'Confirm rooftop capacity and fire code limit 2 weeks before — cap RSVPs at 80% of legal max',
        'Coordinate elevator access with building management for catering load-in at 4 PM',
        'Have a weather contingency plan ready — adjacent lounge as fallback with 48-hour decision window',
        'Printed directional signage from lobby elevator to rooftop — no handwritten signs',
      ],
      budgetBreakdown: [
        'Catering & food: 35% (~$2,975)',
        'Bar & beverages: 30% (~$2,550)',
        'Entertainment (live duo): 15% (~$1,275)',
        'Décor & florals: 12% (~$1,020)',
        'Staffing: 8% (~$680)',
      ],
      vendorIdeas: [
        {
          category: 'Catering',
          suggestions: ['Local upscale tapas caterer', 'Hotel banquet team for passed service'],
          estimatedCost: '$2,500 – $3,500',
        },
        {
          category: 'Bar Service',
          suggestions: ['Licensed mobile bar company with craft cocktail menu', 'In-house bar staff with curated wine/spirit selection'],
          estimatedCost: '$1,800 – $2,800',
        },
        {
          category: 'Music & Entertainment',
          suggestions: ['Local acoustic jazz duo via GigSalad or direct booking', 'Curated Spotify playlist as free fallback'],
          estimatedCost: '$600 – $1,200',
        },
        {
          category: 'Décor & Florals',
          suggestions: ['Event rental company for rattan furniture and string lights', 'Local florist for potted citrus trees and table arrangements'],
          estimatedCost: '$800 – $1,400',
        },
      ],
      staffing: [
        { role: 'Event Lead', count: 1, notes: 'Oversees timeline, manages vendors, floats and engages residents' },
        { role: 'Greeter', count: 1, notes: 'Stationed at rooftop entry for first 45 minutes, hands welcome drink' },
        { role: 'Bartender', count: 2, notes: 'One craft cocktail specialist, one beer/wine station' },
        { role: 'Server', count: 2, notes: 'Passed appetisers from 7–9 PM, then stationary board maintenance' },
      ],
      alcoholEstimate: {
        servingsPerPerson: 3,
        totalBottles: '18 bottles of wine + 3 cases of beer + 8 bottles of spirits',
        recommendations: [
          'Aperol Spritz or Elderflower Gin & Tonic as the signature welcome cocktail',
          'Sauvignon Blanc and Rosé for white/pink wine station',
          'Local craft IPA and a session lager for beer selection',
          'Premium sparkling water and hibiscus mocktail as non-alcoholic anchors',
        ],
        estimatedCost: '$1,800 – $2,400',
      },
      setupLogistics: [
        '2:00 PM — Rental furniture delivery; staff place lounge zones per floor plan',
        '3:30 PM — String lights installed and tested; potted greenery positioned',
        '4:00 PM — Catering team arrives, kitchen prep and cold storage confirmed',
        '5:00 PM — Bar build: spirit bottles stocked, glassware polished, garnish trays prepped',
        '6:00 PM — Music sound check with duo; playlist queued as backup',
        '6:30 PM — Full staff briefing: timeline, roles, emergency contacts reviewed',
        '7:00 PM — Doors open',
      ],
      residentEmail: {
        subject: 'You\'re invited: Rooftop Soirée this Saturday at sunset 🌅',
        body: 'Dear [Building Name] Residents,\n\nWe\'re hosting our summer Rooftop Soirée and we\'d love to see you there.\n\nJoin us this Saturday from 7–10 PM on the rooftop terrace for golden-hour cocktails, live acoustic music, and passed bites from our catering team. Whether you\'re unwinding after a long week or looking to meet a few neighbours, this is the evening for it.\n\nExpect a full craft cocktail bar, live jazz duo, and a grazing board that opens at 8:30 PM. Dress code is smart casual — think summer evening, not office.\n\nRSVP by Thursday so we can plan accordingly. Space is limited to ensure a comfortable experience for everyone.\n\nWe\'ll see you on the rooftop.\n\nWarm regards,\nThe [Building Name] Management Team',
      },
      proTip: 'Station the greeter with a tray of pre-poured welcome drinks — residents who receive a drink within 30 seconds of arriving never feel awkward, and it sets the tone for the entire evening before they\'ve even found a spot to stand.',
    },
  },

  // ── 2. Pool Opening Party ─────────────────────────────────────────────────
  {
    id: 'pool-opening',
    label: 'Pool Opening Party',
    description: 'The seasonal pool debut residents look forward to all year.',
    category: 'social',
    previewTags: ['Outdoor', 'Summer', 'Mixed'],
    formData: {
      eventType: 'Pool Party',
      budget: '$2,500 – $5,000',
      attendance: '50 – 100 residents',
      season: 'Summer',
      venue: 'Outdoor',
      alcohol: 'Wine & beer only',
      demographic: 'Mixed demographic',
      notes: '',
    },
    plan: {
      title: 'The Grand Pool Opening',
      tagline: 'Summer starts here — dive in',
      flyerHeadline: 'The Pool Is Open. See You There.',
      overview:
        'The annual pool opening is one of the most anticipated events on the residential calendar. Done well, it re-energises the community at the start of summer and reminds residents why they love living here. This plan delivers a relaxed, well-staffed afternoon with cold drinks, great music, and a pool deck that feels like a resort — not an amenity.',
      theme:
        'Clean white and cobalt blue palette echoing the water. Oversized white umbrellas, navy striped towels draped on lounge chairs, and potted palms at key corners. Signage is minimal and printed — no clutter.',
      timeline: [
        { time: '11:30 AM', activity: 'Staff setup: umbrellas, towels, décor, bar, and food stations', responsible: 'Staff & Catering' },
        { time: '12:00 PM', activity: 'Pool deck opens — greeter at gate with welcome wristbands', responsible: 'Staff' },
        { time: '12:00 PM', activity: 'DJ or playlist begins; food stations open', responsible: 'Vendor' },
        { time: '1:00 PM', activity: 'Lawn games activated (cornhole, ring toss)', responsible: 'Property Manager' },
        { time: '2:30 PM', activity: 'Raffle or pool-themed giveaway (sunscreen, towels, tote bags)', responsible: 'Event Lead' },
        { time: '3:30 PM', activity: 'Last call — bar service ends', responsible: 'Event Lead' },
        { time: '4:00 PM', activity: 'Event closes; pool transitions to regular hours', responsible: 'Staff' },
      ],
      catering: [
        'Build-your-own taco station with grilled chicken, carnitas, and all toppings — self-serve, fast-moving',
        'Watermelon and citrus fruit platter served chilled in a large decorative bowl',
        'Bags of chips, guacamole, and salsa in branded bowls at each table cluster',
        'Individually packaged ice cream bars in a branded cooler — resident self-serve throughout',
        'Infused water station: cucumber-mint and citrus, refilled continuously',
      ],
      entertainment: [
        'DJ or curated summer playlist via Bluetooth speaker system — upbeat, crowd-appropriate volume',
        'Lawn game stations: cornhole, giant Jenga, bocce along pool perimeter',
        'Optional: poolside trivia at 2 PM hosted by a staff member — prizes are the giveaway items',
      ],
      logistics: [
        'Confirm pool rules are posted clearly; lifeguard requirements vary by city — verify with management',
        'Wristbands for residents only — have building access list at gate for non-RSVP residents',
        'Allocate shaded seating for mature residents and families with young children',
        'Brief all staff on pool safety protocol and emergency contact numbers',
      ],
      budgetBreakdown: [
        'Catering & food: 40% (~$1,600)',
        'Bar & beverages: 25% (~$1,000)',
        'Entertainment & music: 15% (~$600)',
        'Décor & supplies: 12% (~$480)',
        'Staffing & giveaways: 8% (~$320)',
      ],
      vendorIdeas: [
        {
          category: 'Food',
          suggestions: ['Local taco truck for on-site cooking', 'Catering company for pre-prepared stations'],
          estimatedCost: '$1,200 – $2,000',
        },
        {
          category: 'Music',
          suggestions: ['Local DJ with outdoor speaker setup', 'Curated Spotify playlist via property speakers'],
          estimatedCost: '$400 – $900',
        },
        {
          category: 'Branded Giveaways',
          suggestions: ['Custom tote bags with property logo', 'Branded sunscreen + towel gift sets'],
          estimatedCost: '$300 – $600',
        },
        {
          category: 'Bar Service',
          suggestions: ['Licensed bartender for beer and wine station', 'Self-serve cooler with honour system for smaller budgets'],
          estimatedCost: '$400 – $800',
        },
      ],
      staffing: [
        { role: 'Event Lead', count: 1, notes: 'Manages flow, handles issues, engages residents' },
        { role: 'Gate Greeter', count: 1, notes: 'Checks residents in, distributes wristbands, first 2 hours' },
        { role: 'Bartender', count: 1, notes: 'Beer and wine station only; knows cut-off time is 3:30 PM' },
        { role: 'Food Station Attendant', count: 1, notes: 'Maintains taco station, replenishes fruit and snacks' },
      ],
      alcoholEstimate: {
        servingsPerPerson: 2,
        totalBottles: '20 bottles of wine + 4 cases of beer',
        recommendations: [
          'Rosé and Sauvignon Blanc — bright, easy-drinking whites for a pool setting',
          'Light lager (Corona, Modelo) and a local craft pale ale',
          'Sparkling lemonade and branded water as premium non-alcoholic options',
        ],
        estimatedCost: '$700 – $1,100',
      },
      setupLogistics: [
        '10:00 AM — Pool deck cleared; rental delivery if applicable',
        '10:30 AM — Umbrella and lounge chair arrangement per layout plan',
        '11:00 AM — Food station tables set; taco station prepped',
        '11:15 AM — Bar coolers stocked with ice; bottles and cans loaded',
        '11:30 AM — Music tested; game stations assembled',
        '11:45 AM — Staff briefing: safety protocol, wristband process, roles confirmed',
        '12:00 PM — Gate opens',
      ],
      residentEmail: {
        subject: 'The pool is officially open — join us Saturday 12–4 PM',
        body: 'Dear [Building Name] Residents,\n\nSummer is here, and so is our annual Pool Opening Party.\n\nJoin us this Saturday from noon to 4 PM at the pool deck for a relaxed afternoon of cold drinks, great food, and good company. We\'re setting up a taco station, a beer and wine bar, lawn games, and plenty of shaded seating so you can enjoy the day at your own pace.\n\nAll residents and their guests are welcome. Wristbands will be distributed at the gate — just show your key fob or ID.\n\nNo need to RSVP, but if you\'re planning to bring guests, please let us know so we can plan food and drinks accordingly.\n\nSee you poolside.\n\nThe [Building Name] Management Team',
      },
      proTip: 'Place the food stations away from the pool edge and in a shaded area — residents will linger longer around food, and keeping them away from the water\'s edge prevents crowding at the most accident-prone zone of the entire event.',
    },
  },

  // ── 3. Wine Tasting Evening ───────────────────────────────────────────────
  {
    id: 'wine-tasting',
    label: 'Wine Tasting Evening',
    description: 'A sophisticated guided tasting with curated pairings and expert commentary.',
    category: 'professional',
    previewTags: ['Indoor', 'Wine & Beer', 'Fall'],
    formData: {
      eventType: 'Wine & Cheese Evening',
      budget: '$2,500 – $5,000',
      attendance: '25 – 50 residents',
      season: 'Fall / Autumn',
      venue: 'Indoor',
      alcohol: 'Wine & beer only',
      demographic: 'Mature residents (50+)',
      notes: '',
    },
    plan: {
      title: 'An Evening of Wine & Discovery',
      tagline: 'Taste the season, one pour at a time',
      flyerHeadline: 'Five Wines. One Perfect Autumn Evening.',
      overview:
        'A guided wine tasting evening designed for residents who appreciate quality over quantity. A sommelier or knowledgeable wine professional leads the group through five curated pours, each accompanied by a paired cheese or charcuterie bite. The pace is unhurried, the seating is comfortable, and the conversation is the entertainment.',
      theme:
        'Deep burgundy and warm oak tones. Round tables draped in ivory linen with burgundy napkins, a single candle and small bud vase per table. Wine bottles displayed on a central credenza. The room should feel like a private dining room, not a community hall.',
      timeline: [
        { time: '5:30 PM', activity: 'Room setup complete; sommelier arrives for final prep', responsible: 'Event Lead & Vendor' },
        { time: '6:00 PM', activity: 'Doors open — residents seated; welcome pour on the table', responsible: 'Staff' },
        { time: '6:15 PM', activity: 'Sommelier introduction and overview of the evening\'s flight', responsible: 'Sommelier' },
        { time: '6:20 PM', activity: 'Pour 1 & 2 with paired bites and commentary', responsible: 'Sommelier & Catering' },
        { time: '7:00 PM', activity: 'Pour 3 & 4 — mid-flight; conversation encouraged between pours', responsible: 'Sommelier' },
        { time: '7:40 PM', activity: 'Final pour (5) — a special bottle; open tasting and social time', responsible: 'Sommelier' },
        { time: '8:15 PM', activity: 'Dessert pairing served; event transitions to social hour', responsible: 'Catering' },
        { time: '9:00 PM', activity: 'Event closes', responsible: 'Event Lead' },
      ],
      catering: [
        'Aged cheddar, manchego, and gorgonzola presented on individual wooden boards per table',
        'Prosciutto, salami, and cornichon accompaniments arranged alongside cheese',
        'Fig jam, honeycomb, and candied walnuts as condiment accents on each board',
        'Passed dark chocolate truffles with the final pour — one per resident',
        'Still and sparkling water at all times; palate-cleansing crackers between pours',
      ],
      entertainment: [
        'Sommelier-led guided tasting — the host IS the entertainment; quality of presenter is paramount',
        'Printed tasting notes card at each seat for residents to annotate their experience',
        'Optional: wine trivia sheet as an icebreaker during the social hour after the tasting',
      ],
      logistics: [
        'Hire a certified sommelier or knowledgeable wine professional — this is the make-or-break vendor',
        'Select wines in advance with the sommelier; confirm delivery 48 hours before the event',
        'Round tables of 6–8 create the best tasting environment — avoid long banquet rows',
        'Ensure adequate glassware — minimum 2 stems per person to avoid rushed washing between pours',
      ],
      budgetBreakdown: [
        'Wine selection (5 bottles × 6–8 per table): 38% (~$1,425)',
        'Sommelier fee: 20% (~$750)',
        'Cheese & charcuterie boards: 22% (~$825)',
        'Linens, glassware, and décor: 12% (~$450)',
        'Staffing: 8% (~$300)',
      ],
      vendorIdeas: [
        {
          category: 'Sommelier',
          suggestions: ['Certified sommelier via local wine bar or restaurant', 'Wine educator from a regional vineyard or distributor'],
          estimatedCost: '$500 – $900',
        },
        {
          category: 'Wine Selection',
          suggestions: ['Curated flight from a local wine shop with event discount', 'Regional vineyard direct purchase for storytelling angle'],
          estimatedCost: '$800 – $1,400',
        },
        {
          category: 'Cheese & Charcuterie',
          suggestions: ['Specialty cheese shop for pre-assembled boards', 'Local deli with charcuterie programme'],
          estimatedCost: '$600 – $1,000',
        },
        {
          category: 'Rentals',
          suggestions: ['Party rental company for stemware, linen, and tables', 'Restaurant supply rental for one-night use'],
          estimatedCost: '$300 – $600',
        },
      ],
      staffing: [
        { role: 'Sommelier / Wine Host', count: 1, notes: 'Leads all pours and commentary; the centrepiece of the event' },
        { role: 'Event Lead', count: 1, notes: 'Manages setup, coordinates with sommelier, handles logistics' },
        { role: 'Server', count: 1, notes: 'Pours water, maintains cheese boards, clears between pours' },
      ],
      alcoholEstimate: {
        servingsPerPerson: 5,
        totalBottles: '22 bottles of wine across 5 varietals (4–5 bottles per varietal)',
        recommendations: [
          'Flight suggestion: Champagne → Chardonnay → Pinot Noir → Cabernet → Dessert wine',
          'Source at least one bottle with a compelling story — single vineyard, small producer, or unusual region',
          'Have 2 extra bottles of the most popular pour as backup — always',
          'Still water between every pour, not just at the start',
        ],
        estimatedCost: '$900 – $1,500',
      },
      setupLogistics: [
        '3:00 PM — Tables set with linen, candles, glassware, and water carafes',
        '4:00 PM — Cheese boards assembled and refrigerated until 30 min before service',
        '5:00 PM — Wine bottles laid out on credenza in pour order; sommelier arrival',
        '5:30 PM — Final run-through with sommelier: timing, pour sizes, talking points',
        '5:45 PM — Cheese boards brought to room temperature; crackers and condiments placed',
        '6:00 PM — Doors open; welcome pour already on tables',
      ],
      residentEmail: {
        subject: 'Join us for a guided wine tasting evening — Friday, [Date]',
        body: 'Dear [Building Name] Residents,\n\nWe\'re hosting an intimate wine tasting evening and would love your company.\n\nOn Friday, [Date] at 6 PM in [Venue], we\'ll be joined by a sommelier who will guide us through a curated flight of five wines, each paired with artisan cheese and charcuterie. Whether you consider yourself a wine enthusiast or simply enjoy a good glass, this is an evening of discovery at your own pace.\n\nSeating is limited to 40 residents to keep the experience intimate. RSVP by [Date] to secure your spot — we expect this one to fill quickly.\n\nWe look forward to an elegant evening together.\n\nWarm regards,\nThe [Building Name] Management Team',
      },
      proTip: 'Brief your sommelier to leave deliberate pauses between pours — 8 to 10 minutes minimum. Residents who feel rushed stop paying attention and start socialising, which undercuts the experience they came for. Slow is luxurious.',
    },
  },

  // ── 4. Networking Mixer ───────────────────────────────────────────────────
  {
    id: 'networking-mixer',
    label: 'Networking Mixer',
    description: 'A structured social with conversation-starting activations.',
    category: 'professional',
    previewTags: ['Indoor', 'Cocktails', 'Young Professionals'],
    formData: {
      eventType: 'Networking Mixer',
      budget: '$2,500 – $5,000',
      attendance: '50 – 100 residents',
      season: 'Spring',
      venue: 'Indoor',
      alcohol: 'Full bar',
      demographic: 'Young professionals (25–35)',
      notes: '',
    },
    plan: {
      title: 'The Resident Connection Mixer',
      tagline: 'Meet the people who live next door',
      flyerHeadline: 'Your Next Business Contact Lives in This Building',
      overview:
        'A smartly designed networking event that removes the awkward cold-start problem of meeting strangers. Conversation-starter activations, a name-tag system that shows profession, and a layout that keeps people moving ensure residents leave with genuine connections — not just a drink. The feel is professional but warm, not stiff.',
      theme:
        'Clean charcoal and white with gold accents. High-top tables for standing conversations, a few lounge seats along the perimeter for longer exchanges. Minimal décor — the people are the feature. Good lighting is non-negotiable.',
      timeline: [
        { time: '6:30 PM', activity: 'Staff briefing; name-tag station and bar ready', responsible: 'Event Lead' },
        { time: '7:00 PM', activity: 'Doors open — greeter directs residents to name-tag station first', responsible: 'Staff' },
        { time: '7:00 PM', activity: 'Cocktail hour begins; passed appetisers start immediately', responsible: 'Catering' },
        { time: '7:30 PM', activity: 'Icebreaker prompt cards activated at each table', responsible: 'Property Manager' },
        { time: '8:00 PM', activity: '"Two Truths & a Tour" — optional building trivia round hosted by PM', responsible: 'Property Manager' },
        { time: '8:45 PM', activity: 'Stationary food station opens', responsible: 'Catering' },
        { time: '9:30 PM', activity: 'Last call', responsible: 'Event Lead' },
        { time: '10:00 PM', activity: 'Event closes', responsible: 'Event Lead' },
      ],
      catering: [
        'Passed smoked salmon blinis with crème fraîche and dill — upscale, one-bite format',
        'Mini beef sliders on brioche with caramelised onion and aged cheddar',
        'Caprese skewers and bruschetta assortment — vegetarian anchor',
        'Stationary charcuterie and crudité board opening at 8:45 PM to re-energise the room',
        'Sparkling water and fresh-squeezed lemonade as premium non-alcoholic anchors',
      ],
      entertainment: [
        'Curated playlist: upbeat but background-level — conversation must always win over music volume',
        'Conversation starter prompt cards on each high-top: "What\'s a skill you\'d teach your neighbours?"',
        'Professional headshot station in one corner — a genuinely useful giveaway for working professionals',
      ],
      logistics: [
        'Name tags must include first name AND profession — this single detail drives 80% of conversations',
        'High-top tables only in the main space — standing formats keep people circulating',
        'Property manager should introduce at least 5 pairs of residents personally throughout the evening',
        'Have a QR code displayed for residents to join a building community group or newsletter',
      ],
      budgetBreakdown: [
        'Catering & food: 35% (~$1,225)',
        'Bar & beverages: 30% (~$1,050)',
        'Headshot photographer: 18% (~$630)',
        'Décor, signage & supplies: 10% (~$350)',
        'Staffing: 7% (~$245)',
      ],
      vendorIdeas: [
        {
          category: 'Photography',
          suggestions: ['Local portrait photographer for headshot station', 'Photography student offering discounted rates'],
          estimatedCost: '$400 – $900',
        },
        {
          category: 'Catering',
          suggestions: ['Upscale passed appetiser caterer with event experience', 'Boutique catering company specialising in cocktail-format events'],
          estimatedCost: '$1,000 – $1,800',
        },
        {
          category: 'Bar Service',
          suggestions: ['Licensed bartender with craft cocktail capability', 'Mobile bar company with signature drink creation'],
          estimatedCost: '$700 – $1,200',
        },
        {
          category: 'Printing & Signage',
          suggestions: ['Local print shop for name tags and prompt cards', 'Online same-day printing service'],
          estimatedCost: '$80 – $180',
        },
      ],
      staffing: [
        { role: 'Event Lead', count: 1, notes: 'Manages timeline, facilitates icebreaker activity, engages quiet residents' },
        { role: 'Greeter / Name-Tag Attendant', count: 1, notes: 'Stationed at entry; ensures every resident gets a name tag before entering' },
        { role: 'Bartender', count: 2, notes: 'One cocktail specialist, one beer/wine; stationed at opposite ends of bar to prevent crowding' },
        { role: 'Server', count: 2, notes: 'Passed appetisers 7–8:45 PM; clear empty glasses continuously' },
      ],
      alcoholEstimate: {
        servingsPerPerson: 3,
        totalBottles: '20 bottles of wine + 3 cases of beer + 9 bottles of spirits',
        recommendations: [
          'Signature welcome cocktail: Aperol Spritz or a light gin & tonic — approachable and sessionable',
          'Chardonnay and Pinot Noir for wine drinkers',
          'Local IPA and a lager for beer selection',
          'Sparkling water with citrus as the non-alcoholic anchor — always visible on the bar',
        ],
        estimatedCost: '$1,100 – $1,700',
      },
      setupLogistics: [
        '4:00 PM — Room layout set: high-tops positioned, perimeter seating placed',
        '5:00 PM — Bar build; spirits, glassware, and garnishes stocked',
        '5:30 PM — Name-tag station set up at entry; alphabetical blank tags ready',
        '6:00 PM — Headshot backdrop and lighting tested with photographer',
        '6:30 PM — Catering team arrives; passed appetisers prepped',
        '6:30 PM — Staff briefing: name-tag protocol, icebreaker timing, last call procedure',
        '7:00 PM — Doors open',
      ],
      residentEmail: {
        subject: 'Meet your neighbours — Resident Mixer on [Date]',
        body: 'Dear [Building Name] Residents,\n\nDid you know your next collaborator, client, or close friend might live three floors away?\n\nWe\'re hosting a Resident Networking Mixer on [Date] from 7–10 PM in [Venue]. Come with a drink in hand and leave with a few genuine connections.\n\nWe\'re keeping it simple: cocktails, great food, and a professional headshot station you can actually use. Name tags will include your profession — a small detail that makes a big difference.\n\nNo agenda. No presentations. Just good people in the same building finally meeting.\n\nRSVP by [Date] so we can plan the bar and food.\n\nSee you there,\nThe [Building Name] Management Team',
      },
      proTip: 'The headshot station is the single best investment in this event. It gives introverts a destination, gives extroverts a conversation starter ("have you done the headshots yet?"), and gives every resident a tangible reason they\'re glad they attended.',
    },
  },

  // ── 5. Family Movie Night ─────────────────────────────────────────────────
  {
    id: 'family-movie-night',
    label: 'Family Movie Night',
    description: 'An outdoor cinema evening the whole community can enjoy together.',
    category: 'family',
    previewTags: ['Outdoor', 'Non-Alcoholic', 'Families'],
    formData: {
      eventType: 'Movie Night',
      budget: '$1,000 – $2,500',
      attendance: '25 – 50 residents',
      season: 'Summer',
      venue: 'Outdoor',
      alcohol: 'No alcohol',
      demographic: 'Mixed ages, family-oriented',
      notes: '',
    },
    plan: {
      title: 'Outdoor Cinema Under the Stars',
      tagline: 'Blankets, popcorn, and a perfect summer night',
      flyerHeadline: 'Movies. Popcorn. Your Neighbours. Outside.',
      overview:
        'A relaxed outdoor movie screening that turns the courtyard or lawn into a community cinema. Blankets on the grass, popcorn in individual boxes, and a universally loved film create the kind of low-pressure evening that brings families and singles alike out of their apartments. No tickets, no fuss — just a screen and good company.',
      theme:
        'Classic cinema aesthetic with a playful residential twist. Red and white striped popcorn boxes, a vintage-style "Now Showing" sign at the entrance, fairy lights along the perimeter, and picnic blankets spread across the lawn. The screen is the centrepiece.',
      timeline: [
        { time: '7:00 PM', activity: 'Blankets and seating laid out; popcorn station open', responsible: 'Staff' },
        { time: '7:30 PM', activity: 'Residents arrive; pre-show playlist plays; snacks available', responsible: 'Property Manager' },
        { time: '8:00 PM', activity: 'Welcome from property manager (60 seconds max); film begins', responsible: 'Property Manager' },
        { time: '9:15 PM', activity: 'Halftime intermission: fresh popcorn, drinks, bathroom break (10 min)', responsible: 'Staff' },
        { time: '9:25 PM', activity: 'Film resumes', responsible: 'AV Vendor' },
        { time: '10:30 PM', activity: 'Film ends; blankets collected; residents depart', responsible: 'Staff' },
      ],
      catering: [
        'Individual popcorn boxes with classic butter, cheddar, and kettle corn varieties — per-person portioning prevents line-ups',
        'Candy station with boxed movie-style sweets: Milk Duds, Raisinets, gummy bears',
        'Lemonade and sparkling water in a self-serve cooler; juice boxes for children',
        'Optional: hot dogs or mini sliders served during the intermission only',
      ],
      entertainment: [
        'Licensed outdoor film screening with appropriate screening rights obtained in advance',
        'Pre-show: classic movie trailers or trivia slides on screen from 7:30–8:00 PM',
        'Film selection voted on by residents via email poll 2 weeks prior — increases attendance and ownership',
      ],
      logistics: [
        'Confirm screening licence — this is a legal requirement for commercial outdoor screenings',
        'Check sunset time; film should start no earlier than 20 minutes after full dark',
        'Have a weather contingency plan: covered indoor space or reschedule protocol communicated in advance',
        'Provide extra blankets in a basket near the screen for residents who didn\'t bring one',
      ],
      budgetBreakdown: [
        'AV equipment & screen rental: 40% (~$700)',
        'Screening licence: 12% (~$210)',
        'Catering & snacks: 30% (~$525)',
        'Décor & supplies: 10% (~$175)',
        'Staffing: 8% (~$140)',
      ],
      vendorIdeas: [
        {
          category: 'AV & Screen',
          suggestions: ['Outdoor cinema rental company with inflatable screen and projector', 'AV company with portable LED screen for sharper image'],
          estimatedCost: '$600 – $1,200',
        },
        {
          category: 'Screening Licence',
          suggestions: ['Swank Motion Pictures for residential community screenings', 'Criterion Pictures for licensed community events'],
          estimatedCost: '$150 – $400',
        },
        {
          category: 'Catering',
          suggestions: ['Popcorn machine rental with supplies', 'Pre-packaged cinema snack bundle supplier'],
          estimatedCost: '$300 – $600',
        },
        {
          category: 'Décor',
          suggestions: ['Blanket and cushion set rental for lawn seating', 'Party supply store for popcorn boxes and cinema signage'],
          estimatedCost: '$100 – $250',
        },
      ],
      staffing: [
        { role: 'Event Lead', count: 1, notes: 'Manages setup, coordinates AV vendor, introduces film at 8 PM' },
        { role: 'Snack Station Attendant', count: 1, notes: 'Manages popcorn, drinks, and candy station; handles intermission service' },
        { role: 'AV Technician', count: 1, notes: 'Provided by rental company; manages projection and sound throughout' },
      ],
      alcoholEstimate: null,
      setupLogistics: [
        '5:00 PM — AV company arrives; screen and projector setup begins',
        '6:00 PM — AV test complete; focus and sound levels confirmed',
        '6:30 PM — Blankets laid out in rows; fairy lights strung along perimeter',
        '6:45 PM — Popcorn machine on; snack station stocked',
        '7:00 PM — Pre-show playlist begins on screen',
        '7:30 PM — Resident arrival; snacks available',
        '8:00 PM — Property manager welcome; film starts',
      ],
      residentEmail: {
        subject: 'Movie night is back — outdoor screening on [Date]',
        body: 'Dear [Building Name] Residents,\n\nGrab a blanket and join us for an evening under the stars.\n\nWe\'re hosting our Outdoor Cinema Night on [Date] starting at 7:30 PM in [Courtyard/Lawn]. The film begins at 8 PM sharp, but come early for popcorn, lemonade, and a good spot on the lawn.\n\nThis year\'s film was chosen by you — [Film Title] — so we\'re expecting a great crowd.\n\nWe\'ll have butter, cheddar, and kettle corn popcorn, plus a full candy station and drinks for the kids. Bring your own blanket or pillow for extra comfort, or grab one of ours at the entrance.\n\nAll residents and their families are welcome. No RSVP needed — just show up.\n\nSee you on the lawn,\nThe [Building Name] Management Team',
      },
      proTip: 'Run the film vote 2 weeks before and announce the winner in the invitation email. Residents who voted for the winning film feel ownership over the event and are significantly more likely to attend — and to bring a neighbour.',
    },
  },

  // ── 6. Wellness Morning ───────────────────────────────────────────────────
  {
    id: 'wellness-morning',
    label: 'Wellness Morning',
    description: 'A restorative weekend morning of yoga, mindfulness, and healthy refreshments.',
    category: 'wellness',
    previewTags: ['Indoor/Outdoor', 'Non-Alcoholic', 'Spring'],
    formData: {
      eventType: 'Wellness & Yoga Morning',
      budget: '$1,000 – $2,500',
      attendance: '10 – 25 residents',
      season: 'Spring',
      venue: 'Indoor & Outdoor',
      alcohol: 'No alcohol',
      demographic: 'Mixed demographic',
      notes: '',
    },
    plan: {
      title: 'Sunday Morning Reset',
      tagline: 'Move well. Breathe deep. Start fresh.',
      flyerHeadline: 'Your Best Sunday Morning Starts Here',
      overview:
        'A guided wellness morning that turns the amenity space or rooftop into a serene retreat for an hour. A certified yoga or mindfulness instructor leads a 45-minute session, followed by a refreshment table of smoothies, cold brew, and healthy bites. The event feels like a gift — a reason to get out of bed on a Sunday that residents genuinely thank you for.',
      theme:
        'Natural linen, sage green, and white. Matching yoga mats laid out in neat rows, a small altar at the front with a candle and a plant. Refreshment table in warm wood with glass pitchers. No clutter — simplicity is the luxury.',
      timeline: [
        { time: '8:45 AM', activity: 'Instructor arrives; mats laid out, refreshments staged', responsible: 'Event Lead & Instructor' },
        { time: '9:00 AM', activity: 'Doors open; residents arrive and settle on mats', responsible: 'Staff' },
        { time: '9:10 AM', activity: 'Instructor welcome and brief intention-setting (5 minutes)', responsible: 'Instructor' },
        { time: '9:15 AM', activity: '45-minute guided session: flow, breathwork, and savasana', responsible: 'Instructor' },
        { time: '10:00 AM', activity: 'Session closes; refreshment table opens', responsible: 'Staff' },
        { time: '10:00 AM', activity: 'Residents mingle; instructor available for questions', responsible: 'Instructor' },
        { time: '10:45 AM', activity: 'Event closes; mats rolled and collected', responsible: 'Staff' },
      ],
      catering: [
        'Cold-pressed green smoothies in individual cups — pre-portioned, no queue',
        'Cold brew coffee station with oat milk and regular milk options',
        'Açaí bowls or overnight oats cups with granola and fresh berries',
        'Sliced seasonal fruit platter — watermelon, strawberries, and citrus',
        'Still and sparkling water with cucumber and mint slices throughout',
      ],
      entertainment: [
        'Certified yoga or mindfulness instructor leading a 45-minute guided session',
        'Curated ambient playlist for the session — no lyrics, 60–70 BPM',
        'Optional: 5-minute guided meditation at the close of session before refreshments',
      ],
      logistics: [
        'Confirm instructor is certified and insured — required for liability coverage',
        'Provide yoga mats if possible; ask residents to bring their own as backup',
        'Keep session suitable for all levels — instruct the teacher to offer modifications throughout',
        'Enforce a phone-off/silent policy during the session — announce at welcome',
      ],
      budgetBreakdown: [
        'Instructor fee: 35% (~$612)',
        'Food & refreshments: 35% (~$612)',
        'Yoga mats and props rental: 15% (~$262)',
        'Décor & ambiance: 10% (~$175)',
        'Staffing: 5% (~$87)',
      ],
      vendorIdeas: [
        {
          category: 'Instructor',
          suggestions: ['Local certified yoga studio instructor for private session', 'Mindfulness coach or meditation teacher as alternative'],
          estimatedCost: '$300 – $600',
        },
        {
          category: 'Refreshments',
          suggestions: ['Local juice bar for pre-made smoothie cups', 'Health food café for açaí bowls and cold brew catering'],
          estimatedCost: '$300 – $600',
        },
        {
          category: 'Equipment',
          suggestions: ['Yoga mat rental company for matching set', 'Sports equipment rental including blocks and straps'],
          estimatedCost: '$150 – $350',
        },
        {
          category: 'Ambiance',
          suggestions: ['Local plant shop for potted greenery rental or purchase', 'Candle and diffuser set from a wellness brand'],
          estimatedCost: '$80 – $200',
        },
      ],
      staffing: [
        { role: 'Instructor', count: 1, notes: 'Certified yoga or mindfulness professional; the entire event depends on their quality' },
        { role: 'Event Lead', count: 1, notes: 'Handles setup, greets residents, manages refreshment table during session' },
      ],
      alcoholEstimate: null,
      setupLogistics: [
        '7:30 AM — Mats laid out in rows; blocks and straps placed on each mat',
        '8:00 AM — Refreshment table set: smoothies refrigerated, cold brew staged, fruit platter arranged',
        '8:30 AM — Candle lit; ambient playlist tested on speaker',
        '8:45 AM — Instructor arrives for brief walkthrough',
        '9:00 AM — Doors open',
      ],
      residentEmail: {
        subject: 'Free yoga morning for residents — Sunday [Date] at 9 AM',
        body: 'Dear [Building Name] Residents,\n\nStart your Sunday the right way.\n\nWe\'re hosting a guided yoga and wellness morning on Sunday, [Date] at 9 AM in [Amenity Space / Rooftop]. A certified instructor will lead a 45-minute session suitable for all levels, followed by cold-pressed smoothies, cold brew, and a light healthy spread.\n\nNo experience necessary. Bring a mat if you have one — we\'ll have extras.\n\nThe session runs from 9:00–10:45 AM. We ask that phones stay on silent during the class so everyone can fully reset.\n\nRSVP by Saturday evening so we can prepare enough refreshments for everyone.\n\nWe hope to see you there,\nThe [Building Name] Management Team',
      },
      proTip: 'Pre-portion the smoothies into individual cups before residents arrive — a smoothie blender running during a yoga session immediately breaks the atmosphere and signals poor planning. The refreshment table should be entirely silent and ready before the first resident walks in.',
    },
  },

  // ── 7. Holiday Social ─────────────────────────────────────────────────────
  {
    id: 'holiday-social',
    label: 'Holiday Social',
    description: 'A warm, festive gathering that feels like a real celebration.',
    category: 'seasonal',
    previewTags: ['Indoor', 'Full Bar', 'Winter'],
    formData: {
      eventType: 'Holiday Party',
      budget: '$5,000 – $10,000',
      attendance: '50 – 100 residents',
      season: 'Winter',
      venue: 'Indoor',
      alcohol: 'Full bar',
      demographic: 'Mixed demographic',
      notes: '',
    },
    plan: {
      title: 'The Annual Holiday Celebration',
      tagline: 'The warmest night of the year',
      flyerHeadline: 'This Is the Holiday Party You\'ve Been Waiting For',
      overview:
        'A proper holiday party that earns its place on residents\' calendars every year. Elevated décor, a festive cocktail menu, a beautiful grazing spread, and live music create a celebration that feels curated rather than corporate. The goal is for residents to walk in and immediately feel the shift — this is a special evening, not a reception.',
      theme:
        'Deep forest green and champagne gold throughout. Garland and dried citrus centrepieces, flickering pillar candles, and warm Edison bulb lighting. A designated photo moment with a lush holiday backdrop. The room should feel like a beautifully decorated home, not a banquet hall.',
      timeline: [
        { time: '6:00 PM', activity: 'Staff briefing; bar and food fully ready', responsible: 'Event Lead' },
        { time: '6:30 PM', activity: 'Doors open — live music begins; greeter with welcome champagne at entry', responsible: 'Staff' },
        { time: '6:30 PM', activity: 'Passed appetisers begin; photo backdrop available', responsible: 'Catering & Staff' },
        { time: '7:30 PM', activity: 'Stationary grazing table revealed', responsible: 'Catering' },
        { time: '8:00 PM', activity: 'Property manager toast and brief welcome (2 minutes maximum)', responsible: 'Property Manager' },
        { time: '8:30 PM', activity: 'Holiday raffle or giveaway', responsible: 'Event Lead' },
        { time: '9:30 PM', activity: 'Last call', responsible: 'Event Lead' },
        { time: '10:00 PM', activity: 'Event closes', responsible: 'Event Lead' },
      ],
      catering: [
        'Passed brie and cranberry tartlets in mini pastry shells — warm, festive, one-bite',
        'Passed beef tenderloin crostini with horseradish cream on toasted baguette',
        'Stationary grazing table: artisan cheeses, cured meats, seasonal fruits, nuts, and honeycomb',
        'Mini dessert assortment: chocolate truffles, salted caramel tarts, and gingerbread bites',
        'Hot mulled wine station as a seasonal non-standard offering alongside the main bar',
      ],
      entertainment: [
        'Live jazz trio or solo pianist playing a mix of holiday classics and contemporary jazz standards',
        'Professional photography or holiday photo backdrop with fairy lights and greenery',
        'Holiday raffle with building-branded prizes (restaurant vouchers, local experiences, gift hampers)',
      ],
      logistics: [
        'Book live music and photographer 6–8 weeks in advance — both book out early in December',
        'Raffle prizes should feel genuinely valuable: local restaurant gift cards, spa vouchers, or experience gifts',
        'Stagger the grazing table reveal at 7:30 PM to re-energise the room an hour in',
        'Have a coat check or designated coat area — residents arriving in winter coats need somewhere to put them',
      ],
      budgetBreakdown: [
        'Catering & food: 30% (~$2,250)',
        'Bar & beverages: 25% (~$1,875)',
        'Live music: 18% (~$1,350)',
        'Décor & florals: 15% (~$1,125)',
        'Staffing, photographer & raffle prizes: 12% (~$900)',
      ],
      vendorIdeas: [
        {
          category: 'Live Music',
          suggestions: ['Local jazz trio via a music agency or direct booking', 'Solo pianist with holiday repertoire for more intimate scale'],
          estimatedCost: '$800 – $1,800',
        },
        {
          category: 'Catering',
          suggestions: ['Upscale event caterer with passed and stationary service', 'Restaurant catering arm for both passed bites and grazing spread'],
          estimatedCost: '$2,000 – $3,500',
        },
        {
          category: 'Décor & Florals',
          suggestions: ['Event design company for full room transformation', 'Local florist for centrepieces and garland with DIY overhead lighting'],
          estimatedCost: '$800 – $1,500',
        },
        {
          category: 'Photography',
          suggestions: ['Event photographer for 2–3 hours', 'Photo booth rental with printed strips as resident takeaways'],
          estimatedCost: '$400 – $900',
        },
      ],
      staffing: [
        { role: 'Event Lead', count: 1, notes: 'Oversees all vendors, manages timeline, delivers raffle at 8:30 PM' },
        { role: 'Greeter', count: 1, notes: 'At entry with champagne tray; coat check coordination first 60 minutes' },
        { role: 'Bartender', count: 2, notes: 'Full bar service including mulled wine station; last call at 9:30 PM' },
        { role: 'Server', count: 3, notes: 'Passed appetisers 6:30–8 PM; table and grazing maintenance thereafter' },
      ],
      alcoholEstimate: {
        servingsPerPerson: 3,
        totalBottles: '22 bottles of wine + 3 cases of beer + 10 bottles of spirits + 2 cases of champagne',
        recommendations: [
          'Welcome champagne or Prosecco for the arrival moment — worth the extra cost',
          'Mulled wine as a signature seasonal offering — prepare in a slow cooker for easy service',
          'Cabernet Sauvignon and Chardonnay as the main wine anchors',
          'Premium sparkling water and a festive mocktail (cranberry-ginger spritz) as non-alcoholic options',
        ],
        estimatedCost: '$2,000 – $3,000',
      },
      setupLogistics: [
        '2:00 PM — Décor team arrives: garland, centrepieces, lighting installation',
        '3:30 PM — Catering team arrives; kitchen and cold storage setup',
        '4:00 PM — Bar build: full spirit stock, glassware polished, champagne chilled',
        '5:00 PM — Music sound check; photo backdrop positioned and lit',
        '5:30 PM — Mulled wine in slow cooker; grazing table pre-staged under cover',
        '6:00 PM — Full staff briefing: timeline, toast timing, raffle procedure, last call protocol',
        '6:30 PM — Doors open; live music playing; greeter ready with champagne',
      ],
      residentEmail: {
        subject: 'You\'re invited to our Annual Holiday Celebration — [Date]',
        body: 'Dear [Building Name] Residents,\n\nThe holidays are here, and we\'re celebrating together.\n\nJoin us on [Date] from 6:30–10 PM in [Venue] for our Annual Holiday Celebration. We\'ve planned an evening worth getting dressed up for — live jazz, a champagne welcome, an elegant spread, and a few surprises along the way.\n\nExpect festive cocktails, passed bites, a full grazing table, and a raffle with some genuinely great prizes. Dress code is festive or smart casual.\n\nRSVP by [Date] so we can ensure we have enough of everything for everyone. We expect this one to fill up.\n\nHere\'s to a wonderful evening together.\n\nWarm holiday wishes,\nThe [Building Name] Management Team',
      },
      proTip: 'The property manager toast at 8 PM should be no longer than 90 seconds — write it out in advance, time it, and cut anything that makes it longer. A short, warm, sincere toast lands perfectly. A rambling one makes the room uncomfortable and sets a flat tone for the rest of the night.',
    },
  },

  // ── 8. Cocktail Reception ─────────────────────────────────────────────────
  {
    id: 'cocktail-reception',
    label: 'Cocktail Reception',
    description: 'A polished evening reception that sets the standard for building events.',
    category: 'social',
    previewTags: ['Indoor', 'Full Bar', 'Year-round'],
    formData: {
      eventType: 'Cocktail Reception',
      budget: '$5,000 – $10,000',
      attendance: '50 – 100 residents',
      season: 'Fall / Autumn',
      venue: 'Indoor',
      alcohol: 'Full bar',
      demographic: 'Mixed demographic',
      notes: '',
    },
    plan: {
      title: 'The Signature Cocktail Reception',
      tagline: 'An evening of effortless elegance',
      flyerHeadline: 'Dress Up. Show Up. Enjoy the Evening.',
      overview:
        'The cocktail reception is the benchmark luxury residential event — the one that defines the tone for everything that follows in the year. When executed well, it communicates to residents that this is a building that takes quality seriously. This plan delivers a refined, well-staffed, beautifully presented evening that feels effortless to attend and memorable long after.',
      theme:
        'Champagne, ivory, and brushed gold. White linen-draped tables, tall floral arrangements in clear glass vases, and subtle candlelight throughout. The bar is the centrepiece of the room — backlit bottles, polished glassware, and a bartender who knows their craft. No loud décor, no themed distractions.',
      timeline: [
        { time: '6:00 PM', activity: 'Staff briefing; bar, appetiser trays, and room fully ready', responsible: 'Event Lead' },
        { time: '6:30 PM', activity: 'Doors open — greeter at entrance with welcome champagne', responsible: 'Staff' },
        { time: '6:30 PM', activity: 'Passed appetisers begin immediately on entry', responsible: 'Catering' },
        { time: '7:15 PM', activity: 'Signature cocktail of the evening announced and promoted at bar', responsible: 'Bartender' },
        { time: '7:45 PM', activity: 'Second pass of appetisers; grazing station quietly revealed', responsible: 'Catering' },
        { time: '8:30 PM', activity: 'Optional: brief host welcome and building update (90 seconds)', responsible: 'Property Manager' },
        { time: '9:30 PM', activity: 'Last call', responsible: 'Event Lead' },
        { time: '10:00 PM', activity: 'Event closes', responsible: 'Event Lead' },
      ],
      catering: [
        'Passed tuna tartare on wonton crisps with sesame oil and micro greens',
        'Passed wagyu beef slider on potato bun with truffle aioli and crispy shallots',
        'Passed wild mushroom and brie phyllo cups — vegetarian, warm',
        'Stationary grazing station: whole cheeses, charcuterie, seasonal accompaniments, artisan crackers',
        'Petits fours and chocolate-dipped strawberries passed on trays at 9 PM',
      ],
      entertainment: [
        'Curated cocktail jazz or classical playlist — background level only, never competing with conversation',
        'Signature house cocktail created specifically for the event — named after the building or season',
        'Elegant printed cocktail menu card at the bar listing all available drinks including mocktails',
      ],
      logistics: [
        'A printed cocktail menu at the bar elevates the experience and reduces ordering friction significantly',
        'The bar should be visually the most impressive element in the room — invest in presentation',
        'Catering servers should be impeccably dressed and trained in silent, unobtrusive service',
        'Plan for 15–20% no-shows; layout and staffing should reflect actual expected attendance, not RSVP count',
      ],
      budgetBreakdown: [
        'Catering & passed appetisers: 32% (~$2,560)',
        'Bar & premium beverages: 28% (~$2,240)',
        'Décor, florals & glassware: 20% (~$1,600)',
        'Staffing: 12% (~$960)',
        'Printed materials & signage: 8% (~$640)',
      ],
      vendorIdeas: [
        {
          category: 'Catering',
          suggestions: ['Upscale event caterer with cocktail-format specialisation', 'Hotel catering team for high-volume passed service with formal presentation'],
          estimatedCost: '$2,000 – $3,500',
        },
        {
          category: 'Bar Service',
          suggestions: ['Craft cocktail specialist bartender with own kit', 'Mobile bar company with premium spirit programme'],
          estimatedCost: '$1,200 – $2,200',
        },
        {
          category: 'Florals & Décor',
          suggestions: ['Upscale floral designer for tall arrangements and table treatments', 'Event rental company for glassware, linen, and furniture upgrades'],
          estimatedCost: '$1,200 – $2,000',
        },
        {
          category: 'Printing & Menus',
          suggestions: ['Local luxury print shop for cocktail menu cards and signage', 'Online premium printing service with next-day delivery'],
          estimatedCost: '$150 – $300',
        },
      ],
      staffing: [
        { role: 'Event Lead', count: 1, notes: 'Manages vendors, monitors flow, keeps timeline; never works a station' },
        { role: 'Greeter', count: 1, notes: 'At entrance for first 60 minutes with welcome champagne; then floats' },
        { role: 'Bartender', count: 2, notes: 'Primary craft cocktail bartender plus one support for beer, wine, and non-alcoholic' },
        { role: 'Server', count: 3, notes: 'Passed service throughout; impeccably dressed; continuous floor presence' },
      ],
      alcoholEstimate: {
        servingsPerPerson: 3,
        totalBottles: '20 bottles of wine + 2 cases of beer + 10 bottles of spirits + 2 cases of Champagne',
        recommendations: [
          'House signature cocktail named for the season or building — give the bartender creative latitude',
          'Champagne or Prosecco for the welcome and throughout — do not switch to sparkling wine mid-event',
          'One exceptional red and one white wine to anchor the bar',
          'A premium non-alcoholic mocktail that matches the elegance of the cocktail menu',
        ],
        estimatedCost: '$2,200 – $3,000',
      },
      setupLogistics: [
        '2:00 PM — Florist arrives for tall arrangement installation and table treatments',
        '3:00 PM — Bar build begins: backlit display, glassware polished, spirits arranged',
        '4:00 PM — Catering team: cold storage, prep kitchen, tray organisation',
        '5:00 PM — Linen, candles, and printed menus placed on tables and bar',
        '5:30 PM — Champagne chilled; welcome tray prepared for greeter',
        '6:00 PM — Full staff briefing: service standards, timing, last call, guest interaction protocol',
        '6:30 PM — Doors open',
      ],
      residentEmail: {
        subject: 'An invitation to our Cocktail Reception — [Date] at 6:30 PM',
        body: 'Dear [Building Name] Residents,\n\nWe would like to invite you to an evening of cocktails and conversation.\n\nOn [Date] from 6:30–10 PM in [Venue], we\'re hosting our signature Cocktail Reception — an elegant evening with a full craft cocktail bar, passed bites from our catering team, and the chance to spend time with your neighbours in a setting we think you\'ll enjoy.\n\nThis is the event we invest the most care in each year, and we look forward to it every time. Dress code is smart to semi-formal.\n\nPlease RSVP by [Date]. Space is curated rather than open-door, so your RSVP genuinely matters.\n\nWe look forward to welcoming you.\n\nWarm regards,\nThe [Building Name] Management Team',
      },
      proTip: 'Commission a signature house cocktail from your bartender in advance — give them the building name, the season, and a one-sentence brief, and let them create something original. It costs nothing extra, becomes the most-talked-about element of the evening, and gives residents a story to tell.',
    },
  },

]