import { useEffect, useState } from 'react'

export type ProTimeValues = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type FormattedProTimeValues = {
  days: string
  hours: string
  minutes: string
  seconds: string
}

function useProTime(
  startDate: string | Date,
  endDate: string | Date,
  isFormatted: true
): FormattedProTimeValues
function useProTime(
  startDate: string | Date,
  endDate: string | Date,
  isFormatted?: false
): ProTimeValues
function useProTime(
  startDate: string | Date,
  endDate: string | Date,
  isFormatted?: boolean
): ProTimeValues | FormattedProTimeValues
function useProTime(
  startDate: string | Date,
  endDate: string | Date,
  isFormatted: boolean = false
): ProTimeValues | FormattedProTimeValues {
  // plain numbers, so the effect re-runs when the instant changes but not when
  // a caller passes a fresh Date object for the same instant
  const start = new Date(startDate).getTime()
  const target = new Date(endDate).getTime()

  const [countDown, setCountDown] = useState(() => remainingUntil(target))

  useEffect(() => {
    // reflect the current endDate straight away, even while still waiting on
    // startDate, so a changed endDate is never left a second out of date
    setCountDown(remainingUntil(target))

    const interval = setInterval(() => {
      if (Date.now() < start) return

      const remaining = remainingUntil(target)
      setCountDown(remaining)

      // nothing left to count, so stop waking up every second
      if (remaining === 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [start, target])

  const values = getReturnValues(countDown)

  return isFormatted ? zeroFormat(values) : values
}

const remainingUntil = (target: number) => Math.max(0, target - Date.now())

const getReturnValues = (countDown: number): ProTimeValues => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

const zeroFormat = (values: ProTimeValues): FormattedProTimeValues => ({
  days: addZero(values.days),
  hours: addZero(values.hours),
  minutes: addZero(values.minutes),
  seconds: addZero(values.seconds)
})

const addZero = (value: number): string =>
  value < 10 ? `0${value}` : String(value)

export default useProTime
