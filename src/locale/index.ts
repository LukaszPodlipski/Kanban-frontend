import { createI18n } from 'vue-i18n'

import en from './en.json'
import pl from './pl.json'

export const messages = {
  en,
  pl,
}

const i18n = createI18n({
  locale: 'pl',
  fallbackLocale: 'en',
  legacy: false,
  messages,
})

export default i18n
