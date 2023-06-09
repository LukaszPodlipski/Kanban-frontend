<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { useField } from 'vee-validate'
import { onMounted } from 'vue'

const props = defineProps({
  modelValue: String,
  rules: {
    type: Array,
    default: [],
  },
  label: String,
  iconRight: {
    type: String,
    default: '',
  },
})

const { value, errorMessage } = useField(
  `${props.label?.toLowerCase()}Value`,
  validateField,
)

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
    <i v-if="iconRight" :class="`pi ${iconRight}`" />
    <InputText
      id="input"
      v-model="value"
      @update:model-value="(value: string) => $emit('update:modelValue', value)"
      class="w-full"
      :class="{ 'p-invalid': errorMessage }"
      aria-describedby="text-error"
    />
    <label for="input" class="input-label">{{ label }}</label>
  </span>
  <small class="p-error mb-2" id="text-error">{{
    errorMessage || '&nbsp;'
  }}</small>
</template>

<style scoped lang="scss">
@import '@/styles/baseInput.scss';
// .input-label {
//   color: #6560ba !important;
// }

// ::v-deep .p-inputtext {
//   min-width: 250px;
//   height: 45px;
//   background: #dfdcff !important;
//   border: 1px solid #6560ba !important;
// }

// ::v-deep .p-inputtext:enabled:focus {
//   outline: 0 none;
//   outline-offset: 0;
//   box-shadow: 0 0 0 0.2rem #6560ba;
//   border-color: #6560ba;
// }
// ::v-deep .p-invalid {
//   border-radius: 4px;
//   outline: 2px solid red !important;
// }

// .p-error {
//   text-align: end !important;
//   height: 20px;
// }
// ::v-deep .p-input-icon-right > i:last-of-type {
//   color: #6560ba !important;
// }
</style>
