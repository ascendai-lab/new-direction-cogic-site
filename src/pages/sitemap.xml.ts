import type { APIRoute } from 'astro'
import { sanityClient } from '@cms/client'
import { pageIndexQuery } from '@cms/queries'

export const GET: APIRoute = async ({ site, url }) => {
  const base = site ?? url
  const pages: { slug: string; updatedAt: string; noIndex?: boolean }[] = await sanityClient.fetch(pageIndexQuery)
  const entries = [{ slug: '', updatedAt: '' }, ...pages.filter((p) => !p.noIndex)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((p) => `  <url><loc>${new URL(`/${p.slug}`, base).href}</loc>${p.updatedAt ? `<lastmod>${p.updatedAt.slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
