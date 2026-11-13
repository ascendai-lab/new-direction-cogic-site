import { createHmac, timingSafeEqual } from 'node:crypto'
import type { AstroCookies } from 'astro'

/** Set by /api/draft-mode/enable once Sanity's Presentation tool proves the request came from the Studio. */
export const PREVIEW_COOKIE = 'sanity-preview'

/** Read at request time, because Netlify may only expose the token to functions, not to the build. */
export const readToken = (): string | undefined =>
  process.env.SANITY_API_READ_TOKEN ?? import.meta.env.SANITY_API_READ_TOKEN

/**
 * The cookie holds an HMAC of the read token, so it can't be guessed or forged,
 * and rotating the token signs every editor out of preview.
 */
export function previewCookieValue(): string | undefined {
  const token = readToken()
  return token ? createHmac('sha256', token).update('ndcogic-visual-editing').digest('hex') : undefined
}

export function isPreview(cookies: AstroCookies): boolean {
  const expected = previewCookieValue()
  const actual = cookies.get(PREVIEW_COOKIE)?.value
  if (!expected || !actual || actual.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
}
