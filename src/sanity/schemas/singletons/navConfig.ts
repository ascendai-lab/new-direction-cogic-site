import { defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const navConfig = defineType({
  name: 'navConfig',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload an SVG or PNG. SVG recommended.',
      options: { hotspot: false },
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Path',
              type: 'string',
              description: 'e.g. /about or /services',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'openInNewTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'Nav CTA Button (optional)',
      type: 'ctaButton',
      description: 'The primary action button in the nav (e.g. "Get a Free Quote")',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
