<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { messages } from '@/locale'
import { getImageUrl } from '@/utils/functions'

defineProps({
  flagsOnly: {
    type: Boolean,
    default: false,
  },
})

const i18n = useI18n()

const getLocaleFullname = (locale: string) => {
  return i18n.t(`locales.${locale}`)
}

const availableLocales = computed(() => {
  return Object.keys(messages)?.map((locale) => ({
    label: getLocaleFullname(locale),
    id: locale,
  }))
})

const activeI18nLocale = computed(() => {
  return i18n.locale.value
})

const updateLocale = (locale: string) => {
  setTimeout(() => {
    i18n.locale.value = locale
  }, 5)
}
</script>
<template>
  <BaseSelect
    :value="activeI18nLocale"
    :items="availableLocales"
    :label="$t('sidebar.language')"
    :placeholder="$t('sidebar.selectLanguage')"
    optionsLabel="label"
    optionsValue="id"
    :showClear="false"
    hideDropdownIcon
    disableOutline
    @update:modelValue="updateLocale"
  >
    <template #value="{ slotProps }">
      <div
        class="w-full flex align-items-center"
        :class="
          flagsOnly ? 'justify-content-center' : 'justify-content-between'
        "
      >
        <span v-if="!flagsOnly">{{ getLocaleFullname(slotProps.value) }}</span>
        <img
          class="flag"
          :src="
            getImageUrl(
              `/src/assets/images/locales/${slotProps.value}-flag.jpg`,
            )
          "
        />
      </div>
    </template>
    <template #option="{ slotProps }">
      <div class="w-full flex align-items-center justify-content-between">
        <span v-if="!flagsOnly">{{
          getLocaleFullname(slotProps?.option?.id)
        }}</span>
        <img
          class="flag"
          :src="
            getImageUrl(
              `/src/assets/images/locales/${slotProps?.option?.id}-flag.jpg`,
            )
          "
        />
      </div>
    </template>
  </BaseSelect>
</template>

<style scoped lang="scss">
.flag {
  width: 30px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
}
</style>
