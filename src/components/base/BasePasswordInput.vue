<script setup lang="ts">
import Password from 'primevue/password'
import { useField } from 'vee-validate'
import { onMounted } from 'vue'
import rules from '@/utils/validators'

const props = defineProps({
  modelValue: String,
  rules: {
    type: Array,
    default: [
      (value: string) => rules.required(value, 'Password'),
      rules.password,
    ],
  },
  label: String,
})

const { value, errorMessage } = useField('passwordValue', validateField)

onMounted(() => {
  if (props.modelValue) {
    value.value = props.modelValue
  }
})

function validateField(value: any) {
  const errorMessages: string[] = []

  props.rules.forEach((rule: any) => {
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
      :class="{ 'p-invalid': errorMessage }"
      aria-describedby="text-error"
    />
    <label for="input" class="input-label">{{ label }}</label>
  </span>
  <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
</template>

<style scoped lang="scss">
@import '@/styles/baseInput.scss';
</style>
