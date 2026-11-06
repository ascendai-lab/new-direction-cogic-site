import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'services', title: 'Services' },
    { name: 'about', title: 'About / Trust' },
    { name: 'cta', title: 'Call to Action' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Hero ──────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero CTA Button',
      type: 'ctaButton',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Hero Secondary Button (optional)',
      type: 'ctaButton',
      group: 'hero',
    }),

    // ─── Services ──────────────────────────────────────────────────
    defineField({
      name: 'servicesHeading',
      title: 'Services Section Heading',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesSubheading',
      title: 'Services Section Subheading',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon Name (Lucide)', type: 'string' },
            { name: 'title', title: 'Service Title', type: 'string' },
            { name: 'description', title: 'Short Description', type: 'text', rows: 2 },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    }),

    // ─── About / Trust ─────────────────────────────────────────────
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Body',
      type: 'portableTextContent',
      group: 'about',
    }),
    defineField({
      name: 'trustIndicators',
      title: 'Trust Indicators (stats, awards, etc.)',
      type: 'array',
      group: 'about',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value (e.g. "20+")', type: 'string' },
            { name: 'label', title: 'Label (e.g. "Years Experience")', type: 'string' },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // ─── Bottom CTA ────────────────────────────────────────────────
    defineField({
      name: 'ctaHeading',
      title: 'CTA Section Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA Section Body',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'ctaButton',
      group: 'cta',
    }),

    // ─── SEO ───────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
