import type { APIRoute } from 'astro'
import { z } from 'zod'

/* ── Validation Schema ────────────────────────────────────────────────────── */

const ContactSchema = z.object({
  name:    z.string().min(2,  'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  phone:   z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

/* ── Rate Limit (simple in-memory) ───────────────────────────────────────── */
// For production, replace with Netlify Edge rate limiting or Upstash Redis
const submissions = new Map<string, number>()
const RATE_LIMIT_MS = 60_000 // 1 submission per IP per minute

function isRateLimited(ip: string): boolean {
  const last = submissions.get(ip)
  if (last && Date.now() - last < RATE_LIMIT_MS) return true
  submissions.set(ip, Date.now())
  return false
}

/* ── Handler ─────────────────────────────────────────────────────────────── */

export const POST: APIRoute = async ({ request, site }) => {
  // Rate limit
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many submissions. Please wait a minute and try again.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Validate
  const result = ContactSchema.safeParse(body)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return new Response(
      JSON.stringify({ error: 'Validation failed.', fields: errors }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { name, email, phone, message } = result.data

  // Build n8n payload
  const payload = {
    name,
    email,
    phone:     phone ?? '',
    message,
    source:    'website-contact-form',
    timestamp: new Date().toISOString(),
    siteUrl:   site?.href ?? request.headers.get('origin') ?? '',
  }

  // Send to n8n (fire-and-forget — never block the user response)
  const webhookUrl = import.meta.env.N8N_CONTACT_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
      .then((r) => { if (!r.ok) console.error('[contact] n8n webhook returned', r.status) })
      .catch((err: unknown) => console.error('[contact] n8n webhook error:', err))
  } else {
    console.log('[contact] No webhook URL configured, skipping n8n. Payload:', JSON.stringify(payload))
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

// Block all other methods
export const GET:  APIRoute = () => new Response('Method Not Allowed', { status: 405 })
export const PUT:  APIRoute = () => new Response('Method Not Allowed', { status: 405 })
