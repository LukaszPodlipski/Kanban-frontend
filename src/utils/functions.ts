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

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

export const getImageUrl = (path: string) => {
  return new URL(path, import.meta.url).href
}

export const isObject = (value: any) => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export const stringDeepCopy = (string: string) => {
  return (' ' + string).slice(1)
}

export const randomPastelColor = () => {
  const r = Math.floor(Math.random() * 128) + 128
  const g = Math.floor(Math.random() * 128) + 128
  const b = Math.floor(Math.random() * 128) + 128
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`

  return hexColor
}
