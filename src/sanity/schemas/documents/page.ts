import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { sectionsField } from '../objects/sections'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroKicker',
      title: 'Small line above the headline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Page Headline',
      type: 'string',
      description: 'Wrap a word in *asterisks* to set it in the italic serif.',
      group: 'content',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Page Subheadline',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    sectionsField('content'),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title, subtitle: `/${slug}` }
    },
  },
})
