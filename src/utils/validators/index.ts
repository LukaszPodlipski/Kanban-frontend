const required = (value: string, fieldName: string = 'Field') => {
  if (value) return true
  return `${fieldName} is required`
}

const email = (value: string) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
    return 'Email is invalid'
  return true
}

const password = (value: string) => {
  if (value && value.length < 8) return 'Password must be at least 8 characters'
  return true
}

const minLength = (value: string, length: number, label: string = 'Field') => {
  if (value && value.length < length)
    return `${label} must be at least ${length} characters`
  return true
}

const maxLength = (value: string, length: number, label: string = 'Field') => {
  if (value && value.length > length)
    return `${label} must be at most ${length} characters`
  return true
}

export default {
  required,
  email,
  password,
  minLength,
  maxLength,
}
