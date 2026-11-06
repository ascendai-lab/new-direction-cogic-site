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

const portableTextFragment = groq`
  ...,
  _type == 'image' => {
    ...,
    asset->
  },
  _type == 'videoEmbed' => {
    url,
    caption,
    autoplay
  }
`

/* ── Queries ──────────────────────────────────────────────────────────────── */

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroHeadline,
    heroSubheadline,
    heroImage { asset->{ url, metadata { dimensions } }, alt },
    heroCta { ${ctaButtonFragment} },
    heroSecondaryCta { ${ctaButtonFragment} },
    servicesHeading,
    servicesSubheading,
    services[] { icon, title, description },
    aboutHeading,
    aboutBody[] { ${portableTextFragment} },
    trustIndicators[] { value, label },
    ctaHeading,
    ctaBody,
    ctaButton { ${ctaButtonFragment} },
    ${seoFragment}
  }
`

export const navQuery = groq`
  *[_type == "navConfig"][0] {
    logo { asset->{ url } },
    logoAlt,
    links[] { label, href, openInNewTab },
    ctaButton { ${ctaButtonFragment} }
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
    defaultSeo { ${seoFragment} }
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    heroHeadline,
    heroSubheadline,
    body[] { ${portableTextFragment} },
    ${seoFragment}
  }
`

export const allPageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`
