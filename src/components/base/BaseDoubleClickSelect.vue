<script setup lang="ts">
import { Form } from 'vee-validate'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  optionsValue: {
    type: String,
    default: 'id',
  },
  optionsLabel: {
    type: String,
    default: 'name',
  },
  placeholder: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  fieldKey: {
    type: String,
    default: '',
  },
  tooltipConfig: {
    type: Object,
    default: () => ({}),
  },
})

let timeout: ReturnType<typeof setTimeout> | null

const emit = defineEmits([
  'setEditingState',
  'updateFieldValue',
  'submitFieldValue',
])

const updateValue = (value: any) => {
  if (value === props.value) return

  emit('updateFieldValue', { value, key: props.fieldKey })

  timeout = setTimeout(() => {
    if (timeout) submitFieldValue(props.fieldKey)
  }, 3000)
}

const submitFieldValue = (key: any) => {
  emit('submitFieldValue', key)
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
}

const setEditingState = (payload: { key: string; value: boolean }) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  emit('setEditingState', payload)
}
</script>

<template>
  <div @keydown.esc.stop="setEditingState({ key: fieldKey, value: false })">
    <div class="flex align-start">
      <span class="label px-2 py-1">{{ label }}</span>
      <i
        v-if="!readonly && !isEditing"
        class="pi pi-pencil label__icon"
        @click="setEditingState({ key: fieldKey, value: true })"
      ></i>
    </div>
    <span
      v-if="!isEditing || readonly"
      class="px-2 py-1 m-0 w-full block"
      :class="{ field: !readonly }"
      @dblclick="setEditingState({ key: fieldKey, value: true })"
    >
      <slot name="value" />
      <span v-if="!$slots.value">{{ value }}</span>
    </span>
    <Form
      v-else
      v-slot="{ errors }"
      class="mx-2 my-1"
      v-tooltip.bottom="{ ...tooltipConfig, disabled: isEditing }"
    >
      <BaseSelect
        :value="value"
        :items="items"
        :label="label"
        :optionsValue="optionsValue"
        :optionsLabel="optionsLabel"
        :placeholder="placeholder"
        @update:modelValue="(value:any) => updateValue(value)"
      >
        <template #append>
          <div class="mt-2">
            <BaseButton
              @click="submitFieldValue(props.fieldKey)"
              icon="check"
              small
              :disabled="Object.keys(errors).length > 0"
            />
            <BaseButton
              icon="times"
              class="ml-2"
              small
              @click="setEditingState({ key: fieldKey, value: false })"
              :disabled="Object.keys(errors).length > 0"
            />
          </div>
        </template>
      </BaseSelect>
    </Form>
  </div>
</template>

<style scoped lang="scss">
.label {
  font-size: 14px;
  font-weight: 600;

  &__icon {
    font-size: 10px;
    margin-top: 4px;
    cursor: pointer;
  }
}

.field {
  &:hover {
    background-color: #2424307c;
    cursor: pointer;
  }
}
</style>
