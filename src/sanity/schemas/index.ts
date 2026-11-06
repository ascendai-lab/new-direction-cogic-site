// Objects (reusable field types)
import { videoEmbed } from './objects/videoEmbed'
import { seoFields } from './objects/seoFields'
import { portableTextContent } from './objects/portableText'
import { ctaButton } from './objects/ctaButton'

// Singletons
import { homePage } from './singletons/homePage'
import { navConfig } from './singletons/navConfig'
import { siteSettings } from './singletons/siteSettings'

// Documents (repeatable)
import { page } from './documents/page'

export const schemaTypes = [
  // Objects first — other schemas reference them
  videoEmbed,
  seoFields,
  portableTextContent,
  ctaButton,

  // Singletons
  homePage,
  navConfig,
  siteSettings,

  // Documents
  page,
]
