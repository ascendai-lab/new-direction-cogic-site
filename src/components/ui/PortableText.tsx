import { PortableText as BasePortableText } from '@portabletext/react'

/* ── Video Embed Helper ────────────────────────────────────────────────────── */

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    // YouTube
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    // Vimeo
    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null
    }

    return null
  } catch {
    return null
  }
}

/* ── Component Map ─────────────────────────────────────────────────────────── */

const components = {
  types: {
    // Sanity image block
    image: ({ value }: any) => {
      if (!value?.asset?.url) return null
      return (
        <figure style={{ margin: '2rem 0' }}>
          <img
            src={value.asset.url}
            alt={value.alt ?? ''}
            style={{ borderRadius: '0.75rem', width: '100%', height: 'auto' }}
            loading="lazy"
          />
          {value.caption && (
            <figcaption style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // Video embed block
    videoEmbed: ({ value }: any) => {
      const embedUrl = getEmbedUrl(value?.url ?? '')
      if (!embedUrl) {
        return (
          <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
            Invalid video URL: {value?.url}
          </p>
        )
      }
      return (
        <figure style={{ margin: '2rem 0' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '0.75rem' }}>
            <iframe
              src={`${embedUrl}${value.autoplay ? '?autoplay=1&mute=1' : ''}`}
              title={value.caption ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          </div>
          {value.caption && (
            <figcaption style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },

  marks: {
    // External / internal links
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },

  block: {
    blockquote: ({ children }: any) => <blockquote>{children}</blockquote>,
    h2: ({ children }: any) => <h2>{children}</h2>,
    h3: ({ children }: any) => <h3>{children}</h3>,
    h4: ({ children }: any) => <h4>{children}</h4>,
  },
}

/* ── Export ────────────────────────────────────────────────────────────────── */

interface Props {
  value: any[]
  className?: string
}

export default function PortableText({ value, className = 'prose' }: Props) {
  if (!value || !Array.isArray(value)) return null

  return (
    <div className={className}>
      <BasePortableText value={value} components={components} />
    </div>
  )
}
