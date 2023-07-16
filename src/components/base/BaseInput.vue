<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { useField } from 'vee-validate'
import { onMounted, ComponentOptions } from 'vue'

const props = defineProps({
  modelValue: String || Number,
  fieldName: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: [],
  },
  label: String,
  iconRight: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  floatLabel: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  component: {
    type: Object as () => ComponentOptions,
    default: InputText,
  },
  maxLength: {
    type: Number,
    default: 0,
  },
})

const inputLabel = props.placeholder.length ? '' : props.label

const { value, errorMessage } = useField(
  (props.fieldName || props.label?.replace(/\s+/g, '') || props.placeholder.replace(/\s+/g, '')) + 'Field',
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
  <span class="p-input-icon-right" :class="{ 'p-float-label': floatLabel }">
    <i v-if="iconRight" :class="`pi ${iconRight}`" />
    <component
      :is="component"
      id="input"
      v-model="value"
      @update:model-value="(value: string) => $emit('update:modelValue', value)"
      class="w-full"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :class="{ 'p-invalid': errorMessage }"
      aria-describedby="text-error"
    />
    <label for="input" class="input-label">{{ inputLabel }}</label>
  </span>
  <div class="flex mb-2" style="height: 15px">
    <small
      v-if="component.name === 'Textarea'"
      :class="{ 'p-error mb-1': errorMessage && maxLength - value.length < 0 }"
      >{{ Math.max(maxLength - value.length, 0) }} left</small
    >
    <small class="flex-1 p-error" id="text-error">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/partials/baseInput.scss';
</style>
