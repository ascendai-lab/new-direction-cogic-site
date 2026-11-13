import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation'
import { schemaTypes } from './src/sanity/schemas'
import {
  DocumentIcon,
  ComposeIcon,
  HomeIcon,
  MenuIcon,
  CogIcon,
} from '@sanity/icons'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Singleton: clicking the item opens the document editor directly (no list). */
function singletonListItem(S: any, typeName: string, title: string, icon: any) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName))
}

/* ── Presentation (visual editing) ───────────────────────────────────────── */

/** Which document to open when the preview shows a given URL. */
const mainDocuments = defineDocuments([
  { route: '/', filter: `_type == "homePage"` },
  { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
])

/** Where each document appears on the site, shown at the top of its editor. */
const everyPage = () => ({
  message: 'Shown on every page',
  tone: 'caution' as const,
  locations: [{ title: 'Home', href: '/' }],
})
const locations = {
  homePage: defineLocations({
    select: {},
    resolve: () => ({ locations: [{ title: 'Home', href: '/' }] }),
  }),
  page: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({
      locations: doc?.slug ? [{ title: doc.title ?? doc.slug, href: `/${doc.slug}` }] : [],
    }),
  }),
  siteSettings: defineLocations({ select: {}, resolve: everyPage }),
  navConfig: defineLocations({ select: {}, resolve: everyPage }),
}

/* ── Structure ────────────────────────────────────────────────────────────── */

const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'homePage', 'Home Page', HomeIcon),

      S.divider(),

      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),

      S.divider(),

      // ── Singletons ─────────────────────────────────────────────
      singletonListItem(S, 'navConfig', 'Navigation', MenuIcon),
      singletonListItem(S, 'siteSettings', 'Site Settings', CogIcon),
    ])

/* ── Config ───────────────────────────────────────────────────────────────── */

export default defineConfig({
  name: 'default',

  // ── REPLACE THESE per client ─────────────────────────────────
  title: 'New Direction C.O.G.I.C',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  // ─────────────────────────────────────────────────────────────

  plugins: [
    structureTool({ structure }),

    presentationTool({
      previewUrl: {
        preview: '/',
        previewMode: { enable: '/api/draft-mode/enable', disable: '/api/draft-mode/disable' },
      },
      resolve: { mainDocuments, locations },
    }),

    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
