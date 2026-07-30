import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// vitest globals are off, so Testing Library's own auto-cleanup never runs
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
