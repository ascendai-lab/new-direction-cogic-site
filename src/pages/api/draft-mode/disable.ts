import type { APIRoute } from 'astro'
import { PREVIEW_COOKIE } from '@/lib/preview'

/** Leaves preview mode. The Presentation tool calls this, and an editor can visit it directly. */
export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete(PREVIEW_COOKIE, { path: '/' })
  return redirect('/', 307)
}
