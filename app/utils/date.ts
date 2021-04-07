export function getTimeDifference(
  referenceTime: number
): { num: number; off: string } {
  const currentTime = Date.now()
  const diffInSeconds = (currentTime - referenceTime) / 1000;
  // console.table({diffInSeconds, currentTime, referenceTime})
  if (diffInSeconds < 60) {
    return {
      num: 0,
      off: 'now'
    }
  }

  const diffInMins = diffInSeconds / 60

  if (diffInMins < 60) {
    return {
      num: Math.round(diffInMins),
      off: 'minutes'
    }
  }

  const diffInHours = diffInMins / 60

  if (diffInHours < 24) {
    return {
      num: Math.round(diffInHours),
      off: 'hours'
    }
  }

  const diffInDays = diffInHours/24;
  return {
      num: Math.round(diffInDays),
      off: 'days'
  }
}
