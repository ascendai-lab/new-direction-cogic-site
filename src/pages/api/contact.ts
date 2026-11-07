import type { APIRoute } from 'astro'
import { z } from 'zod'

const Base = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().optional(),
  company: z.string().optional(), // honeypot
})

const FormSchema = z.discriminatedUnion('kind', [
  Base.extend({
    kind: z.literal('contact'),
    topic: z.string().optional(),
    message: z.string().trim().min(10, 'Message must be at least 10 characters'),
  }),
  Base.extend({
    kind: z.literal('updates'),
    bibleStudyReminder: z.boolean().optional(),
  }),
])

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

// ponytail: in-memory, so per function instance. Upgrade to Netlify rate limiting if spam shows up.
const submissions = new Map<string, number>()
const RATE_LIMIT_MS = 60_000

function isRateLimited(ip: string): boolean {
  const last = submissions.get(ip)
  if (last && Date.now() - last < RATE_LIMIT_MS) return true
  submissions.set(ip, Date.now())
  return false
}

export const POST: APIRoute = async ({ request, site }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const result = FormSchema.safeParse(body)
  if (!result.success) return json({ error: 'Validation failed.', fields: result.error.flatten().fieldErrors }, 422)

  const { company, kind, ...fields } = result.data
  if (company) return json({ success: true }, 200) // bots get a quiet success

  if (isRateLimited(request.headers.get('x-forwarded-for') ?? 'unknown')) {
    return json({ error: 'Too many submissions. Please wait a minute and try again.' }, 429)
  }

  const payload = {
    ...fields,
    phone: fields.phone ?? '',
    source: kind === 'contact' ? 'website-contact-form' : 'website-updates-form',
    timestamp: new Date().toISOString(),
    siteUrl: site?.href ?? request.headers.get('origin') ?? '',
  }

  // Awaited on purpose: a prayer request must not be reported as sent if it was lost.
  // Read at request time so the webhook can be added in Netlify without a rebuild.
  const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL ?? import.meta.env.N8N_CONTACT_WEBHOOK_URL
  try {
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`n8n returned ${res.status}`)
    } else if (import.meta.env.DEV) {
      console.log('[contact] No webhook set. Submission type:', payload.source)
    } else {
      // ponytail: until this client's n8n webhook exists, Netlify Forms stores submissions and emails the church.
      // FORMS_ENDPOINT points at the old Netlify project, whose existing alert emails Paul. New alerts there
      // are limited to Netlify team members, so the old project stays up as the form inbox.
      const form = new URLSearchParams({ 'form-name': kind })
      for (const [key, value] of Object.entries(fields)) form.set(key, String(value ?? ''))
      const formsUrl = process.env.FORMS_ENDPOINT || new URL('/__forms.html', request.url).href
      const res = await fetch(formsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      })
      if (!res.ok) throw new Error(`Netlify Forms returned ${res.status}`)
    }
  } catch (err) {
    console.error('[contact] delivery failed:', err)
    return json({ error: 'We could not send that. Please try again.' }, 502)
  }

  return json({ success: true }, 200)
}

export const GET: APIRoute = () => new Response('Method Not Allowed', { status: 405 })
export const PUT: APIRoute = () => new Response('Method Not Allowed', { status: 405 })
