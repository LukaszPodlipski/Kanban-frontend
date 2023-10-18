<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { useField } from 'vee-validate'
import { onMounted, ComponentOptions, ref } from 'vue'

defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: String || Number,
  value: String || Number,
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
  disabled: {
    type: Boolean,
    default: false,
  },
})

const inputLabel = props.placeholder?.length ? '' : props.label

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

const childRef = ref(null)
defineExpose({ childRef })
</script>

<template>
  <span
    class="p-input-icon-right"
    :class="{ 'p-float-label': floatLabel }"
    ref="childRef"
  >
    <i v-if="iconRight" :class="`pi ${iconRight}`" />
    <component
      :is="component"
      v-model="value"
      id="input"
      autoResize
      @update:model-value="(value: string) => $emit('update:modelValue', value)"
      class="w-full"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :class="{
        'p-invalid': errorMessage,
        'p-editor-container-filled':
          component.name === 'Editor' && value?.length,
      }"
      aria-describedby="text-error"
    >
      <template v-if="component.name === 'Editor'" v-slot:toolbar>
        <span class="ql-formats">
          <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
          <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
          <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
        </span>
      </template>
    </component>
    <label for="input" class="input-label">{{ inputLabel }}</label>
  </span>
  <div class="flex mb-2 mt-1" style="height: 15px">
    <slot name="append" />
    <small
      v-if="
        !$slots.append &&
        component.name &&
        ['Textarea', 'Editor'].includes(component.name) &&
        maxLength
      "
      :class="{ 'p-error mb-1': errorMessage && maxLength - value?.length < 0 }"
      >{{ Math.max(maxLength - value?.length, 0) }} left</small
    >
    <small class="flex-1 p-error" id="text-error">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/partials/baseInput.scss';
</style>
