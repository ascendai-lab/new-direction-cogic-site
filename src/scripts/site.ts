import { nextStart, timeLabel, type Slot } from '../lib/schedule'

const byId = (id: string) => document.getElementById(id)
const pad = (n: number) => String(n).padStart(2, '0')
const TZ = 'America/New_York'
const etNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: TZ }))
const dayLabel = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

/* sticky header shadow */
const header = byId('site-header')
addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 8), { passive: true })

/* mobile menu */
const menuBtn = byId('menu-btn')
const nav = byId('nav')
const scrim = byId('nav-scrim')
if (menuBtn && nav && scrim) {
  const setMenu = (open: boolean) => {
    menuBtn.setAttribute('aria-expanded', String(open))
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu')
    nav.setAttribute('data-open', String(open))
    scrim.classList.toggle('show', open)
    document.body.classList.toggle('menu-open', open)
  }
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'))
  nav.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setMenu(false) })
  scrim.addEventListener('click', () => setMenu(false))
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus() }
  })
  matchMedia('(min-width:960px)').addEventListener('change', () => setMenu(false))
}

/* copy buttons */
document.querySelectorAll<HTMLButtonElement>('.copy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const label = btn.querySelector('.copy-label')
    if (!label) return
    const copied = navigator.clipboard ? navigator.clipboard.writeText(btn.dataset.copy ?? '') : Promise.reject()
    copied.then(() => { label.textContent = 'Copied' }, () => { label.textContent = 'Select to copy' })
    setTimeout(() => { label.textContent = 'Copy' }, 2000)
  })
})

/* scroll reveal */
const reveal = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); reveal && reveal.unobserve(e.target) } })
    }, { rootMargin: '0px 0px -8% 0px' })
  : null
document.querySelectorAll('.reveal, .stagger').forEach((el) => (reveal ? reveal.observe(el) : el.classList.add('in')))

/* countdown cards */
interface Card extends Slot { el: HTMLElement; nextLabel: string; name: string }
const cards: Card[] = [...document.querySelectorAll<HTMLElement>('[data-gathering]')].map((el) => ({
  el,
  name: el.dataset.name ?? '',
  nextLabel: el.dataset.next ?? 'Next',
  weekday: Number(el.dataset.weekday),
  startTime: el.dataset.start ?? '00:00',
  durationMinutes: Number(el.dataset.duration),
}))

function tickCard(card: Card) {
  const now = etNow()
  const start = nextStart(now, card)
  const diff = start.getTime() - now.getTime()
  const s = Math.max(0, Math.floor(diff / 1000))
  const set = (unit: string, value: string | number) => {
    const b = card.el.querySelector(`[data-u="${unit}"]`)
    if (b) b.textContent = String(value)
  }
  set('d', Math.floor(s / 86400))
  set('h', pad(Math.floor(s / 3600) % 24))
  set('m', pad(Math.floor(s / 60) % 60))
  set('s', pad(s % 60))
  const line = card.el.querySelector('.next-date')
  if (line) line.textContent = diff <= 0 ? 'Happening now. Come on in.' : `${card.nextLabel}: ${dayLabel(start)}, ${timeLabel(card.startTime)} ET`
}
cards.forEach(tickCard)
if (cards.length) setInterval(() => cards.forEach(tickCard), 1000)

/* add to calendar: weekly recurring Google Calendar event */
const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
cards.forEach((card) => {
  const link = card.el.querySelector<HTMLAnchorElement>('.cal-link')
  if (!link) return
  const start = nextStart(etNow(), card)
  const end = new Date(start.getTime() + card.durationMinutes * 60_000)
  const stamp = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
  link.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(`${card.name} · New Direction C.O.G.I.C`)}` +
    `&dates=${stamp(start)}/${stamp(end)}&ctz=${encodeURIComponent(TZ)}` +
    `&recur=${encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${DAYS[card.weekday]}`)}` +
    `&details=${encodeURIComponent(card.el.dataset.details ?? '')}`
})

/* hero chip: whichever gathering comes next */
const chip = byId('next-chip')
const chipText = byId('chip-text')
if (chip && chipText) {
  const slots: (Slot & { name: string })[] = JSON.parse(chip.dataset.gatherings ?? '[]')
  const tickChip = () => {
    const now = etNow()
    const next = slots
      .map((slot) => ({ slot, start: nextStart(now, slot) }))
      .sort((a, b) => a.start.getTime() - b.start.getTime())[0]
    if (!next) return
    const diff = next.start.getTime() - now.getTime()
    const s = Math.max(0, Math.floor(diff / 1000))
    chip.classList.toggle('live', diff <= 0)
    chipText.textContent = diff <= 0
      ? `${next.slot.name} is happening now`
      : s < 86400
        ? `${next.slot.name} starts in ${Math.floor(s / 3600)}h ${pad(Math.floor(s / 60) % 60)}m`
        : `Next: ${next.slot.name}, ${dayLabel(next.start).split(',')[0]} ${timeLabel(next.slot.startTime)}`
  }
  tickChip()
  setInterval(tickChip, 1000)
}
