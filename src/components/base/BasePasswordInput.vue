<script setup lang="ts">
import Password from 'primevue/password'
import { computed, onMounted } from 'vue'

import { useField } from 'vee-validate'
import { useI18n } from 'vue-i18n'

import rules from '@/utils/validators'

const props = defineProps({
  modelValue: String,
  rules: {
    type: Array,
    default: () => [],
  },
  label: String,
})

const { t } = useI18n()

const passwordRules = computed(() => {
  return props.rules.length
    ? props.rules
    : [
        (value: string) => rules.required(value, t('login.password')),
        rules.password,
      ]
})

const { value, errorMessage } = useField('passwordField', validateField)

onMounted(() => {
  if (props.modelValue) {
    value.value = props.modelValue
  }
})

function validateField(value: any) {
  const errorMessages: string[] = []

  passwordRules.value?.forEach((rule: any) => {
    const result = rule(value)
    if (result !== true) {
      errorMessages.push(result)
    }
  })

  if (errorMessages.length) {
    return errorMessages[0]
  }

  return true
}
</script>

<template>
  <span class="p-float-label p-input-icon-right">
    <Password
      inputId="passwordInput"
      v-model="value"
      @update:model-value="(value: string) => $emit('update:modelValue', value)"
      :feedback="false"
      toggleMask
      autocomplete="current-password"
      :class="{ 'p-invalid': errorMessage, 'p-filled': value.length > 0 }"
      aria-describedby="text-error"
    />
    <label for="input" class="input-label">{{ label }}</label>
  </span>
  <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
</template>

<style scoped lang="scss">
@import '@/assets/styles/partials/baseInput.scss';
</style>
