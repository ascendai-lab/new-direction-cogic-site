import { defineArrayMember, defineField } from 'sanity'

/** Church facts that appear on several pages, so they are edited in one place. */
export const churchFields = [
  defineField({ name: 'donateUrl', title: 'Online giving link', type: 'url', group: 'contact' }),
  defineField({ name: 'locationName', title: 'Where we meet', type: 'string', group: 'contact' }),
  defineField({ name: 'directions', title: 'Directions', type: 'text', rows: 3, group: 'contact' }),

  defineField({
    name: 'gatherings',
    title: 'Weekly gatherings',
    type: 'array',
    group: 'gatherings',
    of: [defineArrayMember({
      type: 'object',
      fields: [
        { name: 'key', title: 'Gathering', type: 'string', readOnly: true },
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'timeLabel', title: 'Day and time', type: 'string', description: 'For example: Sundays at 11:00 AM' },
        { name: 'nextLabel', title: 'Countdown label', type: 'string', description: 'For example: Next service' },
        {
          name: 'weekday', title: 'Day of the week', type: 'number',
          options: { list: [
            { title: 'Sunday', value: 0 }, { title: 'Monday', value: 1 }, { title: 'Tuesday', value: 2 },
            { title: 'Wednesday', value: 3 }, { title: 'Thursday', value: 4 }, { title: 'Friday', value: 5 },
            { title: 'Saturday', value: 6 },
          ] },
        },
        { name: 'startTime', title: 'Start time (24 hour, Eastern)', type: 'string', description: 'For example: 19:00' },
        { name: 'durationMinutes', title: 'Length in minutes', type: 'number' },
        {
          name: 'rows', title: 'Details', type: 'array',
          of: [defineArrayMember({
            type: 'object',
            fields: [
              { name: 'label', title: 'Label', type: 'string' },
              { name: 'value', title: 'Value', type: 'string' },
              { name: 'href', title: 'Link (optional)', type: 'string' },
              { name: 'copy', title: 'Text for the Copy button (optional)', type: 'string' },
            ],
            preview: { select: { title: 'label', subtitle: 'value' } },
          })],
        },
        { name: 'action', title: 'Main button', type: 'ctaButton' },
        { name: 'calendarDetails', title: 'Calendar event note', type: 'text', rows: 2 },
      ],
      preview: { select: { title: 'name', subtitle: 'timeLabel' } },
    })],
  }),

  defineField({ name: 'pastorName', title: 'Name', type: 'string', group: 'pastor' }),
  defineField({ name: 'pastorPhoto', title: 'Photo', type: 'image', options: { hotspot: true }, group: 'pastor' }),
  defineField({ name: 'pastorSummary', title: 'Short summary', type: 'text', rows: 3, group: 'pastor' }),
  defineField({ name: 'pastorBio', title: 'Full bio', type: 'text', rows: 10, description: 'Leave a blank line between paragraphs.', group: 'pastor' }),
  defineField({ name: 'pastorVerse', title: 'Bio verse', type: 'text', rows: 2, group: 'pastor' }),
  defineField({ name: 'pastorVerseCite', title: 'Bio verse reference', type: 'string', group: 'pastor' }),
  defineField({ name: 'pastorClosing', title: 'Bio closing line', type: 'string', group: 'pastor' }),

  defineField({
    name: 'affirmation',
    title: 'Affirmation of Faith',
    type: 'array',
    group: 'beliefs',
    description: 'The church\'s own words. One statement per line.',
    of: [defineArrayMember({ type: 'text', rows: 2 })],
  }),
]
