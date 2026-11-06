import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  heading?: string
  subheading?: string
}

export default function ContactForm({ heading = 'Get in Touch', subheading }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      phone:   (form.elements.namedItem('phone')   as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error ?? 'Something went wrong. Please try again.')
      }

      setState('success')
      form.reset()
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  return (
    <section style={{ padding: '5rem 0', background: 'var(--color-bg-muted)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--color-text)' }}>
            {heading}
          </h2>
          {subheading && (
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {subheading}
            </p>
          )}
        </div>

        {state === 'success' ? (
          <div style={{
            padding: '2rem',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
          }}>
            <p style={{ fontWeight: 600, color: '#15803d', fontSize: '1.125rem' }}>
              Message received!
            </p>
            <p style={{ color: '#166534', marginTop: '0.5rem' }}>
              We'll get back to you within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Name *" name="name" type="text" required placeholder="Jane Smith" />
              <Field label="Email *" name="email" type="email" required placeholder="jane@example.com" />
            </div>

            <Field label="Phone" name="phone" type="tel" placeholder="(555) 000-0000" />

            <div>
              <label htmlFor="message" style={labelStyle}>Message *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us how we can help..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {state === 'error' && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              style={{
                padding: '0.875rem 2rem',
                background: state === 'submitting' ? '#94a3b8' : 'var(--color-brand)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: state === 'submitting' ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {state === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

          </form>
        )}
      </div>
    </section>
  )
}

/* ── Field Helper ──────────────────────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '0.375rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '1rem',
  color: 'var(--color-text)',
  background: 'var(--color-bg)',
  outline: 'none',
  fontFamily: 'inherit',
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
}: {
  label: string
  name: string
  type: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} style={labelStyle}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}
