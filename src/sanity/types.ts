export interface Cta { label: string; href: string; variant?: string; openInNewTab?: boolean }

export interface GatheringRow { label: string; value: string; href?: string; copy?: string }

export interface Gathering {
  key: 'sundaySchool' | 'sunday' | 'bibleStudy' | 'prayerLine'
  name: string
  timeLabel: string
  nextLabel: string
  weekday: number
  startTime: string
  durationMinutes: number
  rows?: GatheringRow[]
  action?: Cta
  calendarDetails?: string
}

export interface Settings {
  siteName?: string
  email?: string
  facebook?: string
  instagram?: string
  youtube?: string
  phone?: string
  address?: string
  directions?: string
  locationName?: string
  donateUrl?: string
  footerTagline?: string
  copyrightName?: string
  googleAnalyticsId?: string
  defaultSeo?: { metaDescription?: string; ogImage?: { asset?: { url: string } } }
  gatherings?: Gathering[]
  pastorName?: string
  pastorPhoto?: { asset?: { url: string } }
  pastorSummary?: string
  pastorBio?: string
  pastorVerse?: string
  pastorVerseCite?: string
  pastorClosing?: string
  affirmation?: string[]
}

export interface Card { _key?: string; title?: string; text?: string; link?: Cta }

/** One entry of a page's `sections` array. Fields vary by `_type`. */
export interface Section {
  _key: string
  _type: string
  eyebrow?: string
  heading?: string
  body?: string
  tone?: string
  anchor?: string
  button?: Cta
  textLink?: Cta
  numbered?: boolean
  cards?: Card[]
  gatheringKey?: Gathering['key']
  showFullBio?: boolean
  quote?: string
  cite?: string
  kind?: 'updates' | 'contact'
}
