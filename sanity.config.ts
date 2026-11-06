import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
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

/* ── Route Resolver ───────────────────────────────────────────────────────── */

/** Maps document types → frontend URLs for the Presentation / visual editing tool. */
function resolveDocumentUrl(doc: any) {
  switch (doc._type) {
    case 'homePage':
      return '/'
    case 'page':
      return doc?.slug?.current ? `/${doc.slug.current}` : '/'
    default:
      return '/'
  }
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
  title: 'Client Site Name',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  // ─────────────────────────────────────────────────────────────

  plugins: [
    structureTool({ structure }),

    presentationTool({
      previewUrl: import.meta.env.SITE_URL ?? 'http://localhost:4321',
      resolve: {
        locations: {
          homePage: {
            select: {},
            resolve: resolveDocumentUrl,
          },
          page: {
            select: { slug: 'slug.current' },
            resolve: resolveDocumentUrl,
          },
        },
      },
    }),

    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
