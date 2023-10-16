<script setup lang="ts">
import { Form } from 'vee-validate'
import { ComponentOptions, ref, nextTick } from 'vue'
import InputText from 'primevue/inputtext'

const emit = defineEmits(['setEditingState', 'updateValue', 'submitValue'])

const props = defineProps({
  value: {
    type: String,
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: [],
  },
  valueKey: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  maxLength: {
    type: Number,
    default: 0,
  },
  component: {
    type: Object as () => ComponentOptions,
    default: InputText,
  },
  medium: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  tooltipConfig: {
    type: Object,
    default: () => ({}),
  },
})

type inputRefType = {
  childRef: any
}

const baseInputRef = ref<inputRefType | null>(null)

// We are setting focus on element when editing is enabled to be able to intercept esc keydown event and close editing
const setEditing = () => {
  emit('setEditingState', { key: props.valueKey, value: true })
  nextTick(() => {
    const setElementFocus = (el: HTMLElement) => {
      el.focus()
      el.click()
    }

    const elementWrapper = baseInputRef.value?.childRef
    const input = elementWrapper.querySelector('input')
    const editor = elementWrapper.querySelector('.p-editor-container')

    if (input) {
      setElementFocus(input)
    } else if (editor) {
      setTimeout(() => {
        const editorInputWrapper = editor.querySelector('.p-editor-content')
        const edytorValueElement = editorInputWrapper.querySelector('.ql-editor')
        setElementFocus(edytorValueElement)
      }, 100)
    }
  })
}
</script>

<template>
  <div
    v-tooltip.bottom="{ ...tooltipConfig, disabled: isEditing }"
    class="dbl-click-input w-full"
    :class="{ 'field-hover': !isEditing && !disabled, 'p-2': !dense }"
    @dblclick="setEditing"
    @keydown.esc.stop="
      $emit('setEditingState', { key: valueKey, value: false })
    "
  >
    <div v-if="!isEditing">
      <span
        v-if="!$slots.default"
        v-html="value"
        :class="{ 'medium-size': medium }"
      />
      <slot></slot>
    </div>
    <Form v-else v-slot="{ errors }">
      <BaseInput
        ref="baseInputRef"
        :component="component"
        :value="value"
        :label="label"
        :placeholder="placeholder"
        :floatLabel="false"
        :rules="rules"
        :maxLength="1000"
        @update:modelValue="(value:string) => $emit('updateValue', { key: valueKey, value })"
      >
        <template #append>
          <div class="mt-1">
            <BaseButton
              @click="$emit('submitValue', valueKey)"
              icon="check"
              small
              :disabled="
                Object.keys(errors).length > 0 || value.length === 0 || disabled
              "
            />
            <BaseButton
              icon="times"
              class="ml-2"
              small
              @click="$emit('setEditingState', { key: valueKey, value: false })"
            /></div></template
      ></BaseInput>
    </Form>
  </div>
</template>

<style scoped lang="scss">
.dbl-click-input {
  font-size: 18px;
  font-weight: 400;
  border-radius: 4px;
}

.field-hover {
  &:hover {
    background-color: #2424307c;
    cursor: pointer;
  }
}

.medium-size {
  font-size: 16px;
  font-weight: 400;
}
</style>
