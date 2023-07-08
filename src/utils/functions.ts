export const delay = (t: number, v: any): Promise<any> => {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  })
}

export const falseLoadingState = async (time: number = 300) => {
  await delay(time, null)
  return false
}

export const trimText = (
  text: string = '',
  trimLength: number = 9,
  condition: boolean = true,
  trimAlt: number = 1,
): string => {
  const trimName = (text: string = '') => {
    if (text.length > trimLength) {
      const trimmedName = text.slice(0, trimLength)
      const lastChar = trimmedName.slice(-1)
      const lastCharIsSpace = lastChar === ' '
      return trimmedName + (lastCharIsSpace ? '' : '...')
    }
    return text
  }
  return condition
    ? trimName(text)
    : text && text.slice(0, trimAlt).toUpperCase()
}
