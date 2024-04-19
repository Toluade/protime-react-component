import { useEffect, useState } from 'react'

const useTimer = (startDate: string | Date, endDate: string | Date) => {
  const countDownDate = new Date(endDate).getTime()

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  )

  useEffect(() => {
    const start = new Date().getTime > new Date(startDate).getTime
    let interval: ReturnType<typeof setInterval>
    if (start) {
      interval = setInterval(() => {
        setCountDown(
          countDownDate - new Date(endDate).getTime() <= 0
            ? 0
            : countDownDate - new Date(endDate).getTime()
        )
      }, 1000)

      if (countDown < 0) {
        setCountDown(0)
        clearInterval(interval)
      }
    }

    return () => clearInterval(interval)
  }, [countDown, countDownDate])

  return {
    ...zeroFormat(getReturnValues(countDown))
    // resetTimer,
  }
}

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

const zeroFormat = (obj: any) => {
  const objVal = { ...obj }

  Object.keys(objVal).forEach(function (key) {
    objVal[key] = addZero(objVal[key])
  })

  return objVal
}

const addZero = (val: number) => {
  return val < 10 ? '0' + val : val
}

export default useTimer
