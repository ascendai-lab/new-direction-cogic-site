import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'
import { sectionsField } from '../objects/sections'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'content', title: 'Sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'heroKicker', title: 'Small line above the headline', type: 'text', rows: 2, group: 'hero' }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Wrap a word in *asterisks* to set it in the italic serif.',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, group: 'hero' }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Description', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCta', title: 'Gold Button', type: 'ctaButton', group: 'hero' }),
    defineField({ name: 'heroSecondaryCta', title: 'Outline Button', type: 'ctaButton', group: 'hero' }),
    defineField({
      name: 'ribbon',
      title: 'Scrolling ribbon',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Wrap a phrase in *asterisks* to set it in the italic serif.',
      group: 'hero',
    }),
    sectionsField('content'),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Home Page' }) },
})
