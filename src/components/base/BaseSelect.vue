<script setup lang="ts">
import Dropdown from 'primevue/dropdown'
import { useField } from 'vee-validate'
import { ComponentOptions, onMounted } from 'vue'

defineEmits(['cleared', 'update:modelValue'])

const props = defineProps({
  modelValue: [String, Number],
  value: [String, Number],
  fieldName: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: [],
  },
  items: {
    type: Array,
    default: [],
  },
  label: {
    type: String,
    default: '',
  },
  optionsLabel: {
    type: String,
    default: '',
  },
  optionsValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  showClear: {
    type: Boolean,
    default: true,
  },
  hideDropdownIcon: {
    type: Boolean,
    default: false,
  },
  component: {
    type: Object as () => ComponentOptions,
    default: Dropdown,
  },
  disableOutline: {
    type: Boolean,
    default: false,
  },
})

const { value, errorMessage } = useField(
  (props.fieldName ||
    props.label?.replace(/\s+/g, '') ||
    props.placeholder.replace(/\s+/g, '')) + 'Field',
  validateField,
)

onMounted(() => {
  if (props.modelValue || props.value) {
    value.value = props.modelValue || props.value
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
  <component
    v-bind="$attrs"
    :is="component"
    id="select"
    v-model="value"
    :options="items"
    :optionValue="optionsValue"
    :optionLabel="optionsLabel"
    :placeholder="placeholder"
    aria-describedby="text-error"
    :showClear="showClear && !!value"
    class="w-full"
    @change="!value || value === '' ? $emit('cleared') : null"
    :class="{
      'p-invalid': errorMessage,
      'hide-dropdown-icon': hideDropdownIcon,
      'move-clear-icon': hideDropdownIcon,
      'outline-disabled': disableOutline,
    }"
    @update:model-value="(value: string) => $emit('update:modelValue', value)"
  >
    <template
      v-if="component.name === 'Dropdown' && $slots.value"
      #value="slotProps"
    >
      <slot name="value" :slotProps="slotProps" />
    </template>
    <template
      v-if="component.name === 'Dropdown' && $slots.option"
      #option="slotProps"
    >
      <slot name="option" :slotProps="slotProps"></slot>
    </template>
  </component>
  <slot name="append" />
  <small v-if="rules.length" class="p-error mt-1 mb-1" id="text-error">{{
    errorMessage || '&nbsp;'
  }}</small>
</template>

<style scoped lang="scss">
@import '@/assets/styles/partials/baseSelect.scss';

.hide-dropdown-icon {
  :deep(.p-dropdown-trigger) {
    display: none;
  }
}

.move-clear-icon {
  :deep(.p-dropdown-clear-icon) {
    right: 0.5rem;
  }
}
</style>
