import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useProTime from './useProTime'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const NOW = new Date('2026-01-01T00:00:00.000Z')

/** an ISO timestamp `offset` ms away from the frozen clock */
const at = (offset: number) => new Date(NOW.getTime() + offset).toISOString()

const advance = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

describe('useProTime', () => {
  it('reports the time remaining until endDate on the first render', () => {
    const { result } = renderHook(() =>
      useProTime(at(-HOUR), at(2 * HOUR + 3 * MINUTE + 4 * SECOND))
    )

    expect(result.current).toEqual({
      days: 0,
      hours: 2,
      minutes: 3,
      seconds: 4
    })
  })

  it('breaks a multi-day span into days, hours, minutes and seconds', () => {
    const { result } = renderHook(() =>
      useProTime(at(-HOUR), at(3 * DAY + 4 * HOUR + 5 * MINUTE + 6 * SECOND))
    )

    expect(result.current).toEqual({
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 6
    })
  })

  it('counts down once a second while running', async () => {
    const { result } = renderHook(() => useProTime(at(-HOUR), at(MINUTE)))

    await advance(10 * SECOND)

    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 50
    })
  })

  it('clamps to zero when endDate has already passed', () => {
    const { result } = renderHook(() => useProTime(at(-2 * HOUR), at(-HOUR)))

    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
  })

  // regression: the initial state was not clamped, so the very first render
  // produced negative values. useEffect runs after paint, so the old code's
  // corrective branch could not hide them
  it('never renders a negative value, not even on the first render', () => {
    const rendered: unknown[] = []

    renderHook(() => {
      const values = useProTime(at(-2 * HOUR), at(-HOUR))
      rendered.push(values)
      return values
    })

    expect(rendered[0]).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
  })

  // regression: the corrective branch sat inside the "has startDate passed"
  // check, so with startDate still ahead the negative value was permanent
  it('clamps to zero when endDate has passed but startDate has not arrived', async () => {
    const { result } = renderHook(() => useProTime(at(HOUR), at(-HOUR)))

    await advance(10 * SECOND)

    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
  })

  it('holds its value until startDate is reached', async () => {
    const { result } = renderHook(() => useProTime(at(10 * SECOND), at(MINUTE)))

    await advance(5 * SECOND)

    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 0
    })
  })

  // regression: startDate was read once, was not a dependency, and the effect
  // only re-ran when countDown changed, which could not happen until an
  // interval existed. A component mounted before startDate never started.
  it('starts counting down once startDate arrives', async () => {
    const { result } = renderHook(() => useProTime(at(5 * SECOND), at(HOUR)))

    await advance(6 * SECOND)

    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 59,
      seconds: 54
    })
  })

  // regression: countDown was a dependency, so every tick tore the interval
  // down and built a new one
  it('creates its interval once, not on every tick', async () => {
    const setInterval = vi.spyOn(globalThis, 'setInterval')

    renderHook(() => useProTime(at(-HOUR), at(HOUR)))
    await advance(5 * SECOND)

    expect(setInterval).toHaveBeenCalledTimes(1)
  })

  it('leaves no timer behind on unmount', () => {
    const { unmount } = renderHook(() => useProTime(at(-HOUR), at(HOUR)))

    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })

  it('stops its interval once the countdown reaches zero', async () => {
    const { result } = renderHook(() => useProTime(at(-HOUR), at(3 * SECOND)))

    await advance(5 * SECOND)

    expect(result.current).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  // regression: a changed endDate was not reflected until the next tick
  it('reflects a changed endDate immediately', () => {
    const { result, rerender } = renderHook(
      ({ end }: { end: string }) => useProTime(at(-HOUR), end),
      { initialProps: { end: at(HOUR) } }
    )

    expect(result.current.hours).toBe(1)

    rerender({ end: at(2 * HOUR) })

    expect(result.current.hours).toBe(2)
  })

  it('does not restart for a fresh Date object describing the same instant', () => {
    const setInterval = vi.spyOn(globalThis, 'setInterval')

    const { rerender } = renderHook(
      ({ end }: { end: Date }) => useProTime(at(-HOUR), end),
      { initialProps: { end: new Date(NOW.getTime() + HOUR) } }
    )

    expect(setInterval).toHaveBeenCalledTimes(1)

    rerender({ end: new Date(NOW.getTime() + HOUR) })

    expect(setInterval).toHaveBeenCalledTimes(1)
  })

  describe('isFormatted', () => {
    it('returns numbers when omitted', () => {
      const { result } = renderHook(() => useProTime(at(-HOUR), at(11 * DAY)))

      Object.values(result.current).forEach((value) =>
        expect(typeof value).toBe('number')
      )
    })

    it('pads values below ten with a leading zero', () => {
      const { result } = renderHook(() =>
        useProTime(
          at(-HOUR),
          at(DAY + 2 * HOUR + 5 * MINUTE + 9 * SECOND),
          true
        )
      )

      expect(result.current).toEqual({
        days: '01',
        hours: '02',
        minutes: '05',
        seconds: '09'
      })
    })

    // regression: addZero returned a string below ten but a number at ten and
    // above, while the return type asserted every field was a string
    it('returns strings for values of ten and above', () => {
      const { result } = renderHook(() =>
        useProTime(
          at(-HOUR),
          at(11 * DAY + 12 * HOUR + 34 * MINUTE + 56 * SECOND),
          true
        )
      )

      expect(result.current).toEqual({
        days: '11',
        hours: '12',
        minutes: '34',
        seconds: '56'
      })
      Object.values(result.current).forEach((value) =>
        expect(typeof value).toBe('string')
      )
    })
  })
})
