import { useEffect, useRef, useState } from 'react'

type Kind = 'updates' | 'contact'
type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, boolean>>

const TOPICS = ['General question', 'Planning a visit', 'Prayer request']

const MESSAGES: Record<Field, string> = {
  name: 'Please tell us your name.',
  email: 'Please enter a valid email address.',
  message: 'Please write a little more so we can help.',
}

const isValid = (field: Field, value: string) => {
  const v = value.trim()
  if (field === 'name') return v.length >= 2
  if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
  return v.length >= 10
}

const isField = (name: string): name is Field => name === 'name' || name === 'email' || name === 'message'

export default function ChurchForm({ kind }: { kind: Kind }) {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<{ text: string; error?: boolean }>({ text: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const thanks = useRef<HTMLDivElement>(null)
  // Move focus to the thank-you message once it is on screen.
  useEffect(() => { if (done) thanks.current?.focus() }, [done])
  const id = (f: string) => `${kind}-${f}`
  const errId = (f: Field) => `${kind}-${f}-error`

  // Mirror our rules into the browser's constraint API so :user-invalid matches them too.
  function check(el: HTMLInputElement | HTMLTextAreaElement): boolean {
    if (!isField(el.name)) return true
    const ok = isValid(el.name, el.value)
    el.setCustomValidity(ok ? '' : MESSAGES[el.name])
    return ok
  }

  // Validate after the person leaves a field they typed in, not while they type.
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget
    if (!isField(el.name)) return
    const name = el.name
    if (el.value.trim() === '' && !errors[name]) return
    const ok = check(el)
    setErrors((prev) => ({ ...prev, [name]: !ok }))
  }

  // Once a field shows an error, clear it as soon as the value becomes valid.
  function onInput(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget
    if (!isField(el.name)) return
    const name = el.name
    const ok = check(el)
    if (errors[name] && ok) setErrors((prev) => ({ ...prev, [name]: false }))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]')].filter((el) => isField(el.name))
    const found: Errors = {}
    let firstInvalid: HTMLElement | null = null
    for (const el of fields) {
      const ok = check(el)
      found[el.name as Field] = !ok
      if (!ok && !firstInvalid) firstInvalid = el
    }
    setErrors(found)
    if (firstInvalid) {
      setStatus({ text: 'Please check the highlighted fields.', error: true })
      firstInvalid.focus()
      return
    }

    const values = Object.fromEntries(new FormData(form)) as Record<string, string>
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
    } catch {
      setSending(false)
      setStatus({ text: 'Something went wrong. Please try again, or email us instead.', error: true })
    }
  }

  const fieldProps = (f: Field) => ({
    id: id(f),
    name: f,
    required: true,
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? errId(f) : undefined,
    onBlur,
    onInput,
  })

  const error = (f: Field) => (
    <span className="err" id={errId(f)} hidden={!errors[f]}>{MESSAGES[f]}</span>
  )

  return (
    <div className={`signup-card reveal in${done ? ' done' : ''}`}>
      <form
        onSubmit={submit}
        noValidate
        toolname={kind === 'contact' ? 'contact_new_direction_church' : 'join_new_direction_updates'}
        tooldescription={kind === 'contact'
          ? 'Send a question, visit plan or prayer request to New Direction C.O.G.I.C in Vineland, NJ. A person at the church reads every message.'
          : 'Sign up for email updates from New Direction C.O.G.I.C about services, Bible Study and prayer.'}
      >
        <p className="req-note"><span aria-hidden="true">*</span> Required</p>
        <div className="field">
          <label htmlFor={id('name')}>Your name <span className="req" aria-hidden="true">*</span></label>
          <input type="text" autoComplete="name" minLength={2} {...fieldProps('name')} />
          {error('name')}
        </div>
        <div className="field">
          <label htmlFor={id('email')}>Email address <span className="req" aria-hidden="true">*</span></label>
          <input type="email" autoComplete="email" inputMode="email" {...fieldProps('email')} />
          {error('email')}
        </div>
        <div className="field">
          <label htmlFor={id('phone')}>{kind === 'updates' ? 'Mobile number (optional)' : 'Phone (optional)'}</label>
          <input
            type="tel"
            id={id('phone')}
            name="phone"
            autoComplete="tel"
            aria-describedby={kind === 'updates' ? id('phone-hint') : undefined}
          />
          {kind === 'updates' && <p className="hint" id={id('phone-hint')}>Only used for service reminders, never shared.</p>}
        </div>

        {kind === 'contact' && (
          <>
            <fieldset className="field choice">
              <legend>How can we help?</legend>
              {TOPICS.map((t, i) => (
                <div className="choice-item" key={t}>
                  <input type="radio" id={id(`topic-${i}`)} name="topic" value={t} defaultChecked={i === 0} />
                  <label htmlFor={id(`topic-${i}`)}>{t}</label>
                </div>
              ))}
            </fieldset>
            <div className="field">
              <label htmlFor={id('message')}>Your message <span className="req" aria-hidden="true">*</span></label>
              <textarea minLength={10} {...fieldProps('message')} />
              {error('message')}
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
          <label htmlFor={id('company')}>Company</label>
          <input type="text" id={id('company')} name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <button className="btn btn--primary btn--block" type="submit" disabled={sending}>
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

// WebMCP declarative form attributes (experimental). Browsers without WebMCP ignore them.
declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: string
    tooldescription?: string
  }
}
