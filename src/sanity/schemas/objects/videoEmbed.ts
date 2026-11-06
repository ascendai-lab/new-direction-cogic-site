import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'Paste a YouTube or Vimeo URL',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true
          const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
          const isVimeo = url.includes('vimeo.com')
          if (!isYouTube && !isVimeo) {
            return 'Only YouTube and Vimeo URLs are supported'
          }
          return true
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { url: 'url', caption: 'caption' },
    prepare({ url, caption }) {
      return {
        title: caption ?? 'Video Embed',
        subtitle: url,
        media: PlayIcon,
      }
    },
  },
})
