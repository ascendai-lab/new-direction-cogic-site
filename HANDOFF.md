# New Direction C.O.G.I.C: project handoff

Last updated 2026-11-11. Read this before changing the site or the church's accounts.
`CLAUDE.md` holds the generic Ascend AI starter rules (stack and Sanity conventions). Where the two disagree, this file wins.

## What this is

The website for New Direction C.O.G.I.C., a Church of God in Christ congregation in Vineland, NJ.
Pastor: Elder Paul S. Harden, Sr. Ascend AI (Mark) built the site and runs it. Paul does not edit it.

- **Live site:** https://newdirectioncogic.com (launched 2026-11-07)
- **Repo:** `ascendai-lab/new-direction-cogic-site` on branch `main` (this folder)
- **Church email:** thenewdirectioncogic@gmail.com

### Gatherings (these drive the site, the schema and llms.txt)

| Gathering | When (Eastern) | Where |
|---|---|---|
| Sunday School (all ages) | Sundays 10:00 AM | In person, Ramada by Wyndham, Vineland (Omni Ballroom) |
| Sunday Worship | Sundays 11:00 AM | In person at the same place |
| Online Bible Study | Wednesdays 7:00 PM | Zoom |
| Prayer Line | Thursdays 8:00 PM | Phone |

The values live in Sanity `siteSettings.gatherings`, not in code.

## Architecture

```
Browser ──> Netlify project "ndcogic-full-site-preview" (Astro 5 SSR + React islands)
              ├─ pages: Sanity project 6iu8ij4a, dataset "production", read live (no CDN)
              ├─ /api/contact ──> FORMS_ENDPOINT (the old Netlify project's __forms.html)
              │                     └─ Netlify Forms alert emails Paul
              └─ /robots.txt, /sitemap.xml, /llms.txt are SSR endpoints built from Sanity
```

| Layer | What we use | Notes |
|---|---|---|
| Framework | Astro 5, `output: 'server'` | SSR is required for Sanity visual editing |
| Styling | Tailwind 4 plus custom properties in `src/styles/global.css` | `.stitch/DESIGN.md` is the design source of truth |
| Interactive parts | React (`src/components/ui/ChurchForm.tsx`) | shadcn is *not* used here, whatever CLAUDE.md says |
| CMS | Sanity v3, Studio at `/studio` | Content changes go live with no redeploy |
| Hosting | Netlify, deployed from the CLI | There is no Git CI. Pushing does not deploy |

### Key files

- `src/layouts/BaseLayout.astro`: meta tags, canonical URL, JSON-LD `@graph` (Church with an eventSchedule per gathering, `sameAs` socials, WebSite, WebPage), GA4 tag
- `src/components/layout/Footer.astro`: footer, including the brand-color social icons (22px, inline SVG)
- `src/components/sections/Sections.astro`: renders the Sanity page sections (textBlock, cardGrid, gatheringBand, pastorBlock, creedBlock, verseBlock and others)
- `src/pages/api/contact.ts`: form endpoint (Zod validation, honeypot `company`, 60s per-IP rate limit)
- `src/lib/schedule.ts`: "next gathering" countdown logic. Check it with `node src/lib/schedule.check.ts`
- `src/lib/seo.ts`: `indexingAllowed()` reads `ALLOW_INDEXING` at request time
- `scripts/seed.mjs`: seeds or reseeds Sanity content (meta titles, settings, socials, GA ID)
- `public/__forms.html`: form definitions for Netlify Forms. **Do not delete**
- `public/google823dd7da016576a7.html`: Search Console verification. **Do not delete**

### Pages (all from Sanity)

`/`, `/about`, `/bible-study`, `/contact`, `/give`, `/pastor`, `/prayer-line`, `/visit`

## How to work on it

```bash
npm run dev                              # local, http://localhost:4321
NETLIFY=true netlify deploy --build --prod   # deploy to production
```

- Leave out `NETLIFY=true` and the build has no adapter, so it fails.
- Content edits (text, times, links, socials, GA ID) go in Sanity, either in Studio or through the mutate API with `SANITY_API_WRITE_TOKEN` from `.env`. They show up live with no deploy.
- After a code change: deploy, check the live site, then commit and push.

### Environment variables (Netlify project ndcogic-full-site-preview)

| Variable | Purpose |
|---|---|
| `SITE_URL` | `https://newdirectioncogic.com` |
| `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` | `6iu8ij4a` / `production` |
| `SANITY_STUDIO_URL`, `SANITY_API_READ_TOKEN` | Visual editing and the drafts read |
| `ALLOW_INDEXING` | `true` in production. Anything else serves `Disallow: /` |
| `FORMS_ENDPOINT` | `https://new-direction-cogic-old.netlify.app/__forms.html` |
| `N8N_CONTACT_WEBHOOK_URL` | Not set yet. Once set, it takes over from FORMS_ENDPOINT |

## Forms (read this before touching forms or Netlify)

- The site has two forms: `updates` (homepage signup with an optional Bible study reminder) and `contact` (topic is General question, Planning a visit or Prayer request).
- Both go to `/api/contact`. That endpoint forwards to `FORMS_ENDPOINT`, which is the **old** Netlify project `new-direction-cogic-old` (the static site in `../New-Direction-COGIC/site`).
- That old project's form notification emails Paul. Netlify now only lets new alerts go to team members, and Paul isn't one, so the old project stays up as the form inbox. **Do not delete or rename it.**
- On 2026-11-08 the old project was renamed and its URL changed. Every submission failed until 2026-11-11, when FORMS_ENDPOINT was updated and the site redeployed. Submissions from that window are lost.
- Any change to an env var needs a redeploy before the functions see it.
- To test, POST a clearly labeled test to `/api/contact`, then confirm the submission count went up on the old project (site id `e1698456-b66f-4e21-89a8-32d042cc2d3e`). Each test emails Paul.

## Decisions and constraints

- **No street address in search data.** The church rents its space at the Ramada, so the address stays out of JSON-LD, llms.txt and Google listings. The flyers and the Facebook page do show it, and that is the church's choice.
- **No Google Business Profile or Bing Webmaster Tools** until the church owns a building.
- **Paul gets no Studio or Netlify access.** Mark manages all content.
- **SSR stays on.** Don't switch to static output or `useCdn: true`, because visual editing and live content break.
- **Social icons** use each platform's real colors (Facebook blue, Instagram gradient, YouTube red), not the site's brand colors.
- **Account work** (Facebook, Instagram, YouTube, Google) is done in Mark's Ascend AI Chrome profile ("Browser 2").
  - Claude never types passwords and never switches Facebook logins. Mark does both.
  - Every public post needs Mark's approval of the caption first.

## Accounts and tracking

| Service | Details |
|---|---|
| Google Search Console | URL-prefix property `https://newdirectioncogic.com/`, verified by HTML file. Sitemap submitted: 8 pages, Success |
| GA4 | Account "New Direction C.O.G.I.C", property 563192303, Measurement ID `G-Q1BGD7M98D` (stored in Sanity `siteSettings.googleAnalyticsId`) |
| Facebook | https://www.facebook.com/thenewdirectioncogic (page id 61596585595430). Managed from **Paul's** Facebook login. Mark's own profile isn't an admin |
| Instagram | https://www.instagram.com/thenewdirectioncogic/ ("New Direction C.O.G.I.C"). Only 2 name changes are allowed per 14 days |
| YouTube | https://www.youtube.com/@thenewdirectioncogic (UCIFX2M6PeTup3EQjuSk6Bbg) |

Profile and cover images are in `../New-Direction-COGIC/social/`. Flyers ready to post are in `../New-Direction-COGIC/social/posts/`.

## Status (2026-11-11)

Done:
- The site is live, with SEO, llms.txt, structured data, Search Console and GA4.
- The forms work and were tested live.
- All three social profiles are set up (photo, cover, bio, links), and the footer shows the social icons.
- The Bible study flyer is posted on Facebook and Instagram.

## Next steps

1. **Contact lost form submissions.** At least one homepage signup (Claudia Finney) was lost between 2026-11-08 and 11-11. Paul should reach out.
2. **This week's posts.** For each one, get the caption approved, then post to both Facebook and Instagram:
   - the reel, once Mark sends the video file (also upload it to YouTube as a Short if it's vertical and under 3 minutes)
   - `online-church-flyer.jpg` on 2026-11-12
   - `sunday-worship-flyer.jpg` on 2026-11-14 (Saturday)
3. **Connect Facebook and Instagram in Meta Business Suite** so one post goes to both. Make Mark an admin of the page so posting doesn't need Paul's login.
4. **Instagram website link:** add newdirectioncogic.com to the bio. This only works in the phone app.
5. **n8n webhook (optional):** set `N8N_CONTACT_WEBHOOK_URL`, redeploy, then retire the old-project form route.
6. **Later, once the church owns a building:** set up Google Business Profile and Bing Webmaster Tools, and add the address to the structured data.
7. **Ideas, only if asked:** an FAQ section (needs Paul's answers), real church photos to replace the stock images, a listing in the COGIC directory.
