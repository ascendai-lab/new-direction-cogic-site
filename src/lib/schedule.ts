export interface Slot { weekday: number; startTime: string; durationMinutes: number }

/*
 * Times are handled as "wall clock" Dates: a Date whose UTC fields hold the Eastern date and time.
 * Using only the UTC getters and setters keeps the visitor's own time zone and DST out of the math.
 * `instantOf` turns a wall-clock Date back into a real moment, so countdowns stay right across DST.
 */

const formatters = new Map<string, Intl.DateTimeFormat>()
function partsIn(timeZone: string, ms: number) {
  let f = formatters.get(timeZone)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23',
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    })
    formatters.set(timeZone, f)
  }
  const p: Record<string, number> = {}
  for (const { type, value } of f.formatToParts(ms)) if (type !== 'literal') p[type] = Number(value)
  return p
}

/** The wall-clock time in `timeZone` at the moment `ms` (default: now). */
export function wallClock(timeZone: string, ms = Date.now()): Date {
  const p = partsIn(timeZone, ms)
  return new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second))
}

/** The real moment (epoch ms) at which `timeZone` shows the wall-clock time `wall`. */
export function instantOf(wall: Date, timeZone: string): number {
  const target = wall.getTime()
  let guess = target
  // Two passes settle the offset, including on DST-change days.
  for (let i = 0; i < 2; i++) guess = target - (wallClock(timeZone, guess).getTime() - guess)
  return guess
}

/**
 * The next start of a weekly gathering, or the current one while it is running.
 * `now` and the result are wall-clock Dates (see above).
 */
export function nextStart(now: Date, slot: Slot): Date {
  const [hours, minutes] = slot.startTime.split(':').map(Number)
  const start = new Date(now)
  start.setUTCHours(hours, minutes, 0, 0)
  start.setUTCDate(start.getUTCDate() + ((slot.weekday - start.getUTCDay() + 7) % 7))
  if (now.getTime() - start.getTime() > slot.durationMinutes * 60_000) start.setUTCDate(start.getUTCDate() + 7)
  return start
}

/** "7:00 PM" from "19:00". */
export function timeLabel(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`
}
