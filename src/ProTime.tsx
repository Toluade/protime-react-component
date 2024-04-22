import * as React from 'react'
import useProTime from './useProTime'

type Props = {
  className: string
  startDate: Date | string
  endDate: Date | string
}

const ProTime = ({ startDate, endDate, className }: Props) => {
  const { days, hours, minutes, seconds } = useProTime(startDate, endDate, true)

  if (days !== '00')
    return (
      <p className={className}>
        <span id='days'>{days} days</span>
        <span id='hour'>{hours} hours</span>
        <span id='min'>{minutes} min</span>
        <span id='sec'>{seconds} sec</span>
      </p>
    )
  return (
    <p className={className}>
      <span id='hour'>{hours}</span>
      <span className='column timer__item'>:</span>
      <span id='min'>{minutes}</span>

      <span className='column timer__item'>:</span>
      <span id='sec'>{seconds}</span>
    </p>
  )
}

export default ProTime
