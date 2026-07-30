import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProTime from './ProTime'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const NOW = new Date('2026-01-01T00:00:00.000Z')

/** an ISO timestamp `offset` ms away from the frozen clock */
const at = (offset: number) => new Date(NOW.getTime() + offset).toISOString()

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

describe('ProTime', () => {
  it('renders hours, minutes and seconds when under a day remains', () => {
    const { container } = render(
      <ProTime
        startDate={at(-HOUR)}
        endDate={at(2 * HOUR + 3 * MINUTE + 4 * SECOND)}
      />
    )

    expect(container.querySelector('p')?.textContent).toBe('02:03:04')
  })

  it('renders the day count when a day or more remains', () => {
    const { container } = render(
      <ProTime
        startDate={at(-HOUR)}
        endDate={at(DAY + 2 * HOUR + 5 * MINUTE + 9 * SECOND)}
      />
    )

    expect(container.querySelector('#days')?.textContent).toBe('01 days')
    expect(container.querySelector('#hour')?.textContent).toBe('02 hours')
    expect(container.querySelector('#min')?.textContent).toBe('05 min')
    expect(container.querySelector('#sec')?.textContent).toBe('09 sec')
  })

  it('shows zeroes rather than negative values once endDate has passed', () => {
    const { container } = render(
      <ProTime startDate={at(-2 * HOUR)} endDate={at(-HOUR)} />
    )

    expect(container.querySelector('p')?.textContent).toBe('00:00:00')
  })

  it('applies a supplied className to the container', () => {
    const { container } = render(
      <ProTime startDate={at(-HOUR)} endDate={at(HOUR)} className='timer' />
    )

    expect(container.querySelector('p')?.getAttribute('class')).toBe('timer')
  })

  it('renders without a className, which is optional', () => {
    const { container } = render(
      <ProTime startDate={at(-HOUR)} endDate={at(HOUR)} />
    )

    expect(container.querySelector('p')?.getAttribute('class')).toBeNull()
  })
})
