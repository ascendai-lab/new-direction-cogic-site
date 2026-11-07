// Run with: node src/lib/schedule.check.ts
import assert from 'node:assert/strict'
import { nextStart, timeLabel } from './schedule.ts'

const study = { weekday: 3, startTime: '19:00', durationMinutes: 60 }
const at = (s: string) => new Date(s).toISOString()

// 2026-11-04 is a Wednesday
assert.equal(at(nextStart(new Date('2026-11-02T12:00:00'), study).toString()), at('2026-11-04T19:00:00')) // Monday → this Wednesday
assert.equal(at(nextStart(new Date('2026-11-04T18:00:00'), study).toString()), at('2026-11-04T19:00:00')) // same day, before
assert.equal(at(nextStart(new Date('2026-11-04T19:30:00'), study).toString()), at('2026-11-04T19:00:00')) // running now
assert.equal(at(nextStart(new Date('2026-11-04T20:30:00'), study).toString()), at('2026-11-11T19:00:00')) // finished → next week
assert.equal(timeLabel('19:00'), '7:00 PM')
assert.equal(timeLabel('11:00'), '11:00 AM')
assert.equal(timeLabel('12:30'), '12:30 PM')
assert.equal(timeLabel('00:15'), '12:15 AM')
console.log('schedule ok')
