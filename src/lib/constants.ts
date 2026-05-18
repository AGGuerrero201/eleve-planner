import type {
  VenueSetting,
  AlcoholService,
  ResidentDemo,
  Season,
  Budget,
  Attendance,
} from '@/types'

export const EVENT_TYPES = [
  'Cocktail Reception',
  'Rooftop Social',
  'Wine & Cheese Evening',
  'Holiday Party',
  'Wellness & Yoga Morning',
  'Farmers Market Pop-up',
  'Movie Night',
  'Pool Party',
  'Cooking Class',
  'Art Exhibition & Gallery Walk',
  'Networking Mixer',
  'Family Fun Day',
  'Brunch Gathering',
  'Bourbon & Cigar Evening',
  'Pet Social',
] as const

export const BUDGETS: Budget[] = [
  'Under $1,000',
  '$1,000 – $2,500',
  '$2,500 – $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000+',
]

export const ATTENDANCES: Attendance[] = [
  '10 – 25 residents',
  '25 – 50 residents',
  '50 – 100 residents',
  '100 – 200 residents',
  '200+ residents',
]

export const SEASONS: Season[] = ['Spring', 'Summer', 'Fall / Autumn', 'Winter']

export const VENUE_OPTIONS: { label: string; value: VenueSetting }[] = [
  { label: 'Indoor', value: 'Indoor' },
  { label: 'Outdoor', value: 'Outdoor' },
  { label: 'Both', value: 'Indoor & Outdoor' },
]

export const ALCOHOL_OPTIONS: { label: string; value: AlcoholService }[] = [
  { label: 'Full Bar', value: 'Full bar' },
  { label: 'Wine & Beer', value: 'Wine & beer only' },
  { label: 'Non-Alcoholic', value: 'No alcohol' },
]

export const DEMOGRAPHIC_OPTIONS: { label: string; value: ResidentDemo }[] = [
  { label: 'Young Professionals', value: 'Young professionals (25–35)' },
  { label: 'Families', value: 'Mixed ages, family-oriented' },
  { label: 'Mature Residents', value: 'Mature residents (50+)' },
  { label: 'Mixed', value: 'Mixed demographic' },
]
