import type { APIRoute } from 'astro'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { tokenClient } from '@cms/client'
import { PREVIEW_COOKIE, previewCookieValue } from '@/lib/preview'

/**
 * Sanity's Presentation tool calls this with a one-time secret it stored in the dataset.
 * If the secret checks out, the browser gets the preview cookie and sees drafts with click-to-edit.
 */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const value = previewCookieValue()
  if (!value) return new Response('Preview is not set up: SANITY_API_READ_TOKEN is missing.', { status: 500 })

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(tokenClient(), request.url)
  if (!isValid) return new Response('Invalid preview secret.', { status: 401 })

  // SameSite=None so preview also works when the Studio is hosted on another domain.
  cookies.set(PREVIEW_COOKIE, value, { path: '/', httpOnly: true, secure: true, sameSite: 'none' })
  return redirect(redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/', 307)
}
