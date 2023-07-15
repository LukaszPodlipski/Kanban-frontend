<script setup lang="ts">
import Dropdown from 'primevue/dropdown'
import { useField } from 'vee-validate'
import { onMounted, ComponentOptions } from 'vue'

defineEmits(['cleared', 'update:modelValue'])

const props = defineProps({
  modelValue: [String, Number],
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
})

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
  <component
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
    }"
    @update:model-value="(value: string) => $emit('update:modelValue', value)"
  />
  <small class="p-error mt-1 mb-1" id="text-error">{{
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