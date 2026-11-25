import { instantOf, nextStart, timeLabel, wallClock, type Slot } from '../lib/schedule'

const byId = (id: string) => document.getElementById(id)
const pad = (n: number) => String(n).padStart(2, '0')
const TZ = 'America/New_York'
const etNow = () => wallClock(TZ)
// Wall-clock Dates keep Eastern time in their UTC fields, so they are formatted as UTC.
const dayLabel = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })

/* sticky header shadow: CSS scroll-state queries handle it where supported */
const header = byId('site-header')
if (header && !CSS.supports('container-type', 'scroll-state')) {
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8)
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

/* mobile menu: a native popover (light dismiss, Escape and focus order come for free) */
const menuBtn = byId('menu-btn')
const nav = byId('nav')
if (menuBtn && nav && header) {
  const place = () => {
    const r = header.getBoundingClientRect()
    nav.style.setProperty('--menu-top', `${Math.max(0, r.bottom)}px`)
    nav.style.setProperty('--menu-left', `${r.left}px`)
    nav.style.setProperty('--menu-width', `${r.width}px`)
  }
  if ('popover' in HTMLElement.prototype) {
    nav.addEventListener('beforetoggle', (e) => {
      if ((e as ToggleEvent).newState === 'open') place()
      menuBtn.classList.toggle('open', (e as ToggleEvent).newState === 'open')
    })
    nav.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) nav.hidePopover() })
    matchMedia('(min-width:960px)').addEventListener('change', (e) => { if (e.matches && nav.matches(':popover-open')) nav.hidePopover() })
  } else {
    // Older browsers: same menu, toggled by hand.
    nav.removeAttribute('popover')
    menuBtn.setAttribute('aria-expanded', 'false')
    menuBtn.setAttribute('aria-controls', 'nav')
    const setMenu = (open: boolean) => {
      if (open) place()
      menuBtn.setAttribute('aria-expanded', String(open))
      menuBtn.classList.toggle('open', open)
      nav.toggleAttribute('data-open', open)
    }
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'))
    nav.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setMenu(false) })
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus() }
    })
  }
}

/* marquee pause control (WCAG 2.2.2) */
const ribbon = byId('ribbon')
const ribbonToggle = byId('ribbon-toggle')
if (ribbon && ribbonToggle) {
  ribbonToggle.addEventListener('click', () => {
    const paused = ribbonToggle.getAttribute('aria-pressed') !== 'true'
    ribbonToggle.setAttribute('aria-pressed', String(paused))
    ribbon.classList.toggle('paused', paused)
  })
}

/* copy buttons: announce the result in a status message */
document.querySelectorAll<HTMLButtonElement>('.copy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const label = btn.querySelector('.copy-label')
    const status = btn.closest('[data-gathering]')?.querySelector('[data-copy-status]')
    const what = btn.dataset.what ?? 'Text'
    const copied = navigator.clipboard ? navigator.clipboard.writeText(btn.dataset.copy ?? '') : Promise.reject()
    const say = (visual: string, spoken: string) => {
      if (label) label.textContent = visual
      if (status) status.textContent = spoken
    }
    copied.then(() => say('Copied', `${what} copied`), () => say('Select to copy', `Could not copy. ${what}: ${btn.dataset.copy ?? ''}`))
    setTimeout(() => { if (label) label.textContent = 'Copy' }, 2000)
  })
})

/* load the map only when asked (privacy and page weight) */
document.querySelectorAll<HTMLElement>('.map-facade').forEach((box) => {
  box.querySelector('.map-load')?.addEventListener('click', () => {
    const frame = document.createElement('iframe')
    frame.src = box.dataset.mapSrc ?? ''
    frame.title = box.dataset.mapTitle ?? 'Map'
    frame.referrerPolicy = 'strict-origin-when-cross-origin'
    box.classList.remove('map-facade')
    box.replaceChildren(frame)
    frame.focus()
  })
})

/* scroll reveal: CSS scroll-driven animations where supported, IntersectionObserver otherwise */
const revealEls = document.querySelectorAll('.reveal, .stagger')
if (CSS.supports('animation-timeline', 'view()') || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'))
} else {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target) } })
  }, { rootMargin: '0px 0px -8% 0px' })
  revealEls.forEach((el) => reveal.observe(el))
}

/* countdown cards */
interface Card extends Slot { el: HTMLElement; nextLabel: string; name: string; visible: boolean }
const cards: Card[] = [...document.querySelectorAll<HTMLElement>('[data-gathering]')].map((el) => ({
  el,
  name: el.dataset.name ?? '',
  nextLabel: el.dataset.next ?? 'Next',
  weekday: Number(el.dataset.weekday),
  startTime: el.dataset.start ?? '00:00',
  durationMinutes: Number(el.dataset.duration),
  visible: true,
}))

function tickCard(card: Card) {
  const start = nextStart(etNow(), card)
  const diff = instantOf(start, TZ) - Date.now()
  const s = Math.max(0, Math.floor(diff / 1000))
  const set = (unit: string, value: string | number) => {
    const b = card.el.querySelector(`[data-u="${unit}"]`)
    if (b && b.textContent !== String(value)) b.textContent = String(value)
  }
  set('d', Math.floor(s / 86400))
  set('h', pad(Math.floor(s / 3600) % 24))
  set('m', pad(Math.floor(s / 60) % 60))
  set('s', pad(s % 60))
  const line = card.el.querySelector('.next-date')
  const text = diff <= 0 ? 'Happening now. Come on in.' : `${card.nextLabel}: ${dayLabel(start)}, ${timeLabel(card.startTime)} ET`
  if (line && line.textContent !== text) line.textContent = text
}

/* add to calendar: weekly recurring Google Calendar event */
const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
cards.forEach((card) => {
  const link = card.el.querySelector<HTMLAnchorElement>('.cal-link')
  if (!link) return
  const start = nextStart(etNow(), card)
  const end = new Date(start.getTime() + card.durationMinutes * 60_000)
  const stamp = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`
  link.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(`${card.name} · New Direction C.O.G.I.C`)}` +
    `&dates=${stamp(start)}/${stamp(end)}&ctz=${encodeURIComponent(TZ)}` +
    `&recur=${encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${DAYS[card.weekday]}`)}` +
    `&details=${encodeURIComponent(card.el.dataset.details ?? '')}`
})

/* hero chip: whichever gathering comes next */
const chip = byId('next-chip')
const chipText = byId('chip-text')
const slots: (Slot & { name: string })[] = chip ? JSON.parse(chip.dataset.gatherings ?? '[]') : []
function tickChip() {
  if (!chip || !chipText) return
  const now = etNow()
  const next = slots
    .map((slot) => ({ slot, start: nextStart(now, slot) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0]
  if (!next) return
  const diff = instantOf(next.start, TZ) - Date.now()
  const s = Math.max(0, Math.floor(diff / 1000))
  chip.classList.toggle('live', diff <= 0)
  const text = diff <= 0
    ? `${next.slot.name} is happening now`
    : s < 86400
      ? `${next.slot.name} starts in ${Math.floor(s / 3600)}h ${pad(Math.floor(s / 60) % 60)}m`
      : `Next: ${next.slot.name}, ${dayLabel(next.start).split(',')[0]} ${timeLabel(next.slot.startTime)}`
  if (chipText.textContent !== text) chipText.textContent = text
}

/* one clock for both, paused while the tab is hidden and for cards that are off-screen */
const tick = () => { cards.forEach((c) => c.visible && tickCard(c)); tickChip() }
cards.forEach(tickCard)
tickChip()
if ('IntersectionObserver' in window && cards.length) {
  const seen = new IntersectionObserver((entries) => entries.forEach((e) => {
    const card = cards.find((c) => c.el === e.target)
    if (card) { card.visible = e.isIntersecting; if (card.visible) tickCard(card) }
  }))
  cards.forEach((c) => seen.observe(c.el))
}
let timer: number | undefined
const run = () => { clearInterval(timer); timer = undefined; if (!document.hidden && (cards.length || chip)) { tick(); timer = window.setInterval(tick, 1000) } }
document.addEventListener('visibilitychange', run)
run()
