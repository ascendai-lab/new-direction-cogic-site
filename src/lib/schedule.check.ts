// Run with: node src/lib/schedule.check.ts
import assert from 'node:assert/strict'
import { instantOf, nextStart, timeLabel, wallClock } from './schedule.ts'

const study = { weekday: 3, startTime: '19:00', durationMinutes: 60 }
const iso = (d: Date) => d.toISOString()
const wall = (s: string) => new Date(`${s}Z`)
const TZ = 'America/New_York'

// 2026-11-04 is a Wednesday (wall-clock times, Eastern)
assert.equal(iso(nextStart(wall('2026-11-02T12:00:00'), study)), iso(wall('2026-11-04T19:00:00'))) // Monday → this Wednesday
assert.equal(iso(nextStart(wall('2026-11-04T18:00:00'), study)), iso(wall('2026-11-04T19:00:00'))) // same day, before
assert.equal(iso(nextStart(wall('2026-11-04T19:30:00'), study)), iso(wall('2026-11-04T19:00:00'))) // running now
assert.equal(iso(nextStart(wall('2026-11-04T20:30:00'), study)), iso(wall('2026-11-11T19:00:00'))) // finished → next week

// Wall clock and instants, either side of the 2026-11-01 switch from EDT to EST
assert.equal(iso(wallClock(TZ, Date.parse('2026-11-04T17:00:00Z'))), iso(wall('2026-11-04T12:00:00'))) // EST, UTC-5
assert.equal(iso(wallClock(TZ, Date.parse('2026-10-28T16:00:00Z'))), iso(wall('2026-10-28T12:00:00'))) // EDT, UTC-4
assert.equal(new Date(instantOf(wall('2026-11-04T19:00:00'), TZ)).toISOString(), '2026-11-05T00:00:00.000Z')
assert.equal(new Date(instantOf(wall('2026-10-28T19:00:00'), TZ)).toISOString(), '2026-10-28T23:00:00.000Z')

// Across the switch the countdown gains the extra hour: 25 wall-clock hours are 26 real ones
const sunday = { weekday: 0, startTime: '11:00', durationMinutes: 90 }
const satNight = Date.parse('2026-10-31T14:00:00Z') // Saturday 10:00 AM EDT
const start = nextStart(wallClock(TZ, satNight), sunday)
assert.equal((instantOf(start, TZ) - satNight) / 3_600_000, 26) // 10 AM Sat EDT → 11 AM Sun EST

assert.equal(timeLabel('19:00'), '7:00 PM')
assert.equal(timeLabel('11:00'), '11:00 AM')
assert.equal(timeLabel('12:30'), '12:30 PM')
assert.equal(timeLabel('00:15'), '12:15 AM')
console.log('schedule ok')
