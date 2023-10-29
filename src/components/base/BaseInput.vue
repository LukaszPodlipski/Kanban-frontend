<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { useField } from 'vee-validate'
import { ComponentOptions, computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'onErrorChange'])

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
  medium: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  emitErrors: {
    type: Boolean,
    default: false,
  },
  validateOnCreate: {
    type: Boolean,
    default: false,
  },
  disableOutline: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const inputLabel = props.placeholder?.length ? '' : props.label

const { value, errorMessage, errors } = useField(
  (props.fieldName ||
    props.label?.replace(/\s+/g, '') ||
    props.placeholder.replace(/\s+/g, '')) + 'Field',
  validateField,
)

onMounted(() => {
  if (props.validateOnCreate && props.emitErrors && !props.value) {
    emit('onErrorChange', { key: props.fieldName, value: '' })
  }
  if (props.emitErrors) {
    setupWatcher()
  }
  if (props.modelValue || props.value) {
    value.value = props.modelValue || props.value
  }
})

// if emitErrors is true, we need to watch for errors changes and emit them
const setupWatcher = () => {
  watch(
    () => errors.value,
    () => {
      emit('onErrorChange', { key: props.fieldName, value: errors.value[0] })
    },
  )
}

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
defineExpose({ childRef, errors })

const valueLeftLength = computed<number>(() => {
  let value = props.modelValue || props.value || ''
  if (props.component.name === 'Editor')
    value = value.replace(/<[^>]+>/g, '').replace(/<p><br><\/p>$/, '')
  return Math.max(props.maxLength - value.length, 0)
})
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
        'p-inputtext--medium': component.name === 'InputText' && medium,
        'outline-disabled': disableOutline,
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
  <div v-if="!hideDetails" class="flex mb-2 mt-1" style="height: 15px">
    <slot name="append" />
    <small
      v-if="
        !$slots.append &&
        component.name &&
        ['Textarea', 'Editor'].includes(component.name) &&
        maxLength
      "
      :class="{ 'p-error mb-1': errorMessage && maxLength - value?.length < 0 }"
      >{{ $t('tasks.left', { number: valueLeftLength }) }}</small
    >
    <small class="flex-1 p-error" id="text-error">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/partials/baseInput.scss';
</style>
