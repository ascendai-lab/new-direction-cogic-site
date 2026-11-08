import type { APIRoute } from 'astro'
import { indexingAllowed } from '@/lib/seo'

// Search engines and AI assistants (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) are all welcome via `*`.
export const GET: APIRoute = ({ site, url }) => {
  const base = site ?? url
  const body = indexingAllowed()
    ? `User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap.xml', base).href}\n`
    : 'User-agent: *\nDisallow: /\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
