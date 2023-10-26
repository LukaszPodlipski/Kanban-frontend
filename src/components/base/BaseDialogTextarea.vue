<script setup lang="ts">
import { stringDeepCopy } from '@/utils/functions'
import clonedeep from 'lodash.clonedeep'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { computed, onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  header: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: false,
  },
})

const visible: Ref<boolean> = ref(false)
const inputValue: Ref<string> = ref('')

const resetInputValue = () => {
  inputValue.value = clonedeep(props.modelValue)
}

onMounted(() => {
  resetInputValue()
})

const buttonLabel = computed(() => {
  return props.label || t('actions.open')
})

const openDialog = () => {
  resetInputValue()
  visible.value = true
}

const confirm = () => {
  emit('update:modelValue', stringDeepCopy(inputValue.value))
  inputValue.value = ''
  visible.value = false
}
</script>

<template>
  <div :key="visible.toString()">
    <slot name="trigger" :openDialog="openDialog" />
    <BaseButton
      v-if="!$slots.trigger"
      @click="openDialog"
      :label="buttonLabel"
    />
    <Dialog v-model:visible="visible" modal :header="header">
      <div class="px-4 pt-2 pb-4">
        <Textarea v-model.trim="inputValue" class="w-full" />
        <div class="flex mt-4 justify-content-end">
          <BaseButton @click="confirm" :label="$t('actions.confirm')" icon="check" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
