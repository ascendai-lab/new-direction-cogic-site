import { createClient, type SanityClient } from '@sanity/client'
import { readToken } from '@/lib/preview'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2024-01-01'

/** The embedded Studio, unless SANITY_STUDIO_URL points at a hosted one. */
export const studioUrl = process.env.SANITY_STUDIO_URL || import.meta.env.SANITY_STUDIO_URL || '/studio'

/**
 * Default client: published content only.
 * useCdn: false is required for SSR + visual editing to work correctly.
 */
export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false })

/**
 * Fields the page uses for logic, class names, ids, attributes or the <head>.
 * Stega's invisible edit markers would break them, so they are never encoded.
 * (Sanity already skips URLs, dates, keys, hrefs, emails, *Id fields and anything under `seo`.)
 */
const NO_STEGA = new Set([
  'gatheringKey', 'tone', 'anchor', 'kind', 'startTime', 'copy', 'calendarDetails',
  'siteName', 'defaultSeo', 'metaTitle', 'metaDescription', 'heroImageAlt', 'logoAlt',
])

let preview: SanityClient | undefined

/** Preview client: drafts plus stega edit markers. Only used once preview mode is on. */
function previewClient(): SanityClient {
  preview ??= createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: readToken(),
    perspective: 'drafts',
    stega: {
      enabled: true,
      studioUrl,
      filter: (props) => {
        if (props.sourcePath.some((segment) => typeof segment === 'string' && NO_STEGA.has(segment))) return false
        return props.filterDefault(props)
      },
    },
  })
  return preview
}

/** A token-holding client without stega, for validating the Presentation tool's preview secret. */
export const tokenClient = () => sanityClient.withConfig({ token: readToken() })

/**
 * Returns the right client depending on whether we're in preview mode.
 * Use this in your .astro pages instead of importing clients directly.
 */
export function getClient(isPreview = false): SanityClient {
  return isPreview ? previewClient() : sanityClient
}
