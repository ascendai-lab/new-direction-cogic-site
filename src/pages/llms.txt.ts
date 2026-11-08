import type { APIRoute } from 'astro'
import { sanityClient } from '@cms/client'
import { pageIndexQuery, siteSettingsQuery } from '@cms/queries'
import type { Settings } from '@cms/types'

// llms.txt (llmstxt.org): a plain-text summary so AI assistants answer questions about the church correctly.
export const GET: APIRoute = async ({ site, url }) => {
  const base = site ?? url
  const [s, pages] = await Promise.all([
    sanityClient.fetch<Settings>(siteSettingsQuery),
    sanityClient.fetch<{ slug: string; title: string; description?: string; noIndex?: boolean }[]>(pageIndexQuery),
  ])
  const name = s?.siteName ?? 'New Direction C.O.G.I.C'
  const lines = [
    `# ${name}`,
    '',
    `> ${s?.defaultSeo?.metaDescription ?? ''} Everyone is welcome. Pastor: ${s?.pastorName}`,
    '',
    '## Gatherings (all times Eastern)',
    '',
    ...(s?.gatherings ?? []).flatMap((g) => [
      `### ${g.name}: ${g.timeLabel}`,
      ...(g.rows ?? []).map((r) => `- ${r.label}: ${r.value}`),
      ...(g.action?.href?.startsWith('http') ? [`- Link: ${g.action.href}`] : []),
      '',
    ]),
    ...(s?.directions ? ['## Directions', '', s.directions, ''] : []),
    '## Contact',
    '',
    `- Email: ${s?.email}`,
    `- Pastor: ${s?.pastorName}`,
    `- Contact form: ${new URL('/contact', base).href}`,
    '',
    '## Pages',
    '',
    `- [Home](${new URL('/', base).href})`,
    ...pages.filter((p) => !p.noIndex).map((p) => `- [${p.title}](${new URL(`/${p.slug}`, base).href})${p.description ? `: ${p.description}` : ''}`),
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
