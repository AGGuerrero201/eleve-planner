/**
 * experience/localPlanEngine.ts
 *
 * The Experience Elevé plan composer.
 *
 * When Experience Elevé is active, event generation runs entirely in the
 * browser against this curated content engine instead of the live Edge
 * Function. Every plan it produces is a complete, schema-valid EventPlan:
 * editable, savable, regenerable section-by-section — real product data,
 * with zero network or API-key dependency, so the guided experience can
 * never stall or error mid-walkthrough.
 *
 * Content varies by event type, season, venue, alcohol service, budget,
 * attendance, and the active property profile. A rotating variant counter
 * ensures "Regenerate" visibly produces a fresh take.
 */

import type {
  EventFormData,
  EventPlan,
  TimelineItem,
  VendorIdea,
  StaffingRole,
  AlcoholEstimate,
  RegenerableSection,
  SavedEvent,
} from '@/types'
import type { PropertyProfile } from '@/types/property'

// ─── Variant rotation ──────────────────────────────────────────────────────────

let variantCounter = 0

function pick<T>(arr: T[], offset = 0): T {
  return arr[(variantCounter + offset) % arr.length]
}

/** Rotate an array so repeated generations read differently. */
function rotate<T>(arr: T[], by: number): T[] {
  const n = ((by % arr.length) + arr.length) % arr.length
  return [...arr.slice(n), ...arr.slice(0, n)]
}

// ─── Input parsing ──────────────────────────────────────────────────────────────

function parseAttendance(raw: string): number {
  const nums = (raw.match(/\d+/g) ?? []).map(Number)
  if (nums.length === 2) return Math.round((nums[0] + nums[1]) / 2)
  if (nums.length === 1) return raw.includes('+') ? Math.round(nums[0] * 1.25) : Math.round(nums[0] * 0.8)
  return 60
}

function parseBudget(raw: string): number {
  const nums = (raw.replace(/,/g, '').match(/\d+/g) ?? []).map(Number)
  if (nums.length === 2) return Math.round((nums[0] + nums[1]) / 2)
  if (nums.length === 1) return raw.includes('+') ? Math.round(nums[0] * 1.3) : Math.round(nums[0] * 0.8)
  return 3500
}

function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

// ─── Type groups (drive timelines & regeneration variants) ─────────────────────

type TypeGroup = 'evening_social' | 'daytime_social' | 'wellness' | 'family' | 'culinary'

function groupFor(eventType: string): TypeGroup {
  const t = eventType.toLowerCase()
  if (/(yoga|wellness|fitness)/.test(t)) return 'wellness'
  if (/(family|movie|pet|market|fun day)/.test(t)) return 'family'
  if (/(cooking|brunch|tasting|cheese)/.test(t)) return 'culinary'
  if (/(pool|gallery|art|afternoon)/.test(t)) return 'daytime_social'
  return 'evening_social'
}

// ─── Per-type identity content ──────────────────────────────────────────────────

interface TypeConcept {
  titles:    string[]
  taglines:  string[]
  flyers:    string[]
  overview:  string
  theme:     string
  catering:  string[]
  entertainment: string[]
  vendorCats: [string, string]
  proTips:   string[]
}

const CONCEPTS: Record<string, TypeConcept> = {
  'Cocktail Reception': {
    titles:   ['Golden Hour on the Terrace', 'The Dusk & Amber Reception', 'City Lights Social'],
    taglines: ['An evening of signature pours and skyline views', 'Cocktails, conversation, and the city at dusk', 'Where neighbors become good company'],
    flyers:   ['Join us as the city lights come up', 'One evening. One skyline. Your neighbors.', 'Raise a glass to golden hour'],
    overview: 'A refined cocktail reception designed to draw residents together in an unhurried, elegant setting. Passed appetizers and a curated signature-cocktail menu keep guests circulating, while lounge seating clusters and low lighting encourage the kind of easy conversation that builds real community.',
    theme:    'Warm amber and brass against dusk-blue tones. Low candlelight, linen-draped high-tops, and a soft jazz undercurrent create a members-club atmosphere without a hint of stuffiness.',
    catering: [
      'Passed hors d\u2019oeuvres: whipped ricotta crostini with hot honey, tuna tartare spoons, wild mushroom arancini',
      'Grazing display: artisan cheeses, charcuterie, marcona almonds, seasonal fruit, olive tapenade',
      'Two signature cocktails: a smoked rosemary old fashioned and an elderflower spritz',
      'Sparkling water and botanical mocktail station for non-drinking residents',
      'Late-evening bite: mini wagyu sliders passed at the halfway mark',
    ],
    entertainment: [
      'Live jazz trio for the first ninety minutes, transitioning to a curated downtempo playlist',
      'Polaroid guestbook station with a brass-framed backdrop',
      'Sommelier-style cocktail talk: the bartender presents each signature pour tableside',
      'Skyline lounge seating with blankets as the evening cools',
    ],
    vendorCats: ['Bar Service', 'Catering'],
    proTips: [
      'Schedule the event to begin 45 minutes before sunset — the golden-hour photos residents post are your best marketing for the next event.',
      'Cap the signature cocktail list at two options. Shorter menus move lines faster and feel more curated, not less generous.',
      'Station a greeter with a tray of the signature cocktail at the entrance — a drink in hand within 30 seconds sets the tone for the entire evening.',
    ],
  },
  'Rooftop Social': {
    titles:   ['Skyline Social', 'Up on the Roof', 'The Vantage Point Social'],
    taglines: ['Your best view, shared with your best neighbors', 'An open-air evening above it all', 'Community, elevated'],
    flyers:   ['Meet us on the roof', 'The best seat in the building is the roof', 'Sunset, snacks, and skyline'],
    overview: 'A relaxed open-air social that turns the rooftop into the community\u2019s living room for an evening. Light bites, easy drinks, and unstructured mingling — the goal is simple: residents leave knowing three more neighbors than they arrived with.',
    theme:    'String lights, potted greenery, and warm wood tones. Casual-elevated: think linen napkins with paper-boat snacks, not tablecloths.',
    catering: [
      'Street-food inspired stations: gourmet taco bar and a flatbread oven',
      'Chilled seasonal gazpacho shooters passed on arrival',
      'Local craft beer bucket bar with two rotating wines',
      'House-made lemonades and iced hibiscus tea',
      'Ice cream sandwich cart for the final hour',
    ],
    entertainment: [
      'Acoustic duo set against the skyline',
      'Oversized lawn games: cornhole and giant Jenga on the turf section',
      'Community photo wall — best skyline shot wins a coffee gift card',
      'Fire-table lounge circles as the sun sets',
    ],
    vendorCats: ['Catering', 'Entertainment'],
    proTips: [
      'Always hold a weather call at noon with an indoor fallback pre-staged — announcing a smooth relocation builds more trust than a perfect forecast.',
      'Put the food stations at opposite ends of the roof. Traffic flow between them is where introductions actually happen.',
      'Wind kills paper goods. Weighted menu cards and clip-secured linens read as polish, not paranoia.',
    ],
  },
  'Wine & Cheese Evening': {
    titles:   ['Vines & Vintages', 'The Cellar Evening', 'Pour Decisions: A Wine Evening'],
    taglines: ['Five pours, five pairings, one perfect evening', 'A guided tasting for the curious palate', 'Old-world wines, new neighbors'],
    flyers:   ['Uncork your evening with us', 'Five wines. Five cheeses. Zero pretension.', 'A tasting worth staying in for'],
    overview: 'A structured yet convivial tasting that walks residents through five wine-and-cheese pairings, guided by a sommelier who keeps things approachable. Designed to feel like a private club benefit — the kind of programming residents mention when friends ask why they love living here.',
    theme:    'Candlelit tablescapes with olive branches, aged-wood boards, and handwritten pairing cards. Intimate, warm, quietly indulgent.',
    catering: [
      'Five-pour flight: sparkling ros\u00e9, Sancerre, white Burgundy, Rioja Reserva, vintage port',
      'Paired artisan cheeses: triple-cr\u00e8me brie, aged manchego, cave-aged gruy\u00e8re, stilton, humboldt fog',
      'Accompaniments: fig jam, truffle honey, marcona almonds, baguette, quince paste',
      'Dark chocolate and dried-fruit finale board',
      'Sparkling water and a non-alcoholic pairing flight of pressed juices',
    ],
    entertainment: [
      'Sommelier-led tasting with a one-page take-home pairing guide',
      'Blind-taste challenge round with a wine-shop gift card prize',
      'Low-volume classical guitar during arrival and close',
      'Regional map display tracing each wine\u2019s origin',
    ],
    vendorCats: ['Bar Service', 'Specialty'],
    proTips: [
      'Seat residents at communal tables of six, not rows — the tasting is the excuse, the table conversation is the product.',
      'Pre-pour the first flight before doors open. Starting on time with glasses already set signals a professionally run program.',
      'Photograph the tablescape before guests arrive; it becomes the invitation image for the next tasting.',
    ],
  },
  'Holiday Party': {
    titles:   ['The Winter Gala', 'Fireside & Festive', 'The Holiday Soir\u00e9e'],
    taglines: ['The season\u2019s most anticipated evening', 'Warmth, sparkle, and neighborly cheer', 'One night that feels like home for the holidays'],
    flyers:   ['The holidays begin at home', 'An evening of sparkle and cheer', 'Celebrate the season with your neighbors'],
    overview: 'The signature event of the residential calendar — an elevated holiday celebration that rewards residents\u2019 loyalty and becomes the memory they associate with living here. Rich food, generous pours, live music, and thoughtful touches like a gift-wrap station make it feel like a gift, not an obligation.',
    theme:    'Evergreen garlands with brass and cream accents, amber uplighting, and a real spruce centerpiece. Classic and warm rather than novelty-festive.',
    catering: [
      'Carving station: herb-crusted beef tenderloin with horseradish cr\u00e8me',
      'Passed canap\u00e9s: brie-and-cranberry tartlets, smoked salmon blinis, wild mushroom vol-au-vents',
      'Winter salad and roasted-vegetable harvest table',
      'Mulled wine cauldron, champagne toast, and a classic eggnog bar',
      'Dessert atelier: b\u00fbche de No\u00ebl, spiced pear galette, peppermint truffles',
    ],
    entertainment: [
      'Jazz quartet playing standards and reimagined holiday classics',
      'Champagne toast and short thank-you from the property team at 8 PM',
      'Complimentary gift-wrap station staffed for residents\u2019 own gifts',
      'Photo moment: velvet wingback chairs before the spruce, staffed photographer for the first two hours',
    ],
    vendorCats: ['Catering', 'AV & Production'],
    proTips: [
      'Send the invitation five weeks out — holiday calendars fill early, and being residents\u2019 first commitment of the season maximizes turnout.',
      'The team toast matters more than any d\u00e9cor line item: ninety seconds of genuine thanks is what residents remember in renewal season.',
      'Order 15% extra dessert. Holiday events run long, and a replenished sweets table at 9 PM feels remarkably generous.',
    ],
  },
  'Wellness & Yoga Morning': {
    titles:   ['Sunrise Flow', 'The Morning Reset', 'Stillness & Sunlight'],
    taglines: ['Begin the weekend restored', 'An hour of calm before the city wakes', 'Move, breathe, and meet your neighbors'],
    flyers:   ['Your weekend starts with a deep breath', 'Sunrise yoga, cold brew after', 'Reset. Restore. Together.'],
    overview: 'A restorative morning session led by a certified instructor, followed by a light wellness caf\u00e9 so residents linger and connect. Wellness programming signals that the community invests in residents\u2019 daily lives, not just their occasional evenings.',
    theme:    'Natural textures — cork, linen, eucalyptus stems — with soft instrumental sound. Unhurried, screen-free, and bright.',
    catering: [
      'Cold brew and golden-milk latte bar',
      'A\u00e7a\u00ed and Greek-yogurt parfait station with house granola',
      'Pressed juice trio: green, citrus-ginger, beet-apple',
      'Warm miniature banana-oat muffins',
      'Cucumber and citrus infused-water station',
    ],
    entertainment: [
      '60-minute all-levels vinyasa flow with a certified instructor',
      'Guided 10-minute closing meditation',
      'Wellness caf\u00e9 social half-hour with standing bistro tables',
      'Take-home eucalyptus stem and class-schedule card for each guest',
    ],
    vendorCats: ['Wellness', 'Catering'],
    proTips: [
      'Provide the mats. Removing the only barrier to attendance ("I don\u2019t own a mat") reliably lifts turnout by a third.',
      'Schedule for 8:30 AM, not 7:00 — aspirational-but-achievable timing fills classes.',
      'The caf\u00e9 afterward is the real event; budget as much attention there as on the class itself.',
    ],
  },
  'Farmers Market Pop-up': {
    titles:   ['The Courtyard Market', 'Market Morning', 'The Grower\u2019s Pop-up'],
    taglines: ['Local growers, right downstairs', 'Your Saturday market, steps from home', 'Fresh, local, and neighborly'],
    flyers:   ['The market comes to you', 'Local goods, zero commute', 'Saturday market, home edition'],
    overview: 'A curated pop-up market bringing local growers, bakers, and makers directly to the property. It converts an ordinary Saturday morning into a resident amenity — and gives the community a recurring ritual worth staying home for.',
    theme:    'Striped canopies, kraft-paper signage, and crate displays. Honest, sunlit, and unpolished in the best way.',
    catering: [
      'Complimentary drip coffee and fresh orange juice for residents',
      'Vendor stalls: seasonal produce, artisan bread, local honey, cut flowers',
      'Fresh-pressed juice and smoothie cart',
      'Warm pastry stand from a neighborhood bakery',
      'Tasting table: olive oils and small-batch preserves',
    ],
    entertainment: [
      'Acoustic guitarist near the entrance',
      'Kids\u2019 seed-planting table with take-home herb pots',
      'Chef demo at 11 AM: three dishes from today\u2019s market basket',
      'Resident tote giveaway for the first fifty attendees',
    ],
    vendorCats: ['Specialty', 'Entertainment'],
    proTips: [
      'Give every resident a branded tote at entry — it converts browsers into buyers and doubles as walking marketing for months.',
      'Invite eight vendors, not twenty. A tight, high-quality market beats a sparse-feeling large one.',
      'Run it monthly on a fixed Saturday; ritual, not novelty, is what builds attendance over time.',
    ],
  },
  'Movie Night': {
    titles:   ['Cinema Under the Stars', 'The Screening Social', 'Reel & Relax'],
    taglines: ['A classic film, a perfect evening', 'Popcorn, blankets, and the big screen', 'Movie night, the way it should be'],
    flyers:   ['Lights down, stars up', 'Bring a blanket, we\u2019ll bring the rest', 'Tonight\u2019s feature: your community'],
    overview: 'An outdoor screening that transforms shared space into a neighborhood cinema. Low effort for residents, high charm in execution — a family-friendly anchor event that photographs beautifully and costs modestly.',
    theme:    'Rows of lounge cushions and low-back chairs, string-lit perimeter, vintage concession signage, and a proper pre-show countdown reel.',
    catering: [
      'Gourmet popcorn bar: truffle-parmesan, classic butter, caramel-sea-salt',
      'Boxed candy stand and fresh-baked cookie tray',
      'Craft soda, sparkling lemonade, and boxed water station',
      'Warm pretzel cart with beer-cheese and honey-mustard dips',
      'Adults\u2019 corner: canned wine spritzers and local lager (ID-checked)',
    ],
    entertainment: [
      'Feature film on a 20-foot inflatable screen with cinema-grade projection',
      'Pre-show reel: resident-submitted pet photos set to music',
      'Trivia round before the feature with movie-pass prizes',
      'Blanket-and-cushion lending station at the entrance',
    ],
    vendorCats: ['AV & Production', 'Catering'],
    proTips: [
      'Let residents vote between two film options in the invitation email — the vote itself doubles as your attendance forecast.',
      'Start the pre-show reel 20 minutes early; arriving to something already happening removes the awkward-first-guest feeling.',
      'Rent real projection and audio. A dim screen and thin sound undo every other dollar spent.',
    ],
  },
  'Pool Party': {
    titles:   ['Midsummer Splash', 'The Deck Day Social', 'Solstice at the Pool'],
    taglines: ['The deck event of the season', 'Sun, spritzes, and a stocked grill', 'Summer, properly celebrated'],
    flyers:   ['Meet us at the water', 'The pool is open — and so is the bar', 'Summer\u2019s biggest splash'],
    overview: 'The flagship summer event: a full afternoon on the pool deck with a live grill, frozen drinks, and music that keeps energy high without overwhelming conversation. This is the event residents photograph most — production quality matters.',
    theme:    'Cabana stripes, citrus accents, and market umbrellas. Riviera-casual with towel service that makes the property feel like a resort.',
    catering: [
      'Live grill station: smash burgers, citrus-marinated chicken skewers, grilled corn',
      'Fresh fruit and paleta (Mexican ice pop) cart',
      'Frozen drink bar: fro\u0301se, margaritas, and virgin pi\u00f1a coladas',
      'Chilled watermelon-feta cups and street-corn salad',
      'Bottled water ice tubs stationed around the full deck',
    ],
    entertainment: [
      'DJ set: daytime tropical house, volume-managed for conversation',
      'Cannonball contest and pool relay with lifeguard supervision',
      'Cabana raffle: reserved daybed with bottle service for four winners',
      'Rolled-towel and sunscreen station at check-in',
    ],
    vendorCats: ['Catering', 'Staffing'],
    proTips: [
      'Book certified lifeguards and say so on the invitation — parents attend events they can relax at.',
      'Frozen-drink machines take 90 minutes to reach temperature; have them running two hours before doors.',
      'Shade sells: every umbrella and cabana will be claimed in the first 20 minutes, so over-provision by half.',
    ],
  },
  'Cooking Class': {
    titles:   ['The Chef\u2019s Table Workshop', 'Knife Skills & Small Plates', 'The Supper Club Class'],
    taglines: ['Cook together, eat together', 'A hands-on evening with a professional chef', 'Dinner you make, memories included'],
    flyers:   ['Aprons on. Class is in session.', 'Learn it tonight, cook it forever', 'Your kitchen skills, elevated'],
    overview: 'A hands-on culinary workshop where a professional chef guides small teams through a three-course menu they then sit down to enjoy together. Intimate by design — capped attendance turns scarcity into anticipation for the next session.',
    theme:    'Butcher paper, copper cookware, herb bundles at each station. The demonstration kitchen as theater.',
    catering: [
      'Course one (taught): burrata with blistered tomatoes and basil oil',
      'Course two (taught): handmade ricotta gnocchi with brown butter and sage',
      'Course three (taught): olive-oil citrus cake with mascarpone',
      'Welcome glass of prosecco and a paired wine with dinner',
      'Take-home recipe cards and a bundle of fresh herbs per guest',
    ],
    entertainment: [
      'Professional chef instruction with two culinary assistants',
      'Team plating challenge judged by the chef with a wooden-spoon trophy',
      'Communal candlelit dinner of the dishes prepared',
      'Printed apron keepsake with the property monogram',
    ],
    vendorCats: ['Catering', 'Staffing'],
    proTips: [
      'Cap the class at 16–20 and let the waitlist build; a sold-out series is worth more than a half-full room.',
      'Prep all mise en place before guests arrive — the class should feel like cooking, never like chopping.',
      'Photograph each team with their finished plates; those photos fill next month\u2019s registration in a day.',
    ],
  },
  'Art Exhibition & Gallery Walk': {
    titles:   ['The Resident Gallery Walk', 'First Thursday: An Art Evening', 'Local Canvas'],
    taglines: ['Local art, at home', 'An evening among the works', 'Where the lobby becomes a gallery'],
    flyers:   ['Your building, reimagined as a gallery', 'Art, wine, and slow evenings', 'See something beautiful tonight'],
    overview: 'A curated evening exhibition of local artists staged through the property\u2019s common spaces, with wine service and artist talks. Cultural programming distinguishes a luxury community more than any single amenity — this event is a statement of identity.',
    theme:    'Gallery-white pedestals and picture lights against the building\u2019s architecture, with unhurried acoustic guitar and long-stem glassware.',
    catering: [
      'Passed wine service: a crisp white, a structured red, and a sparkling',
      'Gallery bites: goat-cheese tartlets, prosciutto-wrapped grissini, chocolate-dipped strawberries',
      'Sparkling water and a nonalcoholic botanical spritz',
      'Espresso cart during the closing hour',
      'Petit-four tray for the artist-talk audience',
    ],
    entertainment: [
      'Exhibition of 15–20 works by four local artists, each with a story card',
      'Two short artist talks at 7:00 and 8:00 PM',
      'Silent bid sheets — a portion of sales supports a neighborhood arts nonprofit',
      'Classical guitarist stationed in the main gallery run',
    ],
    vendorCats: ['Entertainment', 'Bar Service'],
    proTips: [
      'Partner with a local gallery to curate — borrowed credibility elevates the whole evening and halves your sourcing work.',
      'Story cards beside each work give shy guests something to do; art events live or die on removing that first-minute awkwardness.',
      'Announce the artists in the invitation with one image each; specific beats generic in every open-rate test.',
    ],
  },
  'Networking Mixer': {
    titles:   ['The Exchange: A Resident Mixer', 'Cards & Cocktails', 'The Professional Social'],
    taglines: ['Your best professional connection lives down the hall', 'An evening for ambitious neighbors', 'Network without leaving home'],
    flyers:   ['Meet the professionals next door', 'Great careers, same address', 'Connections, poured neatly'],
    overview: 'A professionally-framed mixer for a community of ambitious residents — structured enough that introductions happen naturally, relaxed enough that it never feels like a conference. The event that makes young professionals feel the building was designed for them.',
    theme:    'Club chairs, brass table lamps, and espresso-toned accents. Executive lounge, not hotel ballroom.',
    catering: [
      'Manhattan and French-75 welcome pours with a zero-proof spritz option',
      'Substantial passed bites: short-rib crostini, crab cakes, truffle mac spoons',
      'Espresso martini bar for the second hour',
      'Charcuterie and aged-cheddar boards along the lounge rail',
      'Still and sparkling water service throughout',
    ],
    entertainment: [
      'Structured icebreaker: three-question card exchanged with two new people before the bar\u2019s second round',
      'Five-minute lightning talk from a resident founder or leader',
      'Industry-cluster tables signed by field: tech, finance, healthcare, creative',
      'LinkedIn-ready portrait corner with a photographer for the first hour',
    ],
    vendorCats: ['Bar Service', 'Photography'],
    proTips: [
      'The free professional headshot is the single highest-ROI draw for this format — lead the invitation with it.',
      'Keep the lightning talk to five minutes, no slides; programming should spark conversation, not replace it.',
      'Collect industries at RSVP and print them on name badges — you\u2019ve just done everyone\u2019s hardest networking work for them.',
    ],
  },
  'Family Fun Day': {
    titles:   ['The Courtyard Carnival', 'Family Field Day', 'The Big Backyard Bash'],
    taglines: ['An afternoon the kids will talk about all week', 'Games, treats, and golden-hour picnics', 'Family time, community style'],
    flyers:   ['Bring the whole crew', 'Big fun for the smallest residents', 'The backyard bash of the season'],
    overview: 'A festival-style afternoon built for households — carnival games, craft stations, and food that pleases every age. Family programming is retention programming: parents renew leases where their kids have friends.',
    theme:    'Bunting, picnic blankets on the lawn, hand-painted game signage. Nostalgic county-fair charm with modern comfort.',
    catering: [
      'Picnic classics: sliders, corn dogs, fruit skewers, and a veggie-cup wall',
      'Snow-cone and cotton-candy carts',
      'Lemonade-stand bar with fresh-squeezed options',
      'Parents\u2019 caf\u00e9 corner: iced coffee and seltzer bar',
      'Allergy-aware treat table, clearly labeled',
    ],
    entertainment: [
      'Carnival game alley: ring toss, duck pond, beanbag ladder — prize tickets throughout',
      'Face painter and balloon artist (two-hour bookings)',
      'Craft tent: build-a-birdhouse and friendship bracelets',
      'Golden-hour family photo station with instant prints',
    ],
    vendorCats: ['Entertainment', 'Catering'],
    proTips: [
      'Schedule 2–5 PM to end before dinner meltdowns; leaving on a high note is a feature, not a bug.',
      'The prize table needs three restocks, not one — running out of prizes is the only bad review this event can earn.',
      'A quiet crafts tent gives overstimulated kids (and their parents) an exit ramp that keeps families onsite longer.',
    ],
  },
  'Brunch Gathering': {
    titles:   ['The Weekend Table', 'Sunday Best Brunch', 'Late Morning Social'],
    taglines: ['Long tables, slow mornings', 'The brunch your Sunday deserves', 'Come hungry, stay talking'],
    flyers:   ['Brunch is served, neighbors', 'Waffles, mimosas, and good company', 'Sundays, done properly'],
    overview: 'A leisurely late-morning gathering around long communal tables — the most naturally social meal of the week, put in service of the community. Brunch reliably draws residents who skip evening events, broadening who actually knows whom in the building.',
    theme:    'White linen, citrus centerpieces, and morning light. Unfussy elegance with carafes of everything within arm\u2019s reach.',
    catering: [
      'Belgian waffle and omelet stations with a full toppings run',
      'Smoked-salmon and bagel board with whipped schmears',
      'Seasonal fruit table and Greek-yogurt parfait bar',
      'Mimosa and bellini carafes with fresh-pressed juice for zero-proof pours',
      'Drip coffee, cold brew, and a proper tea service',
    ],
    entertainment: [
      'Live acoustic brunch set — bossa nova and soft standards',
      'Communal long-table seating with conversation-starter cards',
      'Bloody-mary garnish build-your-own bar as interactive theater',
      'Recipe-card takeaway of the kitchen\u2019s signature waffle',
    ],
    vendorCats: ['Catering', 'Entertainment'],
    proTips: [
      'Seat at long tables and remove the option of standing apart — brunch works because it engineers proximity.',
      'Stagger arrival windows on the RSVP (10:00 / 10:45) to keep the omelet line under five minutes.',
      'The tea service is disproportionately noticed: a real pot and real cups quietly say "luxury" better than any banner.',
    ],
  },
  'Bourbon & Cigar Evening': {
    titles:   ['The Barrel Room Evening', 'Amber & Oak', 'The Gentleman\u2019s Hour (All Welcome)'],
    taglines: ['Slow pours and slower conversation', 'An evening aged to perfection', 'Small-batch everything'],
    flyers:   ['Neat, on the rocks, or on the terrace', 'An evening worth savoring', 'Pull up a chair by the fire'],
    overview: 'A refined tasting evening built around small-batch bourbons, guided by a whiskey educator, with an optional open-air cigar lounge. Unapologetically premium programming for a community that appreciates craft — capped attendance keeps it intimate.',
    theme:    'Leather club seating, low amber lighting, fire tables on the terrace. A private-den atmosphere with white-glove pours.',
    catering: [
      'Guided flight of four small-batch bourbons with tasting notes cards',
      'Pairings: smoked brisket bites, aged cheddar, candied pecans, dark chocolate',
      'Classic old fashioned and smoked-maple manhattan bar after the flight',
      'Craft root-beer and smoked-tea zero-proof flight',
      'Charred-orange and luxardo garnish station',
    ],
    entertainment: [
      'Whiskey educator-led tasting with distillery stories',
      'Optional terrace cigar lounge with a professional roller (outdoor, opt-in)',
      'Vinyl listening corner: jazz and blues on a vintage turntable',
      'Engraved-glass keepsake for each attendee',
    ],
    vendorCats: ['Bar Service', 'Specialty'],
    proTips: [
      'Keep cigars strictly outdoors and clearly opt-in on the invite; the format draws well but only when non-smokers feel considered.',
      'Half-ounce tasting pours across four bourbons is the right liability posture — the bar afterward is where fuller pours belong.',
      'The engraved glass costs less than a centerpiece and becomes a permanent artifact of the community in fifty residences.',
    ],
  },
  'Pet Social': {
    titles:   ['The Yappy Hour', 'Paws on the Patio', 'The Dog Days Social'],
    taglines: ['For residents with four-legged roommates', 'Treats for them, drinks for you', 'The friendliest event on the calendar'],
    flyers:   ['Leashes required. Fun guaranteed.', 'Bring your best friend', 'Sit. Stay. Socialize.'],
    overview: 'A patio social for residents and their dogs — the fastest icebreaker in residential programming, because every dog is an introduction waiting to happen. Pairs a human refreshment bar with a pup treat station and low-key contests.',
    theme:    'Gingham blankets, galvanized water stations, and a balloon arch at the "pup check-in." Playful without being childish.',
    catering: [
      'Human bar: canned spritzers, local beer, and iced tea',
      'Walking bites: pretzel bags, fruit cups, and cookie tins',
      'Pup treat bar: bakery dog biscuits and frozen peanut-butter pops',
      'Fresh water stations with bowls at four corners of the patio',
      '"Pupcake" tower for the costume-contest winners',
    ],
    entertainment: [
      'Best-trick and best-dressed contests with local pet-store prize baskets',
      'Pet photographer with instant prints at a flower-wall backdrop',
      'Mobile groomer offering complimentary nail trims',
      'Adoption-partner corner with a local rescue (goodwill and great photos)',
    ],
    vendorCats: ['Specialty', 'Photography'],
    proTips: [
      'Require leashes and station one staffer as a calm "traffic manager" — one well-handled dog moment protects the event\u2019s reputation.',
      'The pet photographer is the draw; those portraits get framed in units and shared everywhere with your community\u2019s name attached.',
      'Invite a rescue partner: the adoption corner turns a fun event into a story residents feel good telling.',
    ],
  },
}

const FALLBACK_CONCEPT: TypeConcept = {
  titles:   ['The Signature Social', 'An Evening at Home', 'The Community Gathering'],
  taglines: ['A gathering designed around your community', 'Thoughtful details, effortless evening', 'Where neighbors become friends'],
  flyers:   ['You\u2019re invited', 'An evening designed for you', 'Save the date, neighbors'],
  overview: 'A thoughtfully produced resident gathering designed to bring the community together in an elevated, unhurried setting — with food, drink, and programming calibrated to the residents who actually live here.',
  theme:    'Warm neutrals, candlelight, and greenery. Understated luxury that lets conversation take center stage.',
  catering: [
    'Passed seasonal hors d\u2019oeuvres from a local caterer',
    'Grazing table with artisan cheeses, charcuterie, and seasonal fruit',
    'Signature cocktail and a curated wine selection',
    'Sparkling water and botanical mocktail station',
    'Sweet finale: petit fours and chocolate truffles',
  ],
  entertainment: [
    'Live acoustic music during arrival and the first hour',
    'Photo moment with a styled backdrop',
    'Community raffle with a local-business prize',
    'Lounge seating clusters arranged for conversation',
  ],
  vendorCats: ['Catering', 'Entertainment'],
  proTips: [
    'Greet each resident by name within the first minute — the roster review before doors is the highest-leverage 15 minutes of the event.',
    'End the event 30 minutes after its natural peak; leaving residents wanting more is the setup for the next RSVP.',
  ],
}

function conceptFor(eventType: string): TypeConcept {
  return CONCEPTS[eventType] ?? FALLBACK_CONCEPT
}

// ─── Timelines by group ─────────────────────────────────────────────────────────

const TIMELINES: Record<TypeGroup, TimelineItem[]> = {
  evening_social: [
    { time: '4:30 PM',  activity: 'Vendor load-in and setup — furniture, bar, and lighting placed',        responsible: 'Property team' },
    { time: '5:45 PM',  activity: 'Staff briefing, final walkthrough, and music check',                     responsible: 'Event lead' },
    { time: '6:00 PM',  activity: 'First pours staged; greeter positioned at entrance',                     responsible: 'Bar service' },
    { time: '6:30 PM',  activity: 'Doors open — welcome drinks and passed appetizers begin',                responsible: 'Catering' },
    { time: '7:15 PM',  activity: 'Live music set begins; lounge lighting dims to evening level',           responsible: 'Entertainment' },
    { time: '8:00 PM',  activity: 'Property team welcome remarks (90 seconds) and community toast',         responsible: 'Property manager' },
    { time: '8:45 PM',  activity: 'Second appetizer pass and dessert service opens',                        responsible: 'Catering' },
    { time: '9:30 PM',  activity: 'Last call announced with final music set',                               responsible: 'Bar service' },
    { time: '10:00 PM', activity: 'Event close, guest farewells, and breakdown begins',                     responsible: 'Property team' },
  ],
  daytime_social: [
    { time: '11:00 AM', activity: 'Vendor load-in — stations, shade structures, and sound check',           responsible: 'Property team' },
    { time: '12:15 PM', activity: 'Staff briefing and safety walkthrough',                                  responsible: 'Event lead' },
    { time: '1:00 PM',  activity: 'Doors open — check-in, welcome refreshments, and music begins',          responsible: 'Property team' },
    { time: '1:30 PM',  activity: 'Food stations open for full service',                                    responsible: 'Catering' },
    { time: '2:30 PM',  activity: 'Featured activity and contests begin',                                   responsible: 'Entertainment' },
    { time: '3:30 PM',  activity: 'Refresh pass — stations restocked, seating reset',                       responsible: 'Catering' },
    { time: '4:30 PM',  activity: 'Final round of activities and raffle drawing',                           responsible: 'Event lead' },
    { time: '5:00 PM',  activity: 'Event close and breakdown',                                              responsible: 'Property team' },
  ],
  wellness: [
    { time: '7:30 AM',  activity: 'Space setup — mats laid, caf\u00e9 station staged, playlist tested',       responsible: 'Property team' },
    { time: '8:15 AM',  activity: 'Instructor arrival and space walkthrough',                               responsible: 'Wellness instructor' },
    { time: '8:30 AM',  activity: 'Check-in opens — mats assigned, infused water offered',                  responsible: 'Property team' },
    { time: '8:45 AM',  activity: 'Class begins — all-levels guided session',                               responsible: 'Wellness instructor' },
    { time: '9:45 AM',  activity: 'Closing meditation and cooldown',                                        responsible: 'Wellness instructor' },
    { time: '10:00 AM', activity: 'Wellness caf\u00e9 opens — coffee, juice, and light bites',                responsible: 'Catering' },
    { time: '10:45 AM', activity: 'Social wind-down and take-home gifts at exit',                           responsible: 'Property team' },
    { time: '11:00 AM', activity: 'Close and reset of the space',                                           responsible: 'Property team' },
  ],
  family: [
    { time: '11:30 AM', activity: 'Setup — game stations, tents, and food carts placed',                    responsible: 'Property team' },
    { time: '1:30 PM',  activity: 'Vendor arrivals: entertainers, carts, and photo station',                responsible: 'Event lead' },
    { time: '2:00 PM',  activity: 'Doors open — check-in with activity maps and prize tickets',             responsible: 'Property team' },
    { time: '2:15 PM',  activity: 'Game stations and craft tent open; treats begin service',                responsible: 'Entertainment' },
    { time: '3:00 PM',  activity: 'Featured entertainment set (all ages)',                                  responsible: 'Entertainment' },
    { time: '4:00 PM',  activity: 'Contests and prize ceremony',                                            responsible: 'Event lead' },
    { time: '4:30 PM',  activity: 'Golden-hour photo station peak; final treat service',                    responsible: 'Photography' },
    { time: '5:00 PM',  activity: 'Event close and family farewells',                                       responsible: 'Property team' },
  ],
  culinary: [
    { time: '4:00 PM',  activity: 'Kitchen and dining setup — stations prepped, mise en place complete',    responsible: 'Catering' },
    { time: '5:30 PM',  activity: 'Chef and assistants arrive; final station check',                        responsible: 'Chef' },
    { time: '6:00 PM',  activity: 'Guest arrival — welcome pour and seat assignments',                      responsible: 'Property team' },
    { time: '6:20 PM',  activity: 'Session one begins: technique demonstration and hands-on prep',          responsible: 'Chef' },
    { time: '7:15 PM',  activity: 'Session two: mains preparation with paired pours',                       responsible: 'Chef' },
    { time: '8:00 PM',  activity: 'Communal table service — guests enjoy the dishes prepared',              responsible: 'Catering' },
    { time: '8:45 PM',  activity: 'Dessert course and chef Q&A',                                            responsible: 'Chef' },
    { time: '9:15 PM',  activity: 'Farewells with take-home recipe cards; breakdown begins',                responsible: 'Property team' },
  ],
}

// ─── Regeneration variant pools (per group) ─────────────────────────────────────

const ALT_CATERING: Record<TypeGroup, string[]> = {
  evening_social: [
    'Raw bar moment: oysters on ice with mignonette for the first hour',
    'Passed bites: duck confit crostini, burrata spoons, crispy polenta with romesco',
    'Signature pours: a barrel-aged negroni and a cucumber-yuzu gimlet',
    'Zero-proof program: seedlip spritzes and a shrub soda bar',
    'Midnight-style snack send-off: parmesan truffle fries in paper cones',
  ],
  daytime_social: [
    'Wood-fired pizza cart with three rotating pies',
    'Agua fresca trio: watermelon-mint, cucumber-lime, hibiscus',
    'Build-your-own poke and grain-bowl station',
    'Local gelato cart with four seasonal flavors',
    'Iced-coffee and cold-brew bar with flavored syrups',
  ],
  wellness: [
    'Matcha and adaptogen latte bar',
    'Overnight-oat jars with a seed-and-berry topping station',
    'Green smoothie flight in tasting glasses',
    'Avocado-toast bar on seeded sourdough',
    'Coconut water and electrolyte refresh station',
  ],
  family: [
    'Make-your-own trail mix wall',
    'Mini grilled-cheese and tomato-soup shooters',
    'Fresh-fruit "paint palettes" with yogurt dip',
    'Popcorn trio cart: butter, cheddar, kettle',
    'Hot-cocoa or lemonade bar (season-appropriate) with toppings',
  ],
  culinary: [
    'Interactive crostini course with four seasonal toppings',
    'Hand-rolled pasta workshop segment with imported semolina',
    'Regional wine pairing swapped for a craft-cocktail pairing',
    'Chef\u2019s amuse-bouche welcome bite on arrival',
    'Affogato finale station with house espresso',
  ],
}

const ALT_ENTERTAINMENT: Record<TypeGroup, string[]> = {
  evening_social: [
    'Roaming close-up magician for the first hour',
    'Live saxophonist layered over the DJ\u2019s downtempo set',
    'Tarot or tea-leaf reading corner (playful, opt-in)',
    'Perfume or candle-scent blending bar as an interactive moment',
  ],
  daytime_social: [
    'Live steel-drum duo for island-afternoon energy',
    'Lawn-game tournament bracket with a champion\u2019s trophy',
    'Caricature artist doing five-minute sketches',
    'Polaroid scavenger hunt across the amenity spaces',
  ],
  wellness: [
    'Sound-bath closing with crystal bowls',
    'Cold-plunge demo and breathwork mini-session',
    'Smoothie-bike station — pedal-blended drinks',
    'Mini massage chairs with a licensed therapist (10-minute slots)',
  ],
  family: [
    'Bubble-artist performance on the lawn',
    'Petting-zoo corner with a licensed handler',
    'Story-time tent on the half hour',
    'Sidewalk-chalk mural wall — one big collaborative piece',
  ],
  culinary: [
    'Blind-tasting challenge round between courses',
    'Knife-skills speed demo with safety takeaway card',
    'Latte-art mini lesson with the espresso course',
    'Mixology add-on: guests build the paired cocktail themselves',
  ],
}

const ALT_LOGISTICS: string[] = [
  'Reserve both service elevators for vendor load-in from two hours before doors',
  'Place directional signage at the lobby, elevator banks, and amenity entrance',
  'Stage a coat and bag check at the entrance with numbered tags',
  'Position a dedicated trash-and-reset staffer on a 20-minute floor loop',
  'Pre-cool or pre-heat the space 90 minutes ahead; adjust once at half capacity',
  'Keep a stocked spill-and-breakage kit behind the bar',
  'Confirm quiet-hours compliance and notify neighboring units 48 hours ahead',
  'Photograph the space before doors for records and future marketing',
]

// ─── Section builders ───────────────────────────────────────────────────────────

function buildStaffing(headcount: number, alcohol: string, group: TypeGroup): StaffingRole[] {
  const servers    = Math.max(2, Math.round(headcount / 30))
  const bartenders = alcohol === 'No alcohol' ? 0 : Math.max(1, Math.round(headcount / 45))
  const roles: StaffingRole[] = [
    { role: 'Event lead',         count: 1,        notes: 'Owns run-of-show, vendor arrivals, and the resident welcome' },
    { role: 'Service staff',      count: servers,  notes: 'Passed service, station support, and continuous floor resets' },
  ]
  if (bartenders > 0) {
    roles.push({ role: 'Bartenders', count: bartenders, notes: 'Certified; manage pours, ID checks, and responsible service' })
  }
  if (group === 'family' || group === 'daytime_social') {
    roles.push({ role: 'Activity attendants', count: Math.max(1, Math.round(headcount / 50)), notes: 'Run game stations and manage lines' })
  }
  if (group === 'wellness') {
    roles.push({ role: 'Certified instructor', count: 1, notes: 'Leads the session; insured and COI on file' })
  }
  roles.push({ role: 'Setup & breakdown crew', count: 2, notes: 'Load-in from two hours prior; full reset after close' })
  return roles
}

function buildAlcohol(headcount: number, alcohol: string, budgetMid: number): AlcoholEstimate | null {
  if (alcohol === 'No alcohol') return null
  const fullBar = alcohol === 'Full bar'
  const servings = fullBar ? 2.5 : 2
  const totalServings = Math.round(headcount * servings)
  const wineBottles   = Math.round(totalServings * (fullBar ? 0.35 : 0.55) / 5)
  const beerUnits     = Math.round(totalServings * (fullBar ? 0.25 : 0.45))
  const spiritBottles = fullBar ? Math.round(totalServings * 0.4 / 16) : 0
  const cost = Math.round(Math.min(budgetMid * 0.22, totalServings * (fullBar ? 6.5 : 4.5)))
  return {
    servingsPerPerson: servings,
    totalBottles: fullBar
      ? `${wineBottles} bottles of wine, ${beerUnits} craft beers, ${spiritBottles} spirit bottles`
      : `${wineBottles} bottles of wine, ${beerUnits} craft beers`,
    recommendations: [
      fullBar
        ? 'Anchor the bar with two signature cocktails to control pour costs and speed the line'
        : 'Offer one crisp white, one versatile red, and a local flagship beer',
      'Stock zero-proof options at a 1:5 ratio — visible, not hidden behind the bar',
      'Arrange retail buy-back for unopened bottles to protect the budget',
      'Close the bar 30 minutes before event end with water and coffee service',
    ],
    estimatedCost: money(cost),
  }
}

function buildBudget(budgetMid: number, alcohol: string, group: TypeGroup): string[] {
  const noBar = alcohol === 'No alcohol'
  const alloc: [string, number][] = noBar
    ? [
        ['Catering & food', 0.46],
        [group === 'wellness' ? 'Instruction & programming' : 'Entertainment & programming', 0.18],
        ['Staffing & service', 0.12],
        ['D\u00e9cor, rentals & lighting', 0.12],
        ['Beverages (non-alcoholic)', 0.06],
        ['Contingency reserve', 0.06],
      ]
    : [
        ['Catering & food', 0.38],
        ['Bar service & beverage', 0.20],
        ['Entertainment & programming', 0.14],
        ['Staffing & service', 0.10],
        ['D\u00e9cor, rentals & lighting', 0.12],
        ['Contingency reserve', 0.06],
      ]
  return alloc.map(([label, share]) => `${label} — ${money(budgetMid * share)} (${Math.round(share * 100)}%)`)
}

function buildSetupLogistics(group: TypeGroup, venue: string): string[] {
  const base = [
    'Confirm all vendor COIs are on file one week before the event',
    'Vendor load-in scheduled two hours before doors via the service entrance',
    'Signage placed at lobby, elevators, and the event entrance the morning of',
    'Sound check and lighting scene set 45 minutes before doors',
    'Dedicated floor staffer on a continuous reset loop during service',
    'Breakdown, waste removal, and amenity reset completed same evening',
  ]
  if (/outdoor|rooftop|pool|flexible/i.test(venue)) {
    base.splice(1, 0, 'Weather call at noon with the indoor fallback pre-staged and communicated to vendors')
  }
  if (group === 'family') {
    base.splice(2, 0, 'Safety sweep of activity areas; first-aid kit stationed at check-in')
  }
  if (group === 'wellness') {
    base.splice(2, 0, 'Mats, blocks, and towels staged per guest; space pre-ventilated and screens silenced')
  }
  return base
}

function buildVendorIdeas(concept: TypeConcept, budgetMid: number): VendorIdea[] {
  const [catA, catB] = concept.vendorCats
  const suggestionPools: Record<string, string[]> = {
    'Catering':        ['Full-service caterer with passed-service staff', 'Local restaurant partner for a featured station', 'Dessert specialist for the finale course'],
    'Bar Service':     ['Licensed mobile bar with certified bartenders', 'Sommelier or spirits educator for guided pours', 'Zero-proof cocktail specialist'],
    'Entertainment':   ['Live acoustic act sourced from a local booking collective', 'DJ with residential-event volume experience', 'Interactive entertainer (magician, caricaturist, or artist)'],
    'AV & Production': ['Projection, screen, and cinema-grade audio package', 'Uplighting and string-light installation', 'Wireless mic kit for remarks and toasts'],
    'Staffing':        ['Certified event staff for service and resets', 'Licensed lifeguards for water-adjacent events', 'Coat check and greeter staffing'],
    'Photography':     ['Event photographer for a two-hour coverage window', 'Instant-print photo station with attendant', 'Portrait corner setup with professional lighting'],
    'Wellness':        ['Certified yoga or fitness instructor (insured)', 'Massage or recovery specialists for mini sessions', 'Sound-bath practitioner for the closing segment'],
    'Specialty':       ['Curated local-maker or grower partners', 'Themed cart vendor (coffee, gelato, cigar roller, pet treats)', 'Keepsake vendor: engraving, prints, or take-home gifts'],
    'Florals':         ['Seasonal centerpiece and entrance arrangement package', 'Statement installation for the photo moment'],
  }
  return [
    { category: catA, suggestions: (suggestionPools[catA] ?? suggestionPools['Specialty']).slice(0, 3), estimatedCost: money(budgetMid * 0.34) },
    { category: catB, suggestions: (suggestionPools[catB] ?? suggestionPools['Entertainment']).slice(0, 3), estimatedCost: money(budgetMid * 0.16) },
  ]
}

function buildEmail(
  concept: TypeConcept,
  form: EventFormData,
  title: string,
  propertyName: string,
  group: TypeGroup
): { subject: string; body: string } {
  const seasonWord = (form.season || 'the season').replace(' / Autumn', '')
  const timeWord =
    group === 'wellness' ? 'morning' :
    group === 'family' || group === 'daytime_social' ? 'afternoon' : 'evening'
  const subject = pick([
    `You\u2019re invited: ${title} at ${propertyName}`,
    `Save the date — ${title}`,
    `${propertyName} presents: ${title}`,
  ])
  const body = [
    `Dear Residents,`,
    ``,
    `We\u2019re delighted to invite you to ${title} — a ${seasonWord.toLowerCase()} ${timeWord} created exclusively for the ${propertyName} community.`,
    ``,
    `Expect ${concept.catering[0].split(':')[0].toLowerCase()}, ${concept.entertainment[0].toLowerCase().replace(/\.$/, '')}, and the company of your neighbors in one of our favorite spaces. ${form.alcohol === 'No alcohol' ? 'Refreshments will be served throughout.' : 'Complimentary food and drink will be served throughout.'}`,
    ``,
    `Space is limited, so please RSVP through the resident portal or with the front desk by the end of the week. We can\u2019t wait to celebrate with you.`,
    ``,
    `Warm regards,`,
    `The ${propertyName} Team`,
  ].join('\n')
  return { subject, body }
}

// ─── Main composer ──────────────────────────────────────────────────────────────

export function composeExperiencePlan(
  form: EventFormData,
  profile?: Pick<PropertyProfile, 'propertyName'> | null
): EventPlan {
  variantCounter += 1

  const concept      = conceptFor(form.eventType)
  const group        = groupFor(form.eventType)
  const headcount    = parseAttendance(form.attendance || '50 – 100 residents')
  const budgetMid    = parseBudget(form.budget || '$2,500 – $5,000')
  const propertyName = profile?.propertyName?.trim() || 'The Meridian'

  const title = pick(concept.titles)

  return {
    title,
    tagline:         pick(concept.taglines),
    overview:        concept.overview,
    theme:           concept.theme,
    timeline:        TIMELINES[group],
    catering:        rotate(concept.catering, variantCounter % 2),
    entertainment:   rotate(concept.entertainment, variantCounter % 2),
    logistics: [
      'Event lead carries the run-of-show with vendor contacts and timing cues',
      'Front desk briefed on the event so arriving residents are directed smoothly',
      'Floor reset loop every 20 minutes keeps the space photo-ready throughout',
      'Final headcount reconciled against RSVPs 24 hours before doors',
    ],
    budgetBreakdown: buildBudget(budgetMid, form.alcohol, group),
    vendorIdeas:     buildVendorIdeas(concept, budgetMid),
    staffing:        buildStaffing(headcount, form.alcohol, group),
    alcoholEstimate: buildAlcohol(headcount, form.alcohol, budgetMid),
    setupLogistics:  buildSetupLogistics(group, form.venue),
    residentEmail:   buildEmail(concept, form, title, propertyName, group),
    flyerHeadline:   pick(concept.flyers),
    proTip:          pick(concept.proTips),
  }
}

// ─── Section regeneration (Experience mode) ─────────────────────────────────────

export function composeSectionVariant(
  event: SavedEvent,
  section: RegenerableSection
):
  | string
  | string[]
  | TimelineItem[]
  | StaffingRole[]
  | VendorIdea[]
  | { subject: string; body: string } {
  variantCounter += 1

  const eventType = event.meta?.eventType ?? 'Cocktail Reception'
  const concept   = conceptFor(eventType)
  const group     = groupFor(eventType)
  const headcount = parseAttendance(event.meta?.attendance ?? '50 – 100 residents')
  const budgetMid = parseBudget(event.meta?.budget ?? '$2,500 – $5,000')

  switch (section) {
    case 'catering':
      return rotate(ALT_CATERING[group], variantCounter)
    case 'entertainment':
      return rotate(ALT_ENTERTAINMENT[group], variantCounter)
    case 'setup_logistics':
      return rotate(ALT_LOGISTICS, variantCounter).slice(0, 6)
    case 'timeline':
      return TIMELINES[group].map((item, i) =>
        i === 1
          ? { ...item, activity: 'Extended staff briefing: service standards, resident VIP notes, and run-of-show' }
          : item
      )
    case 'staffing':
      return buildStaffing(headcount + 10, event.meta?.alcohol ?? 'Full bar', group)
    case 'vendor_ideas':
      return buildVendorIdeas(concept, budgetMid)
    case 'resident_email': {
      const form: EventFormData = {
        eventType,
        budget:      event.meta?.budget ?? '',
        attendance:  event.meta?.attendance ?? '',
        season:      event.meta?.season ?? '',
        venue:       event.meta?.venue ?? '',
        alcohol:     event.meta?.alcohol ?? '',
        demographic: (event.meta?.demographic ?? '') as EventFormData['demographic'],
        notes:       '',
      }
      return buildEmail(concept, form, event.title, 'The Meridian', group)
    }
    case 'flyer_headline': {
      const current = event.flyerHeadline
      return concept.flyers.find((f) => f !== current) ?? pick(concept.flyers)
    }
    case 'pro_tip': {
      const current = event.proTip
      return concept.proTips.find((t) => t !== current) ?? pick(concept.proTips)
    }
  }
}
