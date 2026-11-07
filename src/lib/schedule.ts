export interface Slot { weekday: number; startTime: string; durationMinutes: number }

/**
 * The next start of a weekly gathering, or the current one while it is running.
 * `now` is Eastern wall-clock time held in a local Date.
 * ponytail: that trick can be an hour off on the one DST-switch night a year.
 */
export function nextStart(now: Date, slot: Slot): Date {
  const [hours, minutes] = slot.startTime.split(':').map(Number)
  const start = new Date(now)
  start.setHours(hours, minutes, 0, 0)
  start.setDate(start.getDate() + ((slot.weekday - start.getDay() + 7) % 7))
  if (now.getTime() - start.getTime() > slot.durationMinutes * 60_000) start.setDate(start.getDate() + 7)
  return start
}

/** "7:00 PM" from "19:00". */
export function timeLabel(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`
}
