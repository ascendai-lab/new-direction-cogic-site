const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Escapes CMS text, then turns *word* into the site's italic serif emphasis. */
export const emphasize = (s = '') => escape(s).replace(/\*([^*]+)\*/g, '<em class="serif">$1</em>')

export const paragraphs = (s = '') => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

/** Target and rel for a link. External links always open in a new tab. */
export const linkAttrs = (href = '', newTab?: boolean) =>
  newTab || /^https?:/.test(href) ? { target: '_blank', rel: 'noopener' } : {}
