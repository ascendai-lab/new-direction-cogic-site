import { defineArrayMember, defineField, defineType } from 'sanity'

const tone = defineField({
  name: 'tone',
  title: 'Background',
  type: 'string',
  options: {
    list: [
      { title: 'White', value: 'white' },
      { title: 'Soft blue', value: 'sunken' },
      { title: 'Sky tint', value: 'tint' },
      { title: 'Warm cream', value: 'cream' },
      { title: 'Deep navy', value: 'deep' },
    ],
  },
  initialValue: 'white',
})
const eyebrow = defineField({ name: 'eyebrow', title: 'Small label', type: 'string', description: 'Three words at most.' })
const heading = defineField({
  name: 'heading',
  title: 'Heading',
  type: 'string',
  description: 'Wrap a word in *asterisks* to set it in the italic serif.',
})
const anchor = defineField({ name: 'anchor', title: 'Anchor ID (optional)', type: 'string', description: 'For links like /#updates.' })
const link = (name: string, title: string) => defineField({ name, title, type: 'ctaButton' })

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    eyebrow, heading,
    defineField({ name: 'body', title: 'Text', type: 'text', rows: 5, description: 'Leave a blank line between paragraphs.' }),
    link('button', 'Solid button (optional)'),
    link('textLink', 'Text link (optional)'),
    tone, anchor,
  ],
  preview: { select: { title: 'heading', subtitle: 'eyebrow' } },
})

export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Cards',
  type: 'object',
  fields: [
    eyebrow, heading,
    defineField({ name: 'numbered', title: 'Show 01, 02, 03', type: 'boolean', initialValue: true }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'text', title: 'Text', type: 'text', rows: 3 },
          { name: 'link', title: 'Link (optional)', type: 'ctaButton' },
        ],
        preview: { select: { title: 'title', subtitle: 'text' } },
      })],
    }),
    tone, anchor,
  ],
  preview: { select: { title: 'heading', subtitle: 'eyebrow' } },
})

export const gatheringBand = defineType({
  name: 'gatheringBand',
  title: 'Gathering details',
  type: 'object',
  description: 'Text beside a card showing the countdown and details from Site Settings.',
  fields: [
    defineField({
      name: 'gatheringKey',
      title: 'Which gathering',
      type: 'string',
      options: { list: [
        { title: 'Sunday worship', value: 'sunday' },
        { title: 'Bible Study', value: 'bibleStudy' },
        { title: 'Prayer Line', value: 'prayerLine' },
      ] },
      validation: (Rule) => Rule.required(),
    }),
    eyebrow, heading,
    defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 }),
    anchor,
  ],
  preview: { select: { title: 'heading', subtitle: 'gatheringKey' } },
})

export const pastorBlock = defineType({
  name: 'pastorBlock',
  title: 'Pastor',
  type: 'object',
  description: 'Uses the photo and bio from Site Settings.',
  fields: [
    eyebrow,
    defineField({ name: 'showFullBio', title: 'Show the full bio open', type: 'boolean', initialValue: false }),
    tone, anchor,
  ],
  preview: { prepare: () => ({ title: 'Pastor' }) },
})

export const creedBlock = defineType({
  name: 'creedBlock',
  title: 'Affirmation of Faith',
  type: 'object',
  description: 'Uses the statements from Site Settings.',
  fields: [eyebrow, heading, tone, anchor],
  preview: { prepare: () => ({ title: 'Affirmation of Faith' }) },
})

export const verseBlock = defineType({
  name: 'verseBlock',
  title: 'Scripture',
  type: 'object',
  fields: [
    eyebrow,
    defineField({ name: 'quote', title: 'Verse', type: 'text', rows: 3 }),
    defineField({ name: 'cite', title: 'Reference', type: 'string' }),
    tone,
  ],
  preview: { select: { title: 'cite', subtitle: 'quote' } },
})

export const mapBlock = defineType({
  name: 'mapBlock',
  title: 'Location and map',
  type: 'object',
  description: 'Uses the address and directions from Site Settings.',
  fields: [eyebrow, heading, tone, anchor],
  preview: { select: { title: 'heading' } },
})

export const formBlock = defineType({
  name: 'formBlock',
  title: 'Form',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Form',
      type: 'string',
      options: { list: [
        { title: 'Get updates', value: 'updates' },
        { title: 'Contact', value: 'contact' },
      ] },
      validation: (Rule) => Rule.required(),
    }),
    eyebrow, heading,
    defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 }),
    tone, anchor,
  ],
  preview: { select: { title: 'heading', subtitle: 'kind' } },
})

export const sectionTypes = [textBlock, cardGrid, gatheringBand, pastorBlock, creedBlock, verseBlock, mapBlock, formBlock]

export const sectionsField = (group?: string) => defineField({
  name: 'sections',
  title: 'Page sections',
  type: 'array',
  group,
  of: sectionTypes.map((s) => defineArrayMember({ type: s.name })),
})
