import groq from 'groq'

/* ── Reusable Fragments ───────────────────────────────────────────────────── */

const seoFragment = groq`
  seo {
    metaTitle,
    metaDescription,
    ogImage { asset->{ url } },
    noIndex
  }
`

const ctaButtonFragment = groq`
  label,
  href,
  variant,
  openInNewTab
`

/* ── Queries ──────────────────────────────────────────────────────────────── */

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroKicker,
    heroHeadline,
    heroImage { asset->{ url, metadata { dimensions } } },
    heroImageAlt,
    heroCta { ${ctaButtonFragment} },
    heroSecondaryCta { ${ctaButtonFragment} },
    ribbon,
    sections,
    ${seoFragment}
  }
`

export const navQuery = groq`
  *[_type == "navConfig"][0] {
    logo { asset->{ url } },
    logoAlt,
    links[] { label, href, openInNewTab },
    ctaButton { ${ctaButtonFragment} },
    secondaryButton { ${ctaButtonFragment} },
    mobileButton { ${ctaButtonFragment} }
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    email,
    phone,
    address,
    serviceArea,
    facebook,
    instagram,
    linkedin,
    youtube,
    footerTagline,
    copyrightName,
    googleAnalyticsId,
    donateUrl,
    locationName,
    directions,
    gatherings,
    pastorName,
    pastorPhoto { asset->{ url } },
    pastorSummary,
    pastorBio,
    pastorVerse,
    pastorVerseCite,
    pastorClosing,
    affirmation,
    defaultSeo { metaTitle, metaDescription, ogImage { asset->{ url } } }
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    heroKicker,
    heroHeadline,
    heroSubheadline,
    sections,
    ${seoFragment}
  }
`

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`

export const pageIndexQuery = groq`
  *[_type == "page" && defined(slug.current)] | order(slug.current asc) {
    "slug": slug.current,
    title,
    "description": seo.metaDescription,
    "noIndex": seo.noIndex,
    "updatedAt": _updatedAt
  }
`
