export const getCurrentTime = () => {
  // Create a new Javascript Date object based on the timestamp
  const date = new Date(Date.now())
  // hours part from the timestamp
  const hours = date.getHours()
  // minutes part from the timestamp
  const minutes = '0' + date.getMinutes()
  // seconds part from the timestamp
  const seconds = '0' + date.getSeconds()
  const year = date.getFullYear()
  const month = '0' + (date.getMonth() + 1)
  const day = '0' + date.getDate()
  const formattedTime =
    year +
    '-' +
    month.substr(-2) +
    '-' +
    day.substr(-2) +
    ' ' +
    hours +
    ':' +
    minutes.substr(-2) +
    ':' +
    seconds.substr(-2)
  return formattedTime
}
