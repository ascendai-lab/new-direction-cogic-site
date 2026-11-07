import { useRef, useState } from 'react'

type Kind = 'updates' | 'contact'
type Errors = Partial<Record<'name' | 'email' | 'message', boolean>>

const TOPICS = ['General question', 'Planning a visit', 'Prayer request']

export default function ChurchForm({ kind }: { kind: Kind }) {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<{ text: string; error?: boolean }>({ text: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const thanks = useRef<HTMLDivElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const found: Errors = {
      name: (values.name ?? '').trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((values.email ?? '').trim()),
      message: kind === 'contact' && (values.message ?? '').trim().length < 10,
    }
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      setStatus({ text: 'Please check the highlighted fields.', error: true })
      return
    }

    setSending(true)
    setStatus({ text: 'Sending...' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, kind, bibleStudyReminder: values.bibleStudyReminder === 'yes' }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setDone(true)
      setTimeout(() => thanks.current?.focus())
    } catch {
      setSending(false)
      setStatus({ text: 'Something went wrong. Please try again, or email us instead.', error: true })
    }
  }

  return (
    <div className={`signup-card reveal in${done ? ' done' : ''}`}>
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor={`${kind}-name`}>Your name</label>
          <input type="text" id={`${kind}-name`} name="name" autoComplete="name" required aria-invalid={!!errors.name} />
          <span className="err" hidden={!errors.name}>Please tell us your name.</span>
        </div>
        <div className="field">
          <label htmlFor={`${kind}-email`}>Email address</label>
          <input type="email" id={`${kind}-email`} name="email" autoComplete="email" inputMode="email" required aria-invalid={!!errors.email} />
          <span className="err" hidden={!errors.email}>Please enter a valid email address.</span>
        </div>
        <div className="field">
          <label htmlFor={`${kind}-phone`}>{kind === 'updates' ? 'Mobile number (optional)' : 'Phone (optional)'}</label>
          <input type="tel" id={`${kind}-phone`} name="phone" autoComplete="tel" />
          {kind === 'updates' && <p className="hint">Only used for service reminders, never shared.</p>}
        </div>

        {kind === 'contact' && (
          <>
            <div className="field">
              <label htmlFor="contact-topic">How can we help?</label>
              <select id="contact-topic" name="topic">
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="contact-message">Your message</label>
              <textarea id="contact-message" name="message" required aria-invalid={!!errors.message} />
              <span className="err" hidden={!errors.message}>Please write a little more so we can help.</span>
            </div>
          </>
        )}

        {kind === 'updates' && (
          <div className="check">
            <input type="checkbox" id="study" name="bibleStudyReminder" value="yes" defaultChecked />
            <label htmlFor="study">Send me the weekly Bible Study reminder</label>
          </div>
        )}

        <div className="hp" aria-hidden="true">
          <label htmlFor={`${kind}-company`}>Company</label>
          <input type="text" id={`${kind}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <button className="btn btn--primary" type="submit" disabled={sending} style={{ width: '100%' }}>
          {kind === 'updates' ? 'Keep me posted' : 'Send message'} <span className="arw" aria-hidden="true">&rarr;</span>
        </button>
        <p className="status" role="status" aria-live="polite" data-state={status.error ? 'error' : ''}>{status.text}</p>
        {kind === 'updates' && (
          <p className="consent">By signing up you agree to receive occasional updates from New Direction C.O.G.I.C.</p>
        )}
      </form>

      <div className="thanks" ref={thanks} tabIndex={-1}>
        <h3 className="h3">{kind === 'updates' ? 'You are on the list' : 'Thank you for reaching out'}</h3>
        <p>
          {kind === 'updates'
            ? 'Thank you. We will keep you posted, and you are welcome with us this Sunday.'
            : 'Your message is on its way to us, and someone from the church will follow up with you.'}
        </p>
      </div>
    </div>
  )
}
