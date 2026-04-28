import { describe, test, expect } from "vitest"
import { calculateStreaks } from "../../src/lib/streaks"

describe('calculateStreaks', () => {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
  const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]

  test('returns 0 when completions is empty', () => {
    expect(calculateStreaks([])).toBe(0)
  })

  test('returns 0 when today is not completed', () => {
    expect(calculateStreaks([yesterday])).toBe(0)
  })

  test('returns the correct streak for consecutive completed days', () => {
    expect(calculateStreaks([today, yesterday, twoDaysAgo])).toBe(3)
  })

  test('ignores duplicate completion dates', () => {
    expect(calculateStreaks([today, today, yesterday])).toBe(2)
  })

  test('breaks the streak when a calendar day is missing', () => {
    expect(calculateStreaks([today, twoDaysAgo])).toBe(1)
  })
})