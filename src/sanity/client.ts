import { createClient } from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

/**
 * Default client — used for all standard page data fetching.
 * useCdn: false is required for SSR + visual editing to work correctly.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})

/**
 * Preview client — includes the API token so draft documents are visible.
 * Only used when Sanity's Presentation Tool is active (visual editing mode).
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl: import.meta.env.SANITY_STUDIO_URL,
  },
})

/**
 * Returns the right client depending on whether we're in preview mode.
 * Use this in your .astro pages instead of importing clients directly.
 */
export function getClient(preview = false) {
  return preview ? previewClient : sanityClient
}
