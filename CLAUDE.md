# CLAUDE.md — Ascend AI Starter

This file tells Claude Code everything it needs to build consistently in this project.
Read this before touching any file.

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Astro 5 | `output: 'server'` — full SSR required for Sanity visual editing |
| Styling | Tailwind CSS 4 | No config file — all via `@import "tailwindcss"` in global.css |
| UI Components | shadcn/ui + Lucide icons | React components inside `.tsx` files |
| CMS | Sanity v3 | Studio hosted separately, embedded via `/studio` route |
| Visual Editing | Sanity Presentation Tool + Stega | Requires SSR — do NOT switch to static output |
| Hosting | Netlify | SSR via Netlify adapter. NOT Cloudflare Pages |
| Forms | Custom API route → n8n | See `src/pages/api/contact.ts` |
| Language | TypeScript strict | No `any` types. Use Zod for runtime validation |

---

## Design System

The DESIGN.md file in `.stitch/DESIGN.md` is the source of truth for ALL visual decisions.

- Colors, typography, spacing, and component styles come from DESIGN.md
- Never introduce colors, fonts, or spacing not defined there
- When building components, reference DESIGN.md first

CSS custom properties are defined in `src/styles/global.css`.
Tailwind utility classes map to those properties wherever possible.

---

## File Conventions

### Astro components (`.astro`)
- Used for layouts, pages, and non-interactive UI sections
- Fetch Sanity data at the top using `useSanityClient()` from `@sanity/astro`
- Always type the data with the schema types from `src/sanity/types.ts`

### React components (`.tsx`)
- Used for interactive UI only (forms, modals, carousels, portable text renderer)
- All shadcn/ui components live in `src/components/ui/`
- Portable text renderer is always a React component

### Pages
- `src/pages/index.astro` — homepage, fetches `homePage` singleton
- `src/pages/[...slug].astro` — catches all other CMS pages
- `src/pages/api/contact.ts` — form submission API route

---

## Sanity Schema Rules

- **Singletons** go in `src/sanity/schemas/singletons/` — one document, no list
- **Repeatable documents** go in `src/sanity/schemas/documents/`
- **Reusable field objects** go in `src/sanity/schemas/objects/`
- Every page schema MUST include the `seoFields` object
- Every page schema MUST have `studioUrl` set for visual editing
- Video embeds use the `videoEmbed` object schema — supports YouTube + Vimeo

### Singleton pattern (always use this for fixed pages)
```ts
// In sanity.config.ts structure builder:
function singletonListItem(S, typeName, title, icon) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName))
}
```

---

## Environment Variables

Never hardcode project IDs, tokens, or webhook URLs.
All env vars are documented in `.env.example`.

| Variable | Used in |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | astro.config.mjs, sanity.config.ts |
| `PUBLIC_SANITY_DATASET` | astro.config.mjs, sanity.config.ts |
| `SANITY_STUDIO_URL` | astro.config.mjs (stega) |
| `SANITY_API_READ_TOKEN` | src/sanity/client.ts |
| `N8N_CONTACT_WEBHOOK_URL` | src/pages/api/contact.ts |
| `SITE_URL` | astro.config.mjs |

---

## Forms → n8n

Contact form submissions go to `POST /api/contact`.
That endpoint validates with Zod, then POSTs to `N8N_CONTACT_WEBHOOK_URL`.
n8n handles routing to the client's CRM.

The payload sent to n8n:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "message": "string",
  "source": "website-contact-form",
  "timestamp": "ISO 8601",
  "siteUrl": "string"
}
```

---

## Netlify Visual Editing Fix

The `netlify.toml` sets `Content-Security-Policy: frame-ancestors` to allow
Sanity Studio to embed the site in an iframe. Do NOT remove this header.
If visual editing breaks, this header is the first thing to check.

---

## What NOT to Do

- Do NOT switch `output` to `static` — visual editing breaks
- Do NOT use `useCdn: true` in the Sanity client — drafts won't load
- Do NOT add `X-Frame-Options: DENY` — it overrides the CSP and breaks visual editing
- Do NOT store API tokens in the frontend — use server-side routes
- Do NOT create Tailwind config files — Tailwind 4 is config-free
- Do NOT use `<form>` action attributes — all forms post via fetch to `/api/contact`
