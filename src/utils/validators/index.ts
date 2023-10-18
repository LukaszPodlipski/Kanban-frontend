import i18n from '@/locale'

const required = (value: string, fieldName: string = 'Field') => {
  if (value) return true
  return i18n.global.t('validators.isRequired', { field: fieldName })
}

const email = (value: string) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))
    return i18n.global.t('validators.isInvalid', { field: 'Email' })
  return true
}

const password = (value: string) => {
  if (value && value.length < 8)
    return i18n.global.t('validators.passwordSchameInvalid')
  return true
}

const minLength = (value: string, length: number, label: string = 'Field') => {
  if (value && value.length < length)
    return i18n.global.t('validators.minValueInvalid', { field: label, length })
  return true
}

const maxLength = (value: string, length: number, label: string = 'Field') => {
  if (value && value.length > length)
    return i18n.global.t('validators.maxValueInvalid', { field: label, length })
  return true
}

export default {
  required,
  email,
  password,
  minLength,
  maxLength,
}
